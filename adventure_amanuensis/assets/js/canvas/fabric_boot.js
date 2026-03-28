// Minimal Fabric canvas boot adapted from Characters & Canvases core/canvas.js.

import { DOSSIER_TEMPLATE } from './sheet_template.js';

export function bootFabricCanvas(canvasNode) {
  if (!window.fabric) {
    throw new Error('Fabric.js not found. Make sure fabric.min.js is loaded before app.bundle.js.');
  }

  canvasNode.width = DOSSIER_TEMPLATE.width;
  canvasNode.height = DOSSIER_TEMPLATE.height;

  const canvas = new fabric.Canvas(canvasNode, {
    backgroundColor: DOSSIER_TEMPLATE.colors.paper,
    selection: false,
    preserveObjectStacking: true
  });

  try { canvas.targetFindTolerance = 8; } catch (_) {}
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.cornerSize = 8;

  canvas.renderOnAddRemove = true;
  canvas.setDimensions({ width: DOSSIER_TEMPLATE.width, height: DOSSIER_TEMPLATE.height });
  canvas.setBackgroundColor(DOSSIER_TEMPLATE.colors.paper, canvas.requestRenderAll.bind(canvas));
  return canvas;
}
