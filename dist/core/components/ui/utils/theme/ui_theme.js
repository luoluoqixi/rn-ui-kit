import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useLayoutEffect, useMemo } from "react";
import { ScopedVariables, Uniwind } from "uniwind";
import { resolveGeneratedAccentTheme, } from "./accent_theme";
import { semanticColorsToVariables } from "./theme_variables";
export function resolveUiColors(colorScheme, accentThemeName, theme) {
    return (theme ?? resolveGeneratedAccentTheme(accentThemeName))[colorScheme];
}
export { semanticColorsToVariables } from "./theme_variables";
const UiThemeContext = createContext(undefined);
const UiColorSchemeContext = createContext("light");
export function UiThemeProvider({ accentThemeName, children, colorScheme, followsSystem, theme, }) {
    const resolvedTheme = useMemo(() => theme ?? resolveGeneratedAccentTheme(accentThemeName), [accentThemeName, theme]);
    const colors = resolvedTheme[colorScheme];
    const variables = useMemo(() => semanticColorsToVariables(colors), [colors]);
    useLayoutEffect(() => {
        // Native portals can outlive their source subtree; Web portals mount under
        // document.body. Keep global theme variables in sync as well as the scope.
        for (const scheme of ["light", "dark"]) {
            Uniwind.updateCSSVariables(scheme, semanticColorsToVariables(resolvedTheme[scheme]));
        }
        // A fixed Uniwind theme also pins Native Appearance. Preserve its adaptive
        // mode so following the system continues to react to future device changes.
        Uniwind.setTheme(followsSystem ? "system" : colorScheme);
    }, [colorScheme, followsSystem, resolvedTheme]);
    return (_jsx(UiColorSchemeContext.Provider, { value: colorScheme, children: _jsx(UiThemeContext.Provider, { value: colors, children: _jsx(ScopedVariables, { variables: variables, children: children }) }) }));
}
export function useUiTheme() {
    return useContext(UiThemeContext) ?? resolveGeneratedAccentTheme("ocean").light;
}
export function useUiColorScheme() {
    return useContext(UiColorSchemeContext);
}
/** Internal legacy aliases for system-native consumers; these are not HeroUI CSS tokens. */
export function useComponentThemeTokens() {
    const colors = useUiTheme();
    return useMemo(() => {
        const value = (val) => ({ val });
        return {
            accent10: value(colors.accent),
            background: value(colors.background),
            backgroundHover: value(colors.accent04),
            backgroundPress: value(colors.accent04),
            borderColor: value(colors.border),
            color: value(colors.foreground),
            color06: value(colors.muted),
            color10: value(colors.accent),
            color3: value(colors.surfaceSecondary),
            color4: value(colors.accent04),
            color5: value(colors.accent04),
            color7: value(colors.border),
            gray8: value(colors.muted),
            gray9: value(colors.muted),
            gray11: value(colors.muted),
            gray12: value(colors.foreground),
        };
    }, [colors]);
}
