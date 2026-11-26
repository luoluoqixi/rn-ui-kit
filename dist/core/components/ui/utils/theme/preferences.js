import { defaultAccentThemeName } from "./accent_theme";
export const defaultUiPreferences = {
    appearance: {
        accentColor: defaultAccentThemeName,
        themeMode: "system",
    },
};
export function resolveUiPreferences(preferences, colorSchemeOverride) {
    // Pick supported fields so obsolete persisted preferences are discarded.
    return {
        appearance: {
            accentColor: preferences?.appearance?.accentColor ?? defaultUiPreferences.appearance.accentColor,
            themeMode: colorSchemeOverride ?? preferences?.appearance?.themeMode ?? defaultUiPreferences.appearance.themeMode,
        },
    };
}
