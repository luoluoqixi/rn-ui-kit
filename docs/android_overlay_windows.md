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
