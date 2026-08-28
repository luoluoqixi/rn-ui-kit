import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PortalHost } from "@rn-primitives/portal";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PortalProvider as TeleportPortalProvider } from "react-native-teleport";
import { NativeDialogProvider } from "../native_dialog";
import { Toaster } from "../toast/toaster";
import { NativeHapticsProvider } from "../utils";
import { resolveAccentThemeName, UiPreferencesProvider, UiThemeProvider } from "../utils/theme";
export function UIProvider({ accentThemeName, accentThemeNames, children, colorScheme, defaultNativeHapticsEnabled = false, keyboardAnimationProviderProps, preferences, theme, toaster: CustomToaster, toasterProps, }) {
    const resolvedAccentThemeName = resolveAccentThemeName(accentThemeName ?? preferences?.appearance?.accentColor);
    return (_jsx(KeyboardProvider, { ...keyboardAnimationProviderProps, children: _jsx(UiPreferencesProvider, { accentThemeNames: accentThemeNames, preferences: preferences, children: _jsx(UiThemeProvider, { accentThemeName: resolvedAccentThemeName, colorScheme: colorScheme ?? "light", followsSystem: preferences?.appearance?.themeMode === "system", theme: theme, children: _jsx(TeleportPortalProvider, { children: _jsx(NativeDialogProvider, { children: _jsxs(NativeHapticsProvider, { enabledByDefault: defaultNativeHapticsEnabled, children: [children, _jsx(PortalHost, {}), CustomToaster ? (_jsx(CustomToaster, { ...toasterProps, accentThemeName: resolvedAccentThemeName })) : (_jsx(Toaster, { ...toasterProps, accentThemeName: resolvedAccentThemeName }))] }) }) }) }) }) }));
}
