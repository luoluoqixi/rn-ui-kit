# TrueSheet 4.1.2 升级与补丁迁移审计

本次只升级 TrueSheet 及其关联封装、补丁、声明、依赖、锁文件、测试和示例。工作分支保持 dev-heroui。没有接入 HeroUI，没有迁移 UI 或重构主题；backgroundFollowsTheme 保留。静态等价性、自动化测试、编译和设备交互是不同的验证层级，本文分别记录。

## 采用的实际发布物

核对日期：2026-11-21，Asia/Shanghai。npm dist-tags.latest 为 4.1.2，beta 为 4.0.0-beta.31；未把参考仓库 main 当作发布版本。

- 版本：4.1.2。
- npm 发布时间：2026-11-19T20:59:41.856Z；北京时间 2026-11-20 04:59:41.856。
- Git tag：v4.1.2，annotated tag 对象 1491272fcb489b1f496d5c9eb6f0752aa6a226dd。
- tag 解引用与 npm gitHead 一致：26f084f5f42aafcc5f8e0574d7e60719b00d2c3e。
- npm tarball：https://registry.npmjs.org/@lodev09/react-native-true-sheet/-/react-native-true-sheet-4.1.2.tgz。
- SHA1：fe2edcd68a42ac2728f2c1ac73e2f66322d6da0c。
- SRI：sha512-YaKgXCgeP+BkgOkYoaDRJLn5a3/i88oa+uND0BR2p00zXVDSifx30FxsCrNQrCyijmRwpyH9iaFg3+v5/YhJag==。

来源为 npm registry 元数据、下载后校验的实际 tarball、只读参考仓库 tag 和源码。迁移阅读以该 tag 的 docs/content/docs/latest/migration.mdx、发布说明和 tarball 入口为准。完整元数据、原始下载包和过程日志保存在本机 /tmp/rn-ui-kit-truesheet-0bL1l8；可复核的最终证据持久保存于仓库 docs/patch/true_sheet_4.1.2_verification.json。

## 兼容性与实际运行路径

| 范围 | 4.1.2 要求 | 本项目 | 结论 |
| --- | --- | --- | --- |
| 核心原生组件 | React Native >=0.82，新架构 | RN 0.83.9；Android newArchEnabled=true；iOS Fabric | 符合版本和架构要求 |
| 核心 React | React * | React 19.2.5 | 保持现状 |
| Expo 宿主 | 核心并不要求 Expo 57 | Expo 55.0.26 | 不升级 SDK |
| /navigation | Navigation >=7.3.0 + standard-navigation >=0.0.9，可选 peers | Navigation native 7.3.16；没有导入 TrueSheet /navigation | 保留独立 NavigationContainer，未安装 standard-navigation |
| /navigation/expo-router | Expo Router >=57.0.0，可选 peer | Router 55.0.16；未导入此入口 | 该可选集成不能直接用于当前 Router；不影响当前核心路径，不升级 Router |
| /reanimated | Reanimated >=4.1.0，Worklets >=0.5.0，可选 peers | 4.3.0 / 0.8.1；未导入该子入口 | 已满足，版本不变 |
| Web | react-dom *、Radix Dialog/Presence >=1，可选 peers | ReactDOM 19.2.5，现有 Radix | 使用 Provider/useTrueSheet 路径 |
| 其余现有导航依赖 | 按现有封装 | native-stack 7.18.8、stack ^7.10.6、screens 4.24.0、gesture-handler 2.31.1、safe-area 5.7.0 | 保留现有补丁与版本 |

检索了仓库内 TrueSheet import、Props、命令式调用及 setScrollableView。当前没有 /navigation、/navigation/expo-router、/reanimated 的实际 import。iOS 继续使用系统 native-stack，Android/Web 继续使用项目原有 JS stack；SwiftUI NativeList 实现未替换。

注意：上游迁移文档仍提示 sheet 内 native-stack 组合存在限制。本项目已有此组合，本次保留并做显式滚动绑定和布局适配；其手势、标题栏和键盘表现需要 iOS 设备验收，不能由 peer 满足或编译结果推断。

## 三方基线与旧补丁完整性

开始修改前，以工作区的完整两份 3.11.12 patch 保存 old-root.patch 和 old-example.patch，两者逐字节相同，SHA256 均为 8657c79a89fe0e2e338d87637c8af31fb1ca421314535e764d81047eff236f70。没有只从 Git HEAD 取备份。

三方目录均在独立临时目录：A=old-clean/package（干净 3.11.12 npm 发布物），B=old-patched（完整旧补丁还原行为），C=new-clean/package（干净 4.1.2 npm 发布物）。new-final 为从 C 修改的最终预期树。上游参考仓库没有被写入。

旧 patch 共 29 个文件、83 个 hunk。原始 git apply 报 corrupt；原因是第 16 个 hunk 只有上下文而没有增删行，并非行为冲突。仅在临时应用副本中去掉这一无操作 hunk，随后 29 个文件全部应用成功，日志没有 Skipped patch。历史备份未改动；没有把格式错误复制到新补丁。

## 旧行为与新版的逐项对照

下面的“等价”指源码调用链对应；涉及系统手势和视觉效果的结论仍须按回归表在设备确认。

| 旧目的与触发场景 | 旧路径或 API | 4.1.2 原生能力与差异 | 最终去向 | 验证 |
| --- | --- | --- | --- | --- |
| iOS indicator 底部不能短于 sheet 自身 inset；键盘/Footer 变化 | ContentView.setBottomInset | 上游依靠 UIKit 自动 indicator 调整；关闭自动调整时仍可能不足 | 保留底部下限；记录原始 indicator bottom，解绑时恢复；自动调整关闭时只补 UIKit 实际 safe-area 差额 | 源码审计、iOS 编译；长短列表/键盘视觉待设备 |
| 深层 Stack 显式绑定当前 ScrollView | setScrollableView(tag) → Module/View/Container/Content | scrollableRef → resolveScrollable → Fabric scrollableHandle；支持 RN ScrollView、FlatList 和可解析 imperative handle；mountingTransactionDidMount 重试 | 封装用 focus-aware 注册，新 ref 对象触发 PureComponent；bindToNativeSheet=false 保留旧浅层发现 | 类型测试、绑定测试、Web 页面切换；原生返回转场待设备 |
| 未显式绑定时保留自动发现 | iOS 两层搜索、Android 可见页面搜索 | 上游 v4 默认只接受显式 handle | 兼容 scrollable=true 映射私有 -2：iOS 保留两层查找，Android 保留可见逆序查找 | tarball/安装树逐字节比对；默认组件改用显式 ref |
| iOS custom grabber 整行透明拖拽，pill 不放大 | core/TrueSheetGrabberView | 上游新增 VoiceOver frame 修正但热区仍围绕 pill | 整行宽度、至少 28pt 热区；保持 pill 尺寸和 VoiceOver pill frame；frame 不越过 sheet 顶边 | 编译发现并修正 accessibility 常量遗漏；触摸/VoiceOver 待设备 |
| iOS 键盘隐藏后 custom detent 平滑回弹 | KeyboardObserver 内 animateChanges 重算 | v4 invalidateDetents 自己拥有 animateChanges 事务 | 隐藏时调用 invalidateDetents，不嵌套第二个事务 | 编译与源码审计；动画待设备 |
| Android 整行 grabber 强制 sheet drag | Grabber/BottomSheetView/Coordinator | v4 仍需扩大热区并区分手势归属 | 保留整行 MATCH_PARENT、至少 28dp、pill 不变；grabber 命中绕过 GH grace/列表归属，但尊重 draggable=false | Release 编译；左右热区拖拽待真机 |
| 子 Sheet 打开时可禁用父 Sheet translation | disableStackingTranslation | v4 增加 onSlide 实时 syncParentTranslation/syncTranslationForChild | 旧 add/update/stack manager 与新增实时路径均加开关；reset 仍恢复拖拽与完成回调 | Fabric/Manager/Controller 全链路、Release 编译；嵌套与前后台待真机 |
| Stack 当前可见页面切换后滚动绑定与旧 padding 恢复 | Android ContentView stale 检查/keyboard 重绑 | v4 handle setter 清理旧绑定、requestLayout 更新 Material nestedScrollingChildRef，解绑恢复 inset/padding | 使用上游显式路径；兼容发现路径额外在布局时切换可见目标并通知 delegate | 安装全文件比对、Web 长短页前进返回；原生滚动交接待设备 |
| 列表到顶继续下拉交给 Sheet | Coordinator top-pull + disallowIntercept | v4 仍不足以覆盖项目的深层导航/手势组合 | 保留 deepest touched ScrollView、祖先链、refresh 排除、方向判定、synthetic DOWN priming；空列表双向交接；UP/CANCEL 清理 | Release 编译；连续滚动到顶后下拉待真机 |
| Android Release 偏右滚动被错误拦截 | Coordinator active-scroll stream return false | 上游仍可能进入 Material 默认拦截 | 未启动 top-pull 前让 active scroll stream 留给列表；保留 v4 独立滚动/触摸阻塞逻辑 | Release 编译成功不能证明右侧手势已通过，必须设备回归 |
| 调节关闭判定 androidHideFriction | Fabric → Manager → Controller → Material | v4 自定义 short/fling 叠加 Material 行为 | 保留真实 setter、默认 0.3；kit 默认 2；运行时设置与初始化一致 | 类型、Codegen、Release 编译；half 模式实际手势待真机 |
| 调节 androidSignificantVelocityThreshold | 同上 | v4 short/fling 原先使用写死 125dp 阈值，会绕过自定义参数 | 保留默认 200、kit 默认 10；同时让 v4 自定义 short/fling 路径使用该阈值 | 类型、Codegen、Release 编译；不同密度/阈值手感待真机 |
| fit/auto + scrollable 打开期间防止中间高度反复回写 | View.onMeasure + Controller 稳定 screen measure helper | C++ TrueSheetContentViewShadowNode 使用无界克隆测量 naturalHeight；viewport-only clone 复用缓存，与展示帧高度分离 | 不携带 v3 screen-height workaround；以 v4 自然高度/缓存替代，保留动态内容更新 | C++ 源码审计、Release 编译、Web 动态内容；原生打开性能待设备 |
| 未在旧顶部列出的 native frame pin/retry 清理 | iOS Container/Content/View、旧显式 tag API | v4 同步按 detent 的 Yoga 尺寸，原生自行 clear/setup、mount 重试与 Footer/keyboard inset | 不再手动改 ScrollView frame；否则与 Yoga 冲突；保留 ref 刷新和原生上游重试 | 删除旧 JS window/y 补偿；固定/auto 样式测试，原生待设备 |
| v3 公开 Props 在迁移时继续可用 | scrollable、anchor/anchorOffset、blurOptions | 上游改名/移除；iOS 26.1+ 新 backgroundEffects | 保留旧 aliases 并映射；blurOptions intensity/interaction 走原生 fallback；默认仍用上游系统效果 | 真实声明类型检查；玻璃、背景透明及自定义 blur 待设备 |
| Web present/dismiss/resize Promise 和事件顺序 | v4 Provider + 方法 | present 已打开会警告；resize Promise 在设置状态后返回，不代表动画结束；无退出动画可能先移除 Drawer | 串行/coalesce 命令队列，关闭期间不重复 present；初始事件/过期 resize 不覆盖最新受控 position；Drawer 已不存在则完成 dismiss | 真正 v4 Web 组件隔离测试与生产浏览器烟测 |

androidHideFriction 参与 Material half 关闭投影。新增 v4 dismissThreshold="short" 的位移规则属于上游，不能把 friction 当作该模式的通用位移系数；速度阈值已接入 short/fling 两条覆写路径。

## v4 封装适配与公开约定

- scrollableRef 优先于兼容 scrollable。页内注册跟随 focus/blur，旧页面卸载不得清掉新页面 owner；临时弹层列表移除后恢复当前页注册；present 后刷新 immutable ref。为保持默认可滚动的使用方式，bindToNativeSheet 的默认值由旧 false 调整为 true；显式 false 仍走兼容自动发现，深层 Stack 建议保留默认显式绑定。RN ScrollView/FlatList 类型直接来自真实 patched 声明，没有用 ambient any 掩盖。
- 固定 detent 的 content/root 使用 flex:1、minHeight:0；auto 用自然 flexBasis:"auto"、flexGrow:0、flexShrink:1。没有保留导致 Web 折叠的 flex:0。用户 style 仍在最后可覆盖。
- NativeSheetStack 的 Navigator 本身绝对定位，不能自行提供内容自然高度。当前聚焦 NativeSheetScrollContent/kit ScrollView 上报 contentSize + HeaderHeight；NativeSheetFillContent 上报自然布局高度。auto Stack 在首个测量前用窗口高度启动，收到当前页内容后更新，切页过程中保留上一次高度避免零高；自然高度容器允许 flexShrink:1，把导航 viewport 约束到当前 detent，长列表自身仍可滚动。自定义绝对布局/不提供内容尺寸的第三方页面应给显式高度；SwiftUI List 的 auto 内在高度不在本次运行验证范围。
- constrainToNativeSheetViewport 保留声明和调用方式，v4 已同步约束可见 viewport，内部不再做旧 windowHeight - max(y,sheetTop) 计算。固定/auto 均受新布局约束；显式 false 不再重新启用 v3 整窗溢出方式。
- Header 保持上游 relative 默认及显式 absolute；kit Footer 默认设 absolute 以延续 v3，调用方仍可改 relative。Footer 自有 safe area、keyboard rise 和 scroll overlap 由上游处理。
- iOS 与 Android 已绑定 RN ScrollView 的 bottom inset 使用上游，JS 只保留额外内容留白。SwiftUI NativeList 不是 RN ScrollView，继续自己的 safe-area 路径，未被误标为已注入。
- 删除 v3 固定 Dialog/Toast 偏移曲线和手工 viewport 高度，改用 v4 实际局部 viewport；普通 native pageSheet 的布局补偿保留。Portal host、键盘 hooks、Toast scope、Dialog 内 Sheet 的 host 边界保留。
- 没有再在 content/GestureRoot 额外涂不透明背景来遮住原生 blur/Glass；backgroundColor、backgroundStyle 及 theme background 行为保留。
- anchor left/right 映射 leading/trailing；placement 显式值优先。kit 缺省仍 center，旧 anchor 不会被默认 center 吞掉。
- blurOptions 保留 intensity（0–100）和 interaction；指定自定义参数时使用可调 UIVisualEffect fallback，默认不指定仍允许 iOS 26.1+ 系统 backgroundEffects/Liquid Glass。平台本身不支持的效果仍遵循原有平台差异。
- Web 使用 useTrueSheet Provider 的命令，避免 static 方法在 v4 Web 中直接拒绝。StrictMode effect replay 会重新激活队列；卸载后不继续 queued resize/reopen。open=false 优先于矛盾的 initialDetentIndex，避免关闭的预挂载 Sheet 自动闪现；initialDetentIndex 在实际初次打开时参与默认 position，显式受控 position 仍优先。
- Web 导航卡片在全高 detent 时也保持局部 flex/overflow 约束，避免 React Navigation 切到 document 滚动而与 Sheet 的 body scroll lock 冲突；调用方 cardStyle 仍在默认样式之后。
- v4 onWillDismiss 表示已确定关闭；封装不再依靠“可能取消的 gesture willDismiss”。一处 layout sync 不重复转发用户回调。

契约差异明确说明：直接引用旧 patched TrueSheet class 自定义 setScrollableView() 的下游代码需改为 scrollableRef；这是上游依赖的非标准扩展，并非 rn-ui-kit 导出的公开方法。库内已全部移除该调用。NativeSheet/NativeSheetStack 的 Props、滚动封装、原生模式和既有调用方式保留。Web resize 的 Promise 不能被当作动画完成信号，应观察事件；命令队列已按实际 v4 时序适配。constrainToNativeSheetViewport 的 false 值不能撤销 v4 原生布局约束，这一变化已在上方明示；需要溢出展示的内容应使用 Portal，不能再依赖旧整窗测量。

## 完整旧文件和 hunk 去向

编号按旧完整 patch 的 diff/hunk 顺序生成，不按顶部说明猜测。所有 83 项均在下表范围内，后表逐 hunk 标注；删除某个旧文件 diff 不代表删除其行为。

| 旧文件 | 旧 hunk | 最终处理 |
| --- | --- | --- |
| `android/src/main/java/com/lodev09/truesheet/TrueSheetContentView.kt` | #1, #2, #3, #4 | 显式 handle 走 v4 setup/clear/requestLayout；-2 兼容发现保留可见逆序与布局换页；旧 keyboard/padding 清理由新版实现。 |
| `android/src/main/java/com/lodev09/truesheet/TrueSheetModule.kt` | #5 | 移除 iOS 专用自定义命令在 Android 的空实现；改用跨平台上游 Fabric scrollableHandle，不再需要此 TurboModule 命令。 |
| `android/src/main/java/com/lodev09/truesheet/TrueSheetView.kt` | #6, #7, #8, #9, #10, #11 | 三项参数与 translation 所有旧路径保留；fit screen-height onMeasure 不再移植，改用新版 C++ naturalHeight。 |
| `android/src/main/java/com/lodev09/truesheet/TrueSheetViewController.kt` | #12, #13, #14, #15, #16 | 关闭参数与默认配置保留；旧稳定 screen measure helper 由新版 C++ 替代；#16 为 context-only，无行为。 |
| `android/src/main/java/com/lodev09/truesheet/TrueSheetViewManager.kt` | #17 | 全部三项扩展 Props 的真实 Manager/Codegen 桥接保留。 |
| `android/src/main/java/com/lodev09/truesheet/core/TrueSheetBottomSheetView.kt` | #18 | 整行 grabber hit-test 保留。 |
| `android/src/main/java/com/lodev09/truesheet/core/TrueSheetCoordinatorLayout.kt` | #19, #20, #21, #22, #23, #24, #25, #26, #27, #28 | 10 个手势相关 hunk 全部按 v4 状态机移植，合并新版独立滚动、blocksTouches、draggable 和 terminal 清理。 |
| `android/src/main/java/com/lodev09/truesheet/core/TrueSheetGrabberView.kt` | #29, #30, #31, #32 | 透明整行与最小高度保留；pill 视觉配置不变，新增 v4 accessibility 逻辑保留。 |
| `android/src/main/java/com/lodev09/truesheet/core/TrueSheetStackManager.kt` | #33 | 父子禁用检查保留，扩展到 v4 realtime translation 及 posted callback。 |
| `ios/TrueSheetContainerView.h` | #34, #35 | 旧 cached tag 容器字段/方法由已有 scrollableHandle 取代，容器不再负责手工 frame pin。 |
| `ios/TrueSheetContainerView.mm` | #36, #37, #38, #39, #40 | 旧 tag 传递与 mount 重试由上游 Controller/Content 的 setup、mountingTransactionDidMount 取代。 |
| `ios/TrueSheetContentView.h` | #41, #42 | 旧 tag 声明和 frame pin 状态由上游 handle、Yoga 尺寸与挂载重试取代，不另建平行状态。 |
| `ios/TrueSheetContentView.mm` | #43, #44, #45, #46, #47, #48, #49, #50 | 保留 indicator 下限、-2 浅层查找；显式递归 tag 搜索/异步 frame pin 由上游 findViewWithTag + mounting retry/Yoga 替代。 |
| `ios/TrueSheetModule.mm` | #51 | 移除旧 Module 自定义命令；显式引用由组件 prop 和 Fabric 流转，无需手动命令。 |
| `ios/TrueSheetView.h` | #52 | 移除旧 setScrollableView 声明；采用上游已存在的 scrollableHandle prop。 |
| `ios/TrueSheetView.mm` | #53, #54, #55, #56 | 同上，cached tag 与 Container 传播由 v4 Controller 接线实现；另补 blur/footer 兼容逻辑。 |
| `ios/core/TrueSheetGrabberView.mm` | #57, #58 | 保留整行透明热区；采用 v4 frame 不越顶/VoiceOver pill-frame 规则。 |
| `ios/core/TrueSheetKeyboardObserver.mm` | #59 | 保留键盘收起时 animateChanges 重算目的，改为调用新版自行开事务的 invalidateDetents。 |
| `ios/tvos/TrueSheetStubs.mm` | #60 | 移除不存在调用者的 tvOS 自定义命令空 stub；标准 Fabric/组件路径不需该空操作。 |
| `lib/module/TrueSheet.js` | #61, #62 | 移除 class 自定义方法和新增 import；组件 scrollableRef 已由上游实现；无意义末尾换行不延续。 |
| `lib/module/fabric/TrueSheetViewNativeComponent.ts` | #63 | 三项 Android Props 保留并新增必要的 blurOptions Fabric 类型；版本自带 scrollableHandle。 |
| `lib/typescript/src/TrueSheet.d.ts` | #64, #65, #66 | 删除旧 setScrollableView 方法声明/Component import；上游 scrollableRef 属性取代；末尾换行归发布物。 |
| `lib/typescript/src/TrueSheet.types.d.ts` | #67, #68, #69, #70, #71 | 保留三项扩展 Props；旧自定义方法/import 不再需要；重复 JSDoc 和纯换行不复刻；新增旧公开 aliases 的声明。 |
| `lib/typescript/src/fabric/TrueSheetViewNativeComponent.d.ts` | #72, #73 | 保留三项扩展 Props，和 source Codegen 镜像一致；换行归目标发布物。 |
| `lib/typescript/src/specs/NativeTrueSheetModule.d.ts` | #74, #75 | 删除自定义 TurboModule 命令声明；无 JS 调用/原生实现需要；其余声明以新版发布物为准。 |
| `src/TrueSheet.tsx` | #76, #77 | 使用上游 scrollableRef 原生解析/更新；不复刻私有命令，兼容 alias 在 render 映射。 |
| `src/TrueSheet.types.ts` | #78, #79, #80, #81 | 保留三项真实 Props；旧方法和其 Component import 改由 v4 scrollableRef 替代，清掉重复说明。 |
| `src/fabric/TrueSheetViewNativeComponent.ts` | #82 | 保留三项 Android Codegen props，并连通额外兼容 blurOptions。 |
| `src/specs/NativeTrueSheetModule.ts` | #83 | 删除自定义 NativeTrueSheetModule 命令签名；所有平台组件的标准 Fabric handle 已覆盖绑定。 |

### 逐 hunk 复核索引

下表每一行均有明确处理依据；同一行为在 src、ESM、声明、Codegen 的镜像不计为额外能力，但逐处核对。

| hunk | 原位置 | 修改目的与新版去向 |
| --- | --- | --- |
| #1 | `@@ -83,6 +83,26 @@ class TrueSheetContentView(private val reactContext: ThemedReactContext) : React` | 提取 pinScrollView（保存原 padding、nested scrolling、scroll delegate）和 keyboard/bottom inset 重套 helper；v4 setupScrollable/clearScrollable/updateContentInset 已覆盖，兼容发现只补目标切换。 |
| #2 | `@@ -94,37 +114,23 @@ class TrueSheetContentView(private val reactContext: ThemedReactContext) : React` | 重写 same-inset 提前返回与 stale/rebind 流程：当前可见对象变化时先清理恢复旧 padding，再绑定新目标并重套键盘 inset；v4 显式 handle 路径已实现，-2 发现补换页。 |
| #3 | `@@ -163,17 +169,40 @@ class TrueSheetContentView(private val reactContext: ThemedReactContext) : React` | findScrollView 校验已绑定目标仍在树内且可见，递归逆序找当前页；保留为 -2 兼容发现路径，正常封装使用显式 ref。 |
| #4 | `@@ -302,8 +331,4 @@ class TrueSheetContentView(private val reactContext: ThemedReactContext) : React` | 清理未使用 TAG 等辅助尾部；没有需要迁移的运行行为。 |
| #5 | `@@ -150,6 +150,12 @@ class TrueSheetModule(reactContext: ReactApplicationContext) :` | Android 空 setScrollableView 实现；改用 Fabric 后不需要。 |
| #6 | `@@ -44,6 +44,7 @@ class TrueSheetView(private val reactContext: ThemedReactContext) :` | disableStackingTranslation 字段；保留真实开关。 |
| #7 | `@@ -256,6 +257,18 @@ class TrueSheetView(private val reactContext: ThemedReactContext) :` | 三项扩展属性 setter；保留并连入 v4 Controller。 |
| #8 | `@@ -462,7 +475,7 @@ class TrueSheetView(private val reactContext: ThemedReactContext) :` | 父 Sheet updateTranslation guard；保留。 |
| #9 | `@@ -482,7 +495,7 @@ class TrueSheetView(private val reactContext: ThemedReactContext) :` | 递归 addTranslation guard；保留。 |
| #10 | `@@ -497,6 +510,8 @@ class TrueSheetView(private val reactContext: ThemedReactContext) :` | resetTranslation 父链 guard；保留并保持恢复/完成回调。 |
| #11 | `@@ -572,7 +587,7 @@ class TrueSheetView(private val reactContext: ThemedReactContext) :` | fit+scrollable 打开时稳定屏高测量；不叠加，改用 v4 C++ naturalHeight/viewport 缓存。 |
| #12 | `@@ -122,6 +122,8 @@ class TrueSheetViewController(private val reactContext: ThemedReactContext) :` | 新增 Android 默认常量 hideFriction=0.3、significantVelocityThreshold=200；原值保留。 |
| #13 | `@@ -313,6 +315,19 @@ class TrueSheetViewController(private val reactContext: ThemedReactContext) :` | 新增两个可空 numeric 属性及 runtime setter，写入已存在的 Material behavior；保留并连接 v4 自定义 short/fling 速度路径。 |
| #14 | `@@ -353,6 +368,9 @@ class TrueSheetViewController(private val reactContext: ThemedReactContext) :` | 稳定 measure 条件辅助；新版 C++ 分离自然尺寸与展示尺寸替代。 |
| #15 | `@@ -767,6 +785,13 @@ class TrueSheetViewController(private val reactContext: ThemedReactContext) :` | 创建 Material behavior 时套用两个关闭调节参数及默认值；保留，确保初始化和 runtime setter 一致。 |
| #16 | `@@ -857,6 +882,6 @@ class TrueSheetViewController(private val reactContext: ThemedReactContext) :` | 只有上下文的无操作 hunk；临时基线解析时移除，新补丁不生成。 |
| #17 | `@@ -181,6 +181,21 @@ class TrueSheetViewManager :` | 三项 Android ReactProp manager；全部保留且 Codegen 接线。 |
| #18 | `@@ -225,6 +225,17 @@ class TrueSheetBottomSheetView(private val reactContext: ThemedReactContext) : F` | BottomSheetView 全行 grabber 命中；保留。 |
| #19 | `@@ -8,7 +8,9 @@ import android.view.View` | 手势所需 imports；按新版实际引用保留。 |
| #20 | `@@ -44,8 +46,14 @@ class TrueSheetCoordinatorLayout(context: Context) :` | 记录 grabber/scroll stream 与祖先链；保留。 |
| #21 | `@@ -118,9 +126,10 @@ class TrueSheetCoordinatorLayout(context: Context) :` | 到顶后忽略列表 disallowIntercept 的有限条件；保留，排除 refresh/非顶部。 |
| #22 | `@@ -164,6 +173,96 @@ class TrueSheetCoordinatorLayout(context: Context) :` | 顶部手势判定、最深列表命中/祖先链、synthetic DOWN 等 helper；全套移植。 |
| #23 | `@@ -188,13 +287,31 @@ class TrueSheetCoordinatorLayout(context: Context) :` | DOWN 捕获 grabber 与当前触点列表；保留。 |
| #24 | `@@ -213,13 +330,27 @@ class TrueSheetCoordinatorLayout(context: Context) :` | 水平锁定与已认领 gesture 在终止时清理 scroll/grabber 引用；当列表到顶继续下拉时释放 claimed 状态；全部并入 v4 状态机。 |
| #25 | `@@ -233,14 +364,35 @@ class TrueSheetCoordinatorLayout(context: Context) :` | grabber stream 强制 sheet drag；根据触点列表祖先链、refresh、canPullSheetFromTop/cannotScroll 区分交接；全部移植并尊重 draggable。 |
| #26 | `@@ -253,7 +405,15 @@ class TrueSheetCoordinatorLayout(context: Context) :` | 按方向区分空列表双向拖动与长列表顶部下拉，并 synthetic DOWN priming；保留，避免 Material 在缺失 DOWN 时无法开始 drag。 |
| #27 | `@@ -263,13 +423,25 @@ class TrueSheetCoordinatorLayout(context: Context) :` | UP/CANCEL 清理 stream；未启动 top-pull 时 active ScrollView 普通 stream 默认 return false，修复 Release 偏右拦截；保留。 |
| #28 | `@@ -279,6 +451,8 @@ class TrueSheetCoordinatorLayout(context: Context) :` | UP/CANCEL 清理引用与祖先链；并入 resetTouchStream 和 touch 收尾。 |
| #29 | `@@ -8,6 +8,7 @@ import android.graphics.drawable.GradientDrawable` | 整行 ViewGroup import；按新版热区使用保留。 |
| #30 | `@@ -55,8 +56,8 @@ class TrueSheetGrabberView(` | 28dp 最小热区常量；保留。 |
| #31 | `@@ -82,15 +83,13 @@ class TrueSheetGrabberView(` | 热区布局 MATCH_PARENT；保留。 |
| #32 | `@@ -99,7 +98,8 @@ class TrueSheetGrabberView(` | 可见 pill 仍按原宽高居中，热区与视觉分离；保留。 |
| #33 | `@@ -64,10 +64,14 @@ object TrueSheetStackManager {` | StackManager 父子开关检查；保留并覆盖异步与实时路径。 |
| #34 | `@@ -60,6 +60,9 @@ NS_ASSUME_NONNULL_BEGIN` | Container 的自定义 tag 字段声明；改用上游 scrollableHandle。 |
| #35 | `@@ -102,6 +105,11 @@ NS_ASSUME_NONNULL_BEGIN` | Container 显式刷新方法声明；新版 setupScrollable/mount 机制取代。 |
| #36 | `@@ -75,6 +75,7 @@ - (instancetype)initWithFrame:(CGRect)frame {` | 旧 cache tag 初始化；新版属性默认和 setter 取代。 |
| #37 | `@@ -111,6 +112,11 @@ - (BOOL)hasAccessibilityFooterElements {` | Container layoutSubviews 在显式 tag 生效但 ScrollView 晚挂载时重试 setup；v4 mountingTransactionDidMount 和 handle 刷新取代。 |
| #38 | `@@ -164,6 +170,11 @@ - (void)setScrollableOptions:(ScrollableOptions *)scrollableOptions {` | Container setter 把 registeredScrollViewTag 传给 Content；由上游 scrollableHandle 的 Controller→Content 链路取代。 |
| #39 | `@@ -178,6 +189,11 @@ - (void)setupScrollable {` | Container refreshRegisteredScrollViewLayout 先 setup 再转发 Content 刷新；v4 handle/mount 重试取代，旧 frame pin 不叠加。 |
| #40 | `@@ -214,6 +230,7 @@ - (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childCompone` | Content 挂入 Container 时重播 cached tag；由 v4 Content 安装与 scrollableHandle/setup 链路取代。 |
| #41 | `@@ -32,6 +32,8 @@ NS_ASSUME_NONNULL_BEGIN` | Content 自定义 tag/配置声明；上游 handle 声明取代。 |
| #42 | `@@ -47,6 +49,11 @@ NS_ASSUME_NONNULL_BEGIN` | Content 强制刷新方法声明；上游 clear/setup 与 mount retry 取代。 |
| #43 | `@@ -31,6 +31,10 @@ @implementation TrueSheetContentView {` | 新增 resolvedIndicatorBottomInset helper，取原 indicator inset 与 sheet bottom inset 最大值；底部下限保留，并适配 v4 UIKit 自动调整。 |
| #44 | `@@ -39,6 +43,7 @@ - (instancetype)initWithFrame:(CGRect)frame {` | 初始化 registeredScrollViewTag=-1；旧 tag 状态由上游 handle 取代，-2 专门表示兼容自动发现。 |
| #45 | `@@ -129,6 +134,15 @@ - (void)clearScrollable {` | Content tag setter 在目标变化时 clearScrollable；上游 scrollableHandle setter 已清理旧绑定。 |
| #46 | `@@ -161,12 +175,37 @@ - (void)setupScrollable:(BOOL)enabled bottomInset:(CGFloat)bottomInset {` | setupScrollable 使用 indicator 下限并叠加 keyboard height；显式绑定后异步刷新内外 ScrollView layout；保留下限，重试由 v4 mounting transaction 覆盖，手工 frame 不延续。 |
| #47 | `@@ -197,7 +236,24 @@ - (void)updateScrollViewHeight {` | 新增 refreshRegisteredScrollViewLayout 的条件重 pin/layout；findScrollView 优先显式 tag；改由 v4 handle lookup/mount 重试和同步 Yoga 尺寸取代。 |
| #48 | `@@ -220,6 +276,23 @@ - (RCTScrollViewComponentView *)findScrollView {` | 递归精确查找 registered tag；上游 findViewWithTag 已覆盖，另保留 -2 的旧两层 fallback。 |
| #49 | `@@ -287,7 +360,7 @@ - (void)keyboardWillShow:(CGFloat)height duration:(NSTimeInterval)duration curve` | keyboardWillShow 改用 indicator floor + keyboard height；整合到新版 content/indicator inset 更新，避免丢失 sheet 底部下限。 |
| #50 | `@@ -360,7 +433,7 @@ - (void)keyboardWillHide:(NSTimeInterval)duration curve:(UIViewAnimationOptions)` | keyboardWillHide 恢复 indicator floor；保留并使用新版 footer/safe-area 计算。 |
| #51 | `@@ -145,6 +145,23 @@ - (void)handleBackPress:(double)viewTag resolve:(RCTPromiseResolveBlock)resolve` | iOS Module 自定义 tag 方法；prop/Fabric 取代。 |
| #52 | `@@ -38,6 +38,9 @@ typedef void (^TrueSheetCompletionBlock)(BOOL success, NSError *_Nullable error)` | iOS View 自定义方法声明；prop/Fabric 取代。 |
| #53 | `@@ -65,6 +65,7 @@ @implementation TrueSheetView {` | View cached tag 状态；v4 _scrollableHandle 取代。 |
| #54 | `@@ -87,6 +88,7 @@ - (instancetype)initWithFrame:(CGRect)frame {` | View cache 初始化；上游 init/default prop 取代。 |
| #55 | `@@ -288,6 +290,19 @@ - (void)updateState:(const State::Shared &)state oldState:(const State::Shared &` | View 方法到 Container 转发；上游 Controller/Content 标准路径取代。 |
| #56 | `@@ -377,6 +392,7 @@ - (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childCompone` | View 挂载时重播 cached tag；上游挂载事务 retry 取代。 |
| #57 | `@@ -26,8 +26,8 @@ - (instancetype)init {` | iOS grabber 最小热区参数；保留。 |
| #58 | `@@ -144,14 +144,14 @@ - (void)applyConfiguration {` | iOS 全行 frame 与独立 pill 几何；保留并遵守 v4 VoiceOver 内框。 |
| #59 | `@@ -81,6 +81,15 @@ - (void)keyboardWillChangeFrame:(NSNotification *)notification {` | keyboard hide 平滑 detent 重算；调用 v4 invalidateDetents 的 animateChanges 实现。 |
| #60 | `@@ -143,6 +143,13 @@ - (void)handleBackPress:(double)viewTag resolve:(RCTPromiseResolveBlock)resolve` | tvOS 空方法 stub；无旧命令后不再需要。 |
| #61 | `@@ -320,6 +320,17 @@ export class TrueSheet extends PureComponent {` | ESM class 自定义 setScrollableView；上游 scrollableRef 取代。 |
| #62 | `@@ -503,4 +514,4 @@ const styles = StyleSheet.create({` | ESM 文件末尾换行；无运行行为，以新版文件为准。 |
| #63 | `@@ -113,9 +113,13 @@ export interface NativeProps extends ViewProps {` | ESM Fabric Android props；与 source Codegen 镜像保留。 |
| #64 | `@@ -1,4 +1,4 @@` | class d.ts 新增 React Component 类型 import；只服务旧 setScrollableView 参数，方法移除后不延续。 |
| #65 | `@@ -96,6 +96,11 @@ export declare class TrueSheet extends PureComponent<TrueSheetProps, TrueSheetSt` | class d.ts 的 setScrollableView 声明；scrollableRef prop 替代。 |
| #66 | `@@ -113,4 +118,4 @@ export declare class TrueSheet extends PureComponent<TrueSheetProps, TrueSheetSt` | class d.ts 末尾换行；无行为。 |
| #67 | `@@ -1,4 +1,4 @@` | Props d.ts 新增 React Component 类型 import；只服务旧自定义方法，以 v4 scrollableRef 类型替代。 |
| #68 | `@@ -336,6 +336,10 @@ export interface TrueSheetProps extends ViewProps {` | Props d.ts 新增 androidHideFriction 和 androidSignificantVelocityThreshold 两个 numeric Props；均保留真实声明。 |
| #69 | `@@ -436,6 +440,14 @@ export interface TrueSheetProps extends ViewProps {` | Props d.ts 新增 disableStackingTranslation 属性及文档；保留真实声明。 |
| #70 | `@@ -601,6 +613,11 @@ export interface TrueSheetMethods {` | Props d.ts 自定义方法签名；改用 v4 scrollableRef。 |
| #71 | `@@ -642,4 +659,4 @@ export interface TrueSheetStaticMethods {` | Props d.ts 末尾换行；无行为。 |
| #72 | `@@ -62,9 +62,13 @@ export interface NativeProps extends ViewProps {` | Fabric d.ts 三项扩展 Props；保留并与源码一致。 |
| #73 | `@@ -88,4 +92,4 @@ export interface NativeProps extends ViewProps {` | Fabric d.ts 末尾换行；无行为。 |
| #74 | `@@ -38,6 +38,11 @@ interface Spec extends TurboModule {` | TurboModule d.ts 命令；改用 Fabric handle，不再需要。 |
| #75 | `@@ -53,4 +58,4 @@ interface Spec extends TurboModule {` | TurboModule d.ts 末尾换行；无行为。 |
| #76 | `@@ -1,6 +1,7 @@` | source class 新增 React Component 类型 import（RefObject 原先已存在）；旧自定义方法改为 scrollableRef 后无需该新增 import。 |
| #77 | `@@ -424,6 +425,21 @@ export class TrueSheet` | source class setScrollableView；库内消费者改用 scrollableRef，不保留重复命令。 |
| #78 | `@@ -1,4 +1,4 @@` | source types 新增 React Component 类型 import；旧方法参数由 v4 scrollableRef 替代。 |
| #79 | `@@ -388,6 +388,21 @@ export interface TrueSheetProps extends ViewProps {` | source types 新增 androidHideFriction、androidSignificantVelocityThreshold 两个 numeric Props；保留，附带误重复的 JSDoc 开头不复刻。 |
| #80 | `@@ -501,6 +516,15 @@ export interface TrueSheetProps extends ViewProps {` | source types 新增 disableStackingTranslation 属性及文档；完整保留能力。 |
| #81 | `@@ -694,6 +718,12 @@ export interface TrueSheetMethods {` | source types 自定义方法；改用上游 scrollableRef。 |
| #82 | `@@ -113,9 +113,13 @@ export interface NativeProps extends ViewProps {` | source Fabric 三项 Android Props；保留真实 Codegen 类型。 |
| #83 | `@@ -45,6 +45,12 @@ interface Spec extends TurboModule {` | source TurboModule 自定义签名；绑定由 Fabric prop 取代。 |

### 新发布入口复核

目标发布物只有 ESM，没有另一个 CommonJS 运行入口。Metro source、lib/module、lib/typescript/src、lib/module/fabric 的 Codegen 源副本、source Fabric、iOS/Android 均以 npm tarball 为基准。JS 和声明对应的五份 source map 同步调整行映射，保留发布包的外部 source 约定，并逐一解析源路径到最终 src 文件；不留旧生成行号或重复 sourceRoot 路径。新补丁新增的 TrueSheetBottomSheetBehavior 路径防止 v4 覆写的 release 判断绕过可配置阈值；BlurView/Controller 补回旧公开 blurOptions；Web 补无退出动画 dismissal 完成；src/web/layout.ts、ESM 与 map 对齐添加 opacity:0，使测量副本即使包含 visibility:visible 的导航子树也不绘制。

没有把旧 TurboModule、Container 头文件、class 方法声明机械复制到新架构。逐文件/逐 hunk 的替代依据见上表；旧补丁中纯换行、重复说明和 context-only hunk 均不含能力。

## 依赖与补丁落地

- 根目录 package.json 的 devDependency/peerDependency、example dependency 精确设为 =4.1.2；未改变 Expo/RN/Router/Reanimated/Worklets 的直接版本。
- 原 patchedDependencies 实际在 examples/app/package.json。旧版本 key/文件引用已移除，改为新版本；新增根目录 TrueSheet patchedDependencies，使库自身类型检查使用真实 patched 包，而非 ambient 扩展模拟。
- 两个 bun.lock 均由 Bun 实际安装更新。example lock 因 optional peer 改变而重排已存在的 Radix Presence 1.1.10/1.1.11、Navigation core 7.21.11/7.21.12 去重位置；没有顺带升级这些依赖的直接声明。其他 patch 文件未重生成。
- scripts/sync-patches.mjs 和 clear-patch-cache.mjs 已检查，未改写。sync 脚本采用合并，故旧 TrueSheet key 单独清掉，未误删其他 patchedDependencies。
- src/core/types/external.d.ts 去掉针对旧包的三项 ambient Props 扩展，保留 Picker、RN 等其他声明。扩展现在属于 patched source/d.ts/Codegen/native 的真实链路。
- 新 patch 两份逐字节一致。开头历史注释块逐字保留，后追加 4.1.2、每类行为状态和本审计入口。

## 验证结果

最终可机读证据见 true_sheet_4.1.2_verification.json。原始过程日志在上述临时目录，包含失败尝试，未把重试后的成功冒充为首次成功。

| 检查 | 结果与边界 |
| --- | --- |
| 原始 3.11.12 基线测试 | 108 pass / 0 fail |
| hunk 完整性 | 新补丁 33 文件、79 hunk；规范内嵌 validator 通过 |
| 干净 4.1.2 dry-run | git apply --check --verbose 与 patch --dry-run -p1 通过 |
| source map | 五份 map 的生成/源行范围、外部 source 路径与最终源码全部核对通过 |
| 真正应用与 skipped 检查 | 独立干净发布包 git apply --verbose 通过；日志无 Skipped patch；全部目标文件与 new-final 字节相同 |
| git diff --check | 发布包临时树与主项目均通过；曾发现的 EOF 空行已清掉 |
| Bun 实际应用 | 在 examples/app 执行项目 clear-patch-cache + bun install --force；根目录也执行；只清项目脚本匹配的 patch cache，未清空用户 Bun 缓存 |
| 已安装源码 | root 和 example 实际包均 4.1.2；各自全部 33 个 patch 目标文件逐字节等于最终预期树（合计 66 次文件比较），不是关键字抽查 |
| 现有 Portal/Toast/键盘/导航测试 | 保留并纳入完整 test suite；结果见下方最终状态 |
| 新测试 | focus/blur ScrollView owner 切换与卸载保护、临时弹层移除后恢复原绑定、present ref 刷新、auto Stack 当前页/Header 测量；命令队列 coalesce/StrictMode/卸载/过期事件，auto/固定布局，无 v3 经验位移；真实 v4 Web 组件 present/dismiss/resize/事件 Promise 时序；公开 Props/ScrollView/FlatList/backgroundFollowsTheme 类型覆盖 |
| Web 真实浏览器 | 生产包中验证初始关闭不闪现；auto 打开、动态 3→30 行、切换固定档位、absolute→relative Footer、输入与关闭；Stack 长短列表切页/返回、auto Stack 高度收缩/展开与长列表实际滚动、Escape 关闭；未代替全矩阵 |
| Android 设备 | 识别到 Xiaomi M2102J2SC 真机，但设备锁屏；未解锁、未安装覆盖应用、未宣称手势回归通过 |
| iOS 首次构建 | CocoaPods 安装 4.1.2 完成；系统 Ruby 有 Expo filter_map 警告；普通完整构建在 RN React-CoreModules 缺 react/bridging/EventEmitter.h 失败 |
| iOS 后续排查 | 仅命令行增加 ReactCommon header 搜索路径并限制 arm64；发现并修正补丁 grabber 的 VoiceOver 常量编译遗漏；最终结果见下方 |

最终检查（最后源码与已安装补丁）：

| 项目层检查 | 最终结果 |
| --- | --- |
| bun run test | 117 pass / 0 fail，27 个测试文件，1294 次断言；原有 Portal、Toast、键盘、导航与弹层测试保留 |
| 隔离子进程 | 真实 v4 Web 的生命周期/测量副本 2 项；focus-aware binding 与 auto Stack 测量 2 项，均通过；不重复加到上述主套件数量 |
| bun run typecheck | 库 tsc --noEmit + examples/app tsconfig.typecheck.json 均通过；包含公开 API 及 test/types/true_sheet_v4.tsx |
| bun run build | 库 TypeScript JS/声明构建通过 |
| examples/app: bun run build:web | Expo Web 生产导出通过；实际生产产物已在浏览器烟测 |
| Android Release | ./gradlew :app:assembleRelease -PreactNativeArchitectures=arm64-v8a --console=plain 通过；最后增量构建通过；不是设备运行回归 |
| iOS Release arm64 Simulator | xcodebuild 最终 BUILD SUCCEEDED；使用下述仅 CLI 环境补偿；未宣称默认无参数构建通过，也未宣称已启动模拟器完成原生交互 |

Web 浏览器最终复核 auto Stack：45 行长列表的可见 viewport=441px、scrollHeight=1802px、滚到底 scrollTop=1361px，截图实际显示第 34–45 行；回顶切短页后 sheet 顶部从 0px 收至 187px（505px 高 viewport）。测量副本 opacity=0，不能覆盖实际滚动内容。该结果只覆盖当前桌面内嵌浏览器，不代表移动 Safari/Chrome、触摸拖动、系统软键盘或三端全部场景。

本次实际修复过程中，Web 生产浏览器先后发现 auto 的 flex-basis:0 折叠、auto Stack 内容超过 viewport、全高 JS card 切到 document scroll、visibility:visible 后代使测量克隆绘制；均修正后重建并复测。最后两端原生编译完成后，仅修正了 4 份 source map 的路径与映射元数据，再次强制安装并完成全部目标文件字节比较；与编译时已记录的目标文件散列比对，全部非 map 文件保持一致，因此没有因 map 元数据调整重复原生编译。

iOS 可复核命令（没有写进工程构建配置）：

```sh
cd examples/app/ios
xcodebuild -workspace rnuikitrelease.xcworkspace -scheme rnuikitrelease \
  -configuration Release -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,id=0964B30C-A132-4823-A9A8-7E8552BFF9BA' \
  -derivedDataPath /tmp/rn-ui-kit-truesheet-0bL1l8/ios-derived \
  ARCHS=arm64 ONLY_ACTIVE_ARCH=YES \
  'HEADER_SEARCH_PATHS=$(inherited) $(PODS_ROOT)/../../node_modules/react-native/ReactCommon' \
  CODE_SIGNING_ALLOWED=NO
```

失败记录：首次 iOS 默认头文件路径构建失败；排查阶段 grabber 缺少 VoiceOver 用 kHitPaddingHorizontal 常量，已修正并重新生成/强制安装/全文件比对/构建。最终列出的检查命令均通过；普通 iOS 构建命令仍需修复本机头文件搜索环境，不能把 CLI 补偿视为工程配置已修复。设备手势与视觉检查仍未验证，不能由上述成功替代。


## 修改文件索引

完整 41 个改动路径（含两份旧 patch 删除）在 verification.json 的 changedProjectFiles 中；新补丁 33 个发布目标文件及散列在 installedTargets 中。

- 依赖：根目录与 examples/app 的 package.json、bun.lock；两处 TrueSheet patch 更新为 4.1.2。
- 入口封装：native_sheet.native.tsx / .web.tsx、native_sheet_stack.native.tsx / .web.tsx；新增 sheet_command_queue.ts 与 web_sheet_commands.ts。
- 内部 TrueSheet：panel.tsx、stack_host.tsx、stack_navigation.tsx、scrollable_binding_context.tsx、platform_sheet_defaults.ts、true_sheet_scroll_context.tsx；新增 auto_stack_layout_context.tsx、detent_layout.ts。
- 滚动与布局：NativeSheet scroll_content.tsx、fill_content.tsx、true_sheet/scroll_content.tsx re-export、通用 ScrollView、SwiftUI NativeList 的原生 inset 标识。
- 弹层：overlay_layout_metrics.ts、overlay_toast_layout.ts、screen_overlay_portal.tsx；保留 Portal/Toast/键盘与 host 边界。
- 声明与示例：external.d.ts、debug_panel.tsx、debug_section_page.tsx、组件示例 sheet.tsx。
- 验证：true_sheet_v4.test.js、true_sheet_web.test.js 及两个隔离 fixture、test/types/true_sheet_v4.tsx；本审计与 verification.json。

## 需要实际设备执行的验收步骤

准备：examples/app 先执行 bun run clear-patch-cache、bun install --force，iOS 再 pod install。使用自己的常规原生构建方式启动；Android 右侧滚动必须安装 Release，不能只用 Expo Go/Debug。每项同时记录系统版本、机型、detent、期望/实际和录像。以下未标明已执行的交互均待用户确认。

### 通用入口与生命周期

1. 调试首页 → 组件示例 → Sheet。关闭页面前后各打开/关闭多档 Sheet 10 次；快速点开/关/再开，切后台再回来，展示中离开页面；不应幽灵遮罩、悬空 Toast host 或卸载后重开。
2. 多档 [0.4,0.6,1]，百分比 40/65/90：按钮 resize、手指拖档，观察 position 与 onSnapPointChange；同档重复设置不重播 present。横竖屏分别确认内容限高。
3. “打开 auto 回归 Sheet”：3 行与 30 行反复切换；auto ↔ 固定档位；长列表滚到底、回顶部、继续下拉。打开过程中改变内容，不能高度抖动、卡顿或空白。
4. Footer absolute/relative 切换，各自配 Header relative/absolute；看最后一行、Footer、Home Indicator、安全区和 scrollbar，不得重复加 safe area 或键盘高度。

### iOS

1. 至少用 iOS 18 与 iOS 26.1+ 各一台/模拟器；若仍支持 iOS 15，复核 medium/large fallback 与横屏。
2. Grabber 使用 custom native options，触摸 pill 左右两侧同一透明行拖动，pill 外观不变；开启 VoiceOver 聚焦/增减 detent，不能因 accessibility frame 越顶自动跳档。
3. auto/固定 custom detent：先点输入框一，再切二、系统收起键盘、拖下收键盘，重复 5 次；回弹应连续，Footer 与 indicator 同步，不残留 keyboard inset。
4. Stack Sheet 的根 NativeList → 详情 → 返回；RN 长列表 → RN 短列表 → 返回；每次滚到顶下拉，再上下滚动，确认当前页而非背后页在滚动；原生标题栏、iOS 26 scroll-edge blur 不丢失。
5. “打开 auto Stack Sheet”后进入 RN 长/短列表，确认高度随当前页更新且转场不零高；原生 SwiftUI List、自定义绝对布局页面另测，必要时提供页面显式高度，记录其 intrinsic size 限制。
6. 系统默认玻璃、透明背景、显式 backgroundColor、backgroundBlur + blurOptions intensity/interaction 分开测试；切主题与 backgroundFollowsTheme，两种背景模式均保留。

### Android Release

1. 选屏宽 80%–95% 的右侧区域，上滑长列表到底再回顶；不得把正常向上滚动误判为整张 Sheet 拖动。对根页面与 Stack 第二/第三页都执行。
2. 在长列表 offset>0 时向下滚动只能滚列表；回到顶继续向下应交给 Sheet。短/空列表、嵌套可滚动区域、横向手势、带 refreshControl 分开测试；refresh 手势不能无条件被接管。
3. 从 pill 左/中/右透明整行分别拖动；draggable=false 时都不能移动。多指触摸、中途 CANCEL 后下一次手势正常。
4. androidHideFriction 分别 0.3、2；androidSignificantVelocityThreshold 分别 200、10；慢拖与快甩对比。half 和 short 两种 dismissThreshold 分别测，参数应只影响其约定路径。
5. 两/三层 Sheet，父/子分别切 disableStackingTranslation；关闭子层、按返回、前后台恢复，确认父层位移与拖拽恢复。
6. auto+scrollable 反复打开、打开中追加行、键盘开关；录屏检查动画阶段测量稳定性，不能把 Release 编译成功等同于此项通过。

### Web 与嵌套弹层

1. bun run build:web 后以本地静态服务测试生产产物，桌面浏览器和移动 Safari/Chrome 各测。拖拽、遮罩关闭、Escape、点击输入框、Tab 焦点、页面滚动锁；关闭后背景恢复滚动/焦点。
2. 快速 present → resize → resize → dismiss → present；记录 onWillPresent/onDidPresent/onDetentChange/onWillDismiss/onDidDismiss 和 Promise。重复打开已打开 Sheet 不应报 already-presented；resize Promise 不保证动画已结束。
3. 启用 reduced-motion/无 CSS 退出动画，关闭 Promise 仍须完成；展示或关闭中卸载不应挂起等待或重新打开。
4. Sheet 内分别打开 Dialog、AlertDialog、Popover、Toast，检查位置、遮罩、点击外部与焦点；弹层关闭不能同时关闭下方 Sheet。再测 Dialog 内 Sheet，子 Sheet 内再开 Popover/Toast；按由内到外顺序关闭，不能穿透或漏锁。
5. 组件总览/调试分区已有嵌套 NativeSheet、Portal 与 Toast 场景保持使用；普通 pageSheet 与 TrueSheet 都测，避免只修好一种 host。

完成三端验收后再另开 HeroUI 任务。本升级没有启动 HeroUI 接入。
