export function getSpecialtyDisplayName(specialty = {}) {
  return String(specialty.name || specialty.label || specialty.specialty || '').trim();
}

export function isEmptySpecialtyEntry(specialty = {}) {
  return getSpecialtyDisplayName(specialty) === '' && (specialty.rating || 'none') === 'none';
}
