#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "../..");
const sourcePackageDir = path.join(repoRoot, "packages", "rn-ui-kit");
const rootPackage = readJson(path.join(repoRoot, "package.json"));
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

function validateVersion() {
  if (rootPackage.version !== sourcePackage.version) {
    throw new Error(
      `Version mismatch: root=${rootPackage.version}, ` +
        `${sourcePackage.name}=${sourcePackage.version}. ` +
        "Run: bun run set-version <version>",
    );
  }
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
    ".": releaseEntry("index"),
    "./core": releaseEntry("core"),
    "./debug": releaseEntry("debug"),
    "./initialize": releaseEntry("initialize"),
    "./package.json": "./package.json",
  };
  manifest.files = ["dist", "src", "patches", "scripts", "README.md", "LICENSE"];
  manifest.scripts = {
    "sync-patches": sourcePackage.scripts?.["sync-patches"] ?? "bun scripts/sync-patches.mjs",
  };
  delete manifest.devDependencies;

  return manifest;
}

function copyReleaseFiles() {
  for (const fileName of ["README.md", "LICENSE"]) {
    fs.copyFileSync(path.join(sourcePackageDir, fileName), path.join(packageDir, fileName));
  }

  for (const directoryName of ["src", "patches", "scripts"]) {
    const sourcePath = path.join(sourcePackageDir, directoryName);
    if (fs.existsSync(sourcePath)) {
      fs.cpSync(sourcePath, path.join(packageDir, directoryName), {
        recursive: true,
      });
    }
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
}

function main() {
  validateVersion();
  clearDirectory(packageDir);
  writeJson(path.join(packageDir, "package.json"), createReleaseManifest());
  copyReleaseFiles();
  compile();
  pack();
  console.log(`Package directory: ${packageDir}`);
  console.log(`Tarball: ${tarballPath}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
