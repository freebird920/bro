/**
 * URN Normalization Pipeline
 * 
 * bro-v1-schema.json에서 (?i:) 플래그가 제거되었으므로,
 * Validation 이전 단계에서 식별자의 Scheme 부분을 소문자로 정규화합니다.
 * 
 * 예: "URN:UUID:123..." → "urn:uuid:123..."
 *     "URN:ISBN:978..." → "urn:isbn:978..."
 */

/**
 * BRO v1 스키마에서 사용하는 URN Scheme 접두사 목록 (소문자 정규형)
 * 이 접두사까지만 소문자로 변환하고, 이후 NSS 값은 원본 보존합니다.
 */
const URN_SCHEME_PREFIXES = [
  "urn:isbn:",
  "urn:doi:",
  "urn:uci:",
  "urn:kolis:",
  "urn:uuid:",
  "urn:orcid:",
  "urn:isni:",
  "urn:kr:govcode:",
  "urn:kr:crn:",
  "urn:kr:brn:",
  "urn:kr:npo:",
  "urn:lei:",
  "urn:model:",
];

/**
 * URN Scheme 부분만 소문자로 변환합니다.
 * 알려진 접두사를 대소문자 무시하여 매칭한 뒤, 접두사를 소문자로 정규화합니다.
 * NSS(Namespace Specific String) 부분은 원본 그대로 유지됩니다.
 * 
 * 예: "URN:UUID:abc-def" → "urn:uuid:abc-def"
 *     "urn:model:Google:Gemini-1.5" → "urn:model:Google:Gemini-1.5" (NSS 보존)
 *     "URN:KR:CRN:1234567890123" → "urn:kr:crn:1234567890123"
 */
export function normalizeUrnScheme(urn: string): string {
  if (typeof urn !== "string") return urn;

  const lower = urn.toLowerCase();
  for (const prefix of URN_SCHEME_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return prefix + urn.slice(prefix.length);
    }
  }

  return urn;
}

/**
 * 식별자 필드 키 목록
 */
const IDENTIFIER_KEYS = new Set(["@id", "identifier"]);

/**
 * 페이로드를 재귀적으로 순회하며 모든 URN 식별자의 Scheme을 소문자로 정규화합니다.
 * 원본 객체를 직접 수정(mutate)합니다.
 */
export function normalizePayload<T>(payload: T): T {
  if (payload === null || payload === undefined) return payload;

  if (Array.isArray(payload)) {
    for (let i = 0; i < payload.length; i++) {
      payload[i] = normalizePayload(payload[i]);
    }
    return payload;
  }

  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      if (IDENTIFIER_KEYS.has(key) && typeof obj[key] === "string") {
        obj[key] = normalizeUrnScheme(obj[key] as string);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        normalizePayload(obj[key]);
      }
    }
    return payload;
  }

  return payload;
}
