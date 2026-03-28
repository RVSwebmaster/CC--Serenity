
const STORAGE_KEY = 'serenity_greenhorn_builder_state';

export function saveState(character) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportState(character) {
  const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(character.basics.name || 'serenity-greenhorn').replace(/\s+/g, '_').toLowerCase()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
