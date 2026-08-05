#!/usr/bin/env node

import { copyFile, mkdir } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { loadConfig, readFlag, repositoryRoot } from "./lib/config.mjs";
import { generateProfileReadme } from "./lib/readme.mjs";

const source = readFlag("--source");
if (!source) {
  console.error("Usage: npm run generate -- --source /absolute/path/to/portrait.jpg");
  process.exit(1);
}

try {
  const config = await loadConfig(readFlag("--config"));
  const sourcePath = resolve(source);
  const portraitRelativePath = `assets/portrait${extname(sourcePath)}`;
  await mkdir(resolve(repositoryRoot, "assets"), { recursive: true });
  await copyFile(sourcePath, resolve(repositoryRoot, portraitRelativePath));
  await generateProfileReadme({ config, portraitPath: portraitRelativePath, readmePath: resolve(repositoryRoot, "README.md") });
  console.log(`Profile generated successfully with plain portrait at ${portraitRelativePath}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
