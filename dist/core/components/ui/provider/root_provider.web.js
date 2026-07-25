import { jsx as _jsx } from "react/jsx-runtime";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SheetProvider } from "../sheet/provider";
import { resolveAccentThemeName, resolveColorSchemeSettings, resolveUiPreferences, } from "../utils/theme";
import { UIProvider } from "./ui_provider";
export function RootProvider({ accentThemeName, children, colorScheme, preferences, ...providerProps }) {
    const systemColorScheme = useColorScheme();
    const resolvedPreferences = resolveUiPreferences(preferences);
    const resolvedColorScheme = colorScheme ??
        resolveColorSchemeSettings(resolvedPreferences.appearance.themeMode, systemColorScheme);
    const resolvedAccentThemeName = resolveAccentThemeName(accentThemeName ?? resolvedPreferences.appearance.accentColor);
    return (_jsx(GestureHandlerRootView, { style: { flex: 1 }, children: _jsx(SafeAreaProvider, { children: _jsx(UIProvider, { ...providerProps, accentThemeName: resolvedAccentThemeName, colorScheme: resolvedColorScheme, preferences: resolvedPreferences, children: _jsx(SheetProvider, { children: children }) }) }) }));
}
