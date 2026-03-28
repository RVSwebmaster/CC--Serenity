import { el, field, sectionHeader } from '../ui.js';

const HOMEWORLD_UNKNOWN = '__unknown__';
const HOMEWORLD_CUSTOM = '__custom__';
const HOMEWORLD_GROUPS = [
  { label: 'Core', worlds: ['Ariel', 'Bernadette', 'Bellerophon', 'Londinium', 'Osiris', 'Sihnon'] },
  { label: 'Border / Mid-Rim', worlds: ['Aberdeen', 'Angel', 'Ares', 'Beaumonde', 'Boros', 'Constance', 'Haven', 'Hera', 'Highgate', 'Liann Jiun', 'Miranda', 'New Melbourne', 'Newhall', 'Paquin', 'Parth', 'Persephone', 'Salisbury', 'Santo', 'Verbena'] },
  { label: 'Rim', worlds: ['Athens', 'Beylix', 'Deadwood', 'Dyton', 'Ezra', 'Greenleaf', 'Harvest', 'Higgins\' Moon', 'Ita', 'Jiangyin', 'Kerry', 'Lilac', 'Muir', 'Pelorum', 'Regina', 'Shadow', 'Silverhold', 'St. Albans', 'Three Hills', 'Triumph', 'Whittier', 'Whitefall'] }
];
const HOMEWORLD_DESCRIPTIONS = {
  Aberdeen: 'A little-known world on the edge of better maps.',
  Ariel: 'High-tech Core world of glass, steel, and Alliance order.',
  Angel: 'A settled moon with more local character than outside fame.',
  Ares: 'A little-known world on the edge of better maps.',
  Bernadette: 'Old settlement world with deep colonial roots and strong ties to expansion and new beginnings.',
  Londinium: 'Seat of Parliament and Alliance government, proud, powerful, and very Core.',
  Osiris: 'Wealthy Core world of privilege, law, medicine, and close Alliance scrutiny.',
  Sihnon: 'Ancient wealth, Eastern culture, and elite academies shape life here.',
  Beaumonde: 'Industrial Rim world where factories, trade, and tight security define daily life.',
  Bellerophon: 'Rich Core world of private estates, old money, and polished manners.',
  Boros: 'A civilized Border world under a heavy Alliance thumb, not the kind of place smugglers find relaxing.',
  Constance: 'A little-known world on the edge of better maps.',
  Haven: 'A little-known world on the edge of better maps.',
  Hera: 'Farming world forever marked by Serenity Valley and the scars of the Unification War.',
  Highgate: 'A settled moon with more local character than outside fame.',
  "Higgins' Moon": 'A settled moon with more local character than outside fame.',
  Harvest: 'A frontier world where distance matters more than polish.',
  Ita: 'A little-known world on the edge of better maps.',
  Kerry: 'A little-known world on the edge of better maps.',
  'Liann Jiun': 'A little-known world on the edge of better maps.',
  Lilac: 'A frontier world where distance matters more than polish.',
  Miranda: 'A dead world whose name still carries a bad kind of weight.',
  Muir: 'A frontier world where distance matters more than polish.',
  'New Melbourne': 'A little-known world on the edge of better maps.',
  Newhall: 'New ocean world of island chains and floating stations, still feeling half-finished.',
  Paquin: 'A lively world shaped by Romani culture, where carnivals, theaters, tourists, and hustlers all pass through the same dust.',
  Parth: 'A little-known world on the edge of better maps.',
  Pelorum: 'A frontier world where distance matters more than polish.',
  Persephone: 'Civilized on the surface, but high society and the underworld live side by side.',
  Salisbury: 'A little-known world on the edge of better maps.',
  Santo: 'Core world in the White Sun system, civilized enough on paper, but still a place where slavers and crooks do business.',
  Verbena: 'A rough Rim world reshaped by Alliance rebuilding, factory work, and the lingering wounds of the war.',
  Athens: 'Border world of constant winds, hardy crops, and quarried stone, with Whitefall hanging off it like a hard luck moon.',
  Beylix: 'Rim world with a smuggler\'s reputation and little patience for clean hands.',
  Deadwood: 'A frontier world where distance matters more than polish.',
  Dyton: 'A little-known world on the edge of better maps.',
  Ezra: 'Border world in the Georgia system, best known for the shadow cast by Niska\'s Skyplex in orbit.',
  Greenleaf: 'Jungle-heavy Border world of pharmaceuticals, black-market clippings, and tight enforcement.',
  Jiangyin: 'Border world split between settled towns and isolated hill folk with hard customs.',
  Regina: 'Hard mining world where people know sickness, labor, and the cost of survival.',
  Shadow: 'Independent-minded Border world, remembered for ranch country, Browncoats, and wartime ruin.',
  Silverhold: 'A settled moon with more local character than outside fame.',
  'St. Albans': 'Frozen mountain world where snow, cold, and rough land shape every day.',
  'Three Hills': 'A frontier world where distance matters more than polish.',
  Triumph: 'Tiny backwater world where settlers live plain, old-fashioned lives far from modern comforts.',
  Whittier: 'A settled moon with more local character than outside fame.',
  Whitefall: 'Barely civilized frontier moon where hard bargains matter more than comfort.'
};
const ALL_HOMEWORLDS = HOMEWORLD_GROUPS.flatMap((group) => group.worlds);

function buildHomeworldSelect(current) {
  const select = document.createElement('select');

  [
    [HOMEWORLD_UNKNOWN, 'Unknown / Not Sure'],
    [HOMEWORLD_CUSTOM, 'Custom / Other']
  ].forEach(([value, label]) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    if (current === value) opt.selected = true;
    select.append(opt);
  });

  HOMEWORLD_GROUPS.forEach((group) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group.label;
    group.worlds.forEach((world) => {
      const opt = document.createElement('option');
      opt.value = world;
      opt.textContent = world;
      if (current === world) opt.selected = true;
      optgroup.append(opt);
    });
    select.append(optgroup);
  });

  return select;
}

function resolveHomeworldSelection(basics) {
  const raw = (basics.homeworld || '').trim();
  if (ALL_HOMEWORLDS.includes(raw)) return raw;
  if (raw === HOMEWORLD_UNKNOWN) return HOMEWORLD_UNKNOWN;
  if (raw === HOMEWORLD_CUSTOM) return (basics.customHomeworld || '').trim() ? HOMEWORLD_CUSTOM : HOMEWORLD_UNKNOWN;
  if (raw) return HOMEWORLD_CUSTOM;
  if ((basics.customHomeworld || '').trim()) return HOMEWORLD_CUSTOM;
  return HOMEWORLD_UNKNOWN;
}

function getCustomHomeworldValue(basics) {
  const raw = (basics.homeworld || '').trim();
  if ((basics.customHomeworld || '').trim()) return basics.customHomeworld;
  if (raw && !ALL_HOMEWORLDS.includes(raw) && raw !== HOMEWORLD_UNKNOWN && raw !== HOMEWORLD_CUSTOM) return raw;
  return '';
}

function getHomeworldHelper(selection) {
  if (selection === HOMEWORLD_CUSTOM) return 'Pick Custom / Other if your character comes from an obscure rock not in the starter list below.';
  if (selection === HOMEWORLD_UNKNOWN) return 'New players can safely leave this unknown for now. Core worlds are richer, Border worlds are mixed, and Rim worlds are rougher.';
  return HOMEWORLD_DESCRIPTIONS[selection] || 'Choose a homeworld if you know it, or leave it unknown if you are still finding the character.';
}

export function renderBackgroundStep(state, onChange) {
  const root = el('div');
  root.append(sectionHeader('Step 3: Background & Ties', 'Now decide where this person came from, what they want, and why they do not feel like a stranger squatting in the same file as everyone else.'));

  const grid = el('div', { cls: 'grid-2' });
  const left = el('div', { cls: 'field-card' });
  const right = el('div', { cls: 'field-card' });

  const homeworldSelection = resolveHomeworldSelection(state.character.basics);
  const homeworldSelect = buildHomeworldSelect(homeworldSelection);
  homeworldSelect.addEventListener('change', (event) => onChange((draft) => {
    const next = event.target.value;
    if (next === HOMEWORLD_UNKNOWN) {
      draft.basics.homeworld = '';
    } else if (next === HOMEWORLD_CUSTOM) {
      const customValue = getCustomHomeworldValue(draft.basics) || getCustomHomeworldValue(state.character.basics);
      draft.basics.customHomeworld = customValue;
      draft.basics.homeworld = customValue;
    } else {
      draft.basics.homeworld = next;
    }
  }));
  left.append(field('Homeworld', homeworldSelect, getHomeworldHelper(homeworldSelection)));

  const customHomeworld = document.createElement('input');
  customHomeworld.value = getCustomHomeworldValue(state.character.basics);
  customHomeworld.placeholder = 'Enter a custom world name';
  customHomeworld.disabled = homeworldSelection !== HOMEWORLD_CUSTOM;
  customHomeworld.addEventListener('input', (event) => onChange((draft) => {
    draft.basics.customHomeworld = event.target.value;
    draft.basics.homeworld = event.target.value;
  }));
  left.append(field('Custom Homeworld', customHomeworld, 'Only used if Homeworld is set to Custom / Other.'));

  const background = document.createElement('textarea');
  background.value = state.character.basics.background || '';
  background.addEventListener('input', (event) => onChange((draft) => { draft.basics.background = event.target.value; }));
  left.append(field('Background / Notes', background, 'Keep it short. Enough to know what sort of trouble they carry around.'));

  const crewConnection = document.createElement('input');
  crewConnection.value = state.character.basics.crewConnection || '';
  crewConnection.addEventListener('input', (event) => onChange((draft) => { draft.basics.crewConnection = event.target.value; }));
  right.append(field('Connection to the Crew', crewConnection, 'A debt, a favor, a shared history, a relative, a lie, a friend, a feud. Something.'));

  const crewMotivation = document.createElement('textarea');
  crewMotivation.value = state.character.basics.crewMotivation || '';
  crewMotivation.addEventListener('input', (event) => onChange((draft) => { draft.basics.crewMotivation = event.target.value; }));
  right.append(field('What They Want From This Crew', crewMotivation, 'Money, belonging, a ride out, a purpose, a hiding place, revenge, redemption, whatever keeps them here.'));

  root.append(el('div', { cls: 'summary-card guide-card' }, [
    el('h3', { text: 'Why this page matters' }),
    el('p', { text: 'Crew games get stronger when characters arrive with hooks. These answers give the GM handles and give you reasons to stay aboard when the trouble starts costing blood.' })
  ]));

  grid.append(left, right);
  root.append(grid);
  return root;
}
