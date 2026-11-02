import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo } from "react";
import { ScopedVariables, Uniwind } from "uniwind";
import { resolveGeneratedAccentTheme, } from "./accent_theme";
export function resolveUiColors(colorScheme, accentThemeName, theme) {
    if (theme != null)
        return theme[colorScheme];
    return resolveGeneratedAccentTheme(accentThemeName)[colorScheme];
}
export function semanticColorsToVariables(colors) {
    return {
        "--color-accent01": colors.accent01,
        "--color-accent02": colors.accent02,
        "--color-accent03": colors.accent03,
        "--color-accent04": colors.accent04,
        "--color-accent05": colors.accent05,
        "--color-accent06": colors.accent06,
        "--color-accent07": colors.accent07,
        "--color-accent08": colors.accent08,
        "--color-accent09": colors.accent09,
        "--color-accent10": colors.accent10,
        "--color-accent11": colors.accent11,
        "--color-accent12": colors.accent12,
        "--color-accent": colors.accent,
        "--color-accent-foreground": colors.accentForeground,
        "--color-background": colors.background,
        "--color-border": colors.border,
        "--color-card": colors.card,
        "--color-card-foreground": colors.cardForeground,
        "--color-destructive": colors.destructive,
        "--color-destructive-foreground": colors.destructiveForeground,
        "--color-foreground": colors.foreground,
        "--color-input": colors.input,
        "--color-muted": colors.muted,
        "--color-muted-foreground": colors.mutedForeground,
        "--color-popover": colors.popover,
        "--color-popover-foreground": colors.popoverForeground,
        "--color-primary-background": colors.primaryBackground,
        "--color-primary": colors.primary,
        "--color-primary-foreground": colors.primaryForeground,
        "--color-ring": colors.ring,
        "--color-secondary": colors.secondary,
        "--color-secondary-foreground": colors.secondaryForeground,
    };
}
const UiThemeContext = createContext(undefined);
const UiColorSchemeContext = createContext("light");
export function UiThemeProvider({ accentThemeName, children, colorScheme, followsSystem, theme, }) {
    const colors = useMemo(() => resolveUiColors(colorScheme, accentThemeName, theme), [accentThemeName, colorScheme, theme]);
    const variables = useMemo(() => semanticColorsToVariables(colors), [colors]);
    useEffect(() => {
        Uniwind.setTheme(followsSystem ? "system" : colorScheme);
    }, [colorScheme, followsSystem]);
    return (_jsx(UiColorSchemeContext.Provider, { value: colorScheme, children: _jsx(UiThemeContext.Provider, { value: colors, children: _jsx(ScopedVariables, { variables: variables, children: children }) }) }));
}
export function useUiTheme() {
    return useContext(UiThemeContext) ?? resolveGeneratedAccentTheme("ocean").light;
}
export function useUiColorScheme() {
    return useContext(UiColorSchemeContext);
}
/** Internal bridge for native components that consume concrete color values. */
export function useComponentThemeTokens() {
    const colors = useUiTheme();
    return useMemo(() => {
        const value = (val) => ({ val });
        return {
            accent10: value(colors.primary),
            background: value(colors.background),
            backgroundHover: value(colors.accent),
            backgroundPress: value(colors.accent),
            borderColor: value(colors.border),
            color: value(colors.foreground),
            color06: value(colors.mutedForeground),
            color10: value(colors.primary),
            color3: value(colors.muted),
            color4: value(colors.accent),
            color5: value(colors.accent),
            color7: value(colors.border),
            gray8: value(colors.mutedForeground),
            gray9: value(colors.mutedForeground),
            gray11: value(colors.mutedForeground),
            gray12: value(colors.foreground),
        };
    }, [colors]);
}
