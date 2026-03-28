// Render the standalone Adventure Amanuensis placeholder shell.

function node(tag, options = {}, children = []) {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  if (options.html !== undefined) element.innerHTML = options.html;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => element.setAttribute(key, value));
  }
  if (!Array.isArray(children)) children = [children];
  children.filter(Boolean).forEach((child) => element.append(child));
  return element;
}

export function renderShell(root) {
  root.innerHTML = '';

  const fileInput = node('input', {
    attrs: { type: 'file', accept: 'application/json,.json', hidden: 'hidden' }
  });
  const importButton = node('button', { text: 'Import Dossier', attrs: { type: 'button' } });
  const demoButton = node('button', { text: 'Load Example Dossier', className: 'secondary', attrs: { type: 'button' } });
  const status = node('p', { className: 'amanuensis-status', text: 'Import a dossier JSON file to inspect the handoff payload.' });
  const canvasEl = node('canvas', {
    attrs: { width: '850', height: '1100', 'aria-label': 'Rendered dossier canvas' }
  });
  const canvasShell = node('section', { className: 'canvas-shell' }, [
    node('div', { className: 'canvas-intro', text: 'Load a dossier to render the first fixed Amanuensis page.' }),
    node('div', { className: 'canvas-stage' }, [
      node('div', { className: 'canvas-frame' }, [canvasEl])
    ])
  ]);
  const debug = node('section', { className: 'debug-shell' }, [
    node('div', { className: 'debug-intro', text: 'No dossier loaded yet.' })
  ]);
  const debugDetails = node('details', { className: 'debug-details' }, [
    node('summary', { text: 'Developer Debug View' }),
    debug
  ]);

  const shell = node('main', { className: 'amanuensis-shell' }, [
    node('section', { className: 'amanuensis-hero' }, [
      node('div', { className: 'amanuensis-copy' }, [
        node('h1', { text: 'Adventure Amanuensis, Serenity Edition' }),
        node('p', { text: 'Standalone placeholder shell for dossier import, schema handoff, and future play-session tooling.' }),
        node('p', { text: 'This pass only proves the landing screen, file import flow, and debug inspection of incoming dossier data.' }),
        node('div', { className: 'amanuensis-actions' }, [importButton, demoButton, fileInput]),
        status
      ]),
      node('img', {
        className: 'amanuensis-art',
        attrs: {
          src: '../assets/img/character-crucible-serenity-edition.png',
          alt: 'Character Crucible, Serenity Edition splash art'
        }
      })
    ]),
    canvasShell,
    debugDetails
  ]);

  root.append(shell);

  return {
    root,
    fileInput,
    importButton,
    demoButton,
    status,
    canvasEl,
    canvasShell,
    debug,
    debugDetails
  };
}
