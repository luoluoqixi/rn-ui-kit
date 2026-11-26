# 组件使用说明

组件目录与基础接入见 [README](../README.md#组件)，完整属性以各组件导出的 TypeScript 类型为准。

## API 与平台差异

- 组件默认采用单入口 props API；平台专用类型和能力放在 `herouiNativeProps / herouiWebProps` 等对应入口。旧 RNR 专属参数不作为兼容目标。
- `Badge` 是依附内容的角标或状态点，例如 `<Badge content={5}><Avatar alt="用户" /></Badge>`；独立标签使用 `Chip`。
- `TextField` / `SearchField` 组合标签、说明、校验与输入控件；`Input` 适合只需要输入本身的场景。
- Dropdown、ContextMenu、Menubar 的自绘路径共享内部 HeroUI 菜单渲染层。Native ContextMenu 默认长按并相对 trigger 居中，`anchor="touch"` 显式启用触点定位。Web 使用右键 / 键盘触发。
- `native` 表示系统原生实现，不表示所有 Native 平台上的 HeroUI 实现。Button、Switch、Slider、Select、Dropdown、ContextMenu 等已有系统原生路径及 NativeTrigger 均保留；各组件的默认值与可用模式以自身类型为准。
- Select 保留 `wheel / native / dropdown / dialog / sheet` 等已有模式；Sheet 继续使用 TrueSheet。弹层在根页面、Sheet、Dialog 中沿用窗口定位与分层宿主。
- Native Tooltip 直接渲染 children；Native Progress、Toggle、ContextMenu / Menubar 等在官方组件之外补齐所需能力。Icon 保留 Lucide + Uniwind，ColorPicker 保留 reanimated-color-picker。
- NativeList 在 iOS 使用 `@luoluoqixi/expo-ui-55` 的 SwiftUI 实现；Android / Web 使用自定义 React Native basic 布局，未替换为 ListGroup。保留 Section、输入项、开关项、菜单、刷新和编辑模式。
  Basic 分区的主题圆角、阴影及 `basicPressFeedback` 延迟反馈配置见 [NativeList basic](./native_list_basic.md)。

## Toast

Toast 在 iOS / Android 默认使用 Burnt；Web 与 `native: false` 的自绘路径均使用 HeroUI。可通过 `toasterProps={{ defaultNative: false }}` 修改默认值，单次调用的 `native` 优先。既有调用 API 与 `sonnerOptions / sonnerNativeOptions` 等兼容参数仍由本库适配，运行时已无 Sonner 依赖。

## NativeList 与 TrueSheet 的底部布局

在本库 NativeSheet / TrueSheet 布局上下文中，iOS 原生 NativeList 的可滚动根列表默认延伸到底部容器边缘，保留顶部导航栏和键盘安全区处理，无需在示例页面单独配置。`nestedScrollEnabled` 的内嵌列表及普通页面不启用此默认行为。可显式覆盖：

```tsx
// 恢复系统对列表视口底部安全区的避让
<NativeList iosIgnoreBottomSafeArea={false}>{/* sections / items */}</NativeList>
```

`iosIgnoreBottomSafeArea` 仅影响 iOS 原生列表，Android、Web 和 basic 实现忽略。它使用 SwiftUI 的底部 container 安全区 modifier，不忽略顶部或 keyboard 区域。TrueSheet v4 已提供正确的容器高度，列表不再额外按窗口坐标裁剪高度，避免缩放的 Sheet 中底部出现固定空白带。

列表**视口**延伸到底部与**内容末尾留白**是两件事：Sheet 内列表仍保留底部安全区 + 24pt 的滚动内容间距，让最后一行可以滚到安全的可操作位置；这段间距只在滚到末尾时出现，不会在滚动过程中一直截断列表。`contentMarginBottom` 调整内容末尾间距，不能扩展列表视口。

iOS 导航行的触摸、选中态和返回动画问题另见 [排查与修复记录](./native_list_ios_selection.md)。

## 旧组件迁移

`AspectRatio`、`Collapsible` 已删除，分别使用容器 `aspectRatio` 样式和单项 Accordion。旧 `Form`、`Image`、`ListItem`、`FlashList`、`HoverCard` 与旧 `Menu` API 不再导出；`TextArea` 更名为 `Textarea`，菜单入口使用 `Dropdown`。新 `ListGroup` 是独立的 HeroUI 封装。

完整迁移过程与兼容边界见 [HeroUI 迁移记录](./heroui-migration.md)。
