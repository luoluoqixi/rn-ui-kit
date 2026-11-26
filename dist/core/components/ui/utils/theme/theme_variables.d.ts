import type { SemanticColors } from "./ui_theme";
/** Override HeroUI's source tokens, never its derived --color-* utilities. */
export declare function semanticColorsToVariables(colors: SemanticColors): Record<string, string>;
