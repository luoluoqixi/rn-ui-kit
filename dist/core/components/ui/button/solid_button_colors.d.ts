import type { SemanticColors } from "../utils/theme/ui_theme";
type SolidButtonColors = Pick<SemanticColors, "primary" | "destructive">;
export declare function getSolidButtonInteractionColor(colors: SolidButtonColors, variant: string | null | undefined, state: {
    disabled?: boolean;
    hovered: boolean;
    pressed: boolean;
}): string | undefined;
export {};
