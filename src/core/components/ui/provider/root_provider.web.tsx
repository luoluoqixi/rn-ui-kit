import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SheetProvider } from "../sheet/provider";
import {
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
  preferences,
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UIProvider
          {...providerProps}
          accentThemeName={resolvedAccentThemeName}
          colorScheme={resolvedColorScheme}
          preferences={resolvedPreferences}
        >
          <SheetProvider>{children}</SheetProvider>
        </UIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
