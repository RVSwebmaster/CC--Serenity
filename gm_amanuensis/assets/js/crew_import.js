import { hydrateCharacter } from '../../../assets/js/state.js';

function trimByteOrderMark(raw) {
  return typeof raw === 'string' ? raw.replace(/^\uFEFF/, '') : raw;
}

function createStageError(stage, message, cause = null) {
  const error = new Error(message);
  error.stage = stage;
  if (cause) error.cause = cause;
  return error;
}

export function validateImportedPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw createStageError('validation', 'root JSON must be an object');
  }

  let character;
  try {
    character = hydrateCharacter(payload);
  } catch (error) {
    throw createStageError('hydration', 'could not be hydrated as a Serenity export', error);
  }

  const hasIdentity = [
    character.basics?.name,
    character.basics?.concept,
    character.basics?.role
  ].some((value) => typeof value === 'string' && value.trim());
  const hasAssignedAttributes = Object.values(character.attributes || {}).some((value) => value && value !== '-');

  if (!hasIdentity && !hasAssignedAttributes) {
    throw createStageError('validation', 'does not look like a Serenity character export');
  }

  return payload;
}

function formatImportError(error) {
  const stage = typeof error?.stage === 'string' ? error.stage : 'import';
  const message = error instanceof Error ? error.message : 'could not be imported';

  switch (stage) {
    case 'read':
      return `file could not be read: ${message}`;
    case 'parse':
      return `JSON parsing failed: ${message}`;
    case 'hydration':
      return `Serenity hydration failed: ${message}`;
    case 'validation':
      return `export validation failed: ${message}`;
    default:
      return message;
  }
}

export async function importCrewFiles(fileList) {
  const imported = [];
  const rejected = [];

  for (const file of Array.from(fileList || [])) {
    try {
      let raw;
      try {
        raw = trimByteOrderMark(await file.text());
      } catch (error) {
        throw createStageError('read', 'browser could not read the selected file', error);
      }

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        throw createStageError('parse', error instanceof Error ? error.message : 'invalid JSON', error);
      }

      const payload = validateImportedPayload(parsed);
      imported.push({
        payload,
        sourceName: file.name
      });
    } catch (error) {
      rejected.push({
        sourceName: file.name,
        message: formatImportError(error)
      });
    }
  }

  return { imported, rejected };
}

