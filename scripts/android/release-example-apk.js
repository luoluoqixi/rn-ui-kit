#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "../..");
const appDir = path.join(repoRoot, "examples", "app");
const androidDir = path.join(appDir, "android");
const sourceApkPath = path.join(
  androidDir,
  "app",
  "build",
  "outputs",
  "apk",
  "release",
  "app-release.apk",
);
const distDir = path.join(repoRoot, "dist");
const tagPattern =
  /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function fail(message) {
  throw new Error(message);
}

function parseOptions(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const upload = argv.includes("--upload");
  const positionalArgs = argv.filter((arg) => !arg.startsWith("-"));

  let tag;

  if (positionalArgs.length !== 1) {
    tag = `v${require("../../package.json").version}`;
  } else {
    tag = positionalArgs[0];
  }

  if (!tagPattern.test(tag)) {
    fail(`Invalid release tag "${tag}". Expected v<semver>.`);
  }

  return { tag, upload };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function run(command, args, cwd, env = process.env) {
  console.log(`\n> (${path.relative(repoRoot, cwd) || "."}) ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} exited with status ${result.status}.`);
  }
}

function validateVersion(tag) {
  const expectedVersion = tag.slice(1);
  const packagePaths = [
    path.join(repoRoot, "package.json"),
    path.join(repoRoot, "packages", "rn-ui-kit", "package.json"),
    path.join(appDir, "package.json"),
  ];

  for (const packagePath of packagePaths) {
    const actualVersion = readJson(packagePath).version;
    if (actualVersion !== expectedVersion) {
      fail(
        `Version mismatch in ${path.relative(repoRoot, packagePath)}: ` +
          `expected ${expectedVersion}, got ${actualVersion}.`,
      );
    }
  }
}

function buildApk() {
  const buildEnv = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "production",
  };

  run("bun", ["run", "prebuild:android"], appDir, buildEnv);

  const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
  // The workspace package lives outside examples/app, so Gradle does not track
  // all of its sources as bundle inputs. Force only the JS bundle task to run;
  // the task itself invokes Metro with --reset-cache.
  run(gradlew, ["createBundleReleaseJsAndAssets", "--rerun-tasks"], androidDir, buildEnv);
  run(gradlew, ["assembleRelease"], androidDir, buildEnv);

  if (!fs.existsSync(sourceApkPath)) {
    fail(`Android release APK was not found at ${sourceApkPath}.`);
  }
}

function copyApk(tag) {
  const artifactName = `rn-ui-kit-example-release-${tag}.apk`;
  const artifactPath = path.join(distDir, artifactName);

  fs.mkdirSync(distDir, { recursive: true });
  fs.copyFileSync(sourceApkPath, artifactPath);
  console.log(`\nAPK: ${artifactPath}`);

  return artifactPath;
}

function uploadApk(tag, artifactPath) {
  if (!process.env.GH_TOKEN) {
    fail("GH_TOKEN is required when --upload is used.");
  }

  run("gh", ["release", "upload", tag, artifactPath, "--clobber"], repoRoot);
  console.log(`Uploaded ${path.basename(artifactPath)} to GitHub release ${tag}.`);
}

function main() {
  const { tag, upload } = parseOptions(process.argv.slice(2));

  validateVersion(tag);
  buildApk();
  const artifactPath = copyApk(tag);

  if (upload) {
    uploadApk(tag, artifactPath);
  }
}

try {
  main();
} catch (error) {
  console.error(`\nAndroid release failed: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
