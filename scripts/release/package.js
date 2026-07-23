#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "../..");
const packageJsonPath = path.join(repoRoot, "packages", "rn-ui-kit", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const packageName = packageJson.name;
const version = packageJson.version;
const branchName = `${packageName}-${version}`;
const distDir = path.join(repoRoot, "dist");
const tarballName = `${packageName}-${version}.tgz`;
const tarballPath = path.join(distDir, tarballName);
const releaseRepoDir = path.join(distDir, branchName);
const releaseExtractDir = path.join(distDir, `${branchName}-extract`);

function parseOptions(argv) {
  return {
    packOnly: argv.includes("--pack-only") || argv.includes("--no-commit"),
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")}`);
  }
}

function runCapture(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    throw new Error(stderr || `${command} ${args.join(" ")}`);
  }

  return (result.stdout || "").trim();
}

function tryRunCapture(command, args, options = {}) {
  try {
    return runCapture(command, args, options);
  } catch {
    return "";
  }
}

function currentBranch(cwd) {
  return tryRunCapture("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], {
    cwd,
  });
}

function branchExists(cwd, name) {
  const result = spawnSync("git", ["show-ref", "--verify", "--quiet", `refs/heads/${name}`], {
    cwd,
    stdio: "ignore",
    shell: false,
  });

  return result.status === 0;
}

function refExists(cwd, refName) {
  const result = spawnSync("git", ["show-ref", "--verify", "--quiet", refName], {
    cwd,
    stdio: "ignore",
    shell: false,
  });

  return result.status === 0;
}

function isAncestor(cwd, ancestorRef, descendantRef) {
  const result = spawnSync("git", ["merge-base", "--is-ancestor", ancestorRef, descendantRef], {
    cwd,
    stdio: "ignore",
    shell: false,
  });

  if (result.status === 0) {
    return true;
  }

  if (result.status === 1) {
    return false;
  }

  if (result.error) {
    throw result.error;
  }

  throw new Error(`git merge-base --is-ancestor ${ancestorRef} ${descendantRef} failed`);
}

function clearDirectory(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDirectoryContents(sourceDir, targetDir) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });
  }
}

function validateExtractedPackage(packageDir) {
  const manifestPath = path.join(packageDir, "package.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const requiredDirectories = ["src", "dist"];

  for (const directoryName of requiredDirectories) {
    if (!fs.existsSync(path.join(packageDir, directoryName))) {
      throw new Error(`Release package is missing required directory: ${directoryName}`);
    }
  }

  const expectedReactNativeEntries = {
    ".": "./src/index.ts",
    "./core": "./src/core.ts",
    "./debug": "./src/debug.ts",
    "./initialize": "./src/initialize.ts",
  };

  if (manifest["react-native"] !== expectedReactNativeEntries["."]) {
    throw new Error(`Unexpected top-level react-native entry: ${manifest["react-native"] || "(missing)"}`);
  }

  for (const [exportName, expectedEntry] of Object.entries(expectedReactNativeEntries)) {
    const actualEntry = manifest.exports?.[exportName]?.["react-native"];
    if (actualEntry !== expectedEntry) {
      throw new Error(`Unexpected react-native entry for ${exportName}: ${actualEntry || "(missing)"}`);
    }
  }
}

function ensureGitIdentity(cwd) {
  const userName = tryRunCapture("git", ["config", "user.name"], { cwd });
  const userEmail = tryRunCapture("git", ["config", "user.email"], { cwd });

  run("git", ["config", "user.name", userName || "release-bot"], { cwd });
  run("git", ["config", "user.email", userEmail || "release-bot@example.invalid"], { cwd });
}

function ensureGitRemote(cwd, remoteName, remoteUrl) {
  if (!remoteName || !remoteUrl) {
    return;
  }

  const existingRemoteUrl = tryRunCapture("git", ["remote", "get-url", remoteName], {
    cwd,
  });

  if (!existingRemoteUrl) {
    run("git", ["remote", "add", remoteName, remoteUrl], { cwd });
    return;
  }

  if (existingRemoteUrl !== remoteUrl) {
    run("git", ["remote", "set-url", remoteName, remoteUrl], { cwd });
  }
}

function fetchReleaseRef(cwd, remoteName) {
  const result = spawnSync(
    "git",
    [
      "fetch",
      "--prune",
      remoteName,
      `refs/heads/${branchName}:refs/remotes/${remoteName}/${branchName}`,
    ],
    {
      cwd,
      stdio: "ignore",
      shell: false,
    },
  );

  return result.status === 0;
}

function preferredPushRemoteUrl(remoteName) {
  if (!remoteName) {
    return "";
  }

  return tryRunCapture("git", ["remote", "get-url", remoteName]);
}

function ensureReleaseRepo() {
  const gitDirPath = path.join(releaseRepoDir, ".git");

  if (!fs.existsSync(releaseRepoDir)) {
    run("git", ["clone", "--no-local", repoRoot, releaseRepoDir], {
      cwd: distDir,
    });
  } else if (!fs.existsSync(gitDirPath)) {
    throw new Error(`Release repo directory exists but is not a git repository: ${releaseRepoDir}`);
  }

  ensureGitIdentity(releaseRepoDir);
}

function resolveReleaseBaseRef(publishRemoteName) {
  const localBaseRef = refExists(releaseRepoDir, `refs/remotes/origin/${branchName}`)
    ? `origin/${branchName}`
    : "";
  const publishBaseRef =
    publishRemoteName &&
    refExists(releaseRepoDir, `refs/remotes/${publishRemoteName}/${branchName}`)
      ? `${publishRemoteName}/${branchName}`
      : "";

  if (localBaseRef && publishBaseRef) {
    if (isAncestor(releaseRepoDir, publishBaseRef, localBaseRef)) {
      return localBaseRef;
    }

    return publishBaseRef;
  }

  if (localBaseRef) {
    return localBaseRef;
  }

  if (publishBaseRef) {
    return publishBaseRef;
  }

  if (branchExists(releaseRepoDir, branchName)) {
    return branchName;
  }

  return "";
}

function resetReleaseRepoBranch(baseRef) {
  const activeBranch = currentBranch(releaseRepoDir);

  if (activeBranch === branchName) {
    run("git", ["switch", "--detach"], { cwd: releaseRepoDir });
  }

  if (baseRef) {
    run("git", ["switch", "-C", branchName, baseRef], { cwd: releaseRepoDir });
  } else {
    if (branchExists(releaseRepoDir, branchName)) {
      run("git", ["branch", "-D", branchName], { cwd: releaseRepoDir });
    }

    run("git", ["switch", "--orphan", branchName], { cwd: releaseRepoDir });
  }

  run("git", ["rm", "-rf", ".", "--ignore-unmatch"], { cwd: releaseRepoDir });
  run("git", ["clean", "-fdx"], { cwd: releaseRepoDir });
}

function hasStagedChanges(cwd) {
  const result = spawnSync("git", ["diff", "--cached", "--quiet"], {
    cwd,
    stdio: "ignore",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status === 0) {
    return false;
  }

  if (result.status === 1) {
    return true;
  }

  throw new Error("git diff --cached --quiet failed");
}

function preferredPushRemote() {
  const remoteNames = tryRunCapture("git", ["remote"])
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);

  if (remoteNames.includes("origin")) {
    return "origin";
  }

  return remoteNames[0] || "";
}

function buildTarball() {
  console.log("[1/4] Building the release package...");
  run("node", ["scripts/release/build-package.js"]);

  if (!fs.existsSync(tarballPath)) {
    throw new Error(`Tarball not found: ${tarballPath}`);
  }
}

function createReleaseBranchInDistRepo(pushRemoteName, pushRemoteUrl) {
  console.log("[2/4] Creating release commit in the dist workspace...");
  clearDirectory(releaseExtractDir);
  ensureReleaseRepo();

  run("git", ["fetch", "--prune", "origin"], { cwd: releaseRepoDir });

  const publishRemoteName = pushRemoteName ? "publish" : "";
  if (publishRemoteName && pushRemoteUrl) {
    ensureGitRemote(releaseRepoDir, publishRemoteName, pushRemoteUrl);
    fetchReleaseRef(releaseRepoDir, publishRemoteName);
  }

  const baseRef = resolveReleaseBaseRef(publishRemoteName);
  resetReleaseRepoBranch(baseRef);

  run("tar", ["-xzf", tarballPath, "-C", releaseExtractDir], {
    cwd: distDir,
  });

  const extractedPackageDir = path.join(releaseExtractDir, "package");
  if (!fs.existsSync(extractedPackageDir)) {
    throw new Error(`Extracted package directory not found: ${extractedPackageDir}`);
  }

  validateExtractedPackage(extractedPackageDir);
  copyDirectoryContents(extractedPackageDir, releaseRepoDir);
  run("git", ["add", "-A"], { cwd: releaseRepoDir });

  if (hasStagedChanges(releaseRepoDir)) {
    run("git", ["commit", "-m", `release: ${branchName}`], {
      cwd: releaseRepoDir,
    });
  } else {
    console.log("No package changes detected; reusing the existing release commit.");
  }

  fs.rmSync(releaseExtractDir, { recursive: true, force: true });

  return releaseRepoDir;
}

function updateLocalBranchFromTempRepo(tempRepoDir) {
  console.log("[3/4] Updating the local release branch without switching...");
  run(
    "git",
    ["fetch", "--force", tempRepoDir, `refs/heads/${branchName}:refs/heads/${branchName}`],
    { cwd: repoRoot },
  );
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const startingBranch = currentBranch(repoRoot);

  if (startingBranch === branchName) {
    console.error(
      `Current branch is already ${branchName}. Switch to another branch before running this script.`,
    );
    process.exit(1);
  }

  try {
    if (options.packOnly) {
      console.log(
        "Pack-only mode enabled; the script will build the tarball without creating a release commit.",
      );
    }

    buildTarball();

    if (options.packOnly) {
      const endingBranch = currentBranch(repoRoot);
      if (endingBranch !== startingBranch) {
        throw new Error("Current workspace branch changed unexpectedly.");
      }

      console.log("[4/4] Done.");
      console.log(`Current branch: ${endingBranch || "(detached HEAD)"}`);
      console.log(`Tarball: ${tarballPath}`);
      console.log("Skipped release commit and local release branch update.");
      return;
    }

    const pushRemote = preferredPushRemote();
    const pushRemoteUrl = preferredPushRemoteUrl(pushRemote);
    const tempRepoDir = createReleaseBranchInDistRepo(pushRemote, pushRemoteUrl);
    updateLocalBranchFromTempRepo(tempRepoDir);

    const endingBranch = currentBranch(repoRoot);
    if (endingBranch !== startingBranch) {
      throw new Error("Current workspace branch changed unexpectedly.");
    }

    console.log("[4/4] Done.");
    console.log(`Current branch: ${endingBranch || "(detached HEAD)"}`);
    console.log(`Release branch: ${branchName}`);
    console.log(`Tarball: ${tarballPath}`);
    console.log(`Release repo: ${releaseRepoDir}`);
    console.log(`Push command: git push -u ${pushRemote || "<remote>"} ${branchName}`);
  } catch (error) {
    console.error("Build failed.");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
