import { SKILLS } from './skills.js';

export const ROLE_OPTIONS = [
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
  'Companion',
  'Hired Specialist',
  'Drifter / Hired Hand',
  'Other'
];

export const ROLE_DEFAULT_SKILLS = {
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
  'Companion': 'Influence',
  'Hired Specialist': 'Technical Engineering',
  'Drifter / Hired Hand': 'Survival',
  'Other': ''
};

export const ROLE_SKILL_OPTIONS = {
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
  'Companion': ['Influence', 'Performance', 'Perception'],
  'Hired Specialist': ['Technical Engineering', 'Scientific Expertise', 'Medical Expertise', 'Knowledge'],
  'Drifter / Hired Hand': ['Survival', 'Athletics', 'Perception', 'Guns'],
  'Other': []
};

export const ROLE_GUIDANCE = {
  'Captain': 'You keep the outfit moving. You are the one making the call when the deck is on fire and everybody wants a different miracle.',
  'Pilot': 'You put the boat where it needs to go. If things turn ugly in the black or the atmo, your hands decide whether the crew keeps breathing.',
  'Mechanic / Engineer': 'You keep old machinery loyal through lies, sweat, and profanity. If the boat is still flying, you probably had a hand in the argument.',
  'Medic': 'You keep folk alive long enough to regret their decisions. A ship without a medic runs out of luck fast.',
  'Public Relations': 'When the crew needs charm, bluff, menace, or a smile with teeth, you are the one they put in front of strangers.',
  'Cargo / Business': 'You track what is owed, what is loaded, what is legal, and which lie belongs on which form.',
  'Security / Watch': 'You are here to notice trouble before it reaches the hatch, and to make trouble think twice once it does.',
  'Cook / Utility Hand': 'A working boat needs more than glamour jobs. You keep the little necessities from becoming big disasters.',
  'Shuttle Hand / General Crew': 'You are the spare set of hands every boat needs. Loading, patching, hauling, watching, whatever keeps the crew moving.',
  'Passenger': 'You are not ship’s crew, but you still need a reason the others let you stay aboard when things get tight.',
  'Companion': 'You are aboard by arrangement, not duty. Your value comes from money, access, leverage, or the doors you can open.',
  'Hired Specialist': 'You are here because there is one thing you do better than the rest of the crew, and somebody decided it was worth your berth.',
  'Drifter / Hired Hand': 'You signed on because drifting got expensive. Maybe you are running from something, maybe toward it.',
  'Other': 'Pick this only if the usual lanes do not fit. If you do, be ready to explain why the crew keeps you around.'
};

export function getAllowedRoleSkills(role) {
  if (role === 'Other') return SKILLS.map((skill) => skill.name);
  return ROLE_SKILL_OPTIONS[role] || [];
}

export function getDefaultRoleSkill(role) {
  const preferred = ROLE_DEFAULT_SKILLS[role] || '';
  const options = getAllowedRoleSkills(role);
  if (preferred && options.includes(preferred)) return preferred;
  return options[0] || '';
}

export function getRoleGuidance(role) {
  return ROLE_GUIDANCE[role] || 'Pick the lane that gives this character a reason to be aboard when the crew is under pressure.';
}

export function resolveRoleLabel(basics) {
  if ((basics.role || '') === 'Other') {
    return basics.customRole?.trim() || 'Other';
  }
  return basics.role || '—';
}
