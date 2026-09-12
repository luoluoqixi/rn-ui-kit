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
        "--color-accent": colors.accent,
        "--color-accent-foreground": colors.accentForeground,
        "--color-background": colors.background,
        "--color-border": colors.border,
        "--color-card": colors.card,
        "--color-card-foreground": colors.cardForeground,
        "--color-destructive": colors.destructive,
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
