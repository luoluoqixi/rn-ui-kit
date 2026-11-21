# HeroUI 迁移：底座、主题与组件

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
- Native 的导入路径以锁定包的 exports 为准。1.1.1 实际提供 provider-raw、accordion 等公开子路径；当前 Provider 仍沿用已验证的主入口。
- Native Provider 自带其独立的 HeroUI PortalHost；本批没有据此改变现有弹层的宿主和层级。

## JS 与 CSS 分别隔离

### JS

组件和内部适配层使用 `.native.tsx` 与默认 Web `.tsx` 文件分流，禁止在共享模块中同时导入两套 HeroUI 后再通过 `Platform.OS` 选择。Web 导入优先使用 `@heroui/react/button`、`@heroui/react/modal` 等公开子路径。Native 同样优先使用锁定版本公开的组件子路径，例如 heroui-native/accordion。

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

原有 `web` / `ios` / `android` 命令也保留。初期底座的“HeroUI 接入验证”页面在完成真机验证后已移除；后续通过 **组件示例** 中各个已迁移组件的页面进行验证。

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

## 第三阶段：组件封装约定

### 文件命名与职责（后续迁移统一采用）

以 Accordion 为例；其他组件将 accordion 替换为组件名：

| 文件 | 职责 |
| --- | --- |
| index.ts | 唯一且简单的入口，仅导出组件及公共类型 |
| types.ts | 通用模型、公共 props、类型入口；两端 HeroUI 均使用 import type |
| types_heroui_native.ts | HeroUI Native 类型复杂时可选拆分，由 types.ts 引用或导出 |
| types_heroui_web.ts | HeroUI Web 类型复杂时可选拆分，由 types.ts 引用或导出 |
| types_native.ts | 已有系统原生实现的复杂类型；按需创建 |
| accordion.tsx | 薄包装，选择已有系统原生实现或 HeroUI 适配器 |
| accordion_heroui.native.tsx | iOS / Android 的 HeroUI Native 实现 |
| accordion_heroui.tsx | Web 的 HeroUI React 实现 |
| accordion_native.native.tsx | 已有系统原生实现；没有则不创建 |
| accordion_native.tsx | Web 的浏览器原生实现或必要的空实现；按需创建 |

允许必要的内部文本、状态辅助文件，但不再维护 types.shared.ts → types.native.ts 等多层公共类型转接。不创建平台版 index.native.ts。可选类型文件统一使用下划线命名，不使用 types.native.ts 让 Metro 隐式替换公共类型。

Metro 的平台解析与 TypeScript 的解析不是同一个机制。编辑器可以通过 moduleSuffixes 等配置识别平台后缀，并非永远不能识别；但本工程不依赖消费者修改 tsconfig 来获得完整类型。每个平台实现显式引用同一 types.ts，VSCode 和库构建能同时检查两端。import type 在 JS 转译时擦除，声明文件仍保留引用供编辑器检查，因此两套类型可共存，运行时代码仍须隔离。

两端互不兼容的 DOM / RN ref、事件、style、动画不能直接粗暴交叉成一个 props 类型，也不能用断言伪装成通用类型。通用封装参数直接提供；确需底层能力时，通过 herouiNativeProps / herouiWebProps 显式选择，在根或相应 slot 上配置。它们只在对应平台生效，不改变共享状态模型。native 一词仅表达系统原生实现，不能用这些 HeroUI 参数替代或删除已有 native API。

### 尺寸与主题原则

核对两份 HeroUI skill、官方 theming / Accordion 文档以及安装包后：HeroUI 没有给所有组件统一注入 size 的全局 Provider。Button 等组件有自己的 size variants；两端 Accordion 均没有 size 属性。

- 组件有内置 size 时优先适配该能力，保留 HeroUI 默认值；不为每个组件复制旧 RNR 的八档尺寸表，也不要求所有组件具有相同 size 集合。
- 组件无内置 size 时默认沿用 HeroUI。Accordion 本批不额外发明 size，删除迁移草稿中的 sizes.ts / AccordionSize。
- 主题统一颜色、字体、圆角，以及 Tailwind / Uniwind 的间距和字号 token。局部密度通过 triggerProps.className、titleClassName、contentClassName 等 slot 设置，例如 py-2 / text-sm；不要把字体或内边距的差异藏进重复的组件尺寸枚举。
- 今后如果确需应用级 compact / comfortable 密度，应作为单独的跨组件主题设计统一评估。修改基础 --spacing、--text-* 或根字号会影响整体布局，两端 rem 与原生单位也不必相同，不能把它宣称为无副作用的全局 size。
- 当前不更改基础间距、全局字号或字体体系。Native skill 的 HSL 示例与锁定包和现行官方文档存在差异，继续以实际包的源 token / oklch 实现为准，不回退第二阶段主题。

### 示例设计约定（后续迁移统一采用）

- 默认参考 HeroUI Native 官方 app 的演示内容、分组与简洁程度。本机参考仓库为 `/Users/luoqixi/luoqixi/project/AI/heroui-native`，对应页面在 `example/src/app/(home)/components/`。参考项目只读，不把它的依赖、国际化框架或路由一并搬入本项目。
- 参考内容与视觉演示，不复制组合式调用。示例默认使用 rn-ui-kit 的单入口组件与 props，不直接引用平台 HeroUI 组件和内部 hook；需要自定义图标或图片时可以传普通节点。
- 本项目在同一页连续展示多组示例，具体文案按每组功能分别编写，说明当前效果与操作方法；不重复照搬官方独立示例页中相同的 FAQ 或业务场景文本。
- 简单组件的分组使用 ExampleSection，默认复用 ExampleBlock 的 Card 承载标题与演示，使各组有清晰的背景和边界。Card 自身的示例显式设置 withCard={false}，只保留分组标签与演示，避免重复嵌套 Card。示例聚焦实际使用场景，复杂参数组合、非法输入、ref、字体和边界值主要通过自动化测试与 API 文档覆盖。
- 示例目录与页面标题使用本库公开组件名称；Badge 对外只显示 Badge，不附加底层 Chip 实现名称。
- Native 的 ExampleSection 使用同一个布局动画容器包裹分组标签和演示内容，使前一组高度变化时后续分组整体移动。组件自己的布局动画不负责其外部的普通 View / Text；不要为此全局改造 Text，或把示例页面的布局逻辑塞进 Accordion。Web 的分组容器继续使用普通 View。
- Select、Dropdown、Sheet 等项目深度定制示例，以及各组件系统原生 UI 的专属示例，保留其项目特有内容。遇到特殊示例而无法确定是否应替换时，先向用户确认，不自动用官方基础示例覆盖。
- 此约定也写入 `.agents/AGENTS.md`，供后续组件任务读取。

### 首个组件：Accordion

仅迁移 Accordion，调用方仍只使用一个组件，不需要组合 HeroUI 子组件：

```tsx
<Accordion
  selectionMode="single"
  defaultValue="intro"
  titleClassName="text-accent"
  triggerProps={{ className: "py-3" }}
  contentClassName="bg-surface-secondary"
  items={[
    { value: "intro", title: "介绍", content: "内容" },
    {
      value: "details",
      title: item => item.value,
      content: <CustomContent />,
      titleClassName: "text-success",
      triggerProps: { className: "px-6" },
    },
  ]}
/>
```

- 共享 API：items、selectionMode、value / defaultValue / onValueChange、isCollapsible、isDisabled、variant、hideSeparator、nativeHaptics；不再导出旧 RNR compound 子组件或保留 type / collapsible / disabled 等旧参数别名。
- single 的值是 string 或 undefined，multiple 的值是 string[]，由判别联合检查。显式传 value={undefined} 仍为受控的关闭状态；不传 value 才使用内部状态。item.value 必须非空且唯一。
- 保留每项 title / content 节点或回调，以及根级和条目级 itemProps、headerProps、triggerProps、contentProps、titleClassName、contentClassName。条目级普通属性覆盖根默认值，className 使用 tailwind-merge 合并；整组禁用始终有效。titleClassName 只作用于标题文字。
- 公共 triggerProps.onPress 接收实际平台事件联合；需要使用事件专有字段时先收窄。平台专有的 DOM / RN 扩展通过对应 props 对象获得正确提示，不向另一端透传。
- Web 使用真实 HeroUI Item / Heading / Trigger / Indicator / Panel / Body；Native 使用真实 Item / Trigger / Indicator / Content，动画交给 HeroUI。headerProps 在 Web 配置 Heading，在 Native 配置包裹 Trigger 的可选 View，因为 Native Trigger 自带内部 Heading。
- 官方 Native 的默认样式示例在 Trigger 外观中额外组合了 PressableFeedback，Trigger 本身没有缩放或按压底色。封装的 Native default variant 现通过 Trigger.asChild 接入真实 PressableFeedback：仅标题区域使用 Scale，指示器保持原位，Highlight 使用官方示例的 0 → 0.05 透明度；只有一个可点击触发区，保留禁用状态、ref 与按压事件。surface variant 沿用官方普通 Trigger，Web 保持 HeroUI React 的交互实现。调用方无需新增参数或组合子组件。
- contentProps.className / contentClassName 配置带内边距的内容容器；Web 是 Body 的内部容器，Native 是 Content。Web 的 herouiWebProps 则指向动画 Panel（包含 ref），Native 的 herouiNativeProps 指向 Content。
- 标题和基础文字保留项目字体上下文；自定义节点保持组件自身语义。Web 基础文字沿用 HeroUI 的 text-sm，Native 使用文档示例的 text-base；间距、指示器尺寸和动画沿用各自库默认值，不强求两个平台逐像素相同。
- nativeHaptics 仅在 Native 有效；挂载、重复值、禁用和阻止收起时不触发。Accordion 原本没有系统原生实现，因此没有新增虚假的 native 分支。
- 已移除无其他消费者的 @rn-primitives/accordion 直接依赖。其他组件与 TrueSheet 补丁保持本批之前的实现。
- 示例按官方 app 保留默认、surface、多选、无分隔线、自定义指示器、自定义入场动画、景深效果七组；每组使用独立的功能说明文案，避免连续页面重复同一组 FAQ。景深示例通过公开受控状态和 itemProps 实现，Native 使用平台 transform 过渡，Web 使用 CSS 过渡，不引用 Native 内部 hook；不承诺与官方逐帧一致。
- 为自定义指示器补充根级与条目级 `indicator`。可传节点或 `({ item, isExpanded, isDisabled }) => ReactNode`；undefined 继承默认，null / false 隐藏，条目覆盖整组配置。两端按共享受控状态解析回调，默认指示器仍使用真实 HeroUI，定制指示器不会被 Web 默认展开旋转叠加影响。

### Accordion 验证（2026-11-21）

- 迁移初次验收时 133 项主测试通过，0 失败；其中 Accordion 通过隔离子进程分别运行真实 HeroUI Web / Native 组件，各覆盖 7 个交互场景，避免 mock 污染其他组件测试。补充自定义 indicator 与 Native 按压反馈后，Web 覆盖 8 个、Native 覆盖 9 个场景。Native 使用真实 Accordion、PressableFeedback 与 Slot，验证单一触发区、ref、按下 / 松开事件、禁用状态与展开回调；设备、动画 hook 和 SVG 环境被替换，不能视为真机动画帧或手势验收。
- 库与示例应用 typecheck、库 build 通过。新增编译检查同时使用两端 ref、事件及扩展 props，检查 selectionMode 的值类型，拒绝错误平台 ref 和越过共享状态的底层参数。
- Expo Web / iOS / Android 同次带 source map 导出通过。Web 包含 15 个 HeroUI React 模块，iOS / Android 各包含 361 个 HeroUI Native 模块；另一端 HeroUI 模块均为 0。三端旧 RNR / Radix Accordion 模块均为 0，且只包含目标平台的 accordion_heroui 实现。
- 产出的 types.js 仅为 export {}，两套 import type 均未进入 JS。公共 .d.ts 则保留类型引用供编辑器检查。
- 生产 Web 浏览器实测单项切换、多项独立展开、外部受控切换与清空、不可收起、Enter 键展开和条目样式覆盖正常；默认触发区内边距为 16px，紧凑示例的纵向内边距为 8px。浏览器未发现运行错误。
- 用户在进入 Card 批次前已反馈 Accordion 测试没问题。本轮不宣称重新执行过 iOS / Android 真机测试；三端导出与 DOM 测试仍不能替代设备验收。

### 第二个组件：Card

Card 原先是项目内的 View / Text 自绘封装，并没有单独的 RNR Card primitive。本批换成实际 HeroUI Card，不增加或升级依赖，也没有可移除的专属 RNR Card 依赖。

```tsx
<Card
  variant="secondary"
  title="工作区"
  description="工作区说明"
  content={<WorkspaceForm />}
  contentProps={{ className: "gap-3" }}
  footer={<SaveButton />}
  titleClassName="text-accent"
  herouiNativeProps={{ accessibilityLabel: "工作区" }}
  herouiWebProps={{ "aria-label": "工作区" }}
/>
```

- 唯一入口为 `index.ts → card.tsx`；薄包装引用 `card_heroui`，由 Metro 选择 Web 的 `card_heroui.tsx` 或 iOS / Android 的 `card_heroui.native.tsx`。公共类型集中在 `types.ts`，两端库均仅用 `import type` 引入。内部 `card_content.tsx` 共享内容解析，不依赖任一 HeroUI 运行时。
- 保留 title、description、header、content、footer 及每个区域的 `*Props / *ClassName`。每个区域可接收节点或回调；回调上下文沿用空对象 `CardRenderContext`。有效的自定义 header 替换整个标题区，此时不调用 title / description 回调；null、undefined、boolean 不创建对应区域，数字 0 正常显示。
- children 保持位于 content 之后、footer 之前。header / content / footer / children 内的裸字符串与数字会自动包为项目 Text，包含 Fragment 内的基础文字；自定义组件保持原样。Web title / description 使用真实 h3 / p，传自定义节点时应使用行内内容；复杂块布局放在 header 中。
- `headerProps / contentProps / footerProps / titleProps / descriptionProps` 提供共享 className，及各自的 `herouiNativeProps / herouiWebProps`。DOM / RN ref、style 和事件分别配置，只向当前平台透传；平台扩展不能覆盖封装管理的 children、variant 或 Native asChild。对应 `*Props.className` 后合并并优先于 `*ClassName`，根 className 则覆盖封装默认工具类。
- 两端共用 HeroUI 提供的 `default / secondary / tertiary / transparent` 四种 variant，不新增 size。布局与文字采用各自 HeroUI 默认值：Web 默认 p-4、gap-3 及 Card 样式；Native 沿用 Surface 的内边距、圆角、阴影及 Card 文字样式，只补根 gap-3、footer 的 flex-row / items-center。Native Card.Body 在锁定包中没有文档所述的 flex-1，因此不假设它会自动撑满或添加额外固定高度。需要局部密度时使用 slot className。
- Native 正文映射到 Card.Body，Web 映射到 Card.Content；保留真实 Card / Surface 上下文，供内部 HeroUI 子组件获得正确层级。Native 标题、说明继续经过 HeroText，保留 HeroUINativeProvider 的字体缩放设置；两端标题和说明注入项目默认字体，显式 slot style 与 font-mono 优先，自定义项目 Text 继续获得文字样式上下文。
- 不保留 Card.Root / Header / Title / Description / Content / Footer 等旧组合入口；仓库内仅有的一处 Card.Title 调用已改为 title。Card 原先没有系统原生实现，本批不新增 native 参数或虚假的 `_native` 文件，也不改动其他组件的 native 分支和 TrueSheet 补丁。
- 用户已反馈 Card 测试没问题；按随后确认的示例约定，“组件示例 → Card”保留官方 app 的基础卡片、两张并排图片卡片、横向图片卡片、背景图片卡片、四种 variant 五组，文案分别说明插槽组织、图片布局、长文字换行、遮罩与操作。只使用本项目单入口 Card 的 props，图片沿用官方演示素材 URL，背景使用现有 ImageBackground 与遮罩，不额外引入渐变库。回调、0 值、字体与插槽边界继续由自动化测试覆盖。其他组件示例共用的 ExampleBlock 也使用新 Card，需要一起观察容器布局。

### Card 验证（2026-11-21）

- 示例改版后的主测试 135 项通过、0 失败，1814 次断言。Card 用隔离子进程分别运行真实 HeroUI Web Card 和 Native Card / Surface / HeroText，各覆盖 7 个场景：结构与 ref、header 替换、回调与零值、className 合并、字体与缩放设置、四种 Surface 上下文、平台参数隔离及 footer 操作。Native 替换设备主题和动画环境，不能视为真机验收。
- 库与示例应用 typecheck、库 build、示例 build:web 通过；编译检查覆盖两端 ref / style / 事件，拒绝错误平台 ref、虚构的 size / native、旧组合入口和覆盖封装结构的底层参数。types.js 仍仅为 `export {}`，两套类型导入不产生运行时依赖。
- 最终 Expo Web / iOS / Android 同次带 source map 导出通过。Web 包含 17 个 HeroUI React 模块，iOS / Android 各包含 361 个 HeroUI Native 模块；各端另一套 HeroUI 模块均为 0。Card 和 Accordion 均只包含目标平台的实现，三端旧 RNR / Radix Accordion 模块为 0。
- 首轮官方形式改版后，生产 Web 在 319px 视口验证：Card 五组内容和五张远程演示图片正常显示，所有卡片均无横向内容溢出；当时的购买、购物车、活动选择、通知按钮本地演示状态切换正常。Accordion 七组内容正常，自定义指示器展开后保持 14px 且不叠加默认旋转，自定义入场动画正常展开，景深开关关闭后四项缩放均复位。已将指示器缓动改为 Reanimated 两端支持的 bezier；该轮页面与交互未产生运行错误或警告。后续文案调整的检查见下文。
- 用户已验收改版前的 Card；本轮未重新执行 iOS / Android 真机测试。新示例请重点检查图片、长文字与系统大字体、footer 操作，以及 Accordion 的自定义指示器、入场动画和景深效果；其他组件示例的公共容器也一起回归。

### 按压反馈与文案调整验证（2026-11-21）

- 根据真机反馈，对照本地官方 DefaultVariantContent 补上 Native default variant 的 PressableFeedback 组合；不是关闭或开启全局动画，也没有为 Web 引入 Native 内容。Native 独立测试 9 个场景通过，新增场景覆盖真实反馈组件的按压事件链、ref、单一触发区、禁用与展开行为；动画 hook 被替换，实际缩放和底色过渡仍需真机复核。
- 调整文案后的全量主测试 135 项通过、0 失败，1814 次断言；库与示例 typecheck、库 build、示例 build:web 通过。三端再次带 source map 导出及平台审计通过，Web / iOS / Android 的另一套 HeroUI 模块均为 0，HeroUI 模块数仍为 17 / 361 / 361。
- 新生产 Web 页面确认 Accordion 七组功能文案各不相同；Card 在 1280px 视口下文案与五张图片正常显示，各卡片内容无横向溢出，浏览器未记录运行错误或警告。本次浏览器检查不能验证 Native 的按压动画。

### 连续示例页的布局动画（2026-11-21）

- 用户反馈 Accordion 展开时示例标题直接跳到新位置。核对锁定包与本地官方示例后，确认 HeroUI 的 Root / Item 已配置 layout transition；AccordionText 只有上下文与基本文字转换，没有额外原生布局节点。此前 ExampleSection 外层为普通 View，Accordion 的高度变化会直接重排后续分组，分组标签并不在它的动画范围内。官方示例每页一组，未覆盖本项目连续排列多组的情况。
- 增加平台隔离的 example_section_view：Native 使用 Animated.View，让标签与演示作为整体过渡，沿用 HeroUI Native 1.1.1 Accordion 默认的 spring 参数（damping 140 / stiffness 1600 / mass 4），显式使用 ReduceMotion.System，并保留布局容器避免被折叠；Web 直接导出普通 View。未改变 Accordion 内部动画、文本封装、公共 props 或 TrueSheet 补丁。
- 全量主测试仍为 135 项通过、0 失败，1814 次断言；Native Accordion 独立测试由 9 增至 10 个场景，69 次断言，增加分组标签与演示共享布局动画容器、展开 / 收起后保持后续触发区节点的检查。DOM 测试仅记录布局动画配置并验证交互，不计算原生布局动画帧。
- 库与示例 typecheck、库 build、Expo 三端带 source map 导出及平台审计通过。Web / iOS / Android 的 HeroUI 模块仍为 17 / 361 / 361，另一端模块均为 0；实际 source map 确认 Web 仅包含普通分组容器，iOS / Android 仅包含 Native 动画容器。
- 本轮没有操作真机；需要在设备上展开 / 收起前面的分组，检查后续分组标签与演示是否同步平滑移动，并在系统减少动态效果开启时确认无需动画。此修复针对示例分组的外层重排，不能据自动化测试声称已排除所有设备上的条目动画问题。

## Alert、Avatar、Badge（Chip）迁移（2026-11-21）

> 本节记录首轮迁移。当时的标签型 Badge 已在后续“Icon、Chip 与角标 Badge”批次更名为 Chip；新的 Badge 专用于依附内容的角标。当前 API 以下文的新批次说明为准。

本批替换三个组件的自绘实现：Native 使用 heroui-native 对应组件的公开子路径，Web 使用 @heroui/react 对应子路径；Badge 的底层组件为 Chip，对外继续保留 Badge 名称。这三个组件原来均无独立的系统原生实现，因此没有新增 native 开关或空壳原生分支。没有改动 TrueSheet、现有弹层 host 或任何补丁。

文件结构沿用第三阶段约定：唯一 index.ts、公共 types.ts、薄包装组件、默认 Web 适配器与 _heroui.native.tsx 适配器。两端底层 props 通过 import type 引入同一个 types.ts，ref、事件、样式和动画仍分别放入 herouiNativeProps / herouiWebProps。slot 上也遵循同样约定，不能通过底层 children、asChild / render 绕开封装管理的结构。

### 公共 API

| 组件 | 主要配置 | 尺寸与默认值 |
| --- | --- | --- |
| Alert | status、title、description、content、action、indicator；保留 icon / iconProps / iconSize / iconAlign 等项目快捷配置 | 两端均无 size，不额外创建；status 默认 default |
| Avatar | src、alt、fallback、variant、color；imageProps / fallbackProps 及对应 className | size 为 sm / md / lg，默认 md；variant 默认 default；color 默认 accent |
| Badge | label、children、icon、startContent、endContent、variant、color；labelProps / labelClassName | size 为 sm / md / lg，默认 md；variant 默认 primary；color 默认 accent |

Avatar / Badge 的共同默认值采用 HeroUI Native，Web 显式传入相同值，避免同一调用在两端出现不同的初始语义色。HeroUI Web 上游的 Avatar color、Chip variant / color 默认值与 Native 不同，这里是封装层明确做出的统一选择。Alert 沿用两端共有的 default 状态。

- Alert 的 status 为 default / accent / success / warning / danger。默认显示对应状态图标；自定义 indicator 或 icon 可以替换，indicator 为 null / false 时隐藏。title / description 各自有 props 与 className，content 与 children 追加在正文列内，action 位于正文列外侧。使用真实 HeroUI Indicator / Content / Title / Description，按实际存在的标题、说明建立无障碍 ID 关联；不保留 RNR 的 destructive variant 或公开组合式子组件。
- Avatar 的 variant 为 default / soft，color 为 default / accent / success / warning / danger。src 是通用 URL；Native 本地资源可使用 imageProps.herouiNativeProps.source，显式 src 优先。fallback 省略时显示人物图标，字符串为文字回退，也支持节点和接收当前尺寸/颜色等信息的回调；null / false 隐藏回退，数字 0 正常显示。alt 默认为“头像”，空字符串表示装饰图片。保留真实 HeroUI 图片加载和失败回退，不另造加载状态；图片子组件在清空 src 时保持挂载，让底层恢复失败/无源回退状态。fallbackClassName 设置容器，fallbackTextClassName 设置文字；Web 回退层有独立背景，自定义头像底色时需要同时设置该层。公开调用不再提供 Avatar.Image / Avatar.Fallback 组合入口。
- Badge 的 variant 为 primary / secondary / tertiary / soft，color 为 default / accent / success / warning / danger。children 优先于 label，并且不会调用被覆盖的 label 回调；startContent 优先于 icon 快捷方式，显式 null 可以隐藏图标。内部使用真实 Chip.Label，图标与自定义 Text 接收尺寸、语义颜色和 label 样式上下文。没有为 Web 的展示型 Chip 发明通用点击模型；平台底层事件仍可分别配置。不保留旧 RNR/CVA 的 default / outline / destructive 等 badge variant。
- 新文字边界继续注入项目字体，Native 保留 HeroText 的字体缩放设置；显式 slot 字体/样式和 font-mono 覆盖仍生效。View 内容槽中的直接字符串、数字与 Fragment 内直接文本通过共享 slot_content 辅助函数包装为项目 Text，自定义元素保持不变。Web 的文本槽仍遵循 HTML 的行内内容限制，复杂正文放到 content。

调用保持单入口：

~~~tsx
<Alert status="success" title="已保存" description="更改已经生效。" />
<Avatar src={user.avatar} alt={user.name} fallback="LQ" size="lg" variant="soft" />
<Badge label="已完成" color="success" variant="soft" icon={Check} />
~~~

### 示例与删除内容

- 所有七处 Accordion 示例调用显式启用 nativeHaptics，包括景深示例。仅调整示例默认值，组件本身的默认触觉策略不变，Web 不触发原生震动。
- Alert 参考官方四组演示形式：默认/强调、语义状态、附带操作、自定义指示器。刷新、重试、关闭与重新显示为本地可交互状态。
- Avatar 参考官方八组形式：尺寸、文字回退、柔和文字、默认人物图标、柔和图标、自定义回退、重叠头像、自定义尺寸/形状/状态。图片沿用官方资源。
- Badge 参考官方九组形式：尺寸、variant、四组 variant × color、前置图标/状态点、尾部内容、自定义样式。状态点使用行内 SVG，避免 Web Chip 的 span 内嵌入 View 生成的 div。
- 示例继续使用本库单入口 API、ExampleSection / ExampleRow / ExampleStack；连续页面按功能使用不同中文文案，没有引入官方路由或组合式调用。
- 删除 AspectRatio 实现、公共类型、barrel 导出、示例文件及目录入口。固定比例直接用容器 aspectRatio 样式即可。
- 移除已经没有消费者的 @rn-primitives/aspect-ratio 与 @rn-primitives/avatar 两项依赖，并由 Bun 更新根锁文件。README 组件表同步更新；其余 RNR 依赖按剩余消费者保留。

### 本批验证

- 主测试 137 项通过、0 失败，1816 次断言，32 个测试文件。新隔离 fixture 在 Web / Native 各执行 6 个场景，运行真实 HeroUI 组件与 primitive，覆盖语义状态、可选标题/说明关联、ref、回调与数字 0、操作事件、Avatar 图片成功/失败/换源/清空后的回退、Chip 标签与前后内容、字体及平台 props 隔离。Native 的设备、SVG 与动画环境使用替身，不据此声称已验证真机动画。
- 新增公共类型检查：同一个入口同时支持 Native / DOM refs、事件与样式，拒绝旧尺寸/variant、混用平台 ref、绕开受控结构和虚构 native 模式。库与示例应用 typecheck、库 build、示例生产 build:web 均通过。
- Expo 同一配置的三端带 source map 导出通过。Web / iOS / Android 模块图分别包含 24 / 361 / 361 个目标 HeroUI 模块，另一端模块均为 0；实际 source map 仅包含对应平台的三个适配器，均不再包含 @rn-primitives/avatar 或 @rn-primitives/aspect-ratio。
- 生产 Web 页面检查通过：Alert 刷新、重试、关闭与重新显示正常，Avatar 的 14 张示例图片实际完成加载并显示，文字与图标回退可见，Badge 的 39 个示例标签无内部横向溢出、无非法 div 嵌入；上述页面未记录运行错误或警告。修正自定义 Avatar 回退层背景后重新构建并检查。
- 本轮未操作 iOS / Android 真机或执行原生 Release 编译。设备上仍需确认 Accordion 触觉反馈、Avatar 图片加载/失败过渡和本地资源，以及系统大字体下 Alert 操作区域、头像文字与 Chip 标签的展示。

### 移除 Collapsible 与临时接入验证页（2026-11-21）

- Collapsible 在仓库内只被其自身示例引用，没有其他组件依赖，也没有独立的系统原生实现。删除实现、公共类型、barrel 导出和示例；基础内容展开/收起使用单项 Accordion，不增加旧 API 兼容层。
- 删除专属依赖 @rn-primitives/collapsible，并更新锁文件及中英文组件清单。Accordion 的 isCollapsible 属性继续保留，它控制 Accordion 是否允许收起，与已删除的独立 Collapsible 组件无关。
- 用户已完成 HeroUI 与 TrueSheet 的真机组合验证，删除“HeroUI 接入验证”目录项以及 Web / Native 两个临时页面。平台隔离配置、HeroUI Provider、自动化检查和现有 TrueSheet 示例保留。
- 验证：主测试 137 项通过、0 失败；库与示例 typecheck、库 build、示例 build:web 均通过。确认 Web 产物不再包含两个已删除示例或 Collapsible 专属依赖引用，并清理当前 dist 中这些源文件遗留的编译文件；没有操作 iOS / Android 真机。

### 示例分组容器调整（2026-11-21）

- Badge 的示例目录、导航标题与页面说明统一使用 Badge，不再附加 Chip。
- ExampleSection 默认复用 ExampleBlock，以本库 Card 承载每组标题与演示，覆盖 Accordion、Alert、Avatar、Badge。Card 示例的五处分组显式设置 withCard={false}，保留原有单层卡片。Native 外层 ExampleSectionView 及其布局动画配置保持原样，继续包裹整组内容。
- 调整 Accordion 现有布局回归 fixture 的 Card 替身以呈现 title / content 插槽，原有分组稳定性及展开 / 收起检查通过。主测试 137 项通过、0 失败；库与示例 typecheck、库 build、示例 build:web 均通过。
- 生产 Web 页面确认 Badge 名称，以及 Accordion / Alert / Avatar / Badge 各组背景与标题；Card 页面没有嵌套 Card，示例卡片无内部横向溢出，Accordion 展开交互正常，浏览器未记录运行错误或警告。本轮未操作 iOS / Android 真机，原生重排动画需设备验收。

## Icon、Chip 与角标 Badge（2026-11-21）

### 定位与平台映射

| 本库组件 | 用途 | Web | iOS / Android |
| --- | --- | --- | --- |
| Icon | 通用图标、尺寸与语义文字色适配 | Lucide + Uniwind | Lucide + Uniwind |
| Chip | 独立标签、分类、带文字的状态 | HeroUI Chip | HeroUI Native Chip |
| Badge | 依附头像、图标、按钮的数量角标或状态点 | HeroUI Badge / Anchor / Label | HeroUI Native Chip / Label + View 定位 |

Icon 没有 RNR 运行时依赖，本批保留现有实现和公共类型。继续使用 as 选择 Lucide 图标，支持既有预设 size、数字尺寸和 className，颜色使用 text-accent / text-success 等语义类，并通过 TextClassContext 继承所在标签或按钮的前景色。没有引入新的图标库、全局图标注册表或系统原生图标替代层。示例补充自定义尺寸、语义颜色和在 Chip 中继承颜色。

原标签型 Badge 的实现及快捷 API 完整移到 Chip：label / children、icon / iconProps / iconClassName、startContent / endContent、labelProps / labelClassName；children 优先，显式 false 可隐藏标签且不调用被覆盖的 label 回调。保留 sm / md / lg、primary / secondary / tertiary / soft、五种语义色，以及 md / primary / accent 的既有默认值。原九组标签示例更名为 Chip，单独列入组件目录。

### Badge 单入口 API

~~~tsx
<Chip label="已完成" icon={Check} color="success" variant="soft" />

<Badge content={5} color="danger" size="sm" accessibilityLabel="5 条未读消息">
  <Avatar fallback="UI" />
</Badge>

<Badge color="success" size="sm" placement="bottom-right" accessibilityLabel="在线">
  <Avatar fallback="UI" />
</Badge>
~~~

- children 是被标记的锚点；content 才是角标，可传字符串、数字、行内节点或接收 size / variant / color / placement 的回调。数字 0 正常显示，省略或传 null / false 显示无文字状态点。长计数由调用方自行格式化成 99+，不暗中截断数值。复杂 View 不放入行内标签槽。
- size 为 sm / md / lg，variant 为 primary / secondary / soft，color 为 default / accent / success / warning / danger。统一默认 md / primary / default，按 Web Badge 的尺寸和四角定位语义补齐 Native；Badge 不提供 Chip 的 tertiary。原 Badge 的 label / icon / startContent / endContent 等独立标签参数移到 Chip，不做兼容别名。
- placement 为 top-right / top-left / bottom-right / bottom-left，默认 top-right。Native 在 Chip 外部使用相对定位的 View，Chip 绝对定位并按自身尺寸向外平移 25%；角标有背景色边框，父容器需允许溢出。Native 仍保留 Chip 的实际主题表面，未强制改写其所有颜色派生规则。
- isHidden 只卸载角标，不卸载锚点或执行隐藏的 content 回调，保留锚点组件内部状态和交互。角标默认不拦截点击；需要独立操作的交互标签使用其他组件，不依赖该展示角标。
- className / herouiNativeProps / herouiWebProps 配置角标本身；anchorProps / anchorClassName 配置外层，labelProps / labelClassName 配置角标文字。accessibilityLabel 为状态点或图标提供说明。TextClassContext 只作用于角标，不污染锚点；项目字体与 slot 显式字体覆盖继续生效。
- Web Anchor 使用真正的 HeroUI Anchor，并以 div 承载 RN Web View / Button，避免默认 span 包含 div 的非法嵌套。类型入口明确对应 HTMLDivElement；角标根对应 HTMLSpanElement。Native 外框为 RN View，角标使用真实 Chip，ref / 事件保持各端原始类型。
- 按统一文件规范保留一个 index.ts 和 types.ts。仅类型引用可以同时 import type 两端包，运行时 Web 适配器只导入 @heroui/react，Native 适配器只导入 heroui-native。没有修改依赖版本、TrueSheet、任何 patch 或系统原生实现。

Badge 示例展示数量/文字/图标、三尺寸、语义颜色、三种样式、四角定位、状态点、动态计数与显隐；与 Chip、Icon 示例一样，所有分组继续由本库 Card 承载，调用方无需组合 HeroUI 子组件。

### 本批验证

- 主测试 137 项通过、0 失败，32 个测试文件。展示组件隔离 fixture 在 Web / Native 各执行 8 个场景；新增 Badge 实际结构、ref、数字 0、空内容状态点、尺寸/颜色/样式/四角、隐藏时不运行回调、显隐后锚点状态和点击、文字上下文边界及字体覆盖检查。Native 设备和动画环境仍使用替身。
- 公共类型正反用例通过：同时验证 DOM / RN refs、底层事件、外框与文字槽，拒绝缺少锚点、旧 label API、不支持的 tertiary、平台 ref 混用，以及通过底层 props 绕过共享配置或替换渲染结构。库与示例 typecheck、库 build、示例 build:web 全部通过。
- Expo 三端带 source map 导出通过，Web / iOS / Android 分别包含 18 / 361 / 361 个目标 HeroUI 模块，另一端模块均为 0。已在两个 Native 实际 bundle 中核对正负 x / y 四种平移 utilities 编译为 25% / -25%，不是仅保留未解析的类名。
- 生产 Web 浏览器检查：Badge 的三尺寸、四角、文字/图标/状态点均可见；按钮计数从 5 增加到 6，隐藏角标后继续点击，再显示为 7。Chip 39 个示例标签无内部横向溢出、无 div 嵌入 Chip span；Icon 的预设、18 / 26 / 40 自定义尺寸及语义颜色正常，三个 Chip 内图标前景色分别与标签一致。相关页面未记录运行错误或警告。
- 本轮未操作 iOS / Android 真机，也未运行新的原生 Release 编译；请重点确认 Badge 的四角定位、长内容、系统字体放大，以及 Native Chip 在不同主题表面上的展示。

## Icon 尺寸与颜色 API 统一（2026-11-21）

本批接续上一批“Icon 保留现有实现和公共类型”的记录，保留 Lucide + Uniwind 技术实现，但重新整理公共尺寸与颜色 API。已核对 HeroUI Native / React 技能、官方主题文档、锁定依赖及 Native 官方 app 示例：HeroUI 没有统一的 Icon 组件或全局 Icon 尺寸属性，官方示例按场景使用数字尺寸及主题颜色。以下三档是本库约定，不宣称是 HeroUI 官方 Icon API。

~~~tsx
<Icon as={Search} /> // md，默认跟随本库容器文字颜色
<Icon as={Search} size="sm" color="muted" />
<Icon as={Check} size="lg" color="success" />
<Icon as={Bell} size={18} color="accent" />
<Icon as={Bell} className="size-6 text-accent-foreground" />
~~~

- size 统一为 sm / md / lg 或 number；预设使用 size-4 / size-5 / size-6，在当前基础 spacing 下对应 16 / 20 / 24，默认 md。数字在 Native 使用点、Web 使用 CSS 像素。删除 default / 2xs / xs / xl / 2xl 及任意字符串尺寸；特殊尺寸用数字或 className。没有为 Icon 修改全局 spacing、主题变量或其他组件的尺寸体系。
- color 的语义值为 inherit / foreground / muted / accent / success / warning / danger，默认 inherit；还保留 Lucide 原始 color 类型作为品牌图形等特殊场景的出口。语义值映射到静态 text-* utilities，由 Uniwind 解析实际颜色及响应主题更新，不能把 accent / danger 等直接传给 SVG。默认前景为 text-foreground。
- inherit 指跟随本库 TextClassContext 的语义文字类，例如 Chip / Button 提供的容器前景色，不承诺在任意 React Native View 中自动继承颜色。显式 color="foreground" 可以恢复普通前景色。accent-foreground 等表示相应背景上的前景色，不能与 accent 强调色互换；这类组合按所在组件上下文或 className 选择。
- 覆盖顺序：显式原始 color / 数字 size > 调用方 className > 语义 color / 预设 size > 容器上下文 > 默认值。raw color 与数字 size 直接交给 Lucide，并依照 Uniwind 原有规则覆盖类解析结果；其余情况保留主题类的动态解析。
- Icon 为两端共享实现，无 HeroUI 运行时导入，不人为添加两份平台适配文件，也不增加 variant、背景容器或专属 Provider。继续导出单一入口及公共 types.ts。
- BasicToaster 两端适配新 IconSize，默认 lg 维持原来的 24，显式 md 统一为 20；成功/提示/警告/错误图标改为 success / accent / warning / danger，随主题变化。只调整其 Icon 调用，没有迁移整个 Toast，也没有改动 Burnt 系统原生分支或 TrueSheet。
- Icon 示例保留 Card 分组，展示三档尺寸、自定义数字/类尺寸、六种语义颜色、Chip 内前景色继承与显式覆盖；不增加冗长的边界用例组。

### 本批验证

- 主测试 138 项通过、0 失败，1835 次断言，33 个测试文件。新增隔离 fixture 的 4 个场景覆盖尺寸类、数值 0 / 自定义尺寸、语义色交由 Uniwind、继承上下文更新、显式覆盖及 Lucide props / ref。该 fixture 仅探测 Icon → Uniwind 参数边界，不把替身当作真实样式解析；两端实际 Tailwind 编译另行确认六种 text-* 色及三档 size utilities 都存在。
- 公共类型正反用例通过：接受三档尺寸、数字、语义色和原始颜色，拒绝旧 default / xs 及任意字符串尺寸。库与示例 typecheck、库 build、示例生产 build:web 全部通过，git diff --check 通过。
- Expo 三端带 source map 导出通过；Web / iOS / Android 的目标 HeroUI 模块分别为 18 / 361 / 361，另一端均为 0。没有改动依赖或平台隔离配置。
- 生产 Web 浏览器实测预设为 16 / 20 / 24、自定义为 18 / 26 / 40；六种语义色均解析为真实 SVG stroke。浅色 ocean → 深色 lavender → 恢复 ocean / 跟随系统后，前景、弱文字、强调及状态色随主题变化；原始紫色保持不变。Chip 内继承及 danger 显式覆盖正常，Chip / Badge 页面图标正常，未记录浏览器运行错误或警告。
- 本轮未操作 iOS / Android 真机或执行原生 Release 编译。三端 JS/CSS 导出与参数边界测试不能替代设备验收；请在原生示例中观察深浅主题下的 Icon 和 Chip 图标，并检查 Toast 的状态色。

## Progress、Spinner、Separator、Skeleton、Text 与 Label（2026-11-21）

六个组件继续采用单一 index.ts、公共 types.ts、薄包装及两端 `_heroui` 适配器。类型入口只通过 import type 引用两端包；ref、事件和平台样式放在对应的 herouiNativeProps / herouiWebProps，slot 使用同样规则。没有新增原生依赖或调整 HeroUI 版本。

| 本库组件 | Web | iOS / Android |
| --- | --- | --- |
| Progress | HeroUI ProgressBar，内部组合 Label / Output / Track / Fill | RN View + Reanimated 补齐，无 RNR primitive |
| Spinner | HeroUI Spinner | HeroUI Native Spinner / Indicator |
| Separator | HeroUI Separator | HeroUI Native Separator |
| Skeleton | HeroUI Skeleton | HeroUI Native Skeleton |
| Text | HeroUI Typography | HeroUI Native Typography / Typography.Heading |
| Label | HeroUI Label | HeroUI Native Label / Label.Text |

### 公共 API 与平台差异

```tsx
<Progress value={35} label="文件上传" showValueLabel size="md" color="accent" />
<Progress isIndeterminate label="正在同步" />
<Spinner size="sm" color="accent" isLoading={isSaving} />
<Separator orientation="horizontal" variant="thin" />
<Skeleton isLoading={isLoading} variant="shimmer" className="h-5 w-32 rounded-md">
  <Text>加载后的内容</Text>
</Skeleton>
<Text type="h3">页面标题</Text>
<Text type="body-sm" color="muted">补充说明</Text>
<Label htmlFor="name" nativeID="name-label" controlRef={inputRef} isRequired>姓名</Label>
```

- **Progress**：使用 value / minValue / maxValue / isIndeterminate、label、showValueLabel、valueLabel 和 formatOptions。size 为 sm / md / lg，color 为 default / accent / success / warning / danger；labelProps、valueLabelProps、trackProps、indicatorProps 定制内部区域。共享范围处理会钳制数值，非法范围退回 0–100，零值填充宽度确实为 0。Native 确定进度使用 300ms timing，不确定进度以 40% 宽度扫动，处理 RTL、系统减少动态效果与动画清理；Web 沿用真实 ProgressBar 动画及 ARIA。两端均提供进度无障碍信息，不确定状态不虚报当前数值。Native 补齐实现不代表 HeroUI Native 本身存在 Progress 组件。
- **Spinner**：预设 sm / md / lg，额外支持数字尺寸；color 提供 accent / current / success / warning / danger 及原始颜色字符串。Native 将 accent 映射到官方 default，current 通过 Uniwind 解析本库文字上下文；数字尺寸同时设置根和 Indicator SVG。isLoading=false 卸载指示器。Native 指示器定制在 indicatorProps.herouiNativeProps，不虚构两端相同的 SVG props。
- **Separator**：orientation 为 horizontal / vertical，公共 variant 为 thin / thick，thickness 可明确厚度，isDecorative 控制辅助技术是否忽略。Native 原生支持的粗细语义映射到 Web 1 / 2px。Web 底层的 variant 实际控制颜色，与 Native 不同，因此只通过 herouiWebProps.variant 暴露，不将两种 variant 混在同一公共枚举。
- **Skeleton**：统一 isLoading、variant=shimmer / pulse / none 和 children。Web 在封装层补齐加载完成后显示 children 的行为；占位 className 不带入实际内容，加载后由内容自己控制布局。Native 使用真实 Skeleton 与项目已有 react-native-svg，不新增模糊或渐变原生依赖。
- **Label**：提供 htmlFor、nativeID、isRequired / isInvalid / isDisabled，以及 textClassName / textProps。Web 使用真实 label 与输入框 id 关联；Native 通过 controlRef 聚焦输入框，nativeID 设置在 Label.Text，可用于输入框 aria-labelledby。iOS 输入框仍需适当的 accessibilityLabel，不能仅依赖 Android 的 labelledby 行为。1.1.1 的 Label.isDisabled 仅处理外观，封装通过官方 asChild 及内部 Pressable.disabled 补齐真正禁用，避免禁用时仍调用 onPress 或聚焦。

### Text 迁移与 Typography

heroui-native **确实导出 Typography**：锁定的 1.1.1 主入口重新导出 components/text，公开子路径 heroui-native/text 也导出同一个 Typography。本批 Native 采用后者以保持组件级导入，Web 使用 @heroui/react/typography，没有用普通 RN Text 冒充 Typography。

- 公共 type 为 h1–h6、body / body-sm / body-xs、code，并使用 HeroUI 的 align、color、weight 和 truncate。删除原 RNR 风格的 variant、八档 size、asChild 与 textVariants；仓库内示例消费者同步改用 type / color。样式密度通过 className 或明确的文字类型配置，不添加一个跨组件全局 size。
- Native 标题通过真实 Typography.Heading 保留 heading 角色与动态字体设置；其他文字使用 Typography。Web 显式标题输出 h1–h6，显式正文输出 p，code 输出 code。未设置 type 的通用 Text 默认输出 span，便于放入已有按钮、标签和其他 Text 内，避免默认 p 导致非法嵌套。
- **Web 版本适配点**：3.2.7 Typography 底层会在默认 elementType 后透传 React Aria props，但声明未暴露 elementType。Web 适配器仅在未设置 type 时通过局部对象传入 elementType=span；未使用 any 或不匹配的 ref 断言。没有使用 render hook 强换标签，以免产生 React Aria 的标签警告。此处有真实组件运行测试与浏览器 DOM 检查，后续升级 HeroUI 必须重新验证默认 span、显式 p / heading / code 和 ref。
- 文字覆盖顺序为：调用方 className > 显式 Typography 参数 > 容器 TextClassContext > HeroUI 默认值。显式 muted / default、align、weight、type 会先转为对应 utilities，与上下文合并；避免 Card 的 text-foreground 压过显式 color=muted。继续注入项目字体，code 默认使用等宽字体，显式 fontFamily 与平台 style 仍可覆盖。
- 通用 style 保留 RN TextStyle 快捷形式，Web 在适配边界转换点单位 lineHeight、横纵 padding / margin、fontVariant、transform 与文字阴影等；DOM 专属样式放在 herouiWebProps.style。numberOfLines、selectable 等常用能力保留，平台专有文字事件和 ref 使用对应平台扩展。
- NativeTrigger 与 Select 的既有原生文字边界改用项目 FontText，保留原始颜色、RN ref / 事件与字体支持；不会强制套用新 Typography 的语义枚举。Link 实际封装 Button，其类型与新 Text 解耦并保留既有 size。没有迁移或删减这些组件的系统原生分支。

### 示例与依赖清理

六个示例页面继续使用本库单入口 API，并由 ExampleSection 的 Card 承载各组内容。演示覆盖 Progress 数值变化与自定义范围、Spinner 尺寸与加载状态、Separator 内容分组、Skeleton 成员加载与三种动画、Text 排版语义，以及 Label 输入关联和状态。参考官方演示内容，没有把 HeroUI 组合 API 暴露到示例调用中，也没有替换 Select / Dropdown / Sheet 等特殊示例。

确认零源码消费者后移除 @rn-primitives/progress、@rn-primitives/separator、@rn-primitives/label 三个直接依赖并更新 bun.lock。其余旧组件依赖按消费者保留。TrueSheet、所有 patch 与弹层 host 均无改动。

### 本批验证

- 主测试 141 项通过、0 失败，1846 次断言，34 个测试文件。新增隔离 fixture 运行真实 Web / Native 组件，覆盖 Typography 标签与字体、默认行内文字、上下文样式优先级、RN 样式转换、Spinner 尺寸与显隐、Separator 方向/厚度/装饰状态、Skeleton 加载切换、Label 关联/聚焦/禁用，以及 Progress 范围、零值、无障碍和插槽。Native 的设备与动画环境使用替身，不能据此声称验证过真机动画。
- 两端 ref、事件、slot 及旧参数拒绝的类型用例通过；库与示例应用 typecheck、库 build、示例生产 build:web 全部通过，git diff --check 通过。
- 最终 Expo 三端带 source map 导出通过。Web / iOS / Android 分别包含 31 / 361 / 361 个目标 HeroUI 模块，另一端模块均为 0；每端只包含对应平台的六个适配器，已移除的三个 RNR primitive 均不再进入模块图。
- 生产 Web 浏览器实测 Progress 增减、完成、自定义范围与 0% 填充，Spinner 停止/恢复与 16 / 24 / 32 和数字尺寸，Skeleton 内容切换及 shimmer / pulse / none 实际动画，Separator 横纵方向与 1 / 2 / 4px 厚度，Text h1–h6 / p / span / code、muted 与对齐，以及 Label 点击聚焦、必填、错误和禁用状态。Accordion 展开和 Card 按钮回归正常，Chip 39 个标签没有内部横向溢出或非法块元素嵌套；相关浏览器检查没有记录运行错误或警告。
- 本轮未操作 iOS / Android 真机，也未执行原生 Release 编译。设备验收重点为 Native Progress 的确定/不确定动画与减少动态效果、Skeleton 动画和内容切换、系统大字体下 Typography 的表现，以及 Label 聚焦与禁用；已有系统原生组件、TrueSheet 和 patch 没有被本批迁移替换。

## Reanimated 4.3.4：Native 动画调度修复（2026-11-21）

用户反馈 iOS / Android 的 Progress 确定进度停在初始宽度、不确定进度不扫动，Skeleton 的 shimmer / pulse 不播放；同一应用的 Spinner 和 Accordion 动画正常。问题定位到 Reanimated 4.3.0 在 RN JS runtime 上提交 SharedValue 写入与 cancelAnimation 的调度顺序：前者直接 setAsync，后者经过 scheduleOnUI 的微任务批次，旧动画的取消可能晚于新动画启动执行。

- 库 devDependencies / peerDependencies、示例应用 dependencies 统一从精确版本 4.3.0 升级到 4.3.4，并更新各自 bun.lock。保留 Worklets 0.8.1、RN 0.83.9、Expo 55.0.26 和其他依赖版本，没有调整组件实现或弹层 host。
- 4.3.4 的正式发布源码已经将 RN JS runtime 的 SharedValue 写入统一通过 scheduleOnUI 提交，保留取消与启动的调用顺序。使用上游修复，不追加动画调度补丁，也不通过关闭系统减少动态效果来恢复动画。
- 不升级到 Reanimated 4.8.0：该版本要求 RN 0.87–0.89 / Worklets 0.14.x。即使 4.6.0 的 RN 范围包含 0.83，它要求的 Worklets 0.12.x 也超出了当前 expo-modules-core 55.0.25 声明的 ^0.7.4 || ^0.8.0。上述版本为本次核对时的发布状态，不代表后续版本的兼容结论。
- 保留原有 Web reduced-motion 回退及 useReducedMotion 运行时读取补丁。两处补丁改名为 react-native-reanimated@4.3.4.patch，顶部原注释和全部 hunk 逐字保留；四个补丁目标文件在 4.3.0 / 4.3.4 上游发布包中逐字一致。库根目录仍只声明原有 TrueSheet patchedDependency，Reanimated 补丁继续由示例应用实际声明，库保留同步给宿主的副本。

### 补丁与动画回归验证

- 已备份修改前完整补丁，在 4.3.4 原始发布包副本上 dry-run 并应用全部旧补丁，确认四个文件均实际应用，无跳过、无 offset。hunk 完整性检查通过。
- 在示例应用执行项目 patch 缓存清理脚本及 bun install --force 后，四个实际补丁目标文件与预期最终源码逐字节一致；src / lib/module 的 mutables 文件也与上游修复一致。库与示例的两份补丁逐字节一致，内容与升级前旧补丁一致；两份锁文件没有连带更新其他包版本。
- 新增 test/reanimated_scheduling.test.js / fixture.js：分别在隔离子进程执行已安装包的源码和 ESM 入口，使用真实 makeMutable、cancelAnimation、withTiming、withRepeat、Easing 与 valueSetter，只替换设备调度和序列化边界。七个场景覆盖确定进度更新、不确定进度、Skeleton shimmer / pulse 重启、启动后取消、重启后卸载，以及系统减少动态效果。4.3.0 的四个相关动画场景可复现失败，4.3.4 两个入口各七个场景均通过。模拟调度测试不能代替真机动画验收。
- 主测试 143 项通过、0 失败，1848 次断言，35 个测试文件；库与示例 typecheck、库 build 通过。Reanimated 自带的 RN / Worklets 版本校验脚本通过。
- Expo 清缓存后 Web / iOS / Android 生产导出及 source map 审核通过：分别包含 31 / 361 / 361 个目标 HeroUI 模块，另一端为 0；三端均只有一份 Reanimated 模块根路径，实际打包的 mutables 内容与已安装 4.3.4 文件逐字一致。Web 使用 lib/module 入口，Native 使用 src 入口。
- Android 执行 :react-native-reanimated:assembleDebug，指定 arm64-v8a，Reanimated / Worklets 的 C++ 与 Java 编译、Reanimated AAR 组装成功；该检查不代表完整 App 安装或真机交互通过。
- 本地 iOS Pods 已安装 RNReanimated 4.3.4，RNWorklets 仍为 0.8.1。pod install 成功，但系统 Ruby 2.6 的 Array 缺少 filter_map，Expo-precompiled 读取 SPM 配置时有非致命警告；未据此声称完成 iOS 原生编译。
- 用户需重新构建并安装 iOS / Android 应用后，确认 Progress 的 +10 / 完成 / 不确定进度、Skeleton shimmer / pulse 和内容切换，并回归 Spinner、Accordion、TrueSheet 及系统减少动态效果。已有 Release 安装包不能仅通过重启 Metro 更新原生依赖。

## Link 与表单、选择组件（2026-11-21）

本批迁移 Link、Input、Checkbox、RadioGroup、Tabs、Textarea，新增 InputGroup、InputOTP、TextField。继续使用单一 index.ts、公共 types.ts、薄包装和两端 `_heroui` 实现；运行时代码按平台解析，公共类型通过 import type 引用两端，不要求调用方组合 HeroUI 子组件。

| 本库组件 | Web | iOS / Android |
| --- | --- | --- |
| Link | HeroUI Link | HeroUI Native LinkButton |
| Input | HeroUI Input | HeroUI Native Input |
| InputGroup | HeroUI InputGroup | HeroUI Native InputGroup |
| InputOTP | HeroUI InputOTP | HeroUI Native InputOTP |
| TextField | HeroUI TextField | HeroUI Native TextField |
| Checkbox | HeroUI Checkbox | HeroUI Native ControlField + Checkbox |
| RadioGroup | HeroUI RadioGroup + Radio | HeroUI Native RadioGroup + Radio |
| Tabs | HeroUI Tabs | HeroUI Native Tabs |
| Textarea | HeroUI TextArea | HeroUI Native TextArea |

### 单入口 API

```tsx
<Link href="https://example.com" size="sm">查看文档</Link>
<Input value={name} onChangeText={setName} placeholder="姓名" />
<InputGroup prefix="¥" suffix="CNY" inputMode="decimal" />
<InputOTP maxLength={6} groupSize={3} onComplete={verifyCode} />
<TextField
  label="联系邮箱"
  description="仅用于接收重要通知。"
  value={email}
  onChangeText={setEmail}
  type="email"
  isRequired
  isInvalid={invalid}
  errorMessage="请输入有效的邮箱地址。"
/>
<TextField multiline rows={4} label="补充说明" />
<Checkbox label="接收通知" description="可随时关闭。" defaultSelected />
<RadioGroup
  label="同步方式"
  defaultValue="auto"
  items={[{ value: "auto", label: "自动" }, { value: "manual", label: "手动" }]}
/>
<Tabs
  items={[
    { value: "overview", title: "概览", content: <Overview /> },
    { value: "activity", title: "动态", content: <Activity /> },
  ]}
/>
<Textarea rows={4} placeholder="输入备注…" />
```

- **尺寸**：Link 提供 sm / md / lg，Native 使用 LinkButton 的内置尺寸，Web 使用对应文字 utilities。其余八个组件沿用 HeroUI 默认密度及 className / slot 定制，不复制旧 RNR size 枚举，也不新增全局 size Provider。
- **平台扩展**：herouiNativeProps / herouiWebProps 分别提供真实的 RN / DOM ref、事件、动画与样式。公共状态参数优先，由封装统一适配；不要在平台扩展中另建一套选择或输入状态。Web 的输入、Link、Tabs trigger 与错误文字样式保留底层支持的 style 回调形式。
- **Link**：公共 href / onPress() / isDisabled，两端默认文字使用 text-accent，跟随主题主色，labelClassName 可显式覆盖。官方 Native LinkButton 本身沿用 ghost Button 的文字色；本地官方 Terms & Privacy 示例在 LinkButton.Label 上额外设置 text-accent-soft-foreground，在线文档同类示例使用 text-accent，蓝色不是 LinkButton 固定写死的默认颜色。Web 保留真实 anchor 语义、target 与 rel，target=_blank 默认 noopener noreferrer。Native 由 Linking.openURL 打开 href；原生事件回调可 preventDefault 取消后续封装处理。DOM 与 RN 事件没有合并成一个虚假的通用事件类型。

### 输入与完整字段

- **Input / Textarea**：共享 value / defaultValue / onChangeText、primary / secondary、isDisabled / isReadOnly / isInvalid / isRequired、type / inputMode / autoComplete、placeholder / maxLength 等参数。Textarea 额外提供 rows，Web 映射到 rows，Native 映射到 numberOfLines；实际高度可通过 className / style 调整。Native 只读映射到 editable，Web 保留真实 readOnly；不会把 HTML 专属状态属性作为 RN 参数传入。
- **ref**：公共 controlRef 使用 TextInputHandle，只暴露跨端都成立的 focus() / blur()。完整原生 TextInput、DOM input / textarea ref 放在对应 herouiNativeProps / herouiWebProps.ref。InputGroup 的根 ref 与输入 ref 分开，输入 ref 放在 inputProps 的平台扩展中。
- **InputGroup**：prefix / suffix 直接接受文字、图标或交互内容；prefixProps / suffixProps.isDecorative 标记纯装饰，交互按钮不要设为装饰。inputProps / inputClassName 定制输入区域。默认 min-w-0 允许输入区域在窄屏收缩，防止后缀挤出边界。
- **TextField**：label / description / errorMessage、对应 className 与 slot props 一次配置。自动生成并关联标签、说明与错误 ID，Native 标签通过 controlRef 聚焦。默认渲染 Input；multiline / rows 改用 Textarea；inputGroupProps 改用 InputGroup。多行时忽略 inputGroupProps。inputProps / textareaProps 定制实际输入，根平台扩展配置 TextField 容器。Web 默认 validationBehavior=aria，isInvalid 与 errorMessage 由调用方决定；封装不会自行校验邮箱或提交表单。
- **TextField Web 状态**：value / defaultValue / onChangeText 同时在 React Aria 字段根衔接，内部输入不重复注册公共回调，避免根上下文覆盖非受控初值，或同次编辑触发两次回调。普通、multiline、InputGroup 三种形态均有初值与单次回调回归。
- **InputOTP**：默认六格、数字输入；maxLength / groupSize 自动生成分组与分隔符，提供 value / defaultValue / onChangeText / onComplete、pattern、pasteTransformer、placeholder、variant 及禁用 / 错误状态，支持 groupProps / slotProps / separatorProps。长度钳制到 1–32，非有限长度回退六格，无效分组大小回退单组。Native 使用真实 SlotPlaceholder / SlotValue / SlotCaret 并注入项目字体。Web ref 指向隐藏输入，Native ref 为官方 focus / blur / clear / setValue actions，保留各端实际类型，不伪装成同一种 ref。

### 选择与导航

- **Checkbox**：使用 isSelected / defaultSelected / onSelectedChange，提供 label / description / errorMessage、labelPosition、controlProps / indicatorProps 与自定义 indicator；label / description 可根据选择、禁用和错误状态动态渲染。已移除 card 参数、对应回调上下文字段及“整行选择”示例，Checkbox 不再内置带边框、选中底色的卡片行模式；列表行布局、行选择与容器外观留到 NativeList 阶段组合。Native 继续使用真实 ControlField 保留普通标签点击切换，内层 Checkbox 避免重复的触摸和辅助技术入口；不向调用方开放会覆盖 ControlField 内部切换逻辑的根 onPress。
- **RadioGroup**：items 驱动，公共 value / defaultValue / onValueChange；提供组标签 / 说明 / 错误、逐项说明、禁用、orientation、labelPosition、自定义 indicator 与 itemProps。Web 保留真实 Radio 的键盘方向键与表单语义，Native 保留真实 RadioGroup.Item 行交互。
- **Tabs**：items 提供 value / title / content，支持受控或非受控选择，默认选择首个未禁用项；提供 primary / secondary、整组和逐项禁用、list / trigger / content / indicator props、isScrollable。keepMounted 保留非激活面板的组件状态，并显式隐藏它们，避免仅强制挂载时多块面板同时显示；默认按官方行为卸载非激活内容。Native 使用官方 Indicator 和 ScrollView，Web 标题继承选中态文字色。
- Checkbox、RadioGroup 和 Tabs 提供 nativeHaptics 并默认启用，继续接受项目统一触感设置；Web 不触发原生震动。

### 保留独立实现与清理依赖

- NativeList 的既有自绘行依赖 RN TextInput 的 unstyled、旧行内密度、ref 和事件，不应被新的公共 Input API 改写。将其原输入实现移到 NativeList 内部 input_control.tsx / textarea_control.tsx / input_control_types.ts，调用处仅切换内部 import；这不是公共 Input 的 RNR 参数兼容层。NativeList iOS 实现及其他组件的系统原生分支没有修改。
- 表单内普通 Text 使用的 Web Typography 会继承 React Aria TextContext，未提供 slot 时可能触发要求 description / errorMessage slot 的错误。Text 的 Web 适配器现为未显式设置 slot 的普通文字隔离该上下文，显式 slot 保留原行为。为使用这个正式导出的上下文，将原有传递依赖 react-aria-components 1.22.1 声明为直接依赖，版本未变。
- 删除已无源码消费者的 @rn-primitives/checkbox、@rn-primitives/radio-group、@rn-primitives/tabs 直接依赖和锁文件节点。未连带升级其他包；HeroUI Native 1.1.1、HeroUI React / styles 3.2.7、Reanimated 4.3.4、TrueSheet 4.1.2 保持不变，所有 patch 与弹层 host 未改动。
- 九个示例均使用本库单入口 API 和 ExampleSection 的 Card 分组，参考官方 Native App 的演示内容并按功能编写文案；目录新增 InputGroup / InputOTP / TextField。Label 示例同步适配新的公共输入参数与 controlRef。

### 本批验证与设备验收

- 主测试 146 项通过、0 失败，1861 次断言，36 个测试文件；表单 fixture 分别运行真实 Web / Native HeroUI 组件，每端 11 个场景，覆盖初值 / 受控输入 / 回调次数、标签关联、禁用 / 只读 / 错误、OTP 输入与粘贴、选择切换、Tabs 面板保留、Link 激活与字体、Typography 表单上下文和平台样式。Native 的设备、SVG 与动画环境使用替身，不代表真机验收。另有公共类型正反用例验证 ref / 事件边界及旧 RNR 参数拒绝。
- 库与示例应用 typecheck、库 build、git diff --check 通过。Expo Web / iOS / Android 生产 JS/CSS 导出通过；实际 source map 的目标 HeroUI 模块数分别为 67 / 361 / 361，另一端模块均为 0；九个适配器各端只包含对应实现，已删除的三个 RNR primitive 没有进入产物。
- 生产 Web 浏览器实测九个页面：输入编辑、标签聚焦、只读 / 禁用 / 错误恢复、密码显示切换、OTP 完成与粘贴过滤、Checkbox 空格切换、Radio 方向键、Tabs 键盘与滚动切换 / 禁用 / 文字状态色、Textarea 多行、Link 键盘激活及 anchor 属性。TextField 的非受控初值和三种输入形态的单次回调均已回归。319px 窄屏下 InputGroup、OTP 和 Tabs 分组未产生内部横向溢出，相关浏览器检查未记录运行错误或警告。本批未单独完成九页深色模式验收。
- 本轮未操作 iOS / Android 真机，也未执行新的原生 Release 编译。请在两端逐页验收软键盘类型、中文输入与光标、密码切换、OTP 粘贴 / 自动填充 / 焦点和光标动画、Label 聚焦、Checkbox / RadioGroup 触摸与触感、Tabs 指示器 / 滚动 / 面板切换，以及系统大字体与深浅主题。再在 TrueSheet 中回归输入聚焦、键盘避让及关闭后恢复交互；现有 TrueSheet 与旧弹层宿主没有在本批重构。

## Button：HeroUI 自绘与系统原生分支（2026-11-21）

本批只迁移 Button 的自绘实现。Android 的 Jetpack Compose 与 iOS 的 SwiftUI 渲染器逐字保留，继续由 `native={true}` 选择；Web 在该参数下回退为 HeroUI Button。没有升级依赖、修改 TrueSheet 补丁或重构弹层 host。

### 公共 API 与文件结构

- 默认 `size="md"`、`variant="primary"`。size 仅保留 HeroUI 的 sm / md / lg；variant 为 primary / secondary / tertiary / outline / ghost / danger / danger-soft，废除旧 RNR 的 default / destructive / link / icon 等枚举，不维护别名。纯图标改用 `isIconOnly`，链接使用 Link；轻量操作使用 ghost。
- 保留 title、children、buttonSize、buttonColor、circular、textClassName、textStyle、loading、loadingIcon、disabled、nativeHaptics、公共 Pressable ref / 事件 / style，以及全部既有系统原生参数。新增 `isDisabled` 与 disabled / loading 合并禁用；三个状态任何一个成立，自绘按钮均不可激活。
- `ButtonSize` 继续表示 buttonSize 使用的 `{ width?: number; height?: number }`，避免破坏项目自定义精确尺寸类型；语义尺寸字符串类型另名为 `ButtonSizeVariant`。两端采用各自 HeroUI 默认高度、间距和圆角，不要求逐像素相同。
- 唯一 index.ts、集中 types.ts、薄入口 button.tsx，以及 `button_heroui.tsx / button_heroui.native.tsx`。两端真实组件通过公开子路径导入，平台扩展分别为 herouiWebProps / herouiNativeProps；类型均以 import type 引入，Native 的 feedbackVariant / animation 判别联合保留。平台 props 不能覆盖封装管理的尺寸、变种、内容与禁用 / 加载状态。
- title 优先于 children；基础文字自动生成标签，混合图标和文字、children 状态回调继续可用。Native 使用真实 Button.Label，Web 使用项目 Text；两端注入项目字体，并向自定义 Text / Icon 提供当前尺寸与前景色上下文。buttonColor 与文字样式保持可用，按钮底色和交互颜色由 HeroUI 负责。
- loading 默认使用已迁移的 Spinner，自定义 loadingIcon 仍保留旋转行为。Native 使用 HeroUI 自带的缩放 / 高亮反馈，可在 herouiNativeProps 定制反馈和动画；没有继续使用旧 SolidButton 交互 hook 给 HeroUI 叠加背景。

~~~tsx
<Button title="保存" size="md" variant="primary" loading={saving} onPress={save} />
<Button variant="secondary"><Icon as={Plus} size="sm" />添加成员</Button>
<Button isIconOnly variant="ghost" accessibilityLabel="收藏"><Icon as={Heart} /></Button>
<Button native nativeButtonStyle="glass" buttonSize={{ width: 150, height: 80 }} title="系统按钮" />
~~~

### 系统原生能力保留

- `button_native.ios.tsx / button_native.android.tsx` 没有修改。nativeButtonStyle 的 automatic / glass / glassProminent、nativeSwiftProps 的 label / children / systemImage / modifiers、nativeSystemImage / nativeSystemImageSize、nativeMatchContents、Compose colors / enabled / modifiers、显式宽高和文本颜色继续交给原渲染器处理。
- 系统尺寸仍使用 OS 默认值、buttonSize 与平台 modifiers；语义 size 用于 HeroUI 自绘分支，不将 Tailwind 高度强行套到系统按钮。系统分支原先没有 Pressable 测量 ref，迁移没有虚构这项能力。
- 新 variant 在入口映射到原有系统样式：primary → default，secondary / tertiary / danger-soft → secondary，outline → outline，ghost → ghost，danger → destructive。Android danger-soft 使用现有 tonal 容器与 danger 文字；iOS 的实际按钮外观仍由 nativeButtonStyle 和 SwiftUI modifiers 控制。既有平台 override 的优先级继续保留。
- 原生 Expo UI 的按钮回调不提供 RN gesture payload，沿用原来的回调边界；本批没有伪造坐标或宣称两端事件完全相同。nativeHaptics 在原有系统 / 自绘点击完成后触发，Web 不震动，公共 onPress.preventDefault() 可阻止后续触感。

### Web Pressable 兼容边界

Web 根节点是真实 HeroUI / React Aria 的单个 button，没有再包一个可点击 Pressable。为保留已有调用方的 RN style / children 状态回调、onPressIn / onPressOut / onLongPress、无障碍属性、onLayout 和测量 ref，`button_web_interop.ts` 局部复用锁定的 RN Web 0.21.2 内部模块。

- React Aria 会拦截冒泡事件，因此在实际按钮监听 DOM 输入，用 RNW 的 createResponderEvent / TouchHistoryStore 标准化，再交给原 RNW PressResponder。临时 document 监听处理移出按钮后松开、滚动 / 失焦取消及卸载清理。键盘使用实际 DOM 事件的同一标准化边界，不把 React Aria 的 KeyboardEvent 包装冒充为含 persist() 的 React SyntheticEvent。
- 真正激活仍经浏览器 / React Aria click 和 RNW 点击处理；长按后取消点击、preventDefault、公共回调次数分别测试。平台扩展内的 DOM / React Aria 事件保持上游真实类型。
- 公共 ref 仍是 RNW 原本提供的、附加 measure / measureLayout / measureInWindow 的 DOM；完整 DOM ref 可通过 herouiWebProps.ref 使用。这个适配器依赖 RNW 私有模块，**升级 react-native-web 时必须重新核对源码并运行 Button 事件、ref 和弹层触发回归**。

### 调用方、旧样式与示例

- TrueSheet 自定义 header 的旧 link 按钮更新为 ghost + text-accent，保留标题、tintColor、禁用和回调处理；Card、Toast、Tooltip、NativeDialog 示例中的旧变种同步替换。
- AlertDialog 尚未迁移且仍依赖旧按钮样式。将原来的 buttonVariants / buttonTextVariants 逐字移到 AlertDialog 私有 button_styles.ts，仅改变其 import；不再从公共 Button 导出，也没有顺手改变 AlertDialog 外观或弹层行为。其仍在使用的 SolidButton 辅助文件暂时保留，待 AlertDialog 批次处理。
- Button 示例参考官方 app 的七变种、三尺寸、禁用 / 加载、图标文字、纯图标、自定义宽度 / 文字，统一使用单入口 props 和 Card 分组；保留系统原生按钮及 glass / 指定尺寸示例，并补充 glassProminent / SF Symbol 演示。

### 本批验证与设备验收

- 主测试 149 项通过、0 失败，1864 次断言，37 个测试文件。Button 隔离 fixture 分别运行 Web / iOS / Android：Web 7 个场景，iOS / Android 各 5 个，使用真实 HeroUI Button / Label / PressableFeedback / Spinner，以及真实系统原生 renderer；仅设备、Expo native-view、SVG 与动画边界使用替身。覆盖三尺寸 / 七变种、title 与字体 / 颜色、ref 和测量方法、style / children 按压状态、禁用 / 加载、长按取消、触感与 preventDefault、Enter / Space 单次激活、滚动取消 / 禁用中断 / 卸载清理，以及两端原生样式、尺寸、图标和 override。
- 库与示例 typecheck、库 build、git diff --check 通过。Expo Web / iOS / Android 同次生产 JS/CSS 导出通过；source map 中目标 HeroUI 模块数为 70 / 361 / 361，另一端模块均为 0。依赖、锁文件、patch、两份系统原生 Button renderer 均与本批开始前一致；AlertDialog 的旧样式函数确认逐字保留。
- 最终生产 Web 浏览器确认单一 button 根、无嵌套 button，七变种与三尺寸正常；点击 / Space / Enter 各触发一次，加载中禁用且完成后恢复。Dialog 键盘打开、取消和焦点返回，嵌套 Dropdown / Popover 的打开、Escape 与焦点返回，Dialog → TrueSheet → 内层 Dialog → 返回 Sheet → 关闭 Sheet，以及子 AlertDialog 取消后保留父层均已回归；浏览器日志没有运行错误或警告。
- 本轮没有操作 iOS / Android 真机，也没有执行新的原生 Release 编译。请重点验收系统原生按钮的 glass / glassProminent、SF Symbol、指定尺寸、Compose override 和触感；HeroUI 自绘按钮的按压缩放 / 高亮、加载、长按、图标和文字，以及它们作为 Dialog / 菜单 / TrueSheet 触发器时的表现。自动化测试与三端导出不能替代真机手势、动画或原生层级验收。

## Switch 与 Slider：HeroUI 与系统原生分支（2026-11-21）

两者的自绘分支分别使用 heroui-native/switch、heroui-native/slider 与 @heroui/react/switch、@heroui/react/slider。公共类型集中在 types.ts，两套库仅用 import type 引入；各组件只有一个 index.ts，运行时由 *_heroui.tsx / *_heroui.native.tsx 隔离。

### 公共 API

- **Switch** 使用 isSelected / defaultSelected / onSelectedChange / isDisabled，删除原 RNR checked / defaultChecked / onCheckedChange / disabled 及 Switch.Root 别名。size 收敛为 sm / md / lg，默认 md；Web 使用官方尺寸，HeroUI Native 保留默认 md，sm / lg 只调整轨道和滑块几何尺寸，不覆盖官方动画。保留 label / labelPosition / labelClassName / containerClassName、nativeSwiftProps / nativeComposeProps / nativeHaptics，补充 description、labelProps、controlProps、thumbProps 与 thumbContent。label / description / thumbContent 可按选择和禁用状态动态渲染；复杂标签节点保持原有布局，不强制包入 Text。
- **Switch 自绘交互**：Native 使用真实 ControlField 共享按压状态，内部真实 Switch / Thumb 负责反馈和动画，避免标签与控件各自触发一次事件；无障碍入口在字段根，视觉控件不重复暴露。Web 保留真实 Switch.Content 的标签、键盘、焦点和表单语义，说明在内容外关联；labelPosition=left 时取消说明默认的左侧缩进。
- **Slider** 使用 value / defaultValue / onChange / onChangeEnd、minValue / maxValue、step、isDisabled、orientation、formatOptions；删除旧 min / max、八档 size 与 thumbCount。两端均无内置 Slider size，使用官方默认外观，通过 trackProps / fillProps / thumbProps 调整局部密度与视觉。传数字即单值，传数组自动生成对应数量的滑块；泛型同时推断 onChange / onChangeEnd 的数字或数组类型。
- **Slider 单入口内容**：label / description、showValueLabel / valueLabel、outputProps、thumbLabels、对应文字 className / props 直接配置，无需调用方组合。带 label 默认显示数值，showValueLabel=false 可关闭；formatOptions 支持百分比、货币、单位。区间值按大小排列并钳制，处理小数步长精度与无效输入，滑块的边界和手势交给官方组件。Web 使用真实 Label / Output 与隐藏 range input，保留方向键、Home / End、焦点及表单能力；Native 使用真实 Output / Track / Fill / Thumb 与官方手势。
- **Slider 项目扩展**：保留 colors、style、trackStyle / activeTrackStyle / thumbStyle、nativeHaptics / nativeHapticsInterval。保留既有 onValueChange / onValueChangeFinished 数组回调，以及 onChangeFinished 首值回调；新的 onChangeEnd 保留 value 的实际形状。无需用这些便捷回调维护第二套状态。
- **step=0 的边界**：系统 Slider 继续使用真正连续模式；两套 HeroUI 都需要正的 step，封装将 0 转为区间跨度的 1/10000，避免除零或 NaN。需要明确业务精度时建议直接传正小数步长。没有改变 Reanimated、Worklets 或 HeroUI 依赖版本。
- **平台扩展**：herouiNativeProps / herouiWebProps 及各 slot 分别保留真实 RN / DOM ref、样式、动画与事件类型，不能覆盖公共选择或数值模型。Switch 的 style 沿用系统 host 样式用途，自绘根样式用平台 props；Slider 的共享 RN style 与各 slot style 仍保留，Web 在边界转换，平台样式可进一步覆盖。

~~~tsx
<Switch native={false} label="接收通知" description="及时获知重要动态。" defaultSelected nativeHaptics />
<Switch native label="系统开关" isSelected={enabled} onSelectedChange={setEnabled} />
<Slider native={false} label="音量" value={volume} onChange={setVolume} onChangeEnd={saveVolume} />
<Slider native={false} label="价格范围" defaultValue={[200, 800]} maxValue={1000} step={10}
  formatOptions={{ style: "currency", currency: "CNY" }} />
<Slider native label="系统连续值" step={0} value={volume} onChange={setVolume} />
~~~

### 系统能力与调用方

- 两者在 iOS / Android 继续默认使用系统原生控件；native=false 才选择 HeroUI。Web 始终使用 HeroUI。Slider 在竖向或多个值时自动选择 HeroUI，不再让系统 Slider 静默丢弃后续值。
- Switch 的 SwiftUI Toggle / Compose Switch 两份 renderer 未修改。保留 Swift modifiers、Compose colors / enabled、原生事件 override、Host safe-area 修复与尺寸缩放。iOS 16+ 系统开关不重复补震，旧 iOS 与外部标签切换保留项目触感策略。
- Slider 的原 native_slider.* 文件按约定改名为 slider_native.*，只调整内部类型 / 辅助函数 import，并补充 isDisabled 到 Swift disabled modifier / Compose enabled。原来的 Host safe-area 修复、iOS 连续 / step、iOS 边界系统反馈去重、Android step→steps、主题颜色、Android 触感 bucket 与 nativeHapticsInterval 均保留；有关 iOS 26 系统 Slider 边界重复触感的原注释仍在。入口统一维护非受控状态并接入最终值回调，系统实现未重写为自绘。
- NativeList 的共享、自绘与 iOS 系统行仅更新 switchProps 字段名称；原生 SwiftToggle、行布局与触感策略保持原样。相关调试首页、主题页、Accordion、Toast、GlassEffect、ScrollView、NativeList 调用方同步更新。Sheet 分区高度控制保留单元素数组值和原有完成回调。
- 两个示例参考官方 Native App 的基础、禁用、定制、区间与竖向内容，保持单入口调用、Card 分组及中文功能文案；原生开关、禁用、标签位置，以及原生连续 / 步进 / 外部更新示例继续保留，示例显式启用 nativeHaptics。
- 删除无人使用的旧 Slider 自绘手势层，以及 @rn-primitives/switch 和它独占的 @radix-ui/react-switch 锁文件节点。没有修改 TrueSheet patch、弹层 host 或其他原生实现。

### 本批验证与设备验收

- 全量主测试 152 项通过、0 失败，1867 次断言，38 个测试文件。Switch / Slider 的独立子进程使用真实安装的 HeroUI 组件，Web 6 个场景，iOS / Android 各 9 个场景，覆盖受控 / 非受控状态、标签、禁用、回调次数、尺寸 / slot / ref、区间 / 小数 / 格式化、竖向手势与触感 bucket，以及既有系统 renderer 的路由、平台覆盖参数、连续 / 步进、颜色和完成回调；设备视图、动画与手势执行边界使用测试替身。公共类型正反用例同时检查泛型回调、平台 ref / 事件、原生参数与旧 API 拒绝。
- 库及示例应用 typecheck、库 build、git diff --check 通过。Expo Web / iOS / Android 生产导出通过，source map 审计分别包含 74 / 361 / 361 个目标 HeroUI 模块，另一端模块均为 0。
- 最新生产 Web 产物验证了 Switch 标签点击、空格切换与三档受控状态同步，Slider 方向键与完成值同步、区间端点限制；本批此前还实际拖动了 Slider，确认拖动值与结束值同步。319px 窄屏两页均未产生横向溢出，区间、数值格式、竖向与禁用示例显示正常；相关浏览器检查未记录运行错误或警告。本批未单独完成深色模式或 TrueSheet 内的浏览器回归。
- 本轮未操作 iOS / Android 真机，也未执行新的原生 Release 编译。请在两端确认 native=false 时 Switch 按压 / 滑块动画、标签切换、Slider 拖动 / 轨道点击 / 区间 / 竖向手势和触感；native=true 时确认系统开关、连续 / 步进滑块、禁用、外部更新与最终值回调，另在 TrueSheet 中观察手势冲突、层级与关闭后的交互恢复。

## 后续批次

1. **主题重构（已实现）**：见上文第二阶段。真机重新观察配色后进入简单组件迁移。
2. **简单自绘组件**：优先 Button、Accordion 等，不保留 RNR 特有 API，保留项目自定义的单入口封装习惯及所有系统原生分支，逐一设计新 API。尺寸、disabled/loading、ref、事件及可访问性需要逐项适配，不能简单按同名属性透传。
3. **弹层**：Dialog、AlertDialog、Popover 等；先验证根页面、TrueSheet、嵌套 Sheet、导航和键盘，再替换现有实现，重点是两端原生层级和 Android 返回行为。
4. **复杂组件**：Select、Dropdown、Menu 等，仅替换自绘分支。逐一盘点所有组件现有 native 功能，不能仅按少数几个组件名单保护。
5. **独立组件与收尾**：SplitLayout、NativeList、ScrollView、NativeDialog、NativeTrigger、GlassEffect、ColorPicker 等以主题引用调整和组合回归为主。已无消费者且替代实现验证完成的 RNR 依赖、样式和兼容代码可随对应批次清理。

## 参考资料

- HeroUI Native quick start: https://heroui.com/cn/docs/native/getting-started/quick-start
- HeroUI Native 索引: https://heroui.com/native/llms.txt
- HeroUI React quick start: https://heroui.com/en/docs/react/getting-started/quick-start
- HeroUI React 索引: https://heroui.com/react/llms.txt
- HeroUI Native Accordion: https://heroui.com/en/docs/native/components/accordion
- HeroUI Native theming: https://heroui.com/en/docs/native/getting-started/theming
- HeroUI React Accordion: https://heroui.com/en/docs/react/components/accordion
- HeroUI Native Card: https://heroui.com/en/docs/native/components/card
- HeroUI React Card: https://heroui.com/en/docs/react/components/card
- HeroUI React theming: https://heroui.com/en/docs/react/getting-started/theming
- Expo Tailwind / PostCSS: https://docs.expo.dev/guides/tailwind/

API 与 exports 最终按锁定发布包中的 package.json、类型和源码核对，避免文档更新速度与 npm 发布包不同步。
