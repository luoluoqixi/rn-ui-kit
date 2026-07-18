# rn_ui_kit

[中文](./README.md) · [English](./README_EN.md)

[在线示例 (web)](https://rn-ui-kit.luoluoqixi.com/)

面向 Expo、React Native 与 React Native Web 的跨平台 UI 封装库。`rn_ui_kit`
以 Tamagui 为基础，在同一套 API 下组合 Web 实现、React Native 实现与平台原生能力，
并提供主题、弹层、手势、安全区、Toast 和导航辅助能力。

> [!WARNING]
> 此库目前仅在我自己的部分 App 中使用，尚未准备作为面向所有人的通用 UI 库。
> 请勿假设其 API、兼容性或发布方式适用于其他项目。

## 特性

- 一套组件 API 覆盖 iOS、Android 和 Web
- 基于 Tamagui 的主题、Token、响应式样式与动画能力
- `RootProvider` 统一装配手势、安全区、Sheet、Toast、主题和原生对话框
- 支持浅色、深色、跟随系统以及自定义强调色主题
- 对 Menu、Select、Sheet、Toast、Haptics 等能力提供原生实现或跨平台降级
- 内置组件调试目录与 Expo 示例应用
- 通过 Bun patch 同步项目所需的上游依赖补丁
- 完整 TypeScript 类型导出

## 运行环境

本仓库当前锁定的主要技术版本如下：

| 技术 | 版本 |
| --- | --- |
| Expo | 55 |
| React Native | 0.83.9 |
| React / React DOM | 19.2.5 |
| Tamagui | 2.4.0 |
| TypeScript | 5.9.2 |
| 包管理器 | Bun |

`rn_ui_kit` 会安装并统一导出 core 与 debug；其中 core 将运行时框架和原生模块声明为
peer dependencies。接入已有应用时，请以
[`packages/rn_ui_kit_core/package.json`](./packages/rn_ui_kit_core/package.json) 为准，并确保
Expo、React Native、Tamagui 及原生模块版本兼容。


## 快速开始

### 运行仓库示例

```bash
bun install
bun run typecheck

# 启动 Expo 开发服务器
bun run --cwd examples/app start

# 或直接启动指定平台
bun run --cwd examples/app web
bun run --cwd examples/app android
bun run --cwd examples/app ios
```

Android 与 iOS 命令需要本机已配置相应的原生开发环境；Web 示例可以直接通过浏览器运行。

### 在工作区中接入

当前仓库采用 Bun workspaces，示例应用只需通过 `workspace:*` 使用公开聚合包：

```json
{
  "dependencies": {
    "rn_ui_kit": "workspace:*"
  }
}
```

外部项目可以从实际使用的 npm registry、Git 源或本地 workspace 引入
`rn_ui_kit`。本仓库未包含自动发布配置，因此请先确认包在你的依赖源中可用，再安装
[`peerDependencies`](./packages/rn_ui_kit_core/package.json) 中列出的依赖。

## 屏幕截图

| Android | iOS 18 | iOS 26 |
| :---: | :---: | :---: |
| <a href="./docs/SCREENSHOTS.md"><img src="./docs/screenshots/android/001.jpg" alt="rn_ui_kit 在 Android 上的示例首页" width="280"></a> | <a href="./docs/SCREENSHOTS.md"><img src="./docs/screenshots/ios18/001.jpg" alt="rn_ui_kit 在 iOS 18 上的示例首页" width="280"></a> | <a href="./docs/SCREENSHOTS.md"><img src="./docs/screenshots/ios26/001.jpg" alt="rn_ui_kit 在 iOS 26 上的示例首页" width="280"></a> |

<p align="center">
  <a href="./docs/SCREENSHOTS.md">查看 Android、iOS 18 与 iOS 26 完整截图对比</a>
</p>

## 应用配置

### 1. 初始化平台能力

在应用入口的其他 UI 导入之前加载初始化模块：

```tsx
import "rn_ui_kit/initialize";
```

它会初始化 Tamagui 所需的手势、Zeego 菜单、原生 Toast、渐变、键盘控制、
Teleport Portal 和 Worklets 适配。

### 2. 配置 Tamagui

```tsx
// tamagui.config.ts
import { defaultConfig } from "@tamagui/config/v5";
import { animations } from "@tamagui/config/v5-css";
import { animations as animationsReanimated } from "@tamagui/config/v5-reanimated";
import { createTamagui, isWeb } from "tamagui";

import { themes } from "./themes";

const config = createTamagui({
  ...defaultConfig,
  animations: isWeb ? animations : animationsReanimated,
  themes,
});

export default config;

type AppConfig = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}
```

可直接参考示例中的
[`tamagui.config.ts`](./examples/app/tamagui.config.ts)、
[`themes.ts`](./examples/app/themes.ts) 和
[`tamagui.build.ts`](./examples/app/tamagui.build.ts)。

### 3. 添加根 Provider

```tsx
import "rn_ui_kit/initialize";

import { Button, RootProvider, Text } from "rn_ui_kit";
import { YStack } from "tamagui";

import config from "./tamagui.config";

export default function App() {
  return (
    <RootProvider
      tamaguiConfig={config}
      accentThemeName="ocean"
      accentThemeNames={["ocean", "sakura", "forest"]}
      preferences={{
        appearance: {
          accentColor: "ocean",
          backgroundFollowsTheme: false,
          themeMode: "system",
        },
      }}
    >
      <YStack flex={1} items="center" justify="center" gap="$4">
        <Text>你好，rn_ui_kit</Text>
        <Button onPress={() => console.log("pressed")}>开始使用</Button>
      </YStack>
    </RootProvider>
  );
}
```

`RootProvider` 会统一提供：

- `GestureHandlerRootView` 与 `SafeAreaProvider`
- Tamagui 主题上下文
- Sheet 与 Portal 支持
- Toast 渲染容器
- 原生对话框与触觉反馈上下文
- 颜色模式与强调色偏好

### 4. 配置 Babel 与 Web 样式

示例项目使用 `babel-preset-expo`、`@tamagui/babel-plugin` 和
`react-native-worklets/plugin`。完整配置见
[`babel.config.js`](./examples/app/babel.config.js)。

Web 端生成 Tamagui CSS 后，在入口导入：

```tsx
import "./tamagui.generated.css";
```

生成命令：

```bash
bun run --cwd examples/app generate:tamagui
```

## 使用示例

### Toast

```tsx
import { Button, useToast } from "rn_ui_kit";

export function SaveButton() {
  const { toast } = useToast();

  return (
    <Button
      onPress={() =>
        toast.success("保存成功", {
          description: "配置已写入本地。",
        })
      }
    >
      保存
    </Button>
  );
}
```

### Dialog

```tsx
import { Button, Dialog, Text } from "rn_ui_kit";

export function ConfirmDialog() {
  return (
    <Dialog
      title="删除项目？"
      description="此操作无法撤销。"
      trigger={<Button>打开对话框</Button>}
      actions={
        <Dialog.Close asChild>
          <Button>确认</Button>
        </Dialog.Close>
      }
    >
      <Text>请确认你希望继续。</Text>
    </Dialog>
  );
}
```

### NativeList：iOS 原生列表

`NativeList` 在 iOS 上默认使用 `@expo/ui/swift-ui` 的原生 `List` 与 `Section`
渲染，并采用系统 `insetGrouped` 列表样式。导航行、选中标记、Switch 和 Select
会尽量使用 SwiftUI 控件，因此能够自然适配系统字体、颜色、交互反馈与滚动行为。

```tsx
import { useState } from "react";
import {
  NativeList,
  NativeListNavigationItem,
  NativeListSection,
  NativeListSelectItem,
  NativeListSwitchItem,
} from "rn_ui_kit";

export function SettingsList() {
  const [autoSync, setAutoSync] = useState(true);
  const [themeMode, setThemeMode] = useState<string | null>("system");

  return (
    <NativeList>
      <NativeListSection title="工作区" footer="更改会自动保存。">
        <NativeListNavigationItem
          title="成员"
          subtitle="邀请、角色与访问权限"
          onPress={() => console.log("open members")}
        />
        <NativeListSwitchItem
          title="自动同步"
          switchProps={{
            checked: autoSync,
            onCheckedChange: setAutoSync,
          }}
        />
        <NativeListSelectItem
          title="主题模式"
          selectProps={{
            value: themeMode ?? undefined,
            onValueChange: setThemeMode,
            options: [
              { label: "浅色", value: "light" },
              { label: "深色", value: "dark" },
              { label: "跟随系统", value: "system" },
            ],
          }}
        />
      </NativeListSection>
    </NativeList>
  );
}
```

需要注意：

- Android 和 Web 会自动使用基于 `FlashList` / React Native 视图的跨平台实现。
- 在 iOS 上传入 `<NativeList native={false}>`，可主动使用相同的 fallback 外观。
- 原生文本行的 `title`、`subtitle` 和 `value` 适合传入字符串或数字；无法直接映射到
  SwiftUI 的复杂 ReactNode 会按行降级渲染。
- `NativeListCustomItem` 可在原生列表中承载自定义 React Native 内容。
- `initialScrollTarget` 与行上的 `nativeScrollId` 可用于 iOS 原生列表的初始滚动定位。

完整交互示例见
[`collection_examples.tsx`](./packages/rn_ui_kit_debug/src/debug/pages/component_examples/examples/collection_examples.tsx)。

## 组件

| 分类 | 组件 |
| --- | --- |
| 操作与反馈 | `Button`、`Checkbox`、`Switch`、`ToggleGroup`、`Slider`、`Spinner`、`Progress`、`Toast`、`NativeDialog` |
| 表单 | `Input`、`TextArea`、`Select`、`RadioGroup`、`Form`、`Label` |
| 布局与组合 | `Accordion`、`Tabs`、`SplitView` / `SplitLayout`、`Card` |
| 弹层 | `Dialog`、`AlertDialog`、`ContextMenu`、`Menu`、`Popover`、`Sheet` / `NativeSheet`、`Tooltip` |
| 列表与滚动 | `NativeList`、`ListGroup`、`ListItem`、`FlashList`、`ScrollView` |
| 展示 | `Avatar`、`Text`、`Image`、`Separator`、`Link` |
| 基础设施 | `RootProvider`、`UIProvider`、主题工具、导航工具、Portal 与平台工具 |

所有公开导出可在
[`packages/rn_ui_kit_core/src/components/ui/index.ts`](./packages/rn_ui_kit_core/src/components/ui/index.ts)
中查看。各组件目录同时导出 Props 类型。

## 补丁同步

该库依赖少量上游补丁。应用安装依赖后运行：

```bash
bun run sync-patches
```

对应的应用脚本为：

```json
{
  "scripts": {
    "sync-patches": "rn-ui-sync-patches"
  }
}
```

命令会将库内补丁复制到应用的 `patches/` 目录，并注册到应用
`package.json` 的 `patchedDependencies`。如果应用需要保留自己的某个补丁，可以排除
同名依赖：

```json
{
  "rnUiKitSyncPatches": {
    "exclude": ["@expo/cli@55.0.32"]
  }
}
```

被排除的依赖不会被复制或注册。

## 项目结构

```text
rn_ui_kit/
├─ packages/
│  ├─ rn_ui_kit/          # 对外聚合包，统一导出 core 与 debug
│  ├─ rn_ui_kit_core/     # 核心组件、Provider、主题与平台适配
│  └─ rn_ui_kit_debug/    # 组件目录、调试页面与示例界面
├─ examples/
│  └─ app/                # Expo iOS / Android / Web 示例应用
├─ package.json           # Bun workspace 与统一脚本
└─ bun.lock
```

## 开发

```bash
# 全工作区类型检查
bun run typecheck

# 仅检查核心包
bun run --cwd packages/rn_ui_kit_core typecheck

# 仅检查调试包
bun run --cwd packages/rn_ui_kit_debug typecheck

# 仅检查示例应用
bun run --cwd examples/app typecheck
```

新增或修改组件时，建议同时在 `rn_ui_kit_debug` 的组件目录中添加示例，以便在 iOS、
Android 和 Web 上核对交互与视觉表现。

## License

[MIT](./packages/rn_ui_kit/LICENSE) © 2026 luoluoqixi
