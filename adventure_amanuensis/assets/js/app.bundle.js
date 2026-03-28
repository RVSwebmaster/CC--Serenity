// Standalone runtime bundle for Adventure Amanuensis.
// Keeps the local file:// launch path working without a build step.

(() => {
  const DOSSIER_TEMPLATE = {
    width: 850,
    height: 1100,
    margin: 42,
    gutter: 18,
    colors: {
      paper: '#f7f0e3',
      ink: '#20160f',
      line: '#b49373',
      panel: '#fcf8f1',
      accent: '#8a542d',
      muted: '#5f4f43'
    }
  };

  const DOSSIER_SECTION_ORDER = [
    'schema',
    'schemaVersion',
    'identity',
    'attributes',
    'traits',
    'skills',
    'derived',
    'finances',
    'gear',
    'trackers',
    'notes'
  ];

  const EXAMPLE_DOSSIER = {
    schema: 'adventure_amanuensis_character',
    schemaVersion: '0.1.0',
    identity: {
      name: 'Mae Rourke',
      concept: 'Dockside mechanic turned desperate spacer',
      role: 'Mechanic / Engineer',
      roleSkill: 'Mechanical Engineering',
      homeworld: 'Persephone'
    },
    attributes: {
      Agility: 'd6',
      Strength: 'd6',
      Vitality: 'd8',
      Alertness: 'd8',
      Intelligence: 'd10',
      Willpower: 'd4'
    },
    traits: {
      assets: [
        { name: 'Talented', rating: 'd2', notes: 'Mechanical Engineering' }
      ],
      complications: [
        { name: 'Dead Broke', rating: 'd2', notes: 'Always one bill behind.' }
      ]
    },
    skills: {
      'Mechanical Engineering': {
        general: 'd6',
        specialties: [{ name: 'Repair', rating: 'd10' }]
      },
      Craft: {
        general: 'd6',
        specialties: [{ name: 'Cooking', rating: 'd12' }]
      }
    },
    derived: {
      lifePoints: 12,
      initiative: 'd6 + d8',
      endurance: 'd8 + d4'
    },
    finances: {
      currentCredits: 623.5,
      platinum: 0,
      moneyNotes: 'Tool debt still hanging over the next port.'
    },
    gear: {
      purchased: [{ name: 'Toolkit', credits: 40, availability: 'E' }],
      additional: 'Patched coat, deck wrench, flashlight'
    },
    trackers: {
      stun: 1,
      wounds: 0
    },
    notes: {
      crewValue: 'Keeps the boat running.',
      crewConnection: 'Owes the captain for a bad dock job.',
      crewMotivation: 'Trying to stay one jump ahead of creditors.'
    }
  };

  function createSessionState() {
    return {
      dossier: null,
      source: '',
      error: '',
      loadedAt: null,
      renderMode: 'splash',
      canvas: null
    };
  }

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

  function renderShell(root) {
    root.innerHTML = '';

    const fileInput = node('input', {
      attrs: { type: 'file', accept: 'application/json,.json', hidden: 'hidden' }
    });
    const importButton = node('button', { text: 'Import Dossier', attrs: { type: 'button' } });
    const demoButton = node('button', { text: 'Load Example Dossier', className: 'secondary', attrs: { type: 'button' } });
    const status = node('p', { className: 'amanuensis-status', text: 'Import a dossier JSON file to inspect the handoff payload.' });
    const canvasEl = node('canvas', {
      attrs: { width: String(DOSSIER_TEMPLATE.width), height: String(DOSSIER_TEMPLATE.height), 'aria-label': 'Rendered dossier canvas' }
    });
    const canvasIntro = node('div', { className: 'canvas-intro', text: 'Load a dossier to render the first fixed Amanuensis page.' });
    const canvasShell = node('section', { className: 'canvas-shell' }, [
      canvasIntro,
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
          node('p', { text: 'This pass proves the landing screen, local dossier import flow, and a first fixed rendered dossier page.' }),
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
      canvasIntro,
      canvasShell,
      debug,
      debugDetails
    };
  }

  function parseDossier(raw) {
    return JSON.parse(raw);
  }

  function getDossierSections(dossier = {}) {
    return DOSSIER_SECTION_ORDER
      .map((key) => ({ key, value: dossier[key] }))
      .filter((entry) => entry.value !== undefined);
  }

  function bootFabricCanvas(canvasNode) {
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

  function box(canvas, left, top, width, height, options = {}) {
    canvas.add(new fabric.Rect({
      left,
      top,
      width,
      height,
      fill: options.fill || DOSSIER_TEMPLATE.colors.panel,
      stroke: DOSSIER_TEMPLATE.colors.line,
      strokeWidth: options.strokeWidth || 1,
      rx: options.rx || 8,
      ry: options.ry || 8,
      selectable: false,
      evented: false
    }));
  }

  function text(canvas, value, left, top, options = {}) {
    const item = new fabric.Textbox(String(value || ''), {
      left,
      top,
      width: options.width || 200,
      fontSize: options.fontSize || 14,
      fontFamily: options.fontFamily || 'Georgia',
      fontWeight: options.fontWeight || 'normal',
      fill: options.fill || DOSSIER_TEMPLATE.colors.ink,
      lineHeight: options.lineHeight || 1.2,
      selectable: false,
      evented: false
    });
    canvas.add(item);
    return item;
  }

  function sectionHeader(canvas, title, left, top, width) {
    text(canvas, title, left, top, {
      width,
      fontSize: 14,
      fontWeight: 'bold',
      fill: DOSSIER_TEMPLATE.colors.accent
    });
  }

  function formatList(list = [], formatter) {
    if (!Array.isArray(list) || !list.length) return '-';
    return list.map(formatter).join('\n');
  }

  function formatTraits(traits = {}) {
    const assets = formatList(traits.assets, (item) => `${item.name || 'Unnamed'} ${item.rating || ''}${item.notes ? ` - ${item.notes}` : ''}`);
    const complications = formatList(traits.complications, (item) => `${item.name || 'Unnamed'} ${item.rating || ''}${item.notes ? ` - ${item.notes}` : ''}`);
    return `Assets\n${assets}\n\nComplications\n${complications}`;
  }

  function formatSkills(skills = {}) {
    const entries = Object.entries(skills);
    if (!entries.length) return '-';
    return entries.map(([name, skill]) => {
      const general = skill.general || skill.generalRating || 'none';
      const specialties = Array.isArray(skill.specialties) && skill.specialties.length
        ? ` | ${skill.specialties.map((item) => `${item.name || item.label || 'Unnamed'} ${item.rating || ''}`.trim()).join(', ')}`
        : '';
      return `${name}: ${general}${specialties}`;
    }).join('\n');
  }

  function formatAttributes(attributes = {}) {
    const order = ['Agility', 'Strength', 'Vitality', 'Alertness', 'Intelligence', 'Willpower'];
    return order.map((name) => `${name}: ${attributes[name] || '-'}`).join('\n');
  }

  function formatKeyValues(data = {}) {
    const entries = Object.entries(data || {});
    if (!entries.length) return '-';
    return entries.map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`).join('\n');
  }

  function formatGear(gear = {}) {
    const purchased = Array.isArray(gear.purchased) && gear.purchased.length
      ? gear.purchased.map((item) => `${item.name || 'Unnamed'}${item.credits !== undefined ? ` (${item.credits} cr)` : ''}`).join('\n')
      : '-';
    const additional = gear.additional || '-';
    return `Purchased\n${purchased}\n\nAdditional\n${additional}`;
  }

  function drawPageFrame(canvas) {
    box(canvas, 18, 18, DOSSIER_TEMPLATE.width - 36, DOSSIER_TEMPLATE.height - 36, {
      fill: DOSSIER_TEMPLATE.colors.paper,
      strokeWidth: 2,
      rx: 10,
      ry: 10
    });
  }

  function renderDossierPage(canvas, dossier = {}) {
    const margin = DOSSIER_TEMPLATE.margin;
    const gutter = DOSSIER_TEMPLATE.gutter;
    const colWidth = (DOSSIER_TEMPLATE.width - (margin * 2) - gutter) / 2;

    canvas.clear();
    canvas.setBackgroundColor(DOSSIER_TEMPLATE.colors.paper, canvas.requestRenderAll.bind(canvas));
    drawPageFrame(canvas);

    const identity = dossier.identity || {};
    const notes = dossier.notes || {};

    text(canvas, identity.name || 'Unnamed Character', margin, margin, {
      width: DOSSIER_TEMPLATE.width - (margin * 2),
      fontSize: 28,
      fontWeight: 'bold'
    });
    text(canvas, identity.concept || 'No concept provided.', margin, margin + 36, {
      width: DOSSIER_TEMPLATE.width - (margin * 2),
      fontSize: 16,
      fill: DOSSIER_TEMPLATE.colors.muted
    });

    box(canvas, margin, margin + 84, DOSSIER_TEMPLATE.width - (margin * 2), 86);
    sectionHeader(canvas, 'Crew Identity', margin + 14, margin + 96, DOSSIER_TEMPLATE.width - (margin * 2) - 28);
    text(
      canvas,
      `Role: ${identity.role || '-'}\nRole Skill: ${identity.roleSkill || '-'}\nHomeworld: ${identity.homeworld || '-'}`,
      margin + 14,
      margin + 118,
      { width: 250 }
    );
    text(
      canvas,
      `Background: ${identity.background || notes.background || '-'}\nCrew Hooks: ${notes.crewValue || '-'}\nConnection: ${notes.crewConnection || '-'}`,
      margin + 280,
      margin + 118,
      { width: DOSSIER_TEMPLATE.width - (margin * 2) - 294, fontSize: 13 }
    );

    const row1Top = margin + 188;
    box(canvas, margin, row1Top, colWidth, 170);
    sectionHeader(canvas, 'Attributes', margin + 14, row1Top + 12, colWidth - 28);
    text(canvas, formatAttributes(dossier.attributes), margin + 14, row1Top + 36, { width: colWidth - 28, fontSize: 15, lineHeight: 1.35 });

    box(canvas, margin + colWidth + gutter, row1Top, colWidth, 170);
    sectionHeader(canvas, 'Derived Rolls', margin + colWidth + gutter + 14, row1Top + 12, colWidth - 28);
    text(canvas, formatKeyValues(dossier.derived), margin + colWidth + gutter + 14, row1Top + 36, { width: colWidth - 28, fontSize: 13, lineHeight: 1.32 });

    const row2Top = row1Top + 188;
    box(canvas, margin, row2Top, colWidth, 250);
    sectionHeader(canvas, 'Traits', margin + 14, row2Top + 12, colWidth - 28);
    text(canvas, formatTraits(dossier.traits), margin + 14, row2Top + 36, { width: colWidth - 28, fontSize: 12, lineHeight: 1.28 });

    box(canvas, margin + colWidth + gutter, row2Top, colWidth, 250);
    sectionHeader(canvas, 'Skills & Specialties', margin + colWidth + gutter + 14, row2Top + 12, colWidth - 28);
    text(canvas, formatSkills(dossier.skills), margin + colWidth + gutter + 14, row2Top + 36, { width: colWidth - 28, fontSize: 12, lineHeight: 1.28 });

    const row3Top = row2Top + 268;
    box(canvas, margin, row3Top, colWidth, 170);
    sectionHeader(canvas, 'Finances', margin + 14, row3Top + 12, colWidth - 28);
    text(canvas, formatKeyValues(dossier.finances), margin + 14, row3Top + 36, { width: colWidth - 28, fontSize: 13, lineHeight: 1.32 });

    box(canvas, margin + colWidth + gutter, row3Top, colWidth, 170);
    sectionHeader(canvas, 'Trackers', margin + colWidth + gutter + 14, row3Top + 12, colWidth - 28);
    text(canvas, formatKeyValues(dossier.trackers), margin + colWidth + gutter + 14, row3Top + 36, { width: colWidth - 28, fontSize: 13, lineHeight: 1.32 });

    const row4Top = row3Top + 188;
    box(canvas, margin, row4Top, DOSSIER_TEMPLATE.width - (margin * 2), 238);
    sectionHeader(canvas, 'Gear & Notes', margin + 14, row4Top + 12, DOSSIER_TEMPLATE.width - (margin * 2) - 28);
    text(canvas, formatGear(dossier.gear), margin + 14, row4Top + 36, { width: 330, fontSize: 12, lineHeight: 1.28 });
    text(canvas, `Notes\n${formatKeyValues(dossier.notes)}`, margin + 364, row4Top + 36, {
      width: DOSSIER_TEMPLATE.width - (margin * 2) - 378,
      fontSize: 12,
      lineHeight: 1.28
    });

    canvas.requestRenderAll();
  }

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
    shell.canvasIntro.textContent = 'Rendered first-pass dossier page from the imported handoff data.';
    renderDossierPage(state.canvas, dossier);
    renderDebug(shell, dossier);
  }

  function applyError(shell, state, error) {
    state.error = error.message || String(error);
    shell.status.textContent = `Import failed: ${state.error}`;
  }

  function bindControls(shell, state) {
    shell.importButton.addEventListener('click', () => {
      shell.fileInput.click();
    });

    shell.fileInput.addEventListener('change', async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      try {
        const raw = await file.text();
        const dossier = parseDossier(raw);
        applyDossier(shell, state, dossier, file.name);
      } catch (error) {
        applyError(shell, state, error);
      } finally {
        shell.fileInput.value = '';
      }
    });

    shell.demoButton.addEventListener('click', () => {
      try {
        applyDossier(shell, state, structuredClone(EXAMPLE_DOSSIER), 'example dossier');
      } catch (error) {
        applyError(shell, state, error);
      }
    });
  }

  function bootAdventureAmanuensis() {
    const root = document.getElementById('app');
    if (!root) return null;

    const state = createSessionState();
    const shell = renderShell(root);
    state.canvas = bootFabricCanvas(shell.canvasEl);
    bindControls(shell, state);
    return { state, shell };
  }

  bootAdventureAmanuensis();
})();
