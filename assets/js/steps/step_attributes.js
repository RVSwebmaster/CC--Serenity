import { ATTRIBUTE_LIST, ATTRIBUTE_OPTIONS } from '../data/defaults.js';
import { dieCost } from '../rules.js';
import { el, sectionHeader } from '../ui.js';

export function renderAttributesStep(state, onChange) {
  const root = el('div');
  root.append(sectionHeader('Step 4: Attributes', 'Attributes tell you how the character handles the world before training and experience get involved. Spend exactly 42 points and decide where they are naturally sharp, stubborn, quick, or dangerous.'));

  root.append(el('div', { cls: 'summary-card guide-card' }, [
    el('h3', { text: 'How to think about this page' }),
    el('p', { text: 'Do not build a perfect hero. Build a person. A Greenhorn should already have strengths, but there should still be holes in the hull.' }),
    el('p', { cls: 'muted', text: 'Life Points come from Vitality and Willpower. Initiative comes from Agility and Alertness.' })
  ]));

  const wrap = el('div', { cls: 'table-wrap' });
  wrap.append(el('div', { cls: 'attribute-row header' }, [
    el('div', { text: 'Attribute' }),
    el('div', { text: 'Die' }),
    el('div', { text: 'Cost' }),
    el('div', { text: 'What it covers' })
  ]));

  const helpText = {
    Agility: 'Speed, finesse, balance, and reflexes.',
    Strength: 'Lift, shove, grapple, and raw force.',
    Vitality: 'Toughness, resilience, and staying power.',
    Alertness: 'Notice the world before it notices you.',
    Intelligence: 'Reason, training, analysis, and know-how.',
    Willpower: 'Grit, nerve, and mental backbone.'
  };

  ATTRIBUTE_LIST.forEach((attribute) => {
    const select = document.createElement('select');
    ATTRIBUTE_OPTIONS.forEach((option) => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      if (state.character.attributes[attribute] === option) opt.selected = true;
      select.append(opt);
    });

    select.addEventListener('change', (event) => onChange((draft) => {
      draft.attributes[attribute] = event.target.value;
    }));

    wrap.append(el('div', { cls: 'attribute-row' }, [
      el('div', { text: attribute }),
      select,
      el('div', { html: `<span class="points-badge">${dieCost(state.character.attributes[attribute])}</span>` }),
      el('div', { cls: 'muted', text: helpText[attribute] })
    ]));
  });

  const summary = el('div', { cls: 'grid-2' }, [
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Derived values' }),
      el('p', { html: `Life Points: <strong>${state.computed.lifePoints}</strong>` }),
      el('p', { html: `Initiative: <strong>${state.computed.initiative}</strong>` })
    ]),
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Spend reminder' }),
      el('p', { text: '42 points, no leftovers, no mercy. Greenhorn max is d12.' })
    ])
  ]);

  root.append(wrap, summary);
  return root;
}
