#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

function parseArgs(argv) {
  const options = {
    cacheDir: undefined,
    cwd: process.cwd(),
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--cwd" || arg === "--cache-dir") {
      const next = argv[index + 1];
      if (next == null) {
        throw new Error(`${arg} requires a path`);
      }
      options[arg === "--cwd" ? "cwd" : "cacheDir"] = next;
      index += 1;
      continue;
    }

    if (arg.startsWith("--cwd=")) {
      options.cwd = arg.slice("--cwd=".length);
      continue;
    }

    if (arg.startsWith("--cache-dir=")) {
      options.cacheDir = arg.slice("--cache-dir=".length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    ...options,
    cacheDir: options.cacheDir == null ? getBunCacheDir() : resolve(options.cacheDir),
    cwd: resolve(options.cwd),
  };
}

function getBunCacheDir() {
  return resolve(execFileSync("bun", ["pm", "cache"], { encoding: "utf8" }).trim());
}

function getPatchedDependencies(packageJsonPath) {
  const targetPackage = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const patchedDependencies = targetPackage.patchedDependencies ?? {};

  if (typeof patchedDependencies !== "object" || Array.isArray(patchedDependencies)) {
    throw new Error("patchedDependencies must be an object when provided");
  }

  return Object.keys(patchedDependencies).sort((left, right) => left.localeCompare(right));
}

function findPatchCacheEntries(cacheDir, patchedDependency) {
  const entryPrefix = join(cacheDir, `${patchedDependency}@@@`);
  const entryDir = dirname(entryPrefix);
  const entryNamePrefix = entryPrefix.slice(entryDir.length + 1);

  if (!existsSync(entryDir)) {
    return [];
  }

  return readdirSync(entryDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        entry.name.startsWith(entryNamePrefix) &&
        entry.name.includes("_patch_hash="),
    )
    .map((entry) => join(entryDir, entry.name));
}

const options = parseArgs(process.argv.slice(2));
const packageJsonPath = resolve(options.cwd, "package.json");

if (!existsSync(packageJsonPath)) {
  throw new Error(`No package.json found at ${packageJsonPath}`);
}

const patchedDependencies = getPatchedDependencies(packageJsonPath);
const cacheEntries = patchedDependencies.flatMap((patchedDependency) =>
  findPatchCacheEntries(options.cacheDir, patchedDependency),
);

if (cacheEntries.length === 0) {
  console.log(`No Bun patch cache entries found for ${patchedDependencies.length} patched dependencies.`);
  process.exit(0);
}

for (const cacheEntry of cacheEntries) {
  console.log(`${options.dryRun ? "Would remove" : "Removed"} ${cacheEntry}`);
  if (!options.dryRun) {
    rmSync(cacheEntry, { force: true, recursive: true });
  }
}

console.log(
  `${options.dryRun ? "Would remove" : "Removed"} ${cacheEntries.length} Bun patch cache entr${
    cacheEntries.length === 1 ? "y" : "ies"
  }.`,
);
