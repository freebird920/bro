This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
scripts/
  build-frontmatter.js
  build-npm-package.js
  build-validator.js
  generate-schema-types.cjs
src/
  lib/
    bibframe-converter.ts
    bro-types.ts
    githubmarkdown.css
    komarc-converter.ts
    markdown-renderer.ts
    normalize.ts
    utils.ts
  validator/
    index.ts
    schema-types.ts
  App.tsx
  index.css
  main.tsx
  npm-index.ts
worker/
  assets/
    bro-v1-schema.json
  index.ts
.gitignore
.repomixignore
components.json
index.html
LICENSE
package.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.node.json
tsconfig.worker.json
vite.config.ts
wrangler.jsonc
```

# Files

## File: .repomixignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
src/assets
src/assets/*
node_modules
dist
dist-ssr
*.local
shared/database.gen.ts
src/components/ui
dist-frontmatter/**
dist-npm/**
dist-validator/**
# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# wrangler files
.wrangler
.dev.vars*
!.dev.vars.example
.env*
!.env.example

gemini_output*
.gemini/*
.gemini
.gemini_output/*
.gemini_output


public/read365/schools.json
public/read365/*

*.svg
*.png
node_modules/
.wrangler/
dist/
**/*.d.ts

public/m-mid-school-curriculum.json
*.csv

supabase/*
./supabse/*


legacy/*
public/data/*
.config/*
.gemini/*
.gemini_output/*
.tanstack/*
.vscode/*

scratch/*
*.xlsx
**.xlsx
dist
dist/*
public/*
public
pnpm-lock.yaml

pnpm-workspace.yaml

eslint.config.js
wasm/wasm-vector-core/target/*
wasm/wasm-vector-core/pkg/*
supabase
pnpm-lock.yaml
.claudeignore
CLAUDE.md
wasm/
````

## File: scripts/build-frontmatter.js
````javascript
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
````

## File: scripts/build-validator.js
````javascript
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { compileFromFile } from 'json-schema-to-typescript';

async function build() {
  const distDir = path.resolve('dist-validator');

  console.log('1. Generating TypeScript types from schema...');
  const schemaPath = path.resolve('worker/assets/bro-v1-schema.json');
  const typesPath = path.resolve('src/validator/types.ts');
  
  try {
    const tsResult = await compileFromFile(schemaPath, {
      bannerComment: '/* eslint-disable */\n/**\n* This file was automatically generated by json-schema-to-typescript.\n* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,\n* and run the build script to regenerate this file.\n*/',
      unreachableDefinitions: true
    });
    fs.writeFileSync(typesPath, tsResult);
    console.log(`✅ Types generated at ${typesPath}`);
  } catch (error) {
    console.error('❌ Failed to generate types:', error);
    process.exit(1);
  }

  console.log('2. Building validator...');
  // Build only the validator code using tsup (Generates CJS, ESM, and type declarations)
  execSync('pnpm exec tsup src/validator/index.ts --format cjs,esm --dts --outDir dist-validator --clean --tsconfig tsconfig.app.json', { stdio: 'inherit' });

  console.log('3. Generating package.json for npm publish...');
  // Read the root package.json to sync the @cfworker/json-schema version
  const rootPackageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));
  const cfworkerVersion = rootPackageJson.dependencies?.['@cfworker/json-schema'] || '^1.12.8';

  // Generate a virtual package.json specifically for the NPM release
  const publishPackageJson = {
    name: "@slat.or.kr/bro-validator",
    version: "1.0.5", // Increment this version number for future releases (e.g., 1.0.1)
    main: "./index.cjs",
    module: "./index.js",
    types: "./index.d.ts",
    exports: {
      ".": {
        "require": "./index.cjs",
        "import": "./index.js",
        "types": "./index.d.ts"
      }
    },
    dependencies: {
      "@cfworker/json-schema": cfworkerVersion
    }
  };

  // Write the generated package.json into the dist-validator folder
  fs.writeFileSync(
    path.join(distDir, 'package.json'),
    JSON.stringify(publishPackageJson, null, 2)
  );

  console.log('✅ Build complete! You can now publish from /dist-validator');
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
````

## File: scripts/generate-schema-types.cjs
````javascript
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
````

## File: src/lib/githubmarkdown.css
````css
/* light */
.markdown-body {
  color-scheme: light;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  margin: 0;
  color: #1f2328;
  background-color: #ffffff;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-body .octicon {
  display: inline-block;
  fill: currentColor;
  vertical-align: text-bottom;
}

.markdown-body h1:hover .anchor .octicon-link:before,
.markdown-body h2:hover .anchor .octicon-link:before,
.markdown-body h3:hover .anchor .octicon-link:before,
.markdown-body h4:hover .anchor .octicon-link:before,
.markdown-body h5:hover .anchor .octicon-link:before,
.markdown-body h6:hover .anchor .octicon-link:before {
  width: 16px;
  height: 16px;
  content: " ";
  display: inline-block;
  background-color: currentColor;
  -webkit-mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
  mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
}

.markdown-body details,
.markdown-body figcaption,
.markdown-body figure {
  display: block;
}

.markdown-body summary {
  display: list-item;
}

.markdown-body [hidden] {
  display: none !important;
}

.markdown-body a {
  background-color: transparent;
  color: #0969da;
  text-decoration: none;
}

.markdown-body abbr[title] {
  border-bottom: none;
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}

.markdown-body b,
.markdown-body strong {
  font-weight: 600;
}

.markdown-body dfn {
  font-style: italic;
}

.markdown-body h1 {
  margin: 0.67em 0;
  font-weight: 600;
  padding-bottom: 0.3em;
  font-size: 2em;
  border-bottom: 1px solid #d1d9e0b3;
}

.markdown-body mark {
  background-color: #fff8c5;
  color: #1f2328;
}

.markdown-body small {
  font-size: 90%;
}

.markdown-body sub,
.markdown-body sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

.markdown-body sub {
  bottom: -0.25em;
}

.markdown-body sup {
  top: -0.5em;
}

.markdown-body img {
  border-style: none;
  max-width: 100%;
  box-sizing: content-box;
}

.markdown-body code,
.markdown-body kbd,
.markdown-body pre,
.markdown-body samp {
  font-family: monospace;
  font-size: 1em;
}

.markdown-body figure {
  margin: 1em 2.5rem;
}

.markdown-body hr {
  box-sizing: content-box;
  overflow: hidden;
  background: transparent;
  border-bottom: 1px solid #d1d9e0b3;
  height: 0.25em;
  padding: 0;
  margin: 1.5rem 0;
  background-color: #d1d9e0;
  border: 0;
}

.markdown-body input {
  font: inherit;
  margin: 0;
  overflow: visible;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.markdown-body [type="button"],
.markdown-body [type="reset"],
.markdown-body [type="submit"] {
  -webkit-appearance: button;
  appearance: button;
}

.markdown-body [type="checkbox"],
.markdown-body [type="radio"] {
  box-sizing: border-box;
  padding: 0;
}

.markdown-body [type="number"]::-webkit-inner-spin-button,
.markdown-body [type="number"]::-webkit-outer-spin-button {
  height: auto;
}

.markdown-body [type="search"]::-webkit-search-cancel-button,
.markdown-body [type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}

.markdown-body ::-webkit-input-placeholder {
  color: inherit;
  opacity: 0.54;
}

.markdown-body ::-webkit-file-upload-button {
  -webkit-appearance: button;
  appearance: button;
  font: inherit;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body ::placeholder {
  color: #59636e;
  opacity: 1;
}

.markdown-body hr::before {
  display: table;
  content: "";
}

.markdown-body hr::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
  font-variant: tabular-nums;
}

.markdown-body td,
.markdown-body th {
  padding: 0;
}

.markdown-body details summary {
  cursor: pointer;
}

.markdown-body a:focus,
.markdown-body [role="button"]:focus,
.markdown-body input[type="radio"]:focus,
.markdown-body input[type="checkbox"]:focus {
  outline: 2px solid #0969da;
  outline-offset: -2px;
  box-shadow: none;
}

.markdown-body a:focus:not(:focus-visible),
.markdown-body [role="button"]:focus:not(:focus-visible),
.markdown-body input[type="radio"]:focus:not(:focus-visible),
.markdown-body input[type="checkbox"]:focus:not(:focus-visible) {
  outline: solid 1px transparent;
}

.markdown-body a:focus-visible,
.markdown-body [role="button"]:focus-visible,
.markdown-body input[type="radio"]:focus-visible,
.markdown-body input[type="checkbox"]:focus-visible {
  outline: 2px solid #0969da;
  outline-offset: -2px;
  box-shadow: none;
}

.markdown-body a:not([class]):focus,
.markdown-body a:not([class]):focus-visible,
.markdown-body input[type="radio"]:focus,
.markdown-body input[type="radio"]:focus-visible,
.markdown-body input[type="checkbox"]:focus,
.markdown-body input[type="checkbox"]:focus-visible {
  outline-offset: 0;
}

.markdown-body kbd {
  display: inline-block;
  padding: 0.25rem;
  font:
    11px ui-monospace,
    SFMono-Regular,
    SF Mono,
    Menlo,
    Consolas,
    Liberation Mono,
    monospace;
  line-height: 10px;
  color: #1f2328;
  vertical-align: middle;
  background-color: #f6f8fa;
  border: solid 1px #d1d9e0b3;
  border-bottom-color: #d1d9e0b3;
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 #d1d9e0b3;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h2 {
  font-weight: 600;
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #d1d9e0b3;
}

.markdown-body h3 {
  font-weight: 600;
  font-size: 1.25em;
}

.markdown-body h4 {
  font-weight: 600;
  font-size: 1em;
}

.markdown-body h5 {
  font-weight: 600;
  font-size: 0.875em;
}

.markdown-body h6 {
  font-weight: 600;
  font-size: 0.85em;
  color: #59636e;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 10px;
}

.markdown-body blockquote {
  margin: 0;
  padding: 0 1em;
  color: #59636e;
  border-left: 0.25em solid #d1d9e0;
}

.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 2em;
}

.markdown-body ol ol,
.markdown-body ul ol {
  list-style-type: lower-roman;
}

.markdown-body ul ul ol,
.markdown-body ul ol ol,
.markdown-body ol ul ol,
.markdown-body ol ol ol {
  list-style-type: lower-alpha;
}

.markdown-body dd {
  margin-left: 0;
}

.markdown-body tt,
.markdown-body code,
.markdown-body samp {
  font-family:
    ui-monospace,
    SFMono-Regular,
    SF Mono,
    Menlo,
    Consolas,
    Liberation Mono,
    monospace;
  font-size: 12px;
}

.markdown-body pre {
  margin-top: 0;
  margin-bottom: 0;
  font-family:
    ui-monospace,
    SFMono-Regular,
    SF Mono,
    Menlo,
    Consolas,
    Liberation Mono,
    monospace;
  font-size: 12px;
  word-wrap: normal;
}

.markdown-body .octicon {
  display: inline-block;
  overflow: visible !important;
  vertical-align: text-bottom;
  fill: currentColor;
}

.markdown-body input::-webkit-outer-spin-button,
.markdown-body input::-webkit-inner-spin-button {
  margin: 0;
  appearance: none;
}

.markdown-body .mr-2 {
  margin-right: 0.5rem !important;
}

.markdown-body::before {
  display: table;
  content: "";
}

.markdown-body::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-body > *:first-child {
  margin-top: 0 !important;
}

.markdown-body > *:last-child {
  margin-bottom: 0 !important;
}

.markdown-body a:not([href]) {
  color: inherit;
  text-decoration: none;
}

.markdown-body .absent {
  color: #d1242f;
}

.markdown-body .anchor {
  float: left;
  padding-right: 0.25rem;
  margin-left: -20px;
  line-height: 1;
}

.markdown-body .anchor:focus {
  outline: none;
}

.markdown-body p,
.markdown-body blockquote,
.markdown-body ul,
.markdown-body ol,
.markdown-body dl,
.markdown-body table,
.markdown-body pre,
.markdown-body details {
  margin-top: 0;
  margin-bottom: 1rem;
}

.markdown-body blockquote > :first-child {
  margin-top: 0;
}

.markdown-body blockquote > :last-child {
  margin-bottom: 0;
}

.markdown-body h1 .octicon-link,
.markdown-body h2 .octicon-link,
.markdown-body h3 .octicon-link,
.markdown-body h4 .octicon-link,
.markdown-body h5 .octicon-link,
.markdown-body h6 .octicon-link {
  color: #1f2328;
  vertical-align: middle;
  visibility: hidden;
}

.markdown-body h1:hover .anchor,
.markdown-body h2:hover .anchor,
.markdown-body h3:hover .anchor,
.markdown-body h4:hover .anchor,
.markdown-body h5:hover .anchor,
.markdown-body h6:hover .anchor {
  text-decoration: none;
}

.markdown-body h1:hover .anchor .octicon-link,
.markdown-body h2:hover .anchor .octicon-link,
.markdown-body h3:hover .anchor .octicon-link,
.markdown-body h4:hover .anchor .octicon-link,
.markdown-body h5:hover .anchor .octicon-link,
.markdown-body h6:hover .anchor .octicon-link {
  visibility: visible;
}

.markdown-body h1 tt,
.markdown-body h1 code,
.markdown-body h2 tt,
.markdown-body h2 code,
.markdown-body h3 tt,
.markdown-body h3 code,
.markdown-body h4 tt,
.markdown-body h4 code,
.markdown-body h5 tt,
.markdown-body h5 code,
.markdown-body h6 tt,
.markdown-body h6 code {
  padding: 0 0.2em;
  font-size: inherit;
}

.markdown-body summary h1,
.markdown-body summary h2,
.markdown-body summary h3,
.markdown-body summary h4,
.markdown-body summary h5,
.markdown-body summary h6 {
  display: inline-block;
}

.markdown-body summary h1 .anchor,
.markdown-body summary h2 .anchor,
.markdown-body summary h3 .anchor,
.markdown-body summary h4 .anchor,
.markdown-body summary h5 .anchor,
.markdown-body summary h6 .anchor {
  margin-left: -40px;
}

.markdown-body summary h1,
.markdown-body summary h2 {
  padding-bottom: 0;
  border-bottom: 0;
}

.markdown-body ul.no-list,
.markdown-body ol.no-list {
  padding: 0;
  list-style-type: none;
}

.markdown-body ol[type="a s"] {
  list-style-type: lower-alpha;
}

.markdown-body ol[type="A s"] {
  list-style-type: upper-alpha;
}

.markdown-body ol[type="i s"] {
  list-style-type: lower-roman;
}

.markdown-body ol[type="I s"] {
  list-style-type: upper-roman;
}

.markdown-body ol[type="1"] {
  list-style-type: decimal;
}

.markdown-body div > ol:not([type]) {
  list-style-type: decimal;
}

.markdown-body ul ul,
.markdown-body ul ol,
.markdown-body ol ol,
.markdown-body ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body li > p {
  margin-top: 1rem;
}

.markdown-body li + li {
  margin-top: 0.25em;
}

.markdown-body dl {
  padding: 0;
}

.markdown-body dl dt {
  padding: 0;
  margin-top: 1rem;
  font-size: 1em;
  font-style: italic;
  font-weight: 600;
}

.markdown-body dl dd {
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.markdown-body table th {
  font-weight: 600;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #d1d9e0;
}

.markdown-body table td > :last-child {
  margin-bottom: 0;
}

.markdown-body table tr {
  background-color: #ffffff;
  border-top: 1px solid #d1d9e0b3;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-body table img {
  background-color: transparent;
}

.markdown-body img[align="right"] {
  padding-left: 20px;
}

.markdown-body img[align="left"] {
  padding-right: 20px;
}

.markdown-body .emoji {
  max-width: none;
  vertical-align: text-top;
  background-color: transparent;
}

.markdown-body span.frame {
  display: block;
  overflow: hidden;
}

.markdown-body span.frame > span {
  display: block;
  float: left;
  width: auto;
  padding: 7px;
  margin: 13px 0 0;
  overflow: hidden;
  border: 1px solid #d1d9e0;
}

.markdown-body span.frame span img {
  display: block;
  float: left;
}

.markdown-body span.frame span span {
  display: block;
  padding: 5px 0 0;
  clear: both;
  color: #1f2328;
}

.markdown-body span.align-center {
  display: block;
  overflow: hidden;
  clear: both;
}

.markdown-body span.align-center > span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: center;
}

.markdown-body span.align-center span img {
  margin: 0 auto;
  text-align: center;
}

.markdown-body span.align-right {
  display: block;
  overflow: hidden;
  clear: both;
}

.markdown-body span.align-right > span {
  display: block;
  margin: 13px 0 0;
  overflow: hidden;
  text-align: right;
}

.markdown-body span.align-right span img {
  margin: 0;
  text-align: right;
}

.markdown-body span.float-left {
  display: block;
  float: left;
  margin-right: 13px;
  overflow: hidden;
}

.markdown-body span.float-left span {
  margin: 13px 0 0;
}

.markdown-body span.float-right {
  display: block;
  float: right;
  margin-left: 13px;
  overflow: hidden;
}

.markdown-body span.float-right > span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: right;
}

.markdown-body code,
.markdown-body tt {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  white-space: break-spaces;
  background-color: #818b981f;
  border-radius: 6px;
}

.markdown-body code br,
.markdown-body tt br {
  display: none;
}

.markdown-body del code {
  text-decoration: inherit;
}

.markdown-body samp {
  font-size: 85%;
}

.markdown-body pre code {
  font-size: 100%;
}

.markdown-body pre > code {
  padding: 0;
  margin: 0;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-body .highlight {
  margin-bottom: 1rem;
}

.markdown-body .highlight pre {
  margin-bottom: 0;
  word-break: normal;
}

.markdown-body .highlight pre,
.markdown-body pre {
  padding: 1rem;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  color: #1f2328;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.markdown-body pre code,
.markdown-body pre tt {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-body .csv-data td,
.markdown-body .csv-data th {
  padding: 5px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1;
  text-align: left;
  white-space: nowrap;
}

.markdown-body .csv-data .blob-num {
  padding: 10px 0.5rem 9px;
  text-align: right;
  background: #ffffff;
  border: 0;
}

.markdown-body .csv-data tr {
  border-top: 0;
}

.markdown-body .csv-data th {
  font-weight: 600;
  background: #f6f8fa;
  border-top: 0;
}

.markdown-body [data-footnote-ref]::before {
  content: "[";
}

.markdown-body [data-footnote-ref]::after {
  content: "]";
}

.markdown-body .footnotes {
  font-size: 12px;
  color: #59636e;
  border-top: 1px solid #d1d9e0;
}

.markdown-body .footnotes ol {
  padding-left: 1rem;
}

.markdown-body .footnotes ol ul {
  display: inline-block;
  padding-left: 1rem;
  margin-top: 1rem;
}

.markdown-body .footnotes li {
  position: relative;
}

.markdown-body .footnotes li:target::before {
  position: absolute;
  top: calc(0.5rem * -1);
  right: calc(0.5rem * -1);
  bottom: calc(0.5rem * -1);
  left: calc(1.5rem * -1);
  pointer-events: none;
  content: "";
  border: 2px solid #0969da;
  border-radius: 6px;
}

.markdown-body .footnotes li:target {
  color: #1f2328;
}

.markdown-body .footnotes .data-footnote-backref g-emoji {
  font-family: monospace;
}

.markdown-body body:has(:modal) {
  padding-right: var(--dialog-scrollgutter) !important;
}

.markdown-body .pl-c {
  color: #59636e;
}

.markdown-body .pl-c1,
.markdown-body .pl-s .pl-v {
  color: #0550ae;
}

.markdown-body .pl-e,
.markdown-body .pl-en {
  color: #6639ba;
}

.markdown-body .pl-smi,
.markdown-body .pl-s .pl-s1 {
  color: #1f2328;
}

.markdown-body .pl-ent {
  color: #0550ae;
}

.markdown-body .pl-k {
  color: #cf222e;
}

.markdown-body .pl-s,
.markdown-body .pl-pds,
.markdown-body .pl-s .pl-pse .pl-s1,
.markdown-body .pl-sr,
.markdown-body .pl-sr .pl-cce,
.markdown-body .pl-sr .pl-sre,
.markdown-body .pl-sr .pl-sra {
  color: #0a3069;
}

.markdown-body .pl-v,
.markdown-body .pl-smw {
  color: #953800;
}

.markdown-body .pl-bu {
  color: #82071e;
}

.markdown-body .pl-ii {
  color: #f6f8fa;
  background-color: #82071e;
}

.markdown-body .pl-c2 {
  color: #f6f8fa;
  background-color: #cf222e;
}

.markdown-body .pl-sr .pl-cce {
  font-weight: bold;
  color: #116329;
}

.markdown-body .pl-ml {
  color: #3b2300;
}

.markdown-body .pl-mh,
.markdown-body .pl-mh .pl-en,
.markdown-body .pl-ms {
  font-weight: bold;
  color: #0550ae;
}

.markdown-body .pl-mi {
  font-style: italic;
  color: #1f2328;
}

.markdown-body .pl-mb {
  font-weight: bold;
  color: #1f2328;
}

.markdown-body .pl-md {
  color: #82071e;
  background-color: #ffebe9;
}

.markdown-body .pl-mi1 {
  color: #116329;
  background-color: #dafbe1;
}

.markdown-body .pl-mc {
  color: #953800;
  background-color: #ffd8b5;
}

.markdown-body .pl-mi2 {
  color: #d1d9e0;
  background-color: #0550ae;
}

.markdown-body .pl-mdr {
  font-weight: bold;
  color: #8250df;
}

.markdown-body .pl-ba {
  color: #59636e;
}

.markdown-body .pl-sg {
  color: #818b98;
}

.markdown-body .pl-corl {
  text-decoration: underline;
  color: #0a3069;
}

.markdown-body [role="button"]:focus:not(:focus-visible),
.markdown-body [role="tabpanel"][tabindex="0"]:focus:not(:focus-visible),
.markdown-body button:focus:not(:focus-visible),
.markdown-body summary:focus:not(:focus-visible),
.markdown-body a:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}

.markdown-body [tabindex="0"]:focus:not(:focus-visible),
.markdown-body details-dialog:focus:not(:focus-visible) {
  outline: none;
}

.markdown-body g-emoji {
  display: inline-block;
  min-width: 1ch;
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1em;
  font-style: normal !important;
  font-weight: 400;
  line-height: 1;
  vertical-align: -0.075em;
}

.markdown-body g-emoji img {
  width: 1em;
  height: 1em;
}

.markdown-body .task-list-item {
  list-style-type: none;
}

.markdown-body .task-list-item label {
  font-weight: 400;
}

.markdown-body .task-list-item.enabled label {
  cursor: pointer;
}

.markdown-body .task-list-item + .task-list-item {
  margin-top: 0.25rem;
}

.markdown-body .task-list-item .handle {
  display: none;
}

.markdown-body .task-list-item-checkbox {
  margin: 0 0.2em 0.25em -1.4em;
  vertical-align: middle;
}

.markdown-body ul:dir(rtl) .task-list-item-checkbox {
  margin: 0 -1.6em 0.25em 0.2em;
}

.markdown-body ol:dir(rtl) .task-list-item-checkbox {
  margin: 0 -1.6em 0.25em 0.2em;
}

.markdown-body .contains-task-list:hover .task-list-item-convert-container,
.markdown-body
  .contains-task-list:focus-within
  .task-list-item-convert-container {
  display: block;
  width: auto;
  height: 24px;
  overflow: visible;
  clip: auto;
}

.markdown-body ::-webkit-calendar-picker-indicator {
  filter: invert(50%);
}

.markdown-body .markdown-alert {
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  color: inherit;
  border-left: 0.25em solid #d1d9e0;
}

.markdown-body .markdown-alert > :first-child {
  margin-top: 0;
}

.markdown-body .markdown-alert > :last-child {
  margin-bottom: 0;
}

.markdown-body .markdown-alert .markdown-alert-title {
  display: flex;
  font-weight: 500;
  align-items: center;
  line-height: 1;
}

.markdown-body .markdown-alert.markdown-alert-note {
  border-left-color: #0969da;
}

.markdown-body .markdown-alert.markdown-alert-note .markdown-alert-title {
  color: #0969da;
}

.markdown-body .markdown-alert.markdown-alert-important {
  border-left-color: #8250df;
}

.markdown-body .markdown-alert.markdown-alert-important .markdown-alert-title {
  color: #8250df;
}

.markdown-body .markdown-alert.markdown-alert-warning {
  border-left-color: #9a6700;
}

.markdown-body .markdown-alert.markdown-alert-warning .markdown-alert-title {
  color: #9a6700;
}

.markdown-body .markdown-alert.markdown-alert-tip {
  border-left-color: #1a7f37;
}

.markdown-body .markdown-alert.markdown-alert-tip .markdown-alert-title {
  color: #1a7f37;
}

.markdown-body .markdown-alert.markdown-alert-caution {
  border-left-color: #cf222e;
}

.markdown-body .markdown-alert.markdown-alert-caution .markdown-alert-title {
  color: #d1242f;
}

.markdown-body > *:first-child > .heading-element:first-child {
  margin-top: 0 !important;
}

.markdown-body .highlight pre:has(+ .zeroclipboard-container) {
  min-height: 52px;
}
````

## File: src/lib/normalize.ts
````typescript
/**
 * URN Normalization Pipeline
 * 
 * bro-v1-schema.json에서 (?i:) 플래그가 제거되었으므로,
 * Validation 이전 단계에서 식별자의 Scheme 부분을 소문자로 정규화합니다.
 * 
 * 예: "URN:UUID:123..." → "urn:uuid:123..."
 *     "URN:ISBN:978..." → "urn:isbn:978..."
 */

/**
 * BRO v1 스키마에서 사용하는 URN Scheme 접두사 목록 (소문자 정규형)
 * 이 접두사까지만 소문자로 변환하고, 이후 NSS 값은 원본 보존합니다.
 */
const URN_SCHEME_PREFIXES = [
  "urn:isbn:",
  "urn:doi:",
  "urn:uci:",
  "urn:kolis:",
  "urn:uuid:",
  "urn:orcid:",
  "urn:isni:",
  "urn:kr:govcode:",
  "urn:kr:crn:",
  "urn:kr:brn:",
  "urn:kr:npo:",
  "urn:lei:",
  "urn:model:",
];

/**
 * URN Scheme 부분만 소문자로 변환합니다.
 * 알려진 접두사를 대소문자 무시하여 매칭한 뒤, 접두사를 소문자로 정규화합니다.
 * NSS(Namespace Specific String) 부분은 원본 그대로 유지됩니다.
 * 
 * 예: "URN:UUID:abc-def" → "urn:uuid:abc-def"
 *     "urn:model:Google:Gemini-1.5" → "urn:model:Google:Gemini-1.5" (NSS 보존)
 *     "URN:KR:CRN:1234567890123" → "urn:kr:crn:1234567890123"
 */
export function normalizeUrnScheme(urn: string): string {
  if (typeof urn !== "string") return urn;

  const lower = urn.toLowerCase();
  for (const prefix of URN_SCHEME_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return prefix + urn.slice(prefix.length);
    }
  }

  return urn;
}

/**
 * 식별자 필드 키 목록
 */
const IDENTIFIER_KEYS = new Set(["@id", "identifier"]);

/**
 * 페이로드를 재귀적으로 순회하며 모든 URN 식별자의 Scheme을 소문자로 정규화합니다.
 * 원본 객체를 직접 수정(mutate)합니다.
 */
export function normalizePayload<T>(payload: T): T {
  if (payload === null || payload === undefined) return payload;

  if (Array.isArray(payload)) {
    for (let i = 0; i < payload.length; i++) {
      payload[i] = normalizePayload(payload[i]);
    }
    return payload;
  }

  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      if (IDENTIFIER_KEYS.has(key) && typeof obj[key] === "string") {
        obj[key] = normalizeUrnScheme(obj[key] as string);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        normalizePayload(obj[key]);
      }
    }
    return payload;
  }

  return payload;
}
````

## File: src/lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
````

## File: src/index.css
````css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/inter";

@theme inline {
  --font-heading: var(--font-sans);
  --font-sans: "Inter Variable", sans-serif;
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground antialiased selection:bg-primary/10 min-h-screen;
  }
  html {
    @apply font-sans;
  }
}
````

## File: src/main.tsx
````typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
````

## File: .gitignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# wrangler files
.wrangler
.dev.vars*
!.dev.vars.example
.env*
!.env.example

gemini_output*
MEMO.md
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
````

## File: index.html
````html
<!doctype html>
<html lang="ko" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/booksle_icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BRO:Bibliographic Reaction Object</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: LICENSE
````
Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
````

## File: tsconfig.app.json
````json
{
  "compilerOptions": {
    // "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "resolveJsonModule": true,
    "esModuleInterop": true
  },
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    },
    {
      "path": "./tsconfig.worker.json"
    }
  ]
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
````

## File: tsconfig.worker.json
````json
{
  "extends": "./tsconfig.node.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.worker.tsbuildinfo",
    "types": ["./worker-configuration.d.ts", "vite/client"],
  },
  "include": ["worker"]
}
````

## File: vite.config.ts
````typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
````

## File: wrangler.jsonc
````json
/**
 * For more details on how to configure Wrangler, refer to:
 * https://developers.cloudflare.com/workers/wrangler/configuration/
 */
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "bro-schema",
  "main": "worker/index.ts",
  "compatibility_date": "2026-04-10",
  "assets": {
    // "not_found_handling": "single-page-application"
  },
  "observability": {
    "enabled": true,
  },
  "upload_source_maps": true,
  "compatibility_flags": ["nodejs_compat"],
  "routes": [{ "pattern": "schema.slat.or.kr", "custom_domain": true }],

  /**
   * Smart Placement
   * https://developers.cloudflare.com/workers/configuration/smart-placement/#smart-placement
   */
  // "placement": {  "mode": "smart" }
  /**
   * Bindings
   * Bindings allow your Worker to interact with resources on the Cloudflare Developer Platform, including
   * databases, object storage, AI inference, real-time communication and more.
   * https://developers.cloudflare.com/workers/runtime-apis/bindings/
   */
  /**
   * Environment Variables
   * https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables
   * Note: Use secrets to store sensitive data.
   * https://developers.cloudflare.com/workers/configuration/secrets/
   */
  // "vars": {  "MY_VARIABLE": "production_value" }
  /**
   * Service Bindings (communicate between multiple Workers)
   * https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings
   */
  // "services": [  {   "binding": "MY_SERVICE",   "service": "my-service"  } ]
}
````

## File: scripts/build-npm-package.js
````javascript
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
````

## File: src/lib/bibframe-converter.ts
````typescript
/**
 * BRO → BIBFRAME 2.0 변환기
 * 
 * BRO 페이로드(Article/Abstract)를 BIBFRAME 2.0 JSON-LD 구조로 변환합니다.
 * Linked Open Data(LOD) 생태계와의 호환성을 위한 완전한 JSON-LD/BIBFRAME 2.0 변환을 지원합니다.
 * 
 * [매핑 규칙]
 * - Article → bf:Work + bf:Review, 관계: bf:reviewOf
 * - CreativeWork (Abstract) → bf:Work + bf:Summary, 관계: bf:summaryOf
 * - Creator 다형성: Person/Anonymous → bf:Person, Organization 계열 → bf:Organization, Software → bf:Agent
 */

import type { BroArticle, BroAbstract } from '../validator/schema-types';

// ─── BIBFRAME Output Types ───

export interface BibframeContribution {
  "@type": "bf:Contribution";
  "bf:agent": {
    "@type": string;
    "@id"?: string;
    "rdfs:label": string;
  };
}

export interface BibframeIdentifier {
  "@type": "bf:Identifier";
  "rdf:value": string;
}

export interface BibframeInstance {
  "@type": "bf:Instance";
  "bf:identifiedBy": BibframeIdentifier;
  "bf:title"?: {
    "@type": "bf:Title";
    "bf:mainTitle": string;
  };
  "bf:responsibilityStatement"?: string;
}

export interface BibframeNote {
  "@type": "bf:Note";
  "rdfs:label": string;
}

export interface BibframeWork {
  "@context": {
    bf: string;
    rdf: string;
    rdfs: string;
  };
  "@type": string[];
  "@id": string;
  "bf:originDate": string;
  "bf:changeDate"?: string;
  "bf:contribution": BibframeContribution[];
  "bf:title"?: {
    "@type": "bf:Title";
    "bf:mainTitle": string;
  };
  "bf:note": BibframeNote;
  [key: string]: unknown;
}

// ─── Converter Implementation ───

/**
 * BRO 페이로드에서 BIBFRAME 2.0으로의 변환.
 * 
 * @param payload BroArticle 또는 BroAbstract 페이로드
 * @returns BIBFRAME 2.0 JSON-LD 객체
 * 
 * @example
 * ```typescript
 * import { convertBroToBibframe } from '@slat.or.kr/bro-schema';
 * 
 * const bibframe = convertBroToBibframe(articlePayload);
 * console.log(bibframe["@type"]); // ["bf:Work", "bf:Review"]
 * ```
 */
export function convertBroToBibframe(payload: BroArticle | BroAbstract): BibframeWork {
  const isArticle = payload["@type"] === "Article";
  const bfClass = isArticle ? "bf:Review" : "bf:Summary";
  const relationProp = isArticle ? "bf:reviewOf" : "bf:summaryOf";

  // 작성자(Agent) 처리 로직 (권위 vs 익명 분기)
  const contributions: BibframeContribution[] = payload.creator.map((agent) => {
    let bfAgentType = "bf:Agent";

    if (agent["@type"] === "Person") bfAgentType = "bf:Person";
    if (agent["@type"] === "Anonymous") bfAgentType = "bf:Person"; // 익명도 개념상 Person으로 매핑
    if (
      ["Organization", "GovernmentOrganization", "Corporation"].includes(agent["@type"])
    ) {
      bfAgentType = "bf:Organization";
    }

    const agentEntry: BibframeContribution["bf:agent"] = {
      "@type": bfAgentType,
      "rdfs:label": ("name" in agent && agent.name) ? agent.name : "Anonymous",
    };

    // 식별자가 있는 경우만 매핑
    if ("@id" in agent && agent["@id"]) {
      agentEntry["@id"] = String(agent["@id"]);
    }

    return {
      "@type": "bf:Contribution" as const,
      "bf:agent": agentEntry,
    };
  });

  // 타겟 식별자 매핑 (about 또는 isBasedOn)
  const targets = isArticle
    ? (payload as BroArticle).about
    : (payload as BroAbstract).isBasedOn;

  const targetInstances: BibframeInstance[] = targets.map((t) => {
    const instance: BibframeInstance = {
      "@type": "bf:Instance" as const,
      "bf:identifiedBy": {
        "@type": "bf:Identifier" as const,
        "rdf:value": String(t.identifier),
      },
    };

    if (isArticle) {
      const article = payload as BroArticle;
      if (article.aboutName) {
        instance["bf:title"] = {
          "@type": "bf:Title",
          "bf:mainTitle": article.aboutName,
        };
      }
      if (article.aboutCreator) {
        instance["bf:responsibilityStatement"] = article.aboutCreator;
      }
    }

    return instance;
  });

  const result: BibframeWork = {
    "@context": {
      "bf": "http://id.loc.gov/ontologies/bibframe/",
      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    },
    "@type": ["bf:Work", bfClass],
    "@id": payload["@id"],
    [relationProp]: targetInstances,
    "bf:originDate": payload.dateCreated,
    ...(payload.dateModified && { "bf:changeDate": payload.dateModified }),
    "bf:contribution": contributions,
    ...(payload.name && {
      "bf:title": {
        "@type": "bf:Title",
        "bf:mainTitle": payload.name,
      },
    }),
    // 순수 본문 매핑 (JSON Native)
    "bf:note": {
      "@type": "bf:Note",
      "rdfs:label": payload.text,
    },
  };

  return result;
}
````

## File: src/lib/markdown-renderer.ts
````typescript
/**
 * BRO → 마크다운+프론트매터 렌더러 (AI RAG 파이프라인용)
 * 
 * BRO JSON 트리와 본문(text)을 합성하여 '마크다운+YAML 프론트매터' 형식의
 * 평문 텍스트를 On-the-fly로 렌더링합니다.
 * 
 * LLM 컨텍스트 주입 시 JSON 구조보다 마크다운+프론트매터가
 * 토큰 효율 및 의미 파싱 정확도에서 유리하므로, 이 렌더러를 통해
 * RAG 검색 결과를 최적화된 형태로 변환합니다.
 * 
 * [주의] 이 모듈은 YAML 의존성 없이 수동 직렬화를 수행합니다.
 */

import type { 
  BroArticle, 
  BroAbstract, 
  BroItemList,
  AdditionalPropertyArray 
} from '../validator/schema-types';

type BroPayload = BroArticle | BroAbstract | BroItemList;

// ─── Internal YAML Serialization Helpers ───

/**
 * 값을 YAML 호환 문자열로 변환합니다.
 * 특수문자가 포함된 문자열은 쌍따옴표로 감싸고, 나머지는 그대로 반환합니다.
 */
function yamlValue(value: unknown): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const str = String(value);
  // 특수문자가 포함되면 따옴표로 감쌈
  if (/[:#\[\]{}&*!|>'"%@`,\n]/.test(str) || str.trim() !== str || str === '') {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return str;
}

/**
 * 문자열 배열을 YAML 리스트로 직렬화합니다.
 */
function yamlStringArray(arr: string[], indent: string = ''): string {
  return arr.map(item => `${indent}  - ${yamlValue(item)}`).join('\n');
}

/**
 * Creator 배열을 YAML로 직렬화합니다.
 */
function yamlCreators(creators: BroArticle['creator'], indent: string = ''): string {
  return creators.map(c => {
    const lines: string[] = [];
    lines.push(`${indent}  - type: ${yamlValue(c['@type'])}`);
    if ('name' in c && c.name) {
      lines.push(`${indent}    name: ${yamlValue(c.name)}`);
    }
    if ('@id' in c && c['@id']) {
      lines.push(`${indent}    id: ${yamlValue(String(c['@id']))}`);
    }
    if (c['@type'] === 'SoftwareApplication' && 'softwareVersion' in c && c.softwareVersion) {
      lines.push(`${indent}    softwareVersion: ${yamlValue(c.softwareVersion)}`);
    }
    return lines.join('\n');
  }).join('\n');
}

/**
 * additionalProperty 배열을 YAML로 직렬화합니다.
 */
function yamlAdditionalProperty(props: AdditionalPropertyArray): string {
  return props.map(p => {
    return `  - name: ${yamlValue(p.name)}\n    value: ${yamlValue(p.value)}`;
  }).join('\n');
}

// ─── Main Renderer ───

/**
 * BRO 페이로드를 마크다운+프론트매터 형식의 평문 텍스트로 렌더링합니다.
 * AI RAG 파이프라인에서 LLM 컨텍스트 주입용으로 사용합니다.
 * 
 * @param payload BroArticle, BroAbstract, 또는 BroItemList 페이로드
 * @returns 마크다운+YAML 프론트매터 형식의 문자열
 * 
 * @example
 * ```typescript
 * import { renderBroToMarkdown } from '@slat.or.kr/bro-schema';
 * 
 * const markdown = renderBroToMarkdown(articlePayload);
 * // ---
 * // id: "urn:uuid:..."
 * // type: Article
 * // ...
 * // ---
 * // # 본문 내용
 * ```
 */
export function renderBroToMarkdown(payload: BroPayload): string {
  const frontmatterLines: string[] = [];

  // Common metadata
  frontmatterLines.push(`id: ${yamlValue(payload['@id'])}`);
  frontmatterLines.push(`type: ${yamlValue(payload['@type'])}`);
  frontmatterLines.push(`dateCreated: ${yamlValue(payload.dateCreated)}`);

  if ('dateModified' in payload && payload.dateModified) {
    frontmatterLines.push(`dateModified: ${yamlValue(payload.dateModified)}`);
  }

  if ('datePublished' in payload && payload.datePublished) {
    frontmatterLines.push(`datePublished: ${yamlValue(payload.datePublished)}`);
  }

  if ('version' in payload && payload.version !== undefined) {
    frontmatterLines.push(`version: ${yamlValue(payload.version)}`);
  }

  if ('name' in payload && payload.name) {
    frontmatterLines.push(`name: ${yamlValue(payload.name)}`);
  }

  // Article-specific fields
  if (payload['@type'] === 'Article') {
    const article = payload as BroArticle;
    
    if (article.aboutName) {
      frontmatterLines.push(`aboutName: ${yamlValue(article.aboutName)}`);
    }
    if (article.aboutCreator) {
      frontmatterLines.push(`aboutCreator: ${yamlValue(article.aboutCreator)}`);
    }
    if (article.articleByline) {
      frontmatterLines.push(`articleByline: ${yamlValue(article.articleByline)}`);
    }

    // about targets
    frontmatterLines.push(`about:`);
    for (const target of article.about) {
      frontmatterLines.push(`  - type: ${yamlValue(target['@type'])}`);
      frontmatterLines.push(`    identifier: ${yamlValue(target.identifier)}`);
    }
  }

  // Abstract-specific: isBasedOn
  if (payload['@type'] === 'CreativeWork') {
    const abstract = payload as BroAbstract;
    frontmatterLines.push(`isBasedOn:`);
    for (const origin of abstract.isBasedOn) {
      frontmatterLines.push(`  - type: ${yamlValue(origin['@type'])}`);
      frontmatterLines.push(`    identifier: ${yamlValue(origin.identifier)}`);
    }
  }

  // ItemList-specific: itemListElement
  if (payload['@type'] === 'ItemList') {
    const list = payload as BroItemList;
    frontmatterLines.push(`itemListElement:`);
    for (const element of list.itemListElement) {
      frontmatterLines.push(`  - id: ${yamlValue(element['@id'])}`);
    }
  }

  // Creator
  frontmatterLines.push(`creator:`);
  frontmatterLines.push(yamlCreators(payload.creator));

  // Schema.org 1급 표준 속성
  if ('inLanguage' in payload && payload.inLanguage && payload.inLanguage.length > 0) {
    frontmatterLines.push(`inLanguage:`);
    frontmatterLines.push(yamlStringArray(payload.inLanguage));
  }

  if ('keywords' in payload && payload.keywords && payload.keywords.length > 0) {
    frontmatterLines.push(`keywords:`);
    frontmatterLines.push(yamlStringArray(payload.keywords));
  }

  if ('image' in payload && payload.image && (payload.image as string[]).length > 0) {
    frontmatterLines.push(`image:`);
    frontmatterLines.push(yamlStringArray(payload.image as string[]));
  }

  if ('citation' in payload && payload.citation && (payload.citation as string[]).length > 0) {
    frontmatterLines.push(`citation:`);
    frontmatterLines.push(yamlStringArray(payload.citation as string[]));
  }

  // additionalProperty
  if ('additionalProperty' in payload && payload.additionalProperty && payload.additionalProperty.length > 0) {
    frontmatterLines.push(`additionalProperty:`);
    frontmatterLines.push(yamlAdditionalProperty(payload.additionalProperty));
  }

  // Assemble frontmatter
  const frontmatter = `---\n${frontmatterLines.join('\n')}\n---`;

  // Body text
  const bodyText = ('text' in payload && payload.text) ? payload.text : '';

  if (bodyText) {
    return `${frontmatter}\n\n${bodyText}`;
  }

  return frontmatter;
}
````

## File: src/lib/bro-types.ts
````typescript
/**
 * BRO v1.0 — 수동 작성 Discriminated Union 타입
 * 
 * json-schema-to-typescript가 allOf + if/then discriminator 패턴을
 * 정확한 Union Type으로 변환하지 못하는 한계를 보완합니다.
 * 이 파일의 타입은 bro-v1-schema.json의 $defs와 1:1 동기화되어야 합니다.
 */

// ─── Creator Entities (Polymorphic, Mutually Exclusive) ───

export interface CreatorPerson {
  readonly "@type": "Person";
  readonly "@id"?: string;
  name: string;
}

export interface CreatorAnonymous {
  readonly "@type": "Anonymous";
  name?: string;
}

export interface CreatorGovernment {
  readonly "@type": "GovernmentOrganization";
  readonly "@id": string;
  name: string;
}

export interface CreatorCorporation {
  readonly "@type": "Corporation";
  readonly "@id": string;
  name: string;
}

export interface CreatorOrganization {
  readonly "@type": "Organization";
  readonly "@id": string;
  name: string;
}

export interface CreatorSoftware {
  readonly "@type": "SoftwareApplication";
  readonly "@id": string;
  name: string;
  softwareVersion?: string;
}

/**
 * 6가지 작성자 타입의 Discriminated Union.
 * `@type` 필드를 discriminator로 사용합니다.
 */
export type Creator =
  | CreatorPerson
  | CreatorAnonymous
  | CreatorGovernment
  | CreatorCorporation
  | CreatorOrganization
  | CreatorSoftware;

/**
 * 지원하는 Creator @type 값들
 */
export const CREATOR_TYPES = [
  "Person",
  "Anonymous",
  "GovernmentOrganization",
  "Corporation",
  "Organization",
  "SoftwareApplication",
] as const;

export type CreatorType = (typeof CREATOR_TYPES)[number];

// ─── Terminal Identifier ───

export interface TerminalIdentifier {
  readonly "@type": "Article" | "CreativeWork";
  identifier: string;
}

// ─── Re-export auto-generated top-level types for convenience ───
export type {
  BibliographicReactionObjectBROV10 as BibliographicReactionObjectBRO,
  BroItemList,
  BroArticle,
  BroAbstract,
} from "../validator/schema-types";
````

## File: src/lib/komarc-converter.ts
````typescript
import type { 
  BibliographicReactionObjectBROV10 as BibliographicReactionObjectBRO, 
  BroArticle, 
  BroAbstract,
  BroItemList 
} from '../validator/schema-types';

/**
 * KOMARC Subfield interface
 */
export interface KomarcSubfield {
  code: string;
  value: string;
}

/**
 * KOMARC Data Field interface
 */
export interface KomarcDataField {
  tag: string;
  indicator1: string;
  indicator2: string;
  subfields: KomarcSubfield[];
}

/**
 * KOMARC Control Field interface
 */
export interface KomarcControlField {
  tag: string;
  value: string;
}

/**
 * Root KOMARC Record structure
 */
export interface KomarcRecord {
  controlFields: KomarcControlField[];
  dataFields: KomarcDataField[];
}

/**
 * Converts a Bibliographic Reaction Object (BRO) to KOMARC format.
 * Supports Article, Abstract, and ItemList definition types.
 * 
 * @param broPayload The BRO payload to convert
 * @returns A single KomarcRecord or an array of records
 */
export function convertBroToKomarc(broPayload: BibliographicReactionObjectBRO): KomarcRecord | KomarcRecord[] {
  if (isItemList(broPayload)) {
    // [SCHEMA v1 개정] itemListElement는 @id 참조만 허용.
    // 각 참조에 대해 552 ▾u에 식별자를 매핑한 stub 레코드를 생성한다.
    return broPayload.itemListElement.map(element => {
      const subfields552: KomarcSubfield[] = [
        { code: 'h', value: 'https://schema.slat.or.kr/bro/v1/schema.json' }
      ];
      if (element['@id']) {
        subfields552.push({ code: 'u', value: String(element['@id']) });
      }
      return {
        controlFields: [],
        dataFields: [{
          tag: '552',
          indicator1: ' ',
          indicator2: ' ',
          subfields: subfields552
        }]
      };
    });
  }

  if (isAbstract(broPayload)) {
    return convertAbstractToKomarc(broPayload);
  }

  return convertArticleToKomarc(broPayload as BroArticle);
}

/**
 * Internal type guard for ItemList
 */
function isItemList(payload: any): payload is BroItemList {
  return payload && payload['@type'] === 'ItemList' && Array.isArray(payload.itemListElement);
}

/**
 * Internal type guard for Abstract (CreativeWork)
 */
function isAbstract(payload: any): payload is BroAbstract {
  return payload && payload['@type'] === 'CreativeWork' && 'isBasedOn' in payload;
}

/**
 * Core mapping logic for Article to KOMARC
 */
function convertArticleToKomarc(article: BroArticle): KomarcRecord {
  const dataFields: KomarcDataField[] = [];

  // 1. Identifier Mapping: about.identifier -> 020 ▾a or 024 ▾a
  if (Array.isArray(article.about)) {
    for (const creativeWork of article.about) {
      if (creativeWork.identifier) {
        const idStr = String(creativeWork.identifier);
        if (idStr.startsWith('urn:isbn:')) {
          dataFields.push({
            tag: '020',
            indicator1: ' ',
            indicator2: ' ',
            subfields: [{ code: 'a', value: idStr.replace('urn:isbn:', '') }]
          });
        } else if (idStr.startsWith('urn:')) {
          const prefixMatch = idStr.match(/^urn:([^:]+):/);
          const value = prefixMatch ? idStr.substring(prefixMatch[0].length) : idStr;
          dataFields.push({
            tag: '024',
            indicator1: '8', // Unspecified type of standard number
            indicator2: ' ',
            subfields: [{ code: 'a', value }]
          });
        }
      }
    }
  }

  // Authorship for the reaction object should deliberately NOT be
  // mapped to 100/700 to avoid conflicts with original structural authors.

  // 3. 552 Field (Bibliographic Reaction / Local Metadata)
  // 552 ▾b: 개체명 (name)
  // 552 ▾k: dateCreated (YYYYMMDD)
  // 552 ▾u: URI (article id, if available)
  // 552 ▾h: schema URI
  const subfields552: KomarcSubfield[] = [
    { code: 'h', value: 'https://schema.slat.or.kr/bro/v1/schema.json' }
  ];

  if (article.name) {
    subfields552.push({ code: 'b', value: article.name });
  }

  if (article.dateCreated) {
    // Truncate ISO 8601 string to YYYYMMDD
    const truncatedDate = article.dateCreated.substring(0, 10).replace(/-/g, '');
    subfields552.push({ code: 'k', value: truncatedDate });
  }

  if (article['@id']) {
    subfields552.push({ code: 'u', value: String(article['@id']) });
  }

  dataFields.push({
    tag: '552',
    indicator1: ' ',
    indicator2: ' ',
    subfields: subfields552
  });

  return {
    controlFields: [],
    dataFields
  };
}

/**
 * Core mapping logic for Abstract to KOMARC
 */
function convertAbstractToKomarc(abstract: BroAbstract): KomarcRecord {
  const dataFields: KomarcDataField[] = [];

  // 1. Identifier Mapping: isBasedOn.identifier -> 020 ▾a or 024 ▾a
  if (Array.isArray(abstract.isBasedOn)) {
    for (const origin of abstract.isBasedOn) {
      if (origin.identifier) {
        const idStr = String(origin.identifier);
        if (idStr.startsWith('urn:isbn:')) {
          dataFields.push({
            tag: '020',
            indicator1: ' ',
            indicator2: ' ',
            subfields: [{ code: 'a', value: idStr.replace('urn:isbn:', '') }]
          });
        } else if (idStr.startsWith('urn:')) {
          const prefixMatch = idStr.match(/^urn:([^:]+):/);
          const value = prefixMatch ? idStr.substring(prefixMatch[0].length) : idStr;
          dataFields.push({
            tag: '024',
            indicator1: '8', 
            indicator2: ' ',
            subfields: [{ code: 'a', value }]
          });
        }
      }
    }
  }

  // 3. 552 Field (Bibliographic Reaction / Local Metadata)
  // 552 ▾b: 개체명 (name)
  // 552 ▾k: dateCreated (YYYYMMDD)
  // 552 ▾o: abstract.text
  // 552 ▾h: schema URI
  const subfields552: KomarcSubfield[] = [
    { code: 'h', value: 'https://schema.slat.or.kr/bro/v1/schema.json' }
  ];

  if (abstract.name) {
    subfields552.push({ code: 'b', value: abstract.name });
  }

  if (abstract.dateCreated) {
    const truncatedDate = abstract.dateCreated.substring(0, 10).replace(/-/g, '');
    subfields552.push({ code: 'k', value: truncatedDate });
  }

  if (abstract.text) {
    subfields552.push({ code: 'o', value: abstract.text });
  }

  dataFields.push({
    tag: '552',
    indicator1: ' ',
    indicator2: ' ',
    subfields: subfields552
  });

  return {
    controlFields: [],
    dataFields
  };
}
````

## File: src/validator/index.ts
````typescript
import { Validator } from '@cfworker/json-schema';
// Import the schema file (tsup will automatically bundle this JSON during the build)
import schema from '../../worker/assets/bro-v1-schema.json';

const validator = new Validator(schema as any);

/**
 * Validates data against the Bibliographic Reaction Object (BRO) schema.
 */
export function validateBroSchema(data: unknown) {
  const result = validator.validate(data);
  return {
    valid: result.valid,
    errors: result.errors
  };
}

// Export the original schema data just in case it is needed by the consumer
export { schema as broV1Schema };

// Export generated TypeScript types for consumers
export * from './schema-types';

// Export normalization utilities
export { normalizePayload, normalizeUrnScheme } from '../lib/normalize';

// Export manual discriminated union types
export type {
  Creator,
  CreatorType,
  CreatorPerson,
  CreatorAnonymous,
  CreatorGovernment,
  CreatorCorporation,
  CreatorOrganization,
  CreatorSoftware,
} from '../lib/bro-types';
export { CREATOR_TYPES } from '../lib/bro-types';
````

## File: src/npm-index.ts
````typescript
// Unified entry point for the NPM package
export * from './validator/schema-types';
import BroV1Schema from '../worker/assets/bro-v1-schema.json';
export { BroV1Schema };

// Export validation logic and utilities
export { validateBroSchema, broV1Schema } from './validator/index';

// BIBFRAME 2.0 Conversion utilities
export { convertBroToBibframe } from './lib/bibframe-converter';
export type { BibframeWork, BibframeContribution, BibframeInstance, BibframeNote, BibframeIdentifier } from './lib/bibframe-converter';

// AI RAG Markdown Renderer
export { renderBroToMarkdown } from './lib/markdown-renderer';

// KOMARC Conversion utilities
export * from './lib/komarc-converter';

// URN Normalization utilities
export { normalizePayload, normalizeUrnScheme } from './lib/normalize';

// Manual Discriminated Union types for Creator polymorphism
export type {
  Creator,
  CreatorType,
  CreatorPerson,
  CreatorAnonymous,
  CreatorGovernment,
  CreatorCorporation,
  CreatorOrganization,
  CreatorSoftware,
} from './lib/bro-types';
export { CREATOR_TYPES } from './lib/bro-types';
````

## File: worker/index.ts
````typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Validator, type Schema } from "@cfworker/json-schema";
import broSchema from "./assets/bro-v1-schema.json";
import { normalizePayload } from "../src/lib/normalize";
// Cold Start 단계: 스키마 AST 변환 1회 한정 실행
const validator = new Validator(broSchema as Schema, "2020-12", false);
const app = new Hono();

// 글로벌 CORS 미들웨어 적용 (외부 서비스 및 프론트엔드 접근 허용)
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

// 엔드포인트 A: 정적 스키마 제공 (인메모리 서빙)
app.get("/bro/v1/schema.json", (c) => {
  c.header("Content-Type", "application/schema+json; charset=utf-8");
  c.header("Cache-Control", "public, max-age=86400, s-maxage=86400"); // 엣지 24시간 캐싱
  return c.body(JSON.stringify(broSchema, null, 2));
});

// 엔드포인트 B: 1-Pass Validation 파이프라인
app.post("/api/v1/validate", async (c) => {
  const requestStartTime = Date.now();
  try {
    const payload = await c.req.json();

    // ── 전처리: URN Scheme 소문자 정규화 ──
    normalizePayload(payload);

    // ── 1차 검증: JSON Schema (구조 검증) ──
    const result = validator.validate(payload);

    if (!result.valid) {
      return c.json(
        {
          status: "REJECTED",
          message: "The provided payload does not meet the BRO v1 schema requirements.",
          timestamp: new Date().toISOString(),
          latencyMs: Date.now() - requestStartTime,
          errors: result.errors.map((err) => ({
            location: err.instanceLocation,
            keyword: err.keyword,
            message: err.error,
          })),
        },
        400,
      );
    }

    return c.json(
      {
        status: "VERIFIED",
        message: "Payload successfully validated against BRO v1 specifications.",
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - requestStartTime,
      },
      200,
    );
  } catch (e) {
    if (e instanceof SyntaxError) {
      return c.json(
        { 
          status: "FATAL_PARSE_ERROR", 
          message: "Malformed JSON: Failed to parse request body.",
          timestamp: new Date().toISOString()
        },
        400,
      );
    } else {
      console.error("Critical worker error:", e);
      return c.json(
        {
          status: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred during processing.",
          timestamp: new Date().toISOString()
        },
        500,
      );
    }
  }
});

export default app;
````

## File: src/App.tsx
````typescript
import { useState, useMemo, useEffect, type ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import { Validator, type Schema } from "@cfworker/json-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertCircle,
  FileJson,
  BookOpen,
  ExternalLink,
  Sparkles,
  User,
  Type,
  Layout,
  Tag,
  Cpu,
  Library,
  Zap,
  Link,
  Image as ImageIcon,
  List,
} from "lucide-react";

import schema from "../worker/assets/bro-v1-schema.json";
import readmeMarkdown from "../README.md?raw";
import { normalizePayload, normalizeUrnScheme } from "./lib/normalize";
import { CREATOR_TYPES, type CreatorType } from "./lib/bro-types";
import type { AdditionalPropertyArray } from "./validator/schema-types";
import "./lib/githubmarkdown.css";

const EXAMPLES = {
  AI_ARTICLE: {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440010",
    name: "AI가 본 현대 사회",
    aboutName: "현대 사회 (원서)",
    aboutCreator: "김사회",
    articleByline: "AI Assistant",
    dateCreated: "2026-04-12T12:00:00Z",
    about: [
      {
        "@type": "CreativeWork" as const,
        identifier: "urn:isbn:978-89-01-23456-7",
      },
    ],
    text: "AI 모델을 통한 현대 사회의 심층 분석 보고서입니다.",
    inLanguage: ["ko"],
    keywords: ["사회학", "미래"],
    creator: [
      {
        "@type": "SoftwareApplication" as const,
        name: "gemini-1.5-pro",
        "@id": "urn:model:google:gemini-1.5-pro",
        softwareVersion: "1.5-pro",
      },
    ],
    additionalProperty: [
      { "@type": "PropertyValue" as const, name: "custom_rating", value: 5 },
    ],
    abstract: [{ "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440001" }],
  },
  ABSTRACT: {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440001",
    dateCreated: "2026-04-12T12:05:00Z",
    isBasedOn: [
      {
        "@type": "Article" as const,
        identifier: "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
      },
    ],
    text: "현대 사회의 복잡성을 AI의 시각에서 간결하게 요약한 발췌본입니다.",
    inLanguage: ["ko"],
    creator: [
      {
        "@type": "SoftwareApplication" as const,
        name: "gemini-1.5-flash",
        "@id": "urn:model:google:gemini-1.5-flash",
      },
    ],
  },
  ANONYMOUS_ARTICLE: {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440077",
    name: "익명 사용자의 리뷰",
    aboutName: "노인과 바다",
    aboutCreator: "어니스트 헤밍웨이",
    dateCreated: "2026-04-15T09:00:00Z",
    about: [
      {
        "@type": "CreativeWork" as const,
        identifier: "urn:isbn:9788937460753",
      },
    ],
    text: "추적 불가능한 익명 사용자의 감상문입니다.",
    creator: [
      {
        "@type": "Anonymous" as const,
      },
    ],
  },
  ITEM_LIST: {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440022",
    name: "2026학년도 분야별 추천사 목록",
    dateCreated: "2026-04-12T12:00:00Z",
    creator: [
      {
        "@type": "Organization" as const,
        name: "슬랫 도서 검토위원회",
        "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440000",
      },
    ],
    itemListElement: [
      { "@id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000" },
      { "@id": "urn:uuid:123e4567-e89b-12d3-a456-426614174001" },
    ],
  },
  PERSISTED_ARTICLE: {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
    name: "영속성 엔티티 예시",
    aboutName: "영속성 설계 교본",
    aboutCreator: "박영속",
    articleByline: "슬랫 출판사 검토팀",
    dateCreated: "2026-04-12T12:00:00Z",
    datePublished: "2026-04-13T00:00:00Z",
    dateModified: "2026-04-14T10:00:00Z",
    version: 2,
    about: [
      {
        "@type": "CreativeWork" as const,
        identifier: "urn:isbn:978-89-01-23456-7",
      },
    ],
    text: "데이터베이스에 영구적으로 저장된 객체입니다. dateModified와 version으로 이력을 추적합니다.",
    inLanguage: ["ko"],
    keywords: ["DB", "영속성"],
    citation: ["https://example.com/persistence-guide"],
    creator: [
      {
        "@type": "Corporation" as const,
        name: "슬랫 출판사",
        "@id": "urn:kr:crn:1234567890123",
      },
    ],
  },
};

export default function App() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(EXAMPLES.AI_ARTICLE, null, 2),
  );
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors?: any[];
    syntaxError?: string;
  } | null>(null);

  const validator = useMemo(() => {
    try {
      return new Validator(schema as Schema, "2020-12", false);
    } catch (error) {
      console.error("Critical: Schema compilation failed", error);
      return null;
    }
  }, []);

  const handleValidate = () => {
    if (!validator) {
      setValidationResult({
        valid: false,
        syntaxError: "System Error: The BRO schema failed to compile.",
      });
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      // 전처리: URN Scheme 소문자 정규화
      normalizePayload(parsed);
      // 정규화된 결과를 JSON 에디터에도 반영
      setJsonInput(JSON.stringify(parsed, null, 2));

      // JSON Schema 단일 패스 검증 (YAML Frontmatter 2차 검증 폐기)
      const result = validator.validate(parsed);
      if (!result.valid) {
        setValidationResult({
          valid: false,
          errors: result.errors,
        });
        return;
      }

      setValidationResult({ valid: true });
    } catch (e: any) {
      setValidationResult({
        valid: false,
        syntaxError: e.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans antialiased text-foreground">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-foreground">
              BRO: Bibliographic Reaction Object
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              서지 반응정보 객채(BRO: Bibliographic Reaction Object)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 px-6"
              onClick={() =>
                window.open("https://github.com/freebird920/bro", "_blank")
              }
            >
              <ExternalLink className="h-4 w-4" />
              Source
            </Button>
          </div>
        </header>

        <div className="space-y-12">
          {/* Documentation Card (Parsed dynamically from README.md) */}
          <Card className="border shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="pb-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Specification Documents
                  </CardTitle>
                  <CardDescription>
                    Schema architecture and mapping guidelines
                  </CardDescription>
                </div>
                <div className="text-muted-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="max-w-none markdown-body max-h-150rflow-y-auto pr-4">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {readmeMarkdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Validator Area */}
          <ValidatorSection
            jsonInput={jsonInput}
            setJsonInput={setJsonInput}
            handleValidate={handleValidate}
            validationResult={validationResult}
          />
        </div>

        <footer className="mt-20 py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>schema.slat.or.kr</p>
        </footer>
      </div>
    </div>
  );
}

function ValidatorSection({
  jsonInput,
  setJsonInput,
  handleValidate,
  validationResult,
}: {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  handleValidate: () => void;
  validationResult: any;
}) {
  const [metaData, setMetaData] = useState({
    name: "",
    aboutName: "",
    aboutCreator: "",
    articleByline: "",
    inLanguage: "",
    keywords: "",
    image: "",
    citation: "",
  });
  const [creatorData, setCreatorData] = useState<{
    type: CreatorType;
    name: string;
    id: string;
    version: string;
  }>({ type: "Person", name: "", id: "", version: "" });
  const [additionalProps, setAdditionalProps] = useState<AdditionalPropertyArray>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isSyncing) return;
    try {
      const parsed = JSON.parse(jsonInput);
      // JSON-LD 네이티브 1급 필드 동기화
      if (parsed["@type"] === "Article") {
        setMetaData({
          name: parsed.name || "",
          aboutName: parsed.aboutName || "",
          aboutCreator: parsed.aboutCreator || "",
          articleByline: parsed.articleByline || "",
          inLanguage: Array.isArray(parsed.inLanguage)
            ? parsed.inLanguage.join(", ")
            : "",
          keywords: Array.isArray(parsed.keywords)
            ? parsed.keywords.join(", ")
            : "",
          image: Array.isArray(parsed.image) ? parsed.image.join(", ") : "",
          citation: Array.isArray(parsed.citation)
            ? parsed.citation.join(", ")
            : "",
        });
        setAdditionalProps(parsed.additionalProperty || []);
      }

      const isArticleOrAbstract =
        parsed["@type"] === "Article" ||
        (parsed["@type"] === "CreativeWork" && "isBasedOn" in parsed);
      if (isArticleOrAbstract && parsed.creator && parsed.creator.length > 0) {
        const mainCreator = parsed.creator[0];
        setCreatorData({
          type: mainCreator["@type"] || "Person",
          name: mainCreator.name || "",
          id: mainCreator["@id"] || "",
          version: mainCreator.softwareVersion || "",
        });
      }
    } catch (e) {}
  }, [jsonInput]);

  const handleFormChange = (updates: {
    meta?: Partial<typeof metaData>;
    creator?: Partial<typeof creatorData>;
  }) => {
    setIsSyncing(true);
    try {
      const parsed = JSON.parse(jsonInput);
      const isArticleOrig = parsed["@type"] === "Article";
      const isAbstractOrig =
        parsed["@type"] === "CreativeWork" && "isBasedOn" in parsed;

      if (isArticleOrig || isAbstractOrig) {
        // JSON-LD 네이티브 1급 속성을 직접 편집
        if (isArticleOrig && updates.meta) {
          const newMeta = { ...metaData, ...updates.meta };

          if (newMeta.name) parsed.name = newMeta.name;
          else delete parsed.name;
          if (newMeta.aboutName) parsed.aboutName = newMeta.aboutName;
          else delete parsed.aboutName;
          if (newMeta.aboutCreator) parsed.aboutCreator = newMeta.aboutCreator;
          else delete parsed.aboutCreator;
          if (newMeta.articleByline) parsed.articleByline = newMeta.articleByline;
          else delete parsed.articleByline;

          const toArr = (s: string) => s.split(",").map((v) => v.trim()).filter(Boolean);
          const lang = toArr(newMeta.inLanguage);
          if (lang.length > 0) parsed.inLanguage = lang;
          else delete parsed.inLanguage;
          const kw = toArr(newMeta.keywords);
          if (kw.length > 0) parsed.keywords = kw;
          else delete parsed.keywords;
          const img = toArr(newMeta.image);
          if (img.length > 0) parsed.image = img;
          else delete parsed.image;
          const cit = toArr(newMeta.citation);
          if (cit.length > 0) parsed.citation = cit;
          else delete parsed.citation;

          setMetaData(newMeta);
        }

        if (updates.creator) {
          const newCreator = { ...creatorData, ...updates.creator };
          const updatedCreator: Record<string, unknown> = {
            "@type": newCreator.type,
          };
          if (newCreator.name) updatedCreator.name = newCreator.name;
          if (newCreator.id) updatedCreator["@id"] = normalizeUrnScheme(newCreator.id);
          if (newCreator.type === "SoftwareApplication" && newCreator.version) {
            updatedCreator.softwareVersion = newCreator.version;
          }
          parsed.creator = [updatedCreator];
          setCreatorData(newCreator);
        }

        setJsonInput(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {}
    setTimeout(() => setIsSyncing(false), 50);
  };

  const isArticle = useMemo(() => {
    try {
      return JSON.parse(jsonInput)["@type"] === "Article";
    } catch {
      return false;
    }
  }, [jsonInput]);

  const isAbstract = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      return parsed["@type"] === "CreativeWork" && "isBasedOn" in parsed;
    } catch {
      return false;
    }
  }, [jsonInput]);

  return (
    <Card className="border shadow-lg rounded-xl overflow-hidden mt-6">
      <CardHeader className="pb-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Interactive Validator
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Test your JSON payload against BRO v1 Specification (2-Pass)
            </CardDescription>
          </div>
          <div className="text-muted-foreground">
            <FileJson className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-wrap gap-2">
          {Object.keys(EXAMPLES).map((key) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              className="text-xs h-9 gap-2"
              onClick={() =>
                setJsonInput(JSON.stringify((EXAMPLES as any)[key], null, 2))
              }
            >
              <Sparkles className="h-3 w-3" />
              {key}
            </Button>
          ))}
        </div>

        {(isArticle || isAbstract) && (
          <>
            <div
              className={`grid grid-cols-1 ${isArticle ? "md:grid-cols-2" : "md:grid-cols-1 max-w-2xl"} gap-8 bg-muted/10 p-6 rounded-xl border`}
            >
              {isArticle && (
                <div className="space-y-5">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-foreground uppercase tracking-wider">
                    <Layout className="h-4 w-4" /> JSON-LD Metadata
                  </h3>
                  <div className="space-y-3">
                    <Field
                      label="Name (파생 문서 제목)"
                      icon={<Type className="h-3 w-3" />}
                      value={metaData.name}
                      onChange={(v) => handleFormChange({ meta: { name: v } })}
                    />
                    <Field
                      label="About Name (대상 저작물 제목)"
                      icon={<Type className="h-3 w-3" />}
                      value={metaData.aboutName}
                      onChange={(v) => handleFormChange({ meta: { aboutName: v } })}
                    />
                    <Field
                      label="About Creator (대상 저작물 저자)"
                      icon={<User className="h-3 w-3" />}
                      value={metaData.aboutCreator}
                      onChange={(v) => handleFormChange({ meta: { aboutCreator: v } })}
                    />
                    <Field
                      label="Article Byline (작성자 표기)"
                      icon={<User className="h-3 w-3" />}
                      value={metaData.articleByline}
                      onChange={(v) => handleFormChange({ meta: { articleByline: v } })}
                    />
                    <Field
                      label="inLanguage (BCP 47)"
                      icon={<Type className="h-3 w-3" />}
                      value={metaData.inLanguage}
                      onChange={(v) =>
                        handleFormChange({ meta: { inLanguage: v } })
                      }
                      placeholder="ko, en"
                    />
                    <Field
                      label="Keywords"
                      icon={<Tag className="h-3 w-3" />}
                      value={metaData.keywords}
                      onChange={(v) =>
                        handleFormChange({ meta: { keywords: v } })
                      }
                    />
                    <Field
                      label="Image URLs"
                      icon={<ImageIcon className="h-3 w-3" />}
                      value={metaData.image}
                      onChange={(v) => handleFormChange({ meta: { image: v } })}
                    />
                    <Field
                      label="Citation URLs"
                      icon={<Link className="h-3 w-3" />}
                      value={metaData.citation}
                      onChange={(v) =>
                        handleFormChange({ meta: { citation: v } })
                      }
                    />
                  </div>

                  {/* additionalProperty 뷰어 */}
                  {additionalProps.length > 0 && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg border space-y-2">
                      <h4 className="text-[11px] font-bold uppercase flex items-center gap-1.5 text-muted-foreground tracking-wider">
                        <List className="h-3 w-3" /> additionalProperty (PropertyValue)
                      </h4>
                      <div className="space-y-1">
                        {additionalProps.map((prop, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <span className="font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded text-[10px]">
                                {prop.name}
                              </span>
                              <span className="text-foreground text-[11px] truncate">
                                {JSON.stringify(prop.value)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-5">
                <h3 className="text-sm font-bold flex items-center gap-2 text-foreground uppercase tracking-wider">
                  <User className="h-4 w-4" /> Primary Creator Definition
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
                      Type
                    </label>
                    <select
                      value={creatorData.type}
                      onChange={(e) =>
                        handleFormChange({
                          creator: { type: e.target.value as CreatorType },
                        })
                      }
                      className="w-full h-10 rounded-lg border bg-background px-3 py-1 text-sm transition-colors focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      {CREATOR_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="Name"
                    value={creatorData.name}
                    onChange={(v) => handleFormChange({ creator: { name: v } })}
                  />
                  <Field
                    label="Identifier (@id)"
                    value={creatorData.id}
                    onChange={(v) => handleFormChange({ creator: { id: v } })}
                    placeholder="urn:uuid:..."
                    transformOnBlur={normalizeUrnScheme}
                  />
                  {creatorData.type === "SoftwareApplication" && (
                    <Field
                      label="Software Version"
                      icon={<Cpu className="h-3 w-3" />}
                      value={creatorData.version}
                      onChange={(v) =>
                        handleFormChange({ creator: { version: v } })
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bibliographic Mapping Registry Preview */}
            <div className="bg-muted/20 p-6 md:p-8 rounded-xl border space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2 text-foreground uppercase tracking-wider">
                <Library className="h-4 w-4" /> Bibliographic Mapping Registry
                Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MappingCard
                  title="KORMARC"
                  icon={<Zap className="h-3 w-3" />}
                  items={[
                    {
                      label: "대상 도서 식별자 (URN)",
                      field: "020 ▾a / 024 ▾a",
                      value: isAbstract
                        ? "Mapped from isBasedOn[0].identifier"
                        : "Mapped from about[0].identifier",
                    },
                    {
                      label: "데이터세트 출처",
                      field: "552 ▾h",
                      value: "https://schema.slat.or.kr/...",
                    },
                    {
                      label: "원문 접근 주소",
                      field: "552 ▾u",
                      value: isAbstract
                        ? "None (Abstract embeds text)"
                        : "Mapped externally from @id",
                    },
                    {
                      label: "개시/종료 일자",
                      field: "552 ▾k",
                      value: "Mapped from dateCreated / datePublished",
                    },
                    {
                      label: "요약 (Abstract)",
                      field: "552 ▾o",
                      value: isAbstract
                        ? "Directly mapped from abstract text"
                        : "None (Isolated entity)",
                    },
                  ]}
                />
                <MappingCard
                  title="Dublin Core"
                  icon={<Zap className="h-3 w-3" />}
                  items={[
                    {
                      label: "Identifier",
                      field: "dc:identifier",
                      value: "Mapped from @id",
                    },
                    {
                      label: "Relation / Source",
                      field: "dc:relation",
                      value: isAbstract
                        ? "Mapped from isBasedOn.identifier"
                        : "Mapped from about.identifier",
                    },
                    {
                      label: "Creator",
                      field: "dc:creator",
                      value: creatorData.name || "Pending",
                    },
                    {
                      label: "Date Created",
                      field: "dc:date",
                      value: "Mapped from dateCreated",
                    },
                    {
                      label: "Description",
                      field: "dc:description",
                      value: isAbstract
                        ? "Mapped from text"
                        : "Mapped from text elements",
                    },
                  ]}
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <FileJson className="h-4 w-4" /> Raw Payload JSON
            </label>
          </div>
          <Textarea
            className="min-h-100 font-mono text-[13px] leading-relaxed bg-background border shadow-sm resize-none p-5 rounded-xl"
            value={jsonInput}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setJsonInput(e.target.value)
            }
          />
        </div>

        <Button
          onClick={handleValidate}
          className="w-full h-14 text-lg font-bold shadow-sm rounded-xl"
        >
          Validate Payload
        </Button>

        {validationResult && (
          <div className="mt-8">
            {validationResult.valid ? (
              <Alert className="border-emerald-500/30 bg-emerald-50/50 text-emerald-600 py-6 rounded-xl flex gap-4 items-center pl-6">
                <CheckCircle2 className="h-7 w-7 shrink-0" />
                <div>
                  <AlertTitle className="text-xl font-bold m-0">
                    Target Schema Validated
                  </AlertTitle>
                  <AlertDescription className="text-base mt-1">
                    Successfully validated against BRO v1.0 JSON-LD native
                    specification.
                  </AlertDescription>
                </div>
              </Alert>
            ) : (
              <Alert variant="destructive" className="py-6 rounded-xl pl-6">
                <div className="flex gap-4 mb-4 items-center">
                  <AlertCircle className="h-7 w-7 shrink-0" />
                  <AlertTitle className="text-xl font-bold m-0">
                    Validation Fault Detected
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-4 break-all">
                  {validationResult.syntaxError && (
                    <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-destructive/20 px-2 py-1 rounded block w-fit mb-2">
                        Syntax Error
                      </span>
                      <p className="font-mono text-xs">
                        {validationResult.syntaxError}
                      </p>
                    </div>
                  )}
                  <ul className="space-y-3">
                    {validationResult.errors?.map((err: any, i: number) => (
                      <li
                        key={i}
                        className="bg-destructive/10 p-4 rounded-lg border border-destructive/20"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-destructive/20 px-2 py-1 rounded block w-fit mb-2">
                          Path: {err.instanceLocation || "/"}
                        </span>
                        <p className="font-mono text-xs">{err.error}</p>
                      </li>
                    ))}

                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MappingCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: any;
  items: any[];
}) {
  return (
    <div className="bg-muted/30 border rounded-lg p-4 space-y-3 shadow-inner">
      <h4 className="text-[11px] font-bold uppercase flex items-center gap-1.5 mb-3 text-muted-foreground tracking-wider">
        {icon} {title}
      </h4>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-xs py-1"
          >
            <span className="text-muted-foreground font-medium">
              {item.label}
            </span>
            <div className="flex items-center gap-2.5">
              <span className="font-mono bg-muted/50 border px-1.5 py-0.5 rounded text-[10px] text-muted-foreground">
                {item.field}
              </span>
              <span
                className={
                  item.value === "Empty" || item.value === "Pending"
                    ? "text-destructive/80 italic text-[11px]"
                    : "text-foreground text-[11px]"
                }
              >
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
  placeholder,
  transformOnBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: any;
  placeholder?: string;
  transformOnBlur?: (v: string) => string;
}) {
  return (
    <div className="space-y-2 group">
      <label className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 group-focus-within:text-primary transition-colors">
        {icon} {label}
      </label>
      <input
        className="flex h-10 w-full rounded-lg border bg-background px-3 py-1.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary"
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        onBlur={
          transformOnBlur
            ? (e) => {
                const transformed = transformOnBlur(e.target.value);
                if (transformed !== e.target.value) {
                  onChange(transformed);
                }
              }
            : undefined
        }
      />
    </div>
  );
}
````

## File: src/validator/schema-types.ts
````typescript
// This file is auto-generated. Do not edit it manually.
// To update these types, run `pnpm run generate-types`

/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Bibliographic Reaction Object (BRO)의 JSON-LD 네이티브 원시 스키마.
 */
export type BibliographicReactionObjectBROV10 = BroItemList | BroArticle | BroAbstract;
/**
 * UUID v4, v5, v7을 수용하는 정규화된 범용 고유 식별자 URN 포맷.
 */
export type UrnUuidOnly = string;
/**
 * RFC 3339 기반 타임스탬프 강제 규격. Z 또는 오프셋 명시를 누락한 경우 DB 데이터 오염으로 간주하여 인입을 차단함.
 */
export type StrictDateTime = string;
/**
 * [CREATOR_ENTITIES] 작성자 엔티티 다형성 계층. 공공 및 법인은 @id 강제 검증, 개인은 수집 파편화 대응을 위한 선택적 @id 허용, 익명은 추적 불가능한 작성자 데이터의 유실 방지 Fallback.
 */
export type CreatorRoot =
  | CreatorPerson
  | CreatorAnonymous
  | CreatorGovernment
  | CreatorCorporation
  | CreatorOrganization
  | CreatorSoftware;
/**
 * BCP 47 / ISO 639 언어 코드 목록.
 */
export type LanguageArray = string[];
/**
 * 분류용 핵심어 목록.
 */
export type KeywordsArray = string[];
/**
 * Schema.org 표준 PropertyValue 기반 동적 메타데이터 확장 컨테이너. 도서관이나 서비스별로 파편화된 커스텀 메타데이터(예: 평점, 완독 여부, 추천 연령 등)를 스키마를 오염시키지 않고 수용함. NoSQL이나 RDBMS의 JSON 컬럼에서 완벽한 기계적 인덱싱이 가능함.
 */
export type AdditionalPropertyArray = {
  "@type": "PropertyValue";
  /**
   * 동적 속성의 식별 키(Key)
   */
  name: string;
  /**
   * 동적 속성의 값(Value). 원시 타입 및 객체 허용.
   */
  value: {
    [k: string]: unknown;
  };
  [k: string]: unknown;
}[];
export type UrnIdentifier =
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    }
  | {
      [k: string]: unknown;
    };
export type UrnIdentifier1 = string;
/**
 * 순수 본문 문자열 (주로 Markdown 구조). YAML Frontmatter 캡슐화를 전면 폐기함. 인입 파이프라인에서 본 필드 내의 메타데이터 은닉을 감지할 경우 페이로드 수용을 거부(Reject)하며, 모든 메타 속성은 JSON의 1급 객체 또는 additionalProperty로 분리 추출되어야 함.
 */
export type PureText = string;

/**
 * 다중 타겟 문서 큐레이션을 위한 영속적 컨테이너 엔티티 (ItemList).
 */
export interface BroItemList {
  "@context": "https://schema.org";
  "@type": "ItemList";
  "@id": UrnUuidOnly;
  /**
   * 리스트 컨테이너의 고유 명칭.
   */
  name?: string;
  dateCreated: StrictDateTime;
  /**
   * RFC 3339 기반 타임스탬프 강제 규격. Z 또는 오프셋 명시를 누락한 경우 DB 데이터 오염으로 간주하여 인입을 차단함.
   */
  dateModified?: string;
  /**
   * 에그리거트 루트의 변경 이력 추적 및 낙관적 락(Optimistic Locking) 검증을 위한 버전 해시 또는 시퀀스 넘버.
   */
  version?: string | number;
  /**
   * @minItems 1
   */
  creator: [CreatorRoot, ...CreatorRoot[]];
  /**
   * 리스트에 포함된 개별 문서(Article 등)의 식별자 목록. 직접 내포(Embedding) 금지. 데이터 단편화 방지 및 URN 식별자 정규화를 위해 철저히 포인터 기반 참조로 격리함.
   */
  itemListElement: {
    "@id": UrnUuidOnly;
    [k: string]: unknown;
  }[];
  inLanguage?: LanguageArray;
  keywords?: KeywordsArray;
  additionalProperty?: AdditionalPropertyArray;
  [k: string]: unknown;
}
export interface CreatorPerson {
  "@type": "Person";
  name: string;
  /**
   * 인증된 사용자에 한해 부여되는 URN/ORCID 식별자. 파편화된 외부 데이터 스크래핑 인입 시 생략을 허용함.
   */
  "@id"?:
    | UrnUuidOnly
    | {
        [k: string]: unknown;
      };
}
/**
 * 네트워크 인입 단말 혹은 수집 파이프라인에서 작성자 엔티티 추적에 실패할 경우, null/undefined로 인한 스키마 크래시를 방지하는 Fallback 타입.
 */
export interface CreatorAnonymous {
  "@type": "Anonymous";
  name?: string;
}
export interface CreatorGovernment {
  "@type": "GovernmentOrganization";
  name: string;
  "@id":
    | UrnUuidOnly
    | {
        [k: string]: unknown;
      };
}
export interface CreatorCorporation {
  "@type": "Corporation";
  name: string;
  "@id":
    | UrnUuidOnly
    | {
        [k: string]: unknown;
      };
}
export interface CreatorOrganization {
  "@type": "Organization";
  name: string;
  "@id":
    | UrnUuidOnly
    | {
        [k: string]: unknown;
      };
}
export interface CreatorSoftware {
  "@type": "SoftwareApplication";
  name: string;
  softwareVersion?: string;
  "@id": {
    [k: string]: unknown;
  };
}
/**
 * 단일 파생 문서(Article) 처리를 위한 영속성 스키마. 기존 YAML 프론트매터 속성을 스키마 최상위 프로퍼티로 추출하여 검색 엔진 및 DB 인덱서의 직접 접근을 허용함.
 */
export interface BroArticle {
  "@context": "https://schema.org";
  "@type": "Article";
  "@id": UrnUuidOnly;
  /**
   * 파생 문서 자체의 제목. 시스템 반환 시 Article 엔티티의 최상위 명칭으로 사용됨.
   */
  name?: string;
  /**
   * 현재 문서가 타겟팅(about)하고 있는 원본 코어 저작물의 텍스트 명칭(name). 원문 URN 참조가 실패하거나 지연 로딩될 경우의 디그레이드(Degrade) 처리를 위한 역정규화 데이터. 스키마 전역의 명명 규칙(Naming Convention) 통일성에 따라 Title 대신 Name을 접미사로 강제함.
   */
  aboutName?: string;
  /**
   * 현재 문서가 타겟팅하는 원본 코어 저작물의 원작자 텍스트 표기.
   */
  aboutCreator?: string;
  /**
   * 현재 파생 문서 작성자의 크레딧 라인 표기.
   */
  articleByline?: string;
  dateCreated: StrictDateTime;
  dateModified?: StrictDateTime;
  datePublished?: StrictDateTime;
  version?: string | number;
  /**
   * 파생 문서가 타겟팅하는 코어 저작물 엔티티의 식별자 묶음. 다중 판본 바인딩 시 복수 원소를 허용함.
   *
   * @minItems 1
   */
  about: [TerminalIdentifier, ...TerminalIdentifier[]];
  text: PureText;
  inLanguage?: LanguageArray;
  keywords?: KeywordsArray;
  /**
   * 관련 이미지 URL 배열.
   */
  image?: string[];
  /**
   * 참고 문헌 또는 원문 URL 목록.
   */
  citation?: string[];
  /**
   * 현재 문서(Article)에 종속된 파생 요약본의 식별자(URN) 배열. 1:N 구조의 디스크 중복 적재를 막기 위한 식별자 참조. 본문 내포 절대 금지.
   */
  abstract?: {
    "@id": UrnUuidOnly;
    [k: string]: unknown;
  }[];
  /**
   * @minItems 1
   */
  creator: [CreatorRoot, ...CreatorRoot[]];
  additionalProperty?: AdditionalPropertyArray;
  [k: string]: unknown;
}
/**
 * 순환 참조(Billion Laughs 등) 무한 루프 렌더링 공격을 원천 차단하기 위해 계층 깊이를 제한한 터미널 식별 객체.
 */
export interface TerminalIdentifier {
  "@type": "Article" | "CreativeWork";
  /**
   * [BASE_PRIMITIVES: 원시 데이터 계층 식별자] 시스템 레벨의 소문자 URN Scheme 정규화를 전제로 한 정규식 집합.
   */
  identifier: UrnIdentifier & UrnIdentifier1;
}
/**
 * 구조화된 요약 데이터. isBasedOn 속성을 통해 원본 역참조.
 */
export interface BroAbstract {
  "@context": "https://schema.org";
  "@type": "CreativeWork";
  "@id": UrnUuidOnly;
  /**
   * 요약 데이터의 텍스트 명칭(제목). 스키마 전역의 식별 표제 단일화 정책에 따라 name 속성을 할당함.
   */
  name?: string;
  dateCreated: StrictDateTime;
  dateModified?: StrictDateTime;
  version?: string | number;
  text: PureText;
  inLanguage?: LanguageArray;
  keywords?: KeywordsArray;
  /**
   * 관련 이미지 URL 배열.
   */
  image?: string[];
  /**
   * 참고 문헌 또는 원문 URL 목록.
   */
  citation?: string[];
  /**
   * @minItems 1
   */
  creator: [CreatorRoot, ...CreatorRoot[]];
  /**
   * 이 요약이 기반하고 있는 원본 엔티티(Article 또는 도서 등 CreativeWork)의 단방향 외부 식별자 포인터.
   *
   * @minItems 1
   */
  isBasedOn: [TerminalIdentifier, ...TerminalIdentifier[]];
  additionalProperty?: AdditionalPropertyArray;
  [k: string]: unknown;
}
````

## File: worker/assets/bro-v1-schema.json
````json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schema.slat.or.kr/bro/v1.0/schema.json",
  "title": "Bibliographic Reaction Object (BRO) v1.0",
  "description": "Bibliographic Reaction Object (BRO)의 JSON-LD 네이티브 원시 스키마.",
  "type": "object",
  "oneOf": [
    { "$ref": "#/$defs/BroItemList" },
    { "$ref": "#/$defs/BroArticle" },
    { "$ref": "#/$defs/BroAbstract" }
  ],
  "$defs": {
    "BroItemList": {
      "type": "object",
      "description": "다중 타겟 문서 큐레이션을 위한 영속적 컨테이너 엔티티 (ItemList).",
      "required": [
        "@context",
        "@type",
        "@id",
        "creator",
        "itemListElement",
        "dateCreated"
      ],
      "properties": {
        "@context": { "const": "https://schema.org" },
        "@type": { "const": "ItemList" },
        "@id": { "$ref": "#/$defs/urnUuidOnly" },
        "name": {
          "type": "string",
          "minLength": 2,
          "maxLength": 2000,
          "description": "리스트 컨테이너의 고유 명칭."
        },
        "dateCreated": { "$ref": "#/$defs/strictDateTime" },
        "dateModified": {
          "$ref": "#/$defs/strictDateTime",
          "description": "버전 제어 및 동시성 관리를 위한 최종 수정 일시."
        },
        "version": {
          "type": ["string", "number"],
          "description": "에그리거트 루트의 변경 이력 추적 및 낙관적 락(Optimistic Locking) 검증을 위한 버전 해시 또는 시퀀스 넘버."
        },
        "creator": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/creatorRoot" }
        },
        "itemListElement": {
          "type": "array",
          "description": "리스트에 포함된 개별 문서(Article 등)의 식별자 목록. 직접 내포(Embedding) 금지. 데이터 단편화 방지 및 URN 식별자 정규화를 위해 철저히 포인터 기반 참조로 격리함.",
          "items": {
            "type": "object",
            "required": ["@id"],
            "properties": { "@id": { "$ref": "#/$defs/urnUuidOnly" } }
          }
        },
        "inLanguage": { "$ref": "#/$defs/languageArray" },
        "keywords": { "$ref": "#/$defs/keywordsArray" },
        "additionalProperty": { "$ref": "#/$defs/additionalPropertyArray" }
      }
    },
    "BroArticle": {
      "type": "object",
      "description": "단일 파생 문서(Article) 처리를 위한 영속성 스키마. 기존 YAML 프론트매터 속성을 스키마 최상위 프로퍼티로 추출하여 검색 엔진 및 DB 인덱서의 직접 접근을 허용함.",
      "required": [
        "@context",
        "@type",
        "@id",
        "about",
        "text",
        "creator",
        "dateCreated"
      ],
      "properties": {
        "@context": { "const": "https://schema.org" },
        "@type": { "const": "Article" },
        "@id": { "$ref": "#/$defs/urnUuidOnly" },
        "name": {
          "type": "string",
          "description": "파생 문서 자체의 제목. 시스템 반환 시 Article 엔티티의 최상위 명칭으로 사용됨."
        },
        "aboutName": {
          "type": "string",
          "description": "현재 문서가 타겟팅(about)하고 있는 원본 코어 저작물의 텍스트 명칭(name). 원문 URN 참조가 실패하거나 지연 로딩될 경우의 디그레이드(Degrade) 처리를 위한 역정규화 데이터. 스키마 전역의 명명 규칙(Naming Convention) 통일성에 따라 Title 대신 Name을 접미사로 강제함."
        },
        "aboutCreator": {
          "type": "string",
          "description": "현재 문서가 타겟팅하는 원본 코어 저작물의 원작자 텍스트 표기."
        },
        "articleByline": {
          "type": "string",
          "description": "현재 파생 문서 작성자의 크레딧 라인 표기."
        },
        "dateCreated": { "$ref": "#/$defs/strictDateTime" },
        "dateModified": { "$ref": "#/$defs/strictDateTime" },
        "datePublished": { "$ref": "#/$defs/strictDateTime" },
        "version": { "type": ["string", "number"] },
        "about": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "description": "파생 문서가 타겟팅하는 코어 저작물 엔티티의 식별자 묶음. 다중 판본 바인딩 시 복수 원소를 허용함.",
          "items": { "$ref": "#/$defs/terminalIdentifier" }
        },
        "text": { "$ref": "#/$defs/pureText" },
        "inLanguage": { "$ref": "#/$defs/languageArray" },
        "keywords": { "$ref": "#/$defs/keywordsArray" },
        "image": {
          "type": "array",
          "items": { "type": "string", "format": "uri" },
          "description": "관련 이미지 URL 배열."
        },
        "citation": {
          "type": "array",
          "items": { "type": "string", "format": "uri" },
          "description": "참고 문헌 또는 원문 URL 목록."
        },
        "abstract": {
          "type": "array",
          "description": "현재 문서(Article)에 종속된 파생 요약본의 식별자(URN) 배열. 1:N 구조의 디스크 중복 적재를 막기 위한 식별자 참조. 본문 내포 절대 금지.",
          "items": {
            "type": "object",
            "required": ["@id"],
            "properties": { "@id": { "$ref": "#/$defs/urnUuidOnly" } }
          }
        },
        "creator": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/creatorRoot" }
        },
        "additionalProperty": { "$ref": "#/$defs/additionalPropertyArray" }
      }
    },
    "BroAbstract": {
      "type": "object",
      "description": "구조화된 요약 데이터. isBasedOn 속성을 통해 원본 역참조.",
      "required": [
        "@context",
        "@type",
        "@id",
        "text",
        "creator",
        "dateCreated",
        "isBasedOn"
      ],
      "properties": {
        "@context": { "const": "https://schema.org" },
        "@type": { "const": "CreativeWork" },
        "@id": { "$ref": "#/$defs/urnUuidOnly" },
        "name": {
          "type": "string",
          "description": "요약 데이터의 텍스트 명칭(제목). 스키마 전역의 식별 표제 단일화 정책에 따라 name 속성을 할당함."
        },
        "dateCreated": { "$ref": "#/$defs/strictDateTime" },
        "dateModified": { "$ref": "#/$defs/strictDateTime" },
        "version": { "type": ["string", "number"] },
        "text": { "$ref": "#/$defs/pureText" },
        "inLanguage": { "$ref": "#/$defs/languageArray" },
        "keywords": { "$ref": "#/$defs/keywordsArray" },
        "image": {
          "type": "array",
          "items": { "type": "string", "format": "uri" },
          "description": "관련 이미지 URL 배열."
        },
        "citation": {
          "type": "array",
          "items": { "type": "string", "format": "uri" },
          "description": "참고 문헌 또는 원문 URL 목록."
        },
        "creator": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/creatorRoot" }
        },
        "isBasedOn": {
          "type": "array",
          "minItems": 1,
          "description": "이 요약이 기반하고 있는 원본 엔티티(Article 또는 도서 등 CreativeWork)의 단방향 외부 식별자 포인터.",
          "items": { "$ref": "#/$defs/terminalIdentifier" }
        },
        "additionalProperty": { "$ref": "#/$defs/additionalPropertyArray" }
      }
    },
    "pureText": {
      "type": "string",
      "minLength": 0,
      "maxLength": 300000,
      "description": "순수 본문 문자열 (주로 Markdown 구조). YAML Frontmatter 캡슐화를 전면 폐기함. 인입 파이프라인에서 본 필드 내의 메타데이터 은닉을 감지할 경우 페이로드 수용을 거부(Reject)하며, 모든 메타 속성은 JSON의 1급 객체 또는 additionalProperty로 분리 추출되어야 함."
    },
    "languageArray": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)?$"
      },
      "description": "BCP 47 / ISO 639 언어 코드 목록."
    },
    "keywordsArray": {
      "type": "array",
      "items": { "type": "string" },
      "description": "분류용 핵심어 목록."
    },
    "additionalPropertyArray": {
      "type": "array",
      "description": "Schema.org 표준 PropertyValue 기반 동적 메타데이터 확장 컨테이너. 도서관이나 서비스별로 파편화된 커스텀 메타데이터(예: 평점, 완독 여부, 추천 연령 등)를 스키마를 오염시키지 않고 수용함. NoSQL이나 RDBMS의 JSON 컬럼에서 완벽한 기계적 인덱싱이 가능함.",
      "items": {
        "type": "object",
        "required": ["@type", "name", "value"],
        "properties": {
          "@type": { "const": "PropertyValue" },
          "name": {
            "type": "string",
            "description": "동적 속성의 식별 키(Key)"
          },
          "value": {
            "description": "동적 속성의 값(Value). 원시 타입 및 객체 허용."
          }
        }
      }
    },
    "urnIdentifier": {
      "type": "string",
      "description": "[BASE_PRIMITIVES: 원시 데이터 계층 식별자] 시스템 레벨의 소문자 URN Scheme 정규화를 전제로 한 정규식 집합.",
      "oneOf": [
        { "pattern": "^urn:isbn:(?:97[89]-?)?(?:\\d[ -]?){9}[\\dxX]$" },
        { "pattern": "^urn:doi:10\\.\\d{4,9}\\/[-._;()/:A-Za-z0-9]+$" },
        { "pattern": "^urn:uci:[a-zA-Z0-9]{3,10}[:\\-+][a-zA-Z0-9\\-+.:]+$" },
        { "pattern": "^urn:kolis:[a-zA-Z0-9]+$" },
        {
          "pattern": "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[457][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
        },
        { "pattern": "^urn:nlk:[a-zA-Z0-9]+$" }
      ]
    },
    "urnUuidOnly": {
      "type": "string",
      "pattern": "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[457][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
      "description": "UUID v4, v5, v7을 수용하는 정규화된 범용 고유 식별자 URN 포맷."
    },
    "strictDateTime": {
      "type": "string",
      "format": "date-time",
      "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\\.[0-9]{1,6})?(?:Z|[+-][0-9]{2}:[0-9]{2})$",
      "description": "RFC 3339 기반 타임스탬프 강제 규격. Z 또는 오프셋 명시를 누락한 경우 DB 데이터 오염으로 간주하여 인입을 차단함."
    },
    "terminalIdentifier": {
      "type": "object",
      "description": "순환 참조(Billion Laughs 등) 무한 루프 렌더링 공격을 원천 차단하기 위해 계층 깊이를 제한한 터미널 식별 객체.",
      "required": ["@type", "identifier"],
      "properties": {
        "@type": { "enum": ["Article", "CreativeWork"] },
        "identifier": { "$ref": "#/$defs/urnIdentifier" }
      },
      "additionalProperties": false
    },
    "creatorRoot": {
      "type": "object",
      "description": "[CREATOR_ENTITIES] 작성자 엔티티 다형성 계층. 공공 및 법인은 @id 강제 검증, 개인은 수집 파편화 대응을 위한 선택적 @id 허용, 익명은 추적 불가능한 작성자 데이터의 유실 방지 Fallback.",
      "required": ["@type"],
      "oneOf": [
        { "$ref": "#/$defs/creatorPerson" },
        { "$ref": "#/$defs/creatorAnonymous" },
        { "$ref": "#/$defs/creatorGovernment" },
        { "$ref": "#/$defs/creatorCorporation" },
        { "$ref": "#/$defs/creatorOrganization" },
        { "$ref": "#/$defs/creatorSoftware" }
      ]
    },
    "creatorPerson": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": { "const": "Person" },
        "name": { "type": "string", "maxLength": 1000 },
        "@id": {
          "description": "인증된 사용자에 한해 부여되는 URN/ORCID 식별자. 파편화된 외부 데이터 스크래핑 인입 시 생략을 허용함.",
          "oneOf": [
            { "$ref": "#/$defs/urnUuidOnly" },
            { "pattern": "^urn:orcid:\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]$" }
          ]
        }
      },
      "additionalProperties": false
    },
    "creatorAnonymous": {
      "type": "object",
      "description": "네트워크 인입 단말 혹은 수집 파이프라인에서 작성자 엔티티 추적에 실패할 경우, null/undefined로 인한 스키마 크래시를 방지하는 Fallback 타입.",
      "required": ["@type"],
      "properties": {
        "@type": { "const": "Anonymous" },
        "name": { "type": "string", "default": "Anonymous", "maxLength": 1000 }
      },
      "additionalProperties": false
    },
    "creatorGovernment": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type": { "const": "GovernmentOrganization" },
        "name": { "type": "string", "maxLength": 1000 },
        "@id": {
          "oneOf": [
            { "$ref": "#/$defs/urnUuidOnly" },
            { "pattern": "^urn:kr:govcode:\\d{7}$" }
          ]
        }
      },
      "additionalProperties": false
    },
    "creatorCorporation": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type": { "const": "Corporation" },
        "name": { "type": "string", "maxLength": 1000 },
        "@id": {
          "oneOf": [
            { "$ref": "#/$defs/urnUuidOnly" },
            { "pattern": "^urn:kr:crn:\\d{13}$" }
          ]
        }
      },
      "additionalProperties": false
    },
    "creatorOrganization": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type": { "const": "Organization" },
        "name": { "type": "string", "maxLength": 1000 },
        "@id": {
          "oneOf": [
            { "$ref": "#/$defs/urnUuidOnly" },
            { "pattern": "^urn:kr:npo:\\d{10}$" }
          ]
        }
      },
      "additionalProperties": false
    },
    "creatorSoftware": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type": { "const": "SoftwareApplication" },
        "name": { "type": "string", "maxLength": 1000 },
        "softwareVersion": { "type": "string", "maxLength": 50 },
        "@id": { "pattern": "^urn:model:[a-zA-Z0-9-]+:[a-zA-Z0-9\\.-]+$" }
      },
      "additionalProperties": false
    }
  }
}
````

## File: package.json
````json
{
  "name": "@slat.or.kr/bro-schema",
  "private": false,
  "version": "1.0.2",
  "description": "BRO:Bibliographic Reaction Object",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/freebird920/bro.git"
  },
  "author": "freebird920",
  "license": "Apache-2.0",
  "keywords": [
    "bro",
    "schema",
    "validation",
    "booksle",
    "metadata",
    "slat"
  ],
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "pnpm run build && vite preview",
    "deploy": "pnpm run build && wrangler deploy",
    "cf-typegen": "wrangler types",
    "generate-types": "node scripts/generate-schema-types.cjs",
    "build:npm": "npm run generate-types && node scripts/build-npm-package.js",
    "publish:npm": "pnpm run build:npm && npm publish ./dist-npm --access public"
  },
  "dependencies": {
    "@cfworker/json-schema": "^4.1.1",
    "@fontsource-variable/inter": "^5.2.8",
    "@tailwindcss/vite": "^4.2.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "hono": "^4.12.12",
    "lucide-react": "^1.8.0",
    "radix-ui": "^1.4.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-markdown": "^10.1.0",
    "remark-breaks": "^4.0.0",
    "remark-gfm": "^4.0.1",
    "shadcn": "^4.2.0",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.2",
    "tw-animate-css": "^1.4.0",
    "valibot": "^1.3.1"
  },
  "devDependencies": {
    "@cloudflare/vite-plugin": "^1.31.2",
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@types/yaml": "^1.9.7",
    "@vitejs/plugin-react-swc": "^4.2.2",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "json-schema-to-typescript": "^15.0.4",
    "tsup": "^8.5.1",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1",
    "wrangler": "^4.81.1"
  }
}
````

## File: README.md
````markdown
# Bibliographic Reaction Object (BRO) v1.0 명세서


```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schema.slat.or.kr/bro/v1.0/schema.json",
  "title": "Bibliographic Reaction Object (BRO) v1.0",
  "description": "JSON Schema for BRO v1.0. Paired with the JSON-LD context at https://schema.slat.or.kr/bro/v1.0/context.jsonld and the vocabulary IRI https://schema.slat.or.kr/bro/v1.0/vocab#. RFC 2119/8174 keywords apply. This is an exchange-only schema; runtime concerns such as optimistic locking, ETag issuance, ingestion timestamps, and cache invalidation are explicitly out of scope.",
  "type": "object",
  "oneOf": [
    { "$ref": "#/$defs/Reaction" },
    { "$ref": "#/$defs/ReactionAbstract" },
    { "$ref": "#/$defs/ReactionList" }
  ],

  "$defs": {

    "Reaction": {
      "type": "object",
      "title": "Reaction",
      "description": "A unit of response (textual review, short comment, listing entry, or unspecified) targeting one or more external core works. Subclass of schema:CreativeWork.",
      "required": ["@context", "@type", "@id", "reactionType", "about", "text", "creator", "dateCreated"],
      "properties": {
        "@context":      { "$ref": "#/$defs/contextRef" },
        "@type":         { "const": "Reaction" },
        "@id":           { "$ref": "#/$defs/entityIri" },
        "reactionType":  { "$ref": "#/$defs/reactionType" },
        "name":          { "$ref": "#/$defs/plainText" },
        "byline":        { "$ref": "#/$defs/bylineString" },
        "about": {
          "type": "array",
          "minItems": 1,
          "maxItems": 5,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/externalReference" }
        },
        "text":          { "$ref": "#/$defs/bodyText" },
        "textFormat":    { "$ref": "#/$defs/textFormat" },
        "creator": {
          "type": "array",
          "minItems": 1,
          "maxItems": 100,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/agent" }
        },
        "dateCreated":   { "$ref": "#/$defs/rfc3339DateTime" },
        "dateModified":  { "$ref": "#/$defs/rfc3339DateTime" },
        "datePublished": { "$ref": "#/$defs/rfc3339DateTime" },
        "license":       { "$ref": "#/$defs/httpsIri" },
        "inLanguage":    { "$ref": "#/$defs/languageTagArray" },
        "keywords":      { "$ref": "#/$defs/keywordsArray" },
        "image": {
          "type": "array",
          "maxItems": 50,
          "uniqueItems": true,
          "items": { "type": "string", "format": "uri" }
        },
        "citation": {
          "type": "array",
          "maxItems": 200,
          "uniqueItems": true,
          "items": { "type": "string", "format": "uri" }
        },
        "additionalProperty": { "$ref": "#/$defs/additionalPropertyArray" }
      },
      "patternProperties": {
        "^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": { "$ref": "#/$defs/extensionValue" }
      },
      "additionalProperties": false,
      "allOf": [
        {
          "if":   { "properties": { "reactionType": { "const": "Response" } }, "required": ["reactionType"] },
          "then": { "properties": { "text": { "minLength": 1 } } }
        }
      ]
    },

    "ReactionAbstract": {
      "type": "object",
      "title": "ReactionAbstract",
      "description": "A structured summary derived from a Reaction or directly from an external core work. Subclass of schema:CreativeWork.",
      "required": ["@context", "@type", "@id", "text", "creator", "dateCreated", "isBasedOn"],
      "properties": {
        "@context":      { "$ref": "#/$defs/contextRef" },
        "@type":         { "const": "ReactionAbstract" },
        "@id":           { "$ref": "#/$defs/entityIri" },
        "name":          { "$ref": "#/$defs/plainText" },
        "byline":        { "$ref": "#/$defs/bylineString" },
        "text": {
          "$ref": "#/$defs/bodyText",
          "minLength": 1
        },
        "textFormat":    { "$ref": "#/$defs/textFormat" },
        "creator": {
          "type": "array",
          "minItems": 1,
          "maxItems": 100,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/agent" }
        },
        "dateCreated":   { "$ref": "#/$defs/rfc3339DateTime" },
        "dateModified":  { "$ref": "#/$defs/rfc3339DateTime" },
        "datePublished": { "$ref": "#/$defs/rfc3339DateTime" },
        "license":       { "$ref": "#/$defs/httpsIri" },
        "isBasedOn": {
          "type": "array",
          "minItems": 1,
          "maxItems": 5,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/externalReference" }
        },
        "inLanguage":    { "$ref": "#/$defs/languageTagArray" },
        "keywords":      { "$ref": "#/$defs/keywordsArray" },
        "image": {
          "type": "array",
          "maxItems": 50,
          "uniqueItems": true,
          "items": { "type": "string", "format": "uri" }
        },
        "citation": {
          "type": "array",
          "maxItems": 200,
          "uniqueItems": true,
          "items": { "type": "string", "format": "uri" }
        },
        "additionalProperty": { "$ref": "#/$defs/additionalPropertyArray" }
      },
      "patternProperties": {
        "^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": { "$ref": "#/$defs/extensionValue" }
      },
      "additionalProperties": false
    },

    "ReactionList": {
      "type": "object",
      "title": "ReactionList",
      "description": "A persistent curation container that aggregates Reaction and/or ReactionAbstract instances by reference. Subclass of schema:ItemList.",
      "required": ["@context", "@type", "@id", "creator", "itemListElement", "dateCreated"],
      "properties": {
        "@context":      { "$ref": "#/$defs/contextRef" },
        "@type":         { "const": "ReactionList" },
        "@id":           { "$ref": "#/$defs/entityIri" },
        "name":          { "$ref": "#/$defs/plainText" },
        "byline":        { "$ref": "#/$defs/bylineString" },
        "creator": {
          "type": "array",
          "minItems": 1,
          "maxItems": 100,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/agent" }
        },
        "itemListElement": {
          "type": "array",
          "minItems": 0,
          "maxItems": 10000,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/elementReference" }
        },
        "dateCreated":   { "$ref": "#/$defs/rfc3339DateTime" },
        "dateModified":  { "$ref": "#/$defs/rfc3339DateTime" },
        "license":       { "$ref": "#/$defs/httpsIri" },
        "inLanguage":    { "$ref": "#/$defs/languageTagArray" },
        "keywords":      { "$ref": "#/$defs/keywordsArray" },
        "additionalProperty": { "$ref": "#/$defs/additionalPropertyArray" }
      },
      "patternProperties": {
        "^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": { "$ref": "#/$defs/extensionValue" }
      },
      "additionalProperties": false
    },

    "reactionType": {
      "type": "string",
      "enum": ["Response", "Listing", "Unspecified"],
      "default": "Unspecified",
      "description": "Discriminator for the reaction's ontological intent. Response: the reaction is a textual response (review/comment/critique); a body is required. Listing: the reaction is a curation entry (recommended-list inclusion, endorsement) regardless of body presence. Unspecified: the publisher explicitly declines to classify."
    },

    "contextRef": {
      "description": "MUST resolve to the BRO v1.0 context. Either the bare context IRI or an array containing it.",
      "oneOf": [
        { "const": "https://schema.slat.or.kr/bro/v1.0/context.jsonld" },
        {
          "type": "array",
          "minItems": 1,
          "contains": { "const": "https://schema.slat.or.kr/bro/v1.0/context.jsonld" },
          "items": {
            "oneOf": [
              { "type": "string", "format": "uri" },
              { "type": "object" }
            ]
          }
        }
      ]
    },

    "entityIri": {
      "description": "Identifier for a BRO entity instance. UUID URN or HTTPS IRI.",
      "anyOf": [
        { "$ref": "#/$defs/uuidUrn" },
        { "$ref": "#/$defs/httpsIri" }
      ]
    },

    "agentIri": {
      "description": "Identifier for an agent. UUID URN, HTTPS IRI, or mailto: URI.",
      "anyOf": [
        { "$ref": "#/$defs/uuidUrn" },
        { "$ref": "#/$defs/httpsIri" },
        { "$ref": "#/$defs/mailtoUri" }
      ]
    },

    "anyIri": {
      "anyOf": [
        { "$ref": "#/$defs/uuidUrn" },
        { "$ref": "#/$defs/httpsIri" },
        { "$ref": "#/$defs/mailtoUri" },
        { "$ref": "#/$defs/isbnUrn" },
        { "$ref": "#/$defs/doiHttpsIri" },
        { "$ref": "#/$defs/orcidHttpsIri" }
      ]
    },

    "uuidUrn": {
      "type": "string",
      "description": "RFC 9562 UUID URN, canonical lowercase. Versions 1, 4, 5, 6, 7, 8.",
      "pattern": "^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
    },

    "httpsIri": {
      "type": "string",
      "description": "HTTPS IRI. Domain MUST contain at least one dot and end in a 2+ character TLD label. Syntactic only — TLD validity, IDN normalization, and dereferenceability remain the application layer's responsibility. IDN MUST be punycode-encoded.",
      "pattern": "^https://(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:/[^\\s<>\"\\\\^`{|}]*)?$",
      "maxLength": 2048
    },

    "mailtoUri": {
      "type": "string",
      "description": "RFC 6068 mailto URI. Permitted only as an agent identifier. Publishers SHOULD apply hashing or consent-based handling for PII.",
      "pattern": "^mailto:[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      "maxLength": 320
    },

    "externalReference": {
      "type": "object",
      "description": "Terminal pointer to an external core work or another BRO entity.",
      "required": ["@type", "identifier"],
      "properties": {
        "@type": {
          "type": "string",
          "enum": ["Article", "CreativeWork", "Book", "ScholarlyArticle", "Reaction", "ReactionAbstract"]
        },
        "identifier": { "$ref": "#/$defs/externalIdentifier" }
      },
      "additionalProperties": false
    },

    "elementReference": {
      "type": "object",
      "description": "Pointer to another BRO entity within the same exchange.",
      "required": ["@id"],
      "properties": {
        "@id":   { "$ref": "#/$defs/entityIri" },
        "@type": { "type": "string", "enum": ["Reaction", "ReactionAbstract", "ReactionList"] }
      },
      "additionalProperties": false
    },

    "externalIdentifier": {
      "description": "Identifier for external core works.",
      "anyOf": [
        { "$ref": "#/$defs/isbnUrn" },
        { "$ref": "#/$defs/doiHttpsIri" },
        { "$ref": "#/$defs/orcidHttpsIri" },
        { "$ref": "#/$defs/uuidUrn" },
        { "$ref": "#/$defs/httpsIri" }
      ]
    },

    "isbnUrn": {
      "type": "string",
      "description": "ISBN-10 or ISBN-13 in URN form. Hyphens limited to 4 occurrences. Whitespace forbidden. Strict checksum and group-code validation are the application layer's responsibility.",
      "pattern": "^urn:isbn:(?:97[89][0-9]{10}|97[89](?:-[0-9]+){1,4}|[0-9]{9}[0-9Xx]|[0-9]+(?:-[0-9]+){1,4}-?[0-9Xx])$"
    },

    "doiHttpsIri": {
      "type": "string",
      "description": "DOI in canonical HTTPS form. Standard DOI (10.NNNN/...) and ShortDOI (10/...) are both accepted.",
      "pattern": "^https://doi\\.org/10(?:\\.[0-9]{4,9})?/[\\x21-\\x7e]+$"
    },

    "orcidHttpsIri": {
      "type": "string",
      "description": "ORCID iD in canonical HTTPS form.",
      "pattern": "^https://orcid\\.org/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$"
    },

    "rfc3339DateTime": {
      "type": "string",
      "format": "date-time",
      "description": "RFC 3339 date-time. Time-zone designation Z or numeric offset is required; naive datetimes are rejected. Leap seconds permitted.",
      "pattern": "^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])T(?:[01][0-9]|2[0-3]):[0-5][0-9]:(?:[0-5][0-9]|60)(?:\\.[0-9]+)?(?:Z|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])$"
    },

    "rfc3339Date": {
      "type": "string",
      "description": "RFC 3339 full-date (YYYY-MM-DD) with no time component. Used for role start/end dates where time precision is irrelevant.",
      "pattern": "^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$"
    },

    "languageTag": {
      "type": "string",
      "description": "BCP 47 language tag, syntactic validation only.",
      "pattern": "^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{1,8})*$",
      "maxLength": 35
    },

    "languageTagArray": {
      "type": "array",
      "minItems": 1,
      "maxItems": 20,
      "uniqueItems": true,
      "items": { "$ref": "#/$defs/languageTag" }
    },

    "plainText": {
      "type": "string",
      "minLength": 1,
      "maxLength": 2000,
      "description": "A short human-readable string in the document's primary language declared by inLanguage."
    },

    "bylineString": {
      "type": "string",
      "minLength": 1,
      "maxLength": 2000,
      "description": "A free-form display string preserving the original attribution as it appears in the source. MUST be a string only; structured Role objects belong inside `creator`."
    },

    "keywordsArray": {
      "type": "array",
      "minItems": 0,
      "maxItems": 100,
      "items": {
        "type": "string",
        "minLength": 1,
        "maxLength": 200
      }
    },

    "bodyText": {
      "type": "string",
      "description": "The body text. UTF-8. The string MUST NOT begin with a YAML/TOML front-matter block.",
      "minLength": 0,
      "maxLength": 300000
    },

    "textFormat": {
      "type": "string",
      "description": "MIME type hint per RFC 6838. Free-form to accommodate evolving formats. Absent means text/plain. Consumers MAY apply their own rendering heuristics regardless of this hint.",
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}/[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}(?:\\s*;\\s*[a-zA-Z0-9!#$&^_.+-]+=(?:[a-zA-Z0-9!#$&^_.+-]+|\"[^\"]*\"))*$",
      "maxLength": 255
    },

    "agent": {
      "description": "Polymorphic creator entity, distinguished by @type.",
      "oneOf": [
        { "$ref": "#/$defs/agentPerson" },
        { "$ref": "#/$defs/agentUnknown" },
        { "$ref": "#/$defs/agentGovernment" },
        { "$ref": "#/$defs/agentCorporation" },
        { "$ref": "#/$defs/agentOrganization" },
        { "$ref": "#/$defs/agentSoftware" },
        { "$ref": "#/$defs/agentRole" }
      ]
    },

    "agentPerson": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": { "const": "Person" },
        "@id":   { "$ref": "#/$defs/agentIri" },
        "name":  { "type": "string", "minLength": 1, "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentUnknown": {
      "type": "object",
      "description": "Explicit declaration that the publisher cannot identify the agent. Each instance is a fresh blank node by design (no global singleton).",
      "required": ["@type"],
      "properties": {
        "@type": { "const": "UnknownAgent" },
        "name":  { "type": "string", "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentGovernment": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": { "const": "GovernmentOrganization" },
        "@id":   { "anyOf": [{ "$ref": "#/$defs/uuidUrn" }, { "$ref": "#/$defs/httpsIri" }] },
        "name":  { "type": "string", "minLength": 1, "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentCorporation": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": { "const": "Corporation" },
        "@id":   { "anyOf": [{ "$ref": "#/$defs/uuidUrn" }, { "$ref": "#/$defs/httpsIri" }] },
        "name":  { "type": "string", "minLength": 1, "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentOrganization": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": { "const": "Organization" },
        "@id":   { "anyOf": [{ "$ref": "#/$defs/uuidUrn" }, { "$ref": "#/$defs/httpsIri" }] },
        "name":  { "type": "string", "minLength": 1, "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentSoftware": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type":           { "const": "SoftwareApplication" },
        "@id":             { "$ref": "#/$defs/httpsIri" },
        "name":            { "type": "string", "minLength": 1, "maxLength": 1000 },
        "softwareVersion": { "type": "string", "minLength": 1, "maxLength": 50 }
      },
      "additionalProperties": false
    },

    "agentRole": {
      "type": "object",
      "description": "Reified role at the time of authorship. Used inside `creator` to preserve time-bounded affiliations without conflating them with the agent's enduring identity.",
      "required": ["@type", "agent"],
      "properties": {
        "@type":     { "const": "Role" },
        "roleName":  { "type": "string", "minLength": 1, "maxLength": 1000 },
        "startDate": { "$ref": "#/$defs/rfc3339Date" },
        "endDate":   { "$ref": "#/$defs/rfc3339Date" },
        "agent":     { "$ref": "#/$defs/agentInRole" }
      },
      "additionalProperties": false
    },

    "agentInRole": {
      "description": "Inner agent inside a Role. Role itself is excluded to prevent recursive nesting.",
      "oneOf": [
        { "$ref": "#/$defs/agentPerson" },
        { "$ref": "#/$defs/agentUnknown" },
        { "$ref": "#/$defs/agentGovernment" },
        { "$ref": "#/$defs/agentCorporation" },
        { "$ref": "#/$defs/agentOrganization" },
        { "$ref": "#/$defs/agentSoftware" }
      ]
    },

    "additionalPropertyArray": {
      "type": "array",
      "maxItems": 200,
      "items": { "$ref": "#/$defs/additionalPropertyValue" }
    },

    "additionalPropertyValue": {
      "type": "object",
      "required": ["@type", "name", "value"],
      "properties": {
        "@type":          { "const": "PropertyValue" },
        "name":           { "type": "string", "minLength": 1, "maxLength": 200 },
        "propertyID":     { "type": "string", "format": "uri" },
        "value":          {},
        "valueReference": { "type": "string", "format": "uri" },
        "unitCode":       { "type": "string", "maxLength": 50 },
        "unitText":       { "type": "string", "maxLength": 50 }
      },
      "additionalProperties": false
    },

    "extensionValue": {
      "description": "Value of an extension property under a colon-prefixed namespace. Limited in depth and size to prevent payload bombs.",
      "oneOf": [
        { "type": "string",  "maxLength": 10000 },
        { "type": "number" },
        { "type": "boolean" },
        { "type": "null" },
        {
          "type": "object",
          "maxProperties": 20,
          "properties": {
            "@id":       { "$ref": "#/$defs/anyIri" },
            "@type":     { "type": "string", "maxLength": 200 },
            "@value":    { "type": ["string", "number", "boolean"] },
            "@language": { "$ref": "#/$defs/languageTag" }
          },
          "patternProperties": {
            "^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": {
              "oneOf": [
                { "type": "string",  "maxLength": 10000 },
                { "type": "number" },
                { "type": "boolean" },
                { "type": "null" },
                { "type": "object", "maxProperties": 20 },
                { "type": "array",  "maxItems": 100 }
              ]
            }
          },
          "additionalProperties": false
        },
        {
          "type": "array",
          "maxItems": 100,
          "items": {
            "oneOf": [
              { "type": "string",  "maxLength": 10000 },
              { "type": "number" },
              { "type": "boolean" },
              { "type": "object", "maxProperties": 20 }
            ]
          }
        }
      ]
    }
  }
}
```

```jsonld
{
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "@base": "https://schema.slat.or.kr/bro/v1.0/instances/",

    "schema": "https://schema.org/",
    "bro":    "https://schema.slat.or.kr/bro/v1.0/vocab#",
    "xsd":    "http://www.w3.org/2001/XMLSchema#",
    "rdfs":   "http://www.w3.org/2000/01/rdf-schema#",
    "prov":   "http://www.w3.org/ns/prov#",

    "Reaction": {
      "@id": "bro:Reaction",
      "@context": {
        "creator": { "@id": "schema:author", "@container": "@set" }
      }
    },
    "ReactionAbstract": {
      "@id": "bro:ReactionAbstract",
      "@context": {
        "creator": { "@id": "schema:author", "@container": "@set" }
      }
    },
    "ReactionList": {
      "@id": "bro:ReactionList",
      "@context": {
        "creator": { "@id": "schema:creator", "@container": "@set" }
      }
    },

    "Person":                 "schema:Person",
    "UnknownAgent":           "bro:UnknownAgent",
    "GovernmentOrganization": "schema:GovernmentOrganization",
    "Corporation":            "schema:Corporation",
    "Organization":           "schema:Organization",
    "SoftwareApplication":    "schema:SoftwareApplication",
    "Role":                   "schema:Role",
    "PropertyValue":          "schema:PropertyValue",
    "Article":                "schema:Article",
    "CreativeWork":           "schema:CreativeWork",
    "Book":                   "schema:Book",
    "ScholarlyArticle":       "schema:ScholarlyArticle",

    "reactionType": { "@id": "bro:reactionType", "@type": "@vocab" },
    "Response":     "bro:Response",
    "Listing":      "bro:Listing",
    "Unspecified":  "bro:Unspecified",

    "name":       "schema:name",
    "byline":     "bro:byline",
    "text":       "schema:text",
    "textFormat": "schema:encodingFormat",
    "roleName":   "schema:roleName",
    "agent":      "schema:agent",

    "keywords": {
      "@id": "schema:keywords",
      "@container": "@set"
    },
    "image": {
      "@id": "schema:image",
      "@type": "@id",
      "@container": "@set"
    },
    "citation": {
      "@id": "schema:citation",
      "@type": "@id",
      "@container": "@set"
    },
    "inLanguage": {
      "@id": "schema:inLanguage",
      "@container": "@set"
    },

    "license":       { "@id": "schema:license",       "@type": "@id" },
    "dateCreated":   { "@id": "schema:dateCreated",   "@type": "xsd:dateTime" },
    "dateModified":  { "@id": "schema:dateModified",  "@type": "xsd:dateTime" },
    "datePublished": { "@id": "schema:datePublished", "@type": "xsd:dateTime" },
    "startDate":     { "@id": "schema:startDate",     "@type": "xsd:date" },
    "endDate":       { "@id": "schema:endDate",       "@type": "xsd:date" },

    "softwareVersion": "schema:softwareVersion",

    "about":           { "@id": "schema:about",           "@container": "@set" },
    "isBasedOn":       { "@id": "schema:isBasedOn",       "@container": "@set" },
    "itemListElement": { "@id": "schema:itemListElement", "@container": "@list" },

    "identifier": {
      "@id": "schema:identifier",
      "@type": "@id"
    },

    "additionalProperty": {
      "@id": "schema:additionalProperty",
      "@container": "@set"
    },
    "value":          "schema:value",
    "valueReference": "schema:valueReference",
    "propertyID":     "schema:propertyID",
    "unitCode":       "schema:unitCode",
    "unitText":       "schema:unitText"
  }
}
```

# Bibliographic Reaction Object (BRO) v1.0

| 항목 | 값 |
|---|---|
| 표준 식별자 | `https://schema.slat.or.kr/bro/v1.0/schema.json` |
| JSON-LD 컨텍스트 | `https://schema.slat.or.kr/bro/v1.0/context.jsonld` |
| 어휘 IRI | `https://schema.slat.or.kr/bro/v1.0/vocab#` |
| 사양 | JSON Schema Draft 2020-12 + JSON-LD 1.1 |
| 발행 주체 | SLAT |
| 라이선스 | CC BY 4.0 |

---

## 0. 개요

### 0.1 본 사양이 다루는 것

도서·논문 등 서지 자원에 대한 인간 또는 기계의 2차 저작 활동(서평, 독후감, 감상문, 추천 리스트, 요약)을 **시스템 간에 손실 없이 교환**하기 위한 페이로드 표준이다.

### 0.2 본 사양이 다루지 않는 것

- 저장소의 내부 데이터 모델
- 낙관적 락, ETag 발행, 버전 관리, 감사 로그
- 인입 시각, 캐시 적재 시각, 신선도 정책
- 본문 렌더링 방식 및 보안 정제
- 검색 인덱싱 전략, 권한 모델

### 0.3 설계 철학

본 사양은 두 축의 균형을 명시적으로 추구한다.

1. **명시적 선언 강제** — 침묵(필드 누락, null)을 정보로 취급하지 않는다. 작성자가 모르는 정보는 자유 텍스트(`byline`)나 명시적 미상 어휘(`UnknownAgent`)로 선언해야 한다.
2. **레거시 수용** — 작성 당시의 직책, 부분 정밀도 시각, 정규화 불가능한 출처 표기를 변환자가 자의적으로 해석하지 않고 보존한다.

두 축이 충돌할 때 본 사양은 일관되게 **레거시 수용**을 우선한다. 시맨틱 웹 정통 모델보다 작성자 친화성이 우선한다.

### 0.4 표기 규약

본 명세서의 키워드 **MUST**, **MUST NOT**, **SHALL**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, **OPTIONAL** 은 RFC 2119/8174의 정의를 따른다.

---

## 1. 데이터 모델 개요

본 사양은 세 가지 엔티티를 정의한다. 페이로드는 정확히 하나의 엔티티에 매칭되어야 한다.

| 엔티티 | `@type` | 상위 어휘 | 역할 |
|---|---|---|---|
| `Reaction` | `"Reaction"` | `schema:CreativeWork` | 코어 저작물에 대한 단일 응답 단위 |
| `ReactionAbstract` | `"ReactionAbstract"` | `schema:CreativeWork` | 반응 또는 코어 저작물에 기반한 요약 |
| `ReactionList` | `"ReactionList"` | `schema:ItemList` | 복수의 반응을 묶은 큐레이션 목록 |

### 엔티티 관계도

```
            ReactionList
                 │ itemListElement[*]
                 ▼
            Reaction ──about[1..5]──▶ External Core Work
                 ▲                    (urn:isbn / doi.org / …)
                 │ isBasedOn[1..5]
                 │
            ReactionAbstract
```

요약(ReactionAbstract)은 Reaction을 단방향으로 가리킨다. Reaction은 자신의 요약 목록을 들고 다니지 않는다.

---

## 2. 공통 데이터 타입

### 2.1 식별자

#### entityIri (BRO 인스턴스 자체의 식별자)

| 형식 | 예시 |
|---|---|
| UUID URN (RFC 9562) | `urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7` |
| HTTPS IRI | `https://library.example.kr/reactions/2026/r-9182` |

UUID URN은 **소문자 정규형**이어야 한다. 대문자는 거부된다. UUID 버전 1, 4, 5, 6, 7, 8을 허용한다.

#### agentIri

위에 더해 다음을 추가로 허용한다.

| 형식 | 예시 |
|---|---|
| `mailto:` URI | `mailto:dokja@example.org` |
| HTTPS 핸들 | `https://blog.example.com/@dokja` |
| ORCID HTTPS | `https://orcid.org/0000-0002-1825-0097` |

`mailto:`는 PII이므로 발행 시스템은 해싱 또는 동의 기반 처리를 적용하는 것을 **RECOMMENDED**.

#### 좋은 식별자 예시

```json
"@id": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7"
"@id": "https://library.example.kr/reactions/2026/r-9182"
"@id": "https://blog.example.com/posts/1984-review"
```

#### 잘못된 식별자 예시

```json
"@id": "urn:uuid:7C9E6679-7425-40DE-944B-E07FC1F90AE7"  // 대문자 거부
"@id": "review-1984-by-dokja"                            // IRI 아님
"@id": "http://library.example.kr/reactions/r-9182"      // HTTP 거부
"@id": "https://localhost/r-9182"                        // TLD 없음
"@id": "https://192.168.1.1/r-9182"                      // IP 직접 거부
```

---

### 2.2 외부 식별자

코어 저작물(반응의 대상)을 가리키는 식별자.

| 형식 | 예시 |
|---|---|
| ISBN URN | `urn:isbn:9788937462788` |
| DOI HTTPS | `https://doi.org/10.1038/s41586-021-03819-2` |
| ShortDOI HTTPS | `https://doi.org/10/abcde` |
| ORCID HTTPS | `https://orcid.org/0000-0002-1825-0097` |
| HTTPS IRI | `https://www.nl.go.kr/NL/contents/...` |
| UUID URN | `urn:uuid:...` (다른 BRO 인스턴스) |

#### 좋은 사용 예시

```json
{ "@type": "Book", "identifier": "urn:isbn:9788937462788" }
{ "@type": "Book", "identifier": "urn:isbn:978-89-374-6278-8" }
{ "@type": "ScholarlyArticle", "identifier": "https://doi.org/10.1038/s41586-021-03819-2" }
{ "@type": "CreativeWork", "identifier": "https://news.example.com/2025/01/article" }
{ "@type": "Reaction", "identifier": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7" }
```

#### 잘못된 사용 예시

```json
{ "@type": "Book", "identifier": "urn:isbn:978-8-9-3-7-4-6-2-7-8-8" }   // 하이픈 5개 초과
{ "@type": "Book", "identifier": "9788937462788" }                       // urn:isbn: 접두사 없음
{ "@type": "Book", "identifier": "urn:isbn:978 89 374 6278 8" }          // 공백 거부
{ "@type": "Book", "identifier": "doi:10.1038/s41586-021-03819-2" }      // urn:doi: 거부, HTTPS 형태 사용
```

#### 국가별 식별자

KOLIS 일련번호, NLK 제어번호, KCI 논문 ID 등은 본 사양의 핵심 식별자에 포함되지 않는다. `additionalProperty`로 표현한다.

```json
"about": [{ "@type": "Book", "identifier": "urn:isbn:9788937462788" }],
"additionalProperty": [
  {
    "@type": "PropertyValue",
    "name": "kr-nlk:cnumber",
    "propertyID": "https://schema.slat.or.kr/national/kr-nlk#cnumber",
    "value": "CIP2018024829"
  }
]
```

---

### 2.3 시각

RFC 3339 형식. 시간대 지정자 필수.

| 유효 | 무효 |
|---|---|
| `2026-04-15T18:22:00+09:00` | `2026-04-15 18:22:00` |
| `2026-04-15T09:22:00Z` | `2026-04-15T18:22:00` |
| `1995-04-01T00:00:00+09:00` | `2026/04/15` |

#### `dateCreated`의 의미

콘텐츠가 만들어진 시각. **콘텐츠 시간 영역**이다 (인입·저장 시각이 아님). 작성자가 자유롭게 지정 가능하며, 시스템은 비어있을 때만 인입 시각으로 자동 보완한다.

#### 레거시 부분 정밀도

```json
"dateCreated": "1995-04-01T00:00:00+09:00",
"additionalProperty": [
  { "@type": "PropertyValue", "name": "ops:dateCreatedPrecision", "value": "month" }
]
```

`ops:dateCreatedPrecision` 값: `year` / `month` / `day` / `second`.

---

### 2.4 reactionType (Reaction 한정)

`Reaction`의 **필수 필드**. 발신자가 명시적으로 분류 책임을 진다.

| 값 | 의미 | text 정책 |
|---|---|---|
| `Response` | 텍스트 응답 (후기·코멘트·비평) | `minLength: 1` 강제 |
| `Listing` | 단순 등재 (추천 리스트, 권장 도서) | 본문 자유 (있으면 등재 사유 메모) |
| `Unspecified` | 발신자가 분류를 명시적으로 포기 | 본문 자유 |

#### 분류 결정 가이드

- 작성자가 책에 대해 의견을 표현하고 본문이 있는가? → `Response`
- 작성자가 책을 목록에 포함시키는 행위인가? 본문 유무 무관 → `Listing`
- 발신자가 둘 중 어느 쪽인지 결정할 수 없는가? → `Unspecified`

#### 좋은 예시

```json
{ "reactionType": "Response", "text": "오웰의 신어는 ..." }
{ "reactionType": "Listing", "text": "" }
{ "reactionType": "Listing", "text": "권장 도서로 선정. 학생들이 읽기 쉬움." }
{ "reactionType": "Unspecified", "text": "원본에 분류 정보가 없었음" }
```

#### 잘못된 예시

```json
{ "reactionType": "Response", "text": "" }                  // Response는 본문 필수
{ "reactionType": null }                                    // null 거부
{ /* reactionType 키 자체가 없음 */ }                       // 필드 누락은 비준수
{ "reactionType": "Review" }                                // enum에 없음
```

---

### 2.5 인간 가독 텍스트

`name`, `byline`, `keywords` 항목은 단순 문자열이다. 길이는 1–2,000자 (키워드는 1–200자). 다국어 객체는 받지 않는다.

다국어가 필요한 발행자는 (1) 언어별 별도 인스턴스 발행, 또는 (2) `additionalProperty`로 자체 어휘 부착으로 자율 처리한다.

```json
"name": "전체주의의 언어"
"byline": "탐진치 (작성 당시 국어국문학과 교수)"
"keywords": ["디스토피아", "전체주의"]
"inLanguage": ["ko"]
```

---

### 2.6 본문 (`text`, `textFormat`)

#### `text`

UTF-8 문자열, 0–300,000자. `reactionType=Response`일 때 `minLength: 1` 강제.

#### `textFormat` (선택)

본문의 MIME 타입 힌트. RFC 6838 구문 자유 형식. 생략 시 `text/plain`으로 간주.

| 흔한 값 |
|---|
| `text/plain` |
| `text/markdown` |
| `text/markdown; variant=CommonMark` |
| `text/markdown; variant=GFM` |
| `text/markdown; variant=MDX` |
| `text/html` |
| `text/x-asciidoc` |

`textFormat`은 **힌트**다. 받는 시스템은 자체 휴리스틱으로 처리할 수 있다.

#### 주의 사항

메타데이터는 1급 필드 또는 `additionalProperty`로 분리되어야 한다.

#### 좋은 예시

```json
{ "text": "오늘 1984를 다 읽었다. 마지막 장면이 인상적이었다." }
{ "text": "재미있었다.", "textFormat": "text/plain" }
{ "text": "# 전체주의의 언어\n\n오웰이 그린 ...", "textFormat": "text/markdown; variant=CommonMark" }
{ "text": "<p>오웰이 그린 <em>전체주의 사회</em>...</p>", "textFormat": "text/html" }
```

#### 잘못된 예시

```json
"text": "---\nrating: 5\n---\n\n오늘 ..."  // 프론트매터 거부
```

---

### 2.7 작성자 (`creator`)

작성자는 **이 BRO 데이터를 발행한 책임자**다. 본문 저자가 아닐 수 있다 (§2.8 byline 참조).

#### 7가지 타입

| `@type` | 사용 사례 | `@id` 정책 |
|---|---|---|
| `Person` | 자연인 | 선택 (UUID/HTTPS/mailto/ORCID) |
| `UnknownAgent` | 작성자가 알려지지 않음을 명시적 선언 | 금지 (매 인스턴스 blank node) |
| `GovernmentOrganization` | 정부기관 | 선택 |
| `Corporation` | 영리 법인 | 선택 |
| `Organization` | 비영리·일반 조직 | 선택 |
| `SoftwareApplication` | AI·봇·자동 변환 도구 | 필수 (HTTPS IRI) |
| `Role` | 시간 한정적 직책 (Reified Role) | (내부 agent에 위 6종) |

#### 좋은 사용 예시

```json
"creator": [{ "@type": "Person", "name": "김독자" }]

"creator": [{ "@type": "Person", "name": "김독자", "@id": "https://library.example.kr/users/dokja-9182" }]

"creator": [{ "@type": "Person", "name": "이연구", "@id": "https://orcid.org/0000-0002-1825-0097" }]

"creator": [{ "@type": "Person", "name": "Dokja", "@id": "mailto:dokja@example.org" }]

"creator": [{ "@type": "Organization", "name": "국립중앙도서관", "@id": "https://www.nl.go.kr/" }]

"creator": [{
  "@type": "SoftwareApplication",
  "name": "BRO Summarizer",
  "softwareVersion": "1.2.0",
  "@id": "https://schema.slat.or.kr/agents/bro-summarizer"
}]

"creator": [{ "@type": "UnknownAgent" }]

"creator": [{ "@type": "UnknownAgent", "name": "○○일보 기자 미상" }]

"creator": [{
  "@type": "Role",
  "roleName": "1학년 국어과 교사",
  "startDate": "1995-03-01",
  "endDate": "1996-02-28",
  "agent": { "@type": "Person", "name": "탐진치" }
}]
```

#### 잘못된 예시

```json
"creator": []                                  // 빈 배열 거부
"creator": [{ "@type": "UnknownAgent", "@id": "..." }]  // UnknownAgent에 @id 금지
"creator": [{ "@type": "Anonymous" }]          // 본 사양에서 사용하지 않는
"creator": [{ "@type": "Person" }]             // name 필수
"creator": null                                // 필드 자체 누락 또는 null 모두 비준수
```

#### `UnknownAgent`의 의미

 `@type === "UnknownAgent"` 단일 비교로 "발신자가 미상을 명시적으로 선언했음"을 판정한다. 필드가 누락되었거나 `creator: []`인 경우와 정확히 구분된다.

---

### 2.8 byline

본문 저자에 대한 **자유 문자열**. 시스템 식별자로 관리되지 않거나 관리할 필요가 없는 작성자 정보를 원본 그대로 보존한다.

#### 도입 배경

1. 레거시 데이터의 작성자가 IRI로 관리되지 않음 (1990년대 신문 서평 등)
2. 작성 당시의 직책·소속이 시간이 지나면 변함 (전거 비용을 본 사양이 강제하지 않음)
3. 출처에 작성자 정보가 부분적으로만 명시됨 ("사서 서사 추천", "A시 B구 거주 어린이 강아지풀 씀")
4. 출처에 작성자가 자신을 가명으로 표시하는 경우

#### 좋은 사용 예시

```json
"byline": "탐진우치 (작성 당시 국어국문학과 교수)"
"byline": "어린이 강아지 씀"
"byline": "사서 서사"
"byline": "○○신문 기자 김기자"
"byline": "나무를 사랑하는 어린이 강아지 씀"
```

#### 잘못된 사용 예시

```json
"byline": { "@type": "Role", "roleName": "...", "agent": {...} }  // 객체 거부 (v1.0)
"byline": ""                                                       // 빈 문자열 거부
```

`byline`은 **순수 문자열만** 받는다. 구조화된 직책 정보가 필요한 경우 `creator` 내부에서 `Role`을 사용한다(§2.7).

---

### 2.9 license (선택)

본 BRO 인스턴스의 라이선스 IRI. SPDX 라이선스 IRI 또는 Creative Commons IRI 사용을 **RECOMMENDED**.

```json
"license": "https://creativecommons.org/licenses/by/4.0/"
"license": "https://creativecommons.org/licenses/by-sa/4.0/"
"license": "https://creativecommons.org/publicdomain/zero/1.0/"
"license": "https://spdx.org/licenses/MIT.html"
```

---

### 2.10 동적 메타데이터 (`additionalProperty`)

스키마를 변경하지 않고 도메인별 메타데이터를 부착하는 확장점.

| 필드 | 필수 | 설명 |
|---|---|---|
| `@type` | ✓ | `"PropertyValue"` 고정 |
| `name` | ✓ | 키. 콜론 접두사 권장 |
| `value` | ✓ | 임의 JSON 값 |
| `propertyID` | — | 디리퍼런스 IRI |
| `valueReference` | — | 값 출처 IRI |
| `unitCode` / `unitText` | — | 단위 |

#### 사용 예시

```json
{ "@type": "PropertyValue", "name": "lib:rating", "value": 4.5 }
{ "@type": "PropertyValue", "name": "lib:readingStatus", "value": "completed" }
{ "@type": "PropertyValue", "name": "lib:targetAge", "value": { "min": 9, "max": 12 } }
{
  "@type": "PropertyValue",
  "name": "kpa:designation",
  "propertyID": "https://schema.kpa21.or.kr/designations#sejong",
  "value": "세종도서 학술부문 선정"
}
```

---

### 2.11 외부 RDF 어휘 확장 (patternProperties)

본 사양은 모든 엔티티 객체에 콜론 접두사 키를 통한 외부 RDF 어휘 직접 주입을 허용한다. 패턴은 `^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$`이며, 값은 깊이 2단계로 제한된다.

#### 허용되는 키 예시

```json
{
  "@type": "Reaction",
  ...,
  "foaf:depiction": "https://example.org/avatar.png",
  "dcterms:rightsHolder": "○○대학교",
  "prov:wasGeneratedBy": { "@id": "https://example.org/curation-event-001" }
}
```

이는 `foaf`, `dcterms`, `prov` 등 외부 어휘를 본 사양의 추가 정의 없이 자유롭게 합성하기 위한 확장점이다. JSON-LD 처리기는 사용된 접두사를 본 사양 컨텍스트의 추가 정의 또는 인스턴스 자체의 `@context` 확장에서 해석한다.

#### 거부되는 패턴

```json
"myCustomField": "..."        // 콜론 접두사 없음 → 거부
"@customType": "..."          // @ 접두사는 JSON-LD 예약어
```

---

## 3. 엔티티별 상세 명세

### 3.1 Reaction

코어 저작물에 대한 단일 응답 단위. 응답의 형태는 자유다 — 긴 후기, 짧은 코멘트, 별점만 부착한 등재, 본문 없는 단순 등재까지 모두 같은 단위에 속한다.

본 사양의 이 결정은 시맨틱 웹의 어휘 세분화 원칙(`schema:Review` vs `schema:EndorseAction` 분리)과 의도적으로 다르다. 본 사양은 작성자 시점의 **발행 단위 일관성**과 **진화 수용성**을 우선한다. 발행 후 응답의 형태가 변하더라도 발행 단위(`@id`)는 보존된다. 받는 시스템이 정통 어휘로 매핑하고자 한다면 `reactionType`과 본문 길이로 분기하는 변환 함수를 응용 계층에 두면 된다.

#### 필수 필드

| 필드 | 타입 | 의미 |
|---|---|---|
| `@context` | 컨텍스트 IRI | BRO v1.0 컨텍스트 |
| `@type` | `"Reaction"` | 고정 |
| `@id` | entityIri | 이 반응의 식별자 |
| `reactionType` | enum | `Response`/`Listing`/`Unspecified` |
| `about` | externalReference[] | 코어 저작물 (1–5개) |
| `text` | string | 반응 본문 |
| `creator` | agent[] | 발행 책임자 (1–100개) |
| `dateCreated` | RFC 3339 | 작성 시각 |

#### 선택 필드

`name`, `byline`, `textFormat`, `dateModified`, `datePublished`, `license`, `inLanguage`, `keywords`, `image`, `citation`, `additionalProperty`, 그리고 colon-prefixed 외부 RDF 어휘 키.

#### 다중 about의 의미

`about: [BookA, BookB]`는 본문이 두 책에 **동등한 가중치로 통합 적용됨**을 선언한다. 차등 평가가 의도된 경우 발신자가 별개의 Reaction으로 분리하여 발행해야 한다(MUST). 다중 about에 차등 평가를 욱여넣은 페이로드는 비준수(non-conformant)이며, 수신 시스템이 어떻게 처리하든 사양은 책임지지 않는다.

#### 전체 예시 A — 개인 독자가 모바일 앱에서 작성

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "reactionType": "Response",
  "name": "오랜만에 다시 읽은 1984",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "text": "오늘 1984를 다 읽었다. 마지막 장면이 인상적이었다.",
  "creator": [{ "@type": "Person", "name": "김독자" }],
  "dateCreated": "2026-04-15T22:30:00+09:00",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "inLanguage": ["ko"],
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "lib:rating", "value": 5 }
  ]
}
```

#### 전체 예시 B — 도서관 단순 등재 (본문 없음)

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://library.example.kr/reactions/2026/r-9182",
  "reactionType": "Listing",
  "name": "사서추천도서 2026년 4월",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "text": "",
  "creator": [
    {
      "@type": "Organization",
      "name": "국립중앙도서관",
      "@id": "https://www.nl.go.kr/"
    }
  ],
  "byline": "사서 서사",
  "dateCreated": "2026-04-15T10:00:00+09:00",
  "inLanguage": ["ko"],
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "nlk:recommendationProgram",
      "value": "사서추천도서 2026년 4월"
    }
  ]
}
```

#### 전체 예시 C — 학술 논문 리뷰

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://reviews.example.org/2026/review-3821",
  "reactionType": "Response",
  "name": "AI 안전성 논문에 대한 비평",
  "about": [
    { "@type": "ScholarlyArticle", "identifier": "https://doi.org/10.1038/s41586-021-03819-2" }
  ],
  "text": "# 서론\n\n본 논문은...",
  "textFormat": "text/markdown; variant=CommonMark",
  "creator": [
    {
      "@type": "Person",
      "name": "이연구",
      "@id": "https://orcid.org/0000-0002-1825-0097"
    }
  ],
  "dateCreated": "2026-03-10T14:00:00+09:00",
  "datePublished": "2026-03-15T09:00:00+09:00",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "inLanguage": ["ko"],
  "keywords": ["AI 안전성", "정렬"],
  "citation": [
    "https://example.org/related-work-1"
  ]
}
```

#### 전체 예시 D — 레거시 신문 서평 변환 (Role 사용)

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://archive.example.kr/legacy/news/1995-04-r-12",
  "reactionType": "Response",
  "name": "박완서의 나목을 읽고",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9788932910857" }],
  "text": "(원문 보존)",
  "creator": [
    {
      "@type": "Role",
      "roleName": "○○대 국어국문학과 교수",
      "startDate": "1995-03-01",
      "agent": { "@type": "Person", "name": "탐진우치" }
    }
  ],
  "byline": "탐진우치 (당시 ○○대 국어국문학과 교수)",
  "dateCreated": "1995-04-01T00:00:00+09:00",
  "inLanguage": ["ko"],
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "ops:dateCreatedPrecision", "value": "month" },
    { "@type": "PropertyValue", "name": "archive:source", "value": "○○일보 1995년 4월호" }
  ]
}
```

#### 전체 예시 E — 작성자 미상 레거시 데이터

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://archive.example.kr/legacy/anon/r-3001",
  "reactionType": "Response",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9788937462788" }],
  "text": "(원본에서 추출된 짧은 평문)",
  "creator": [{ "@type": "UnknownAgent", "name": "○○신문 익명 기고" }],
  "byline": "익명",
  "dateCreated": "1998-06-01T00:00:00+09:00",
  "inLanguage": ["ko"]
}
```

---

### 3.2 ReactionAbstract

`Reaction` 또는 코어 저작물에 대한 구조화된 요약.

#### 필수 필드

`@context`, `@type`, `@id`, `text` (minLength 1), `creator`, `dateCreated`, `isBasedOn`.

#### 선택 필드

`name`, `byline`, `textFormat`, `dateModified`, `datePublished`, `license`, `inLanguage`, `keywords`, `image`, `citation`, `additionalProperty`, 외부 RDF 어휘 키.

#### 전체 예시 — AI 생성 요약

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "ReactionAbstract",
  "@id": "urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "1984 서평 핵심 요약",
  "text": "본 서평은 신어(Newspeak)의 정치적 함의를 중심으로...",
  "creator": [
    {
      "@type": "SoftwareApplication",
      "name": "BRO Summarizer",
      "softwareVersion": "1.2.0",
      "@id": "https://schema.slat.or.kr/agents/bro-summarizer"
    }
  ],
  "dateCreated": "2026-04-15T22:35:00+09:00",
  "isBasedOn": [
    { "@type": "Reaction", "identifier": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7" }
  ],
  "inLanguage": ["ko"]
}
```

---

### 3.3 ReactionList

복수의 반응을 묶은 큐레이션 컨테이너.

#### 필수 필드

`@context`, `@type`, `@id`, `creator`, `itemListElement` (0–10000), `dateCreated`.

#### 선택 필드

`name`, `byline`, `dateModified`, `license`, `inLanguage`, `keywords`, `additionalProperty`, 외부 RDF 어휘 키.

#### 전체 예시

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "ReactionList",
  "@id": "https://library.example.kr/lists/2026-q1-dystopia",
  "name": "2026년 1분기 디스토피아 컬렉션",
  "creator": [
    {
      "@type": "Organization",
      "name": "국립중앙도서관 사서추천위원회",
      "@id": "https://www.nl.go.kr/"
    }
  ],
  "itemListElement": [
    { "@id": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7", "@type": "Reaction" },
    { "@id": "urn:uuid:9b2c5d4e-8f7a-4b3c-a1d2-3e4f5a6b7c8d", "@type": "Reaction" },
    { "@id": "urn:uuid:1a2b3c4d-5e6f-4789-9abc-def012345678", "@type": "ReactionAbstract" }
  ],
  "dateCreated": "2026-03-31T18:00:00+09:00",
  "inLanguage": ["ko"],
  "keywords": ["디스토피아", "큐레이션"],
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "list:visibility", "value": "public" }
  ]
}
```

---

## 4. 검증

### 4.1 JSON Schema (Python)

```python
import json, urllib.request
from jsonschema import Draft202012Validator

with urllib.request.urlopen("https://schema.slat.or.kr/bro/v1.0/schema.json") as r:
    schema = json.load(r)

validator = Draft202012Validator(schema)
errors = sorted(validator.iter_errors(payload), key=lambda e: tuple(e.path))
for e in errors:
    print(f"[INVALID] {'/'.join(map(str, e.path)) or '<root>'}: {e.message}")
```

### 4.2 JSON-LD 처리

JSON-LD 1.1 처리기는 컨텍스트를 fetch하여 인스턴스를 RDF 트리플로 확장한다. `creator`는 엔티티 타입에 따라 `schema:author` 또는 `schema:creator`로 자동 매핑된다. `reactionType`은 `@vocab` 규칙으로 `bro:Response`/`bro:Listing`/`bro:Unspecified`로 IRI 확장된다.

### 4.3 응용 계층 책임

- ISBN/ORCID 체크섬 검증
- 본문 첫 줄 프론트매터 검출
- IRI 디리퍼런스 가능성 확인
- 식별자 참조 무결성
- 본문 형식 추정 및 보안 정제 (HTML)
- 다중 about의 차등 평가 검출 (텍스트 마이닝 시)

---

## 5. 외부 표준과의 호환성

본 사양은 KOMARC, BIBFRAME, MODS, LOD/RDF 도구체인과 양방향 변환 가능하다. 본 절은 각 표준에 대한 매핑과 변환 절차를 명시한다.

### 5.1 KOMARC 520 필드 호환성

#### 5.1.1 KOMARC 520 필드

KOMARC(한국문헌자동화목록) 520 필드는 **요약, 주석, 또는 비평 정보**를 담는 가변 필드다. 한국 도서관계의 표준 어휘이며 다음 지시기호와 식별기호를 사용한다.

| 위치 | 의미 |
|---|---|
| 제1지시기호 | 표시 형식 (∅: 요약, 1: 비평, 2: 범위/내용, 3: 초록, 4: 내용 안내) |
| 제2지시기호 | 미정의 (블랭크) |
| ▾a | 요약, 주석 등 본문 |
| ▾b | 확장 요약 |
| ▾c | 정보 출처 |
| ▾u | URI |

#### 5.1.2 KOMARC 520 → BRO 변환

| KOMARC 520 제1지시기호 | BRO `reactionType` | BRO 엔티티 |
|---|---|---|
| ∅ (요약) | `Response` | `ReactionAbstract` |
| 1 (비평) | `Response` | `Reaction` |
| 2 (범위/내용) | `Response` | `ReactionAbstract` |
| 3 (초록) | `Response` | `ReactionAbstract` |
| 4 (내용 안내) | `Listing` | `Reaction` |

#### 매핑 규칙

| KOMARC | BRO |
|---|---|
| 본 레코드의 ISBN(020 ▾a) | `about[].identifier` (urn:isbn:형식으로 변환) |
| 520 ▾a 본문 | `text` |
| 520 ▾b 확장 | `text`에 본문 결합 또는 별도 ReactionAbstract 발행 |
| 520 ▾c 정보 출처 | `byline` 또는 `additionalProperty[komarc:source]` |
| 520 ▾u URI | `citation[]` |
| 008/35-37 언어 코드 | `inLanguage[]` |
| 040 ▾a 입력 기관 | `creator[].name` (Organization) |
| 005 최종처리일시 | `dateModified` |

#### 변환 예시

KOMARC 원본 (520 비평):
```
=520  1\$a오웰의 신어(Newspeak)는 단순한 언어가 아니다.$c김독자(국어국문학과 교수)$uhttps://example.org/full-review
=020  \\$a9780451524935
=040  \\$a한국비평학회
=008  ko
```

BRO 변환:
```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "urn:uuid:...",
  "reactionType": "Response",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "text": "오웰의 신어(Newspeak)는 단순한 언어가 아니다.",
  "creator": [{ "@type": "Organization", "name": "한국비평학회" }],
  "byline": "김독자(국어국문학과 교수)",
  "citation": ["https://example.org/full-review"],
  "dateCreated": "2026-01-01T00:00:00+09:00",
  "inLanguage": ["ko"],
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "komarc:520:ind1", "value": "1" }
  ]
}
```

#### BRO → KOMARC 520 역변환

| BRO | KOMARC |
|---|---|
| `reactionType` | 520 제1지시기호 (`Response`→1, `Listing`→4, `Unspecified`→∅) |
| `text` | 520 ▾a |
| `byline` | 520 ▾c |
| `citation[]` | 520 ▾u (각 URI당 별도 520 필드) |
| `creator[].name` (Organization) | 040 ▾a |
| `about[].identifier` (urn:isbn:) | 020 ▾a |
| `inLanguage[0]` | 008/35-37 |
| `dateModified` | 005 |

#### 손실 매핑 주의

`Reaction.additionalProperty[]`의 `lib:rating` 등 도메인 메타데이터는 KOMARC 520에 직접 매핑되지 않는다. 보존이 필요한 경우 KOMARC 9XX 지역 필드 사용을 권고한다.

---

### 5.2 BIBFRAME 호환성

#### 5.2.1 BIBFRAME 모델

BIBFRAME 2.0은 미국 의회도서관(LC)이 MARC를 대체하기 위해 발행한 RDF 어휘로, 다음 3계층을 가진다.

- `bf:Work` — 추상적 저작
- `bf:Instance` — 물리적/디지털 구현
- `bf:Item` — 단일 사본

리뷰·요약 정보는 `bf:Annotation` 또는 `bf:Work.summary` 속성으로 표현된다.

#### 5.2.2 BIBFRAME → BRO 변환

| BIBFRAME | BRO |
|---|---|
| `bf:Work` (리뷰 대상) | `about[]` |
| `bf:Annotation` (리뷰 내용) | `Reaction` 또는 `ReactionAbstract` |
| `bf:annotates` (대상 저작) | `about[].identifier` |
| `bf:annotationBody` | `text` |
| `bf:annotator` | `creator[]` |
| `bf:assertionDate` | `dateCreated` |
| `bf:Summary` | `ReactionAbstract` |

#### 변환 예시

BIBFRAME 원본 (Turtle):
```turtle
@prefix bf: <http://id.loc.gov/ontologies/bibframe/> .

<https://example.org/annotation/r-001> a bf:Annotation ;
    bf:annotates <https://example.org/work/1984> ;
    bf:annotationBody "오웰의 신어는 단순한 언어가 아니다." ;
    bf:annotator <https://example.org/person/dokja> ;
    bf:assertionDate "2026-04-15"^^xsd:date .

<https://example.org/work/1984> a bf:Work ;
    bf:identifiedBy [ a bf:Isbn ; rdf:value "9780451524935" ] .
```

BRO 변환:
```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://example.org/annotation/r-001",
  "reactionType": "Response",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "text": "오웰의 신어는 단순한 언어가 아니다.",
  "creator": [
    {
      "@type": "Person",
      "name": "Dokja",
      "@id": "https://example.org/person/dokja"
    }
  ],
  "dateCreated": "2026-04-15T00:00:00+00:00",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "bf:annotates",
      "propertyID": "http://id.loc.gov/ontologies/bibframe/annotates",
      "value": "https://example.org/work/1984"
    }
  ]
}
```

#### BRO → BIBFRAME 역변환

각 `Reaction`을 `bf:Annotation`으로, `ReactionAbstract`를 `bf:Summary`로 매핑한다. `about[].identifier`는 `bf:annotates`의 IRI로 변환되며, ISBN URN은 `bf:Work` 노드의 `bf:identifiedBy [ bf:Isbn ]` 구조로 풀어낸다.

#### 보존 손실

BIBFRAME은 `reactionType` 어휘를 갖지 않는다. BRO → BIBFRAME 변환 시 `reactionType`을 BIBFRAME의 추가 어휘(`bf:noteType` 또는 `dcterms:type`)로 매핑할 것을 **RECOMMENDED**.

---

### 5.3 LOD (Linked Open Data) 호환성

#### 5.3.1 일반 RDF/SPARQL 호환성

본 사양 인스턴스는 JSON-LD 1.1 처리기로 RDF 트리플로 직접 확장된다. 주요 트리플:

```turtle
<reactionId> a bro:Reaction ;
    bro:reactionType bro:Response ;
    schema:about <bookId> ;
    schema:text "..." ;
    schema:author <personId> ;
    schema:dateCreated "..."^^xsd:dateTime .

bro:Reaction rdfs:subClassOf schema:CreativeWork .
```

`bro:` 어휘는 `schema:` 어휘로 점진적으로 매핑되어 있어 SPARQL 질의에서 `?x a schema:CreativeWork` 같은 상위 클래스 질의로도 BRO 인스턴스를 회수할 수 있다.

#### 5.3.2 SPARQL 질의 예시

```sparql
PREFIX schema: <https://schema.org/>
PREFIX bro:    <https://schema.slat.or.kr/bro/v1.0/vocab#>

# 특정 ISBN에 대한 모든 응답
SELECT ?reaction ?text ?author WHERE {
  ?reaction a bro:Reaction ;
            bro:reactionType bro:Response ;
            schema:about ?book ;
            schema:text ?text ;
            schema:author ?author .
  ?book schema:identifier <urn:isbn:9780451524935> .
}

# 미상 작성자 응답 집계
SELECT (COUNT(?reaction) AS ?count) WHERE {
  ?reaction a bro:Reaction ;
            schema:author ?agent .
  ?agent a bro:UnknownAgent .
}

# Reaction과 그 요약 조인
SELECT ?reaction ?abstract WHERE {
  ?abstract a bro:ReactionAbstract ;
            schema:isBasedOn ?reaction .
  ?reaction a bro:Reaction .
}
```

#### 5.3.3 어휘 점진 매핑

본 사양의 `bro:` 어휘 문서는 다음 RDF 진술을 발행한다.

```turtle
@prefix bro:    <https://schema.slat.or.kr/bro/v1.0/vocab#> .
@prefix schema: <https://schema.org/> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .

bro:Reaction         rdfs:subClassOf schema:CreativeWork .
bro:ReactionAbstract rdfs:subClassOf schema:CreativeWork .
bro:ReactionList     rdfs:subClassOf schema:ItemList .
bro:UnknownAgent     rdfs:subClassOf schema:Agent .
bro:byline           rdfs:subPropertyOf schema:creditText .
bro:reactionType     rdfs:subPropertyOf schema:additionalType .
```

#### 5.3.4 SHACL/ShEx 검증

LOD 환경에서 BRO 인스턴스를 검증하려면 별도의 SHACL Shapes를 정의해야 한다. 본 사양은 SHACL 정의를 v1.0 시점에서 발행하지 않으나, JSON Schema 정의가 SHACL로 자동 변환 가능한 도구체인이 존재한다(`json-schema-to-shacl` 등).

---

### 5.4 MODS (Metadata Object Description Schema) 호환성

#### 5.4.1 MODS 모델

MODS는 미국 의회도서관이 발행한 XML 기반 서지 메타데이터 표준이다. 리뷰·요약은 `<mods:abstract>`, `<mods:note>`, `<mods:tableOfContents>` 요소로 표현된다.

#### 5.4.2 MODS → BRO 매핑

| MODS 요소 | BRO |
|---|---|
| `<mods:abstract>` | `ReactionAbstract.text` |
| `<mods:note type="content">` | `Reaction(reactionType=Listing).text` |
| `<mods:note type="review">` | `Reaction(reactionType=Response).text` |
| `<mods:identifier type="isbn">` | `about[].identifier` (urn:isbn:로 변환) |
| `<mods:name><mods:displayForm>` | `byline` 또는 `creator[].name` |
| `<mods:language><mods:languageTerm>` | `inLanguage[]` |
| `<mods:dateIssued>` | `datePublished` |
| `<mods:recordChangeDate>` | `dateModified` |

#### 변환 예시

MODS 원본:
```xml
<mods:mods version="3.7">
  <mods:identifier type="isbn">9780451524935</mods:identifier>
  <mods:abstract lang="ko">
    오웰의 신어(Newspeak)는 단순한 언어가 아니다.
  </mods:abstract>
  <mods:name type="personal">
    <mods:namePart>김독자</mods:namePart>
    <mods:role>
      <mods:roleTerm type="text">reviewer</mods:roleTerm>
    </mods:role>
  </mods:name>
  <mods:dateIssued>2026-04-15</mods:dateIssued>
  <mods:language>
    <mods:languageTerm authority="iso639-2b">kor</mods:languageTerm>
  </mods:language>
</mods:mods>
```

BRO 변환:
```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "ReactionAbstract",
  "@id": "urn:uuid:...",
  "text": "오웰의 신어(Newspeak)는 단순한 언어가 아니다.",
  "creator": [{ "@type": "Person", "name": "김독자" }],
  "dateCreated": "2026-04-15T00:00:00+00:00",
  "datePublished": "2026-04-15T00:00:00+00:00",
  "isBasedOn": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "inLanguage": ["ko"]
}
```

#### BRO → MODS 역변환

각 BRO 엔티티는 단일 MODS 레코드 또는 MODS 노트 요소로 변환된다. `reactionType`에 따라 `<mods:note type="...">` 또는 `<mods:abstract>` 요소가 선택된다. BRO의 `Role`은 MODS `<mods:role>` 어휘로 매핑된다.

#### 언어 코드 변환

MODS는 ISO 639-2/B 3자 코드를 권장하는 반면 BRO는 BCP 47을 사용한다. 변환 시 매핑 테이블이 필요하다 (`kor` ↔ `ko`, `eng` ↔ `en` 등).

---

### 5.5 변환 도구 권고

본 사양은 v1.0 발행 시점에서 변환 도구를 직접 발행하지 않는다. 다음 오픈소스 라이브러리 사용을 **RECOMMENDED**.

| 변환 방향 | 권장 도구 |
|---|---|
| KOMARC ↔ BRO | `pymarc` 라이브러리 + 커스텀 매핑 스크립트 |
| BIBFRAME ↔ BRO | `bibframe2marc` (LC 발행) + JSON-LD 후처리 |
| LOD/RDF ↔ BRO | `pyld`, `rdflib` |
| MODS ↔ BRO | `lxml` + XSLT 변환 시트 |

매핑 가이드라인은 본 사양 §5.1–§5.4를 따른다.

---

## 6. 부록 A — 정규식 요약

```
entity IRI (UUID)  : ^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$
entity IRI (HTTPS) : ^https://(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:/[^\s<>"\\^`{|}]*)?$
agent IRI (mailto) : ^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$
ISBN URN           : ^urn:isbn:(?:97[89][0-9]{10}|97[89](?:-[0-9]+){1,4}|[0-9]{9}[0-9Xx]|[0-9]+(?:-[0-9]+){1,4}-?[0-9Xx])$
DOI HTTPS          : ^https://doi\.org/10(?:\.[0-9]{4,9})?/[\x21-\x7e]+$
ORCID HTTPS        : ^https://orcid\.org/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$
RFC 3339 dateTime  : ^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])T(?:[01][0-9]|2[0-3]):[0-5][0-9]:(?:[0-5][0-9]|60)(?:\.[0-9]+)?(?:Z|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])$
RFC 3339 fullDate  : ^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$
BCP 47 tag         : ^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{1,8})*$
extension key      : ^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$
MIME type          : ^[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}/[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}(?:\s*;\s*[a-zA-Z0-9!#$&^_.+-]+=(?:[a-zA-Z0-9!#$&^_.+-]+|"[^"]*"))*$
```

## 7. 부록 B — 컨텍스트 발행 권고

- `Content-Type: application/ld+json; charset=utf-8`
- `Cache-Control: public, max-age=31536000, immutable`
- `Access-Control-Allow-Origin: *`
- gzip/brotli 압축 지원
- HTTPS 강제, HTTP 요청 시 308 리다이렉트

## 8. 부록 C — 어휘 IRI 진술 (bro:vocab#)

```turtle
@prefix bro:    <https://schema.slat.or.kr/bro/v1.0/vocab#> .
@prefix schema: <https://schema.org/> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .

bro:Reaction         a rdfs:Class ; rdfs:subClassOf schema:CreativeWork .
bro:ReactionAbstract a rdfs:Class ; rdfs:subClassOf schema:CreativeWork .
bro:ReactionList     a rdfs:Class ; rdfs:subClassOf schema:ItemList .
bro:UnknownAgent     a rdfs:Class ; rdfs:subClassOf schema:Agent ;
                     rdfs:comment "Explicit declaration that the publisher cannot identify the agent. Each instance is a fresh blank node by design; no global singleton." .

bro:reactionType a rdf:Property ; rdfs:subPropertyOf schema:additionalType .
bro:Response     a bro:ReactionType .
bro:Listing      a bro:ReactionType .
bro:Unspecified  a bro:ReactionType .

bro:byline a rdf:Property ; rdfs:subPropertyOf schema:creditText .
```

## 9. 라이선스 및 거버넌스

- 명세 문서, JSON Schema, JSON-LD 컨텍스트, 어휘 IRI 진술: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- 발행 주체: SLAT
- 변경 제안 및 이슈: 발행 주체의 공식 채널

## 10. 변경 이력

- v1.0 (2026): 초기 발행
````
