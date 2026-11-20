import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { assertHeroUIPlatform } from "./metro/heroui.cjs";

export function collectSources(map) {
  return [...(map.sources ?? []), ...(map.sections ?? []).flatMap(section => collectSources(section.map))];
}

export function checkHeroUIBundle(platform, outputDirectory) {
  if (!["web", "ios", "android"].includes(platform)) {
    throw new Error("Usage: node scripts/check-heroui-bundle.mjs <web|ios|android> <Expo export directory>");
  }
  const directory = path.resolve(outputDirectory);
  const sources = new Set();
  function visit(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (file.endsWith(".map") && file.split(path.sep).includes(platform)) {
        collectSources(JSON.parse(fs.readFileSync(file, "utf8"))).forEach(source => sources.add(source));
      }
    }
  }
  visit(directory);
  if (!sources.size) throw new Error(`No ${platform} source map modules found in ${directory}. Export with --source-maps.`);
  for (const source of sources) assertHeroUIPlatform(source, platform);
  const expected = platform === "web" ? /(^|\/)@heroui\/react\// : /(^|\/)heroui-native\//;
  const herouiModules = [...sources].filter(source => expected.test(source.replaceAll("\\", "/")));
  if (!herouiModules.length) throw new Error(`No actual HeroUI ${platform} modules found; an empty integration is not a passing check.`);
  return { platform, modules: sources.size, herouiModules: herouiModules.length, forbiddenModules: 0 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [platform, directory] = process.argv.slice(2);
  if (!directory) throw new Error("Supply a platform and Expo export directory.");
  console.log(JSON.stringify(checkHeroUIBundle(platform, directory), null, 2));
}
