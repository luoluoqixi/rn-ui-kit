// const path = require("node:path");

// const rnUiKitRoot = path.dirname(require.resolve("rn-ui-kit/package.json"));
// const compilerRoots = [path.join(__dirname, "src"), path.join(rnUiKitRoot, "src")].map(
//   (root) => `${path.resolve(root)}${path.sep}`,
// );

// function shouldCompileWithReactCompiler(filename) {
//   return typeof filename === "string" && compilerRoots.some((root) => filename.startsWith(root));
// }

// const babelPluginReactCompiler = [
//   "babel-plugin-react-compiler",
//   {
//     target: "19",
//     sources: shouldCompileWithReactCompiler,
//     customOptOutDirectives: ["use no memo", "use no forget", "widget"],
//     environment: {
//       enableResetCacheOnSourceFileChanges: process.env.NODE_ENV !== "production",
//     },
//   },
// ];

module.exports = function babelConfig(api) {
  api.cache(true);

  return {
    presets: [["babel-preset-expo", { jsxRuntime: "automatic" }]],
    plugins: [
      // 如果遇到 Slider 拖拽明显卡顿
      // 则说明 rn-ui-kit 并没有成功使用 reactCompiler 编译
      // 需要打开此注释解决卡顿问题
      // babelPluginReactCompiler,
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
          disableExtraction: process.env.NODE_ENV === "development",
        },
      ],
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-worklets/plugin",
    ],
  };
};
