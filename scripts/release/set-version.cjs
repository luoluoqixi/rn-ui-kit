#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const { existsSync, readFileSync, rmSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const projectRoot = resolve(__dirname, "../..");
const packageJsonPaths = ["package.json", "examples/app/package.json"];
const sourcePackageJsonPath = resolve(projectRoot, "package.json");
const lockfileDirectories = [projectRoot];
const pushRemoteCandidates = ["origin", "nas"];
const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

function printUsage() {
  console.log("用法: bun run set-version <version> [--commit] [--push] [--force]");
  console.log("示例: bun run set-version 1.2.3");
  console.log("      bun run set-version 1.2.3 --commit");
  console.log("      bun run set-version 1.2.3 --commit --force");
  console.log("      bun run set-version 1.2.3 --push");
  console.log("");
  console.log("  --commit  更新版本后执行 git add、签名 commit 和创建 tag");
  console.log("  --push    隐含 --commit，并打包发布分支后推送到 origin/nas");
  console.log("  --force   允许 --commit/--push 将已有工作区改动一并提交");
}

function fail(message, { showUsage = false } = {}) {
  throw Object.assign(new Error(message), { showUsage });
}

function parseOptions(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const options = {
    versionArg: "",
    commit: false,
    push: false,
    force: false,
  };

  for (const arg of argv) {
    if (arg === "--commit") {
      options.commit = true;
      continue;
    }

    if (arg === "--push") {
      options.push = true;
      options.commit = true;
      continue;
    }

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg.startsWith("-")) {
      fail(`未知选项：${arg}`, { showUsage: true });
    }

    if (options.versionArg) {
      fail("请传入且仅传入一个版本号。", { showUsage: true });
    }

    options.versionArg = arg;
  }

  if (!options.versionArg) {
    fail("请传入版本号。", { showUsage: true });
  }

  if (options.force && !options.commit) {
    fail("--force 只能与 --commit 或 --push 一起使用。", {
      showUsage: true,
    });
  }

  const version = options.versionArg.startsWith("v")
    ? options.versionArg.slice(1)
    : options.versionArg;

  if (!semverPattern.test(version)) {
    fail(`版本号 "${options.versionArg}" 不是有效的 SemVer。`, {
      showUsage: true,
    });
  }

  return {
    ...options,
    version,
    tag: `v${version}`,
  };
}

function run(command, args, { cwd = projectRoot } = {}) {
  console.log(`\n> ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} 执行失败（退出码 ${result.status}）。`);
  }
}

function runCapture(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    fail(stderr || `${command} ${args.join(" ")} 执行失败。`);
  }

  return (result.stdout || "").trim();
}

function gitRefExists(refName) {
  const result = spawnSync("git", ["show-ref", "--verify", "--quiet", refName], {
    cwd: projectRoot,
    stdio: "ignore",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status === 0) {
    return true;
  }

  if (result.status === 1) {
    return false;
  }

  fail(`无法检查 Git ref：${refName}`);
}

function configuredPushRemotes() {
  const configuredRemotes = new Set(
    runCapture("git", ["remote"])
      .split(/\r?\n/)
      .map((remote) => remote.trim())
      .filter(Boolean),
  );

  return pushRemoteCandidates.filter((remote) => configuredRemotes.has(remote));
}

function remoteTagExists(remote, tag) {
  const result = spawnSync(
    "git",
    ["ls-remote", "--exit-code", "--tags", remote, `refs/tags/${tag}`],
    {
      cwd: projectRoot,
      encoding: "utf8",
      shell: false,
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status === 0) {
    return true;
  }

  if (result.status === 2) {
    return false;
  }

  const stderr = (result.stderr || "").trim();
  fail(
    stderr ||
      `无法检查远端 ${remote} 是否存在 Tag ${tag}（退出码 ${result.status}）。`,
  );
}

function readSourcePackage() {
  if (!existsSync(sourcePackageJsonPath)) {
    fail("找不到根目录 package.json。");
  }

  return JSON.parse(readFileSync(sourcePackageJsonPath, "utf8"));
}

function validateAutomation(options) {
  if (!options.commit) {
    return {
      remotes: [],
      recreateLocalTag: false,
    };
  }

  const worktreeStatus = runCapture("git", [
    "status",
    "--porcelain",
    "--untracked-files=all",
  ]);
  if (worktreeStatus && !options.force) {
    const automationOption = options.push ? "--push" : "--commit";
    fail(
      "工作区存在未提交改动，已拒绝自动创建 release commit。" +
        `请先提交或清理这些改动；如果确认要全部提交，请显式执行：` +
        `bun run set-version ${options.version} ${automationOption} --force`,
    );
  }

  const remotes = configuredPushRemotes();
  if (options.push) {
    const currentBranch = runCapture("git", [
      "symbolic-ref",
      "--quiet",
      "--short",
      "HEAD",
    ]);
    if (currentBranch !== "main") {
      fail(
        `--push 必须在 main 分支执行，` +
          `当前分支是 ${currentBranch || "(detached HEAD)"}。`,
      );
    }

    if (remotes.length === 0) {
      fail(
        `未找到可推送的 remote；只支持已存在的 ${pushRemoteCandidates.join("、")}。`,
      );
    }
  }

  const recreateLocalTag = gitRefExists(`refs/tags/${options.tag}`);
  if (recreateLocalTag) {
    const remotesWithTag = remotes.filter((remote) =>
      remoteTagExists(remote, options.tag),
    );
    if (remotesWithTag.length > 0) {
      fail(
        `Tag ${options.tag} 已存在于远端 ${remotesWithTag.join("、")}，` +
          "已拒绝自动创建 release commit。",
      );
    }

    const checkedRemotes =
      remotes.length > 0 ? remotes.join("、") : "origin/nas（均未配置）";
    console.log(
      `本地 Tag ${options.tag} 已存在，但 ${checkedRemotes} 均不存在该 Tag；` +
        "将在 release commit 成功后删除并重新创建本地 Tag。",
    );
  }

  return {
    remotes,
    recreateLocalTag,
  };
}

function updateVersions(version) {
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

  for (const directory of lockfileDirectories) {
    const lockfilePath = resolve(directory, "bun.lock");
    originalFiles.set(
      lockfilePath,
      existsSync(lockfilePath) ? readFileSync(lockfilePath, "utf8") : null,
    );
  }

  if (changedPackageJsonPaths.length === 0) {
    console.log(`工程当前已经是 ${version}，无需修改版本文件。`);
    return;
  }

  console.log(`已将工程版本更新为 ${version}：`);
  for (const relativePath of changedPackageJsonPaths) {
    console.log(`  - ${relativePath}`);
  }

  console.log("\n正在同步根项目 bun.lock...");
  const bunCommand = process.platform === "win32" ? "bun.exe" : "bun";
  for (const directory of lockfileDirectories) {
    const lockfileResult = spawnSync(bunCommand, ["install", "--lockfile-only"], {
      cwd: directory,
      stdio: "inherit",
      shell: false,
    });

    if (lockfileResult.error || lockfileResult.status !== 0) {
      for (const [absolutePath, originalContent] of originalFiles) {
        if (originalContent == null) {
          rmSync(absolutePath, { force: true });
        } else {
          writeFileSync(absolutePath, originalContent, "utf8");
        }
      }

      if (lockfileResult.error) {
        throw lockfileResult.error;
      }

      fail("bun.lock 同步失败，已恢复版本文件和锁文件。");
    }
  }
}

function printManualCommands(version, tag) {
  console.log("\n默认模式不会 commit 或 push。可手动执行：");
  console.log("git add .");
  console.log(`git commit -S -m "release: ${version}"`);
  console.log(`git tag -a ${tag} -m "${tag}"`);
  console.log("\n或使用自动模式：");
  console.log(`bun run set-version ${version} --commit`);
  console.log(`bun run set-version ${version} --push`);
}

function commitRelease(version, tag, recreateLocalTag) {
  run("git", ["add", "."]);
  run("git", ["commit", "-S", "-m", `release: ${version}`]);
  if (recreateLocalTag) {
    run("git", ["tag", "-d", tag]);
  }
  run("git", ["tag", "-a", tag, "-m", tag]);
}

function buildAndPushRelease(branchName, tag, remotes) {
  const bunCommand = process.platform === "win32" ? "bun.exe" : "bun";
  run(bunCommand, ["run", "package-release"]);

  for (const remote of remotes) {
    run("git", ["push", "-u", remote, branchName]);
    run("git", ["push", remote, "main"]);
    run("git", ["push", remote, tag]);
  }
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const sourcePackage = readSourcePackage();
  const branchName = `${sourcePackage.name}-${options.version}`;
  const automation = validateAutomation(options);

  updateVersions(options.version);

  if (!options.commit) {
    printManualCommands(options.version, options.tag);
    return;
  }

  commitRelease(options.version, options.tag, automation.recreateLocalTag);

  if (options.push) {
    buildAndPushRelease(branchName, options.tag, automation.remotes);
  } else {
    console.log(
      `\n已创建 release commit 和 tag ${options.tag}，尚未执行 package 或 push。`,
    );
  }
}

try {
  main();
} catch (error) {
  console.error(`错误: ${error instanceof Error ? error.message : error}`);
  if (error?.showUsage) {
    printUsage();
  }
  process.exit(1);
}
