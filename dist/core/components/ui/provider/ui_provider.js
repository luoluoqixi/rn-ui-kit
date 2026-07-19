import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";
import { NativeDialogProvider } from "../native_dialog";
import { Toaster } from "../toast/toaster";
import { NativeHapticsProvider } from "../utils";
import { resolveAccentThemeName, UiPreferencesProvider } from "../utils/theme";
export function UIProvider({ accentThemeName, accentThemeNames, children, colorScheme, defaultNativeHapticsEnabled = false, preferences, tamaguiConfig, }) {
    const insets = useSafeAreaInsets();
    const resolvedAccentThemeName = resolveAccentThemeName(accentThemeName ?? preferences?.appearance?.accentColor);
    return (_jsx(TamaguiProvider, { config: tamaguiConfig, defaultTheme: colorScheme, insets: insets, children: _jsx(UiPreferencesProvider, { accentThemeNames: accentThemeNames, preferences: preferences, children: _jsx(Theme, { name: resolvedAccentThemeName, children: _jsx(NativeDialogProvider, { children: _jsxs(NativeHapticsProvider, { enabledByDefault: defaultNativeHapticsEnabled, children: [children, _jsx(Toaster, { accentThemeName: resolvedAccentThemeName })] }) }) }) }) }));
}
