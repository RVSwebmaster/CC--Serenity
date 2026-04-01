const STORAGE_KEY = 'gm_amanuensis_serenity_session';
const STORAGE_VERSION = 3;

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    version: STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    activeTab: session.activeTab,
    currentTurnMemberId: session.currentTurnMemberId,
    ship: session.ship,
    crew: session.crew
  }));
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}
