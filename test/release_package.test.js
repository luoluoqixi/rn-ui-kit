import { afterEach, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const temporaryRoots = [];
const releaseBranch = "rn-ui-kit-2.0.0";
afterEach(() => {
  for (const root of temporaryRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function write(root, name, text = "") {
  const file = path.join(root, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rn-ui-release-test-"));
  temporaryRoots.push(root);
  const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
  manifest.files.push("assets/runtime.txt");
  manifest.exports["./runtime.txt"] = "./assets/runtime.txt";
  write(root, "package.json", JSON.stringify(manifest));
  for (const file of [
    "README.md",
    "LICENSE",
    "src/styles.css",
    "patches/example.patch",
    "scripts/sync-patches.mjs",
    "scripts/clear-patch-cache.mjs",
    "scripts/metro/heroui.cjs",
    "scripts/metro/heroui.d.cts",
    "assets/runtime.txt",
  ])
    write(root, file, file);
  for (const entry of ["index", "core", "debug", "initialize"])
    write(root, `src/${entry}.ts`, "export {};");
  return root;
}

function runScript(root, scriptName, argv, spawn, env = {}) {
  const scriptPath = path.join(projectRoot, "scripts/release", scriptName);
  const nativeRequire = createRequire(scriptPath);
  const output = [];
  const runtimeProcess = {
    argv: [process.execPath, scriptPath, ...argv],
    execPath: process.execPath,
    platform: process.platform,
    env,
    exitCode: 0,
    exit(code) {
      this.exitCode = code;
      throw new Error(`exit:${code}`);
    },
  };
  const localRequire = (id) =>
    id === "node:child_process" || id === "child_process"
      ? { spawnSync: spawn }
      : nativeRequire(id);
  localRequire.resolve = (id, options) =>
    nativeRequire.resolve(id, id === "typescript/bin/tsc" ? undefined : options);
  localRequire.main = {};
  const context = {
    require: localRequire,
    module: { exports: {} },
    __dirname: path.join(root, "scripts/release"),
    process: runtimeProcess,
    console: Object.fromEntries(
      ["log", "error", "warn"].map((name) => [name, (...args) => output.push(args.join(" "))]),
    ),
  };
  try {
    vm.runInNewContext(fs.readFileSync(scriptPath, "utf8"), context, { filename: scriptPath });
  } catch (error) {
    if (!/^exit:\d+$/.test(error.message)) throw error;
  }
  return { code: runtimeProcess.exitCode, output: output.join("\n") };
}

function build(root, { onCompile = () => {}, env = {} } = {}) {
  return runScript(
    root,
    "build-package.cjs",
    [],
    (command, args, options) => {
      if (args.includes("-p")) {
        const out = args[args.indexOf("--outDir") + 1];
        for (const entry of ["index", "core", "debug", "initialize"]) {
          write(out, `${entry}.js`, "export {};");
          write(out, `${entry}.d.ts`, "export {};");
        }
        write(out, "internal.js", "export {};");
        onCompile(out);
        return { status: 0 };
      }
      if (command !== "npm" && command !== "tar") throw new Error(`测试禁止执行：${command}`);
      return spawnSync(command, args, { ...options, stdio: "pipe" });
    },
    env,
  );
}

test("发布 tarball 保留 Metro、自定义导出及所有 bin 文件", () => {
  const root = fixture();
  const result = build(root);
  expect(result.code, result.output).toBe(0);
  const tarball = path.join(root, "dist/rn-ui-kit-2.0.0.tgz");
  const extracted = path.join(root, "extracted");
  fs.mkdirSync(extracted);
  expect(spawnSync("tar", ["-xzf", tarball, "-C", extracted]).status).toBe(0);
  const packed = path.join(extracted, "package");
  const manifest = JSON.parse(fs.readFileSync(path.join(packed, "package.json"), "utf8"));
  expect(manifest.exports["./metro"]).toEqual({
    types: "./scripts/metro/heroui.d.cts",
    default: "./scripts/metro/heroui.cjs",
  });
  expect(manifest.exports["./runtime.txt"]).toBe("./assets/runtime.txt");
  expect(manifest.exports["."]).toEqual({
    "types": "./dist/index.d.ts",
    "react-native": "./src/index.ts",
    "default": "./dist/index.js",
  });
  for (const file of [
    "scripts/metro/heroui.cjs",
    "scripts/metro/heroui.d.cts",
    "scripts/clear-patch-cache.mjs",
    "assets/runtime.txt",
  ]) {
    expect(fs.readFileSync(path.join(packed, file), "utf8")).toBe(file);
  }
  expect(manifest.devDependencies).toBeUndefined();
});

test("声明的发布文件缺失时构建失败，不再静默漏包", () => {
  const root = fixture();
  fs.unlinkSync(path.join(root, "scripts/metro/heroui.cjs"));
  const result = build(root);
  expect(result.code).toBe(1);
  expect(result.output).toContain("scripts/metro/heroui.cjs");
});

test("导出指向 files 白名单外的文件时构建失败", () => {
  const root = fixture();
  const file = path.join(root, "package.json");
  const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
  manifest.exports["./missing"] = "./assets/missing.txt";
  fs.writeFileSync(file, JSON.stringify(manifest));
  const result = build(root);
  expect(result.code).toBe(1);
  expect(result.output).toContain("assets/missing.txt");
});

test("npm pack 过滤掉已声明的入口时构建失败", () => {
  const root = fixture();
  write(root, "scripts/metro/.npmignore", "heroui.cjs\n");
  const result = build(root);
  expect(result.code).toBe(1);
  expect(result.output).toContain("scripts/metro/heroui.cjs");
});

test("npm pack 不得漏掉内部源码、CSS 依赖、补丁或编译模块", () => {
  for (const file of [
    "src/internal.ts",
    "src/theme.css",
    "patches/example.patch",
    "dist/internal.js",
  ]) {
    const root = fixture();
    const configure = (base) => write(base, ".npmignore", `${path.basename(file)}\n`);
    if (!file.startsWith("dist/")) {
      write(root, file, "内部文件");
      configure(path.join(root, path.dirname(file)));
    }
    const result = build(root, { onCompile: file.startsWith("dist/") ? configure : undefined });
    expect(result.code, file).toBe(1);
    expect(result.output).toContain(file);
  }
});

test("构建与发布在已有独占锁时拒绝覆盖产物", () => {
  const root = fixture();
  const lock = path.join(root, "dist/.package-release.lock");
  fs.mkdirSync(lock, { recursive: true });
  write(lock, "owner.json", JSON.stringify({ token: "another-release", pid: 123 }));
  write(root, "dist/rn-ui-kit-2.0.0-package/sentinel", "原有产物");
  for (const result of [
    build(root),
    release(root, ["--pack-only"]),
    release(root, ["--update-existing"]),
  ]) {
    expect(result.code).toBe(1);
    expect(result.output).toContain("release lock");
  }
  expect(fs.readFileSync(path.join(root, "dist/rn-ui-kit-2.0.0-package/sentinel"), "utf8")).toBe(
    "原有产物",
  );
  expect(fs.existsSync(lock)).toBe(true);
});

// Git 边界使用替身，测试不会执行任何真实 Git 命令。
function release(
  root,
  argv,
  {
    local = "previous",
    remote = "previous",
    changed = true,
    fetchFailed = false,
    concurrent = false,
    checkedOut = false,
    remoteReadFailed = "",
    noRemote = false,
    interferingFetch = false,
    realBuild = false,
  } = {},
) {
  const repo = path.join(root, "dist", releaseBranch);
  fs.mkdirSync(path.join(repo, ".git"), { recursive: true });
  write(repo, "obsolete.txt", "旧产物");
  const parents = {
    previous: "first",
    ahead: "previous",
    divergent: "first",
    concurrent: "previous",
    intruder: "previous",
  };
  const state = {
    local,
    head: "previous",
    commitCount: 0,
    buildCount: 0,
    gitCalls: 0,
    tags: { v2: "source-tag" },
    forbidden: [],
    fetched: "",
    fetchCommands: [],
    committedFiles: [],
  };
  const ancestor = (a, b) => {
    for (let p = b; p; p = parents[p]) if (p === a) return true;
    return false;
  };
  const result = runScript(root, "package.cjs", argv, (command, args, options = {}) => {
    if (command === "node") {
      state.buildCount++;
      if (realBuild) return { status: build(root, { env: options.env }).code };
      return { status: 0 };
    }
    if (command === "tar") return spawnSync(command, args, { ...options, stdio: "pipe" });
    if (command !== "git") throw new Error(`测试禁止执行：${command}`);
    state.gitCalls++;
    const ok = (stdout = "") => ({ status: 0, stdout });
    const fail = (stderr = "拒绝操作") => ({ status: 1, stdout: "", stderr });
    const inSource = !options.cwd || options.cwd === root;
    switch (args[0]) {
      case "symbolic-ref":
        return ok(inSource ? "main" : releaseBranch);
      case "show-ref":
        return args.at(-1).includes("/publish/")
          ? remote
            ? ok()
            : fail()
          : state.local
            ? ok()
            : fail();
      case "rev-parse":
        return ok(
          inSource ? (args.at(-1) === "FETCH_HEAD" ? state.fetched : state.local) : state.head,
        );
      case "remote":
        if (inSource && remoteReadFailed === (args[1] === "get-url" ? "url" : "list"))
          return fail("远端配置读取失败");
        if (inSource && remoteReadFailed === "empty-url" && args[1] === "get-url") return ok();
        if (inSource && noRemote) return ok();
        return ok(args[1] === "get-url" ? "https://example.invalid/rn-ui-kit" : "origin");
      case "config":
        return ok("release-test");
      case "for-each-ref":
        return ok(checkedOut ? "/another/checkout" : "");
      case "fetch": {
        state.fetchCommands.push(args);
        if (args.includes("publish") && fetchFailed) return fail("网络失败");
        if (inSource) {
          if (args.includes("--force")) state.forbidden.push("force-fetch");
          if (args.at(-1).includes(":refs/heads/")) state.local = state.head;
          state.fetched = interferingFetch ? "intruder" : state.head;
        }
        return ok();
      }
      case "merge-base": {
        const resolve = (ref) =>
          ref === `origin/${releaseBranch}`
            ? local
            : ref === `publish/${releaseBranch}`
              ? remote
              : ref;
        return ancestor(resolve(args.at(-2)), resolve(args.at(-1))) ? ok() : fail();
      }
      case "switch":
        if (!args.includes("--detach")) state.forbidden.push("recreate-branch");
        if (args.length > 2)
          state.head =
            args.at(-1) === `origin/${releaseBranch}`
              ? local
              : args.at(-1) === `publish/${releaseBranch}`
                ? remote
                : args.at(-1);
        return ok();
      case "rm":
        for (const file of fs.readdirSync(repo))
          if (file !== ".git") fs.rmSync(path.join(repo, file), { recursive: true, force: true });
        return ok();
      case "clean":
        return ok();
      case "add": {
        const files = fs
          .readdirSync(repo, { recursive: true })
          .filter(
            (file) => !file.startsWith(".git") && fs.statSync(path.join(repo, file)).isFile(),
          );
        // 模拟常见全局 ignore：dist、补丁与新加入的 Metro 脚本。
        state.committedFiles = args.includes("-f")
          ? files
          : files.filter(
              (file) =>
                !file.startsWith("dist/") &&
                !file.startsWith("scripts/metro/") &&
                !file.endsWith(".patch"),
            );
        return ok();
      }
      case "diff":
        return changed ? fail() : ok();
      case "commit":
        state.commitCount++;
        parents.rebuilt = state.head;
        state.head = "rebuilt";
        if (concurrent) state.local = "concurrent";
        return ok();
      case "update-ref":
        if (args.at(-1) !== state.local) return fail("发布分支已被其他进程更新");
        state.local = args.at(-2);
        return ok();
      default:
        state.forbidden.push(args[0]);
        return fail();
    }
  });
  return { ...result, ...state, parents };
}

function preparedRelease() {
  const root = fixture();
  // 只为发布流程提供有效 tarball，编译和打包行为由上面的产物测试覆盖。
  const target = path.join(root, "packed/package");
  fs.mkdirSync(target, { recursive: true });
  for (const file of fs.readdirSync(root)) {
    if (file !== "packed")
      fs.cpSync(path.join(root, file), path.join(target, file), { recursive: true });
  }
  const manifestFile = path.join(target, "package.json");
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  manifest["react-native"] = "./src/index.ts";
  fs.writeFileSync(manifestFile, JSON.stringify(manifest));
  for (const entry of ["index", "core", "debug", "initialize"]) {
    write(target, `dist/${entry}.js`);
    write(target, `dist/${entry}.d.ts`);
  }
  fs.mkdirSync(path.join(root, "dist"), { recursive: true });
  expect(
    spawnSync("tar", [
      "-czf",
      path.join(root, "dist/rn-ui-kit-2.0.0.tgz"),
      "-C",
      path.join(root, "packed"),
      "package",
    ]).status,
  ).toBe(0);
  return root;
}

test("更新现有发布分支追加提交并保持 tag，不重建或强制覆盖分支", () => {
  const root = preparedRelease();
  const result = release(root, ["--update-existing"]);
  expect(result.code, result.output).toBe(0);
  expect(result.forbidden).toEqual([]);
  expect(result.local).toBe("rebuilt");
  expect(result.parents.rebuilt).toBe("previous");
  expect(result.tags).toEqual({ v2: "source-tag" });
  expect(result.commitCount).toBe(1);
  expect(fs.existsSync(path.join(root, "dist", releaseBranch, "obsolete.txt"))).toBe(false);
});

test("发布提交包含被全局 Git ignore 规则排除的产物", () => {
  const result = release(preparedRelease(), ["--update-existing"]);
  expect(result.code, result.output).toBe(0);
  for (const file of ["dist/index.js", "scripts/metro/heroui.cjs", "patches/example.patch"])
    expect(result.committedFiles).toContain(file);
});

test("更新模式拒绝创建不存在的本地发布分支", () => {
  const result = release(preparedRelease(), ["--update-existing"], { local: "", remote: "" });
  expect(result.code).toBe(1);
  expect(result.local).toBe("");
  expect(result.commitCount).toBe(0);
  expect(result.buildCount).toBe(0);
});

test("更新模式不修改在其他工作目录中检出的发布分支", () => {
  const result = release(preparedRelease(), ["--update-existing"], { checkedOut: true });
  expect(result.code).toBe(1);
  expect(result.local).toBe("previous");
  expect(result.commitCount).toBe(0);
});

test("更新模式拒绝本地与远端分叉，远端领先时保留远端提交", () => {
  const divergent = release(preparedRelease(), ["--update-existing"], { remote: "divergent" });
  expect(divergent.code).toBe(1);
  expect(divergent.local).toBe("previous");
  expect(divergent.commitCount).toBe(0);
  const ahead = release(preparedRelease(), ["--update-existing"], { remote: "ahead" });
  expect(ahead.code, ahead.output).toBe(0);
  expect(ahead.parents.rebuilt).toBe("ahead");
});

test("更新模式远端读取失败或并发更新时不覆盖现有发布分支", () => {
  const failed = release(preparedRelease(), ["--update-existing"], { fetchFailed: true });
  expect(failed.code).toBe(1);
  expect(failed.commitCount).toBe(0);
  expect(failed.local).toBe("previous");
  const concurrent = release(preparedRelease(), ["--update-existing"], { concurrent: true });
  expect(concurrent.code).toBe(1);
  expect(concurrent.local).toBe("concurrent");
});

test("更新模式远端列表或 URL 读取失败时立即停止，未配置远端仍可本地更新", () => {
  for (const remoteReadFailed of ["list", "url", "empty-url"]) {
    const result = release(preparedRelease(), ["--update-existing"], { remoteReadFailed });
    expect(result.code, remoteReadFailed).toBe(1);
    expect(result.commitCount).toBe(0);
    expect(result.local).toBe("previous");
  }
  const result = release(preparedRelease(), ["--update-existing"], { noRemote: true });
  expect(result.code, result.output).toBe(0);
  expect(result.local).toBe("rebuilt");
});

test("并行 fetch 改写 FETCH_HEAD 不会替换已验证的发布提交", () => {
  const result = release(preparedRelease(), ["--update-existing"], { interferingFetch: true });
  expect(result.code, result.output).toBe(0);
  expect(result.local).toBe("rebuilt");
  for (const args of result.fetchCommands) {
    expect(args).toContain("--no-tags");
    expect(args).toContain("--no-prune");
    expect(args).toContain("--no-prune-tags");
  }
});

test("发布子进程可以共享持有的锁，失败和完成后释放锁", () => {
  const root = preparedRelease();
  const result = release(root, ["--pack-only"], { realBuild: true });
  expect(result.code, result.output).toBe(0);
  expect(fs.existsSync(path.join(root, "dist/.package-release.lock"))).toBe(false);
  fs.unlinkSync(path.join(root, "scripts/metro/heroui.cjs"));
  expect(release(root, ["--pack-only"], { realBuild: true }).code).toBe(1);
  expect(fs.existsSync(path.join(root, "dist/.package-release.lock"))).toBe(false);
});

test("产物无变化时更新模式不追加空提交", () => {
  const result = release(preparedRelease(), ["--update-existing"], { changed: false });
  expect(result.code, result.output).toBe(0);
  expect(result.commitCount).toBe(0);
  expect(result.local).toBe("previous");
});

test("更新模式与只打包参数互斥，未知参数报错", () => {
  for (const argv of [["--pack-only", "--update-existing"], ["--typo"]]) {
    const result = release(preparedRelease(), argv);
    expect(result.code).toBe(1);
    expect(result.commitCount).toBe(0);
    expect(result.buildCount).toBe(0);
  }
});

test("只打包与帮助模式完全不访问 Git，原发布命令仍可生成提交", () => {
  for (const argv of [["--pack-only"], ["--no-commit"], ["--help"]]) {
    const result = release(preparedRelease(), argv);
    expect(result.code, result.output).toBe(0);
    expect(result.gitCalls).toBe(0);
    expect(result.commitCount).toBe(0);
  }
  const result = release(preparedRelease(), []);
  expect(result.code, result.output).toBe(0);
  expect(result.commitCount).toBe(1);
  expect(result.local).toBe("rebuilt");
  expect(result.fetchCommands.find((args) => args.includes("origin"))).toContain("--prune");
});
