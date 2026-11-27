#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { validateReleasePackage } = require("./validate-package.cjs");
const { withReleaseLock } = require("./release-lock.cjs");

const repoRoot = path.resolve(__dirname, "../..");
const packageJsonPath = path.join(repoRoot, "package.json");
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
  const allowed = new Set(["--pack-only", "--no-commit", "--update-existing", "--help", "-h"]);
  for (const arg of argv) {
    if (!allowed.has(arg)) throw new Error(`Unknown option: ${arg}`);
  }
  const options = {
    packOnly: argv.includes("--pack-only") || argv.includes("--no-commit"),
    updateExisting: argv.includes("--update-existing"),
    help: argv.includes("--help") || argv.includes("-h"),
  };
  if (options.packOnly && options.updateExisting) {
    throw new Error("--pack-only / --no-commit cannot be combined with --update-existing");
  }
  return options;
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
  const manifest = validateReleasePackage(packageDir);
  if (manifest.name !== packageName || manifest.version !== version) {
    throw new Error("Release package name/version does not match the current source package");
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
      "--no-tags",
      "--no-prune",
      "--no-prune-tags",
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

function preferredPushRemoteUrl(remoteName, strict = false) {
  if (!remoteName) {
    return "";
  }

  const read = strict ? runCapture : tryRunCapture;
  const url = read("git", ["remote", "get-url", remoteName]);
  if (strict && !url) throw new Error(`Remote URL is empty: ${remoteName}`);
  return url;
}

function ensureReleaseRepo() {
  const gitDirPath = path.join(releaseRepoDir, ".git");

  if (!fs.existsSync(releaseRepoDir)) {
    run("git", ["clone", "--no-local", "--no-tags", repoRoot, releaseRepoDir], {
      cwd: distDir,
    });
  } else if (!fs.existsSync(gitDirPath)) {
    throw new Error(`Release repo directory exists but is not a git repository: ${releaseRepoDir}`);
  }

  ensureGitIdentity(releaseRepoDir);
}

function resolveReleaseBaseRef(publishRemoteName, updateExisting = false) {
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
    if (updateExisting && !isAncestor(releaseRepoDir, localBaseRef, publishBaseRef)) {
      throw new Error(
        "Local and remote release branches have diverged; refusing to overwrite history",
      );
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

function resetReleaseRepoBranch(baseRef, updateExisting = false) {
  if (updateExisting) {
    if (!baseRef) throw new Error("Existing release branch was not found in the dist repository");
    // 在现有提交上以 detached HEAD 构建，不重建或重置任何发布分支。
    run("git", ["switch", "--detach", baseRef], { cwd: releaseRepoDir });
    run("git", ["rm", "-rf", ".", "--ignore-unmatch"], { cwd: releaseRepoDir });
    run("git", ["clean", "-fdx"], { cwd: releaseRepoDir });
    return;
  }
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

function preferredPushRemote(strict = false) {
  const read = strict ? runCapture : tryRunCapture;
  const remoteNames = read("git", ["remote"])
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);

  if (remoteNames.includes("origin")) {
    return "origin";
  }

  return remoteNames[0] || "";
}

function buildTarball(lockToken) {
  console.log("[1/4] Building the release package...");
  run("node", ["scripts/release/build-package.cjs"], {
    env: { ...process.env, RN_UI_KIT_RELEASE_LOCK_TOKEN: lockToken },
  });

  if (!fs.existsSync(tarballPath)) {
    throw new Error(`Tarball not found: ${tarballPath}`);
  }
}

function createReleaseBranchInDistRepo(pushRemoteName, pushRemoteUrl, updateExisting = false) {
  console.log("[2/4] Creating release commit in the dist workspace...");
  clearDirectory(releaseExtractDir);
  run("tar", ["-xzf", tarballPath, "-C", releaseExtractDir], { cwd: distDir });
  const extractedPackageDir = path.join(releaseExtractDir, "package");
  validateExtractedPackage(extractedPackageDir);

  ensureReleaseRepo();

  run(
    "git",
    [
      "fetch",
      "--no-tags",
      updateExisting ? "--no-prune" : "--prune",
      "--no-prune-tags",
      "origin",
      ...(updateExisting ? [`refs/heads/${branchName}:refs/remotes/origin/${branchName}`] : []),
    ],
    { cwd: releaseRepoDir },
  );

  const publishRemoteName = pushRemoteName ? "publish" : "";
  if (publishRemoteName && pushRemoteUrl) {
    ensureGitRemote(releaseRepoDir, publishRemoteName, pushRemoteUrl);
    const fetched = fetchReleaseRef(releaseRepoDir, publishRemoteName);
    if (updateExisting && !fetched) {
      throw new Error(
        "Could not fetch the existing remote release branch; refusing to use stale history",
      );
    }
  }

  const baseRef = resolveReleaseBaseRef(publishRemoteName, updateExisting);
  resetReleaseRepoBranch(baseRef, updateExisting);
  copyDirectoryContents(extractedPackageDir, releaseRepoDir);
  // 目录内仅有已验证产物，不受全局 ignore 或 clone 的 info/exclude 影响。
  run("git", ["add", "-f", "-A", "--", "."], { cwd: releaseRepoDir });

  if (hasStagedChanges(releaseRepoDir)) {
    run(
      "git",
      [
        "commit",
        "-m",
        updateExisting ? `fix: 补全 ${branchName} 发布产物` : `release: ${branchName}`,
      ],
      {
        cwd: releaseRepoDir,
      },
    );
  } else {
    console.log("No package changes detected; reusing the existing release commit.");
  }

  fs.rmSync(releaseExtractDir, { recursive: true, force: true });

  return releaseRepoDir;
}

function assertReleaseBranchNotCheckedOut() {
  const checkout = runCapture("git", [
    "for-each-ref",
    "--format=%(worktreepath)",
    `refs/heads/${branchName}`,
  ]);
  if (checkout)
    throw new Error(`Release branch is checked out in another working directory: ${checkout}`);
}

function updateLocalBranchFromTempRepo(tempRepoDir, expectedTip = "") {
  console.log("[3/4] Updating the local release branch without switching...");
  if (expectedTip) {
    // 固定已验证的提交 OID，不依赖其他 fetch 可覆盖的 FETCH_HEAD。
    const newTip = runCapture("git", ["rev-parse", "--verify", "HEAD^{commit}"], {
      cwd: tempRepoDir,
    });
    run(
      "git",
      [
        "fetch",
        "--no-tags",
        "--no-prune",
        "--no-prune-tags",
        "--no-write-fetch-head",
        tempRepoDir,
        newTip,
      ],
      { cwd: repoRoot },
    );
    if (!isAncestor(repoRoot, expectedTip, newTip)) {
      throw new Error("Release update is not a fast-forward; refusing to overwrite history");
    }
    assertReleaseBranchNotCheckedOut();
    run("git", ["update-ref", "--no-deref", `refs/heads/${branchName}`, newTip, expectedTip]);
    return;
  }
  run(
    "git",
    ["fetch", "--force", tempRepoDir, `refs/heads/${branchName}:refs/heads/${branchName}`],
    { cwd: repoRoot },
  );
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  if (options.help) {
    console.log("用法：bun run package-release [--pack-only | --update-existing]");
    console.log("--update-existing  仅更新已存在的本地发布分支，追加提交，不操作 tag 或 push");
    return;
  }
  return withReleaseLock(repoRoot, (lockToken) => release(options, lockToken));
}

function release(options, lockToken) {
  if (options.packOnly) {
    buildTarball(lockToken);
    console.log(`Tarball: ${tarballPath}`);
    console.log("Skipped all Git operations.");
    return;
  }
  const startingBranch = currentBranch(repoRoot);

  if (startingBranch === branchName) {
    throw new Error(
      `Current branch is already ${branchName}. Switch to another branch before running this script.`,
    );
  }

  let expectedTip = "";
  if (options.updateExisting) {
    if (!branchExists(repoRoot, branchName)) {
      throw new Error(`Existing local release branch is required: ${branchName}`);
    }
    assertReleaseBranchNotCheckedOut();
    expectedTip = runCapture("git", ["rev-parse", `refs/heads/${branchName}`]);
  }

  const pushRemote = preferredPushRemote(options.updateExisting);
  const pushRemoteUrl = preferredPushRemoteUrl(pushRemote, options.updateExisting);
  buildTarball(lockToken);
  const tempRepoDir = createReleaseBranchInDistRepo(
    pushRemote,
    pushRemoteUrl,
    options.updateExisting,
  );
  const endingBranch = currentBranch(repoRoot);
  if (endingBranch !== startingBranch) {
    throw new Error("Current workspace branch changed unexpectedly.");
  }
  updateLocalBranchFromTempRepo(tempRepoDir, expectedTip);

  console.log("[4/4] Done.");
  console.log(`Current branch: ${endingBranch || "(detached HEAD)"}`);
  console.log(`Release branch: ${branchName}`);
  console.log(`Tarball: ${tarballPath}`);
  console.log(`Release repo: ${releaseRepoDir}`);
  console.log(`Push command: git push -u ${pushRemote || "<remote>"} ${branchName}`);
}

try {
  main();
} catch (error) {
  console.error("Build failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
