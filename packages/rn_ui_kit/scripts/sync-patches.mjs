#!/usr/bin/env node

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const uiPatches = [
  ["@expo/ui@55.0.17", "@expo+ui@55.0.17.patch"],
  ["@gorhom/bottom-sheet@5.2.14", "@gorhom+bottom-sheet@5.2.14.patch"],
  [
    "@lodev09/react-native-true-sheet@3.11.1",
    "@lodev09+react-native-true-sheet@3.11.1.patch",
  ],
  ["@react-native-picker/picker@2.11.4", "@react-native-picker+picker@2.11.4.patch"],
  ["@tamagui/create-menu@2.4.0", "@tamagui+create-menu@2.4.0.patch"],
  ["@tamagui/dialog@2.4.0", "@tamagui+dialog@2.4.0.patch"],
  ["@tamagui/native@2.4.0", "@tamagui+native@2.4.0.patch"],
  ["@tamagui/portal@2.4.0", "@tamagui+portal@2.4.0.patch"],
  ["@tamagui/toast@2.4.0", "@tamagui+toast@2.4.0.patch"],
  ["@tamagui/web@2.4.0", "@tamagui+web@2.4.0.patch"],
  ["expo-haptics@55.0.14", "expo-haptics@55.0.14.patch"],
  ["react-native-reanimated@4.3.0", "react-native-reanimated@4.3.0.patch"],
  ["zeego@3.0.6", "zeego@3.0.6.patch"],
];

function parseArgs(argv) {
  const options = {
    copy: true,
    cwd: process.cwd(),
    pathRoot: process.cwd(),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

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

  return {
    ...options,
    cwd: resolve(options.cwd),
    pathRoot: resolve(options.pathRoot),
  };
}

function toPackageJsonPath(fromCwd, filePath) {
  return relative(fromCwd, filePath).replace(/\\/g, "/");
}

function sortObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)));
}

const options = parseArgs(process.argv.slice(2));
const packageJsonPath = resolve(options.cwd, "package.json");

if (!existsSync(packageJsonPath)) {
  throw new Error(`No package.json found at ${packageJsonPath}`);
}

const targetPackage = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const targetPatchDir = resolve(options.cwd, "patches");

if (options.copy) {
  mkdirSync(targetPatchDir, { recursive: true });
}

const patchedDependencies = {
  ...(targetPackage.patchedDependencies ?? {}),
};

for (const [dependency, patchFile] of uiPatches) {
  const sourcePath = resolve(packageRoot, "patches", patchFile);
  const targetPath = join(targetPatchDir, patchFile);

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing source patch: ${sourcePath}`);
  }

  if (options.copy) {
    const sourceRealPath = realpathSync(sourcePath);
    const targetRealPath = existsSync(targetPath) ? realpathSync(targetPath) : targetPath;
    if (sourceRealPath !== targetRealPath) {
      copyFileSync(sourcePath, targetPath);
    }
  }

  patchedDependencies[dependency] = toPackageJsonPath(options.pathRoot, targetPath);
}

targetPackage.patchedDependencies = sortObject(patchedDependencies);

writeFileSync(packageJsonPath, `${JSON.stringify(targetPackage, null, 2)}\n`);

console.log(
  `Synced ${uiPatches.length} rn_ui_kit patches into ${toPackageJsonPath(
    process.cwd(),
    packageJsonPath,
  )}`,
);
