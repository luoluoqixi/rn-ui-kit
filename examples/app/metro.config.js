const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const fs = require("node:fs");
const path = require("node:path");

const isProd = process.env.NODE_ENV === "production";
console.log(`metro prod: ${isProd}`);

const defaultConfig = getDefaultConfig(__dirname);
const repoRoot = path.resolve(__dirname, "../..");
const expoUiPackagePath = path.resolve(
  repoRoot,
  "node_modules/@luoluoqixi/expo-ui-55",
);
const linkedExpoUiPath = fs.existsSync(expoUiPackagePath)
  ? fs.realpathSync(expoUiPackagePath)
  : undefined;

const config = {
  ...defaultConfig,
  watchFolders: [
    repoRoot,
    ...(linkedExpoUiPath != null && linkedExpoUiPath !== repoRoot
      ? [linkedExpoUiPath]
      : []),
  ],
  resolver: {
    ...defaultConfig.resolver,
    disableHierarchicalLookup: true,
    nodeModulesPaths: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(repoRoot, "node_modules"),
    ],
  },
};

if (isProd) {
  config.cacheStores = [];
}

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
});
