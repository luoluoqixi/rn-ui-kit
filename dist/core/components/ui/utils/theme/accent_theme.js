export const defaultAccentThemeName = "ocean";
export function resolveAccentThemeName(value, fallback = defaultAccentThemeName) {
    return typeof value === "string" && value.length > 0 ? value : fallback;
}
