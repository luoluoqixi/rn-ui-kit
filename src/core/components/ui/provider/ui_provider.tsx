import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";

import { NativeDialogProvider } from "../native_dialog";
import { Toaster } from "../toast/toaster";
import { NativeHapticsProvider } from "../utils";
import { resolveAccentThemeName, UiPreferencesProvider } from "../utils/theme";
import type { UIProviderProps } from "./types";

export function UIProvider({
  accentThemeName,
  accentThemeNames,
  children,
  colorScheme,
  defaultNativeHapticsEnabled = false,
  preferences,
  tamaguiConfig,
}: UIProviderProps) {
  const insets = useSafeAreaInsets();
  const resolvedAccentThemeName = resolveAccentThemeName(
    accentThemeName ?? preferences?.appearance?.accentColor,
  );

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme} insets={insets}>
      <UiPreferencesProvider accentThemeNames={accentThemeNames} preferences={preferences}>
        <Theme name={resolvedAccentThemeName as never}>
          <NativeDialogProvider>
            <NativeHapticsProvider enabledByDefault={defaultNativeHapticsEnabled}>
              {children}
              <Toaster accentThemeName={resolvedAccentThemeName} />
            </NativeHapticsProvider>
          </NativeDialogProvider>
        </Theme>
      </UiPreferencesProvider>
    </TamaguiProvider>
  );
}
