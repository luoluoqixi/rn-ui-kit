const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const isProd = process.env.NODE_ENV === "production";
console.log(`metro prod: ${isProd}`);

const defaultConfig = getDefaultConfig(__dirname);
const repoRoot = path.resolve(__dirname, "../..");

const config = {
  ...defaultConfig,
  watchFolders: [repoRoot],
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

module.exports = config;
