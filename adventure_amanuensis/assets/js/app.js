// Boot Adventure Amanuensis as a standalone placeholder shell.

import { createSessionState } from './session_state.js';
import { bootFabricCanvas } from './canvas/fabric_boot.js';
import { bindControls } from './ui/controls.js';
import { renderShell } from './ui/shell.js';

export function bootAdventureAmanuensis(root = document.getElementById('app')) {
  if (!root) return null;

  const state = createSessionState();
  const shell = renderShell(root);
  const canvas = bootFabricCanvas(shell.canvasEl);
  bindControls(shell, state, canvas);
  return { shell, state, canvas };
}
