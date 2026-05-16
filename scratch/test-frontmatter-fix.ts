import { renderBroToMarkdown } from "../src/lib/markdown-renderer";
import { validateBroSchema } from "../src/validator";
import type { BibliographicReactionObjectBROV10 } from "../src/validator/schema-types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
  console.log(`PASS ${message}`);
}

const payload: BibliographicReactionObjectBROV10 = {
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000104",
  reactionType: "Response",
  name: "서평: 1984",
  about: [{ "@type": "Book", name: "1984", identifier: "urn:isbn:9788937462788" }],
  text: "감시와 언어 통제의 문제를 다룬 서평 본문.",
  creator: [{ "@type": "Person", name: "테스터", "@id": "mailto:tester@example.org" }],
  dateCreated: "2026-05-09T00:00:00+09:00",
};

console.log("Testing BRO markdown rendering and front-matter rejection.");

const markdown = renderBroToMarkdown(payload);
assert(markdown.startsWith("---\n"), "renderer emits metadata front matter");
assert(markdown.endsWith(payload.text), "renderer appends Reaction.text as body");

const invalidPayload = {
  ...payload,
  text: "---\ntitle: legacy front matter\n---\n본문",
};

assert(validateBroSchema(payload).valid, "normal Response validates");
assert(!validateBroSchema(invalidPayload).valid, "text beginning with YAML front matter is rejected");
