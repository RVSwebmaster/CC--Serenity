import { ATTRIBUTE_LIST, PLOT_POINT_MAX } from '../data/defaults.js';
import { getPurchasedGearTotal } from '../data/equipment.js';
import { calculateCurrentCredits, formatMoney } from '../data/gear_packages.js';
import { resolveRoleLabel } from '../data/roles.js';
import { getSpecialtyDisplayName } from '../data/specialties.js';
import { effectiveGeneralRating, isAssignedAttributeDie } from '../rules.js';
import { el } from '../ui.js';

let damageDrawerOpen = false;

function textOrFallback(value, fallback = '-') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function clampTrackerValue(value, max) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(max, parsed));
}

function renderCopyBlock(label, value, fallback = '-') {
  return el('div', { cls: 'sheet-copy-block' }, [
    el('span', { cls: 'sheet-copy-label', text: label }),
    el('p', { cls: 'sheet-copy', text: textOrFallback(value, fallback) })
  ]);
}

function renderMetaRow(label, value, options = {}) {
  return el('div', { cls: 'sheet-meta-row' }, [
    el('span', { cls: 'sheet-meta-label', text: label }),
    el('strong', { cls: 'sheet-meta-value', text: textOrFallback(value, options.fallback || '-') }),
    options.note ? el('small', { cls: 'muted', text: options.note }) : null
  ]);
}

function renderMoneyBlock(character) {
  const { details } = character;
  return el('div', { cls: 'sheet-block' }, [
    el('h3', { text: 'Money' }),
    el('div', { cls: 'sheet-meta-list' }, [
      renderMetaRow('Current Credits', formatMoney(calculateCurrentCredits(character), '\u20a1')),
      renderMetaRow('Catalog Gear Total', formatMoney(getPurchasedGearTotal(details), '\u20a1', `0 \u20a1`)),
      renderMetaRow('Platinum Pieces', formatMoney(details.platinum, 'p'))
    ]),
    renderCopyBlock('Money Notes', details.moneyNotes)
  ]);
}

function renderPurchasedGear(details) {
  const entries = details.purchasedGear || [];
  if (!entries.length) return el('p', { cls: 'muted', text: 'No catalog gear purchased.' });
  return el('ul', { cls: 'summary-list' }, entries.map((entry) =>
    el('li', { text: `${entry.name} (${formatMoney(entry.credits, '\u20a1')}, ${entry.availability})` })
  ));
}

function renderTraits(list) {
  const filtered = list.filter((item) => item.name && item.rating !== 'none');
  if (!filtered.length) return el('p', { cls: 'muted', text: 'None selected.' });
  return el('ul', { cls: 'summary-list' }, filtered.map((trait) =>
    el('li', { text: `${trait.name} ${trait.rating}${trait.notes ? ` - ${trait.notes}` : ''}` })
  ));
}

function renderSkills(character) {
  const table = el('table', { cls: 'skill-table' });
  const thead = el('thead');
  thead.append(el('tr', {}, [
    el('th', { text: 'Skill' }),
    el('th', { text: 'General' }),
    el('th', { text: 'Specialties' })
  ]));
  const tbody = el('tbody');

  Object.entries(character.skills).forEach(([skillName, skill]) => {
    const specs = (skill.specialties || [])
      .filter((item) => item.rating !== 'none' && getSpecialtyDisplayName(item))
      .map((item) => `${getSpecialtyDisplayName(item)} ${item.rating}`)
      .join(', ');
    const effectiveGeneral = effectiveGeneralRating(character, skillName);
    if (effectiveGeneral === 'none' && !specs) return;
    tbody.append(el('tr', {}, [
      el('td', { text: skillName }),
      el('td', { text: effectiveGeneral }),
      el('td', { text: specs || '-' })
    ]));
  });

  table.append(thead, tbody);
  return table;
}

function buildAttributeRollRows(character) {
  const a = character.attributes;
  const pairDice = (left, right) => (
    isAssignedAttributeDie(left) && isAssignedAttributeDie(right) ? `${left} + ${right}` : '-'
  );
  return [
    { name: 'Burst of Strength', dice: pairDice(a.Strength, a.Strength) },
    { name: 'Endurance', dice: pairDice(a.Vitality, a.Willpower) },
    { name: 'Get Out of Harm\'s Way', dice: pairDice(a.Agility, a.Alertness) },
    { name: 'Long Haul', dice: pairDice(a.Strength, a.Vitality) },
    { name: 'Memorize', dice: pairDice(a.Intelligence, a.Alertness) },
    { name: 'Recall', dice: pairDice(a.Intelligence, a.Willpower) },
    { name: 'Resistance', dice: pairDice(a.Vitality, a.Vitality) }
  ];
}

function renderDerivedRolls(state) {
  const rows = [
    { label: 'Life Points', value: String(state.computed.lifePoints) },
    { label: 'Initiative', value: state.computed.initiative },
    ...buildAttributeRollRows(state.character).map((row) => ({ label: row.name, value: row.dice }))
  ];

  return el('div', { cls: 'derived-roll-list' }, rows.map((row) =>
    el('div', { cls: 'derived-roll-row' }, [
      el('span', { cls: 'derived-roll-label', text: row.label }),
      el('strong', { cls: 'derived-roll-value', text: row.value })
    ])
  ));
}

function readPortraitAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Portrait file could not be read as text.'));
    });
    reader.addEventListener('error', () => reject(reader.error || new Error('Portrait file could not be read.')));
    reader.readAsDataURL(file);
  });
}

function renderPortraitPanel(state, mutateCharacter) {
  const portraitDataUrl = textOrFallback(state.character.basics.portraitDataUrl, '');
  const fileInput = el('input', {
    cls: 'hidden',
    attrs: {
      type: 'file',
      accept: 'image/png,image/jpeg,image/webp,image/gif'
    }
  });

  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      event.target.value = '';
      return;
    }

    try {
      const dataUrl = await readPortraitAsDataUrl(file);
      mutateCharacter((draft) => {
        draft.basics.portraitDataUrl = dataUrl;
      });
    } catch (error) {
      console.error(error);
    } finally {
      event.target.value = '';
    }
  });

  const chooseButton = el('button', {
    text: portraitDataUrl ? 'Choose New Image' : 'Choose Image',
    attrs: { type: 'button' }
  });
  chooseButton.addEventListener('click', () => fileInput.click());

  const clearButton = el('button', {
    text: 'Clear Image',
    attrs: { type: 'button' }
  });
  clearButton.addEventListener('click', () => mutateCharacter((draft) => {
    draft.basics.portraitDataUrl = '';
  }));

  return el('section', { cls: 'sheet-block portrait-panel' }, [
    el('h3', { text: 'Portrait' }),
    fileInput,
    el('div', { cls: 'portrait-frame' }, portraitDataUrl
      ? el('img', {
        cls: 'portrait-image',
        attrs: {
          src: portraitDataUrl,
          alt: `${state.character.basics.name || 'Character'} portrait`
        }
      })
      : el('div', { cls: 'portrait-placeholder' }, [
        el('strong', { text: state.character.basics.name || 'No Portrait Yet' }),
        el('span', { text: 'Choose an image to place it on the play sheet.' })
      ])
    ),
    el('div', { cls: 'portrait-controls no-print' }, [
      chooseButton,
      portraitDataUrl ? clearButton : null
    ])
  ]);
}

function resolveDamageMax(state) {
  const lifePoints = Number.parseInt(state.computed.lifePoints, 10);
  const currentStun = Number.parseInt(state.character.trackers?.stun ?? 0, 10);
  const currentWounds = Number.parseInt(state.character.trackers?.wounds ?? 0, 10);
  if (Number.isNaN(lifePoints)) {
    return Math.max(1, currentStun || 0, currentWounds || 0);
  }
  return Math.max(1, lifePoints);
}

function setDamageValue(mutateCharacter, key, nextValue, max) {
  mutateCharacter((draft) => {
    draft.trackers[key] = clampTrackerValue(nextValue, max);
  });
}

function createDamageBubble(kind, bubbleValue, filled, mutateCharacter, current, max) {
  const button = el('button', {
    cls: `damage-bubble ${kind}${filled ? ' filled' : ''}`,
    attrs: {
      type: 'button',
      title: `${kind === 'stun' ? 'Stun' : 'Wounds'} ${bubbleValue}`,
      'aria-label': `${kind === 'stun' ? 'Set Stun to' : 'Set Wounds to'} ${bubbleValue}`
    }
  });

  button.addEventListener('click', () => {
    const nextValue = current === bubbleValue ? bubbleValue - 1 : bubbleValue;
    setDamageValue(mutateCharacter, kind, nextValue, max);
  });

  return button;
}

function renderDamageBubbleTrack(label, kind, value, max, mutateCharacter) {
  const block = el('div', { cls: `damage-bubble-track ${kind}` });
  const header = el('div', { cls: 'damage-bubble-track-head' }, [
    el('strong', { text: label }),
    el('span', { cls: 'muted', text: `${value} / ${max}` }),
    el('small', { cls: 'muted', text: kind === 'stun' ? 'Top down' : 'Bottom up' })
  ]);

  const clear = el('button', {
    cls: 'damage-clear-button',
    text: 'Clear',
    attrs: { type: 'button', 'aria-label': `Clear ${label}` }
  });
  clear.addEventListener('click', () => setDamageValue(mutateCharacter, kind, 0, max));
  header.append(clear);

  const column = el('div', { cls: 'damage-bubble-column' });
  for (let visualIndex = 1; visualIndex <= max; visualIndex += 1) {
    const bubbleValue = kind === 'stun' ? visualIndex : (max - visualIndex + 1);
    const filled = kind === 'stun' ? visualIndex <= value : visualIndex > max - value;
    const row = el('div', { cls: 'damage-bubble-row' }, [
      createDamageBubble(kind, bubbleValue, filled, mutateCharacter, value, max),
      el('span', { cls: 'damage-bubble-count muted', text: String(bubbleValue) })
    ]);
    column.append(row);
  }

  block.append(header, column);
  return block;
}

function renderDamageDrawerTab(stun, wounds, isOpen) {
  return el('button', {
    cls: 'damage-drawer-tab',
    attrs: {
      type: 'button',
      title: `Damage tracker: Stun ${stun}, Wounds ${wounds}`,
      'aria-expanded': isOpen ? 'true' : 'false',
      'aria-label': isOpen ? 'Hide damage tracker' : 'Show damage tracker'
    }
  }, [
    el('span', { cls: 'damage-drawer-tab-label', text: 'Damage' }),
    el('div', { cls: 'damage-drawer-tab-summary', attrs: { 'aria-hidden': 'true' } }, [
      el('span', { cls: 'damage-drawer-tab-pill stun', text: `S ${stun}` }),
      el('span', { cls: 'damage-drawer-tab-pill wounds', text: `W ${wounds}` })
    ])
  ]);
}

function renderDamageDrawer(state, mutateCharacter) {
  const max = resolveDamageMax(state);
  const stun = clampTrackerValue(state.character.trackers?.stun ?? 0, max);
  const wounds = clampTrackerValue(state.character.trackers?.wounds ?? 0, max);
  const total = stun + wounds;
  const outCold = total >= max;
  const lifePointsReady = !Number.isNaN(Number.parseInt(state.computed.lifePoints, 10));

  const drawer = el('aside', { cls: `damage-drawer no-print${damageDrawerOpen ? ' open' : ''}` });
  const tab = renderDamageDrawerTab(stun, wounds, damageDrawerOpen);

  tab.addEventListener('click', () => {
    damageDrawerOpen = !damageDrawerOpen;
    drawer.classList.toggle('open', damageDrawerOpen);
    tab.setAttribute('aria-expanded', damageDrawerOpen ? 'true' : 'false');
    tab.setAttribute('aria-label', damageDrawerOpen ? 'Hide damage tracker' : 'Show damage tracker');
  });

  const panel = el('div', { cls: 'damage-drawer-panel' }, [
    el('div', { cls: 'damage-drawer-head' }, [
      el('h3', { text: 'Stun / Wounds' }),
      el('p', { cls: 'muted', text: lifePointsReady
        ? 'Stun fills from the top. Wounds fill from the bottom. When they meet, the character is out.'
        : 'Life Points are not finalized yet, so the drawer is temporarily sized to current marked damage.' })
    ]),
    el('div', { cls: `damage-state${outCold ? ' danger' : ''}` }, [
      el('span', { text: 'Current Total' }),
      el('strong', { text: `${total} / ${max}` }),
      el('small', { text: outCold ? 'Out cold or worse.' : 'Still upright.' })
    ]),
    el('div', { cls: 'damage-track-stack' }, [
      renderDamageBubbleTrack('Stun', 'stun', stun, max, mutateCharacter),
      renderDamageBubbleTrack('Wounds', 'wounds', wounds, max, mutateCharacter)
    ])
  ]);

  drawer.append(tab, panel);
  return drawer;
}

function setPlotPoints(mutateCharacter, nextValue) {
  mutateCharacter((draft) => {
    draft.trackers.plotPoints = clampTrackerValue(nextValue, PLOT_POINT_MAX);
  });
}

function createPlotPointBubble(value, current, mutateCharacter) {
  const button = el('button', {
    cls: `plot-point-bubble${value <= current ? ' filled' : ''}`,
    attrs: {
      type: 'button',
      title: `Set Plot Points to ${value}`,
      'aria-label': `Set Plot Points to ${value}`
    }
  });

  button.addEventListener('click', () => {
    const nextValue = current === value ? value - 1 : value;
    setPlotPoints(mutateCharacter, nextValue);
  });

  return button;
}

function renderPlotPointTracker(character, mutateCharacter) {
  const current = clampTrackerValue(character.trackers?.plotPoints ?? 1, PLOT_POINT_MAX);
  const clear = el('button', {
    cls: 'damage-clear-button',
    text: 'Clear',
    attrs: { type: 'button', 'aria-label': 'Clear plot points' }
  });
  clear.addEventListener('click', () => setPlotPoints(mutateCharacter, 0));

  return el('div', { cls: 'sheet-block' }, [
    el('h3', { text: 'Plot Points' }),
    el('div', { cls: 'plot-point-wrap' }, [
      el('div', { cls: 'plot-point-head' }, [
        el('div', { cls: 'sheet-meta-list' }, [
          renderMetaRow('Current Total', `${current} / ${PLOT_POINT_MAX}`),
          el('p', { cls: 'muted sheet-copy', text: 'Click bubbles to match the current table total.' })
        ]),
        clear
      ]),
      el('div', { cls: 'plot-point-track' }, Array.from({ length: PLOT_POINT_MAX }, (_, index) => {
        const value = index + 1;
        return el('div', { cls: 'plot-point-item' }, [
          createPlotPointBubble(value, current, mutateCharacter),
          el('span', { cls: 'damage-bubble-count muted', text: String(value) })
        ]);
      }))
    ])
  ]);
}

export function renderSheetStep(state, mutateCharacter) {
  const root = el('div');
  const stage = el('div', { cls: 'sheet-stage' });
  const sheet = el('div', { cls: 'sheet-layout', attrs: { id: 'printableSheet' } });

  sheet.append(el('div', { cls: 'sheet-top-layout' }, [
    el('div', { cls: 'sheet-top-left' }, [
      el('section', { cls: 'sheet-hero sheet-identity-panel' }, [
        el('div', { cls: 'sheet-hero-copy' }, [
          el('p', { cls: 'sheet-kicker', text: 'Ready to Play Dossier' }),
          el('h2', { text: state.character.basics.name || 'Unnamed Greenhorn' }),
          el('p', { cls: 'sheet-concept', text: textOrFallback(state.character.basics.concept, 'No concept entered yet.') })
        ])
      ]),
      el('section', { cls: 'sheet-block sheet-attributes-panel' }, [
        el('h3', { text: 'Attributes' }),
        el('div', { cls: 'sheet-attr-grid' }, ATTRIBUTE_LIST.map((attribute) =>
          el('div', { cls: 'sheet-stat' }, [
            el('span', { text: attribute }),
            el('strong', { text: state.character.attributes[attribute] })
          ])
        ))
      ])
    ]),
    el('div', { cls: 'sheet-top-aside' }, [
      el('section', { cls: 'sheet-block sheet-hero-meta sheet-role-panel' }, [
        el('div', { cls: 'sheet-meta-list' }, [
          renderMetaRow('Role', resolveRoleLabel(state.character.basics)),
          renderMetaRow('Role Skill', state.character.basics.roleSkill, {
            note: state.character.basics.roleSkill ? 'Free +d2 training is already baked into the final General rating.' : ''
          }),
          renderMetaRow('Homeworld', state.character.basics.homeworld),
          renderMetaRow('Heroic Level', state.character.meta.heroicLevel || 'Greenhorn')
        ])
      ]),
      renderPortraitPanel(state, mutateCharacter)
    ])
  ]));

  sheet.append(el('section', { cls: 'sheet-block' }, [
    el('h3', { text: 'Derived Rolls' }),
    renderDerivedRolls(state)
  ]));

  sheet.append(el('div', { cls: 'grid-2 sheet-section-grid' }, [
    el('section', { cls: 'sheet-block' }, [el('h3', { text: 'Assets' }), renderTraits(state.character.traits.assets)]),
    el('section', { cls: 'sheet-block' }, [el('h3', { text: 'Complications' }), renderTraits(state.character.traits.complications)])
  ]));

  sheet.append(el('section', { cls: 'sheet-block' }, [
    el('h3', { text: 'Skills & Specialties' }),
    renderSkills(state.character)
  ]));

  sheet.append(el('div', { cls: 'grid-2 sheet-section-grid' }, [
    renderMoneyBlock(state.character),
    renderPlotPointTracker(state.character, mutateCharacter)
  ]));

  sheet.append(el('div', { cls: 'grid-2 sheet-section-grid' }, [
    el('section', { cls: 'sheet-block' }, [
      el('h3', { text: 'Gear' }),
      el('p', { html: '<strong>Purchased Gear:</strong>' }),
      renderPurchasedGear(state.character.details),
      renderCopyBlock('Additional Gear', state.character.details.gear)
    ]),
    el('section', { cls: 'sheet-block' }, [
      el('h3', { text: 'Notes' }),
      renderCopyBlock('Character Notes', state.character.details.notes)
    ])
  ]));

  stage.append(sheet, renderDamageDrawer(state, mutateCharacter));
  root.append(stage);
  return root;
}
