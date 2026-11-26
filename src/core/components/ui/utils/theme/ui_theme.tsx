import { type ReactNode, createContext, useContext, useLayoutEffect, useMemo } from "react";
import { ScopedVariables, Uniwind } from "uniwind";

import {
  resolveGeneratedAccentTheme,
  type AccentThemeName,
} from "./accent_theme";
import type { ResolvedColorScheme } from "./settings";
import { semanticColorsToVariables } from "./theme_variables";

/** 项目扩展，非 HeroUI 标准 token。编号越大强调越强：light 逐渐加深，dark 逐渐提亮。 */
export type AccentScale = Record<
  `accent${"01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12"}`,
  string
>;

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

export function resolveUiColors(
  colorScheme: ResolvedColorScheme,
  accentThemeName: AccentThemeName,
  theme?: UiThemeConfig,
): SemanticColors {
  return (theme ?? resolveGeneratedAccentTheme(accentThemeName))[colorScheme];
}

export { semanticColorsToVariables } from "./theme_variables";

const UiThemeContext = createContext<SemanticColors | undefined>(undefined);
const UiColorSchemeContext = createContext<ResolvedColorScheme>("light");

export function UiThemeProvider({
  accentThemeName,
  children,
  colorScheme,
  followsSystem,
  theme,
}: {
  accentThemeName: AccentThemeName;
  children: ReactNode;
  colorScheme: ResolvedColorScheme;
  followsSystem: boolean;
  theme?: UiThemeConfig;
}) {
  const resolvedTheme = useMemo(
    () => theme ?? resolveGeneratedAccentTheme(accentThemeName),
    [accentThemeName, theme],
  );
  const colors = resolvedTheme[colorScheme];
  const variables = useMemo(() => semanticColorsToVariables(colors), [colors]);

  useLayoutEffect(() => {
    // Native portals can outlive their source subtree; Web portals mount under
    // document.body. Keep global theme variables in sync as well as the scope.
    for (const scheme of ["light", "dark"] as const) {
      Uniwind.updateCSSVariables(scheme, semanticColorsToVariables(resolvedTheme[scheme]));
    }
    // A fixed Uniwind theme also pins Native Appearance. Preserve its adaptive
    // mode so following the system continues to react to future device changes.
    Uniwind.setTheme(followsSystem ? "system" : colorScheme);
  }, [colorScheme, followsSystem, resolvedTheme]);

  return (
    <UiColorSchemeContext.Provider value={colorScheme}>
      <UiThemeContext.Provider value={colors}>
        <ScopedVariables variables={variables}>{children}</ScopedVariables>
      </UiThemeContext.Provider>
    </UiColorSchemeContext.Provider>
  );
}

export function useUiTheme(): SemanticColors {
  return useContext(UiThemeContext) ?? resolveGeneratedAccentTheme("ocean").light;
}

export function useUiColorScheme(): ResolvedColorScheme {
  return useContext(UiColorSchemeContext);
}

type ComponentThemeValue = { val: string };

/** Internal legacy aliases for system-native consumers; these are not HeroUI CSS tokens. */
export function useComponentThemeTokens(): Record<string, ComponentThemeValue> {
  const colors = useUiTheme();
  return useMemo(() => {
    const value = (val: string): ComponentThemeValue => ({ val });
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
