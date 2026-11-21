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
- 简单组件的分组使用 ExampleSection（标签与演示），不为每个演示额外套一张 Card。示例聚焦实际使用场景，复杂参数组合、非法输入、ref、字体和边界值主要通过自动化测试与 API 文档覆盖。
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
