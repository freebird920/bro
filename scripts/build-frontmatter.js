import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function build() {
  const distDir = path.resolve('dist-frontmatter');

  console.log('1. Building frontmatter module...');
  // Build the frontmatter logic using tsup (Generates CJS, ESM, and type declarations)
  execSync('pnpm exec tsup src/lib/frontmatter.ts --format cjs,esm --dts --outDir dist-frontmatter --clean --tsconfig tsconfig.app.json', { stdio: 'inherit' });

  console.log('2. Generating package.json for npm publish...');
  // Generate a virtual package.json specifically for the @slat.or.kr/bro-frontmatter release
  const publishPackageJson = {
    name: "@slat.or.kr/bro-frontmatter",
    version: "1.0.1",
    main: "./frontmatter.cjs",
    module: "./frontmatter.js",
    types: "./frontmatter.d.ts",
    exports: {
      ".": {
        "require": "./frontmatter.cjs",
        "import": "./frontmatter.js",
        "types": "./frontmatter.d.ts"
      }
    }
  };

  // Write the generated package.json into the dist-frontmatter folder
  fs.writeFileSync(
    path.join(distDir, 'package.json'),
    JSON.stringify(publishPackageJson, null, 2)
  );

  console.log('✅ Build complete! You can now publish from /dist-frontmatter');
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
