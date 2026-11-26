# NativeList basic：外观与按压反馈

更新日期：2026-11-26。本文只说明 Android、Web 及 iOS `native={false}` 使用的 basic 实现。iOS 默认的 SwiftUI List 继续保留自己的外观和 `iosPressFeedback` 行为。

## 分区外观

NativeList 继续使用现有自定义布局，不将 Section、Item 替换为 ListGroup。它保留输入项、NativeTrigger、编辑模式、上下文菜单、导航选中和自定义行等能力，只让分区外壳采用 HeroUI 的视觉 token。

| `listStyle` | 圆角 | 水平间距 | 默认阴影 |
| --- | --- | --- | --- |
| `rounded`，默认 | `rounded-3xl` | 保留原间距 | `shadow-surface` |
| `plain` | 无圆角 | 保留原间距 | `shadow-surface` |
| `plainFullWidth` | 无圆角 | 分区通栏 | `shadow-surface` |

`rounded-3xl` 对应 HeroUI 的 `--radius-3xl`，即主题 `--radius` 的三倍。默认主题下为 24，但组件使用 class 读取主题，不把 24 写进行内样式。因此宿主调整主题圆角时，列表会同步变化。导出的 `NATIVE_LIST_BASIC_STYLE_DEFAULTS.borderRadius` 仅保留为默认主题的数值参考，不代表运行时自定义主题的圆角。

`shadow-surface` 使用各端 HeroUI 的 surface 阴影。默认浅色主题是轻阴影，默认深色主题不显示阴影。外层负责阴影，内层负责圆角裁剪，避免阴影被自身裁掉。无圆角分区继续保留 `overflow: visible`，避免 Android 原生菜单容器被裁剪而隐藏行。

行背景继续使用项目的 card 容器色，并保留 Root 的 `rowBackgroundColor` 与单行 `backgroundColor` 覆盖。分割线的算法、颜色、宽度、内缩和平台处理均未修改。

已有显式覆盖继续生效：

```tsx
<NativeList
  native={false}
  listStyle="rounded"
  listStyleOptions={{
    borderRadius: 16,
    sectionShadow: false,
  }}
>
  {/* sections / items */}
</NativeList>
```

`sectionShadow` 也可传入 `ViewStyle`，此时关闭默认 surface 阴影，使用调用方的样式。数值 `borderRadius` 会覆盖主题圆角，包括 plain 样式下的零圆角。

## 延迟按压反馈

```tsx
// 显式延迟反馈：按住约 130ms 后显示；Android / iOS basic 默认此模式
<NativeList native={false} basicPressFeedback="automatic">
  {/* sections / items */}
</NativeList>

// 立即反馈：Web 默认此模式
<NativeList native={false} basicPressFeedback="immediate">
  {/* sections / items */}
</NativeList>
```

未传 `basicPressFeedback` 时，Web 默认 `immediate`，Android / iOS basic 默认 `automatic`。显式传入任一模式始终优先于平台默认值。

- `automatic`：将行 Pressable 的反馈激活延迟设为 130ms。若滚动或其他 responder 在激活前接管触摸并取消按压，就不显示按压背景；取消后也不会补亮。
- `immediate`：激活延迟为零，保留此前的即时反馈。
- 延迟的是反馈激活，不是点击事件。快速轻点仍在松手时触发 `onPress`，不额外等待 130ms。
- 激活前快速松手，Pressable 可能在确认点击时短暂显示一次反馈；这属于有效点击，与开始拖拽时闪色不同。
- 已显示反馈后再滚动，由原有 Pressable 取消流程清除反馈。
- 持续按住不会因为本功能而超时清理。没有实际菜单时，不额外注册长按回调；有菜单时仍保留原有菜单长按行为。
- Web 原有鼠标 hover 反馈保持即时；此参数控制 pressed 反馈，不延迟 hover。

标准行和 CustomItem 都从 Root 继承设置；通过标准行实现的 Action、Navigation、Button、Switch 等行同样受控。Select / Dropdown 行原有的按压透明度也跟随该延迟。内嵌的 Switch、Input、Select Trigger 等控件直接接收到的操作仍由控件自身处理，本参数不会接管子控件事件。编辑选中、菜单打开态和导航返回前保留的选中态也不会被这个延迟重写。

`basicPressFeedback` 与 `iosPressFeedback` 独立：

| 实现 | 有效参数 |
| --- | --- |
| iOS 原生 SwiftUI List，默认 | `iosPressFeedback` |
| iOS `native={false}`、Android、Web | `basicPressFeedback` |

本功能不强制修改 ScrollView 的 `delaysContentTouches`，也不修改手势优先级、点击回调或导航时序。130ms 从 Pressable 收到触摸后开始计算；若 iOS basic 的宿主本身还延迟触摸派发，实际反馈时间也会包含宿主的延迟，不等同于精确复刻系统 List 的全部触摸策略。

## 实现与风险边界

延迟直接交给当前安装版本的 RN Pressable（`unstable_pressDelay`）或 RN Web Pressable（`delayPressIn`）。没有新增自定义 timer、手势识别器、全局触摸监听或导航兜底状态机。卸载和滚动取消也由原 Pressability / PressResponder 清理。因此它不涉及此前 iOS 原生列表的可复用 cell、SwiftUI Button action 与 UIKit 返回转场之间的同步问题。

Android / iOS basic 默认延迟按压反馈，Web 默认保留即时反馈；调用方可显式使用 `immediate` / `automatic` 覆盖。要求无阴影的页面可设 `sectionShadow: false`。本功能依赖 RN 当前标记为 unstable 的延迟属性，后续升级 RN 时需要重跑取消和长按用例。

第三方手势若拦截触摸却未正常通知 Pressable 取消，仍可能有原有 responder 的边界问题；本次未增加额外补偿逻辑。系统原生 ContextMenu 的预览与高亮仍由系统管理，不保证受 basic 的 130ms 延迟控制。

## 调试与验证

调试首页在 Android / Web 显示“Basic 列表立即按压反馈”开关，Web 默认开启，Android 默认关闭。NativeList 示例在 basic 模式也提供同一开关，iOS basic 默认关闭；设置在当前调试会话内共享，应用重启恢复平台默认值。iOS 首页保留原有 iOS 原生开关，查看 basic 开关需在 NativeList 示例切到非原生模式。示例原有三种 Basic List 样式选择保留。

自动化验证包含：

- 实际渲染 basic Root、Section、普通行和 CustomItem，检查设置继承、覆盖与分割线几何。
- 使用安装版本的 RN Pressability / RN Web PressResponder 和可控时钟，检查激活前取消、快速点击、长时间按住、激活后取消、卸载，以及有无长按菜单。
- 实际编译两端 Tailwind，检查主题圆角与 surface 阴影 utility。
- 既有导航选中、菜单、编辑模式等测试，以及库与示例 TypeScript 检查和库构建。

本轮 `bun test test` 全量 133 项通过，库与示例类型检查、库构建通过。Android 15 开发包检查了三种分区外观、示例开关切换和快速滚动。iOS basic 真机和浏览器触控没有做本轮设备回归；上述 responder 自动化测试不等同于三端全部原生手势均已验收。
