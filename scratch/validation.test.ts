/**
 * BRO v1 통합 테스트 스크립트
 * 실행: npx tsx scratch/validation.test.ts
 */

import { normalizePayload, normalizeUrnScheme } from '../src/lib/normalize';
import { parseFrontmatter, serializeFrontmatter } from '../src/lib/frontmatter';
import { Validator, type Schema } from '@cfworker/json-schema';
import broSchema from '../worker/assets/bro-v1-schema.json';

const validator = new Validator(broSchema as Schema, '2020-12', false);

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${testName}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

// ═══════════════════════════════════════════════
// Test 1: 악의적 텍스트 주입 (5000자 초과 쓰레기 데이터)
// ═══════════════════════════════════════════════
console.log('\n📋 Test 1: ReDoS 방지 — 5000자 초과 쓰레기 데이터 뒤 Frontmatter');
{
  const junk = 'A'.repeat(6000);
  const maliciousText = `${junk}\n---\ntitle: "evil"\nlanguage:\n  - "ko"\n---\nBody`;
  const result = parseFrontmatter(maliciousText);
  // 5000자 이내에 Frontmatter가 없으므로 추출되지 않아야 함
  assert(result.data.title === undefined, 'Frontmatter should NOT be extracted beyond 5000 chars');
  assert(result.content === maliciousText, 'Content should be the full original text');
}

// ═══════════════════════════════════════════════
// Test 2: URN 정규화 — 대문자 Scheme 변환
// ═══════════════════════════════════════════════
console.log('\n📋 Test 2: URN 정규화 — 대소문자 혼합 Scheme 처리');
{
  assert(normalizeUrnScheme('URN:UUID:550e8400-e29b-41d4-a716-446655440001') === 'urn:uuid:550e8400-e29b-41d4-a716-446655440001', 'URN:UUID → urn:uuid');
  assert(normalizeUrnScheme('URN:ISBN:978-89-01-23456-7') === 'urn:isbn:978-89-01-23456-7', 'URN:ISBN → urn:isbn');
  assert(normalizeUrnScheme('URN:KR:CRN:1234567890123') === 'urn:kr:crn:1234567890123', 'URN:KR:CRN → urn:kr:crn');
  assert(normalizeUrnScheme('urn:model:Google:Gemini-1.5') === 'urn:model:Google:Gemini-1.5', 'model NSS should preserve case');
  assert(normalizeUrnScheme('not-a-urn') === 'not-a-urn', 'Non-URN strings should pass through');
}

// ═══════════════════════════════════════════════
// Test 3: normalizePayload — 객체 순회 정규화
// ═══════════════════════════════════════════════
console.log('\n📋 Test 3: normalizePayload — 재귀 순회 정규화');
{
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': 'URN:UUID:550e8400-e29b-41d4-a716-446655440001',
    creator: [
      { '@type': 'Person', '@id': 'URN:ORCID:0000-0002-1234-567X', name: 'Test' }
    ],
    about: [
      { '@type': 'CreativeWork', identifier: 'URN:ISBN:978-89-01-23456-7' }
    ]
  };

  normalizePayload(payload);
  
  assert(payload['@id'] === 'urn:uuid:550e8400-e29b-41d4-a716-446655440001', 'Root @id normalized');
  assert(payload.creator[0]['@id'] === 'urn:orcid:0000-0002-1234-567X', 'Creator @id normalized');
  assert((payload.about[0] as any).identifier === 'urn:isbn:978-89-01-23456-7', 'about.identifier normalized');
}

// ═══════════════════════════════════════════════
// Test 4: 동적 필드 직렬화 — others 배열 처리
// ═══════════════════════════════════════════════
console.log('\n📋 Test 4: 동적 필드 직렬화 — 비표준 YAML 키 → others');
{
  const markdown = "---\ntitle: \"테스트\"\nlanguage:\n  - \"ko\"\nkeywords:\n  - \"test\"\ncustom_field: 42\nanother_field: \"hello\"\n---\n본문 내용";
  const result = parseFrontmatter(markdown);
  
  assert(result.data.title === '테스트', 'Title extracted correctly');
  assert(Array.isArray(result.others), 'others is an array');
  assert(result.others.length === 2, 'Two dynamic fields bundled into others');
  
  const customField = result.others.find(o => 'custom_field' in o);
  const anotherField = result.others.find(o => 'another_field' in o);
  assert(customField !== undefined && customField.custom_field === 42, 'custom_field bundled correctly');
  assert(anotherField !== undefined && anotherField.another_field === 'hello', 'another_field bundled correctly');

  // Round-trip 테스트
  const serialized = serializeFrontmatter(result.data, result.others, result.content);
  assert(serialized.startsWith('---\n'), 'Serialized starts with --- delimiter');
  assert(serialized.includes('본문 내용'), 'Content preserved after round-trip');
}

// ═══════════════════════════════════════════════
// Test 5: 빈 ItemList (minItems: 0) 검증 통과
// ═══════════════════════════════════════════════
console.log('\n📋 Test 5: 빈 ItemList (itemListElement: []) 검증 통과');
{
  const emptyList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': 'urn:uuid:550e8400-e29b-41d4-a716-446655440033',
    name: '비어있는 목록',
    creator: [
      { '@type': 'Person', '@id': 'urn:uuid:550e8400-e29b-41d4-a716-446655440099', name: '관리자' }
    ],
    itemListElement: []
  };

  const result = validator.validate(emptyList);
  assert(result.valid === true, 'Empty itemListElement should pass validation');
}

// ═══════════════════════════════════════════════
// Test 6: Creator 다형성 — 5가지 @type 검증
// ═══════════════════════════════════════════════
console.log('\n📋 Test 6: Creator 다형성 — 각 타입별 검증');
{
  const baseArticle = {
    '@context': 'https://schema.org' as const,
    '@type': 'Article' as const,
    dateCreated: '2026-04-12T12:00:00Z',
    about: [{ '@type': 'CreativeWork' as const, identifier: 'urn:isbn:978-89-01-23456-7' }],
    text: '---\ntitle: "Test"\n---\nBody',
  };

  const creatorCases = [
    { '@type': 'Person', name: '테스트', '@id': 'urn:uuid:550e8400-e29b-41d4-a716-446655440001' },
    { '@type': 'GovernmentOrganization', name: '정부기관', '@id': 'urn:kr:govcode:1234567' },
    { '@type': 'Corporation', name: '기업', '@id': 'urn:kr:crn:1234567890123' },
    { '@type': 'Organization', name: '단체', '@id': 'urn:uuid:550e8400-e29b-41d4-a716-446655440002' },
    { '@type': 'SoftwareApplication', name: 'gemini-2.0', '@id': 'urn:model:google:gemini-2.0', softwareVersion: '2.0' },
  ];

  for (const creator of creatorCases) {
    const payload = { ...baseArticle, creator: [creator] };
    const result = validator.validate(payload);
    assert(result.valid === true, `Creator @type="${creator['@type']}" should pass validation`);
  }
}

// ═══════════════════════════════════════════════
// Test 7: 정규화 후 대문자 URN이 스키마 검증 통과
// ═══════════════════════════════════════════════
console.log('\n📋 Test 7: 정규화 후 대문자 URN → 검증 통과');
{
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    dateCreated: '2026-04-12T12:00:00Z',
    '@id': 'URN:UUID:550e8400-e29b-41d4-a716-446655440001',
    about: [{ '@type': 'CreativeWork', identifier: 'URN:ISBN:978-89-01-23456-7' }],
    text: '---\ntitle: "Test"\n---\nBody',
    creator: [{ '@type': 'Person', name: 'Test', '@id': 'URN:UUID:550e8400-e29b-41d4-a716-446655440002' }]
  };

  // 정규화 전: 실패해야 함
  const beforeResult = validator.validate(JSON.parse(JSON.stringify(payload)));
  assert(beforeResult.valid === false, 'Uppercase URN should fail BEFORE normalization');

  // 정규화 후: 통과해야 함
  normalizePayload(payload);
  const afterResult = validator.validate(payload);
  assert(afterResult.valid === true, 'Normalized URN should pass AFTER normalization');
}

// ═══════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════
console.log(`\n${'═'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log(`${'═'.repeat(50)}`);

if (failed > 0) {
  process.exit(1);
}
