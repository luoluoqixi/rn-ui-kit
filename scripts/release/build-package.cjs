#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { validateReleasePackage, validatePackedContents } = require("./validate-package.cjs");
const { withReleaseLock } = require("./release-lock.cjs");

const repoRoot = path.resolve(__dirname, "../..");
const sourcePackageDir = repoRoot;
const sourcePackage = readJson(path.join(sourcePackageDir, "package.json"));
const releaseName = `${sourcePackage.name}-${sourcePackage.version}`;
const distDir = path.join(repoRoot, "dist");
const packageDir = path.join(distDir, `${releaseName}-package`);
const tarballPath = path.join(distDir, `${releaseName}.tgz`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function run(command, args, cwd = repoRoot) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")}`);
}

function assertInDist(targetPath) {
  const relativePath = path.relative(path.resolve(distDir), path.resolve(targetPath));

  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Refusing to modify a path outside dist: ${targetPath}`);
  }
}

function clearDirectory(targetPath) {
  assertInDist(targetPath);
  fs.rmSync(targetPath, { recursive: true, force: true });
  fs.mkdirSync(targetPath, { recursive: true });
}

function releaseEntry(baseName) {
  return {
    "types": `./dist/${baseName}.d.ts`,
    "react-native": `./src/${baseName}.ts`,
    "default": `./dist/${baseName}.js`,
  };
}

function createReleaseManifest() {
  const manifest = { ...sourcePackage };

  manifest.main = "./dist/index.js";
  manifest["react-native"] = "./src/index.ts";
  manifest.types = "./dist/index.d.ts";
  manifest.exports = {
    ...sourcePackage.exports,
    ".": releaseEntry("index"),
    "./core": releaseEntry("core"),
    "./debug": releaseEntry("debug"),
    "./initialize": releaseEntry("initialize"),
    "./styles.css": "./src/styles.css",
    "./package.json": "./package.json",
  };
  manifest.files = [...sourcePackage.files];
  manifest.scripts = {
    "sync-patches": sourcePackage.scripts?.["sync-patches"] ?? "bun scripts/sync-patches.mjs",
  };
  delete manifest.devDependencies;

  return manifest;
}

function copyReleaseFiles() {
  // 发布清单只维护一份；dist 由后续编译生成，其余条目必须真实存在。
  for (const entry of sourcePackage.files) {
    if (entry === "dist") continue;
    const sourcePath = path.resolve(sourcePackageDir, entry);
    const relativePath = path.relative(sourcePackageDir, sourcePath);
    if (
      !relativePath ||
      relativePath.startsWith("..") ||
      path.isAbsolute(relativePath) ||
      /[*?{}[\]]/.test(entry)
    ) {
      throw new Error(`Release files must use literal paths within the package: ${entry}`);
    }
    if (!fs.existsSync(sourcePath)) throw new Error(`Release file is missing: ${entry}`);
    const targetPath = path.join(packageDir, entry);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.cpSync(sourcePath, targetPath, { recursive: true });
  }
}

function compile() {
  const tscPath = require.resolve("typescript/bin/tsc", {
    paths: [repoRoot],
  });

  run(process.execPath, [
    tscPath,
    "-p",
    path.join(sourcePackageDir, "tsconfig.build.json"),
    "--outDir",
    path.join(packageDir, "dist"),
    "--pretty",
    "false",
  ]);
}

function pack() {
  if (fs.existsSync(tarballPath)) {
    assertInDist(tarballPath);
    fs.rmSync(tarballPath, { force: true });
  }

  const npmArgs = [
    "pack",
    "--pack-destination",
    distDir,
    "--ignore-scripts",
    "--loglevel=error",
    "--cache",
    path.join(distDir, ".npm-cache"),
  ];
  const npmPs1Path = path.join(path.dirname(process.execPath), "npm.ps1");

  if (process.platform === "win32" && fs.existsSync(npmPs1Path)) {
    run(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", npmPs1Path, ...npmArgs],
      packageDir,
    );
  } else {
    run("npm", npmArgs, packageDir);
  }

  if (!fs.existsSync(tarballPath)) {
    throw new Error(`Tarball not found: ${tarballPath}`);
  }

  // npm 的嵌套 .npmignore 仍可能裁掉暂存目录内的文件，必须校验最终 tgz。
  const verificationDir = path.join(distDir, `${releaseName}-verify`);
  clearDirectory(verificationDir);
  try {
    run("tar", ["-xzf", tarballPath, "-C", verificationDir]);
    validateReleasePackage(path.join(verificationDir, "package"));
    validatePackedContents(packageDir, path.join(verificationDir, "package"));
  } finally {
    fs.rmSync(verificationDir, { recursive: true, force: true });
  }
}

function main() {
  clearDirectory(packageDir);
  writeJson(path.join(packageDir, "package.json"), createReleaseManifest());
  copyReleaseFiles();
  compile();
  validateReleasePackage(packageDir);
  pack();
  console.log(`Package directory: ${packageDir}`);
  console.log(`Tarball: ${tarballPath}`);
}

try {
  withReleaseLock(repoRoot, main, process.env.RN_UI_KIT_RELEASE_LOCK_TOKEN);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
