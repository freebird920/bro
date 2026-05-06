const IDENTIFIER_KEYS = new Set(["@id", "identifier", "license", "propertyID", "valueReference"]);

const URI_SCHEME_NORMALIZERS: Array<[RegExp, string]> = [
  [/^urn:uuid:/i, "urn:uuid:"],
  [/^urn:isbn:/i, "urn:isbn:"],
  [/^mailto:/i, "mailto:"],
  [/^https:\/\/doi\.org\//i, "https://doi.org/"],
  [/^https:\/\/orcid\.org\//i, "https://orcid.org/"],
];

export function normalizeIdentifier(value: string): string {
  for (const [pattern, canonicalPrefix] of URI_SCHEME_NORMALIZERS) {
    const match = value.match(pattern);
    if (match) {
      return canonicalPrefix + value.slice(match[0].length);
    }
  }
  return value;
}

export function normalizeUrnScheme(value: string): string {
  return normalizeIdentifier(value);
}

export function normalizePayload<T>(payload: T): T {
  if (payload === null || payload === undefined) return payload;

  if (Array.isArray(payload)) {
    for (let index = 0; index < payload.length; index += 1) {
      payload[index] = normalizePayload(payload[index]);
    }
    return payload;
  }

  if (typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;
    for (const key of Object.keys(objectPayload)) {
      const value = objectPayload[key];
      if (IDENTIFIER_KEYS.has(key) && typeof value === "string") {
        objectPayload[key] = normalizeIdentifier(value);
      } else if (value && typeof value === "object") {
        normalizePayload(value);
      }
    }
  }

  return payload;
}

export function cloneAndNormalizePayload<T>(payload: T): T {
  const cloned = typeof structuredClone === "function"
    ? structuredClone(payload)
    : JSON.parse(JSON.stringify(payload));
  return normalizePayload(cloned);
}
