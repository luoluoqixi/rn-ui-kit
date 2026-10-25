import {
  argbFromHex,
  hexFromArgb,
  Hct,
  themeFromSourceColor,
  type Scheme,
  type TonalPalette,
} from "@material/material-color-utilities";

import type { AccentScale, SemanticColors, UiThemeConfig } from "./ui_theme";

const HEX_COLOR = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;

function color(scheme: Scheme, role: keyof Scheme): string {
  return hexFromArgb(scheme[role] as number);
}

// 与现有 accent（light tone 90 / dark tone 30）对齐，03 留给较弱的 hover。
const lightAccentTones = [99, 97, 95, 90, 85, 80, 70, 60, 50, 40, 30, 20];
const darkAccentTones = [6, 10, 20, 30, 35, 40, 50, 60, 70, 80, 90, 95];

function createAccentScale(palette: TonalPalette, tones: readonly number[]): AccentScale {
  return Object.fromEntries(
    tones.map((tone, index) => [
      `accent${String(index + 1).padStart(2, "0")}`,
      hexFromArgb(palette.tone(tone)),
    ]),
  ) as AccentScale;
}

function createSemanticColors(
  scheme: Scheme,
  accentScale: AccentScale,
  primaryBackground: string,
  card: string,
  popover: string,
  primaryOverride?: string,
  primaryForegroundOverride?: string,
): SemanticColors {
  return {
    ...accentScale,
    accent: color(scheme, "primaryContainer"),
    accentForeground: color(scheme, "onPrimaryContainer"),
    background: color(scheme, "background"),
    primaryBackground,
    border: color(scheme, "outlineVariant"),
    card,
    cardForeground: color(scheme, "onSurface"),
    destructive: color(scheme, "error"),
    destructiveForeground: color(scheme, "onError"),
    foreground: color(scheme, "onBackground"),
    input: color(scheme, "outlineVariant"),
    muted: color(scheme, "surfaceVariant"),
    mutedForeground: color(scheme, "onSurfaceVariant"),
    popover,
    popoverForeground: color(scheme, "onSurface"),
    primary: primaryOverride ?? color(scheme, "primary"),
    primaryForeground: primaryForegroundOverride ?? color(scheme, "onPrimary"),
    ring: primaryOverride ?? color(scheme, "primary"),
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

  const sourceColor = argbFromHex(normalized);
  const materialTheme = themeFromSourceColor(sourceColor);
  // Material's default light primary is always tone 40. That is intentionally
  // readable, but makes bright user-selected colors appear much darker than
  // their source swatch. Preserve the source tone when it is bright enough,
  // while retaining tone 40 as the floor for dark colors.
  const sourceTone = Hct.fromInt(sourceColor).tone;
  const lightPrimaryTone = Math.min(90, Math.max(40, sourceTone));
  const lightPrimary = hexFromArgb(materialTheme.palettes.primary.tone(lightPrimaryTone));
  const lightPrimaryForeground = lightPrimaryTone >= 60 ? "#000000" : "#ffffff";
  const lightPrimaryBackground = hexFromArgb(materialTheme.palettes.primary.tone(98));
  const darkPrimaryBackground = hexFromArgb(materialTheme.palettes.primary.tone(6));
  const lightCard = hexFromArgb(materialTheme.palettes.neutral.tone(100));
  const darkCard = hexFromArgb(materialTheme.palettes.neutral.tone(12));
  const lightPopover = hexFromArgb(materialTheme.palettes.neutral.tone(100));
  const darkPopover = hexFromArgb(materialTheme.palettes.neutral.tone(16));

  return {
    light: createSemanticColors(
      materialTheme.schemes.light,
      createAccentScale(materialTheme.palettes.primary, lightAccentTones),
      lightPrimaryBackground,
      lightCard,
      lightPopover,
      lightPrimary,
      lightPrimaryForeground,
    ),
    dark: createSemanticColors(
      materialTheme.schemes.dark,
      createAccentScale(materialTheme.palettes.primary, darkAccentTones),
      darkPrimaryBackground,
      darkCard,
      darkPopover,
    ),
  };
}
