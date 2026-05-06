const { compileFromFile } = require("json-schema-to-typescript");
const fs = require("fs");
const path = require("path");

const schemaPath = path.resolve(__dirname, "../worker/assets/bro-v1-schema.json");
const outputPath = path.resolve(__dirname, "../src/validator/schema-types.generated.ts");
const banner = `/* eslint-disable */
/**
 * This file is generated from worker/assets/bro-v1-schema.json.
 * The hand-maintained public type surface lives in src/validator/schema-types.ts.
 */

`;

async function generateTypes() {
  try {
    console.log(`[1/3] Reading JSON schema from: ${schemaPath}`);
    const tsCode = await compileFromFile(schemaPath, {
      bannerComment: "",
      unreachableDefinitions: true,
    });
    console.log("[2/3] Ensuring output directory exists...");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    console.log(`[3/3] Writing generated TypeScript interfaces to: ${outputPath}`);
    fs.writeFileSync(outputPath, banner + tsCode, "utf8");
    console.log("Success: TypeScript types generated successfully.");
  } catch (error) {
    console.error("Error generating TypeScript types:", error);
    process.exit(1);
  }
}

generateTypes();
