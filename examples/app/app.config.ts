import { type ConfigContext, type ExpoConfig } from "expo/config";

import pkg from "./package.json";

const IOS_DEPLOYMENT_TARGET = "15.1";

// const bundleIdentifier = "com.luoluoqixi.rnuikitexample";
// const name = "rnuikit-dev";
const bundleIdentifier = "com.luoluoqixi.rnuikitexample.release";
const name = "rnuikit-release";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: name,
  slug: name,
  version: pkg.version,
  orientation: "default",
  scheme: name,
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
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          buildReactNativeFromSource: true,
          deploymentTarget: IOS_DEPLOYMENT_TARGET,
        },
      },
    ],
    [
      "./plugins/with-ios-pods-deployment-target.cjs",
      { deploymentTarget: IOS_DEPLOYMENT_TARGET },
    ],
    "./plugins/with-ios-scene-lifecycle.cjs",
    "./plugins/with-force-android-js-bundle.cjs",
  ],
  experiments: {
    typedRoutes: false,
    reactCompiler: true,
  },
});
