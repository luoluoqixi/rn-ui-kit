const fs = require("node:fs");
const path = require("node:path");

/** 在暂存目录和解包后的产物上使用同一套入口校验，避免只验证源码。 */
function validateReleasePackage(packageDir) {
  const manifest = JSON.parse(fs.readFileSync(path.join(packageDir, "package.json"), "utf8"));
  for (const name of ["src", "dist"]) {
    if (!fs.existsSync(path.join(packageDir, name))) {
      throw new Error(`Release package is missing required directory: ${name}`);
    }
  }

  for (const entry of ["index", "core", "debug", "initialize"]) {
    const name = entry === "index" ? "." : `./${entry}`;
    const expected = `./src/${entry}.ts`;
    if (manifest.exports?.[name]?.["react-native"] !== expected) {
      throw new Error(`Unexpected react-native entry for ${name}`);
    }
  }
  if (manifest["react-native"] !== "./src/index.ts") {
    throw new Error("Unexpected top-level react-native entry");
  }
  if (manifest.exports?.["./styles.css"] !== "./src/styles.css") {
    throw new Error("Unexpected styles export");
  }
  if (
    manifest.exports?.["./metro"]?.default !== "./scripts/metro/heroui.cjs" ||
    manifest.exports?.["./metro"]?.types !== "./scripts/metro/heroui.d.cts"
  ) {
    throw new Error("Unexpected Metro export");
  }

  function validateTargets(value, label) {
    if (value == null) return;
    if (typeof value === "object") {
      for (const [key, target] of Object.entries(value)) validateTargets(target, `${label}.${key}`);
      return;
    }
    if (typeof value !== "string") throw new Error(`Invalid package target: ${label}`);
    const target = path.resolve(packageDir, value);
    const relative = path.relative(path.resolve(packageDir), target);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error(`Package target escapes package: ${label} -> ${value}`);
    }
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      throw new Error(`Release package target is missing: ${label} -> ${value}`);
    }
  }

  validateTargets(manifest.exports, "exports");
  validateTargets(manifest.bin, "bin");
  for (const name of ["main", "types", "react-native"]) validateTargets(manifest[name], name);
  return manifest;
}

/** npm 可过滤控制文件，但不得丢失或更改暂存目录中的任何实际发布文件。 */
function validatePackedContents(stagedDir, packedDir) {
  const controlFiles = new Set([".npmignore", ".gitignore", ".DS_Store"]);
  function visit(relativeDir) {
    for (const entry of fs.readdirSync(path.join(stagedDir, relativeDir), {
      withFileTypes: true,
    })) {
      if (controlFiles.has(entry.name)) continue;
      const relative = path.join(relativeDir, entry.name);
      if (entry.isDirectory()) {
        visit(relative);
        continue;
      }
      if (!entry.isFile()) throw new Error(`Unsupported release file: ${relative}`);
      const packedFile = path.join(packedDir, relative);
      if (!fs.existsSync(packedFile) || !fs.statSync(packedFile).isFile())
        throw new Error(`Packed release file is missing: ${relative}`);
      if (!fs.readFileSync(path.join(stagedDir, relative)).equals(fs.readFileSync(packedFile)))
        throw new Error(`Packed release file differs from staged file: ${relative}`);
    }
  }
  visit("");
}

module.exports = { validateReleasePackage, validatePackedContents };
