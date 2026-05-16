import { convertBroToKomarc, type KomarcDataField, type KomarcRecord } from "../src/lib/komarc-converter";
import type { BibliographicReactionObjectBROV10 } from "../src/validator/schema-types";

console.log("--- Initiating KOMARC Conversion Validation ---");

function findDataField(record: KomarcRecord, tag: string): KomarcDataField | undefined {
  return record.dataFields.find((field) => field.tag === tag);
}

function hasSubfield(field: KomarcDataField | undefined, code: string, value: string): boolean {
  return Boolean(field?.subfields.some((subfield) => subfield.code === code && subfield.value === value));
}

function assert(condition: boolean, message: string, detail?: unknown) {
  if (!condition) {
    console.error(`FAIL ${message}`, detail ?? "");
    process.exit(1);
  }
  console.log(`PASS ${message}`);
}

const context = "https://schema.slat.or.kr/bro/v1.0/context.jsonld" as const;
const creator = [{ "@type": "Library", name: "예시공공도서관", "@id": "https://library.example.kr/" }] as const;

const reactionPayload: BibliographicReactionObjectBROV10 = {
  "@context": context,
  "@type": "Reaction",
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000101",
  reactionType: "Listing",
  dateCreated: "2026-05-09T00:00:00+09:00",
  about: [
    {
      "@type": "Book",
      identifier: "urn:isbn:9788937462788",
      name: "1984",
      creatorName: "George Orwell",
    },
  ],
  creator: [...creator],
  text: "",
};

console.log("\nTesting Reaction conversion...");
const record = convertBroToKomarc(reactionPayload) as KomarcRecord;
const field020 = findDataField(record, "020");
const field552 = findDataField(record, "552");

assert(hasSubfield(field020, "a", "9788937462788"), "ISBN maps to 020 $a", field020);
assert(hasSubfield(field552, "k", "20260509"), "dateCreated maps to 552 $k", field552);
assert(hasSubfield(field552, "h", "https://schema.slat.or.kr/bro/v1.0/schema.json"), "schema URI maps to 552 $h", field552);
assert(hasSubfield(field552, "t", "Listing"), "reactionType maps to 552 $t", field552);

console.log("\nTesting ReactionList conversion...");
const listPayload: BibliographicReactionObjectBROV10 = {
  "@context": context,
  "@type": "ReactionList",
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000100",
  dateCreated: "2026-05-09T00:00:00+09:00",
  creator: [...creator],
  itemListElement: [{ "@id": reactionPayload["@id"], "@type": "Reaction" }],
};

const records = convertBroToKomarc(listPayload) as KomarcRecord[];
assert(Array.isArray(records) && records.length === 1, "ReactionList emits one record per item", records.length);

const list552 = findDataField(records[0], "552");
assert(hasSubfield(list552, "u", reactionPayload["@id"]), "ReactionList item reference maps to 552 $u", list552);
assert(hasSubfield(list552, "t", "Reaction"), "ReactionList item type maps to 552 $t", list552);

console.log("\n--- Validation Sequence Complete ---");
