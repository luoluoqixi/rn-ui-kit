export type AccentThemeName = string;
export type AccentThemeNames = readonly AccentThemeName[];
export declare const defaultAccentThemeName: AccentThemeName;
export declare function resolveAccentThemeName(value: unknown, fallback?: AccentThemeName): AccentThemeName;
