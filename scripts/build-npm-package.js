import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildNpmPackage() {
  try {
    const rootDir = path.resolve(__dirname, "..");
    const distNpmDir = path.resolve(rootDir, "dist-npm");

    console.log("[BUILD] Bundling BRO v1.0 NPM package...");
    execSync("pnpm exec tsup src/npm-index.ts --format cjs,esm --dts --outDir dist-npm --clean --tsconfig tsconfig.app.json", {
      cwd: rootDir,
      stdio: "inherit",
    });

    console.log("[BUILD] Copying immutable specification assets...");
    const assets = [
      ["worker/assets/bro-v1-schema.json", "bro-v1-schema.json"],
      ["worker/assets/bro-v1-context.jsonld", "bro-v1-context.jsonld"],
      ["worker/assets/bro-v1-vocab.ttl", "bro-v1-vocab.ttl"],
      ["README.md", "README.md"],
      ["LICENSE", "LICENSE"],
    ];

    for (const [source, destination] of assets) {
      const sourcePath = path.resolve(rootDir, source);
      if (!fs.existsSync(sourcePath)) {
        throw new Error(`Required package asset not found: ${sourcePath}`);
      }
      fs.copyFileSync(sourcePath, path.resolve(distNpmDir, destination));
      console.log(`[BUILD] Copied ${destination}`);
    }

    const rootPkg = JSON.parse(fs.readFileSync(path.resolve(rootDir, "package.json"), "utf8"));
    const requiredDeps = ["@cfworker/json-schema"];
    const dependencies = Object.fromEntries(
      requiredDeps
        .filter((dep) => rootPkg.dependencies?.[dep])
        .map((dep) => [dep, rootPkg.dependencies[dep]]),
    );

    const distPackageJson = {
      name: rootPkg.name,
      version: rootPkg.version,
      description: rootPkg.description,
      repository: rootPkg.repository,
      author: rootPkg.author,
      license: rootPkg.license,
      keywords: Array.from(new Set([...(rootPkg.keywords || []), "json-ld", "bibliographic", "schema.org", "json-schema"])),
      main: "./npm-index.cjs",
      module: "./npm-index.js",
      types: "./npm-index.d.ts",
      exports: {
        ".": {
          types: "./npm-index.d.ts",
          import: "./npm-index.js",
          require: "./npm-index.cjs",
        },
        "./schema": "./bro-v1-schema.json",
        "./context": "./bro-v1-context.jsonld",
        "./vocab": "./bro-v1-vocab.ttl",
      },
      dependencies,
      peerDependencies: {},
    };

    fs.writeFileSync(path.resolve(distNpmDir, "package.json"), JSON.stringify(distPackageJson, null, 2), "utf8");
    console.log("[BUILD] NPM package build completed.");
  } catch (error) {
    console.error("[BUILD FATAL ERROR] NPM package build pipeline failed.");
    console.error(error);
    process.exit(1);
  }
}

buildNpmPackage();
