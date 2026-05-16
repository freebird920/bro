import { Validator } from "@cfworker/json-schema";
import fs from "fs";
import path from "path";

const schemaPath = path.resolve("worker/assets/bro-v1-schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const validator = new Validator(schema, "2020-12", false);

const context = "https://schema.slat.or.kr/bro/v1.0/context.jsonld";
const creator = [{ "@type": "Library", name: "예시공공도서관", "@id": "https://library.example.kr/" }];

const listingReaction = {
  "@context": context,
  "@type": "Reaction",
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000101",
  reactionType: "Listing",
  name: "등재: 1984",
  about: [{ "@type": "Book", name: "1984", identifier: "urn:isbn:9788937462788" }],
  text: "",
  creator,
  dateCreated: "2026-05-09T00:00:00+09:00",
};

const responseReaction = {
  "@context": context,
  "@type": "Reaction",
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000104",
  reactionType: "Response",
  name: "서평: 1984",
  about: [{ "@type": "Book", name: "1984", identifier: "urn:isbn:9788937462788" }],
  text: "감시와 언어 통제의 문제를 다룬 서평 본문.",
  creator,
  dateCreated: "2026-05-09T00:00:00+09:00",
};

const reactionList = {
  "@context": context,
  "@type": "ReactionList",
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000100",
  name: "2026년 5월 사서 추천 자료",
  itemListElement: [{ "@id": listingReaction["@id"], "@type": "Reaction" }],
  creator,
  dateCreated: "2026-05-09T00:00:00+09:00",
};

const testPayloads = [
  {
    name: "Valid Listing Reaction with empty text",
    payload: listingReaction,
    expected: true,
  },
  {
    name: "Valid Response Reaction with non-empty text",
    payload: responseReaction,
    expected: true,
  },
  {
    name: "Invalid Response Reaction with blank text",
    payload: { ...responseReaction, text: "   " },
    expected: false,
  },
  {
    name: "Valid ReactionList with Reaction references",
    payload: reactionList,
    expected: true,
  },
  {
    name: "Invalid legacy ItemList",
    payload: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Legacy list",
      creator,
      itemListElement: [{ "@id": listingReaction["@id"] }],
    },
    expected: false,
  },
  {
    name: "Valid BROGraph exchange",
    payload: {
      "@context": context,
      "@graph": [reactionList, listingReaction],
    },
    expected: true,
  },
];

let failures = 0;

testPayloads.forEach((testCase) => {
  const result = validator.validate(testCase.payload);
  if (result.valid === testCase.expected) {
    console.log(`PASS ${testCase.name}`);
    return;
  }

  failures += 1;
  console.error(`FAIL ${testCase.name}: expected ${testCase.expected}, got ${result.valid}`);
  if (!result.valid) console.error(JSON.stringify(result.errors.slice(0, 5), null, 2));
});

if (failures > 0) {
  process.exit(1);
}
