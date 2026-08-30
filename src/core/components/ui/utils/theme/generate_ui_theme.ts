import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  type Scheme,
} from "@material/material-color-utilities";

import type { SemanticColors, UiThemeConfig } from "./ui_theme";

const HEX_COLOR = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;

function color(scheme: Scheme, role: keyof Scheme): string {
  return hexFromArgb(scheme[role] as number);
}

function createSemanticColors(
  scheme: Scheme,
  primaryBackground: string,
  card: string,
  popover: string,
): SemanticColors {
  return {
    accent: color(scheme, "primaryContainer"),
    accentForeground: color(scheme, "onPrimaryContainer"),
    background: color(scheme, "background"),
    primaryBackground,
    border: color(scheme, "outlineVariant"),
    card,
    cardForeground: color(scheme, "onSurface"),
    destructive: color(scheme, "error"),
    foreground: color(scheme, "onBackground"),
    input: color(scheme, "outlineVariant"),
    muted: color(scheme, "surfaceVariant"),
    mutedForeground: color(scheme, "onSurfaceVariant"),
    popover,
    popoverForeground: color(scheme, "onSurface"),
    primary: color(scheme, "primary"),
    primaryForeground: color(scheme, "onPrimary"),
    ring: color(scheme, "primary"),
    secondary: color(scheme, "secondaryContainer"),
    secondaryForeground: color(scheme, "onSecondaryContainer"),
  };
}

/** Generates the complete light/dark semantic theme from an opaque hex seed color. */
export function generateUiThemeFromPrimaryColor(primaryColor: string): UiThemeConfig {
  const normalized = typeof primaryColor === "string" ? primaryColor.trim() : "";

  if (!HEX_COLOR.test(normalized)) {
    throw new TypeError(
      `primaryColor must be an opaque hex color in #RGB or #RRGGBB format, received ${String(primaryColor)}`,
    );
  }

  const materialTheme = themeFromSourceColor(argbFromHex(normalized));
  const lightPrimaryBackground = hexFromArgb(materialTheme.palettes.primary.tone(98));
  const darkPrimaryBackground = hexFromArgb(materialTheme.palettes.primary.tone(6));
  const lightCard = hexFromArgb(materialTheme.palettes.neutral.tone(100));
  const darkCard = hexFromArgb(materialTheme.palettes.neutral.tone(12));
  const lightPopover = hexFromArgb(materialTheme.palettes.neutral.tone(100));
  const darkPopover = hexFromArgb(materialTheme.palettes.neutral.tone(16));

  return {
    light: createSemanticColors(
      materialTheme.schemes.light,
      lightPrimaryBackground,
      lightCard,
      lightPopover,
    ),
    dark: createSemanticColors(
      materialTheme.schemes.dark,
      darkPrimaryBackground,
      darkCard,
      darkPopover,
    ),
  };
}
