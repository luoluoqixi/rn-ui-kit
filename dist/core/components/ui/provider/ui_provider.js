import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useColorScheme } from "react-native";
import { TextFontProvider } from "./font_provider";
import { HeroUIProvider } from "./heroui_provider";
import { OverlayPortalHost } from "../utils/overlay/portal_host";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PortalProvider as TeleportPortalProvider } from "react-native-teleport";
import { NativeDialogProvider } from "../native_dialog";
import { Toaster } from "../toast/toaster";
import { ToastDefaultsProvider } from "../toast/toast";
import { NativeHapticsProvider } from "../utils/haptics";
import { AppBackgroundColorsProvider, resolveAccentThemeName, resolveColorSchemeSettings, resolveUiPreferences, UiPreferencesProvider, UiThemeProvider, } from "../utils/theme";
export function UIProvider({ accentThemeName, accentThemeNames, appBackgroundColors, children, colorScheme, defaultNativeHapticsEnabled = false, keyboardAnimationProviderProps, preferences, theme, toaster: CustomToaster, toasterProps, textFontFamily, }) {
    const systemColorScheme = useColorScheme();
    const resolvedPreferences = resolveUiPreferences(preferences, colorScheme);
    const resolvedColorScheme = resolveColorSchemeSettings(resolvedPreferences.appearance.themeMode, systemColorScheme);
    const resolvedAccentThemeName = resolveAccentThemeName(accentThemeName ?? resolvedPreferences.appearance.accentColor);
    return (_jsx(TextFontProvider, { family: textFontFamily, children: _jsx(KeyboardProvider, { ...keyboardAnimationProviderProps, children: _jsx(UiPreferencesProvider, { accentThemeNames: accentThemeNames, preferences: resolvedPreferences, children: _jsx(UiThemeProvider, { accentThemeName: resolvedAccentThemeName, colorScheme: resolvedColorScheme, followsSystem: resolvedPreferences.appearance.themeMode === "system", theme: theme, children: _jsx(AppBackgroundColorsProvider, { colors: appBackgroundColors, children: _jsx(TeleportPortalProvider, { children: _jsx(NativeHapticsProvider, { enabledByDefault: defaultNativeHapticsEnabled, children: _jsx(ToastDefaultsProvider, { defaultNative: toasterProps?.defaultNative, children: _jsx(HeroUIProvider, { children: _jsxs(NativeDialogProvider, { children: [children, _jsx(OverlayPortalHost, {}), CustomToaster ? (_jsx(CustomToaster, { ...toasterProps, accentThemeName: resolvedAccentThemeName })) : (_jsx(Toaster, { ...toasterProps, accentThemeName: resolvedAccentThemeName }))] }) }) }) }) }) }) }) }) }) }));
}
