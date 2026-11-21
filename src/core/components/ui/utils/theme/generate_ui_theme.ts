import {
  argbFromHex,
  hexFromArgb,
  Hct,
  themeFromSourceColor,
  type TonalPalette,
} from "@material/material-color-utilities";

import type { AccentScale, SemanticColors, UiThemeConfig } from "./ui_theme";

const HEX_COLOR = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;
const lightAccentTones = [99, 97, 95, 90, 85, 80, 70, 60, 50, 40, 30, 20];
const darkAccentTones = [6, 10, 20, 30, 35, 40, 50, 60, 70, 80, 90, 95];

function createAccentScale(palette: TonalPalette, tones: readonly number[]): AccentScale {
  return Object.fromEntries(
    tones.map((tone, index) => [
      "accent" + String(index + 1).padStart(2, "0"),
      hexFromArgb(palette.tone(tone)),
    ]),
  ) as AccentScale;
}

// Choose the more readable foreground rather than using an HCT tone threshold.
// Saturated mid-tone seeds can otherwise produce white-on-bright accent text.
function accentForeground(accent: string): string {
  const channels = [1, 3, 5].map(offset => {
    const value = Number.parseInt(accent.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
  return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? "#000000" : "#ffffff";
}

function createSemanticColors(
  dark: boolean,
  scale: AccentScale,
  accent: string,
  danger: string,
  dangerForeground: string,
): SemanticColors {
  // Neutral containers intentionally do not change when the accent seed changes.
  // Application screen/Sheet backgrounds belong to appBackgroundColors instead.
  const foreground = dark ? "#fafafa" : "#18181b";
  const surface = dark ? "#18181b" : "#ffffff";
  const surfaceSecondary = dark ? "#27272a" : "#f4f4f5";
  const muted = dark ? "#a1a1aa" : "#62626c";
  const border = dark ? "#3f3f46" : "#d4d4d8";
  return {
    ...scale,
    background: dark ? "#09090b" : "#f7f7f8",
    foreground,
    surface,
    surfaceForeground: foreground,
    surfaceSecondary,
    surfaceSecondaryForeground: foreground,
    surfaceTertiary: dark ? "#303036" : "#e4e4e7",
    surfaceTertiaryForeground: foreground,
    overlay: dark ? "#202024" : "#ffffff",
    overlayForeground: foreground,
    backdrop: dark ? "#00000099" : "#00000066",
    muted,
    accent,
    accentForeground: accentForeground(accent),
    default: surfaceSecondary,
    defaultForeground: foreground,
    success: dark ? "#86efac" : "#15803d",
    successForeground: dark ? "#000000" : "#ffffff",
    warning: dark ? "#fcd34d" : "#facc15",
    warningForeground: "#000000",
    danger,
    dangerForeground,
    fieldBackground: dark ? "#202024" : "#ffffff",
    fieldForeground: foreground,
    fieldPlaceholder: muted,
    fieldBorder: border,
    segment: surface,
    segmentForeground: foreground,
    border,
    separator: dark ? "#3f3f46" : "#e4e4e7",
    focus: accent,
    link: foreground,
  };
}

/** Generates HeroUI semantic colors and a concrete accent scale from an opaque hex seed. */
export function generateUiThemeFromPrimaryColor(primaryColor: string): UiThemeConfig {
  const normalized = typeof primaryColor === "string" ? primaryColor.trim() : "";
  if (!HEX_COLOR.test(normalized)) {
    throw new TypeError(
      "primaryColor must be an opaque hex color in #RGB or #RRGGBB format, received " + String(primaryColor),
    );
  }

  const sourceColor = argbFromHex(normalized);
  const material = themeFromSourceColor(sourceColor);
  // Keep bright user-selected accents close to the original swatch.
  const lightTone = Math.min(90, Math.max(40, Hct.fromInt(sourceColor).tone));
  return {
    light: createSemanticColors(
      false,
      createAccentScale(material.palettes.primary, lightAccentTones),
      hexFromArgb(material.palettes.primary.tone(lightTone)),
      hexFromArgb(material.schemes.light.error),
      hexFromArgb(material.schemes.light.onError),
    ),
    dark: createSemanticColors(
      true,
      createAccentScale(material.palettes.primary, darkAccentTones),
      hexFromArgb(material.schemes.dark.primary),
      hexFromArgb(material.schemes.dark.error),
      hexFromArgb(material.schemes.dark.onError),
    ),
  };
}
