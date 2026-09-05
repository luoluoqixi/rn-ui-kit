import { generatedAccentThemes } from "./default_accent_themes";
import { generateUiThemeFromPrimaryColor } from "./generate_ui_theme";
export const defaultAccentThemeName = "ocean";
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
];
export const accentThemeSeeds = {
    aqua: "#0891b2",
    forest: "#059669",
    golden: "#ca8a04",
    lavender: "#7c3aed",
    mono: "#52525b",
    ocean: "#2563eb",
    ruby: "#e11d48",
    sakura: "#db2777",
    sunset: "#d97706",
};
export function resolveGeneratedAccentTheme(accentThemeName) {
    const normalized = typeof accentThemeName === "string" ? accentThemeName.trim() : "";
    if (CUSTOM_ACCENT_COLOR.test(normalized)) {
        const cacheKey = normalized.toLowerCase();
        const cached = generatedCustomAccentThemes.get(cacheKey);
        if (cached != null)
            return cached;
        const generated = generateUiThemeFromPrimaryColor(normalized);
        generatedCustomAccentThemes.set(cacheKey, generated);
        return generated;
    }
    const name = Object.hasOwn(accentThemeSeeds, accentThemeName) ? accentThemeName : "ocean";
    return generatedAccentThemes[name];
}
export const accentThemeSwatchColors = Object.fromEntries(Object.entries(accentThemeSeeds).map(([name, seed]) => [name, seed]));
const generatedCustomAccentThemes = new Map();
const CUSTOM_ACCENT_COLOR = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;
export function resolveAccentThemeName(value, fallback = defaultAccentThemeName) {
    return typeof value === "string" && value.length > 0 ? value : fallback;
}
