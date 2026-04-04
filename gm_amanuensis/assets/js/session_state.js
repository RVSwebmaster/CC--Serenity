import { hydrateCharacter } from '../../../assets/js/state.js';
import {
  createConditionState,
  parseInitiativeValue,
  sanitizeConditionState
} from './condition_tracking.js';
import { pickNextTabColor } from './tab_palette.js';

const DEFAULT_SHIP = Object.freeze({
  name: 'Serenity',
  className: 'Firefly-class transport',
  concept: 'Battered free-trader, reluctant sanctuary, and getaway crate with opinions.',
  editLocked: true,
  specifications: {
    dimensions: '191 x 128 x 53 ft',
    tonnage: 'Mid-bulk transport frame',
    speedClass: '4 cruise / 6 hard burn',
    crewQuarters: '24 double cabins',
    fuelCapacity: '60 tons (600 hours)',
    cargoCapacity: 'Two 40-ton holds / max deck load as rig allows',
    passengerCapacity: 'Variable bunks, common room overflow, and one shuttle cabin',
    gear: 'Shuttle, mule, cargo crane, grapples, infirmary corner, machine shop',
    price: '48,960 credits',
    complexity: 'Simple',
    maintenanceCost: '3,872 credits / year'
  },
  attributes: {
    agility: 'd8',
    strength: 'd12',
    vitality: 'd10',
    alertness: 'd6',
    intelligence: 'd4',
    willpower: 'd6',
    initiative: 'd14',
    life: '18'
  },
  traits: 'Atmospheric-capable\nSeen Better Days\nWorkhorse profile\nStubborn to kill',
  skills: 'Planetary Operations d6\nMechanical Systems d8\nSensor Sweep d4\nCargo Handling d6',
  condition: {
    hull: 'Nominal',
    drive: 'Touchy',
    posture: 'Running Cold',
    currentDamage: 'Patch scars, stress fractures, and one more thing vibrating than ought to be.',
    systemState: 'Running, but every subsystem has opinions.',
    currentLife: '18',
    performanceNotes: ''
  },
  notes: '',
  jack: {
    name: 'Jack',
    role: 'Resident Former Crewman',
    attitude: 'Believes the ship is his, tolerates the crew as transport staff.',
    attributes: {
      agility: 'd10',
      strength: 'd2',
      vitality: 'd4',
      alertness: 'd8',
      intelligence: 'd6',
      willpower: 'd8'
    },
    lifePoints: '12',
    initiative: 'd10 + d8',
    skills: [
      'Climbing d10',
      'Dodge d10',
      'Stealth d10',
      'Sleight of Hand d8',
      'Hearing d8',
      'Sight d8',
      'Bite / Scratch d6'
    ],
    condition: 'Watching from the ducts',
    traits: 'Knows hidden crawlspaces, judges visitors, and steals unattended snacks.',
    notes: ''
  }
});

const ENEMY_TRACKER_COUNT = 8;
const ENEMY_LIFE_MAX = 20;

function makeId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `crew_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeText(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function clampEnemyLife(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(ENEMY_LIFE_MAX, parsed));
}

function createDefaultEnemyTrackers() {
  return Array.from({ length: ENEMY_TRACKER_COUNT }, (_, index) => ({
    id: `enemy_${index + 1}`,
    label: `Enemy ${index + 1}`,
    life: 0
  }));
}

function sanitizeEnemyTrackers(input) {
  const fallback = createDefaultEnemyTrackers();
  const source = Array.isArray(input) ? input : [];

  return fallback.map((entry, index) => {
    const incoming = source[index] && typeof source[index] === 'object' && !Array.isArray(source[index]) ? source[index] : {};
    return {
      id: entry.id,
      label: sanitizeText(incoming.label, entry.label),
      life: clampEnemyLife(incoming.life)
    };
  });
}

function createDefaultShipState() {
  return structuredClone(DEFAULT_SHIP);
}

function sanitizeShipState(input) {
  const fallback = createDefaultShipState();
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const sourceCondition = source.condition && typeof source.condition === 'object' && !Array.isArray(source.condition)
    ? source.condition
    : {};
  const sourceJack = source.jack && typeof source.jack === 'object' && !Array.isArray(source.jack)
    ? source.jack
    : {};
  const sourceJackAttributes = sourceJack.attributes && typeof sourceJack.attributes === 'object' && !Array.isArray(sourceJack.attributes)
    ? sourceJack.attributes
    : {};
  const sourceSpecifications = source.specifications && typeof source.specifications === 'object' && !Array.isArray(source.specifications)
    ? source.specifications
    : {};
  const sourceAttributes = source.attributes && typeof source.attributes === 'object' && !Array.isArray(source.attributes)
    ? source.attributes
    : {};

  return {
    name: sanitizeText(source.name, fallback.name),
    className: sanitizeText(source.className, fallback.className),
    concept: sanitizeText(source.concept, fallback.concept),
    editLocked: typeof source.editLocked === 'boolean' ? source.editLocked : fallback.editLocked,
    specifications: {
      dimensions: sanitizeText(sourceSpecifications.dimensions, fallback.specifications.dimensions),
      tonnage: sanitizeText(sourceSpecifications.tonnage, fallback.specifications.tonnage),
      speedClass: sanitizeText(sourceSpecifications.speedClass, fallback.specifications.speedClass),
      crewQuarters: sanitizeText(sourceSpecifications.crewQuarters, fallback.specifications.crewQuarters),
      fuelCapacity: sanitizeText(sourceSpecifications.fuelCapacity, fallback.specifications.fuelCapacity),
      cargoCapacity: sanitizeText(sourceSpecifications.cargoCapacity, fallback.specifications.cargoCapacity),
      passengerCapacity: sanitizeText(sourceSpecifications.passengerCapacity, fallback.specifications.passengerCapacity),
      gear: sanitizeText(sourceSpecifications.gear, fallback.specifications.gear),
      price: sanitizeText(sourceSpecifications.price, fallback.specifications.price),
      complexity: sanitizeText(sourceSpecifications.complexity, fallback.specifications.complexity),
      maintenanceCost: sanitizeText(sourceSpecifications.maintenanceCost, fallback.specifications.maintenanceCost)
    },
    attributes: {
      agility: sanitizeText(sourceAttributes.agility, fallback.attributes.agility),
      strength: sanitizeText(sourceAttributes.strength, fallback.attributes.strength),
      vitality: sanitizeText(sourceAttributes.vitality, fallback.attributes.vitality),
      alertness: sanitizeText(sourceAttributes.alertness, fallback.attributes.alertness),
      intelligence: sanitizeText(sourceAttributes.intelligence, fallback.attributes.intelligence),
      willpower: sanitizeText(sourceAttributes.willpower, fallback.attributes.willpower),
      initiative: sanitizeText(sourceAttributes.initiative, fallback.attributes.initiative),
      life: sanitizeText(sourceAttributes.life, fallback.attributes.life)
    },
    traits: sanitizeText(source.traits, fallback.traits),
    skills: sanitizeText(source.skills, fallback.skills),
    condition: {
      hull: sanitizeText(sourceCondition.hull, fallback.condition.hull),
      drive: sanitizeText(sourceCondition.drive, fallback.condition.drive),
      posture: sanitizeText(sourceCondition.posture, fallback.condition.posture),
      currentDamage: sanitizeText(sourceCondition.currentDamage, fallback.condition.currentDamage),
      systemState: sanitizeText(sourceCondition.systemState, fallback.condition.systemState),
      currentLife: sanitizeText(sourceCondition.currentLife, fallback.condition.currentLife),
      performanceNotes: sanitizeText(sourceCondition.performanceNotes, fallback.condition.performanceNotes)
    },
    notes: sanitizeText(source.notes, fallback.notes),
    jack: {
      name: sanitizeText(sourceJack.name, fallback.jack.name),
      role: sanitizeText(sourceJack.role, fallback.jack.role),
      attitude: sanitizeText(sourceJack.attitude, fallback.jack.attitude),
      attributes: {
        agility: sanitizeText(sourceJackAttributes.agility, fallback.jack.attributes.agility),
        strength: sanitizeText(sourceJackAttributes.strength, fallback.jack.attributes.strength),
        vitality: sanitizeText(sourceJackAttributes.vitality, fallback.jack.attributes.vitality),
        alertness: sanitizeText(sourceJackAttributes.alertness, fallback.jack.attributes.alertness),
        intelligence: sanitizeText(sourceJackAttributes.intelligence, fallback.jack.attributes.intelligence),
        willpower: sanitizeText(sourceJackAttributes.willpower, fallback.jack.attributes.willpower)
      },
      lifePoints: sanitizeText(sourceJack.lifePoints, fallback.jack.lifePoints),
      initiative: sanitizeText(sourceJack.initiative, fallback.jack.initiative),
      skills: Array.isArray(sourceJack.skills) && sourceJack.skills.length > 0
        ? sourceJack.skills.map((skill) => sanitizeText(skill)).filter(Boolean)
        : [...fallback.jack.skills],
      condition: sanitizeText(sourceJack.condition, fallback.jack.condition),
      traits: sanitizeText(sourceJack.traits, fallback.jack.traits),
      notes: sanitizeText(sourceJack.notes, fallback.jack.notes)
    }
  };
}

function agilityDieSides(character) {
  const match = /^d(\d+)$/i.exec(character.attributes?.Agility || '');
  return match ? Number.parseInt(match[1], 10) : 0;
}

function rollAgilityTieBreaker(payload) {
  const character = hydrateCharacter(payload);
  const sides = agilityDieSides(character);
  if (!Number.isFinite(sides) || sides <= 0) return 0;
  return Math.floor(Math.random() * sides) + 1;
}

function getCharacterId(payload) {
  const character = hydrateCharacter(payload);
  return typeof character.meta?.characterId === 'string' && character.meta.characterId.trim()
    ? character.meta.characterId
    : null;
}

function normalizeCrewMember(record, fallbackColor = '') {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  if (!record.payload || typeof record.payload !== 'object' || Array.isArray(record.payload)) return null;

  const character = hydrateCharacter(record.payload);
  const seed = createConditionState(character.trackers, {
    tabColor: record.gm?.tabColor || fallbackColor
  });
  const gm = sanitizeConditionState(record.gm, seed);

  return {
    id: typeof record.id === 'string' && record.id ? record.id : makeId(),
    sourceName: typeof record.sourceName === 'string' && record.sourceName.trim()
      ? record.sourceName
      : 'Imported Serenity JSON',
    importedAt: typeof record.importedAt === 'string' && record.importedAt
      ? record.importedAt
      : new Date().toISOString(),
    payload: structuredClone(record.payload),
    gm: {
      ...gm,
      tabColor: gm.tabColor || fallbackColor
    }
  };
}

function ensureTieBreakers(crew) {
  const groups = new Map();
  const nextCrew = crew.map((member, index) => {
    const initiativeValue = parseInitiativeValue(member.gm.initiativeValue);
    const clone = structuredClone(member);
    clone.__orderIndex = index;
    clone.__initiativeValue = initiativeValue;

    if (initiativeValue !== null) {
      if (!groups.has(initiativeValue)) groups.set(initiativeValue, []);
      groups.get(initiativeValue).push(clone);
    }

    return clone;
  });

  groups.forEach((members, initiativeValue) => {
    if (members.length < 2) return;
    members.forEach((member) => {
      if (member.gm.tieBreakerInitiative !== initiativeValue || !Number.isFinite(member.gm.tieBreakerRoll)) {
        member.gm.tieBreakerInitiative = initiativeValue;
        member.gm.tieBreakerRoll = rollAgilityTieBreaker(member.payload);
      }
    });
  });

  nextCrew.sort((left, right) => {
    if (left.__initiativeValue === null && right.__initiativeValue === null) {
      return left.__orderIndex - right.__orderIndex;
    }
    if (left.__initiativeValue === null) return 1;
    if (right.__initiativeValue === null) return -1;
    if (left.__initiativeValue !== right.__initiativeValue) {
      return right.__initiativeValue - left.__initiativeValue;
    }

    const leftTie = left.gm.tieBreakerInitiative === left.__initiativeValue ? left.gm.tieBreakerRoll || 0 : 0;
    const rightTie = right.gm.tieBreakerInitiative === right.__initiativeValue ? right.gm.tieBreakerRoll || 0 : 0;

    if (leftTie !== rightTie) {
      return rightTie - leftTie;
    }

    return left.__orderIndex - right.__orderIndex;
  });

  nextCrew.forEach((member) => {
    delete member.__orderIndex;
    delete member.__initiativeValue;
  });

  return nextCrew;
}

function normalizeSession(session) {
  const crew = ensureTieBreakers(Array.isArray(session?.crew) ? session.crew : []);
  const crewIds = new Set(crew.map((member) => member.id));
  const validTabs = new Set(['gm', 'transit', 'ship', ...crewIds]);
  const activeTab = validTabs.has(session?.activeTab) ? session.activeTab : 'gm';
  const currentTurnMemberId = crewIds.has(session?.currentTurnMemberId)
    ? session.currentTurnMemberId
    : (crew[0]?.id || null);

  return {
    crew,
    ship: sanitizeShipState(session?.ship),
    enemyTrackers: sanitizeEnemyTrackers(session?.enemyTrackers),
    activeTab,
    currentTurnMemberId
  };
}

function makeImportedMembers(session, importedCrew) {
  const usedColors = session.crew.map((member) => member.gm.tabColor).filter(Boolean);

  return importedCrew.map((record) => {
    const tabColor = pickNextTabColor(usedColors);
    usedColors.push(tabColor);
    return normalizeCrewMember({
      id: makeId(),
      sourceName: record.sourceName,
      importedAt: new Date().toISOString(),
      payload: record.payload,
      gm: { tabColor }
    }, tabColor);
  }).filter(Boolean);
}

export function createCrewMember({ payload, sourceName, tabColor }) {
  return normalizeCrewMember({
    id: makeId(),
    sourceName,
    importedAt: new Date().toISOString(),
    payload,
    gm: { tabColor }
  }, tabColor);
}

export function createSessionState(seed) {
  const baseCrew = Array.isArray(seed?.crew)
    ? seed.crew.map((member) => normalizeCrewMember(member)).filter(Boolean)
    : [];

  return normalizeSession({
    crew: baseCrew,
    ship: seed?.ship,
    activeTab: seed?.activeTab || 'gm',
    currentTurnMemberId: seed?.currentTurnMemberId || null
  });
}

export function mergeImportedCrew(session, importedCrew) {
  const usedColors = session.crew.map((member) => member.gm.tabColor).filter(Boolean);
  const existingByCharacterId = new Map(
    session.crew
      .map((member) => [getCharacterId(member.payload), member])
      .filter(([characterId]) => typeof characterId === 'string' && characterId)
  );

  let crew = [...session.crew];
  let firstNewMemberId = null;
  let addedCount = 0;
  let replacedCount = 0;

  importedCrew.forEach((record) => {
    const characterId = getCharacterId(record.payload);
    const existing = characterId ? existingByCharacterId.get(characterId) : null;

    if (existing) {
      const replacement = normalizeCrewMember({
        ...existing,
        sourceName: record.sourceName,
        importedAt: new Date().toISOString(),
        payload: record.payload,
        gm: existing.gm
      }, existing.gm.tabColor);
      crew = crew.map((member) => (member.id === existing.id ? replacement : member));
      replacedCount += 1;
      return;
    }

    const tabColor = pickNextTabColor(usedColors);
    usedColors.push(tabColor);
    const member = normalizeCrewMember({
      id: makeId(),
      sourceName: record.sourceName,
      importedAt: new Date().toISOString(),
      payload: record.payload,
      gm: { tabColor }
    }, tabColor);

    if (!member) return;
    if (!firstNewMemberId) firstNewMemberId = member.id;
    crew.push(member);
    if (characterId) existingByCharacterId.set(characterId, member);
    addedCount += 1;
  });

  const nextActiveTab = session.crew.length === 0 && firstNewMemberId
    ? firstNewMemberId
    : session.activeTab;

  return {
    session: normalizeSession({
      ...session,
      crew,
      activeTab: nextActiveTab,
      currentTurnMemberId: session.currentTurnMemberId || firstNewMemberId || null
    }),
    addedCount,
    replacedCount
  };
}

export function updateCrewMember(session, memberId, mutator) {
  return normalizeSession({
    ...session,
    crew: session.crew.map((member) => (
      member.id === memberId ? normalizeCrewMember(mutator(structuredClone(member)), member.gm.tabColor) : member
    )).filter(Boolean)
  });
}

export function updateShipState(session, mutator) {
  return normalizeSession({
    ...session,
    ship: mutator(structuredClone(session.ship))
  });
}

export function removeCrewMember(session, memberId) {
  return normalizeSession({
    ...session,
    crew: session.crew.filter((member) => member.id !== memberId)
  });
}

export function clearCrew(session = {}) {
  return normalizeSession({
    ...session,
    crew: [],
    activeTab: 'gm',
    currentTurnMemberId: null
  });
}

export function updateEnemyTracker(session, trackerId, mutator) {
  return normalizeSession({
    ...session,
    enemyTrackers: (session.enemyTrackers || []).map((tracker) => (
      tracker.id === trackerId ? mutator(structuredClone(tracker)) : tracker
    ))
  });
}

export function setActiveTab(session, tabId) {
  return normalizeSession({
    ...session,
    activeTab: tabId
  });
}

export function advanceTurn(session) {
  if (session.crew.length === 0) return normalizeSession(session);

  const currentIndex = session.crew.findIndex((member) => member.id === session.currentTurnMemberId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % session.crew.length;
  const nextId = session.crew[nextIndex]?.id || null;

  return normalizeSession({
    ...session,
    currentTurnMemberId: nextId,
    activeTab: nextId || session.activeTab
  });
}

export function resetRound(session) {
  const crew = session.crew.map((member) => ({
    ...structuredClone(member),
    gm: {
      ...member.gm,
      actionState: 'Ready'
    }
  }));

  return normalizeSession({
    ...session,
    crew,
    currentTurnMemberId: crew[0]?.id || null
  });
}

export function clearInitiative(session) {
  const crew = session.crew.map((member) => ({
    ...structuredClone(member),
    gm: {
      ...member.gm,
      initiativeValue: '',
      tieBreakerRoll: null,
      tieBreakerInitiative: null
    }
  }));

  return normalizeSession({
    ...session,
    crew,
    currentTurnMemberId: crew[0]?.id || null
  });
}

export function getCrewCharacter(member) {
  return hydrateCharacter(member?.payload);
}


