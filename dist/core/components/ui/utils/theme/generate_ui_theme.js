import { argbFromHex, hexFromArgb, Hct, themeFromSourceColor, } from "@material/material-color-utilities";
const HEX_COLOR = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;
function color(scheme, role) {
    return hexFromArgb(scheme[role]);
}
function createSemanticColors(scheme, primaryBackground, card, popover, primaryOverride, primaryForegroundOverride) {
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
        primary: primaryOverride ?? color(scheme, "primary"),
        primaryForeground: primaryForegroundOverride ?? color(scheme, "onPrimary"),
        ring: primaryOverride ?? color(scheme, "primary"),
        secondary: color(scheme, "secondaryContainer"),
        secondaryForeground: color(scheme, "onSecondaryContainer"),
    };
}
/** Generates the complete light/dark semantic theme from an opaque hex seed color. */
export function generateUiThemeFromPrimaryColor(primaryColor) {
    const normalized = typeof primaryColor === "string" ? primaryColor.trim() : "";
    if (!HEX_COLOR.test(normalized)) {
        throw new TypeError(`primaryColor must be an opaque hex color in #RGB or #RRGGBB format, received ${String(primaryColor)}`);
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
        light: createSemanticColors(materialTheme.schemes.light, lightPrimaryBackground, lightCard, lightPopover, lightPrimary, lightPrimaryForeground),
        dark: createSemanticColors(materialTheme.schemes.dark, darkPrimaryBackground, darkCard, darkPopover),
    };
}
