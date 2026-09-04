import { type ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { ScopedVariables, Uniwind } from "uniwind";

import {
  resolveGeneratedAccentTheme,
  type AccentThemeName,
} from "./accent_theme";
import type { ResolvedColorScheme } from "./settings";

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

export function resolveUiColors(
  colorScheme: ResolvedColorScheme,
  accentThemeName: AccentThemeName,
  theme?: UiThemeConfig,
): SemanticColors {
  if (theme != null) return theme[colorScheme];

  return resolveGeneratedAccentTheme(accentThemeName)[colorScheme];
}

export function semanticColorsToVariables(colors: SemanticColors) {
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
  const colors = useMemo(
    () => resolveUiColors(colorScheme, accentThemeName, theme),
    [accentThemeName, colorScheme, theme],
  );
  const variables = useMemo(() => semanticColorsToVariables(colors), [colors]);

  useEffect(() => {
    Uniwind.setTheme(followsSystem ? "system" : colorScheme);
  }, [colorScheme, followsSystem]);

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

/** Internal bridge for native components that consume concrete color values. */
export function useComponentThemeTokens(): Record<string, ComponentThemeValue> {
  const colors = useUiTheme();
  return useMemo(() => {
    const value = (val: string): ComponentThemeValue => ({ val });
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
