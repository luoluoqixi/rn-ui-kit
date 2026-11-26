import type { SemanticColors } from "./ui_theme";

/** Override HeroUI's source tokens, never its derived --color-* utilities. */
export function semanticColorsToVariables(colors: SemanticColors): Record<string, string> {
  return Object.fromEntries(
    Object.entries(colors).map(([name, value]) => [
      "--" + name.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase()),
      value,
    ]),
  );
}
