import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";

import { SheetProvider } from "../sheet/provider";
import {
  resolveAccentThemeName,
  resolveAppBackgroundColors,
  resolveColorSchemeSettings,
  resolveUiColors,
  resolveUiPreferences,
} from "../utils/theme";
import type { RootProviderProps } from "./types";
import { UIProvider } from "./ui_provider";

export function RootProvider({
  accentThemeName,
  appBackgroundColors,
  children,
  colorScheme,
  navigationTheme,
  preferences,
  theme,
  ...providerProps
}: RootProviderProps) {
  const systemColorScheme = useColorScheme();
  const resolvedPreferences = resolveUiPreferences(preferences);
  const resolvedColorScheme =
    colorScheme ??
    resolveColorSchemeSettings(resolvedPreferences.appearance.themeMode, systemColorScheme);
  const resolvedAccentThemeName = resolveAccentThemeName(
    accentThemeName ?? resolvedPreferences.appearance.accentColor,
  );
  const semanticColors = resolveUiColors(resolvedColorScheme, resolvedAccentThemeName, theme);
  const backgrounds = resolveAppBackgroundColors(resolvedColorScheme, appBackgroundColors);
  const rootBackgroundColor = backgrounds.screen;
  const baseNavigationTheme = resolvedColorScheme === "dark" ? DarkTheme : DefaultTheme;
  const resolvedNavigationTheme = navigationTheme ?? {
    ...baseNavigationTheme,
    colors: {
      ...baseNavigationTheme.colors,
      primary: semanticColors.accent,
      background: backgrounds.screen,
      card: backgrounds.header,
      text: semanticColors.foreground,
      border: semanticColors.border,
      notification: semanticColors.danger,
    },
  };

  return (
    <GestureHandlerRootView style={{ backgroundColor: rootBackgroundColor, flex: 1 }}>
      <SafeAreaProvider style={{ backgroundColor: rootBackgroundColor }}>
        <UIProvider
          {...providerProps}
          accentThemeName={resolvedAccentThemeName}
          appBackgroundColors={appBackgroundColors}
          colorScheme={colorScheme}
          preferences={resolvedPreferences}
          theme={theme}
        >
          <NavigationThemeProvider value={resolvedNavigationTheme}>
            <SheetProvider>{children}</SheetProvider>
          </NavigationThemeProvider>
        </UIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
