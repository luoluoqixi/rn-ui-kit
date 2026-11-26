# Android 弹层坐标与窗口挂载修复

日期：2026-11-26。针对 HeroUI Native 1.1.1、TrueSheet 4.1.2、React Native 0.83.9。

## 普通页面中的锚点弹层偏移

Dropdown、Menubar、ContextMenu 共享 MenuSurface；Select 和 Popover 使用各自的 HeroUI
组件，但触发器都通过 `HeroUIWindowAnchor` 测量。

原适配器统一将 HeroUI 调用的 `measure()` 转换成 `measureInWindow()`，以补偿
TrueSheet 的独立 Fabric 根。这个转换在 Android 普通页面中会混入窗口 viewport 偏移。

本轮 Android 真机测量：同一按钮的实际屏幕顶部为 561px，设备密度 2.75，换算约 204dp；
`measure()` 的 pageY 也是约 204dp，`measureInWindow()` 的 Y 却是约 164dp。
HeroUI 经 TrueSheetOverlay 将内容挂到原生 content 根，按后者定位就会向上偏约 40dp。
这只是该设备实测值，不能将 40dp 或固定状态栏高度写成补偿常量。

修复在公共适配器内按实际场景选择测量路径：

| 场景 | 路径 |
| --- | --- |
| Android 普通页面、全屏 Modal、已有全窗口浮层内 | 保留原始 `measure()` 根坐标 |
| Android TrueSheet 内的触发器 | 保留已正常的 `measureInWindow()` + 最近 Sheet 的绝对 top |
| iOS TrueSheet 内的触发器 | 保留原生窗口测量，包含原生呈现缩放和水平偏移；失败时回退 |
| iOS 其他场景 | 保留原有路径 |

没有修改组件的 sideOffset、align、碰撞避让或调用方 API。异步测量序号、关闭/卸载后
丢弃旧结果、Sheet 移动时重新测量的逻辑继续保留。

## Dialog 中的子弹层落到下面

本库 Dialog 使用 React Native Modal，Android 上它拥有独立原生 Window。
`OverlayPortalWindow` 已为该 Modal 创建局部 `ScreenOverlayPortalProvider` 和 named host，
但 Menu / Select / Popover 仍未传 hostName，内容注册到了应用默认 host。

HeroUI 的 FullWindowOverlay 在 Android 上也会经过 TrueSheetOverlay。后者从挂载点
向上查找当前原生 `android.R.id.content`；如果 Portal 仍挂在 Activity 内，
它找到的是 Activity 的窗口，无法通过增大 zIndex 穿过 Modal 的窗口边界。

新增内部 `useHeroUIOverlayPortalHostName()`，在调用 Portal 之前读取最近的局部 host：

- Android：MenuSurface、Select、Popover 将该 hostName 传给 HeroUI Portal。
  TrueSheetOverlay 因而可以找到当前 Modal 或 Activity 的 content 容器。
- iOS：继续返回 undefined，保留原先的 HeroUI 全窗口挂载与呈现行为。
- 普通页面没有局部 host 时，继续使用 HeroUI 默认 host。

`HeroUIWindowOverlayScope` 继续标记已经转换为全窗口坐标的浮层子树，避免其中再次打开
弹层时重复叠加 Sheet top；新打开的子 Sheet 则通过不同 host 识别自己的坐标边界。

## TrueSheet 的 -1 detent 警告

`currentDetentIndex = -1` 是尚未展示时的内部状态，不是一个可查询的位置。

本库默认在 Android 使用 `disableStackingTranslation=true`。旧补丁的
`setDisableStackingTranslation(true)` 会立即调用 `resetTranslation()`；
后者在检查是否需要更新父 Sheet 之前，就无条件查询当前 detent 的 top。
首次应用原生 props、Sheet 尚未呈现时，便可能把 -1 送到 detent calculator。

本轮只调整 `resetTranslation()` 的父层同步部分：仅在未禁用堆叠位移、确有父 Sheet、
并且当前 detent 索引非负时，才查询位置并同步给父层。重置自身位移、拖拽恢复和
onTranslateEnd 完成回调保持原样；calculator 的越界警告保持原样，未全局吞掉非法索引。

修复写入原有 TrueSheet patch，库与 examples/app 两份同步。顶部历史注释与其他平台、
其他功能的 diff 块均保留。原生部分需要重新编译 Android，Fast Refresh 不会更新 Kotlin。

## 回归与验证边界

- 使用 Android 15 / API 35 真机 M2102J2SC，运行重新编译的 Debug 开发包与 Metro，
  不是 Release 包。
- 窗口测量测试使用真实 HeroUI Select / Menu / Popover primitive 和定位函数，模拟
  `measure()` 与 `measureInWindow()` 不同的 viewport 原点，检查实际输出坐标。
- Portal 测试使用真实 HeroUI Portal store，检查默认 host、Sheet host、Dialog host，
  以及 iOS 仍使用默认全窗口 host；组件适配测试另检查三处 Portal 的 host 透传。
- 保留 iOS 原生测量失败回退、过期结果、浮动 Sheet 缩放、嵌套 Sheet 和默认打开的测试。
- 补丁按 `patch/bun_same_file_hunk_offset.md` 验证：同版本原包完整应用旧补丁后修改；
  检查 hunk、对干净原包 dry-run、实际应用新补丁；Bun 安装后两处依赖的全部 33 个
  patch 目标文件均与预期最终副本逐字节一致。
- 本轮没有改动或重新运行 iOS 原生构建；iOS 的设备表现沿用此前用户验收，不能将
  Android 真机回归等同于重新完成 iOS 验收。

### Android 真机结果

以下操作均在包含新 Kotlin 补丁的 Debug 包中完成，使用 ADB 操作并截图检查：

| 场景 | 结果 |
| --- | --- |
| 普通页面 Dropdown、Menubar、Popover、自绘 Select | 均能显示；空间充足时内容位于触发器下方，间隔符合原有 8dp 配置 |
| TrueSheet 内上述四类弹层 | 均能显示且定位正常，未引入普通页面坐标修复的偏移 |
| Dialog 内自绘 Select、Popover、HeroUI Dropdown 菜单 | 均显示在 Dialog 之上；Select 选择后更新值并关闭 |
| TrueSheet 初始化与本轮反复打开过程 | logcat 未观察到 detent -1 警告或新的 ReactNativeJS 错误 |

Dropdown 验证明确覆盖 `native={false}` 的 HeroUI 菜单，而非系统原生菜单。
Dialog 示例为检查该分支临时设置过 `native={false}`，检查结束后已完整恢复示例源码。

未稳定录到修复前偶发的 detent 警告，因此该项结论是已修复源码中确认存在的 -1 查询
路径，并在本轮操作中未再观察到警告，不代表穷尽了所有设备与嵌套堆叠边界。
本轮未覆盖其他 Android 系统版本、Release 包、分屏及全部键盘/嵌套窗口组合。

自动化与编译结果：`bun test test` 130 项通过；最后补充的 Portal 透传用例再次通过
弹层测试组；库与示例 `typecheck`、库 `build`、Android 原生 Debug 编译均通过。

## 补充：Toast 拖拽引发 Android 栈溢出

2026-11-26，在同一台 Android 15 真机的 Debug 包中复现：组件示例 → Toast →
显示 Custom JSX，待通知出现后向下拖走，应用闪退。崩溃前后录屏保存在本机
`.temp/android-overlay-2026-11-26/`，不随库发布。

这不是 Toast 队列、计时器或叠层高度动画的问题。原生日志中的直接链路是：

```text
RNGestureHandlerRootHelper.RootViewGestureHandler.onCancel
  → TrueSheetOverlayRootView.onChildStartedNativeGesture
  → JSPointerDispatcher.dispatchCancelEventForTarget
  → PointerEvent.dispatchModern
  → EventEmitterImpl.receiveEvent
  → InteropEventEmitter.receiveEvent
  → FabricEventDispatcher.dispatchEvent
  → EventEmitterImpl.receiveEvent ...
  → StackOverflowError（也可能先表现为原生 SIGSEGV）
```

HeroUI 的 Android Toast 经 TrueSheetOverlay 挂到窗口层，自己的 GestureHandlerRootView
在拖拽激活时会通知最近的原生 RootView 取消 JS 触摸。RNGH 2.31.1 在这里生成的是
坐标 `(0, 0)` 的合成 CANCEL。TrueSheet 4.1.2 无条件创建 JSPointerDispatcher，
该分发器会重新命中根视图；当命中没有 React tag 的原生 overlay root 时，
target 和 surface 都可能为 `-1`，于是错误进入 Legacy emitter，再经 Fabric interop
回到同一条路径。

React Native 0.83.9 自己的 ReactSurfaceView 仅在
`ReactFeatureFlags.dispatchPointerEvents` 开启时创建这个分发器；当前应用没有启用它。
TrueSheet 的行为与 RN 根视图不一致，导致原本没有开启的 W3C Pointer Events
也参与了取消事件处理。

补丁让 TrueSheetOverlayRootView 和 TrueSheetViewController 都遵循同一启用条件，
并将各处 pointer 分发改为可空调用。普通 JSTouchDispatcher、touch deduper、
原生手势起止、Sheet 拖拽协调与 Toast 的 Pan 手势保持原有路径。没有通过禁用
Toast 拖拽或修改 React Native 全局事件转发器来规避崩溃。显式开启 W3C Pointer Events
的宿主仍保留该分发器；本次设备回归覆盖的是项目默认未开启的配置。

补丁与验证：

- 在 npm 4.1.2 原包上完整应用旧 patch 后修改；旧顶部注释逐字保留。
- 旧 diff 仅重生成 TrueSheetViewController.kt 的完整 diff，计入已有修改与新增行号；
  新增 TrueSheetOverlayRootView.kt diff，其余旧 diff 块逐字保持一致。
- hunk 校验、干净原包 dry-run 和完整应用通过；实际应用结果与预期最终副本一致。
- 清理对应 Bun patch 缓存后，在库与示例目录重新安装；两处安装目录的全部
  **34 个目标文件**与预期最终文件逐字节一致，两份 patch 也逐字节一致。
- 重新编译并安装 Android Debug 包；使用同一拖拽操作录制修复后视频，
  自定义 Toast、普通 Toast、连续堆叠与反向拖动取消后进程保持正常，
  当前进程未产生新的 crash 日志。

这是 Kotlin 补丁，其他设备或重新安装依赖的宿主需要重新编译 Android 包，
仅 Fast Refresh 不能生效。此次没有修改 TrueSheet 的 iOS / Web 部分，
也没有修改 HeroUI Toast 的既有内容展开补丁或 Burnt 原生 Toast。

## 补充：Popover 淡入淡出时 Input 边缘变深

用户录屏中的异常集中在 Android Popover 开关动画期间：内容尚处于半透明时，
Input 周围出现明显的深灰色粗框，动画结束后恢复。该现象与重叠子视图分别应用
alpha、而非先将完整内容合成为一层再应用 alpha 的差异一致；不是 Input 在开关时
切换了主题颜色或边框宽度。

进入动画作用于 HeroPopover.Content，退出动画则作用于 HeroUI 内部的全窗口 wrapper。
因此，两处实际执行 opacity 动画的节点都需要正确合成。在
`popover_heroui.native.tsx` 的 HeroPopover.Content 上，仅为 Android 默认开启：

```tsx
needsOffscreenAlphaCompositing={Platform.OS === "android"}
```

同时，在 HeroUI Native 1.1.1 补丁中，为 PopoverContentPopover 的退出 wrapper 添加
同样仅在 Android 开启的 `needsOffscreenAlphaCompositing`。源码和发布 ESM 入口同步；
没有改变 wrapper 原有的尺寸、pointerEvents、动画对象或子节点挂载结构。

最初还在 Content 上开启了 `renderToHardwareTextureAndroid`。它虽然能掩盖退出时的
合成异常，但会把内容及阴影限制在内容节点的矩形纹理边界内；弹层完全打开后，
底部两角便会出现用户截图中的直角阴影。只移除此属性又会使关闭时 Input 深色粗框
复现。这也是必须在真正执行退出动画的 wrapper 上修正合成的原因。最终方案
不再默认开启固定硬件纹理缓存，不裁剪或删除外阴影，圆角和 shadow-overlay 沿用主题。

HeroUI 原有 opacity、位移、缩放与退出动画继续使用，没有移除 Input 背景或关闭动画。
透明度动画期间需要额外离屏合成，退出 wrapper 的尺寸与窗口相同，可能带来短暂的
绘制和显存开销；不再为弹出的内容长期固定缓存一块硬件纹理。调用方仍可通过
`contentProps.herouiNativeProps` 覆盖内容节点的原生属性；显式重新开启硬件纹理缓存
时，可能再次触发阴影裁切。

在重新编译的同一 Android 15 Debug 包中，录制普通页面 Popover 两次打开与关闭，
并检查淡入、淡出的中间帧。初次录像为
`.temp/android-overlay-2026-11-26/popover-after.mp4`，该版本仍有用户后来指出的
直角阴影。修正退出 wrapper 并移除固定纹理后的录像为
`.temp/android-overlay-2026-11-26/popover-corners-after.mp4`：静止时阴影沿圆角自然
扩散，两次打开与关闭均未再出现深色粗框。

组件适配测试覆盖 Android 默认合成、iOS 保持关闭、不强制硬件纹理及调用方覆盖；
另直接渲染安装后的 HeroUI 源码与 ESM Popover.Content，验证 Android 退出 wrapper
启用合成、iOS 不启用、原有定位与自定义 entering 的测量分支继续保留。补丁从同版本
原包完整应用旧 Toast 修复后生成；旧顶部注释及 Toast diff 保留，两份补丁同步，
dry-run、实际应用和 Bun 安装后的四个目标文件均与预期最终源码逐字节比较。

本次两项修复后的 `bun test test` 共 147 项通过，库与示例类型检查、库构建、
Android 原生 Debug 编译通过。此次设备录像验证覆盖普通页面 Popover 和 Toast
拖拽；没有重新验收 Sheet / Dialog 内全部组合、其他 Android 版本或 iOS / Web。
后续直角阴影修正仅涉及 JS 与 HeroUI 补丁，需重新安装依赖并重新加载 JS，
无需在上一轮已安装 Kotlin 修复的开发包上再次进行原生编译。
该修正后全量测试 148 项通过，库与示例类型检查、库构建通过。
