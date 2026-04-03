const STORAGE_KEY = 'gm_amanuensis_serenity_session';
const SHIP_STORAGE_KEY = 'gm_amanuensis_serenity_ship';
const ENEMY_TRACKER_STORAGE_KEY = 'gm_amanuensis_serenity_enemy_trackers';
const STORAGE_VERSION = 5;

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`GM Amanuensis could not persist ${key}.`, error);
    return false;
  }
}

function safeParseItem(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
}

export function saveSession(session) {
  const payload = {
    version: STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    activeTab: session.activeTab,
    currentTurnMemberId: session.currentTurnMemberId,
    ship: session.ship,
    enemyTrackers: session.enemyTrackers,
    crew: session.crew
  };

  safeSetItem(STORAGE_KEY, JSON.stringify(payload));
  safeSetItem(SHIP_STORAGE_KEY, JSON.stringify({
    version: STORAGE_VERSION,
    savedAt: payload.savedAt,
    ship: session.ship
  }));
  safeSetItem(ENEMY_TRACKER_STORAGE_KEY, JSON.stringify({
    version: STORAGE_VERSION,
    savedAt: payload.savedAt,
    enemyTrackers: session.enemyTrackers
  }));
}

export function loadSession() {
  const session = safeParseItem(STORAGE_KEY);
  const shipSnapshot = safeParseItem(SHIP_STORAGE_KEY);
  const enemyTrackerSnapshot = safeParseItem(ENEMY_TRACKER_STORAGE_KEY);

  if (!session && !shipSnapshot && !enemyTrackerSnapshot) {
    return null;
  }

  return {
    ...(session || {}),
    ...(shipSnapshot?.ship ? { ship: shipSnapshot.ship } : {}),
    ...(enemyTrackerSnapshot?.enemyTrackers ? { enemyTrackers: enemyTrackerSnapshot.enemyTrackers } : {})
  };
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SHIP_STORAGE_KEY);
  localStorage.removeItem(ENEMY_TRACKER_STORAGE_KEY);
}
