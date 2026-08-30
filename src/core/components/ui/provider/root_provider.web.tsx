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
  const configuredBackgroundColors = appBackgroundColors?.[
    resolvedPreferences.appearance.backgroundFollowsTheme ? "true" : "false"
  ];
  const rootBackgroundColor =
    configuredBackgroundColors?.[resolvedColorScheme]?.screen ??
    (resolvedPreferences.appearance.backgroundFollowsTheme
      ? semanticColors.primaryBackground
      : semanticColors.background);
  const resolvedNavigationTheme =
    navigationTheme ?? (resolvedColorScheme === "dark" ? DarkTheme : DefaultTheme);

  return (
    <GestureHandlerRootView style={{ backgroundColor: rootBackgroundColor, flex: 1 }}>
      <SafeAreaProvider style={{ backgroundColor: rootBackgroundColor }}>
        <UIProvider
          {...providerProps}
          accentThemeName={resolvedAccentThemeName}
          appBackgroundColors={appBackgroundColors}
          colorScheme={resolvedColorScheme}
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
