import { expect, test } from "bun:test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import { assertHeroUIPlatform, withHeroUIConfig } from "../scripts/metro/heroui.cjs";
import { collectSources } from "../scripts/check-heroui-bundle.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const appRoot = path.join(root, "examples/app");

test("HeroUI rejects cross-platform package imports and resolved aliases", () => {
  for (const name of ["heroui-native", "heroui-native/styles", "/repo/node_modules/heroui-native/lib/module/index.js"]) {
    expect(() => assertHeroUIPlatform(name, "web")).toThrow("platform boundary");
    expect(() => assertHeroUIPlatform(name, "ios")).not.toThrow();
    expect(() => assertHeroUIPlatform(name, "android")).not.toThrow();
  }
  for (const name of ["@heroui/react", "@heroui/react/button", "@heroui/styles", "/repo/node_modules/@heroui/react/dist/index.js"]) {
    expect(() => assertHeroUIPlatform(name, "ios")).toThrow("platform boundary");
    expect(() => assertHeroUIPlatform(name, "android")).toThrow("platform boundary");
    expect(() => assertHeroUIPlatform(name, "web")).not.toThrow();
  }
});

test("one Metro config chooses Native CSS without changing the app import", () => {
  const resolveRequest = (_context, name) => ({ type: "sourceFile", filePath: name === "alias"
    ? "/repo/node_modules/heroui-native/lib/module/index.js"
    : path.resolve(appRoot, name) });
  const config = withHeroUIConfig({ projectRoot: appRoot, resolver: { resolveRequest } }, {
    cssEntryFile: "./global.css", nativeCssEntryFile: "./global.native.css",
  });
  const context = { originModulePath: path.join(appRoot, "App.tsx") };
  expect(config.transformerPath.startsWith(path.join(appRoot, "node_modules/uniwind/"))).toBe(true);
  for (const platform of ["web", "ios", "android"]) {
    expect(config.resolver.resolveRequest(context, "./global.css", platform).filePath)
      .toBe(path.join(appRoot, platform === "web" ? "global.css" : "global.native.css"));
  }
  expect(() => config.resolver.resolveRequest(context, "alias", "web")).toThrow("platform boundary");
});

for (const platform of ["web", "native"]) {
  test(`actual ${platform} CSS import graph contains only its own HeroUI package`, async () => {
    const entry = path.join(appRoot, platform === "web" ? "global.css" : "global.native.css");
    const dependencies = new Set();
    await compile(await fs.readFile(entry, "utf8"), {
      base: appRoot, onDependency: file => dependencies.add(file),
    });
    const files = [...dependencies];
    expect(files.some(file => file.includes(platform === "web" ? "/@heroui/styles/" : "/heroui-native/"))).toBe(true);
    expect(files.some(file => file.includes(platform === "web" ? "/heroui-native/" : "/@heroui/styles/"))).toBe(false);
    if (platform === "web") {
      expect(files.some(file => file.includes("/uniwind/"))).toBe(false);
    }
  });
}

test("bundle audit reads both flat and sectioned source maps", () => {
  expect(collectSources({ sources: ["a"], sections: [{ map: { sources: ["b"] } }] })).toEqual(["a", "b"]);
});
