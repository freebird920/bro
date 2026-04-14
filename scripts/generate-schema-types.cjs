const { compileFromFile } = require('json-schema-to-typescript');
const fs = require('fs');
const path = require('path');

// Define absolute paths based on the script's location
const schemaPath = path.resolve(__dirname, '../worker/assets/bro-v1-schema.json');
const outputPath = path.resolve(__dirname, '../src/validator/schema-types.ts');
const autoGenComment = '// This file is auto-generated. Do not edit it manually.\n// To update these types, run `pnpm run generate-types`\n\n';

async function generateTypes() {
  try {
    console.log(`[1/3] Reading JSON schema from: ${schemaPath}`);
    
    // Compile the JSON schema file into a TypeScript code string
    const tsCode = await compileFromFile(schemaPath);
    
    console.log(`[2/3] Ensuring output directory exists...`);
    // Ensure the destination directory (src/validator) exists before writing
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    
    console.log(`[3/3] Writing TypeScript interfaces to: ${outputPath}`);
    // Write the output file, prepending the auto-generated warning comment
    fs.writeFileSync(outputPath, autoGenComment + tsCode);
    
    console.log('✅ Success: TypeScript types generated successfully!');
  } catch (error) {
    console.error('❌ Error generating TypeScript types:', error);
    process.exit(1);
  }
}

generateTypes();
