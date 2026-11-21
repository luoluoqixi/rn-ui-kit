# rn-ui-kit

[中文](./README.md) · [English](./README_EN.md)

[在线示例 (web)](https://rn-ui-kit.luoluoqixi.com/) · [截图 / Screenshots](./docs/SCREENSHOTS.md)

> `dev-heroui` 分支正在迁移 HeroUI。该分支的双平台样式/Metro 接入、验证入口及迁移边界见 [HeroUI 迁移说明](./docs/heroui-migration.md)；下方原有 Uniwind 接入片段尚未覆盖新的双入口配置。

面向个人 Expo 项目的跨平台 UI 组件库。基础组件源自 React Native Reusables，当前在 dev-heroui 分支逐步迁移到 HeroUI，样式由 Uniwind 驱动；需要系统能力的组件继续由 rn-ui-kit 提供 iOS、Android 与 Web 平台实现。

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

主题采用 HeroUI 语义：背景与正文为 `background / foreground`，普通容器为 `surface`，弹层为 `overlay`，主操作色为 `accent`，弱文字为 `muted`，危险状态为 `danger`。不要将 `muted` 用作背景色；次级背景使用 `surfaceSecondary` / `bg-surface-secondary`。配对文字色使用 `accentForeground`、`surfaceForeground` 等。旧的 `primary / card / popover / mutedForeground / destructive / ring` token 已移除，组件的 variant 名称没有因此改变。

`accent01`～`accent12` 作为主色色阶保留，light 逐渐加深、dark 逐渐提亮；可通过 `useUiTheme().accent03` 或 `bg-accent03` 使用。`accent` 本身现在表示实色主操作色；轻染交互背景使用 HeroUI 的 `bg-accent-soft`。圆角沿用对应 HeroUI 平台的默认比例。

内置强调色：`mono`、`ocean`、`sakura`、`lavender`、`sunset`、`forest`、`ruby`、`golden`、`aqua`。`accentColor` 也接受不透明的 `#RGB / #RRGGBB` 自定义颜色。

完整自定义主题推荐从 `generateUiThemeFromPrimaryColor()` 扩展，light/dark 均提供 `SemanticColors`：

```tsx
const generated = generateUiThemeFromPrimaryColor("#7c3aed");
const theme: UiThemeConfig = {
  light: { ...generated.light, surface: "#ffffff" },
  dark: { ...generated.dark, surface: "#18181b" },
};
<RootProvider theme={theme}>{children}</RootProvider>;
```

`backgroundFollowsTheme` 已删除，旧偏好读取时丢弃这个字段。主题 seed 不会再染色屏幕/Sheet 背景。应用容器背景由 `appBackgroundColors` 按明暗模式覆盖，单个 Sheet 或页面也可以传自己的背景属性；默认保持中性背景及 iOS 原有玻璃行为：

```tsx
<RootProvider appBackgroundColors={{
  light: { screen: "#f2f2f7", sheet: "#f2f2f7" },
  dark: { screen: "#0e0e0e", header: "#1c1c1e" },
}}>{children}</RootProvider>
```

这里只需配置要覆盖的层级，其余 `screen / sheet / card / header` 使用默认值。全局主题变量会同步到 Web 根节点与 Native Uniwind，保证 body portal 与 HeroUI 原生弹层使用相同语义色。一个应用保持一个全局 RootProvider；这里不提供多个根主题相互隔离的保证。

非原生 `Button` 的 `default` / `destructive` 基于各自背景计算不透明的交互背景：light/dark 下均在 hover 混入 6% 白色，按下混入 12% 白色，让按下比 hover 更浅；文字保留配对色。按下优先于 hover，禁用和 loading 时不产生交互变色；显式 `style` 可覆盖这些背景。计算支持不透明 hex、RGB/HSL 颜色，透明色或无法解析的动态颜色保留原背景。

`dangerForeground` 是 `danger` 的配对文字色，由主题生成器的 Material `onError` 提供，并可通过 `text-danger-foreground` 使用。完整自定义主题需在 light/dark 中提供该字段，或基于 `generateUiThemeFromPrimaryColor()` 的结果扩展。原生 Button 继续使用系统反馈。

`RootProvider` 负责手势根节点、安全区、颜色模式、语义颜色、导航主题、Sheet、Portal、Toast、原生对话框和触觉反馈上下文。

## 组件

| 分类 | 组件 |
| --- | --- |
| 操作与反馈 | `Button`、`Checkbox`、`Switch`、`Toggle`、`ToggleGroup`、`Slider`、`Spinner`、`Progress`、`Toast`、`NativeDialog` |
| 表单 | `Input`、`Textarea`、`Select`、`RadioGroup`、`Label` |
| 布局与组合 | `Accordion`、`Tabs`、`SplitView` / `SplitLayout`、`Card`、`Separator` |
| 弹层 | `Dialog`、`AlertDialog`、`ContextMenu`、`Dropdown`、`Menubar`、`Popover`、`Sheet` / `NativeSheet`、`Tooltip` |
| 列表与滚动 | `NativeList`、`ScrollView` |
| 展示 | `Alert`、`Avatar`、`Badge`、`Skeleton`、`Text`、`Icon`、`Link`、`GlassEffect` |
| 基础设施 | `RootProvider`、`UIProvider`、主题工具、导航工具、Portal 与平台工具 |

`Form`、`Image`、`ListGroup`、`ListItem`、`FlashList`、`HoverCard` 和旧 `Menu` API 已删除。`TextArea` 已更名为 `Textarea`，`Menu` 已更名为 `Dropdown`。

HeroUI 迁移分支已接入 `Accordion`、`Card`、`Alert`、`Avatar`、`Badge`（底层为 Chip）。这些组件使用单入口 props API，Native / Web 分别采用各自的 HeroUI 实现；旧 RNR 专属参数不再保留。`AspectRatio` 已删除，固定比例布局直接使用容器的 `aspectRatio` 样式；`Collapsible` 已删除，基础内容展开/收起使用单项 `Accordion`。具体 API 与验证记录见 [HeroUI 迁移文档](docs/heroui-migration.md)。

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
