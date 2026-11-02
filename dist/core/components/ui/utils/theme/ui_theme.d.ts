import { type ReactNode } from "react";
import { type AccentThemeName } from "./accent_theme";
import type { ResolvedColorScheme } from "./settings";
/** 编号越大强调越强：light 逐渐加深，dark 逐渐提亮。 */
export type AccentScale = Record<`accent${"01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12"}`, string>;
export type SemanticColors = AccentScale & {
    accent: string;
    accentForeground: string;
    background: string;
    primaryBackground: string;
    border: string;
    card: string;
    cardForeground: string;
    destructive: string;
    destructiveForeground: string;
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
export declare function resolveUiColors(colorScheme: ResolvedColorScheme, accentThemeName: AccentThemeName, theme?: UiThemeConfig): SemanticColors;
export declare function semanticColorsToVariables(colors: SemanticColors): {
    "--color-accent01": string;
    "--color-accent02": string;
    "--color-accent03": string;
    "--color-accent04": string;
    "--color-accent05": string;
    "--color-accent06": string;
    "--color-accent07": string;
    "--color-accent08": string;
    "--color-accent09": string;
    "--color-accent10": string;
    "--color-accent11": string;
    "--color-accent12": string;
    "--color-accent": string;
    "--color-accent-foreground": string;
    "--color-background": string;
    "--color-border": string;
    "--color-card": string;
    "--color-card-foreground": string;
    "--color-destructive": string;
    "--color-destructive-foreground": string;
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
export declare function useUiColorScheme(): ResolvedColorScheme;
type ComponentThemeValue = {
    val: string;
};
/** Internal bridge for native components that consume concrete color values. */
export declare function useComponentThemeTokens(): Record<string, ComponentThemeValue>;
export {};
