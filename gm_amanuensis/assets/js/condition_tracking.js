export const ACTION_STATES = ['Ready', 'Acted', 'Down'];

function normalizeNumber(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function normalizeInitiativeValue(value) {
  if (value === null || value === undefined || value === '') return '';
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? String(parsed) : '';
}

export function createConditionState(trackers = {}, options = {}) {
  return {
    stun: normalizeNumber(trackers?.stun, 0),
    wounds: normalizeNumber(trackers?.wounds, 0),
    actionState: ACTION_STATES[0],
    notes: '',
    initiativeValue: '',
    tieBreakerRoll: null,
    tieBreakerInitiative: null,
    tabColor: options.tabColor || ''
  };
}

export function sanitizeConditionState(input, fallback = createConditionState()) {
  const initiativeValue = normalizeInitiativeValue(input?.initiativeValue);

  return {
    stun: normalizeNumber(input?.stun, fallback.stun),
    wounds: normalizeNumber(input?.wounds, fallback.wounds),
    actionState: ACTION_STATES.includes(input?.actionState) ? input.actionState : fallback.actionState,
    notes: typeof input?.notes === 'string' ? input.notes : fallback.notes,
    initiativeValue,
    tieBreakerRoll: Number.isFinite(Number(input?.tieBreakerRoll)) ? Number(input.tieBreakerRoll) : fallback.tieBreakerRoll,
    tieBreakerInitiative: initiativeValue && Number.isFinite(Number(input?.tieBreakerInitiative))
      ? Number(input.tieBreakerInitiative)
      : fallback.tieBreakerInitiative,
    tabColor: typeof input?.tabColor === 'string' ? input.tabColor : fallback.tabColor
  };
}

export function parseInitiativeValue(value) {
  const normalized = normalizeInitiativeValue(value);
  return normalized === '' ? null : Number(normalized);
}
