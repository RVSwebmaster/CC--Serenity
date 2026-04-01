import { importCrewFiles } from './crew_import.js';
import { renderDashboard } from './crew_render.js';
import { loadSession, saveSession } from './storage.js';
import {
  advanceTurn,
  clearCrew,
  clearInitiative,
  createSessionState,
  mergeImportedCrew,
  removeCrewMember,
  resetRound,
  setActiveTab,
  updateCrewMember,
  updateShipState
} from './session_state.js';

function describeError(error, fallback = 'Unexpected error.') {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function buildImportMessage(importedCount, rejected) {
  const parts = [];

  if (importedCount > 0) {
    parts.push(`Imported ${importedCount} crew file${importedCount === 1 ? '' : 's'} into the GM console.`);
  }

  if (rejected.length > 0) {
    parts.push(`Skipped ${rejected.length}: ${rejected.map((entry) => `${entry.sourceName}: ${entry.message}`).join(' | ')}`);
  }

  if (parts.length === 0) {
    return {
      text: 'No files were selected.',
      kind: 'warn'
    };
  }

  return {
    text: parts.join(' '),
    kind: rejected.length > 0 ? 'warn' : 'ok'
  };
}

function buildPipelineErrorMessage(stage, error) {
  const label = {
    import: 'Import failed',
    merge: 'Imported crew could not be added to the session',
    persist: 'Imported crew loaded, but session persistence failed',
    render: 'Imported crew loaded, but the dashboard could not rerender'
  }[stage] || 'Import failed';

  return {
    text: `${label}: ${describeError(error)}`,
    kind: 'error'
  };
}

function renderFatalError(root, flash, error) {
  root.innerHTML = '';

  const shell = document.createElement('main');
  shell.className = 'gm-shell';

  const panel = document.createElement('section');
  panel.className = 'gm-topbar gm-main-panel gm-fatal-panel';

  const kicker = document.createElement('p');
  kicker.className = 'gm-kicker';
  kicker.textContent = 'GM Console Error';

  const title = document.createElement('h1');
  title.className = 'gm-title';
  title.textContent = 'GM Amanuensis hit a blocking UI error';

  const copy = document.createElement('p');
  copy.className = 'gm-copy';
  copy.textContent = flash?.text || 'The dashboard could not finish rendering after the latest change.';

  const detail = document.createElement('pre');
  detail.className = 'gm-fatal-detail';
  detail.textContent = describeError(error);

  panel.append(kicker, title, copy, detail);
  shell.append(panel);
  root.append(shell);
}

function updateNestedValue(target, path, value) {
  const [head, ...rest] = path;
  if (!head) return target;
  if (rest.length === 0) {
    target[head] = value;
    return target;
  }
  if (!target[head] || typeof target[head] !== 'object' || Array.isArray(target[head])) {
    target[head] = {};
  }
  updateNestedValue(target[head], rest, value);
  return target;
}

export function bootGMAmanuensis(root = document.getElementById('app')) {
  if (!root) return null;

  let session = createSessionState(loadSession());
  let flash = {
    text: session.crew.length
      ? `Restored ${session.crew.length} crew member${session.crew.length === 1 ? '' : 's'} with initiative, ship state, turn state, and tab colors.`
      : 'Import exported Serenity character JSON files to build your GM console.',
    kind: 'info'
  };

  function persist() {
    saveSession(session);
  }

  function render() {
    try {
      const view = renderDashboard(root, session, flash);
      view.importInput?.addEventListener('change', handleImport);
    } catch (error) {
      renderFatalError(root, buildPipelineErrorMessage('render', error), error);
    }
  }

  async function handleImport(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const results = await importCrewFiles(files);
      let persistError = null;

      if (results.imported.length > 0) {
        try {
          session = mergeImportedCrew(session, results.imported);
        } catch (error) {
          flash = buildPipelineErrorMessage('merge', error);
          event.target.value = '';
          render();
          return;
        }

        try {
          persist();
        } catch (error) {
          persistError = error;
        }
      }

      flash = persistError
        ? buildPipelineErrorMessage('persist', persistError)
        : buildImportMessage(results.imported.length, results.rejected);
    } catch (error) {
      flash = buildPipelineErrorMessage('import', error);
    }
    event.target.value = '';
    render();
  }

  function commit(nextSession, nextFlash = null, options = {}) {
    session = nextSession;
    persist();
    if (nextFlash) {
      flash = nextFlash;
    }
    if (options.render !== false) {
      render();
    }
  }

  function patchCrewMember(memberId, mutator, nextFlash = null, options = {}) {
    commit(updateCrewMember(session, memberId, mutator), nextFlash, options);
  }

  function patchShip(path, value, options = {}) {
    commit(updateShipState(session, (ship) => updateNestedValue(ship, path.split('.'), value)), options.flash || null, {
      render: options.render
    });
  }

  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    const { action, memberId, field, delta, tabId } = trigger.dataset;

    if (action === 'select-tab') {
      commit(setActiveTab(session, tabId || 'gm'), null);
      return;
    }

    if (action === 'advance-turn') {
      commit(advanceTurn(session), {
        text: 'Current turn advanced in initiative order.',
        kind: 'ok'
      });
      return;
    }

    if (action === 'reset-round') {
      commit(resetRound(session), {
        text: 'Round reset. All action states returned to Ready.',
        kind: 'ok'
      });
      return;
    }

    if (action === 'clear-initiative') {
      commit(clearInitiative(session), {
        text: 'Initiative values cleared. Existing tab order was preserved as the new baseline.',
        kind: 'ok'
      });
      return;
    }

    if (action === 'clear-crew') {
      if (!window.confirm('Clear the entire GM session roster and reset the ship board?')) return;
      commit(clearCrew(), {
        text: 'Crew, ship, and Jack state reset cleanly.',
        kind: 'ok'
      });
      return;
    }

    if (action === 'remove-member' && memberId) {
      commit(removeCrewMember(session, memberId), {
        text: 'Crew member removed from the active GM session.',
        kind: 'ok'
      });
      return;
    }

    if (action === 'adjust-condition' && memberId && field) {
      const amount = Number.parseInt(delta || '0', 10);
      patchCrewMember(memberId, (member) => ({
        ...member,
        gm: {
          ...member.gm,
          [field]: Math.max(0, Number.parseInt(member.gm[field] || 0, 10) + amount)
        }
      }));
    }
  });

  root.addEventListener('change', (event) => {
    const target = event.target;
    const action = target.dataset.action;
    const memberId = target.dataset.memberId;
    const field = target.dataset.field;
    const shipField = target.dataset.shipField;

    if (shipField) {
      patchShip(shipField, target.value, { render: false });
      return;
    }

    if (!action || !memberId || !field) return;

    if (action === 'condition-number') {
      patchCrewMember(memberId, (member) => ({
        ...member,
        gm: {
          ...member.gm,
          [field]: Math.max(0, Number.parseInt(target.value || '0', 10) || 0)
        }
      }));
      return;
    }

    if (action === 'condition-select') {
      patchCrewMember(memberId, (member) => ({
        ...member,
        gm: {
          ...member.gm,
          [field]: target.value
        }
      }));
      return;
    }

    if (action === 'initiative-input') {
      patchCrewMember(memberId, (member) => ({
        ...member,
        gm: {
          ...member.gm,
          initiativeValue: target.value
        }
      }), {
        text: 'Initiative updated. Matching totals are silently broken with hidden Agility rolls.',
        kind: 'ok'
      });
    }
  });

  root.addEventListener('input', (event) => {
    const target = event.target;
    const action = target.dataset.action;
    const memberId = target.dataset.memberId;
    const field = target.dataset.field;
    const shipField = target.dataset.shipField;

    if (shipField) {
      patchShip(shipField, target.value, { render: false });
      return;
    }

    if (action === 'initiative-input' && memberId) {
      patchCrewMember(memberId, (member) => ({
        ...member,
        gm: {
          ...member.gm,
          initiativeValue: target.value
        }
      }), null);
      return;
    }

    if (action !== 'condition-note' || !memberId || !field) return;

    commit(updateCrewMember(session, memberId, (member) => ({
      ...member,
      gm: {
        ...member.gm,
        [field]: target.value
      }
    })), null, { render: false });
  });

  render();
  return {
    getSession: () => structuredClone(session)
  };
}

bootGMAmanuensis();
