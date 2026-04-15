export function toOptionalPositiveInt(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} doit être un entier positif.`);
  }

  return parsed;
}

export function toRequiredPositiveInt(value, fieldName) {
  const parsed = toOptionalPositiveInt(value, fieldName);
  if (parsed === null) {
    throw new Error(`${fieldName} est obligatoire.`);
  }
  return parsed;
}

export function toOptionalString(value, fieldName, maxLength) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error(`${fieldName} doit être une chaîne de caractères.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} dépasse ${maxLength} caractères.`);
  }

  return normalized;
}

export function toOptionalDate(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error(`${fieldName} doit être une date au format AAAA-MM-JJ.`);
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) {
    throw new Error(`${fieldName} doit respecter le format AAAA-MM-JJ.`);
  }

  return value;
}

export function toOptionalNumber(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} doit être un nombre valide.`);
  }

  return parsed;
}

export function toOptionalTinyIntFlag(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (value === true || value === '1' || value === 1) {
    return 1;
  }

  if (value === false || value === '0' || value === 0) {
    return 0;
  }

  throw new Error(`${fieldName} doit valoir 0 ou 1.`);
}
