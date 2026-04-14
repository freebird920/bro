import { convertBroToKomarc } from '../src/lib/komarc-converter';
import type { BibliographicReactionObjectBRO } from '../src/validator/schema-types';

console.log('--- Initiating KOMARC Conversion Empirical Validation ---');

const mockPayload: BibliographicReactionObjectBRO = {
  "@context": "https://schema.org",
  "@type": "Article",
  "dateCreated": "2024-04-11T12:34:56Z",
  "about": [{
    "@type": "CreativeWork",
    "identifier": "urn:isbn:978-89-01-23456-7"
  }] as any,
  "author": [{
    "@type": "Person",
    "name": "Antigravity Gemini",
    "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440000"
  }],
  "abstract": [
    { "@id": "urn:uuid:660e8400-e29b-41d4-a716-446655441111" }
  ],
  "text": "Full markdown text here..."
};

console.log('Testing Single Article Conversion...');
const record = convertBroToKomarc(mockPayload) as any;

// 1. Assert ISBN 020 ▾a
const field020 = record.dataFields.find((f: any) => f.tag === '020');
if (field020?.subfields.find((s: any) => s.code === 'a' && s.value === '978-89-01-23456-7')) {
  console.log('✅ ISBN 020 ▾a: Match');
} else {
  console.error('❌ ISBN 020 ▾a: Failed', field020);
}

  // 2. Authorship Mapping is intentionally ignored so no 100/700 checks here.

// 3. Assert Date Truncation 552 ▾k
const field552 = record.dataFields.find((f: any) => f.tag === '552');
const subk = field552?.subfields.find((s: any) => s.code === 'k');
if (subk?.value === '20240411') {
  console.log('✅ Date 552 ▾k (20240411): Match');
} else {
  console.error('❌ Date 552 ▾k: Failed', subk);
}

// 4. Assert Schema Source 552 ▾h
const subh = field552?.subfields.find((s: any) => s.code === 'h');
if (subh?.value === 'https://schema.slat.or.kr/bro/v1/schema.json') {
  console.log('✅ Source 552 ▾h: Match');
} else {
  console.error('❌ Source 552 ▾h: Failed', subh);
}

console.log('\nTesting ItemList Conversion (ID-only references)...');
const listPayload: BibliographicReactionObjectBRO = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "author": [{ "@type": "Organization", "name": "SLAT", "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440000" }],
    "itemListElement": [
      { "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440001" },
      { "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440002" }
    ]
};

const records = convertBroToKomarc(listPayload) as any[];
if (Array.isArray(records) && records.length === 2) {
    const first552 = records[0].dataFields.find((f: any) => f.tag === '552');
    const firstU = first552?.subfields.find((s: any) => s.code === 'u');
    if (firstU?.value === 'urn:uuid:550e8400-e29b-41d4-a716-446655440001') {
        console.log('✅ ItemList @id reference → 552 ▾u: Match');
    } else {
        console.error('❌ ItemList 552 ▾u mapping: Failed', firstU);
    }
} else {
    console.error('❌ ItemList conversion: Failed — expected 2 records, got', records?.length);
}

console.log('\n--- Validation Sequence Complete ---');
