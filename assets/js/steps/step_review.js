import { formatEquipmentPrice, getPurchasedGearTotal } from '../data/equipment.js';
import { calculateCurrentCredits, formatMoney, resolveStartingCredits } from '../data/gear_packages.js';
import { resolveRoleLabel } from '../data/roles.js';
import { getSpecialtyDisplayName } from '../data/specialties.js';
import { findCuratedTrait } from '../data/traits.js';
import { effectiveGeneralRating } from '../rules.js';
import { el, sectionHeader } from '../ui.js';

function resolveTraitRank(meta, rating = 'none') {
  if (!meta) return '';
  if (meta.rankByRating?.[rating]) return meta.rankByRating[rating];
  return meta.rank || '';
}

function summarizeSkills(character) {
  const entries = Object.entries(character.skills)
    .map(([name, skill]) => {
      const specialties = (skill.specialties || [])
        .filter((item) => item.rating !== 'none' && getSpecialtyDisplayName(item))
        .map((item) => `${getSpecialtyDisplayName(item)} ${item.rating}`);
      return { name, rating: effectiveGeneralRating(character, name), specialties };
    })
    .filter((item) => item.rating !== 'none' || item.specialties.length)
    .sort((a, b) => ['none', 'd2', 'd4', 'd6'].indexOf(b.rating) - ['none', 'd2', 'd4', 'd6'].indexOf(a.rating));

  if (!entries.length) return el('p', { cls: 'muted', text: 'No skills bought yet.' });
  return el('ul', { cls: 'summary-list' }, entries.map((item) => {
    const skillText = item.rating === 'none' ? item.name : `${item.name} ${item.rating}`;
    const specialtyText = item.specialties.length ? ` | Specialties: ${item.specialties.join(', ')}` : '';
    return el('li', { text: `${skillText}${specialtyText}` });
  }));
}

function summarizePurchasedGear(character) {
  const entries = character.details.purchasedGear || [];
  if (!entries.length) return el('p', { cls: 'muted', text: 'No catalog gear purchased.' });
  return el('ul', { cls: 'summary-list' }, entries.map((entry) =>
    el('li', { text: `${entry.name} (${entry.price || formatEquipmentPrice(entry)}, ${entry.availability}${entry.source ? `, ${entry.source}` : ''})` })
  ));
}

function summarizeTraits(character, category) {
  const entries = (category === 'asset' ? character.traits.assets : character.traits.complications)
    .filter((item) => item.name && item.rating !== 'none');

  if (!entries.length) {
    return el('p', { cls: 'muted', text: category === 'asset' ? 'No assets selected yet.' : 'No complications selected yet.' });
  }

  return el('ul', { cls: 'summary-list' }, entries.map((entry) => {
    const meta = findCuratedTrait(category, entry.name);
    const displayName = meta?.name || entry.name;
    const resolvedRank = resolveTraitRank(meta, entry.rating);
    const heading = resolvedRank ? `${displayName} (${resolvedRank})` : `${displayName} ${entry.rating}`;
    const benefit = meta?.benefits?.[entry.rating] || '';
    const detail = [meta?.summary, meta?.description, benefit, meta?.gmApproval ? 'GM approval required.' : '', meta?.note, entry.notes].filter(Boolean);

    if (meta?.plotPointTable?.length) {
      return el('li', {}, [
        el('strong', { text: heading }),
        ...detail.map((line) => el('p', { cls: 'sheet-copy', text: line })),
        el('ul', { cls: 'summary-list trait-nested-list' }, meta.plotPointTable.map((row) =>
          el('li', { text: `${row.cost}: ${row.result}` })
        ))
      ]);
    }

    return el('li', { text: detail.length ? `${heading} - ${detail.join(' ')}` : heading });
  }));
}

export function renderReviewStep(state) {
  const root = el('div');
  root.append(sectionHeader('Step 8: Review', 'Look over the character as a whole before you open the finished play sheet. This is where you catch holes in the story as well as holes in the math.'));

  root.append(el('div', { cls: 'summary-card guide-card' }, [
    el('h3', { text: 'Questions worth asking' }),
    el('ul', { cls: 'summary-list' }, [
      el('li', { text: 'Does this person actually fit the role they claim aboard ship?' }),
      el('li', { text: 'Do the Assets and Complications feel like the same person?' }),
      el('li', { text: 'Would you know how to play them in the first five minutes of a session?' })
    ])
  ]));

  const grid = el('div', { cls: 'grid-2' });
  grid.append(
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Identity' }),
      el('p', { html: `<strong>Name:</strong> ${state.character.basics.name || '-'}` }),
      el('p', { html: `<strong>Concept:</strong> ${state.character.basics.concept || '-'}` }),
      state.character.basics.quote ? el('p', { html: `<strong>Quote:</strong> ${state.character.basics.quote}` }) : null,
      el('p', { html: `<strong>Role:</strong> ${resolveRoleLabel(state.character.basics)}` }),
      el('p', { html: `<strong>Role Skill:</strong> ${state.character.basics.roleSkill || '-'}` }),
      el('p', { html: `<strong>Homeworld:</strong> ${state.character.basics.homeworld || '-'}` })
    ]),
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Crew Hooks' }),
      el('p', { html: `<strong>Why the crew keeps them:</strong> ${state.character.basics.crewValue || '-'}` }),
      el('p', { html: `<strong>Connection:</strong> ${state.character.basics.crewConnection || '-'}` }),
      el('p', { html: `<strong>What they want:</strong> ${state.character.basics.crewMotivation || '-'}` })
    ]),
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Skills & Specialties' }),
      summarizeSkills(state.character)
    ]),
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Traits' }),
      el('p', { html: '<strong>Assets:</strong>' }),
      summarizeTraits(state.character, 'asset'),
      el('p', { html: '<strong>Complications:</strong>' }),
      summarizeTraits(state.character, 'complication')
    ]),
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Gear & Money' }),
      el('p', { html: `<strong>Starting Credits:</strong> ${formatMoney(resolveStartingCredits(state.character), '\u20a1')}` }),
      el('p', { html: `<strong>Current Credits:</strong> ${formatMoney(calculateCurrentCredits(state.character), '\u20a1')}` }),
      el('p', { html: `<strong>Catalog Gear Total:</strong> ${formatMoney(getPurchasedGearTotal(state.character.details), '\u20a1', '0 \u20a1')}` }),
      el('p', { html: `<strong>Platinum Pieces:</strong> ${formatMoney(state.character.details.platinum, 'p')}` }),
      el('p', { html: `<strong>Money Notes:</strong> ${state.character.details.moneyNotes || '-'}` }),
      summarizePurchasedGear(state.character),
      el('p', { html: `<strong>Additional Personal Gear:</strong> ${state.character.details.gear || '-'}` }),
      el('p', { html: `<strong>Extra Notes:</strong> ${state.character.details.notes || '-'}` })
    ]),
    el('div', { cls: `validation-box${state.computed.valid ? ' ok' : ''}` }, [
      el('h3', { text: state.computed.valid ? 'Build looks legal.' : 'Build still needs fixing.' }),
      state.computed.valid
        ? el('p', { text: 'If the story feels right too, open the play sheet.' })
        : el('ul', { cls: 'summary-list' }, state.computed.errors.map((error) => el('li', { text: error })))
    ])
  );

  root.append(grid);
  return root;
}
