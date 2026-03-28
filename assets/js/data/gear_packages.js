import { getPurchasedGearTotal } from './equipment.js';

function hasSelectedTrait(list = [], name = '') {
  return list.some((trait) => trait.name === name && trait.rating !== 'none');
}

export function getDefaultStartingCredits(character = {}) {
  if (hasSelectedTrait(character.traits?.assets, 'Moneyed Individual')) return 1125;
  if (hasSelectedTrait(character.traits?.complications, 'Dead Broke')) return 375;
  return 750;
}

export function resolveStartingCredits(character = {}) {
  const explicit = character.details?.startingCredits;
  if (explicit !== undefined && explicit !== null && String(explicit).trim() !== '') {
    return explicit;
  }
  return String(getDefaultStartingCredits(character));
}

export function calculateCurrentCredits(character = {}) {
  const starting = Number.parseFloat(resolveStartingCredits(character));
  if (Number.isNaN(starting)) return '';
  return Number((starting - getPurchasedGearTotal(character.details)).toFixed(1));
}

export function formatMoney(value, suffix, fallback = '—') {
  if (value === undefined || value === null || String(value).trim() === '') return fallback;
  const num = Number.parseFloat(value);
  const display = Number.isNaN(num) ? String(value) : (Number.isInteger(num) ? String(num) : num.toFixed(1));
  return `${display} ${suffix}`;
}
