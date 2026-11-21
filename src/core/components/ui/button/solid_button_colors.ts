import { mixInteractionColor } from "../utils/color/interaction_colors";
import type { SemanticColors } from "../utils/theme/ui_theme";

type SolidButtonColors = Pick<SemanticColors,
  "accent" | "danger"
>;

export function getSolidButtonInteractionColor(
  colors: SolidButtonColors,
  variant: string | null | undefined,
  state: { disabled?: boolean; hovered: boolean; pressed: boolean },
): string | undefined {
  if (state.disabled || (!state.pressed && !state.hovered)) return undefined;
  const amount = state.pressed ? 0.12 : 0.06;
  if (variant == null || variant === "default") {
    return mixInteractionColor(colors.accent, amount);
  }
  if (variant === "destructive") {
    return mixInteractionColor(colors.danger, amount);
  }
  return undefined;
}
