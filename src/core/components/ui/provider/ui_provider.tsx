import { useColorScheme } from "react-native";

import { TextFontProvider } from "./font_provider";
import { HeroUIProvider } from "./heroui_provider";
import { OverlayPortalHost } from "../utils/overlay/portal_host";
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
            <AppBackgroundColorsProvider colors={appBackgroundColors}>
              <TeleportPortalProvider>
                <NativeHapticsProvider
                  enabledByDefault={defaultNativeHapticsEnabled}
                >
                  <ToastDefaultsProvider
                    defaultNative={toasterProps?.defaultNative}
                  >
                    {/* HeroUI mounts portal content at its provider's host. */}
                    <HeroUIProvider>
                      <NativeDialogProvider>
                        {children}
                        <OverlayPortalHost />
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
                      </NativeDialogProvider>
                    </HeroUIProvider>
                  </ToastDefaultsProvider>
                </NativeHapticsProvider>
              </TeleportPortalProvider>
            </AppBackgroundColorsProvider>
          </UiThemeProvider>
        </UiPreferencesProvider>
      </KeyboardProvider>
    </TextFontProvider>
  );
}
