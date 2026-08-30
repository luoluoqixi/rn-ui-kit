import { type ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { ScopedVariables, Uniwind } from "uniwind";

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

type AccentPreset = {
  dark: Pick<
    SemanticColors,
    "accent" | "accentForeground" | "primaryBackground" | "primary" | "primaryForeground" | "ring"
  >;
  light: Pick<
    SemanticColors,
    "accent" | "accentForeground" | "primaryBackground" | "primary" | "primaryForeground" | "ring"
  >;
  swatch: string;
};

export const accentThemeNames = [
  "mono",
  "ocean",
  "sakura",
  "lavender",
  "sunset",
  "forest",
  "ruby",
  "golden",
  "aqua",
] as const;

const accentPresets: Record<(typeof accentThemeNames)[number], AccentPreset> = {
  aqua: createAccentPreset(
    "#0891b2",
    "#cffafe",
    "#155e75",
    "#22d3ee",
    "#164e63",
    "#f1fbfd",
    "#08171b",
  ),
  forest: createAccentPreset(
    "#059669",
    "#d1fae5",
    "#065f46",
    "#34d399",
    "#064e3b",
    "#f2fbf7",
    "#0b1712",
  ),
  golden: createAccentPreset(
    "#ca8a04",
    "#fef9c3",
    "#854d0e",
    "#facc15",
    "#713f12",
    "#fffaf0",
    "#1a1408",
  ),
  lavender: createAccentPreset(
    "#7c3aed",
    "#ede9fe",
    "#5b21b6",
    "#a78bfa",
    "#4c1d95",
    "#f8f5ff",
    "#120d1f",
  ),
  mono: createAccentPreset(
    "#52525b",
    "#f4f4f5",
    "#27272a",
    "#d4d4d8",
    "#27272a",
    "#fafafa",
    "#111113",
  ),
  ocean: createAccentPreset(
    "#2563eb",
    "#dbeafe",
    "#1e40af",
    "#60a5fa",
    "#1e3a8a",
    "#f5f8ff",
    "#0d1424",
  ),
  ruby: createAccentPreset(
    "#e11d48",
    "#ffe4e6",
    "#9f1239",
    "#fb7185",
    "#881337",
    "#fff4f6",
    "#1c0b10",
  ),
  sakura: createAccentPreset(
    "#db2777",
    "#fce7f3",
    "#9d174d",
    "#f472b6",
    "#831843",
    "#fff5fa",
    "#1c0d15",
  ),
  sunset: createAccentPreset(
    "#d97706",
    "#ffedd5",
    "#9a3412",
    "#fb923c",
    "#7c2d12",
    "#fff8f1",
    "#1c120a",
  ),
};

function createAccentPreset(
  lightPrimary: string,
  lightAccent: string,
  lightAccentForeground: string,
  darkPrimary: string,
  darkAccent: string,
  lightBackground: string,
  darkBackground: string,
): AccentPreset {
  return {
    dark: {
      accent: darkAccent,
      accentForeground: "#fafafa",
      primaryBackground: darkBackground,
      primary: darkPrimary,
      primaryForeground: "#09090b",
      ring: darkPrimary,
    },
    light: {
      accent: lightAccent,
      accentForeground: lightAccentForeground,
      primaryBackground: lightBackground,
      primary: lightPrimary,
      primaryForeground: "#ffffff",
      ring: lightPrimary,
    },
    swatch: lightPrimary,
  };
}

const baseColors: Record<ResolvedColorScheme, SemanticColors> = {
  dark: {
    accent: "#27272a",
    accentForeground: "#fafafa",
    background: "#09090b",
    primaryBackground: "#09090b",
    border: "rgba(255, 255, 255, 0.10)",
    card: "#18181b",
    cardForeground: "#fafafa",
    destructive: "#f87171",
    foreground: "#fafafa",
    input: "rgba(255, 255, 255, 0.15)",
    muted: "#27272a",
    mutedForeground: "#a1a1aa",
    popover: "#18181b",
    popoverForeground: "#fafafa",
    primary: "#e4e4e7",
    primaryForeground: "#18181b",
    ring: "#71717a",
    secondary: "#27272a",
    secondaryForeground: "#fafafa",
  },
  light: {
    accent: "#f4f4f5",
    accentForeground: "#18181b",
    background: "#ffffff",
    primaryBackground: "#ffffff",
    border: "#e4e4e7",
    card: "#ffffff",
    cardForeground: "#18181b",
    destructive: "#dc2626",
    foreground: "#18181b",
    input: "#e4e4e7",
    muted: "#f4f4f5",
    mutedForeground: "#71717a",
    popover: "#ffffff",
    popoverForeground: "#18181b",
    primary: "#27272a",
    primaryForeground: "#fafafa",
    ring: "#a1a1aa",
    secondary: "#f4f4f5",
    secondaryForeground: "#27272a",
  },
};

export const accentThemeSwatchColors: Record<AccentThemeName, string> = Object.fromEntries(
  Object.entries(accentPresets).map(([name, preset]) => [name, preset.swatch]),
);

export function resolveUiColors(
  colorScheme: ResolvedColorScheme,
  accentThemeName: AccentThemeName,
  theme?: UiThemeConfig,
): SemanticColors {
  if (theme != null) return theme[colorScheme];

  const preset =
    accentPresets[accentThemeName as keyof typeof accentPresets] ?? accentPresets.ocean;
  return { ...baseColors[colorScheme], ...preset[colorScheme] };
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

const UiThemeContext = createContext<SemanticColors>(resolveUiColors("light", "ocean"));
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
  return useContext(UiThemeContext);
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
