import { type AccentThemeName } from "./accent_theme";
export type ResolvedColorScheme = "light" | "dark";
export type ColorSchemeSetting = ResolvedColorScheme | "system";
export type UiPreferences = {
    appearance: {
        accentColor: AccentThemeName;
        themeMode: ColorSchemeSetting;
    };
};
export declare const defaultUiPreferences: UiPreferences;
export declare function resolveUiPreferences(preferences?: Partial<UiPreferences>, colorSchemeOverride?: ResolvedColorScheme): UiPreferences;
