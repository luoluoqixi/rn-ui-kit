import { argbFromHex, hexFromArgb, Hct, themeFromSourceColor, } from "@material/material-color-utilities";
const HEX_COLOR = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;
const lightAccentTones = [99, 97, 95, 90, 85, 80, 70, 60, 50, 40, 30, 20];
const darkAccentTones = [6, 10, 20, 30, 35, 40, 50, 60, 70, 80, 90, 95];
function createAccentScale(palette, tones) {
    return Object.fromEntries(tones.map((tone, index) => [
        "accent" + String(index + 1).padStart(2, "0"),
        hexFromArgb(palette.tone(tone)),
    ]));
}
// Choose the more readable foreground rather than using an HCT tone threshold.
// Saturated mid-tone seeds can otherwise produce white-on-bright accent text.
function accentForeground(accent) {
    const channels = [1, 3, 5].map(offset => {
        const value = Number.parseInt(accent.slice(offset, offset + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? "#000000" : "#ffffff";
}
function createSemanticColors(dark, scale, accent, danger, dangerForeground) {
    // Shared Web / Native neutral palette follows heroui-native 1.1.1 variables.css,
    // converted from OKLCH to sRGB hex for the system-native color bridges.
    // Neutral containers intentionally do not change when the accent seed changes.
    // Application screen/Sheet backgrounds belong to appBackgroundColors instead.
    const foreground = dark ? "#fcfcfc" : "#18181b";
    const surface = dark ? "#18181b" : "#ffffff";
    const surfaceSecondary = dark ? "#232325" : "#efeff0";
    // Native's default light muted is too light for 4.5:1 on secondary surfaces.
    const muted = dark ? "#9f9fa9" : "#62626c";
    const border = dark ? "#28282c" : "#dedee0";
    return {
        ...scale,
        background: dark ? "#060607" : "#f5f5f5",
        foreground,
        surface,
        surfaceForeground: foreground,
        surfaceSecondary,
        surfaceSecondaryForeground: foreground,
        surfaceTertiary: dark ? "#262728" : "#eaeaeb",
        surfaceTertiaryForeground: foreground,
        overlay: surface,
        overlayForeground: foreground,
        backdrop: dark ? "#00000099" : "#00000066",
        muted,
        accent,
        accentForeground: accentForeground(accent),
        default: dark ? "#27272a" : "#ebebec",
        defaultForeground: foreground,
        success: dark ? "#86efac" : "#15803d",
        successForeground: dark ? "#000000" : "#ffffff",
        warning: dark ? "#fcd34d" : "#facc15",
        warningForeground: "#000000",
        danger,
        dangerForeground,
        fieldBackground: surface,
        fieldForeground: foreground,
        fieldPlaceholder: muted,
        fieldBorder: border,
        segment: dark ? "#46464c" : "#ffffff",
        segmentForeground: foreground,
        border,
        separator: dark ? "#47474b" : "#aaaaad",
        focus: accent,
        link: foreground,
    };
}
/** Generates HeroUI semantic colors and a concrete accent scale from an opaque hex seed. */
export function generateUiThemeFromPrimaryColor(primaryColor) {
    const normalized = typeof primaryColor === "string" ? primaryColor.trim() : "";
    if (!HEX_COLOR.test(normalized)) {
        throw new TypeError("primaryColor must be an opaque hex color in #RGB or #RRGGBB format, received " + String(primaryColor));
    }
    const sourceColor = argbFromHex(normalized);
    const material = themeFromSourceColor(sourceColor);
    // Keep bright user-selected accents close to the original swatch.
    const lightTone = Math.min(90, Math.max(40, Hct.fromInt(sourceColor).tone));
    return {
        light: createSemanticColors(false, createAccentScale(material.palettes.primary, lightAccentTones), hexFromArgb(material.palettes.primary.tone(lightTone)), hexFromArgb(material.schemes.light.error), hexFromArgb(material.schemes.light.onError)),
        dark: createSemanticColors(true, createAccentScale(material.palettes.primary, darkAccentTones), hexFromArgb(material.schemes.dark.primary), hexFromArgb(material.schemes.dark.error), hexFromArgb(material.schemes.dark.onError)),
    };
}
