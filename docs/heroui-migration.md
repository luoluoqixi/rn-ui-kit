# HeroUI 迁移：底座隔离与主题重构

日期：2026-11-21。工作分支：`dev-heroui`。

## 第一阶段：底座接入

TrueSheet 已完成 4.1.2 升级，用户已在 iOS / Android 真机验证大部分场景。本批在此基础上接入两套 HeroUI 底座，保留 rn-ui-kit 的对外组件 API、现有系统原生实现及 TrueSheet 补丁。

- iOS / Android 的自绘组件迁移目标是 `heroui-native`。
- Web 的自绘组件迁移目标是 `@heroui/react`。
- `native` 属性表达系统原生实现，不能与“运行在 Native 平台”混为一谈。所有组件已有的系统原生分支和功能都需要保留。
- 本批仅新增底座、构建隔离及验证页；没有把现有 Button、Dialog 等实现替换成 HeroUI。
- 示例应用的 `App.tsx`、`RootProvider` 调用方式及业务组件调用不需要改变；构建配置和依赖已更新。
- 第一阶段没有需要用户额外决定的阻塞项，使用 HeroUI 默认主题色；第二阶段已统一项目主题，见后文。

## 依赖与 Provider

| 包 | 本批锁定版本 | 所属 |
| --- | --- | --- |
| heroui-native | 1.1.1 | 库 dependencies，仅 Native 入口导入 |
| @heroui/react | 3.2.7 | 库 dependencies，仅 Web 组件导入 |
| @heroui/styles | 3.2.7 | 库 dependencies，仅 Web CSS 导入 |
| tailwind-variants | 3.3.1 | 库 dependencies，满足 HeroUI peer 依赖 |
| @tailwindcss/postcss | 4.3.2 | 示例应用 devDependencies，与现有 @tailwindcss/node 工具版本一致 |
| postcss | 8.5.23 | 示例应用 devDependencies，复用原有锁文件中的版本 |

未升级 Expo、React Native、Reanimated、Worklets、Uniwind 或 TrueSheet。没有新增原生模块；`expo-blur` 是 HeroUI Native 的可选依赖，本批没有启用相关玻璃/模糊功能。后续使用这些功能时再独立评估，不能因为可选依赖未安装而删除现有原生玻璃实现。

`UIProvider` 内部新增平台适配：

- `heroui_provider.native.tsx` 使用发布包提供的 `HeroUINativeProvider`，关闭它的 Toast。沿用现有 GestureHandlerRootView、SafeAreaProvider、Toast 和 RNR/Teleport portal 系统。
- `heroui_provider.tsx` 是 Web 的透传入口，无 HeroUI Native 导入。HeroUI React v3 不需要额外 Provider。
- 1.1.1 发布包仅提供主入口、样式入口等有限 exports，未提供 `provider-raw`。不能直接照搬其他版本文档中的私有或未发布子路径。
- Native Provider 自带其独立的 HeroUI PortalHost；本批没有据此改变现有弹层的宿主和层级。

## JS 与 CSS 分别隔离

### JS

组件和内部适配层使用 `.native.tsx` 与默认 Web `.tsx` 文件分流，禁止在共享模块中同时导入两套 HeroUI 后再通过 `Platform.OS` 选择。Web 导入优先使用 `@heroui/react/button`、`@heroui/react/modal` 等公开子路径。Native 1.1.1 使用实际支持的主入口。

`scripts/metro/heroui.cjs` 导出 `withHeroUIConfig`，也通过 `rn-ui-kit/metro` 对外提供。它接续宿主原有 resolver，并检查包名及解析后的文件路径：

- Web 解析到 `heroui-native` 即报错。
- iOS / Android 解析到 `@heroui/react` 或 `@heroui/styles` 即报错。
- 检查解析后路径，使别名不能绕过限制。

隔离指运行时模块图与样式内容；两套依赖仍然都安装在开发工程的 node_modules 中。不是依靠 tree shaking 才删除另一套库。

### CSS

同一个 Expo / Metro 服务可以处理三端，App 仍然只导入 `./global.css`：

| 目标 | 实际 CSS 入口 | 编译链 | HeroUI 样式 |
| --- | --- | --- | --- |
| Web | examples/app/global.css | Expo 内置 PostCSS → @tailwindcss/postcss | @heroui/styles |
| iOS / Android | examples/app/global.native.css | Uniwind 自带 Tailwind 编译及 Native 样式转换 | heroui-native/styles |

resolver 把 Native 对 Web CSS 入口的请求映射到 Native CSS 入口；Uniwind 的 `cssEntryFile` 固定指向 Native 文件，Web CSS 交给 Expo 处理。没有自定义 transformer，也没有按构建请求重写同一个 CSS 文件。

Web CSS 不导入 `uniwind` 样式：它是 Native 编译时生成的文件，会带入 Native 的主题变量声明。Web 保留 Uniwind **运行时**，继续支持既有 RN Web className 和主题切换，并显式定义 `.light` / `.dark` 变体。

两端先导入各自 HeroUI 样式，再导入 `src/styles.css`。后者保留 portal、scrollbar 辅助样式，并加载第二阶段生成的 HeroUI 源变量；旧 RNR 主题声明与圆角覆盖已移除。

### 接入中确认的两个构建约束

1. 链接库与示例应用各自安装了 Uniwind。配置助手必须通过 `createRequire(projectRoot/package.json)` 解析**宿主那份** Uniwind，保证 resolver、transformer、运行时重定向和生成 CSS 一致，否则 Web 样式适配器可能递归。
2. Uniwind 1.11 的主题扫描器会单独编译包级 CSS import。`heroui-native/styles` 必须与 `tailwindcss`、`uniwind` 的 package imports 放在同一 Native 全局入口，不能藏进仅包含这一包导入的中间 CSS 文件；否则扫描阶段会报 unknown variant: light。

本批增加了相应的 resolver / CSS 图测试，且使用实际 Expo 三端导出验证了上述配置。

## 如何运行与验证

首次拉取依赖或重新安装时，在库根目录和示例应用中分别执行 `bun install --frozen-lockfile`。库根目录的 dependencies 包含两套 HeroUI；示例应用通过 Metro 的现有 nodeModulesPaths 使用它们。示例是本仓库的链接开发配置，所以 Metro 直接按相对路径加载助手；常规安装的宿主可以 `require("rn-ui-kit/metro")`。

在示例应用目录继续使用原有命令：

```sh
bun run start --clear
```

原有 `web` / `ios` / `android` 命令也保留。验证页入口为：**组件示例 → HeroUI 接入验证**。

验证页直接渲染对应平台的真实 HeroUI 组件，提供计数、次要/禁用按钮、独立弹层，以及现有 NativeSheet 内的 HeroUI 弹层。弹层内有输入框供键盘验证使用。没有用现有 rn-ui-kit Button 代替 HeroUI 组件完成验证。

自动检查（在库根目录）：

```sh
bun test test
bun run typecheck
bun run build
```

模块图检查需要带 source map 的实际导出。先在示例应用目录运行：

```sh
bunx expo export --platform all --source-maps --no-bytecode --output-dir .expo/heroui-verification
```

然后在库根目录运行：

```sh
bun run check:heroui-bundle web examples/app/.expo/heroui-verification
bun run check:heroui-bundle ios examples/app/.expo/heroui-verification
bun run check:heroui-bundle android examples/app/.expo/heroui-verification
```

检查脚本既要求目标平台确实包含 HeroUI，也禁止混入另一端的包，支持普通及 sectioned source map。`--no-bytecode` 只用于这项调试检查，不应加入正式发布构建。Expo 同时导出三端时可能在输出中列出一个 **0 字节**的 global.native.css 元数据产物；单独 Web 构建没有该文件，也没有 Native 样式内容。

## 本批验证结果

- 原有基线 117 tests 通过；新增 5 项隔离检查后，122 tests 全部通过。
- 库和示例应用 TypeScript 检查通过；库构建通过。
- Expo 同一配置同时导出 Web / iOS / Android 成功；这是 JS/CSS 导出，不能等同于原生 Release 编译或设备验收。
- 实际 source map：Web 包含 12 个 HeroUI React 模块，iOS / Android 各包含 361 个 HeroUI Native 模块；三个平台的另一端 HeroUI 模块均为 0。
- Tailwind 实际 CSS 导入图：Web 有 @heroui/styles、没有 heroui-native 或 Uniwind 生成 CSS；Native 有 heroui-native、没有 @heroui/styles。
- 原有 `build:web` 命令成功，资源路径重写脚本通过。
- 同一开发服务并发处理 Web / iOS / Android 的 dev bundle 请求成功；本次开发服务以 CI 模式运行，没有据此声称验证过 Fast Refresh。
- 生产 Web 浏览器验证通过：按钮计数、禁用状态、Modal 输入框、Escape 关闭、焦点回归、TrueSheet 内打开/关闭 Modal。关闭内层后外层 Sheet 保持打开且可关闭。
- Web 浅色/深色模式的实际 surface 背景和文字颜色会随主题切换；测试后恢复跟随系统。
- 本批没有改动 TrueSheet 补丁或现有组件的系统原生实现。

## 真机验收边界

2026-11-21 用户已反馈 HeroUI 配合 TrueSheet 真机验证通过，作为第一阶段组合验证的验收依据。用户附图包含原生 Sheet 页面、嵌套 TrueSheet 中的 HeroUI Dialog。本轮代理没有运行新的原生 Release 编译或操作真机；该结果不能推广为所有尚未迁移的弹层均已验收。后续弹层迁移继续按以下矩阵回归：

1. 进入验证页，按钮样式、点击反馈和明暗模式正常。
2. 独立 HeroUI Dialog 的遮罩、关闭按钮、输入框和键盘正常。
3. 在 TrueSheet 的 0.6 / 0.9 档位打开 HeroUI Dialog，检查位置与遮罩是否覆盖预期区域，弹层内容是否可点。
4. iOS 重点检查 FullWindowOverlay 与原生 Sheet 的层级、状态栏、关闭动画，以及关闭后 Sheet 是否恢复交互。
5. Android 重点检查返回键先关闭内层，Sheet 不误关，键盘收起后布局恢复，无触摸穿透。
6. Sheet 打开/关闭多次后，不出现遗留遮罩、不可滚动或丢失手势。
7. 在设置中启用“分区嵌套 NativeSheet”，再打开此验证页，重复弹层检查。

若这些场景暴露问题，应在后续弹层适配中沿用现有作用域/宿主经验解决，不能先全局禁用 FullWindowOverlay 或删除原生实现来绕过。

## 第二阶段：HeroUI 语义主题

本轮仅重构 token、主题应用方式和旧组件的颜色引用，没有把业务组件替换为 HeroUI 实现，也没有修改 TrueSheet 补丁、native 分支的能力与 props。

### 单一语义来源

- `SemanticColors` 使用 background / foreground、surface 三级、overlay、accent、default、muted、danger / success / warning、field、segment、border / separator / focus / link。
- `accent` 是实色主操作色，`muted` 是弱文字；轻染背景使用 HeroUI 的 accent-soft，原生具体色值场景使用保留的 accent 色阶。
- 删除 primary / card / popover / mutedForeground / destructive / input / ring / primaryBackground 等旧主题字段与 CSS aliases，直接更新现有组件引用；variant 和系统原生 API 不变。没有维护第二套 RNR 主题兼容层。
- HCT 继续用于强调色生成，保留预设和自定义 hex seed，以及 accent01–accent12。中性容器色独立于 seed，实色主操作色根据实际相对亮度选黑/白文字。对所有预设及白、黑、黄色、青色、中灰 seed 检查文字对比度。
- `scripts/generate-default-themes.js` 同时生成静态 JS 配色与 `src/theme.css`。调整生成器后执行 `bun run generate:default-themes`，禁止手改生成文件。CSS 只扩展 accent 色阶；HeroUI 负责常规颜色 utilities、派生交互色及圆角比例。

### 修复变量冲突与 portal 主题

用户截图中浅色 Dialog 的说明文字偏白。已确认旧 ScopedVariables 把 `--color-muted` 设置为 RNR 的浅背景色，而 HeroUI 将同一 token 用于文字；`accent` 也存在软背景与实色操作的语义冲突。

现在只覆盖 HeroUI 源变量（`--muted / --accent / --surface` 等），不再直接覆盖派生的 `--color-*`。Native 锁定版本的 useThemeColor 读取 --color-*，其编译 getter 会继续解析这些源变量；实际 iOS bundle 已检查 --color-muted → --muted，并包含新的明暗颜色。

UiThemeProvider 同时提供 ScopedVariables，并通过 Uniwind.updateCSSVariables 更新全局 light/dark；Web body portal 因而能读到当前 seed，而不依赖源 DOM 祖先。切换主题及显式 colorScheme 由已解析的 scheme 统一驱动。Native 跟随系统时必须继续调用 Uniwind.setTheme("system")；设置固定 light/dark 会覆盖 Appearance，导致之后的系统外观变化不再跟随。显式 colorScheme 只覆盖上下文内的有效偏好，不改写调用方存储的偏好。一个应用使用一个全局 RootProvider；不承诺多个不同根 Provider 的全局主题互不影响。

### 背景归容器管理

`backgroundFollowsTheme` 已从 UiPreferences、默认值、示例持久化读取及设置 UI 删除。旧 v1 存储保留 accentColor / themeMode，其余字段读取后丢弃并在下次保存时移除。

`appBackgroundColors` 改为 `{ light?: Partial<AppBackgroundColors>, dark?: Partial<AppBackgroundColors> }`，每个模式可部分覆盖 screen / sheet / card / header。RootProvider、默认导航主题和 useAppBackgroundColors 使用同一解析结果，屏幕、Sheet 的独立背景 props 继续优先；iOS 26 默认玻璃逻辑保持。主题种子不再暗中切换容器背景。

### RNR host 的清理边界

真机验证通过意味着 HeroUI Dialog 不必照搬旧 RNR host 方案，但现在不能整体删除现有 host：

| 当前能力 | 使用者 | 清理条件 |
| --- | --- | --- |
| @rn-primitives PortalHost、局部 hostName | 未迁移的 Dialog / AlertDialog / Popover / Select / ContextMenu 等 | 对应自绘分支全部换成 HeroUI，且没有旧 consumers |
| useOverlayPortalContentStyle 坐标补偿 | RNR 定位弹层 | 不再使用其页面坐标定位之后删除 |
| OverlayPortalWindow / FullWindowOverlay / 原生 Modal 包装、modal lock | 当前弹层和 TrueSheet 组合 | 逐个替换后检查全部调用方及子 Sheet 交互 |
| Web OverlayPortalScope / submenu portal / modal content scope | 现有 Radix/旧菜单与嵌套 Sheet | 对应弹层迁移并通过嵌套、焦点、关闭回归之后删除 |
| ScreenOverlayPortalProvider / Teleport host / Toast 路由与 detent inset | Toast、Floating、TrueSheet 局部窗口 | 按剩余使用者拆分，不能随 RNR host 一并删除 |
| 系统原生组件、NativeDialog / NativeTrigger 与原生菜单行为 | 各组件 native 分支 | 保留，只更新 token 或必要的主题桥接 |

清理可以随对应批次进行，无需等到所有组件迁移完毕；每项以零旧消费者及替代实现验收为条件。不能将 HeroUI Dialog 的验收直接视为 Popover / Menu、Toast、键盘、Android 返回及子 Sheet 已全部覆盖。

### 第二阶段验证

- 130 tests 通过、0 失败，1806 项断言，29 个测试文件；包含主题源变量、实际两端 Tailwind 编译、所有预设/边界 seed 的对比度、容器背景覆盖、旧偏好丢弃、显式 scheme 覆盖，以及隔离环境中 ThemeProvider 的自适应模式和动态更新回归。
- 库/示例 TypeScript、库构建、示例原有 build:web 均通过。
- Expo 三端带 source map 导出通过；Web 12 个 HeroUI React 模块、0 Native 模块；iOS/Android 各 361 个 HeroUI Native 模块、0 React 模块。
- Web 生产浏览器实测浅色、深色、预设色和自定义 hex 配色、计数、禁用、弹层输入/Escape/焦点返回、TrueSheet 内弹层与关闭后外层操作。实际说明文字为浅色 #62626c、深色 #a1a1aa；暗色 overlay 为 #202024，输入框前景正常。测试后恢复 ocean / system。
- 本轮未运行新的原生 Release 编译或真机配色回归；请在同一 HeroUI 验证页确认 Native 的明暗切换、说明/placeholder、主题色和 Sheet 内输入表现，特别是系统外观切换。
- 依赖声明、锁文件、所有 patch 与 patch 顶部注释均未改动。

## 后续批次

1. **主题重构（已实现）**：见上文第二阶段。真机重新观察配色后进入简单组件迁移。
2. **简单自绘组件**：优先 Button、Accordion 等，在保留原有 API 和系统原生分支的前提下逐一替换。尺寸、disabled/loading、ref、事件及可访问性需要逐项适配，不能简单按同名属性透传。
3. **弹层**：Dialog、AlertDialog、Popover 等；先验证根页面、TrueSheet、嵌套 Sheet、导航和键盘，再替换现有实现，重点是两端原生层级和 Android 返回行为。
4. **复杂组件**：Select、Dropdown、Menu 等，仅替换自绘分支。逐一盘点所有组件现有 native 功能，不能仅按少数几个组件名单保护。
5. **独立组件与收尾**：SplitLayout、NativeList、ScrollView、NativeDialog、NativeTrigger、GlassEffect、ColorPicker 等以主题引用调整和组合回归为主。待全量迁移结束，才移除真正无用的 RNR 依赖、样式和兼容代码。

## 参考资料

- HeroUI Native quick start: https://heroui.com/cn/docs/native/getting-started/quick-start
- HeroUI Native 索引: https://heroui.com/native/llms.txt
- HeroUI React quick start: https://heroui.com/en/docs/react/getting-started/quick-start
- HeroUI React 索引: https://heroui.com/react/llms.txt
- Expo Tailwind / PostCSS: https://docs.expo.dev/guides/tailwind/

API 与 exports 最终按锁定发布包中的 package.json、类型和源码核对，避免文档更新速度与 npm 发布包不同步。
