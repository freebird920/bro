/**
 * BRO v1.0 validation smoke test.
 * Type-check with the scratch tsc command used in this repository.
 */

import { Validator, type Schema } from "@cfworker/json-schema";
import { normalizePayload, normalizeUrnScheme } from "../src/lib/normalize";
import { validateBroSchema } from "../src/validator";
import broSchema from "../worker/assets/bro-v1-schema.json";
import type { BibliographicReactionObjectBROV10 } from "../src/validator/schema-types";

const validator = new Validator(broSchema as Schema, "2020-12", false);

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`PASS: ${testName}`);
    passed += 1;
  } else {
    console.log(`FAIL: ${testName}${detail ? ` - ${detail}` : ""}`);
    failed += 1;
  }
}

const context = "https://schema.slat.or.kr/bro/v1.0/context.jsonld" as const;
const creator = [{ "@type": "Library", name: "예시공공도서관", "@id": "https://library.example.kr/" }] as const;

const listingReaction: BibliographicReactionObjectBROV10 = {
  "@context": context,
  "@type": "Reaction",
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000101",
  reactionType: "Listing",
  about: [{ "@type": "Book", name: "1984", identifier: "urn:isbn:9788937462788" }],
  text: "",
  creator: [...creator],
  dateCreated: "2026-05-09T00:00:00+09:00",
};

const responseReaction: BibliographicReactionObjectBROV10 = {
  "@context": context,
  "@type": "Reaction",
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000104",
  reactionType: "Response",
  about: [{ "@type": "Book", name: "1984", identifier: "urn:isbn:9788937462788" }],
  text: "감시와 언어 통제의 문제를 다룬 서평 본문.",
  creator: [...creator],
  dateCreated: "2026-05-09T00:00:00+09:00",
};

const reactionList: BibliographicReactionObjectBROV10 = {
  "@context": context,
  "@type": "ReactionList",
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000100",
  itemListElement: [{ "@id": listingReaction["@id"], "@type": "Reaction" }],
  creator: [...creator],
  dateCreated: "2026-05-09T00:00:00+09:00",
};

console.log("\nTest 1: URI normalization");
{
  assert(
    normalizeUrnScheme("URN:UUID:550e8400-e29b-41d4-a716-446655440001") ===
      "urn:uuid:550e8400-e29b-41d4-a716-446655440001",
    "URN:UUID -> urn:uuid",
  );
  assert(
    normalizeUrnScheme("URN:ISBN:9788937462788") === "urn:isbn:9788937462788",
    "URN:ISBN -> urn:isbn",
  );
  assert(
    normalizeUrnScheme("https://ORCID.org/0000-0002-1234-567X") === "https://orcid.org/0000-0002-1234-567X",
    "ORCID HTTPS host normalized",
  );
}

console.log("\nTest 2: recursive payload normalization");
{
  const payload = {
    "@context": context,
    "@type": "Reaction",
    "@id": "URN:UUID:018f1b2c-0000-7000-8000-000000000201",
    reactionType: "Listing",
    about: [{ "@type": "Book", identifier: "URN:ISBN:9788937462788" }],
    text: "",
    creator: [{ "@type": "Person", name: "테스터", "@id": "MAILTO:tester@example.org" }],
    dateCreated: "2026-05-09T00:00:00+09:00",
  };

  normalizePayload(payload);

  assert(payload["@id"] === "urn:uuid:018f1b2c-0000-7000-8000-000000000201", "root @id normalized");
  assert(payload.about[0].identifier === "urn:isbn:9788937462788", "about.identifier normalized");
  assert(payload.creator[0]["@id"] === "mailto:tester@example.org", "creator @id normalized");
}

console.log("\nTest 3: Reaction-first schema validation");
{
  assert(validator.validate(listingReaction).valid, "Listing Reaction with empty text is valid");
  assert(validator.validate(responseReaction).valid, "Response Reaction with body text is valid");
  assert(validator.validate(reactionList).valid, "ReactionList with Reaction reference is valid");
}

console.log("\nTest 4: application-layer text checks");
{
  const invalidFrontMatter = { ...responseReaction, text: "---\ntitle: legacy\n---\nBody" };
  const invalidResponse = { ...responseReaction, text: "   " };

  assert(!validateBroSchema(invalidFrontMatter).valid, "text front matter is rejected");
  assert(!validateBroSchema(invalidResponse).valid, "blank Response text is rejected");
}

console.log("\nTest 5: graph document validation");
{
  const graph: BibliographicReactionObjectBROV10 = {
    "@context": context,
    "@graph": [reactionList, listingReaction],
  };

  assert(validateBroSchema(graph).valid, "BROGraph validates");
}

console.log(`\nResults: ${passed} passed, ${failed} failed, ${passed + failed} total`);

if (failed > 0) {
  process.exit(1);
}
