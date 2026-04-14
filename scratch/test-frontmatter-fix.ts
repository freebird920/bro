import { parseFrontmatter, serializeFrontmatter } from '../src/lib/frontmatter';

// Test Framework Initialization 
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log("Initiating Exhaustive Idempotency Validation Protocol... ✌️🤪✌️\n");

const inputYaml = `
title: "Strict Deserialization Protocols"
language: ["ko"]
keywords: ["valibot", "idempotency", "string-mutation"]
date: "2026-04-11"
author: "System"
toc: true
`;

const inputContent = `# Main Header\nThis is the payload body.`;

// TEST 1: Parsing and Segregation Protocol
console.log("Executing Test 1: Mixed Key Parsing");
const parseResult = parseFrontmatter(inputYaml, inputContent);

assert(parseResult.data.title === "Strict Deserialization Protocols", "Title extraction failed.");
assert(parseResult.data.keywords.length === 3, "Keywords extraction failed.");
assert(parseResult.others.length === 3, `Dynamic field segregation failed. Expected 3 fields, got ${parseResult.others.length}.`);
assert(parseResult.others.some(field => field.date === "2026-04-11"), "Date field isolation failed.");
console.log("✅ Test 1 Passed.\n");

// TEST 2: Serialization and Matrix Reconstruction
console.log("Executing Test 2: Serialization Formatting");
const serializedData = serializeFrontmatter(parseResult.data, parseResult.others, parseResult.content);

assert(serializedData.startsWith('---'), "YAML block start delimiter missing.");
assert(serializedData.includes('title: Strict Deserialization Protocols'), "YAML block missing 1st-class data.");
assert(serializedData.includes('others:'), "YAML block missing others array.");
assert(serializedData.includes('date: "2026-04-11"') || serializedData.includes("date: '2026-04-11'") || serializedData.includes("date: 2026-04-11"), "Dynamic field missing in YAML others array.");
console.log("✅ Test 2 Passed.\n");

// TEST 3: Infinite Cycle Idempotency Validation
console.log("Executing Test 3: Idempotency Cycle (Parse -> Serialize -> Parse)");
// Note: We need to simulate how a real parser would split the serialized data
const idempotencyResult = parseFrontmatter(serializedData);

assert(idempotencyResult.others.length === 3, `Idempotency failure: Others array length mutated to ${idempotencyResult.others.length}. Expected 3. Ⅴ(◍´ᯅ \`◍)Ⅴ`);
assert(!idempotencyResult.content.includes('others:'), "Body content should not contain YAML block.");

const secondarySerialization = serializeFrontmatter(idempotencyResult.data, idempotencyResult.others, idempotencyResult.content);

assert(serializedData === secondarySerialization, "Idempotency hash mismatch: Secondary serialization yielded mutated byte sequence.");
console.log("✅ Test 3 Passed. Idempotency verified. System operational.");
