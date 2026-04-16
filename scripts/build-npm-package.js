import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildNpmPackage() {
  try {
    const rootDir = path.resolve(__dirname, '..');
    const distNpmDir = path.resolve(rootDir, 'dist-npm');
    
    console.log('[BUILD] Initiating tsup bundling sequence for NPM package...');
    
    // Command: pnpm exec tsup src/npm-index.ts --format cjs,esm --dts --outDir dist-npm --clean --tsconfig tsconfig.app.json
    const tsupCommand = 'pnpm exec tsup src/npm-index.ts --format cjs,esm --dts --outDir dist-npm --clean --tsconfig tsconfig.app.json';
    
    execSync(tsupCommand, { 
      cwd: rootDir, 
      stdio: 'inherit' 
    });
    
    console.log('[BUILD] Bundling complete. Initiating asset replication...');

    const schemaSourcePath = path.resolve(rootDir, 'worker/assets/bro-v1-schema.json');
    const schemaDestPath = path.resolve(distNpmDir, 'bro-v1-schema.json');
    
    if (!fs.existsSync(schemaSourcePath)) {
        throw new Error(`CRITICAL: Schema source file not found at ${schemaSourcePath}`);
    }

    fs.copyFileSync(schemaSourcePath, schemaDestPath);
    console.log(`[BUILD] Asset replicated: ${schemaDestPath}`);

    // Replication of documentation assets (README.md, LICENSE)
    const docAssets = ['README.md', 'LICENSE'];
    for (const asset of docAssets) {
        const sourcePath = path.resolve(rootDir, asset);
        const destPath = path.resolve(distNpmDir, asset);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`[BUILD] Asset replicated: ${destPath}`);
        } else {
            console.warn(`[BUILD WARNING] Documentation asset not found at ${sourcePath}`);
        }
    }

    const rootPkg = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf8'));

    // NPM 패키지에 필요한 최소한의 의존성만 포함
    const npmDependencies = {};
    const requiredDeps = ['@cfworker/json-schema'];
    for (const dep of requiredDeps) {
      if (rootPkg.dependencies?.[dep]) {
        npmDependencies[dep] = rootPkg.dependencies[dep];
      }
    }

    const distPackageJson = {
      name: rootPkg.name,
      version: rootPkg.version,
      description: rootPkg.description,
      repository: rootPkg.repository,
      author: rootPkg.author,
      license: rootPkg.license,
      keywords: [
        ...rootPkg.keywords,
        "bibframe",
        "json-ld",
        "bibliographic",
        "schema.org"
      ],
      main: "./npm-index.cjs",
      module: "./npm-index.js",
      types: "./npm-index.d.ts",
      exports: {
        ".": {
          "types": "./npm-index.d.ts",
          "import": "./npm-index.js",
          "require": "./npm-index.cjs"
        },
        "./schema": "./bro-v1-schema.json"
      },
      dependencies: npmDependencies,
      peerDependencies: {}
    };

    fs.writeFileSync(
      path.resolve(distNpmDir, 'package.json'),
      JSON.stringify(distPackageJson, null, 2),
      'utf8'
    );
    
    console.log('[BUILD] Standalone package.json generated successfully.');
    console.log('[BUILD] NPM package build pipeline executed without fatal errors.');

  } catch (error) {
    console.error('[BUILD FATAL ERROR] NPM package build pipeline failed.');
    console.error(error);
    process.exit(1);
  }
}

buildNpmPackage();
