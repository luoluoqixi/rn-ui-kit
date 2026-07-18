#!/usr/bin/env node

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const patchDir = resolve(packageRoot, "patches");

function parseArgs(argv) {
  const options = {
    copy: true,
    cwd: process.cwd(),
    pathRoot: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--copy") {
      options.copy = true;
      continue;
    }

    if (arg === "--no-copy") {
      options.copy = false;
      continue;
    }

    if (arg === "--cwd") {
      const next = argv[index + 1];
      if (next == null) {
        throw new Error("--cwd requires a path");
      }
      options.cwd = next;
      index += 1;
      continue;
    }

    if (arg === "--path-root") {
      const next = argv[index + 1];
      if (next == null) {
        throw new Error("--path-root requires a path");
      }
      options.pathRoot = next;
      index += 1;
      continue;
    }

    if (arg.startsWith("--cwd=")) {
      options.cwd = arg.slice("--cwd=".length);
      continue;
    }

    if (arg.startsWith("--path-root=")) {
      options.pathRoot = arg.slice("--path-root=".length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  const cwd = resolve(options.cwd);

  return {
    ...options,
    cwd,
    pathRoot: options.pathRoot == null ? findPathRoot(cwd) : resolve(options.pathRoot),
  };
}

function findPathRoot(startDir) {
  let current = startDir;

  while (true) {
    if (existsSync(resolve(current, "bun.lock"))) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      return startDir;
    }

    current = parent;
  }
}

function toPackageJsonPath(fromCwd, filePath) {
  return relative(fromCwd, filePath).replace(/\\/g, "/");
}

function getPatchDependencies(excludedPatches) {
  return readdirSync(patchDir)
    .filter((fileName) => fileName.endsWith(".patch"))
    .map((patchFile) => [toPatchedDependencyName(patchFile), patchFile])
    .filter(([dependency]) => !excludedPatches.has(dependency))
    .sort(([left], [right]) => left.localeCompare(right));
}

function toPatchedDependencyName(patchFile) {
  const patchName = patchFile.slice(0, -".patch".length);

  if (!patchName.startsWith("@")) {
    return patchName;
  }

  return patchName.replace("+", "/");
}

function sortObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)));
}

function getExcludedPatches(targetPackage) {
  const config = targetPackage.rnUiKitSyncPatches;
  if (config == null) {
    return new Set();
  }

  if (typeof config !== "object" || Array.isArray(config)) {
    throw new Error("rnUiKitSyncPatches must be an object when provided");
  }

  const excludedPatches = config.exclude ?? [];
  if (!Array.isArray(excludedPatches) || !excludedPatches.every((value) => typeof value === "string")) {
    throw new Error("rnUiKitSyncPatches.exclude must be an array of patched dependency names");
  }

  return new Set(excludedPatches);
}

const options = parseArgs(process.argv.slice(2));
const packageJsonPath = resolve(options.cwd, "package.json");

if (!existsSync(packageJsonPath)) {
  throw new Error(`No package.json found at ${packageJsonPath}`);
}

const targetPackage = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const targetPatchDir = resolve(options.cwd, "patches");
const excludedPatches = getExcludedPatches(targetPackage);

if (options.copy) {
  mkdirSync(targetPatchDir, { recursive: true });
}

const patchedDependencies = {
  ...(targetPackage.patchedDependencies ?? {}),
};

const patchDependencies = getPatchDependencies(excludedPatches);

for (const [dependency, patchFile] of patchDependencies) {
  const sourcePath = resolve(patchDir, patchFile);

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing source patch: ${sourcePath}`);
  }

  const patchPath = options.copy ? join(targetPatchDir, patchFile) : sourcePath;

  if (options.copy && sourcePath !== patchPath) {
    copyFileSync(sourcePath, patchPath);
  }

  patchedDependencies[dependency] = toPackageJsonPath(options.pathRoot, patchPath);
}

targetPackage.patchedDependencies = sortObject(patchedDependencies);

writeFileSync(packageJsonPath, `${JSON.stringify(targetPackage, null, 2)}\n`);

console.log(
  `Synced ${patchDependencies.length} rn_ui_kit patches${
    excludedPatches.size ? ` (${excludedPatches.size} excluded)` : ""
  } into ${toPackageJsonPath(
    process.cwd(),
    packageJsonPath,
  )}`,
);
