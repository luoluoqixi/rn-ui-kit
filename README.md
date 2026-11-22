# rn-ui-kit

[中文](./README.md) · [English](./README_EN.md)

[在线示例 (web)](https://rn-ui-kit.luoluoqixi.com/) · [截图 / Screenshots](./docs/SCREENSHOTS.md)

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

`RootProvider` 安装手势根节点、安全区、字体、键盘、主题、导航主题、Sheet、Portal、Toast、原生对话框与触觉反馈上下文。通常只需挂载一个。已自行配置手势、安全区、导航主题和 SheetProvider 的宿主可按需使用较低层的 `UIProvider`；它本身不替代这四项。`preferences` 由 App 管理并传入，Provider 不负责持久化。

主题使用 HeroUI 语义：`background / foreground`、`surface / surfaceForeground`、`overlay / overlayForeground`、`accent / accentForeground`、`default / defaultForeground`、`danger / dangerForeground`、`fieldBackground / fieldForeground / fieldPlaceholder` 等。JS 字段为 camelCase，CSS 源变量为 kebab-case，例如 `fieldPlaceholder` 对应 `--field-placeholder` 与 `text-field-placeholder`。`muted` 表示弱文字色；次级背景使用 `surfaceSecondary` / `bg-surface-secondary`。

组件 variant、尺寸、圆角和交互反馈遵循对应 HeroUI 组件，Button 使用 `primary / secondary / tertiary / outline / ghost / danger / danger-soft`、`sm / md / lg`。不存在强制所有组件共用的全局 size 表。系统原生控件、NativeTrigger 等保留自己的布局和尺寸能力。

内置强调色：`mono`、`ocean`、`sakura`、`lavender`、`sunset`、`forest`、`ruby`、`golden`、`aqua`，也接受不透明的 `#RGB / #RRGGBB`。项目扩展 `accent01`～`accent12` 继续可用，light 逐渐加深、dark 逐渐提亮；它们不是 HeroUI 标准 token。

完整自定义主题推荐基于生成器扩展：

```tsx
import { generateUiThemeFromPrimaryColor, type UiThemeConfig } from "rn-ui-kit";

const generated = generateUiThemeFromPrimaryColor("#7c3aed");
const theme: UiThemeConfig = {
  light: { ...generated.light, surface: "#ffffff" },
  dark: { ...generated.dark, surface: "#18181b" },
};
// <RootProvider theme={theme}>{children}</RootProvider>
```

主题 seed 不染色应用容器背景。使用 `appBackgroundColors` 按明暗模式覆盖容器层级，单个 Sheet 或页面也可传自己的背景属性：

```tsx
<RootProvider appBackgroundColors={{
  light: { screen: "#f2f2f7", sheet: "#f2f2f7" },
  dark: { screen: "#0e0e0e", header: "#1c1c1e" },
}}>{children}</RootProvider>
```

只需配置要覆盖的 `screen / sheet / card / header`，其余使用默认值。旧 `backgroundFollowsTheme` 已移除。全局语义变量同步到 Web 根节点和 Native Uniwind，使 body portal 与 Native 弹层使用同一配色；不提供多个全局主题根相互隔离的保证。

Toast 在 iOS / Android 默认使用 Burnt；Web 与 `native: false` 的自绘路径均使用 HeroUI。可通过 `toasterProps={{ defaultNative: false }}` 修改默认值，单次调用的 `native` 优先。既有调用 API 与 `sonnerOptions / sonnerNativeOptions` 等兼容参数仍由本库适配，运行时已无 Sonner 依赖。

## 组件

| 分类 | 组件 |
| --- | --- |
| 操作与反馈 | `Button`、`CloseButton`、`Switch`、`Slider`、`Toggle`、`ToggleGroup`、`PressableFeedback`、`Spinner`、`Progress`、`Toast` |
| 表单 | `Input`、`InputGroup`、`InputOTP`、`TextField`、`SearchField`、`Textarea`、`Checkbox`、`RadioGroup`、`Select`、`Label` |
| 布局与导航 | `Accordion`、`Card`、`Surface`、`Separator`、`Tabs`、`SplitView` / `SplitLayout` |
| 弹层与菜单 | `Dialog`、`AlertDialog`、`Popover`、`Tooltip`、`Dropdown`、`ContextMenu`、`Menubar`、`Sheet` / `NativeSheet`、`NativeDialog` |
| 列表与滚动 | `ListGroup`、`NativeList`、`ScrollView`、`ScrollShadow`、`TagGroup` |
| 展示 | `Alert`、`Avatar`、`Badge`、`Chip`、`Skeleton`、`Text`、`Icon`、`Link`、`GlassEffect`、`ColorPicker` |

- 组件默认采用单入口 props API；平台专用类型和能力放在 `herouiNativeProps / herouiWebProps` 等对应入口。旧 RNR 专属参数不作为兼容目标。
- `Badge` 是依附内容的角标或状态点，例如 `<Badge content={5}><Avatar alt="用户" /></Badge>`；独立标签使用 `Chip`。
- `TextField` / `SearchField` 组合标签、说明、校验与输入控件；`Input` 适合只需要输入本身的场景。
- Dropdown、ContextMenu、Menubar 的自绘路径共享内部 HeroUI 菜单渲染层。Native ContextMenu 默认长按并相对 trigger 居中，`anchor="touch"` 显式启用触点定位。Web 使用右键 / 键盘触发。
- `native` 表示系统原生实现，不表示所有 Native 平台上的 HeroUI 实现。Button、Switch、Slider、Select、Dropdown、ContextMenu 等已有系统原生路径及 NativeTrigger 均保留；各组件的默认值与可用模式以自身类型为准。
- Select 保留 `wheel / native / dropdown / dialog / sheet` 等已有模式；Sheet 继续使用 TrueSheet。弹层在根页面、Sheet、Dialog 中沿用窗口定位与分层宿主。
- Native Tooltip 直接渲染 children；Native Progress、Toggle、ContextMenu / Menubar 等在官方组件之外补齐所需能力。Icon 保留 Lucide + Uniwind，ColorPicker 保留 reanimated-color-picker。
- NativeList 在 iOS 使用 `@luoluoqixi/expo-ui-55` 的 SwiftUI 实现；Android / Web 使用自定义 React Native basic 布局，未替换为 ListGroup。保留 Section、输入项、开关项、菜单、刷新和编辑模式。

`AspectRatio`、`Collapsible` 已删除，分别使用容器 `aspectRatio` 样式和单项 Accordion。旧 `Form`、`Image`、`ListItem`、`FlashList`、`HoverCard` 与旧 `Menu` API 不再导出；`TextArea` 更名为 `Textarea`，菜单入口使用 `Dropdown`。新 `ListGroup` 是独立的 HeroUI 封装。

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
