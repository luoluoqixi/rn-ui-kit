import { type ReactNode } from "react";
import type { AccentThemeName, ResolvedColorScheme } from ".";
export type SemanticColors = {
    accent: string;
    accentForeground: string;
    background: string;
    primaryBackground: string;
    border: string;
    card: string;
    cardForeground: string;
    destructive: string;
    foreground: string;
    input: string;
    muted: string;
    mutedForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    ring: string;
    secondary: string;
    secondaryForeground: string;
};
/** Complete semantic color set for one light/dark theme pair. */
export interface UiThemeConfig {
    light: SemanticColors;
    dark: SemanticColors;
}
export declare const accentThemeNames: readonly ["mono", "ocean", "sakura", "lavender", "sunset", "forest", "ruby", "golden", "aqua"];
export declare const accentThemeSwatchColors: Record<AccentThemeName, string>;
export declare function resolveUiColors(colorScheme: ResolvedColorScheme, accentThemeName: AccentThemeName, theme?: UiThemeConfig): SemanticColors;
export declare function semanticColorsToVariables(colors: SemanticColors): {
    "--color-accent": string;
    "--color-accent-foreground": string;
    "--color-background": string;
    "--color-border": string;
    "--color-card": string;
    "--color-card-foreground": string;
    "--color-destructive": string;
    "--color-foreground": string;
    "--color-input": string;
    "--color-muted": string;
    "--color-muted-foreground": string;
    "--color-popover": string;
    "--color-popover-foreground": string;
    "--color-primary-background": string;
    "--color-primary": string;
    "--color-primary-foreground": string;
    "--color-ring": string;
    "--color-secondary": string;
    "--color-secondary-foreground": string;
};
export declare function UiThemeProvider({ accentThemeName, children, colorScheme, followsSystem, theme, }: {
    accentThemeName: AccentThemeName;
    children: ReactNode;
    colorScheme: ResolvedColorScheme;
    followsSystem: boolean;
    theme?: UiThemeConfig;
}): import("react").JSX.Element;
export declare function useUiTheme(): SemanticColors;
type ComponentThemeValue = {
    val: string;
};
/** Internal bridge for native components that consume concrete color values. */
export declare function useComponentThemeTokens(): Record<string, ComponentThemeValue>;
export {};
