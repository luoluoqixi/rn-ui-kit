import { type ReactNode } from "react";
import { type AccentThemeName } from "./accent_theme";
import type { ResolvedColorScheme } from "./settings";
/** 项目扩展，非 HeroUI 标准 token。编号越大强调越强：light 逐渐加深，dark 逐渐提亮。 */
export type AccentScale = Record<`accent${"01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12"}`, string>;
/** HeroUI source color tokens in camelCase, plus the project's AccentScale extension. */
export type SemanticColors = AccentScale & {
    background: string;
    foreground: string;
    surface: string;
    surfaceForeground: string;
    surfaceSecondary: string;
    surfaceSecondaryForeground: string;
    surfaceTertiary: string;
    surfaceTertiaryForeground: string;
    overlay: string;
    overlayForeground: string;
    backdrop: string;
    /** Muted text, never a container background. */
    muted: string;
    accent: string;
    accentForeground: string;
    default: string;
    defaultForeground: string;
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    danger: string;
    dangerForeground: string;
    fieldBackground: string;
    fieldForeground: string;
    fieldPlaceholder: string;
    fieldBorder: string;
    segment: string;
    segmentForeground: string;
    border: string;
    separator: string;
    focus: string;
    link: string;
};
/** HeroUI semantic colors for one complete light/dark theme pair. */
export interface UiThemeConfig {
    light: SemanticColors;
    dark: SemanticColors;
}
export declare function resolveUiColors(colorScheme: ResolvedColorScheme, accentThemeName: AccentThemeName, theme?: UiThemeConfig): SemanticColors;
export { semanticColorsToVariables } from "./theme_variables";
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
/** Internal legacy aliases for system-native consumers; these are not HeroUI CSS tokens. */
export declare function useComponentThemeTokens(): Record<string, ComponentThemeValue>;
