import { Validator } from '@cfworker/json-schema';
import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve('worker/assets/bro-v1-schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validator = new Validator(schema, '2020-12', false);

const testPayloads = [
  {
    name: "Valid AI Article Ingestion",
    payload: {
      "@context": "https://schema.org",
      "@type": "Article",
      dateCreated: "2026-04-11T12:00:00Z",
      about: [{ "@type": "CreativeWork", identifier: "urn:isbn:978-89-01-23456-7" }],
      text: "---title: test\nlanguage: [ko]\nkeywords: [k]\ntoc: t\n---",
      creator: [{
        "@type": "SoftwareApplication",
        name: "gemini-1.5-pro",
        "@id": "urn:model:google:gemini-1.5-pro",
        softwareVersion: "1.5-pro"
      }]
    },
    expected: true
  },
  {
    name: "Invalid AI Model URN",
    payload: {
      "@context": "https://schema.org",
      "@type": "Article",
      dateCreated: "2026-04-11T12:00:00Z",
      about: [{ "@type": "CreativeWork", identifier: "urn:isbn:978-89-01-23456-7" }],
      text: "---title: test\nlanguage: [ko]\nkeywords: [k]\ntoc: t\n---",
      creator: [{
        "@type": "SoftwareApplication",
        name: "bad-model",
        "@id": "urn:bad:id",
        softwareVersion: "1.0"
      }]
    },
    expected: false
  },
  {
    name: "Valid ItemList",
    payload: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Test List",
      creator: [{
        "@type": "Person",
        name: "Tester",
        "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440000"
      }],
      itemListElement: [
        { "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440001" },
        { "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440002" }
      ]
    },
    expected: true
  }
];

testPayloads.forEach(t => {
  const result = validator.validate(t.payload);
  if (result.valid === t.expected) {
    console.log(`✅ ${t.name} passed as expected.`);
  } else {
    console.log(`❌ ${t.name} failed! Expected ${t.expected}, got ${result.valid}`);
    if (!result.valid) console.log(JSON.stringify(result.errors, null, 2));
  }
});
