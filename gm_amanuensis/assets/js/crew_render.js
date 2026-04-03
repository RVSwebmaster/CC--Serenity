import { ATTRIBUTE_LIST } from '../../../assets/js/data/defaults.js';
import { effectiveGeneralRating, lifePoints } from '../../../assets/js/rules.js';
import { el } from '../../../assets/js/ui.js';
import { getCrewCharacter } from './session_state.js';
import { renderTransitPanel } from './transit_panel.js';

const DIFFICULTY_LADDER = [
  ['Trivial', '3'],
  ['Easy', '7'],
  ['Average', '11'],
  ['Hard', '15'],
  ['Formidable', '19']
];

const COMMON_PAIRINGS = [
  'Alertness + Perception',
  'Agility + Guns',
  'Agility + Athletics',
  'Intelligence + Technical Engineering',
  'Strength + Melee Weapon Combat',
  'Willpower + Discipline'
];

const COMBAT_QUICK_REFERENCE = [
  'Action: roll Attribute + Skill against the target number.',
  'Step up for strong edges, step down for bad footing, cover, or pain.',
  'Stun fills first and often shakes a character out of the fight fast.',
  'Wounds are serious and should stay visible on the active tab.'
];

const SHIP_SELECTS = {
  hull: ['Nominal', 'Scuffed', 'Critical'],
  drive: ['Steady', 'Touchy', 'Dead Stick'],
  posture: ['Docked', 'Running Cold', 'Hot Exit'],
  jackCondition: ['Watching from the ducts', 'Loose on the catwalks', 'Raiding the galley', 'Hiding from strangers']
};

const SHIP_SPEC_FIELDS = [
  ['Dimensions', 'specifications.dimensions'],
  ['Tonnage', 'specifications.tonnage'],
  ['Speed Class', 'specifications.speedClass'],
  ['Crew Quarters', 'specifications.crewQuarters'],
  ['Fuel Capacity', 'specifications.fuelCapacity'],
  ['Cargo Capacity / Max Deck Load', 'specifications.cargoCapacity'],
  ['Passenger Capacity', 'specifications.passengerCapacity'],
  ['Gear', 'specifications.gear'],
  ['Price', 'specifications.price'],
  ['Complexity', 'specifications.complexity'],
  ['Maintenance Cost', 'specifications.maintenanceCost']
];

const SHIP_ATTRIBUTE_FIELDS = [
  ['Agility', 'attributes.agility'],
  ['Strength', 'attributes.strength'],
  ['Vitality', 'attributes.vitality'],
  ['Alertness', 'attributes.alertness'],
  ['Intelligence', 'attributes.intelligence'],
  ['Willpower', 'attributes.willpower'],
  ['Initiative', 'attributes.initiative'],
  ['Life', 'attributes.life']
];

const ENEMY_LIFE_MAX = 20;

function displayRole(character) {
  return character.basics.role || character.basics.customRole || 'Unassigned';
}

function collectBoughtSkills(character) {
  return Object.entries(character.skills || {})
    .filter(([, skill]) => (
      (skill.generalRating && skill.generalRating !== 'none')
      || (skill.specialties || []).some((specialty) => specialty.rating && specialty.rating !== 'none')
    ))
    .map(([skillName, skill]) => ({
      name: skillName,
      rating: effectiveGeneralRating(character, skillName),
      specialties: (skill.specialties || [])
        .filter((specialty) => specialty.rating && specialty.rating !== 'none' && specialty.name)
        .map((specialty) => `${specialty.name} ${specialty.rating}`)
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function renderBadge(text, className = '') {
  return el('span', { cls: `gm-badge ${className}`.trim(), text });
}

function renderStat(label, value) {
  return el('div', { cls: 'gm-stat' }, [
    el('span', { cls: 'gm-stat-label', text: label }),
    el('span', { cls: 'gm-stat-value', text: String(value || '-') })
  ]);
}

function renderUtilitySection(title, items) {
  return el('section', { cls: 'gm-utility-card' }, [
    el('h3', { cls: 'gm-utility-title', text: title }),
    el('ul', { cls: 'gm-reference-list' }, items.map((item) => el('li', { text: item })))
  ]);
}

function renderDifficultyLadder() {
  return el('section', { cls: 'gm-utility-card' }, [
    el('h3', { cls: 'gm-utility-title', text: 'Difficulty Ladder' }),
    el('div', { cls: 'gm-difficulty-grid' }, DIFFICULTY_LADDER.map(([label, value]) => (
      el('div', { cls: 'gm-difficulty-row' }, [
        el('span', { text: label }),
        el('strong', { text: value })
      ])
    )))
  ]);
}

function valueAtPath(source, path) {
  return path.split('.').reduce((value, key) => value?.[key], source) || '';
}

function parseShipList(value) {
  return String(value || '')
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function renderShipTextList(items, emptyLabel) {
  if (items.length === 0) {
    return el('div', { cls: 'gm-ship-list-empty', text: emptyLabel });
  }

  return el('ul', { cls: 'gm-ship-sheet-list' }, items.map((item) => (
    el('li', { cls: 'gm-ship-sheet-item' }, [
      el('span', { cls: 'gm-ship-sheet-item-text', text: item })
    ])
  )));
}

function renderJackStat(label, value) {
  return el('div', { cls: 'gm-jack-stat' }, [
    el('span', { cls: 'gm-jack-stat-label', text: label }),
    el('span', { cls: 'gm-jack-stat-value', text: value })
  ]);
}

function shipFieldAttrs(ship, extra = {}) {
  return ship.editLocked !== false ? { ...extra, disabled: 'disabled' } : extra;
}

function renderEnemyLifeBubble(trackerId, value, current) {
  return el('button', {
    cls: `gm-enemy-life-bubble${value <= current ? ' filled' : ''}`,
    attrs: {
      type: 'button',
      title: `Set life to ${value}`,
      'aria-label': `Set enemy life to ${value}`
    },
    dataset: { action: 'set-enemy-life', memberId: trackerId, value: String(value) }
  });
}

function renderEnemyTrackerRow(tracker) {
  return el('div', { cls: 'gm-enemy-tracker-row' }, [
    el('div', { cls: 'gm-enemy-tracker-head' }, [
      el('strong', { text: tracker.label }),
      el('div', { cls: 'gm-enemy-tracker-meta' }, [
        el('span', { cls: 'gm-badge gm-badge-soft', text: `${tracker.life} / ${ENEMY_LIFE_MAX}` }),
        el('button', {
          cls: 'gm-button gm-button-compact',
          text: 'Clear',
          attrs: { type: 'button' },
          dataset: { action: 'clear-enemy-life', memberId: tracker.id }
        })
      ])
    ]),
    el('div', { cls: 'gm-enemy-life-track' }, Array.from({ length: ENEMY_LIFE_MAX }, (_, index) => {
      const value = index + 1;
      return renderEnemyLifeBubble(tracker.id, value, tracker.life);
    }))
  ]);
}

function renderEnemyTrackerPanel(session) {
  return el('section', { cls: 'gm-utility-card gm-enemy-tracker-panel' }, [
    el('h3', { cls: 'gm-utility-title', text: 'Enemy Life Trackers' }),
    el('p', {
      cls: 'gm-panel-copy gm-enemy-tracker-copy',
      text: 'Eight quick enemy rows, twenty life points each. Click across the row to match current damage.'
    }),
    el('div', { cls: 'gm-enemy-tracker-list' }, (session.enemyTrackers || []).map((tracker) => renderEnemyTrackerRow(tracker)))
  ]);
}

function renderGMUtilityPanel(session) {
  return el('section', { cls: 'gm-main-panel gm-bridge-panel' }, [
    el('div', { cls: 'gm-panel-header' }, [
      el('div', {}, [
        el('p', { cls: 'gm-kicker', text: 'Pinned Utility Tab' }),
        el('h2', { cls: 'gm-panel-title', text: 'Bridge' }),
        el('p', {
          cls: 'gm-panel-copy',
          text: 'Use this panel for fast rulings, initiative flow, and round control during live Serenity play.'
        })
      ]),
      el('div', { cls: 'gm-round-tools' }, [
        el('button', {
          cls: 'gm-button gm-button-primary',
          text: 'Advance Turn',
          attrs: {
            type: 'button',
            ...(session.crew.length === 0 ? { disabled: 'disabled' } : {})
          },
          dataset: { action: 'advance-turn' }
        }),
        el('button', {
          cls: 'gm-button',
          text: 'Reset Round',
          attrs: {
            type: 'button',
            ...(session.crew.length === 0 ? { disabled: 'disabled' } : {})
          },
          dataset: { action: 'reset-round' }
        }),
        el('button', {
          cls: 'gm-button',
          text: 'Clear Initiative',
          attrs: {
            type: 'button',
            ...(session.crew.length === 0 ? { disabled: 'disabled' } : {})
          },
          dataset: { action: 'clear-initiative' }
        }),
        el('button', {
          cls: 'gm-button',
          text: 'Open Transit Calculator',
          attrs: { type: 'button' },
          dataset: { action: 'select-tab', tabId: 'transit' }
        })
      ])
    ]),
    el('div', { cls: 'gm-utility-grid' }, [
      renderDifficultyLadder(),
      renderUtilitySection('Complex Difficulty', [
        'For layered jobs, count each moving part and step the target up from Average.',
        'If the scene is chaotic, step the job again instead of pausing play for math.',
        'Let sharp prep buy the target back down.'
      ]),
      renderUtilitySection('Common Pairings', COMMON_PAIRINGS),
      renderUtilitySection('Combat Quick Reference', COMBAT_QUICK_REFERENCE),
      renderUtilitySection('Step Up / Step Down', [
        'Step up for leverage, superior position, tools, or a strong narrative edge.',
        'Step down for wounds, panic, poor footing, visibility, or rushed actions.',
        'If both apply, cancel what clearly cancels and keep the rest moving.'
      ])
    ]),
    renderEnemyTrackerPanel(session)
  ]);
}

function renderCharacterTab(member, session) {
  const character = getCrewCharacter(member);
  const isActive = session.activeTab === member.id;
  const isCurrent = session.currentTurnMemberId === member.id;

  return el('article', {
    cls: `gm-tab-card ${isActive ? 'is-active' : ''} ${isCurrent ? 'is-current' : ''}`.trim(),
    attrs: { style: `--tab-accent: ${member.gm.tabColor};` },
    dataset: { action: 'select-tab', tabId: member.id }
  }, [
    el('button', {
      cls: 'gm-tab-select',
      attrs: { type: 'button' },
      dataset: { action: 'select-tab', tabId: member.id }
    }, [
      el('div', { cls: 'gm-tab-topline' }, [
        el('strong', { cls: 'gm-tab-name', text: character.basics.name || 'Unnamed Crew Member' }),
        isCurrent ? renderBadge('Current', 'gm-badge-current') : null
      ]),
      el('div', { cls: 'gm-tab-badges' }, [
        renderBadge(member.gm.actionState, `gm-badge-state gm-badge-${member.gm.actionState.toLowerCase()}`),
        renderBadge(`S ${member.gm.stun}`, 'gm-badge-small'),
        renderBadge(`W ${member.gm.wounds}`, 'gm-badge-small')
      ])
    ]),
    el('label', { cls: 'gm-tab-initiative-field' }, [
      el('span', { text: 'Init' }),
      el('input', {
        cls: 'gm-tab-initiative-input',
        attrs: { type: 'number', placeholder: '-', value: member.gm.initiativeValue },
        dataset: { action: 'initiative-input', memberId: member.id, field: 'initiativeValue' }
      })
    ])
  ]);
}

function renderShipTab(session) {
  const isActive = session.activeTab === 'ship';
  return el('article', {
    cls: `gm-tab-card gm-tab-ship ${isActive ? 'is-active' : ''}`.trim(),
    attrs: { style: '--tab-accent: #d7a55a;' },
    dataset: { action: 'select-tab', tabId: 'ship' }
  }, [
    el('button', {
      cls: 'gm-tab-select',
      attrs: { type: 'button' },
      dataset: { action: 'select-tab', tabId: 'ship' }
    }, [
      el('div', { cls: 'gm-tab-topline' }, [
        el('strong', { cls: 'gm-tab-name', text: session.ship.name || 'Ship' })
      ]),
      el('div', { cls: 'gm-tab-badges' }, [
        renderBadge(session.ship.condition.hull, 'gm-badge-soft'),
        renderBadge('Jack Aboard', 'gm-badge-small')
      ])
    ]),
    el('div', { cls: 'gm-tab-initiative-field' }, [
      el('span', { text: 'Ship Status' }),
      el('strong', { cls: 'gm-tab-static', text: session.ship.condition.posture })
    ])
  ]);
}

function renderCharacterPanel(member, session) {
  const character = getCrewCharacter(member);
  const boughtSkills = collectBoughtSkills(character);
  const noteField = el('textarea', {
    attrs: { rows: '4', placeholder: 'Fast reminder for live play, complications, heat, or tells.' },
    dataset: { action: 'condition-note', memberId: member.id, field: 'notes' }
  });
  noteField.value = member.gm.notes || '';

  return el('section', {
    cls: 'gm-main-panel gm-character-panel',
    attrs: { style: `--tab-accent: ${member.gm.tabColor};` }
  }, [
    el('header', { cls: 'gm-panel-header' }, [
      el('div', {}, [
        el('p', { cls: 'gm-kicker', text: session.currentTurnMemberId === member.id ? 'Current Turn' : 'Character Focus' }),
        el('h2', { cls: 'gm-panel-title', text: character.basics.name || 'Unnamed Crew Member' }),
        el('p', { cls: 'gm-panel-copy', text: character.basics.concept || 'No concept provided' }),
        el('div', { cls: 'gm-panel-badges' }, [
          renderBadge(displayRole(character), 'gm-badge-soft'),
          renderBadge(member.gm.actionState, `gm-badge-state gm-badge-${member.gm.actionState.toLowerCase()}`),
          session.currentTurnMemberId === member.id ? renderBadge('Current', 'gm-badge-current') : null
        ])
      ]),
      el('button', {
        cls: 'gm-button',
        text: 'Remove Character',
        attrs: { type: 'button' },
        dataset: { action: 'remove-member', memberId: member.id }
      })
    ]),
    el('div', { cls: 'gm-character-layout' }, [
      el('div', { cls: 'gm-character-column' }, [
        el('div', { cls: 'gm-card-grid' }, [
          renderStat('Role', displayRole(character)),
          renderStat('Life Points', lifePoints(character)),
          renderStat('Initiative Entry', member.gm.initiativeValue || '-'),
          renderStat('Agility', character.attributes.Agility || '-')
        ]),
        el('section', { cls: 'gm-section' }, [
          el('h3', { cls: 'gm-section-title', text: 'Attributes' }),
          el('div', { cls: 'gm-attribute-grid' }, ATTRIBUTE_LIST.map((attribute) => (
            el('div', { cls: 'gm-attribute' }, [
              el('span', { cls: 'gm-attribute-name', text: attribute }),
              el('span', { cls: 'gm-attribute-value', text: character.attributes[attribute] || '-' })
            ])
          )))
        ]),
        el('section', { cls: 'gm-section' }, [
          el('h3', { cls: 'gm-section-title', text: 'Bought Skills' }),
          el('ul', { cls: 'gm-skill-list' }, boughtSkills.length > 0
            ? boughtSkills.map((skill) => el('li', { cls: 'gm-skill-item' }, [
              el('span', { cls: 'gm-skill-name', text: skill.name }),
              el('span', { cls: 'gm-skill-rating', text: `Rating: ${skill.rating}` }),
              skill.specialties.length > 0
                ? el('span', { cls: 'gm-skill-specialties', text: `Specialties: ${skill.specialties.join(', ')}` })
                : null
            ]))
            : [el('li', { cls: 'gm-skill-item' }, [el('span', { cls: 'gm-skill-name', text: 'No bought skills listed' })])])
        ])
      ]),
      el('aside', { cls: 'gm-character-column gm-character-side' }, [
        el('section', { cls: 'gm-utility-card gm-condition-card' }, [
          el('h3', { cls: 'gm-utility-title', text: 'Live Conditions' }),
          el('div', { cls: 'gm-condition-row' }, [
            el('label', { text: 'Stun' }),
            el('div', { cls: 'gm-stepper' }, [
              el('button', {
                text: '-',
                attrs: { type: 'button', 'aria-label': `Lower stun for ${character.basics.name || 'crew member'}` },
                dataset: { action: 'adjust-condition', memberId: member.id, field: 'stun', delta: '-1' }
              }),
              el('input', {
                attrs: { type: 'number', min: '0', step: '1', value: String(member.gm.stun) },
                dataset: { action: 'condition-number', memberId: member.id, field: 'stun' }
              }),
              el('button', {
                text: '+',
                attrs: { type: 'button', 'aria-label': `Raise stun for ${character.basics.name || 'crew member'}` },
                dataset: { action: 'adjust-condition', memberId: member.id, field: 'stun', delta: '1' }
              })
            ])
          ]),
          el('div', { cls: 'gm-condition-row' }, [
            el('label', { text: 'Wounds' }),
            el('div', { cls: 'gm-stepper' }, [
              el('button', {
                text: '-',
                attrs: { type: 'button', 'aria-label': `Lower wounds for ${character.basics.name || 'crew member'}` },
                dataset: { action: 'adjust-condition', memberId: member.id, field: 'wounds', delta: '-1' }
              }),
              el('input', {
                attrs: { type: 'number', min: '0', step: '1', value: String(member.gm.wounds) },
                dataset: { action: 'condition-number', memberId: member.id, field: 'wounds' }
              }),
              el('button', {
                text: '+',
                attrs: { type: 'button', 'aria-label': `Raise wounds for ${character.basics.name || 'crew member'}` },
                dataset: { action: 'adjust-condition', memberId: member.id, field: 'wounds', delta: '1' }
              })
            ])
          ]),
          el('div', { cls: 'gm-condition-row' }, [
            el('label', { text: 'Action State' }),
            el('select', {
              dataset: { action: 'condition-select', memberId: member.id, field: 'actionState' }
            }, ['Ready', 'Acted', 'Down'].map((state) => {
              const option = el('option', {
                text: state,
                attrs: { value: state }
              });
              option.selected = member.gm.actionState === state;
              return option;
            }))
          ]),
          el('div', { cls: 'gm-note-field' }, [
            el('label', { text: 'GM note' }),
            noteField
          ])
        ])
      ])
    ])
  ]);
}

function renderShipPanel(ship) {
  const isLocked = ship.editLocked !== false;
  const shipTraitItems = parseShipList(ship.traits);
  const shipSkillItems = parseShipList(ship.skills);

  const shipGearField = el('textarea', {
    cls: 'gm-ship-field-textarea',
    attrs: shipFieldAttrs(ship, { rows: '2', placeholder: 'Gear' }),
    dataset: { action: 'ship-field', shipField: 'specifications.gear' }
  });
  shipGearField.value = ship.specifications.gear || '';

  const shipDamageField = el('textarea', {
    cls: 'gm-ship-field-textarea',
    attrs: shipFieldAttrs(ship, { rows: '3', placeholder: 'Stress, hull damage, broken systems, jury-rigged fixes.' }),
    dataset: { action: 'ship-field', shipField: 'condition.currentDamage' }
  });
  shipDamageField.value = ship.condition.currentDamage || '';

  const shipTraitsField = el('textarea', {
    attrs: shipFieldAttrs(ship, { rows: '4', placeholder: 'Ship traits, quirks, complications, or edges.' }),
    dataset: { action: 'ship-field', shipField: 'traits' }
  });
  shipTraitsField.value = ship.traits || '';

  const shipSkillsField = el('textarea', {
    attrs: shipFieldAttrs(ship, { rows: '4', placeholder: 'Ship skills, specialties, or operational strengths.' }),
    dataset: { action: 'ship-field', shipField: 'skills' }
  });
  shipSkillsField.value = ship.skills || '';

  const shipNotesField = el('textarea', {
    attrs: shipFieldAttrs(ship, { rows: '5', placeholder: 'Ship notes, cargo trouble, fuel worries, docking headaches, or scene hooks.' }),
    dataset: { action: 'ship-field', shipField: 'notes' }
  });
  shipNotesField.value = ship.notes || '';

  const shipPerformanceNotesField = el('textarea', {
    attrs: shipFieldAttrs(ship, { rows: '4', placeholder: 'GM notes tied to thrust, handling, heat, subsystem strain, or scene performance.' }),
    dataset: { action: 'ship-field', shipField: 'condition.performanceNotes' }
  });
  shipPerformanceNotesField.value = ship.condition.performanceNotes || '';

  const jackTraitsField = el('textarea', {
    attrs: shipFieldAttrs(ship, { rows: '3', placeholder: 'Behavior notes, favorite ducts, habits, grudges, or tricks.' }),
    dataset: { action: 'jack-field', shipField: 'jack.traits' }
  });
  jackTraitsField.value = ship.jack.traits || '';

  const jackNotesField = el('textarea', {
    attrs: shipFieldAttrs(ship, { rows: '3', placeholder: 'Short GM note for Jack.' }),
    dataset: { action: 'jack-field', shipField: 'jack.notes' }
  });
  jackNotesField.value = ship.jack.notes || '';

  const jackSkillsField = el('textarea', {
    attrs: shipFieldAttrs(ship, { rows: '6', placeholder: 'One skill per line for Jack.' }),
    dataset: { action: 'jack-skills-field', shipField: 'jack.skills' }
  });
  jackSkillsField.value = (ship.jack.skills || []).join('\n');

  return el('section', {
    cls: 'gm-main-panel gm-ship-panel',
    attrs: { style: '--tab-accent: #d7a55a;' }
  }, [
    el('header', { cls: 'gm-panel-header' }, [
      el('div', {}, [
        el('p', { cls: 'gm-kicker', text: 'Pinned Ship Tab' }),
        el('h2', { cls: 'gm-panel-title', text: ship.name }),
        el('p', { cls: 'gm-panel-copy', text: `${ship.className} | ${ship.concept}` }),
        el('div', { cls: 'gm-panel-badges' }, [
          renderBadge(ship.condition.hull, 'gm-badge-soft'),
          renderBadge(ship.condition.drive, 'gm-badge-soft'),
          renderBadge(ship.condition.posture, 'gm-badge-soft'),
          renderBadge(isLocked ? 'Locked' : 'Editing', isLocked ? 'gm-badge-soft' : 'gm-badge-current')
        ])
      ]),
      el('div', { cls: 'gm-ship-panel-tools' }, [
        el('p', {
          cls: 'gm-ship-lock-copy',
          text: isLocked
            ? 'Ship data is locked to prevent accidental edits.'
            : 'Ship data is unlocked. Changes save immediately.'
        }),
        el('button', {
          cls: `gm-button ${isLocked ? 'gm-button-primary' : ''}`.trim(),
          text: isLocked ? 'Unlock Ship Data' : 'Lock Ship Data',
          attrs: { type: 'button' },
          dataset: { action: 'toggle-ship-edit-lock' }
        })
      ])
    ]),
    el('div', { cls: 'gm-ship-layout' }, [
      el('div', { cls: 'gm-character-column' }, [
        el('section', { cls: 'gm-utility-card' }, [
          el('h3', { cls: 'gm-utility-title', text: 'Ship Identity' }),
          el('div', { cls: 'gm-form-grid' }, [
            el('label', { cls: 'gm-form-field' }, [
              el('span', { text: 'Ship Name' }),
              el('input', {
                attrs: shipFieldAttrs(ship, { type: 'text', value: ship.name }),
                dataset: { action: 'ship-field', shipField: 'name' }
              })
            ]),
            el('label', { cls: 'gm-form-field' }, [
              el('span', { text: 'Class / Type' }),
              el('input', {
                attrs: shipFieldAttrs(ship, { type: 'text', value: ship.className }),
                dataset: { action: 'ship-field', shipField: 'className' }
              })
            ]),
            el('label', { cls: 'gm-form-field gm-form-field-wide' }, [
              el('span', { text: 'Concept / Role Line' }),
              el('input', {
                attrs: shipFieldAttrs(ship, { type: 'text', value: ship.concept }),
                dataset: { action: 'ship-field', shipField: 'concept' }
              })
            ])
          ])
        ]),
        el('section', { cls: 'gm-utility-card' }, [
          el('h3', { cls: 'gm-utility-title', text: 'Specifications' }),
          el('div', { cls: 'gm-form-grid gm-form-grid-ship-specs' }, SHIP_SPEC_FIELDS.map(([label, path]) => (
            el('label', {
              cls: `gm-form-field ${label.includes('Cargo Capacity') || label === 'Gear' ? 'gm-form-field-wide' : ''}`.trim()
            }, [
              el('span', { text: label }),
              label === 'Gear'
                ? shipGearField
                : el('input', {
                  attrs: shipFieldAttrs(ship, { type: 'text', value: valueAtPath(ship, path) }),
                  dataset: { action: 'ship-field', shipField: path }
                })
            ])
          )))
        ]),
        el('section', { cls: 'gm-utility-card' }, [
          el('h3', { cls: 'gm-utility-title', text: 'Attributes' }),
          el('div', { cls: 'gm-form-grid gm-form-grid-ship-attributes' }, SHIP_ATTRIBUTE_FIELDS.map(([label, path]) => (
            el('label', { cls: 'gm-form-field' }, [
              el('span', { text: label }),
              el('input', {
                attrs: shipFieldAttrs(ship, { type: 'text', value: valueAtPath(ship, path) }),
                dataset: { action: 'ship-field', shipField: path }
              })
            ])
          )))
        ]),
        el('div', { cls: 'gm-ship-sheet-grid' }, [
          el('section', { cls: 'gm-utility-card' }, [
            el('h3', { cls: 'gm-utility-title', text: 'Traits' }),
            renderShipTextList(shipTraitItems, 'No ship traits listed yet.'),
            el('div', { cls: 'gm-note-field' }, [
              el('label', { text: 'Ship traits and quirks' }),
              shipTraitsField
            ])
          ]),
          el('section', { cls: 'gm-utility-card' }, [
            el('h3', { cls: 'gm-utility-title', text: 'Skills' }),
            renderShipTextList(shipSkillItems, 'No ship skills listed yet.'),
            el('div', { cls: 'gm-note-field' }, [
              el('label', { text: 'Ship skills and operating specialties' }),
              shipSkillsField
            ])
          ])
        ]),
        el('section', { cls: 'gm-utility-card' }, [
          el('h3', { cls: 'gm-utility-title', text: 'Ship Condition' }),
          el('div', { cls: 'gm-form-grid' }, [
            ...Object.entries({
              'Hull State': ['condition.hull', SHIP_SELECTS.hull],
              'Drive Train': ['condition.drive', SHIP_SELECTS.drive],
              'Current Posture': ['condition.posture', SHIP_SELECTS.posture]
            }).map(([label, [path, values]]) => (
              el('label', { cls: 'gm-form-field' }, [
                el('span', { text: label }),
                el('select', {
                  attrs: shipFieldAttrs(ship),
                  dataset: { action: 'ship-field', shipField: path }
                }, values.map((value) => {
                  const option = el('option', {
                    text: value,
                    attrs: { value }
                  });
                  option.selected = path === 'condition.hull'
                    ? ship.condition.hull === value
                    : path === 'condition.drive'
                      ? ship.condition.drive === value
                      : ship.condition.posture === value;
                  return option;
                }))
              ])
            ))
          ]),
          el('div', { cls: 'gm-form-grid gm-form-grid-ship-condition' }, [
            el('label', { cls: 'gm-form-field' }, [
              el('span', { text: 'Current Life' }),
              el('input', {
                attrs: shipFieldAttrs(ship, { type: 'text', value: ship.condition.currentLife }),
                dataset: { action: 'ship-field', shipField: 'condition.currentLife' }
              })
            ]),
            el('label', { cls: 'gm-form-field' }, [
              el('span', { text: 'System State' }),
              el('input', {
                attrs: shipFieldAttrs(ship, { type: 'text', value: ship.condition.systemState }),
                dataset: { action: 'ship-field', shipField: 'condition.systemState' }
              })
            ]),
            el('label', { cls: 'gm-form-field gm-form-field-wide' }, [
              el('span', { text: 'Current Damage / Condition Tracking' }),
              shipDamageField
            ]),
            el('div', { cls: 'gm-note-field gm-form-field-wide' }, [
              el('label', { text: 'Performance notes' }),
              shipPerformanceNotesField
            ])
          ])
        ]),
        el('section', { cls: 'gm-utility-card' }, [
          el('h3', { cls: 'gm-utility-title', text: 'Ship Notes' }),
          el('div', { cls: 'gm-note-field' }, [
            el('label', { text: 'GM ship notes' }),
            shipNotesField
          ])
        ]),
        el('section', { cls: 'gm-utility-card' }, [
          el('h3', { cls: 'gm-utility-title', text: 'Systems Bay' }),
          el('ul', { cls: 'gm-reference-list' }, [
            el('li', { text: 'Reserved for future cargo, fuel, heat, or component hooks.' }),
            el('li', { text: 'Keep this panel open for later ship mechanics without overbuilding today.' })
          ])
        ])
      ]),
      el('aside', { cls: 'gm-character-column gm-character-side' }, [
        el('section', { cls: 'gm-utility-card gm-jack-card' }, [
          el('h3', { cls: 'gm-utility-title', text: 'Jack' }),
          el('div', { cls: 'gm-form-grid' }, [
            el('label', { cls: 'gm-form-field' }, [
              el('span', { text: 'Jack Name' }),
              el('input', {
                attrs: shipFieldAttrs(ship, { type: 'text', value: ship.jack.name || '' }),
                dataset: { action: 'jack-field', shipField: 'jack.name' }
              })
            ]),
            el('label', { cls: 'gm-form-field' }, [
              el('span', { text: 'Role' }),
              el('input', {
                attrs: shipFieldAttrs(ship, { type: 'text', value: ship.jack.role || '' }),
                dataset: { action: 'jack-field', shipField: 'jack.role' }
              })
            ]),
            el('label', { cls: 'gm-form-field gm-form-field-wide' }, [
              el('span', { text: 'Attitude' }),
              el('input', {
                attrs: shipFieldAttrs(ship, { type: 'text', value: ship.jack.attitude || '' }),
                dataset: { action: 'jack-field', shipField: 'jack.attitude' }
              })
            ])
          ]),
          el('div', { cls: 'gm-jack-stat-block' }, [
            el('p', { cls: 'gm-jack-block-title', text: 'Attributes' }),
            el('div', { cls: 'gm-form-grid gm-form-grid-jack-attributes' }, [
              ...Object.entries({
                Agility: 'jack.attributes.agility',
                Strength: 'jack.attributes.strength',
                Vitality: 'jack.attributes.vitality',
                Alertness: 'jack.attributes.alertness',
                Intelligence: 'jack.attributes.intelligence',
                Willpower: 'jack.attributes.willpower',
                Life: 'jack.lifePoints',
                Initiative: 'jack.initiative'
              }).map(([label, path]) => (
                el('label', { cls: 'gm-form-field' }, [
                  el('span', { text: label }),
                  el('input', {
                    attrs: shipFieldAttrs(ship, { type: 'text', value: valueAtPath(ship, path) }),
                    dataset: { action: 'jack-field', shipField: path }
                  })
                ])
              ))
            ])
          ]),
          el('div', { cls: 'gm-jack-stat-block' }, [
            el('p', { cls: 'gm-jack-block-title', text: 'Key Skills' }),
            el('ul', { cls: 'gm-jack-skill-list' }, ship.jack.skills.map((skill) => (
              el('li', { cls: 'gm-jack-skill-item', text: skill })
            ))),
            el('div', { cls: 'gm-note-field' }, [
              el('label', { text: 'Jack skills' }),
              jackSkillsField
            ])
          ]),
          el('label', { cls: 'gm-form-field' }, [
            el('span', { text: 'Jack Condition' }),
            el('select', {
              attrs: shipFieldAttrs(ship),
              dataset: { action: 'jack-field', shipField: 'jack.condition' }
            }, SHIP_SELECTS.jackCondition.map((value) => {
              const option = el('option', {
                text: value,
                attrs: { value }
              });
              option.selected = ship.jack.condition === value;
              return option;
            }))
          ]),
          el('div', { cls: 'gm-note-field' }, [
            el('label', { text: 'Jack traits / behavior notes' }),
            jackTraitsField
          ]),
          el('div', { cls: 'gm-note-field' }, [
            el('label', { text: 'Jack GM note' }),
            jackNotesField
          ])
        ])
      ])
    ])
  ]);
}

function renderEmptyCharacterState() {
  return el('div', { cls: 'gm-empty-state gm-main-panel' }, [
    el('strong', { text: 'No crew loaded yet.' }),
    document.createTextNode(' Import one or more Character Crucible Serenity JSON exports to populate tabs, assign colors, and start initiative tracking.')
  ]);
}

function renderTabRail(session) {
  return el('section', { cls: 'gm-tab-shell' }, [
    el('div', { cls: 'gm-tab-rail', attrs: { role: 'tablist', 'aria-label': 'GM console tabs' } }, [
      el('article', {
        cls: `gm-tab-card gm-tab-gm ${session.activeTab === 'gm' || session.activeTab === 'transit' ? 'is-active' : ''}`.trim(),
        attrs: { style: '--tab-accent: #78d0be;' },
        dataset: { action: 'select-tab', tabId: 'gm' }
      }, [
        el('button', {
          cls: 'gm-tab-select',
          attrs: { type: 'button' },
          dataset: { action: 'select-tab', tabId: 'gm' }
        }, [
          el('div', { cls: 'gm-tab-topline' }, [
            el('strong', { cls: 'gm-tab-name', text: 'GM' })
          ]),
          el('div', { cls: 'gm-tab-badges' }, [
            renderBadge(`${session.crew.length} Crew`, 'gm-badge-soft')
          ])
        ])
      ]),
      ...session.crew.map((member) => renderCharacterTab(member, session)),
      renderShipTab(session)
    ])
  ]);
}

export function renderDashboard(root, session, flash) {
  root.innerHTML = '';

  const importInput = el('input', {
    cls: 'gm-file-input',
    attrs: { id: 'crewImportInput', type: 'file', accept: '.json,application/json', multiple: 'multiple' }
  });

  const activeMember = session.crew.find((member) => member.id === session.activeTab) || null;

  root.append(el('main', { cls: 'gm-shell' }, [
    el('section', { cls: 'gm-topbar' }, [
      el('div', {}, [
        el('p', { cls: 'gm-kicker', text: 'Serenity GM Console' }),
        el('h1', { cls: 'gm-title', text: 'GM Amanuensis, Serenity Edition' }),
        el('p', {
          cls: 'gm-copy',
          text: 'Run the table from a pinned GM tab, initiative-sorted crew tabs, and a dedicated ship board with Jack nested where he belongs.'
        }),
        el('div', { cls: 'gm-status-row' }, [
          el('div', {
            cls: `gm-status ${flash?.kind || 'info'}`,
            text: flash?.text || 'Ready for crew import.',
            attrs: { 'aria-live': 'polite' }
          }),
          el('div', { cls: 'gm-session-meta' }, [
            el('span', { cls: 'gm-pill', text: `Crew Loaded: ${session.crew.length}` }),
            el('span', { cls: 'gm-pill', text: session.currentTurnMemberId ? 'Turn Marker: active' : 'Turn Marker: standby' })
          ])
        ])
      ]),
      el('div', { cls: 'gm-toolbar' }, [
        el('label', { cls: 'gm-file-button', text: 'Import Character JSON' }, [importInput]),
        el('button', {
          cls: 'gm-button',
          text: 'Clear Crew',
          attrs: {
            type: 'button'
          },
          dataset: { action: 'clear-crew' }
        })
      ])
    ]),
    renderTabRail(session),
    session.activeTab === 'gm'
      ? renderGMUtilityPanel(session)
      : session.activeTab === 'transit'
        ? renderTransitPanel()
      : session.activeTab === 'ship'
        ? renderShipPanel(session.ship)
        : activeMember
          ? renderCharacterPanel(activeMember, session)
          : renderEmptyCharacterState()
  ]));

  return { importInput };
}
