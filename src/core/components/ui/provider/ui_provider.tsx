import { PortalHost } from "@rn-primitives/portal";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PortalProvider as TeleportPortalProvider } from "react-native-teleport";

import { NativeDialogProvider } from "../native_dialog";
import { Toaster } from "../toast/toaster";
import { NativeHapticsProvider } from "../utils";
import { resolveAccentThemeName, UiPreferencesProvider, UiThemeProvider } from "../utils/theme";
import type { UIProviderProps } from "./types";

export function UIProvider({
  accentThemeName,
  accentThemeNames,
  children,
  colorScheme,
  defaultNativeHapticsEnabled = false,
  keyboardAnimationProviderProps,
  preferences,
}: UIProviderProps) {
  const resolvedAccentThemeName = resolveAccentThemeName(
    accentThemeName ?? preferences?.appearance?.accentColor,
  );

  return (
    <KeyboardProvider {...keyboardAnimationProviderProps}>
      <UiPreferencesProvider accentThemeNames={accentThemeNames} preferences={preferences}>
        <UiThemeProvider
          accentThemeName={resolvedAccentThemeName}
          colorScheme={colorScheme ?? "light"}
          followsSystem={preferences?.appearance?.themeMode === "system"}
        >
          <TeleportPortalProvider>
            <NativeDialogProvider>
              <NativeHapticsProvider enabledByDefault={defaultNativeHapticsEnabled}>
                {children}
                <PortalHost />
                <Toaster accentThemeName={resolvedAccentThemeName} />
              </NativeHapticsProvider>
            </NativeDialogProvider>
          </TeleportPortalProvider>
        </UiThemeProvider>
      </UiPreferencesProvider>
    </KeyboardProvider>
  );
}
