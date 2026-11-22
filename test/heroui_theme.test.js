import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { compile } from "@tailwindcss/node";
import { generateUiThemeFromPrimaryColor } from "../src/core/components/ui/utils/theme/generate_ui_theme";
import { semanticColorsToVariables } from "../src/core/components/ui/utils/theme/theme_variables";
import { getStandardAppBackgroundColors, resolveAppBackgroundColors } from "../src/core/components/ui/utils/theme/app_background";

import { resolveUiPreferences } from "../src/core/components/ui/utils/theme/preferences";

const appRoot = new URL("../examples/app/", import.meta.url).pathname;

test("HeroUI overrides source tokens without shadowing derived color variables", () => {
  const colors = generateUiThemeFromPrimaryColor("#db2777").light;
  const variables = semanticColorsToVariables(colors);
  expect(variables["--accent"]).toBe(colors.accent);
  expect(variables["--muted"]).toBe(colors.muted);
  expect(variables["--field-background"]).toBe(colors.fieldBackground);
  expect(variables["--overlay-foreground"]).toBe(colors.overlayForeground);
  expect(Object.keys(variables).some(key => key.startsWith("--color-"))).toBe(false);
  for (const legacy of ["--primary", "--card", "--popover", "--muted-foreground", "--destructive", "--primary-background"]) {
    expect(variables[legacy]).toBeUndefined();
  }
});

test("semantic CSS names exist in both installed HeroUI themes; numbered accents are project extensions", async () => {
  const sources = await Promise.all([
    "../node_modules/heroui-native/src/styles/variables.css",
    "../node_modules/@heroui/styles/dist/themes/default/variables.css",
  ].map(path => readFile(new URL(path, import.meta.url), "utf8")));
  const variables = semanticColorsToVariables(generateUiThemeFromPrimaryColor("#2563eb").light);
  const extensions = Object.keys(variables).filter(name => /^--accent\d{2}$/.test(name));
  expect(extensions).toHaveLength(12);
  for (const source of sources) {
    const declared = new Set([...source.matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]));
    for (const name of Object.keys(variables)) {
      if (!extensions.includes(name)) expect(declared.has(name)).toBe(true);
    }
  }
});

for (const platform of ["web", "native"]) {
  test(platform + " actual Tailwind CSS resolves HeroUI text, surfaces and accent", async () => {
    const css = await readFile(new URL("../examples/app/global" + (platform === "native" ? ".native" : "") + ".css", import.meta.url), "utf8");
    const compiler = await compile(css, { base: appRoot, onDependency: () => {} });
    const iconColors = ["foreground", "muted", "accent", "success", "warning", "danger"];
    const result = compiler.build(["size-4", "size-5", "size-6", ...iconColors.map(color => "text-" + color), "bg-accent", "bg-surface", "bg-overlay", "bg-separator", "text-field-foreground", "accent-field-placeholder", "bg-accent03", "text-primary", "bg-card", "text-muted-foreground"]);
    const colors = generateUiThemeFromPrimaryColor("#2563eb").light;
    expect(result).toContain("--muted: " + colors.muted);
    expect(result).toContain("--accent: " + colors.accent);
    expect(result).toContain("--separator: " + colors.separator);
    expect(result).toContain("--separator: " + generateUiThemeFromPrimaryColor("#2563eb").dark.separator);
    expect(result).toContain(".bg-separator");
    // NativeList's RN TextInput bridge extracts accentColor for its placeholder.
    expect(result).toContain(".accent-field-placeholder");
    expect(result).toContain("accent-color: var(--field-placeholder, var(--muted))");
    expect(result).toContain(".text-muted");
    expect(result).toContain(".bg-accent03");
    expect(result).toContain("var(--muted)");
    for (const color of iconColors) expect(result).toContain(".text-" + color + " {");
    for (const size of [4, 5, 6]) expect(result).toContain(".size-" + size + " {");
    // Uniwind's generated local CSS may reserve removed variable names as unset
    // until the next Native bundle. The source and Web graph have no aliases.
    if (platform === "web") {
      expect(result).not.toContain(".text-primary {");
      expect(result).not.toContain(".bg-card {");
      expect(result).not.toContain(".text-muted-foreground {");
    }
  });
}

test("container backgrounds support partial scheme overrides without mutating defaults", () => {
  const standard = { ...getStandardAppBackgroundColors("light") };
  const config = { light: { screen: "#f0f0f0", sheet: "transparent" } };
  expect(resolveAppBackgroundColors("light", config)).toEqual({ ...standard, ...config.light });
  expect(resolveAppBackgroundColors("dark", config)).toEqual(getStandardAppBackgroundColors("dark"));
  expect(getStandardAppBackgroundColors("light")).toEqual(standard);
  expect(resolveAppBackgroundColors("light")).toEqual(standard);
});

test("loading old preferences drops backgroundFollowsTheme while keeping accent and mode", () => {
  const stored = JSON.parse('{"appearance":{"accentColor":"#12abef","themeMode":"dark","backgroundFollowsTheme":true}}');
  expect(resolveUiPreferences(stored)).toEqual({ appearance: { accentColor: "#12abef", themeMode: "dark" } });
  expect(resolveUiPreferences()).toEqual({ appearance: { accentColor: "ocean", themeMode: "system" } });
});

test("explicit scheme overrides effective preferences without changing saved preferences", () => {
  const preferences = { appearance: { accentColor: "ocean", themeMode: "system" } };
  expect(resolveUiPreferences(preferences, "dark").appearance.themeMode).toBe("dark");
  expect(preferences.appearance.themeMode).toBe("system");
  expect(resolveUiPreferences(preferences).appearance.themeMode).toBe("system");
});

test("isolated theme provider adaptive mode and live theme updates", async () => {
  const child = Bun.spawn([process.execPath, "test", "./test/heroui_theme_provider.fixture.jsx"], {
    cwd: new URL("../", import.meta.url).pathname,
    stdout: "pipe", stderr: "pipe",
  });
  const [code, stdout, stderr] = await Promise.all([
    child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
  ]);
  expect({ code, output: code === 0 ? "passed" : stdout + stderr }).toEqual({ code: 0, output: "passed" });
});
