import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { compileFromFile } from "json-schema-to-typescript";

async function build() {
  const distDir = path.resolve("dist-validator");
  const schemaPath = path.resolve("worker/assets/bro-v1-schema.json");
  const generatedTypesPath = path.resolve("src/validator/schema-types.generated.ts");

  console.log("1. Generating TypeScript types from BRO v1.0 schema...");
  const tsResult = await compileFromFile(schemaPath, {
    bannerComment: "/* eslint-disable */\n/** Generated from worker/assets/bro-v1-schema.json. */",
    unreachableDefinitions: true,
  });
  fs.writeFileSync(generatedTypesPath, tsResult, "utf8");
  console.log(`Generated schema type snapshot at ${generatedTypesPath}`);

  console.log("2. Building validator package...");
  execSync("pnpm exec tsup src/validator/index.ts --format cjs,esm --dts --outDir dist-validator --clean --tsconfig tsconfig.app.json", {
    stdio: "inherit",
  });

  console.log("3. Copying versioned schema/context assets...");
  fs.copyFileSync(schemaPath, path.join(distDir, "bro-v1-schema.json"));
  fs.copyFileSync(path.resolve("worker/assets/bro-v1-context.jsonld"), path.join(distDir, "bro-v1-context.jsonld"));

  console.log("4. Generating package.json for validator publish...");
  const rootPackageJson = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf8"));
  const cfworkerVersion = rootPackageJson.dependencies?.["@cfworker/json-schema"] || "^4.1.1";
  const publishPackageJson = {
    name: "@slat.or.kr/bro-validator",
    version: rootPackageJson.version,
    main: "./index.cjs",
    module: "./index.js",
    types: "./index.d.ts",
    exports: {
      ".": {
        require: "./index.cjs",
        import: "./index.js",
        types: "./index.d.ts",
      },
      "./schema": "./bro-v1-schema.json",
      "./context": "./bro-v1-context.jsonld",
    },
    dependencies: {
      "@cfworker/json-schema": cfworkerVersion,
    },
  };

  fs.writeFileSync(path.join(distDir, "package.json"), JSON.stringify(publishPackageJson, null, 2));
  console.log("Build complete. You can publish from /dist-validator.");
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
