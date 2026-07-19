import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SheetProvider } from "../sheet/provider";
import { getAppWindowBackgroundColor, resolveAccentThemeName, resolveColorSchemeSettings, resolveUiPreferences, } from "../utils/theme";
import { UIProvider } from "./ui_provider";
export function RootProvider({ accentThemeName, children, colorScheme, preferences, ...providerProps }) {
    const systemColorScheme = useColorScheme();
    const resolvedPreferences = resolveUiPreferences(preferences);
    const preferredColorScheme = resolvedPreferences.appearance.themeMode;
    const resolvedColorScheme = colorScheme ?? resolveColorSchemeSettings(preferredColorScheme, systemColorScheme);
    const resolvedAccentThemeName = resolveAccentThemeName(accentThemeName ?? resolvedPreferences.appearance.accentColor);
    const rootBackgroundColor = getAppWindowBackgroundColor(resolvedColorScheme);
    useEffect(() => {
        Appearance.setColorScheme(colorScheme == null && preferredColorScheme === "system" ? "unspecified" : resolvedColorScheme);
    }, [colorScheme, preferredColorScheme, resolvedColorScheme]);
    return (_jsx(GestureHandlerRootView, { style: { backgroundColor: rootBackgroundColor, flex: 1 }, children: _jsx(SafeAreaProvider, { style: { backgroundColor: rootBackgroundColor }, children: _jsx(UIProvider, { ...providerProps, accentThemeName: resolvedAccentThemeName, colorScheme: resolvedColorScheme, preferences: resolvedPreferences, children: _jsx(SheetProvider, { children: children }) }) }) }));
}
