export type AccentThemeName = string;
export type AccentThemeNames = readonly AccentThemeName[];

export const defaultAccentThemeName: AccentThemeName = "ocean";

export function resolveAccentThemeName(
  value: unknown,
  fallback: AccentThemeName = defaultAccentThemeName,
): AccentThemeName {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}
