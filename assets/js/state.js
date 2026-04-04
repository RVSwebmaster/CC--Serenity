
import { createDefaultCharacter } from './data/defaults.js';
import { SKILLS } from './data/skills.js';
import { createEmptySpecialty } from './data/defaults.js';
import { normalizePurchasedGearEntry } from './data/equipment.js';
import { getSpecialtyDisplayName, isEmptySpecialtyEntry } from './data/specialties.js';

function normalizeLegacyRole(role) {
  return role === 'Registered Companion' ? 'Companion' : role;
}

export function hydrateCharacter(input) {
  const base = createDefaultCharacter();
  const character = structuredClone(base);

  if (!input) {
    SKILLS.forEach((skill) => {
      character.skills[skill.name] = { generalRating: 'none', specialties: [] };
    });
    return character;
  }

  Object.assign(character.basics, input.basics || {});
  character.basics.role = normalizeLegacyRole(character.basics.role || '');
  if (typeof character.basics.portraitDataUrl !== 'string') {
    character.basics.portraitDataUrl = '';
  }
  if (!character.basics.portraitDataUrl) {
    const legacyPortrait = input.basics?.portraitUrl ?? input.details?.portraitUrl;
    character.basics.portraitDataUrl = typeof legacyPortrait === 'string' ? legacyPortrait : '';
  }
  delete character.basics.portraitUrl;
  Object.assign(character.attributes, input.attributes || {});
  Object.assign(character.details, input.details || {});
  delete character.details.portraitUrl;
  Object.assign(character.trackers, input.trackers || {});
  Object.assign(character.meta, input.meta || {});
  if (typeof character.meta.characterId !== 'string' || !character.meta.characterId.trim()) {
    character.meta.characterId = base.meta.characterId;
  }
  character.details.purchasedGear = (input.details?.purchasedGear || []).map((item) => normalizePurchasedGearEntry(item));

  character.traits.assets = (input.traits?.assets || character.traits.assets).map((trait) => ({
    id: trait.id || (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function' ? globalThis.crypto.randomUUID() : createEmptySpecialty().id),
    category: 'asset',
    name: trait.name || '',
    rating: trait.rating || 'none',
    source: trait.source || 'curated',
    notes: trait.notes || ''
  }));

  character.traits.complications = (input.traits?.complications || character.traits.complications).map((trait) => ({
    id: trait.id || (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function' ? globalThis.crypto.randomUUID() : createEmptySpecialty().id),
    category: 'complication',
    name: trait.name || '',
    rating: trait.rating || 'none',
    source: trait.source || 'curated',
    notes: trait.notes || ''
  }));

  SKILLS.forEach((skill) => {
    const incoming = input.skills?.[skill.name];
    character.skills[skill.name] = {
      generalRating: incoming?.generalRating || 'none',
      specialties: (incoming?.specialties || [])
        .map((specialty) => ({
          id: specialty.id || createEmptySpecialty().id,
          name: getSpecialtyDisplayName(specialty),
          rating: specialty.rating || 'none'
        }))
        .filter((specialty) => !isEmptySpecialtyEntry(specialty))
    };
  });

  return character;
}

