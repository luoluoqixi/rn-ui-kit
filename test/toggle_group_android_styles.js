import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { compile } from "@tailwindcss/node";

// Compile with the installed Uniwind implementation, rather than mocking the
// logical corner names: RN 0.83 Android resolves them differently from iOS.
export async function androidCornerProbe() {
  const root = new URL("../", import.meta.url).pathname;
  const source = root + "node_modules/uniwind/src";
  const result = await Bun.build({
    entrypoints: [source + "/bundler/css-compiler/compileNativeCSS.ts"],
    target: "node", format: "cjs", packages: "external",
    plugins: [{ name: "uniwind-source-alias", setup(build) {
      build.onResolve({ filter: new RegExp("^@/") }, args => ({ path: Bun.resolveSync(source + "/" + args.path.slice(2), source) }));
    } }],
  });
  if (!result.success) throw new AggregateError(result.logs, "Cannot load installed Uniwind compiler");
  const module = { exports: {} };
  new Function("require", "module", "exports", await result.outputs[0].text())(createRequire(import.meta.url), module, module.exports);
  const compiler = await compile(await readFile(root + "examples/app/global.native.css", "utf8"), { base: root + "examples/app", onDependency() {} });
  const css = compiler.build(["rounded-s-none", "rounded-e-none", "rounded-t-none", "rounded-b-none"]);
  const artifact = new Function("rt", "return " + module.exports.compileNativeCSS({ platform: "android", themes: ["light", "dark"] }, css))({});
  const variables = { ...artifact.vars, ...artifact.scopedVars["__uniwind-theme-light"] };

  // Read the installed Android precedence expressions. Exercise LTR and default
  // RTL below; this probes mapping only, not device drawing/animation.
  const android = await readFile(root + "node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/uimanager/style/BorderRadiusStyle.kt", "utf8");
  const mappings = [...android.matchAll(/(topLeft|topRight|bottomLeft|bottomRight) =\s*\(([^)]+)\)\?\.let/g)];
  if (mappings.length !== 12) throw new Error("Android radius resolver changed; review this regression probe");
  return {
    style(className) {
      const entries = className.split(/\s+/).flatMap(name => artifact.stylesheet[name] ?? [])
        .flatMap(rule => rule.entries).filter(([key]) => /^border.*Radius$/.test(key));
      return Object.fromEntries(entries.map(([key, value]) => [key, value(variables)]));
    },
    resolve(style, direction = 0) {
      return Object.fromEntries(mappings.slice(direction * 4, direction * 4 + 4).map(([, corner, expression]) => {
        const keys = expression.split("?:").map(field => field.trim()).map(field => field === "uniform" ? "borderRadius" : "border" + field[0].toUpperCase() + field.slice(1) + "Radius");
        return [corner, keys.map(key => style[key]).find(value => value != null) ?? 0];
      }));
    },
  };
}
