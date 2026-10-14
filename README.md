# rn-ui-kit

[中文](./README.md) · [English](./README_EN.md)

[在线示例 (web)](https://rn-ui-kit.luoluoqixi.com/) · [截图 / Screenshots](./docs/SCREENSHOTS.md)

面向个人 Expo 项目的跨平台 UI 组件库。基础组件采用 React Native Reusables 的源码与 API，样式由 Uniwind 驱动；需要系统能力的组件继续由 rn-ui-kit 提供 iOS、Android 与 Web 平台实现。

> [!WARNING]
> 此库只服务于维护者自己的 App，不承诺通用组件库所需的 API 稳定性或版本兼容范围。

## 运行环境

| 技术 | 版本 |
| --- | --- |
| Expo | 55 |
| React Native | 0.83.9 |
| React / React DOM | 19.2.5 |
| Uniwind | 1.x |
| Tailwind CSS | 4.x |
| TypeScript | 5.9.2 |
| 包管理器 | Bun |

当前仅支持 Expo App，不支持裸 React Native CLI。React Native 及强相关原生依赖固定在根目录 [`package.json`](./package.json)；`@rn-primitives/*` 是 rn-ui-kit 的内部依赖，App 不需要直接声明。

## 接入 App

### 1. 安装

发布分支可以直接作为 Git 依赖安装：

```bash
bun add github:luoluoqixi/rn-ui-kit#rn-ui-kit-<version>
bun add uniwind tailwindcss
```

源码开发时可使用目录依赖：

```json
{
  "dependencies": {
    "rn-ui-kit": "link:../..",
    "tailwindcss": "^4.3.2",
    "uniwind": "^1.11.0"
  }
}
```

App 仍需安装 [`peerDependencies`](./package.json) 中列出的 Expo、React Native 和原生模块，以便 Expo autolinking 与原生 patch 正常工作。

### 2. 配置 Uniwind

在 App 根目录创建 `global.css`：

```css
@import "tailwindcss";
@import "uniwind";
@import "rn-ui-kit/styles.css";

@source "./src";
@source "./node_modules/rn-ui-kit/src";
@source "./node_modules/rn-ui-kit/dist";
```

源码目录依赖需要把后两条路径调整到实际位置。仓库示例使用：

```css
@source "../../src";
@source "../../dist";
```

Metro 配置：

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
});
```

在 App 入口最先加载初始化模块和 CSS：

```tsx
import "rn-ui-kit/initialize";
import "./global.css";
```

完整配置见 [`examples/app`](./examples/app)。项目不需要 RNR CLI、`components.json` 或其他 registry 配置。

### 3. Provider 与主题

```tsx
import { RootProvider, Text } from "rn-ui-kit";
import { View } from "react-native";

export default function App() {
  return (
    <RootProvider
      preferences={{
        appearance: {
          accentColor: "ocean",
          backgroundFollowsTheme: false,
          themeMode: "system",
        },
      }}
    >
      <View className="bg-background flex-1 items-center justify-center">
        <Text>你好，rn-ui-kit</Text>
      </View>
    </RootProvider>
  );
}
```

Toast 默认在 Android/iOS 使用 Burnt，Web 使用基础 Sonner Toast。可通过
`toasterProps.defaultNative` 统一覆盖；单次调用传入的 `native` 优先级更高：

```tsx
<RootProvider toasterProps={{ defaultNative: false }}>{children}</RootProvider>
```

主题使用 RNR New York 风格的语义变量，如 `background`、`primaryBackground`、`foreground`、`primary`、`accent`、`muted`、`card`、`popover`、`border` 与 `ring`。内置强调色只覆盖强调色相关字段，不提供旧式编号色阶；完整自定义主题可覆盖全部语义字段。

内置强调色：`mono`、`ocean`、`sakura`、`lavender`、`sunset`、`forest`、`ruby`、`golden`、`aqua`。

也可以通过 `UiThemeConfig` 传入完整的自定义主题。主题必须同时提供 `light` 和 `dark` 两套
`SemanticColors`，并可通过 `primaryBackground` 为“背景跟随主题”单独指定带主色调的应用背景；
原有的 `background` 字段不会被替换：

```tsx
const theme: UiThemeConfig = {
  light: { /* SemanticColors */ },
  dark: { /* SemanticColors */ },
};

<RootProvider theme={theme}>{children}</RootProvider>;
```

`RootProvider` 负责手势根节点、安全区、颜色模式、语义颜色、导航主题、Sheet、Portal、Toast、原生对话框和触觉反馈上下文。

## 组件

| 分类 | 组件 |
| --- | --- |
| 操作与反馈 | `Button`、`Checkbox`、`Switch`、`Toggle`、`ToggleGroup`、`Slider`、`Spinner`、`Progress`、`Toast`、`NativeDialog` |
| 表单 | `Input`、`Textarea`、`Select`、`RadioGroup`、`Label` |
| 布局与组合 | `Accordion`、`AspectRatio`、`Collapsible`、`Tabs`、`SplitView` / `SplitLayout`、`Card`、`Separator` |
| 弹层 | `Dialog`、`AlertDialog`、`ContextMenu`、`Dropdown`、`Menubar`、`Popover`、`Sheet` / `NativeSheet`、`Tooltip` |
| 列表与滚动 | `NativeList`、`ScrollView` |
| 展示 | `Alert`、`Avatar`、`Badge`、`Skeleton`、`Text`、`Icon`、`Link`、`GlassEffect` |
| 基础设施 | `RootProvider`、`UIProvider`、主题工具、导航工具、Portal 与平台工具 |

`Form`、`Image`、`ListGroup`、`ListItem`、`FlashList`、`HoverCard` 和旧 `Menu` API 已删除。`TextArea` 已更名为 `Textarea`，`Menu` 已更名为 `Dropdown`。

第一版迁移中，`Select`、`Slider` 与 `Spinner` 是保证公开类型和编译稳定的占位实现；Select/Slider 的旧源码保留在 `legacy/`，后续单独重构。非原生 Toast UI 同样暂不渲染，native Toast 继续使用 Burnt。

`Dropdown` 和 `ContextMenu` 在 Web 使用 RNR primitives，在 iOS/Android 使用共享的 Zeego 数据模型与原生实现。两者支持 compound API，也支持 rn-ui-kit 的 `items`、原生图标、haptics 与 native trigger 扩展。

## NativeList

`NativeList` 在 iOS 保留基于 `@expo/ui/swift-ui` 的系统列表实现；Android 和 Web 使用去框架化的 React Native fallback。列表仍支持 Section、输入项、开关项、菜单项、上下文菜单、下拉刷新和编辑模式多选。

Select 第一版为空实现，因此 `NativeListSelectItem` 只保留当前值展示和既有 iOS 系统菜单可覆盖的路径；完整 Select 行为会随 Select 独立重构补齐。

## 补丁同步

保留的原生 patch 通过现有命令同步到 App：

```bash
bun run sync-patches
```

App 可注册脚本：

```json
{
  "scripts": {
    "clear-patch-cache": "rn-ui-clear-patch-cache",
    "sync-patches": "rn-ui-sync-patches"
  }
}
```

同步器读取 rn-ui-kit 的 `patches/`，复制补丁并更新 App 的 `patchedDependencies`。可通过 `rnUiKitSyncPatches.exclude` 排除由 App 自己维护的同名 patch。清除 Bun patch 缓存前可运行 `bun run clear-patch-cache --dry-run` 查看目标。

## 开发

```bash
bun install
bun install --cwd examples/app
bun run typecheck
bun run build
bun run test
```

RNR CLI 的一次性源码快照位于被 Git 忽略的 `.temp/rnr-source`。正式源码不依赖 CLI；后续组件升级应从快照或 registry 源码人工对照。

主要入口：

- `rn-ui-kit`：core API
- `rn-ui-kit/debug`：调试页面
- `rn-ui-kit/initialize`：平台初始化
- `rn-ui-kit/styles.css`：语义变量与 RNR 样式基础
