#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const { existsSync, readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const projectRoot = resolve(__dirname, "..");
const packageJsonPaths = [
  "package.json",
  "packages/rn-ui-kit/package.json",
  "examples/app/package.json",
];
const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

function printUsage() {
  console.log("用法: bun run set-version <version>");
  console.log("示例: bun run set-version 1.2.3");
}

function fail(message) {
  console.error(`错误: ${message}`);
  printUsage();
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  printUsage();
  process.exit(0);
}

if (args.length !== 1) {
  fail("请传入且仅传入一个版本号。");
}

const version = args[0].startsWith("v") ? args[0].slice(1) : args[0];

if (!semverPattern.test(version)) {
  fail(`版本号 "${args[0]}" 不是有效的 SemVer。`);
}

const originalFiles = new Map();
const changedPackageJsonPaths = [];

for (const relativePath of packageJsonPaths) {
  const absolutePath = resolve(projectRoot, relativePath);

  if (!existsSync(absolutePath)) {
    fail(`找不到 ${relativePath}。`);
  }

  const originalContent = readFileSync(absolutePath, "utf8");
  const packageJson = JSON.parse(originalContent);
  originalFiles.set(absolutePath, originalContent);

  if (packageJson.version === version) {
    continue;
  }

  packageJson.version = version;
  writeFileSync(absolutePath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");
  changedPackageJsonPaths.push(relativePath);
}

if (changedPackageJsonPaths.length > 0) {
  const lockfilePath = resolve(projectRoot, "bun.lock");

  if (existsSync(lockfilePath)) {
    originalFiles.set(lockfilePath, readFileSync(lockfilePath, "utf8"));
  }

  console.log(`已将工程版本更新为 ${version}：`);
  for (const relativePath of changedPackageJsonPaths) {
    console.log(`  - ${relativePath}`);
  }

  console.log("\n正在同步 bun.lock...");
  const bunCommand = process.platform === "win32" ? "bun.exe" : "bun";
  const lockfileResult = spawnSync(bunCommand, ["install", "--lockfile-only"], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  if (lockfileResult.status !== 0) {
    for (const [absolutePath, originalContent] of originalFiles) {
      writeFileSync(absolutePath, originalContent, "utf8");
    }

    fail("bun.lock 同步失败，已恢复版本文件。");
  }
} else {
  console.log(`工程当前已经是 ${version}，无需修改版本文件。`);
}

const tag = `v${version}`;

console.log("\n可手动执行以下命令：");
console.log("git add .");
console.log(`git commit -S -m "release: ${version}"`);
console.log(`git tag -a ${tag} -m "${tag}"`);
console.log(`git push origin ${tag}`);
