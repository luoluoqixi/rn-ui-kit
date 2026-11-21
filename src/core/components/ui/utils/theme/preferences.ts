import { defaultAccentThemeName, type AccentThemeName } from "./accent_theme";

export type ResolvedColorScheme = "light" | "dark";
export type ColorSchemeSetting = ResolvedColorScheme | "system";

export type UiPreferences = {
  appearance: {
    accentColor: AccentThemeName;
    themeMode: ColorSchemeSetting;
  };
};

export const defaultUiPreferences: UiPreferences = {
  appearance: {
    accentColor: defaultAccentThemeName,
    themeMode: "system",
  },
};

export function resolveUiPreferences(
  preferences?: Partial<UiPreferences>,
  colorSchemeOverride?: ResolvedColorScheme,
): UiPreferences {
  // Pick supported fields so obsolete persisted preferences are discarded.
  return {
    appearance: {
      accentColor: preferences?.appearance?.accentColor ?? defaultUiPreferences.appearance.accentColor,
      themeMode: colorSchemeOverride ?? preferences?.appearance?.themeMode ?? defaultUiPreferences.appearance.themeMode,
    },
  };
}
