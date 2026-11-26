# rn-ui-kit

[中文](./README.md) · [English](./README_EN.md)

[在线示例 (web)](https://rn-ui-kit.luoluoqixi.com/) · [2.0.0 跨平台截图 / Screenshots](./docs/SCREENSHOTS.md)

面向个人 Expo 项目的跨平台 UI 组件库。自绘 UI 在 iOS / Android 使用 **HeroUI Native**，Web 使用 **HeroUI React v3**，由 rn-ui-kit 提供简单的单入口 props API。Button、Switch、Slider、Select、菜单等已有的系统原生实现继续保留，Sheet 继续使用 TrueSheet。

> [!WARNING]
> 此库只服务于维护者自己的 App，不承诺通用组件库所需的 API 稳定性或版本兼容范围。

## 运行环境

| 技术 | 当前版本 |
| --- | --- |
| Expo | 55.0.26 |
| React Native | 0.83.9 |
| React / React DOM | 19.2.5 |
| HeroUI Native | 1.1.1 |
| HeroUI React / Styles | 3.2.7 |
| Reanimated / Worklets | 4.3.4 / 0.8.1 |
| TrueSheet | 4.1.2 |
| Uniwind / Tailwind CSS | 1.x / 4.x |
| TypeScript / 包管理器 | 5.9.2 / Bun |

当前仅支持 Expo App，不支持裸 React Native CLI。完整依赖和版本约束以根目录 [package.json](./package.json) 与示例 [package.json](./examples/app/package.json) 为准。

## 接入 App

### 1. 安装

发布分支可以直接作为 Git 依赖安装：

```bash
bun add github:luoluoqixi/rn-ui-kit#rn-ui-kit-<version>
bun add uniwind@^1.11.0 tailwindcss@^4.3.2
bun add -d @tailwindcss/postcss@4.3.2 postcss@8.5.23
```

两套 HeroUI 已由库声明为 dependencies。App 仍需安装 [peerDependencies](./package.json) 中列出的 Expo、React Native 和原生模块，以便 autolinking 与原生 patch 正常工作。安装后按下文同步补丁，并重新构建原生 App。

源码开发可使用 `rn-ui-kit` 的目录依赖 `link:../..`；链接工程的 Metro watchFolders / nodeModulesPaths 配置见 [examples/app/metro.config.js](./examples/app/metro.config.js)。

### 2. 配置双平台样式

App 根目录的 `global.css` 只加载 Web 样式：

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "rn-ui-kit/styles.css";

@custom-variant light (&:where(.light, .light *));
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --spacing-hairline: 1px;
}

@source "./src";
@source "./node_modules/rn-ui-kit/src";
```

另建 `global.native.css`：

```css
@import "tailwindcss";
@import "uniwind";
@import "heroui-native/styles";
@import "rn-ui-kit/styles.css";

@source "./src";
@source "./node_modules/rn-ui-kit/src";
```

链接源码时把库的 `@source` 路径调整到真实位置；本仓库示例使用 `../../src`。Native 入口中的前三个包导入必须放在同一个文件中，以满足 Uniwind 的主题扫描约束。

配置 `metro.config.js`：

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withHeroUIConfig } = require("rn-ui-kit/metro");

module.exports = withHeroUIConfig(getDefaultConfig(__dirname), {
  cssEntryFile: "./global.css",
  nativeCssEntryFile: "./global.native.css",
  dtsFile: "./uniwind-types.d.ts",
});
```

配置 `postcss.config.js`：

```js
module.exports = { plugins: { "@tailwindcss/postcss": {} } };
```

入口最先加载初始化模块和 CSS：

```tsx
import "rn-ui-kit/initialize";
import "./global.css";
```

App 始终导入同一 `global.css`，Metro 助手在 iOS / Android 将其解析到 Native 文件。Web 不加载 HeroUI Native 的 JS 或 CSS；Native 不加载 HeroUI React / Styles。两套依赖仍安装在 node_modules 中，隔离在模块解析和样式编译阶段完成。Web 保留 Uniwind 的 RN Web 适配运行时。

### 3. Provider 与主题

```tsx
import { RootProvider, Button, Text } from "rn-ui-kit";
import { View } from "react-native";

export default function App() {
  return (
    <RootProvider
      preferences={{ appearance: { accentColor: "ocean", themeMode: "system" } }}
    >
      <View className="bg-background flex-1 items-center justify-center gap-4">
        <Text>你好，rn-ui-kit</Text>
        <Button native={false} title="继续" onPress={() => {}} />
      </View>
    </RootProvider>
  );
}
```

通常只需挂载一个 `RootProvider`，`preferences` 由 App 管理并传入。主题沿用 HeroUI 语义变量，支持内置强调色和自定义明暗主题。Provider 边界、主题生成与容器背景配置见 [Provider 与主题](./docs/provider_and_theme.md)。

## 组件

| 分类 | 组件 |
| --- | --- |
| 操作与反馈 | `Button`、`CloseButton`、`Switch`、`Slider`、`Toggle`、`ToggleGroup`、`PressableFeedback`、`Spinner`、`Progress`、`Toast` |
| 表单 | `Input`、`InputGroup`、`InputOTP`、`TextField`、`SearchField`、`Textarea`、`Checkbox`、`RadioGroup`、`Select`、`Label` |
| 布局与导航 | `Accordion`、`Card`、`Surface`、`Separator`、`Tabs`、`SplitView` / `SplitLayout` |
| 弹层与菜单 | `Dialog`、`AlertDialog`、`Popover`、`Tooltip`、`Dropdown`、`ContextMenu`、`Menubar`、`Sheet` / `NativeSheet`、`NativeDialog` |
| 列表与滚动 | `ListGroup`、`NativeList`、`ScrollView`、`ScrollShadow`、`TagGroup` |
| 展示 | `Alert`、`Avatar`、`Badge`、`Chip`、`Skeleton`、`Text`、`Icon`、`Link`、`GlassEffect`、`ColorPicker` |

组件采用单入口 props API。`native` 表示系统原生实现；各组件的默认值、可用模式与平台属性以导出的 TypeScript 类型为准。使用差异与专项配置见 [组件使用说明](./docs/components.md)。

## 补丁同步

```bash
bun run sync-patches
```

在宿主 App 可使用 `rn-ui-sync-patches` / `rn-ui-clear-patch-cache` 命令。同步器从库的 `patches/` 复制补丁并更新 App 的 `patchedDependencies`；通过 `rnUiKitSyncPatches.exclude` 排除由 App 自己维护的同名 patch。TrueSheet 与 HeroUI Native 等补丁仍是接入的一部分，不应随迁移完成删除。

清除 Bun patch 缓存前可运行 `bun run clear-patch-cache --dry-run` 查看目标。修改补丁前阅读 [Bun patch 注意事项](./docs/patch/bun_same_file_hunk_offset.md)。

## 开发与验证

```bash
bun install --frozen-lockfile
bun install --cwd examples/app --frozen-lockfile
bun run typecheck
bun run build
bun test test
```

示例启动：`cd examples/app && bun run start --clear`。生产导出及三端模块隔离检查命令见 [开发说明](./docs/dev.md)。自动化测试和 Expo JS / CSS 导出不替代原生编译或真机交互验收。

主要入口：

- `rn-ui-kit` / `rn-ui-kit/core`：组件、主题与工具
- `rn-ui-kit/debug`：调试与组件示例页面
- `rn-ui-kit/initialize`：平台初始化
- `rn-ui-kit/styles.css`：共用语义变量与 Portal / scrollbar 辅助样式
- `rn-ui-kit/metro`：双平台 CSS 与 HeroUI 模块隔离配置

## 更多文档

- [Provider 与主题](./docs/provider_and_theme.md)
- [组件使用说明](./docs/components.md)
- [开发说明](./docs/dev.md)
- [HeroUI 迁移记录](./docs/heroui-migration.md)
