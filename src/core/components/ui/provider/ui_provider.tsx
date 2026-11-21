import { useColorScheme } from "react-native";

import { TextFontProvider } from "./font_provider";
import { HeroUIProvider } from "./heroui_provider";
import { PortalHost } from "@rn-primitives/portal";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PortalProvider as TeleportPortalProvider } from "react-native-teleport";

import { NativeDialogProvider } from "../native_dialog";
import { Toaster } from "../toast/toaster";
import { ToastDefaultsProvider } from "../toast/toast";
import { NativeHapticsProvider } from "../utils";
import {
  AppBackgroundColorsProvider,
  resolveAccentThemeName,
  resolveColorSchemeSettings,
  resolveUiPreferences,
  UiPreferencesProvider,
  UiThemeProvider,
} from "../utils/theme";
import type { UIProviderProps } from "./types";

export function UIProvider({
  accentThemeName,
  accentThemeNames,
  appBackgroundColors,
  children,
  colorScheme,
  defaultNativeHapticsEnabled = false,
  keyboardAnimationProviderProps,
  preferences,
  theme,
  toaster: CustomToaster,
  toasterProps,
  textFontFamily,
}: UIProviderProps) {
  const systemColorScheme = useColorScheme();
  const resolvedPreferences = resolveUiPreferences(preferences, colorScheme);
  const resolvedColorScheme = resolveColorSchemeSettings(
    resolvedPreferences.appearance.themeMode,
    systemColorScheme,
  );
  const resolvedAccentThemeName = resolveAccentThemeName(
    accentThemeName ?? resolvedPreferences.appearance.accentColor,
  );

  return (
    <TextFontProvider family={textFontFamily}>
      <KeyboardProvider {...keyboardAnimationProviderProps}>
        <UiPreferencesProvider
          accentThemeNames={accentThemeNames}
          preferences={resolvedPreferences}
        >
          <UiThemeProvider
            accentThemeName={resolvedAccentThemeName}
            colorScheme={resolvedColorScheme}
            followsSystem={resolvedPreferences.appearance.themeMode === "system"}
            theme={theme}
          >
            <HeroUIProvider>
              <AppBackgroundColorsProvider colors={appBackgroundColors}>
                <TeleportPortalProvider>
                  <NativeDialogProvider>
                    <NativeHapticsProvider
                      enabledByDefault={defaultNativeHapticsEnabled}
                    >
                      <ToastDefaultsProvider
                        defaultNative={toasterProps?.defaultNative}
                      >
                        {children}
                        <PortalHost />
                        {CustomToaster ? (
                          <CustomToaster
                            {...toasterProps}
                            accentThemeName={resolvedAccentThemeName}
                          />
                        ) : (
                          <Toaster
                            {...toasterProps}
                            accentThemeName={resolvedAccentThemeName}
                          />
                        )}
                      </ToastDefaultsProvider>
                    </NativeHapticsProvider>
                  </NativeDialogProvider>
                </TeleportPortalProvider>
              </AppBackgroundColorsProvider>
            </HeroUIProvider>
          </UiThemeProvider>
        </UiPreferencesProvider>
      </KeyboardProvider>
    </TextFontProvider>
  );
}
