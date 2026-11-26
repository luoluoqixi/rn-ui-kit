# Provider 与主题

基础接入示例见 [README](../README.md#3-provider-与主题)。本文说明 Provider 边界、语义变量和自定义主题配置。

## Provider 边界

`RootProvider` 安装手势根节点、安全区、字体、键盘、主题、导航主题、Sheet、Portal、Toast、原生对话框与触觉反馈上下文。通常只需挂载一个。已自行配置手势、安全区、导航主题和 SheetProvider 的宿主可按需使用较低层的 `UIProvider`；它本身不替代这四项。`preferences` 由 App 管理并传入，Provider 不负责持久化。

## 语义变量与组件尺寸

主题使用 HeroUI 语义：`background / foreground`、`surface / surfaceForeground`、`overlay / overlayForeground`、`accent / accentForeground`、`default / defaultForeground`、`danger / dangerForeground`、`fieldBackground / fieldForeground / fieldPlaceholder` 等。JS 字段为 camelCase，CSS 源变量为 kebab-case，例如 `fieldPlaceholder` 对应 `--field-placeholder` 与 `text-field-placeholder`。`muted` 表示弱文字色；次级背景使用 `surfaceSecondary` / `bg-surface-secondary`。

组件 variant、尺寸、圆角和交互反馈遵循对应 HeroUI 组件，Button 使用 `primary / secondary / tertiary / outline / ghost / danger / danger-soft`、`sm / md / lg`。不存在强制所有组件共用的全局 size 表。系统原生控件、NativeTrigger 等保留自己的布局和尺寸能力。

## 强调色与自定义主题

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

## 应用容器背景

主题 seed 不染色应用容器背景。使用 `appBackgroundColors` 按明暗模式覆盖容器层级，单个 Sheet 或页面也可传自己的背景属性：

```tsx
<RootProvider appBackgroundColors={{
  light: { screen: "#f2f2f7", sheet: "#f2f2f7" },
  dark: { screen: "#0e0e0e", header: "#1c1c1e" },
}}>{children}</RootProvider>
```

只需配置要覆盖的 `screen / sheet / card / header`，其余使用默认值。旧 `backgroundFollowsTheme` 已移除。全局语义变量同步到 Web 根节点和 Native Uniwind，使 body portal 与 Native 弹层使用同一配色；不提供多个全局主题根相互隔离的保证。
