import { useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";

import { SheetProvider } from "../sheet/provider";
import {
  getAppWindowBackgroundColor,
  resolveAccentThemeName,
  resolveColorSchemeSettings,
  resolveUiPreferences,
} from "../utils/theme";
import type { RootProviderProps } from "./types";
import { UIProvider } from "./ui_provider";

export function RootProvider({
  accentThemeName,
  children,
  colorScheme,
  navigationTheme,
  preferences,
  ...providerProps
}: RootProviderProps) {
  const systemColorScheme = useColorScheme();
  const resolvedPreferences = resolveUiPreferences(preferences);
  const preferredColorScheme = resolvedPreferences.appearance.themeMode;
  const resolvedColorScheme =
    colorScheme ?? resolveColorSchemeSettings(preferredColorScheme, systemColorScheme);
  const resolvedAccentThemeName = resolveAccentThemeName(
    accentThemeName ?? resolvedPreferences.appearance.accentColor,
  );
  const rootBackgroundColor = getAppWindowBackgroundColor(resolvedColorScheme);

  const resolvedNavigationTheme =
    navigationTheme ?? (resolvedColorScheme === "dark" ? DarkTheme : DefaultTheme);

  useEffect(() => {
    Appearance.setColorScheme(
      colorScheme == null && preferredColorScheme === "system"
        ? "unspecified"
        : resolvedColorScheme,
    );
  }, [colorScheme, preferredColorScheme, resolvedColorScheme]);

  return (
    <GestureHandlerRootView style={{ backgroundColor: rootBackgroundColor, flex: 1 }}>
      <SafeAreaProvider style={{ backgroundColor: rootBackgroundColor }}>
        <UIProvider
          {...providerProps}
          accentThemeName={resolvedAccentThemeName}
          colorScheme={resolvedColorScheme}
          preferences={resolvedPreferences}
        >
          <NavigationThemeProvider value={resolvedNavigationTheme}>
            <SheetProvider>{children}</SheetProvider>
          </NavigationThemeProvider>
        </UIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
