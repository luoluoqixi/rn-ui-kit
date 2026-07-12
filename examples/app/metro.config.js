const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  ...defaultConfig,
};

module.exports = config;
