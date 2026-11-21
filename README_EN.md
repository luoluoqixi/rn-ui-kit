# rn-ui-kit

[中文](./README.md) · [English](./README_EN.md)

[Live demo (web)](https://rn-ui-kit.luoluoqixi.com/) · [Screenshots](./docs/SCREENSHOTS.md)

A cross-platform UI kit for the maintainer's Expo apps. Base components use React Native Reusables source and APIs with Uniwind styling. Components that need system capabilities keep dedicated iOS, Android, and Web implementations in rn-ui-kit.

> [!WARNING]
> This is a personal UI library. It does not promise the API stability or compatibility range expected from a general-purpose package.

## Runtime

| Technology | Version |
| --- | --- |
| Expo | 55 |
| React Native | 0.83.9 |
| React / React DOM | 19.2.5 |
| Uniwind | 1.x |
| Tailwind CSS | 4.x |
| TypeScript | 5.9.2 |
| Package manager | Bun |

Only Expo apps are supported; bare React Native CLI apps are out of scope. React Native and native dependencies are pinned in the root [`package.json`](./package.json). `@rn-primitives/*` packages are internal dependencies and do not need to be declared by consuming apps.

## App setup

Install a release branch together with Uniwind:

```bash
bun add github:luoluoqixi/rn-ui-kit#rn-ui-kit-<version>
bun add uniwind tailwindcss
```

Create `global.css` in the app:

```css
@import "tailwindcss";
@import "uniwind";
@import "rn-ui-kit/styles.css";

@source "./src";
@source "./node_modules/rn-ui-kit/src";
@source "./node_modules/rn-ui-kit/dist";
```

Adjust the source paths when using a local source dependency. The repository example scans `../../src` and `../../dist`.

Configure Metro:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
});
```

Load initialization and CSS before the UI:

```tsx
import "rn-ui-kit/initialize";
import "./global.css";
```

See [`examples/app`](./examples/app) for the complete configuration. Apps do not need the RNR CLI, `components.json`, or registry configuration.

## Provider and themes

```tsx
import { RootProvider, Text } from "rn-ui-kit";
import { View } from "react-native";

export default function App() {
  return (
    <RootProvider
      preferences={{
        appearance: {
          accentColor: "ocean",
          themeMode: "system",
        },
      }}
    >
      <View className="bg-background flex-1 items-center justify-center">
        <Text>Hello, rn-ui-kit</Text>
      </View>
    </RootProvider>
  );
}
```

Toast defaults to Burnt on Android and iOS, and the basic Sonner Toast on web. Override this
globally with `toasterProps.defaultNative`; a per-call `native` option takes precedence:

```tsx
<RootProvider toasterProps={{ defaultNative: false }}>{children}</RootProvider>
```

Themes now use HeroUI semantics: background/foreground, surface, overlay, accent, muted (secondary text), default, danger, and field colors. The old primary/card/popover/mutedForeground/destructive/ring tokens have been removed. Component variant names and system-native implementations are retained. The accent01–accent12 HCT scale remains available; accent itself now means the solid action color.

Generate a complete light/dark theme with generateUiThemeFromPrimaryColor(), then override specific SemanticColors fields. Presets and custom opaque #RGB / #RRGGBB seeds are supported. Neutral container colors stay independent of the seed. HeroUI supplies the radius scale and derived interaction colors.

backgroundFollowsTheme has been removed and is discarded when stored example preferences are loaded. Configure application container backgrounds through appBackgroundColors.light/dark with optional screen/sheet/card/header overrides; individual containers keep their own background props. Global source variables are synchronized for Web body portals and Native overlays. Use one global RootProvider per application.

See the [Chinese theme guide](./README.md#3-provider-与主题) and [migration details](./docs/heroui-migration.md) for configuration and migration boundaries.

`RootProvider` installs gesture, safe-area, color scheme, navigation theme, sheet, portal, toast, native dialog, and haptics contexts.

## Components

| Category | Components |
| --- | --- |
| Actions and feedback | `Button`, `Checkbox`, `Switch`, `Toggle`, `ToggleGroup`, `Slider`, `Spinner`, `Progress`, `Toast`, `NativeDialog` |
| Forms | `Input`, `Textarea`, `Select`, `RadioGroup`, `Label` |
| Layout | `Accordion`, `Tabs`, `SplitView` / `SplitLayout`, `Card`, `Separator` |
| Overlays | `Dialog`, `AlertDialog`, `ContextMenu`, `Dropdown`, `Menubar`, `Popover`, `Sheet` / `NativeSheet`, `Tooltip` |
| Lists | `NativeList`, `ScrollView` |
| Display | `Alert`, `Avatar`, `Badge`, `Skeleton`, `Text`, `Icon`, `Link`, `GlassEffect` |

`Form`, `Image`, `ListGroup`, `ListItem`, `FlashList`, `HoverCard`, and the old `Menu` API were removed. `TextArea` is now `Textarea`, and `Menu` is now `Dropdown`.

`AspectRatio` was removed; use the container's `aspectRatio` style. `Collapsible` was removed; use a single-item `Accordion` for basic content expansion and collapse.

In the first migration baseline, `Select`, `Slider`, and `Spinner` are compile-safe placeholders. Select and Slider source references live under `legacy/` for later focused migrations. Non-native Toast UI is also a no-op; native Toast continues to use Burnt.

`Dropdown` and `ContextMenu` use RNR primitives on Web and a shared Zeego-backed native data model on iOS and Android. Both compound APIs and rn-ui-kit extensions such as `items`, native icons, haptics, and native triggers are available.

`NativeList` keeps its SwiftUI implementation on iOS. Android and Web use a React Native fallback with sections, input rows, switch rows, menus, context menus, refresh, and edit-mode selection.

## Patch synchronization

Use the existing patch workflow:

```bash
bun run sync-patches
```

The synchronizer copies active patches from `patches/` and updates the app's `patchedDependencies`. Use `rnUiKitSyncPatches.exclude` for app-owned patches. Run `bun run clear-patch-cache --dry-run` before clearing Bun's patched package cache when needed.

## Development

```bash
bun install
bun install --cwd examples/app
bun run typecheck
bun run build
bun run test
```

The one-time RNR CLI source snapshot lives in the Git-ignored `.temp/rnr-source` directory. Production source has no CLI dependency; future updates should be reviewed against the registry source manually.

Package entries:

- `rn-ui-kit`: core API
- `rn-ui-kit/debug`: debug pages
- `rn-ui-kit/initialize`: platform initialization
- `rn-ui-kit/styles.css`: semantic variables and RNR style foundation
