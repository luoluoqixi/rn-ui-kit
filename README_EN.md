# rn-ui-kit

[中文](./README.md) · [English](./README_EN.md)

[Live demo (web)](https://rn-ui-kit.luoluoqixi.com/) · [Screenshots](./docs/SCREENSHOTS.md)

A cross-platform UI kit for the maintainer's Expo apps. Custom-drawn components use **HeroUI Native** on iOS and Android and **HeroUI React v3** on Web, wrapped by a single props-based rn-ui-kit API. Existing system-native implementations remain available for controls such as Button, Switch, Slider, Select, and menus. Sheet continues to use TrueSheet.

> [!WARNING]
> This is a personal UI library. It does not promise the API stability or compatibility range expected from a general-purpose package.

## Runtime

| Technology | Version |
| --- | --- |
| Expo | 55.0.26 |
| React Native | 0.83.9 |
| React / React DOM | 19.2.5 |
| HeroUI Native | 1.1.1 |
| HeroUI React / Styles | 3.2.7 |
| Reanimated / Worklets | 4.3.4 / 0.8.1 |
| TrueSheet | 4.1.2 |
| Uniwind / Tailwind CSS | 1.x / 4.x |
| TypeScript / package manager | 5.9.2 / Bun |

Only Expo apps are supported; bare React Native CLI apps are out of scope. See the root and example `package.json` files for the complete dependency constraints.

## App Setup

The library declares both HeroUI packages as dependencies. The host app must provide the Expo, React Native, and native runtime modules listed as peer dependencies so autolinking and patches work. After installation, sync the library patches and rebuild the native app.

Create `global.css` for Web:

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "rn-ui-kit/styles.css";

@custom-variant light (&:where(.light, .light *));
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --spacing-hairline: 1px;
}

@source "./src";
@source "./node_modules/rn-ui-kit/src";
```

Create `global.native.css` for iOS and Android:

```css
@import "tailwindcss";
@import "uniwind";
@import "heroui-native/styles";
@import "rn-ui-kit/styles.css";

@source "./src";
@source "./node_modules/rn-ui-kit/src";
```

Configure Metro with the library helper:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withHeroUIConfig } = require("rn-ui-kit/metro");

module.exports = withHeroUIConfig(getDefaultConfig(__dirname), {
  cssEntryFile: "./global.css",
  nativeCssEntryFile: "./global.native.css",
  dtsFile: "./uniwind-types.d.ts",
});
```

Also configure PostCSS with `@tailwindcss/postcss`, then load initialization and the shared CSS entry before the app:

```tsx
import "rn-ui-kit/initialize";
import "./global.css";
```

Metro resolves the shared CSS import to the Native entry on iOS and Android. Web does not load HeroUI Native JS or CSS; Native does not load HeroUI React or Styles. Both dependencies may exist in `node_modules`, while the platform module and CSS graphs remain isolated. Web keeps the Uniwind runtime for existing React Native styling. The linked-source path in this repository's example app may differ from the paths above.

## Provider And Themes

```tsx
import { RootProvider, Button, Text } from "rn-ui-kit";
import { View } from "react-native";

export default function App() {
  return (
    <RootProvider preferences={{ appearance: { accentColor: "ocean", themeMode: "system" } }}>
      <View className="bg-background flex-1 items-center justify-center gap-4">
        <Text>Hello, rn-ui-kit</Text>
        <Button native={false} title="Continue" onPress={() => {}} />
      </View>
    </RootProvider>
  );
}
```

Mount one `RootProvider` and manage `preferences` in the app. Themes use HeroUI semantic tokens and support built-in accent colors and custom light/dark palettes. See [Provider and themes](./docs/provider_and_theme.md) for provider boundaries, theme generation, and container background configuration.

## Components

| Category | Components |
| --- | --- |
| Actions and feedback | `Button`, `CloseButton`, `Switch`, `Slider`, `Toggle`, `ToggleGroup`, `PressableFeedback`, `Spinner`, `Progress`, `Toast` |
| Forms | `Input`, `InputGroup`, `InputOTP`, `TextField`, `SearchField`, `Textarea`, `Checkbox`, `RadioGroup`, `Select`, `Label` |
| Layout and navigation | `Accordion`, `Card`, `Surface`, `Separator`, `Tabs`, `SplitView` / `SplitLayout` |
| Overlays and menus | `Dialog`, `AlertDialog`, `Popover`, `Tooltip`, `Dropdown`, `ContextMenu`, `Menubar`, `Sheet` / `NativeSheet`, `NativeDialog` |
| Lists and scrolling | `ListGroup`, `NativeList`, `ScrollView`, `ScrollShadow`, `TagGroup` |
| Display | `Alert`, `Avatar`, `Badge`, `Chip`, `Skeleton`, `Text`, `Icon`, `Link`, `GlassEffect`, `ColorPicker` |

Components use a single props-based API. `native` refers to system-native implementations; consult the exported TypeScript types for defaults, supported modes, and platform-specific props. See [component usage notes](./docs/components.md) for detailed behavior and configuration.

## Patch Sync And Development

```bash
bun run sync-patches
bun install --frozen-lockfile
bun install --cwd examples/app --frozen-lockfile
bun run typecheck
bun run build
bun test test
```

The patch synchronizer copies active patches and updates the host app's `patchedDependencies`; app-owned patches can be excluded with `rnUiKitSyncPatches.exclude`. Read [the Bun patch notes](./docs/patch/bun_same_file_hunk_offset.md) before modifying any patch.

Start the example app with `cd examples/app && bun run start --clear`. Production export and platform-isolation checks are documented in [development notes](./docs/dev.md). Automated tests and Expo JS/CSS exports do not replace native compilation or real-device verification.

Package entries include `rn-ui-kit` / `rn-ui-kit/core`, `rn-ui-kit/debug`, `rn-ui-kit/initialize`, `rn-ui-kit/styles.css`, and `rn-ui-kit/metro`.

## Further Reading

- [Provider and themes](./docs/provider_and_theme.md)
- [Component usage notes](./docs/components.md)
- [Development notes](./docs/dev.md)
- [HeroUI migration history](./docs/heroui-migration.md)
