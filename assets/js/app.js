import { HEROIC_LEVEL } from './data/defaults.js';
import { loadState, saveState, clearState, exportState } from './storage.js';
import { ensureCharacterIdentity, encodeCharacterHandoffCode, queueCharacterForGM } from './handoff.js';
import { hydrateCharacter } from './state.js';
import { remainingBudgets, validateCharacter, lifePoints, initiative } from './rules.js';
import { renderWelcomeStep } from './steps/step_welcome.js';
import { renderRoleStep } from './steps/step_role.js';
import { renderBackgroundStep } from './steps/step_background.js';
import { renderAttributesStep } from './steps/step_attributes.js';
import { renderTraitsStep } from './steps/step_traits.js';
import { renderSkillsStep } from './steps/step_skills.js';
import { renderDetailsStep } from './steps/step_details.js';
import { renderReviewStep } from './steps/step_review.js';
import { renderSheetStep } from './steps/step_sheet.js';
import { setMessage } from './ui.js';

const steps = [
  { id: 'welcome', label: '1. Welcome', render: renderWelcomeStep },
  { id: 'role', label: '2. Crew Role', render: renderRoleStep },
  { id: 'background', label: '3. Background', render: renderBackgroundStep },
  { id: 'attributes', label: '4. Attributes', render: renderAttributesStep },
  { id: 'traits', label: '5. Traits', render: renderTraitsStep },
  { id: 'skills', label: '6. Skills', render: renderSkillsStep },
  { id: 'details', label: '7. Gear & Money', render: renderDetailsStep },
  { id: 'review', label: '8. Review', render: renderReviewStep },
  { id: 'sheet', label: '9. Play Sheet', render: renderSheetStep }
];

let state = {
  stepIndex: 0,
  character: hydrateCharacter(loadState())
};

const els = {
  appShell: document.querySelector('.app-shell'),
  stepNav: document.getElementById('stepNav'),
  stepContent: document.getElementById('stepContent'),
  attributePointsRemaining: document.getElementById('attributePointsRemaining'),
  traitPointsRemaining: document.getElementById('traitPointsRemaining'),
  skillPointsRemaining: document.getElementById('skillPointsRemaining'),
  lifePointsValue: document.getElementById('lifePointsValue'),
  initiativeValue: document.getElementById('initiativeValue'),
  backBtn: document.getElementById('backBtn'),
  nextBtn: document.getElementById('nextBtn'),
  saveBtn: document.getElementById('saveBtn'),
  exportBtn: document.getElementById('exportBtn'),
  sendToGMBtn: document.getElementById('sendToGMBtn'),
  copyGMCodeBtn: document.getElementById('copyGMCodeBtn'),
  importInput: document.getElementById('importInput'),
  resetBtn: document.getElementById('resetBtn'),
  printBtn: document.getElementById('printBtn'),
  messageBar: document.getElementById('messageBar')
};

[
  els.attributePointsRemaining,
  els.traitPointsRemaining,
  els.skillPointsRemaining
].forEach((node) => node.parentElement.classList.add('build-counter-card'));

function captureInputFocus(root) {
  const active = document.activeElement;
  if (!active || !root.contains(active)) return null;
  if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return null;

  const path = [];
  let node = active;
  while (node && node !== root) {
    const parent = node.parentElement;
    if (!parent) return null;
    path.unshift(Array.from(parent.children).indexOf(node));
    node = parent;
  }
  if (node !== root) return null;

  const snapshot = {
    path,
    tagName: active.tagName,
    value: active.value
  };

  if (typeof active.selectionStart === 'number' && typeof active.selectionEnd === 'number') {
    snapshot.selectionStart = active.selectionStart;
    snapshot.selectionEnd = active.selectionEnd;
    snapshot.selectionDirection = active.selectionDirection || 'none';
  }

  if (typeof active.scrollTop === 'number') {
    snapshot.scrollTop = active.scrollTop;
  }

  return snapshot;
}

function restoreInputFocus(root, snapshot) {
  if (!snapshot) return;

  let node = root;
  for (const index of snapshot.path) {
    node = node?.children?.[index];
    if (!node) return;
  }

  if (!node || node.tagName !== snapshot.tagName) return;
  if ('value' in node && node.value !== snapshot.value) return;

  node.focus({ preventScroll: true });

  if (typeof snapshot.scrollTop === 'number' && typeof node.scrollTop === 'number') {
    node.scrollTop = snapshot.scrollTop;
  }

  if (typeof node.setSelectionRange === 'function' && typeof snapshot.selectionStart === 'number' && typeof snapshot.selectionEnd === 'number') {
    node.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd, snapshot.selectionDirection);
  }
}

function attributeStepIsValid(computed) {
  return computed.budgets.attributes === 0 && !computed.errors.some((error) =>
    error.startsWith('Assign all Attributes before the build can be finished.')
    || error.startsWith('Attribute Points must spend exactly')
  );
}

function blockInvalidAttributeAdvance() {
  setMessage(els.messageBar, 'Finish Step 4 first: assign all six Attributes and spend exactly 42 points before moving on.', 'warn');
}

function compute() {
  const validation = validateCharacter(state.character);
  return {
    ...validation,
    budgets: remainingBudgets(state.character),
    lifePoints: lifePoints(state.character),
    initiative: initiative(state.character)
  };
}

function updateStatus(computed) {
  els.attributePointsRemaining.textContent = computed.budgets.attributes;
  els.traitPointsRemaining.textContent = computed.budgets.traits;
  els.skillPointsRemaining.textContent = computed.budgets.skills;
  els.lifePointsValue.textContent = computed.lifePoints;
  els.initiativeValue.textContent = computed.initiative;

  for (const [key, value, node] of [
    ['attributes', computed.budgets.attributes, els.attributePointsRemaining],
    ['traits', computed.budgets.traits, els.traitPointsRemaining],
    ['skills', computed.budgets.skills, els.skillPointsRemaining]
  ]) {
    node.parentElement.style.borderColor = value < 0 || (key === 'attributes' && value !== 0) ? 'var(--danger)' : 'var(--line)';
  }
}

function renderNav(computed) {
  els.stepNav.innerHTML = '';
  steps.forEach((step, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = step.label;
    if (index === state.stepIndex) button.classList.add('active');
    if (step.id === 'sheet' && !computed.valid) button.classList.add('invalid');
    button.addEventListener('click', () => {
      if (steps[state.stepIndex].id === 'attributes' && index > state.stepIndex && !attributeStepIsValid(computed)) {
        blockInvalidAttributeAdvance();
        return;
      }
      state.stepIndex = index;
      render();
    });
    els.stepNav.append(button);
  });
}

function mutateCharacter(mutator) {
  const draft = structuredClone(state.character);
  mutator(draft);
  draft.meta.lastUpdated = new Date().toISOString();
  state.character = draft;
  saveState(state.character);
  render({ preserveFocus: true });
}

function ensureTrackedCharacter() {
  const tracked = ensureCharacterIdentity(state.character);
  if (tracked.meta.characterId !== state.character.meta?.characterId) {
    tracked.meta.lastUpdated = new Date().toISOString();
    state.character = tracked;
    saveState(state.character);
  }
  return tracked;
}

async function copyTextWithFallback(value) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(value);
    return true;
  }

  const helper = document.createElement('textarea');
  helper.value = value;
  helper.setAttribute('readonly', 'readonly');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  helper.style.pointerEvents = 'none';
  document.body.append(helper);
  helper.select();
  helper.setSelectionRange(0, helper.value.length);

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    helper.remove();
  }
  return copied;
}

async function handleCopyGMCode() {
  const tracked = ensureTrackedCharacter();
  const handoffCode = encodeCharacterHandoffCode(tracked);

  try {
    const copied = await copyTextWithFallback(handoffCode);
    if (!copied) throw new Error('copy command was not accepted');
    setMessage(els.messageBar, 'GM handoff code copied. If the GM is on another device or there is no network, paste it into GM Amanuensis.', 'ok');
  } catch (error) {
    window.prompt('Copy this Serenity GM handoff code for the GM:', handoffCode);
    setMessage(els.messageBar, 'Clipboard access was blocked, so the handoff code was opened for manual copy.', 'warn');
  }
}

function handleSendToGM() {
  const tracked = ensureTrackedCharacter();
  const handoff = queueCharacterForGM(tracked);
  setMessage(
    els.messageBar,
    `${handoff.summary.name} is queued for GM Amanuensis. If the GM app is open in this browser, it will import automatically. Use "Copy GM Handoff Code" for another device or an offline table.`,
    'ok'
  );
}

function renderStep(computed) {
  els.stepContent.innerHTML = '';
  const current = steps[state.stepIndex];
  const stepState = { character: state.character, computed, heroicLevel: HEROIC_LEVEL };
  const node = current.render(stepState, mutateCharacter);
  els.stepContent.append(node);
}

function render(options = {}) {
  const focusSnapshot = options.preserveFocus ? captureInputFocus(els.stepContent) : null;
  const computed = compute();
  updateStatus(computed);
  renderNav(computed);
  renderStep(computed);
  restoreInputFocus(els.stepContent, focusSnapshot);

  const current = steps[state.stepIndex];
  const isPlaySheetMode = current.id === 'sheet';
  els.appShell.classList.toggle('play-sheet-mode', isPlaySheetMode);
  els.backBtn.disabled = state.stepIndex === 0;
  if (current.id === 'review') {
    els.nextBtn.textContent = 'Open Play Sheet';
  } else if (current.id === 'sheet') {
    els.nextBtn.textContent = 'Export Character JSON';
  } else {
    els.nextBtn.textContent = 'Next';
  }
  els.nextBtn.disabled = current.id === 'sheet' ? false : state.stepIndex === steps.length - 1;

  els.printBtn.style.visibility = current.id === 'sheet' ? 'visible' : 'hidden';

  if (current.id === 'sheet') {
    setMessage(els.messageBar, '');
  } else if (current.id === 'review') {
    setMessage(els.messageBar, computed.valid ? 'Math looks good. Review the story pieces, then open the play sheet.' : 'The review step is showing you what still needs fixing before the sheet is fully ready.', computed.valid ? 'ok' : 'warn');
  } else {
    setMessage(els.messageBar, '');
  }
}

els.backBtn.addEventListener('click', () => {
  if (state.stepIndex > 0) {
    state.stepIndex -= 1;
    render();
  }
});

els.nextBtn.addEventListener('click', () => {
  if (steps[state.stepIndex].id === 'sheet') {
    exportState(state.character);
    return;
  }
  if (state.stepIndex < steps.length - 1) {
    const computed = compute();
    if (steps[state.stepIndex].id === 'attributes' && !attributeStepIsValid(computed)) {
      blockInvalidAttributeAdvance();
      return;
    }
    state.stepIndex += 1;
    render();
  }
});

els.saveBtn.addEventListener('click', () => {
  saveState(state.character);
  setMessage(els.messageBar, 'Character saved locally in this browser.', 'ok');
});

els.exportBtn.addEventListener('click', () => exportState(state.character));
els.sendToGMBtn.addEventListener('click', handleSendToGM);
els.copyGMCodeBtn.addEventListener('click', handleCopyGMCode);

els.importInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    state.character = hydrateCharacter(parsed);
    state.stepIndex = 0;
    saveState(state.character);
    render();
    setMessage(els.messageBar, 'Character loaded from JSON.', 'ok');
  } catch (error) {
    setMessage(els.messageBar, 'Could not load that JSON file. Check the file format and try again.', 'warn');
  } finally {
    event.target.value = '';
  }
});

els.resetBtn.addEventListener('click', () => {
  if (!confirm('Start a new character and wipe the current local saved character?')) return;
  clearState();
  state.character = hydrateCharacter(null);
  state.stepIndex = 0;
  render();
  setMessage(els.messageBar, 'Started a new character. Save or export when this handoff is ready.', 'ok');
});

els.printBtn.addEventListener('click', () => {
  if (state.stepIndex !== steps.length - 1) state.stepIndex = steps.length - 1;
  render();
  window.print();
});

function initSplashScreen() {
  const splash = document.getElementById('splashScreen');
  if (!splash) return;
  const splashVideo = splash.querySelector('[data-splash-video]');

  document.body.classList.add('splash-active');

  if (splashVideo) {
    try {
      const playAttempt = splashVideo.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => {});
      }
    } catch (error) {}
  }

  window.setTimeout(() => {
    if (splashVideo) splashVideo.pause();
    splash.classList.add('is-hiding');
    document.body.classList.remove('splash-active');

    window.setTimeout(() => {
      if (typeof splash.remove === 'function') splash.remove();
      else if (splash.parentNode) splash.parentNode.removeChild(splash);
    }, 850);
  }, 8000);
}

render();
initSplashScreen();
