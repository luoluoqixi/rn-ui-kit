import { type ConfigContext, type ExpoConfig } from "expo/config";

import pkg from "./package.json";

const bundleIdentifier = "com.luoluoqixi.rnuikitexample";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "rn_ui_kit example",
  slug: "rn-ui-kit-example",
  version: pkg.version,
  orientation: "default",
  scheme: "rn-ui-kit-example",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier,
    infoPlist: {
      UIViewControllerBasedStatusBarAppearance: true,
    },
  },
  android: {
    predictiveBackGestureEnabled: false,
    package: bundleIdentifier,
  },
  web: {
    bundler: "metro",
    output: "single",
  },
  experiments: {
    typedRoutes: false,
    reactCompiler: false,
  },
});
