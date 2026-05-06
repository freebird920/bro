import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function build() {
  const distDir = path.resolve("dist-frontmatter");

  console.log("1. Building BRO markdown renderer package...");
  execSync("pnpm exec tsup src/lib/markdown-renderer.ts --format cjs,esm --dts --outDir dist-frontmatter --clean --tsconfig tsconfig.app.json", {
    stdio: "inherit",
  });

  console.log("2. Generating package.json for markdown renderer publish...");
  const rootPackageJson = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf8"));
  const publishPackageJson = {
    name: "@slat.or.kr/bro-markdown-renderer",
    version: rootPackageJson.version,
    main: "./markdown-renderer.cjs",
    module: "./markdown-renderer.js",
    types: "./markdown-renderer.d.ts",
    exports: {
      ".": {
        require: "./markdown-renderer.cjs",
        import: "./markdown-renderer.js",
        types: "./markdown-renderer.d.ts",
      },
    },
  };

  fs.writeFileSync(path.join(distDir, "package.json"), JSON.stringify(publishPackageJson, null, 2));
  console.log("Build complete. You can publish from /dist-frontmatter.");
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
