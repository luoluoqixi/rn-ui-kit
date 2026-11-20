const path = require("node:path");
const { createRequire } = require("node:module");

function assertHeroUIPlatform(moduleName, platform) {
  const name = moduleName.replaceAll("\\", "/");
  const isNative = /(^|\/)heroui-native(\/|$)/.test(name);
  const isWeb = /(^|\/)@heroui\/(react|styles)(\/|$)/.test(name);
  if ((platform === "web" && isNative) ||
      ((platform === "ios" || platform === "android") && isWeb)) {
    throw new Error(`[rn-ui-kit] HeroUI platform boundary: ${moduleName} cannot enter the ${platform} bundle.`);
  }
}

/** Keep one Expo server: Web CSS uses PostCSS; only Native CSS enters Uniwind. */
function withHeroUIConfig(config, { cssEntryFile, nativeCssEntryFile, ...uniwindOptions }) {
  const root = config.projectRoot ?? process.cwd();
  // A linked library and its example can each have Uniwind installed. Its
  // resolver, transformer and generated CSS must all come from the host copy.
  const requireFromProject = createRequire(path.join(root, "package.json"));
  const { withUniwindConfig } = requireFromProject("uniwind/metro");
  const webCssPath = path.resolve(root, cssEntryFile);
  const nativeCssPath = path.resolve(root, nativeCssEntryFile);
  const previousResolver = config.resolver?.resolveRequest;
  const platformConfig = {
    ...config,
    resolver: {
      ...config.resolver,
      resolveRequest(context, moduleName, platform) {
        assertHeroUIPlatform(moduleName, platform);
        const resolve = previousResolver ?? context.resolveRequest;
        const result = resolve(context, moduleName, platform);
        if (result.type !== "sourceFile") return result;
        assertHeroUIPlatform(result.filePath, platform);
        if (platform !== "web" && result.filePath === webCssPath) {
          return { ...result, filePath: nativeCssPath };
        }
        return result;
      },
    },
  };
  return withUniwindConfig(platformConfig, {
    ...uniwindOptions,
    // Uniwind 1.x resolves this option against cwd, not projectRoot.
    cssEntryFile: path.relative(process.cwd(), nativeCssPath),
  });
}

module.exports = { assertHeroUIPlatform, withHeroUIConfig };
