import { SKILLS } from '../data/skills.js';
import { el, field, sectionHeader } from '../ui.js';

const ROLE_OPTIONS = [
  'Captain',
  'Pilot',
  'Mechanic / Engineer',
  'Medic',
  'Public Relations',
  'Cargo / Business',
  'Security / Watch',
  'Cook / Utility Hand',
  'Shuttle Hand / General Crew',
  'Passenger',
  'Registered Companion',
  'Hired Specialist',
  'Drifter / Hired Hand',
  'Other'
];

const ROLE_DEFAULT_SKILLS = {
  'Captain': 'Influence',
  'Pilot': 'Pilot',
  'Mechanic / Engineer': 'Mechanical Engineering',
  'Medic': 'Medical Expertise',
  'Public Relations': 'Influence',
  'Cargo / Business': 'Knowledge',
  'Security / Watch': 'Guns',
  'Cook / Utility Hand': 'Craft',
  'Shuttle Hand / General Crew': 'Athletics',
  'Passenger': 'Knowledge',
  'Registered Companion': 'Influence',
  'Hired Specialist': 'Technical Engineering',
  'Drifter / Hired Hand': 'Survival',
  'Other': ''
};

const ROLE_SKILL_OPTIONS = {
  'Captain': ['Influence', 'Discipline', 'Knowledge'],
  'Pilot': ['Pilot', 'Planetary Vehicles', 'Technical Engineering'],
  'Mechanic / Engineer': ['Mechanical Engineering', 'Technical Engineering', 'Knowledge'],
  'Medic': ['Medical Expertise', 'Scientific Expertise', 'Knowledge'],
  'Public Relations': ['Influence', 'Perception', 'Knowledge'],
  'Cargo / Business': ['Knowledge', 'Influence', 'Perception'],
  'Security / Watch': ['Guns', 'Melee Weapon Combat', 'Discipline', 'Perception'],
  'Cook / Utility Hand': ['Craft', 'Knowledge', 'Perception'],
  'Shuttle Hand / General Crew': ['Athletics', 'Mechanical Engineering', 'Technical Engineering', 'Perception'],
  'Passenger': ['Knowledge', 'Influence', 'Perception'],
  'Registered Companion': ['Influence', 'Performance', 'Perception'],
  'Hired Specialist': ['Technical Engineering', 'Scientific Expertise', 'Medical Expertise', 'Knowledge'],
  'Drifter / Hired Hand': ['Survival', 'Athletics', 'Perception', 'Guns'],
  'Other': []
};

const HOMEWORLD_UNKNOWN = '__unknown__';
const HOMEWORLD_CUSTOM = '__custom__';
const HOMEWORLD_GROUPS = [
  { label: 'Core', worlds: ['Ariel', 'Bernadette', 'Londinium', 'Osiris', 'Sihnon'] },
  { label: 'Border / Mid-Rim', worlds: ['Beaumonde', 'Bellerophon', 'Boros', 'Hera', 'Newhall', 'Paquin', 'Persephone', 'Santo', 'Verbena'] },
  { label: 'Rim', worlds: ['Athens', 'Beylix', 'Ezra', 'Greenleaf', 'Jiangyin', 'Regina', 'Shadow', 'St. Albans', 'Triumph', 'Whitefall'] }
];
const ALL_HOMEWORLDS = HOMEWORLD_GROUPS.flatMap((group) => group.worlds);

function getRoleSkillOptions(role) {
  if (role === 'Other') return SKILLS.map((skill) => skill.name);
  return ROLE_SKILL_OPTIONS[role] || [];
}

function getRoleDefaultSkill(role) {
  const preferred = ROLE_DEFAULT_SKILLS[role] || '';
  const options = getRoleSkillOptions(role);
  if (preferred && options.includes(preferred)) return preferred;
  return options[0] || '';
}

function buildSelect(options, current) {
  const select = document.createElement('select');
  const blank = document.createElement('option');
  blank.value = '';
  blank.textContent = 'Choose...';
  select.append(blank);

  options.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    if (current === option) opt.selected = true;
    select.append(opt);
  });

  return select;
}

function buildHomeworldSelect(current) {
  const select = document.createElement('select');
  [
    [HOMEWORLD_UNKNOWN, 'Unknown / Not Sure'],
    [HOMEWORLD_CUSTOM, 'Custom World...']
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
  if (raw === HOMEWORLD_UNKNOWN || raw === HOMEWORLD_CUSTOM) return raw;
  if (ALL_HOMEWORLDS.includes(raw)) return raw;
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
  if (selection === HOMEWORLD_CUSTOM) return 'Pick Custom World if your character comes from an obscure rock not in the starter list below.';
  if (selection === HOMEWORLD_UNKNOWN) return 'New players can safely leave this unknown for now. Core worlds are richer, Border worlds are mixed, and Rim worlds are rougher.';
  const group = HOMEWORLD_GROUPS.find((entry) => entry.worlds.includes(selection));
  if (!group) return 'Choose a homeworld if you know it, or leave it unknown if you are still finding the character.';
  if (group.label === 'Core') return 'Core world: richer, more crowded, and tighter under Alliance control.';
  if (group.label === 'Border / Mid-Rim') return 'Border / Mid-Rim world: mixed comfort, mixed danger, and busier trade lanes.';
  return 'Rim world: harder life, more independence, and less safety when trouble comes looking.';
}

export function displayHomeworld(basics) {
  const selection = resolveHomeworldSelection(basics);
  if (selection === HOMEWORLD_CUSTOM) return (getCustomHomeworldValue(basics) || 'Custom World').trim();
  if (selection === HOMEWORLD_UNKNOWN) return 'Unknown / Not Sure';
  return selection || '—';
}

export function renderBasicsStep(state, onChange) {
  const root = el('div');
  root.append(sectionHeader('Step 1: Basics', 'Who is this poor soul, what do they do aboard ship, and which core skill gets the role-training discount at creation.'));

  const grid = el('div', { cls: 'grid-2' });
  const left = el('div', { cls: 'field-card' });
  const right = el('div', { cls: 'field-card' });

  const basics = [
    ['Name', 'name'],
    ['Quote', 'quote'],
    ['Concept', 'concept']
  ];

  basics.forEach(([labelText, key]) => {
    const input = document.createElement('input');
    input.value = state.character.basics[key] || '';
    input.addEventListener('input', (event) => onChange((draft) => { draft.basics[key] = event.target.value; }));
    left.append(field(labelText, input));
  });

  const homeworldSelection = resolveHomeworldSelection(state.character.basics);
  const homeworldSelect = buildHomeworldSelect(homeworldSelection);
  homeworldSelect.addEventListener('change', (event) => onChange((draft) => {
    const next = event.target.value;
    if (next === HOMEWORLD_UNKNOWN) {
      draft.basics.homeworld = HOMEWORLD_UNKNOWN;
    } else if (next === HOMEWORLD_CUSTOM) {
      draft.basics.homeworld = HOMEWORLD_CUSTOM;
      if (!draft.basics.customHomeworld) {
        const raw = (state.character.basics.homeworld || '').trim();
        if (raw && !ALL_HOMEWORLDS.includes(raw) && raw !== HOMEWORLD_UNKNOWN && raw !== HOMEWORLD_CUSTOM) {
          draft.basics.customHomeworld = raw;
        }
      }
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
    if ((draft.basics.homeworld || '').trim() !== HOMEWORLD_CUSTOM) {
      draft.basics.homeworld = HOMEWORLD_CUSTOM;
    }
  }));
  left.append(field('Custom Homeworld', customHomeworld, 'Only used if Homeworld is set to Custom World.'));

  const currentRoleValue = ROLE_OPTIONS.includes(state.character.basics.role || '') ? (state.character.basics.role || '') : ((state.character.basics.role || '') ? 'Other' : '');
  const roleSelect = buildSelect(ROLE_OPTIONS, currentRoleValue);
  roleSelect.addEventListener('change', (event) => onChange((draft) => {
    const nextRole = event.target.value;
    draft.basics.role = nextRole;
    const allowed = getRoleSkillOptions(nextRole);
    if (!allowed.includes(draft.basics.roleSkill || '')) {
      draft.basics.roleSkill = getRoleDefaultSkill(nextRole);
    }
  }));
  left.append(field('Role on the Crew', roleSelect, 'This is the shipboard lane the crew expects you to fill.'));

  const customRole = document.createElement('input');
  customRole.value = state.character.basics.customRole || ((currentRoleValue === 'Other' && state.character.basics.role && !ROLE_OPTIONS.includes(state.character.basics.role)) ? state.character.basics.role : '');
  customRole.placeholder = 'Only used if Role on the Crew is Other';
  customRole.disabled = (state.character.basics.role || '') !== 'Other';
  customRole.addEventListener('input', (event) => onChange((draft) => { draft.basics.customRole = event.target.value; }));
  left.append(field('Custom Role Label', customRole, 'Leave blank unless you chose Other.'));

  const roleSkillOptions = getRoleSkillOptions(currentRoleValue);
  const currentRoleSkill = roleSkillOptions.includes(state.character.basics.roleSkill || '') ? (state.character.basics.roleSkill || '') : '';
  const roleSkillSelect = buildSelect(roleSkillOptions, currentRoleSkill);
  roleSkillSelect.disabled = !currentRoleValue;
  roleSkillSelect.addEventListener('change', (event) => onChange((draft) => { draft.basics.roleSkill = event.target.value; }));
  left.append(field('Role Skill (Free d2 at Creation)', roleSkillSelect, currentRoleValue === 'Other'
    ? 'Other lets you choose any one core skill. All other crew roles are limited to the short list that actually fits the job.'
    : 'This list is narrowed to the core skills that make sense for the chosen crew role. The chosen skill gets a free +d2 step during character creation only.'));

  const background = document.createElement('textarea');
  background.value = state.character.basics.background || '';
  background.addEventListener('input', (event) => onChange((draft) => { draft.basics.background = event.target.value; }));
  right.append(field('Background / Notes', background, 'Keep it short. Enough to know what sort of trouble they carry around.'));

  const info = el('div', { cls: 'summary-card' }, [
    el('h3', { text: 'Role Prompt' }),
    el('p', { text: state.character.basics.role
      ? `${state.character.basics.role}${roleSkillOptions.length ? ` can choose from ${roleSkillOptions.join(', ')}.` : ' has no listed role skills, so choose one that fits.'}`
      : 'Pick a shipboard role first. This keeps the character tied to the crew instead of drifting like spare cargo.' }),
    el('p', { cls: 'muted', text: 'The role skill house rule only touches the chosen core skill during creation. It does not add a standing bonus to rolls at the table.' })
  ]);
  right.append(info);

  grid.append(left, right);
  root.append(grid);
  return root;
}
