import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { defaultAccentThemeName, } from "./accent_theme";
export const defaultUiPreferences = {
    appearance: {
        accentColor: defaultAccentThemeName,
        backgroundFollowsTheme: false,
        themeMode: "system",
    },
};
const noopAsync = async () => undefined;
export function resolveUiPreferences(preferences) {
    return {
        ...defaultUiPreferences,
        ...preferences,
        appearance: {
            ...defaultUiPreferences.appearance,
            ...preferences?.appearance,
        },
    };
}
const UiPreferencesContext = createContext({
    accentThemeNames: [],
    error: null,
    isLoaded: true,
    isLoading: false,
    patchPreferences: noopAsync,
    preferences: defaultUiPreferences,
    reload: noopAsync,
    save: noopAsync,
    setPreferences: noopAsync,
    updateAndSave: noopAsync,
});
export function UiPreferencesProvider({ accentThemeNames, children, preferences, }) {
    const value = useMemo(() => ({
        accentThemeNames: accentThemeNames ?? [],
        error: null,
        isLoaded: true,
        isLoading: false,
        patchPreferences: noopAsync,
        preferences: resolveUiPreferences(preferences),
        reload: noopAsync,
        save: noopAsync,
        setPreferences: noopAsync,
        updateAndSave: noopAsync,
    }), [accentThemeNames, preferences]);
    return (_jsx(UiPreferencesContext.Provider, { value: value, children: children }));
}
export function useUiPreferences() {
    return useContext(UiPreferencesContext);
}
function normalizeSystemColorScheme(colorScheme) {
    return colorScheme === "dark" ? "dark" : "light";
}
export function resolveColorSchemeSettings(preferredColorScheme, systemColorScheme) {
    if (preferredColorScheme === "system") {
        return normalizeSystemColorScheme(systemColorScheme);
    }
    return preferredColorScheme;
}
export function useResolvedeColorScheme() {
    const systemColorScheme = useColorScheme();
    const { preferences } = useUiPreferences();
    const preferredColorScheme = preferences.appearance.themeMode;
    return resolveColorSchemeSettings(preferredColorScheme, systemColorScheme);
}
export function useColorSchemeSettings() {
    const systemColorScheme = useColorScheme();
    const { accentThemeNames, preferences, isLoaded, isLoading, error, reload, save, patchPreferences, updateAndSave, } = useUiPreferences();
    const preferredColorScheme = preferences.appearance.themeMode;
    const normalizedSystemColorScheme = normalizeSystemColorScheme(systemColorScheme);
    const resolvedColorScheme = resolveColorSchemeSettings(preferredColorScheme, systemColorScheme);
    return {
        accentThemeNames,
        error,
        isLoaded,
        isLoading,
        isSystemColorScheme: preferredColorScheme === "system",
        preferredColorScheme,
        preferences,
        reload,
        resolvedColorScheme,
        save,
        setPreferredColorScheme: (nextColorScheme) => {
            return patchPreferences((currentPreferences) => ({
                ...currentPreferences,
                appearance: {
                    ...currentPreferences.appearance,
                    themeMode: nextColorScheme,
                },
            }));
        },
        setPreferredColorSchemeAndSave: async (nextColorScheme) => {
            return updateAndSave((currentPreferences) => ({
                ...currentPreferences,
                appearance: {
                    ...currentPreferences.appearance,
                    themeMode: nextColorScheme,
                },
            }));
        },
        systemColorScheme: normalizedSystemColorScheme,
    };
}
