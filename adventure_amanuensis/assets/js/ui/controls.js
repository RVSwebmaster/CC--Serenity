// Bind dossier import controls and render a debug view for the placeholder shell.

import { getDossierSections, importDossierFile, loadExampleDossier } from '../import_dossier.js';
import { renderDossierPage } from '../canvas/sheet_render.js';

function formatValue(value) {
  return JSON.stringify(value, null, 2);
}

function renderDebug(shell, dossier) {
  const sections = getDossierSections(dossier);
  shell.debug.innerHTML = '';

  if (!sections.length) {
    shell.debug.append(Object.assign(document.createElement('div'), {
      className: 'debug-intro',
      textContent: 'Dossier loaded, but no known debug sections were present.'
    }));
    return;
  }

  const intro = document.createElement('div');
  intro.className = 'debug-intro';
  intro.textContent = 'Parsed dossier debug view. This is a truthful inspection panel, not a rendered sheet.';

  const grid = document.createElement('div');
  grid.className = 'debug-grid';

  sections.forEach(({ key, value }) => {
    const card = document.createElement('section');
    card.className = 'debug-card';

    const title = document.createElement('h2');
    title.textContent = key;

    const pre = document.createElement('pre');
    pre.textContent = formatValue(value);

    card.append(title, pre);
    grid.append(card);
  });

  shell.debug.append(intro, grid);
}

function applyDossier(shell, state, dossier, sourceLabel) {
  state.dossier = dossier;
  state.source = sourceLabel;
  state.error = '';
  state.loadedAt = new Date().toISOString();
  state.renderMode = 'canvas';
  shell.status.textContent = `Loaded dossier from ${sourceLabel}.`;
  shell.canvasShell.querySelector('.canvas-intro').textContent = 'Rendered first-pass dossier page from the imported handoff data.';
  renderDossierPage(state.canvas, dossier);
  renderDebug(shell, dossier);
}

function applyError(shell, state, error) {
  state.error = error.message || String(error);
  shell.status.textContent = `Import failed: ${state.error}`;
}

export function bindControls(shell, state, canvas) {
  state.canvas = canvas;

  shell.importButton.addEventListener('click', () => {
    shell.fileInput.click();
  });

  shell.fileInput.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dossier = await importDossierFile(file);
      applyDossier(shell, state, dossier, file.name);
    } catch (error) {
      applyError(shell, state, error);
    } finally {
      shell.fileInput.value = '';
    }
  });

  shell.demoButton.addEventListener('click', async () => {
    try {
      const dossier = await loadExampleDossier();
      applyDossier(shell, state, dossier, 'example dossier');
    } catch (error) {
      applyError(shell, state, error);
    }
  });
}
