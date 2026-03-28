import { getPurchasedGearTotal } from '../data/equipment.js';
import { calculateCurrentCredits, formatMoney, resolveStartingCredits } from '../data/gear_packages.js';
import { resolveRoleLabel } from '../data/roles.js';
import { getSpecialtyDisplayName } from '../data/specialties.js';
import { effectiveGeneralRating } from '../rules.js';
import { el, sectionHeader } from '../ui.js';

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
    el('li', { text: `${entry.name} (${formatMoney(entry.credits, 'â‚¡')}, ${entry.availability})` })
  ));
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
      el('p', { html: `<strong>Name:</strong> ${state.character.basics.name || 'â€”'}` }),
      el('p', { html: `<strong>Concept:</strong> ${state.character.basics.concept || 'â€”'}` }),
      state.character.basics.quote ? el('p', { html: `<strong>Quote:</strong> ${state.character.basics.quote}` }) : null,
      el('p', { html: `<strong>Role:</strong> ${resolveRoleLabel(state.character.basics)}` }),
      el('p', { html: `<strong>Role Skill:</strong> ${state.character.basics.roleSkill || 'â€”'}` }),
      el('p', { html: `<strong>Homeworld:</strong> ${state.character.basics.homeworld || 'â€”'}` })
    ]),
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Crew Hooks' }),
      el('p', { html: `<strong>Why the crew keeps them:</strong> ${state.character.basics.crewValue || 'â€”'}` }),
      el('p', { html: `<strong>Connection:</strong> ${state.character.basics.crewConnection || 'â€”'}` }),
      el('p', { html: `<strong>What they want:</strong> ${state.character.basics.crewMotivation || 'â€”'}` })
    ]),
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Skills & Specialties' }),
      summarizeSkills(state.character)
    ]),
    el('div', { cls: 'summary-card' }, [
      el('h3', { text: 'Gear & Money' }),
      el('p', { html: `<strong>Starting Credits:</strong> ${formatMoney(resolveStartingCredits(state.character), 'â‚¡')}` }),
      el('p', { html: `<strong>Current Credits:</strong> ${formatMoney(calculateCurrentCredits(state.character), 'â‚¡')}` }),
      el('p', { html: `<strong>Catalog Gear Total:</strong> ${formatMoney(getPurchasedGearTotal(state.character.details), 'â‚¡', '0 â‚¡')}` }),
      el('p', { html: `<strong>Platinum Pieces:</strong> ${formatMoney(state.character.details.platinum, 'p')}` }),
      el('p', { html: `<strong>Money Notes:</strong> ${state.character.details.moneyNotes || 'â€”'}` }),
      summarizePurchasedGear(state.character),
      el('p', { html: `<strong>Additional Personal Gear:</strong> ${state.character.details.gear || 'â€”'}` }),
      el('p', { html: `<strong>Extra Notes:</strong> ${state.character.details.notes || 'â€”'}` })
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
