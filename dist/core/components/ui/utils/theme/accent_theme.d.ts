import type { UiThemeConfig } from "./ui_theme";
export type AccentThemeName = string;
export type AccentThemeNames = readonly AccentThemeName[];
export declare const defaultAccentThemeName: AccentThemeName;
export declare const accentThemeNames: readonly ["mono", "ocean", "sakura", "lavender", "sunset", "forest", "ruby", "golden", "aqua"];
export declare const accentThemeSeeds: Record<(typeof accentThemeNames)[number], string>;
export declare function resolveGeneratedAccentTheme(accentThemeName: AccentThemeName): UiThemeConfig;
export declare const accentThemeSwatchColors: Record<AccentThemeName, string>;
export declare function resolveAccentThemeName(value: unknown, fallback?: AccentThemeName): AccentThemeName;
