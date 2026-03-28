// Static dossier renderer for the first-pass Adventure Amanuensis page.

import { DOSSIER_TEMPLATE } from './sheet_template.js';

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
  const node = new fabric.Textbox(String(value || ''), {
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
  canvas.add(node);
  return node;
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
  if (!Array.isArray(list) || !list.length) return '—';
  return list.map(formatter).join('\n');
}

function formatTraits(traits = {}) {
  const assets = formatList(traits.assets, (item) => `${item.name || 'Unnamed'} ${item.rating || ''}${item.notes ? ` — ${item.notes}` : ''}`);
  const complications = formatList(traits.complications, (item) => `${item.name || 'Unnamed'} ${item.rating || ''}${item.notes ? ` — ${item.notes}` : ''}`);
  return `Assets\n${assets}\n\nComplications\n${complications}`;
}

function formatSkills(skills = {}) {
  const entries = Object.entries(skills);
  if (!entries.length) return '—';
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
  return order.map((name) => `${name}: ${attributes[name] || '—'}`).join('\n');
}

function formatKeyValues(data = {}) {
  const entries = Object.entries(data || {});
  if (!entries.length) return '—';
  return entries.map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`).join('\n');
}

function formatGear(gear = {}) {
  const purchased = Array.isArray(gear.purchased) && gear.purchased.length
    ? gear.purchased.map((item) => `${item.name || 'Unnamed'}${item.credits !== undefined ? ` (${item.credits} cr)` : ''}`).join('\n')
    : '—';
  const additional = gear.additional || '—';
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

export function renderDossierPage(canvas, dossier = {}) {
  const m = DOSSIER_TEMPLATE.margin;
  const g = DOSSIER_TEMPLATE.gutter;
  const colWidth = (DOSSIER_TEMPLATE.width - (m * 2) - g) / 2;

  canvas.clear();
  canvas.setBackgroundColor(DOSSIER_TEMPLATE.colors.paper, canvas.requestRenderAll.bind(canvas));
  drawPageFrame(canvas);

  const identity = dossier.identity || {};
  const notes = dossier.notes || {};

  text(canvas, identity.name || 'Unnamed Character', m, m, {
    width: DOSSIER_TEMPLATE.width - (m * 2),
    fontSize: 28,
    fontWeight: 'bold'
  });
  text(canvas, identity.concept || 'No concept provided.', m, m + 36, {
    width: DOSSIER_TEMPLATE.width - (m * 2),
    fontSize: 16,
    fill: DOSSIER_TEMPLATE.colors.muted
  });

  box(canvas, m, m + 84, DOSSIER_TEMPLATE.width - (m * 2), 86);
  sectionHeader(canvas, 'Crew Identity', m + 14, m + 96, DOSSIER_TEMPLATE.width - (m * 2) - 28);
  text(
    canvas,
    `Role: ${identity.role || '—'}\nRole Skill: ${identity.roleSkill || '—'}\nHomeworld: ${identity.homeworld || '—'}`,
    m + 14,
    m + 118,
    { width: 250 }
  );
  text(
    canvas,
    `Background: ${identity.background || notes.background || '—'}\nCrew Hooks: ${notes.crewValue || '—'}\nConnection: ${notes.crewConnection || '—'}`,
    m + 280,
    m + 118,
    { width: DOSSIER_TEMPLATE.width - (m * 2) - 294, fontSize: 13 }
  );

  const row1Top = m + 188;
  box(canvas, m, row1Top, colWidth, 170);
  sectionHeader(canvas, 'Attributes', m + 14, row1Top + 12, colWidth - 28);
  text(canvas, formatAttributes(dossier.attributes), m + 14, row1Top + 36, { width: colWidth - 28, fontSize: 15, lineHeight: 1.35 });

  box(canvas, m + colWidth + g, row1Top, colWidth, 170);
  sectionHeader(canvas, 'Derived Rolls', m + colWidth + g + 14, row1Top + 12, colWidth - 28);
  text(canvas, formatKeyValues(dossier.derived), m + colWidth + g + 14, row1Top + 36, { width: colWidth - 28, fontSize: 13, lineHeight: 1.32 });

  const row2Top = row1Top + 188;
  box(canvas, m, row2Top, colWidth, 250);
  sectionHeader(canvas, 'Traits', m + 14, row2Top + 12, colWidth - 28);
  text(canvas, formatTraits(dossier.traits), m + 14, row2Top + 36, { width: colWidth - 28, fontSize: 12, lineHeight: 1.28 });

  box(canvas, m + colWidth + g, row2Top, colWidth, 250);
  sectionHeader(canvas, 'Skills & Specialties', m + colWidth + g + 14, row2Top + 12, colWidth - 28);
  text(canvas, formatSkills(dossier.skills), m + colWidth + g + 14, row2Top + 36, { width: colWidth - 28, fontSize: 12, lineHeight: 1.28 });

  const row3Top = row2Top + 268;
  box(canvas, m, row3Top, colWidth, 170);
  sectionHeader(canvas, 'Finances', m + 14, row3Top + 12, colWidth - 28);
  text(canvas, formatKeyValues(dossier.finances), m + 14, row3Top + 36, { width: colWidth - 28, fontSize: 13, lineHeight: 1.32 });

  box(canvas, m + colWidth + g, row3Top, colWidth, 170);
  sectionHeader(canvas, 'Trackers', m + colWidth + g + 14, row3Top + 12, colWidth - 28);
  text(canvas, formatKeyValues(dossier.trackers), m + colWidth + g + 14, row3Top + 36, { width: colWidth - 28, fontSize: 13, lineHeight: 1.32 });

  const row4Top = row3Top + 188;
  box(canvas, m, row4Top, DOSSIER_TEMPLATE.width - (m * 2), 238);
  sectionHeader(canvas, 'Gear & Notes', m + 14, row4Top + 12, DOSSIER_TEMPLATE.width - (m * 2) - 28);
  text(canvas, formatGear(dossier.gear), m + 14, row4Top + 36, { width: 330, fontSize: 12, lineHeight: 1.28 });
  text(canvas, `Notes\n${formatKeyValues(dossier.notes)}`, m + 364, row4Top + 36, { width: DOSSIER_TEMPLATE.width - (m * 2) - 378, fontSize: 12, lineHeight: 1.28 });

  canvas.requestRenderAll();
}
