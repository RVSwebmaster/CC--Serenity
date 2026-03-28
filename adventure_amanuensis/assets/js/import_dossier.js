// Dossier import helpers for the Adventure Amanuensis placeholder shell.

export const DOSSIER_SECTION_ORDER = [
  'schema',
  'schemaVersion',
  'identity',
  'attributes',
  'traits',
  'skills',
  'derived',
  'finances',
  'gear',
  'trackers',
  'notes'
];

export function parseDossier(raw) {
  return JSON.parse(raw);
}

export async function importDossierFile(file) {
  const raw = await file.text();
  return parseDossier(raw);
}

export async function loadExampleDossier() {
  const response = await fetch(new URL('./data/dossier_example.json', import.meta.url));
  if (!response.ok) {
    throw new Error(`Example dossier load failed: ${response.status}`);
  }
  return response.json();
}

export function getDossierSections(dossier = {}) {
  return DOSSIER_SECTION_ORDER
    .map((key) => ({ key, value: dossier[key] }))
    .filter((entry) => entry.value !== undefined);
}
