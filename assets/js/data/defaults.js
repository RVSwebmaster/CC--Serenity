export const HEROIC_LEVEL = {
  name: 'Greenhorn',
  attributePoints: 42,
  traitPoints: 0,
  skillPoints: 62,
  maxAttribute: 'd12',
  maxSkill: 'd12'
};

export const PLOT_POINT_MAX = 12;

export const ATTRIBUTE_LIST = [
  'Agility',
  'Strength',
  'Vitality',
  'Alertness',
  'Intelligence',
  'Willpower'
];

export const DIE_COSTS = {
  '-': 0,
  'none': 0,
  'd2': 2,
  'd4': 4,
  'd6': 6,
  'd8': 8,
  'd10': 10,
  'd12': 12
};

export const SPECIALTY_DIE_COSTS = {
  'none': 0,
  'd8': 2,
  'd10': 4,
  'd12': 6
};

export const ATTRIBUTE_OPTIONS = ['-', 'd2', 'd4', 'd6', 'd8', 'd10', 'd12'];
export const GENERAL_SKILL_OPTIONS = ['none', 'd2', 'd4', 'd6'];
export const SPECIALTY_OPTIONS = ['none', 'd8', 'd10', 'd12'];
export const TRAIT_OPTIONS = ['none', 'd2', 'd4'];

function makeId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createDefaultCharacter() {
  return {
    basics: {
      name: '',
      quote: '',
      portraitDataUrl: '',
      concept: '',
      role: '',
      customRole: '',
      roleSkill: '',
      crewValue: '',
      crewConnection: '',
      crewMotivation: '',
      homeworld: '',
      customHomeworld: '',
      background: ''
    },
    attributes: {
      Agility: '-',
      Strength: '-',
      Vitality: '-',
      Alertness: '-',
      Intelligence: '-',
      Willpower: '-'
    },
    traits: {
      assets: [createEmptyTrait('asset')],
      complications: [createEmptyTrait('complication')]
    },
    skills: {},
    details: {
      startingCredits: '',
      currentCredits: '',
      platinum: '',
      moneyNotes: '',
      purchasedGear: [],
      starterPackageId: '',
      starterPackageNotes: '',
      gear: '',
      notes: ''
    },
    trackers: {
      plotPoints: 6,
      stun: 0,
      wounds: 0
    },
    meta: {
      characterId: makeId(),
      heroicLevel: HEROIC_LEVEL.name,
      lastUpdated: null
    }
  };
}

export function createEmptyTrait(type = 'asset') {
  return {
    id: makeId(),
    category: type,
    name: '',
    rating: 'none',
    source: 'curated',
    notes: ''
  };
}

export function createEmptySpecialty() {
  return {
    id: makeId(),
    name: '',
    rating: 'none'
  };
}

