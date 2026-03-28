// Minimal session-state helpers for the Adventure Amanuensis placeholder shell.

export function createSessionState() {
  return {
    dossier: null,
    source: '',
    error: '',
    loadedAt: null,
    renderMode: 'splash'
  };
}
