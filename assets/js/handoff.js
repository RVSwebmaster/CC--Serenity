const GM_HANDOFF_QUEUE_KEY = 'serenity_suite_gm_handoff_queue';
const GM_HANDOFF_PREFIX = 'SERENITY-HANDOFF:';

function makeId(prefix = 'id') {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeParseQueue() {
  try {
    const raw = localStorage.getItem(GM_HANDOFF_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    localStorage.removeItem(GM_HANDOFF_QUEUE_KEY);
    return [];
  }
}

function safeWriteQueue(queue) {
  localStorage.setItem(GM_HANDOFF_QUEUE_KEY, JSON.stringify(queue));
}

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function ensureCharacterIdentity(character) {
  const draft = structuredClone(character || {});
  draft.meta = {
    ...(draft.meta || {}),
    characterId: draft.meta?.characterId || makeId('character')
  };
  return draft;
}

export function createCharacterHandoff(character) {
  const payload = ensureCharacterIdentity(character);
  const sentAt = new Date().toISOString();
  return {
    handoffId: makeId('handoff'),
    characterId: payload.meta.characterId,
    sentAt,
    payload,
    summary: {
      name: payload.basics?.name || 'Unnamed Crew Member',
      role: payload.basics?.role || payload.basics?.customRole || 'Unassigned',
      concept: payload.basics?.concept || ''
    }
  };
}

export function queueCharacterForGM(character) {
  const handoff = createCharacterHandoff(character);
  const queue = safeParseQueue().filter((entry) => entry?.characterId !== handoff.characterId);
  queue.push(handoff);
  safeWriteQueue(queue);
  return handoff;
}

export function consumeQueuedGMHandshakes() {
  const queue = safeParseQueue();
  localStorage.removeItem(GM_HANDOFF_QUEUE_KEY);
  return queue.filter((entry) => entry && typeof entry === 'object' && entry.payload);
}

export function peekQueuedGMHandshakes() {
  return safeParseQueue().filter((entry) => entry && typeof entry === 'object' && entry.payload);
}

export function encodeCharacterHandoffCode(character) {
  const handoff = createCharacterHandoff(character);
  return `${GM_HANDOFF_PREFIX}${encodeBase64(JSON.stringify(handoff))}`;
}

export function decodeCharacterHandoffCode(rawValue) {
  const value = String(rawValue || '').trim();
  if (!value.startsWith(GM_HANDOFF_PREFIX)) {
    throw new Error('That handoff code is not a Serenity GM handoff.');
  }

  const encoded = value.slice(GM_HANDOFF_PREFIX.length);
  const decoded = decodeBase64(encoded);
  const parsed = JSON.parse(decoded);

  if (!parsed || typeof parsed !== 'object' || !parsed.payload) {
    throw new Error('The handoff code did not contain a valid character payload.');
  }

  return parsed;
}

export function getGMHandoffQueueKey() {
  return GM_HANDOFF_QUEUE_KEY;
}
