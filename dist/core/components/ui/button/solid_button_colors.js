import { mixInteractionColor } from "../utils/color/interaction_colors";
export function getSolidButtonInteractionColor(colors, variant, state) {
    if (state.disabled || (!state.pressed && !state.hovered))
        return undefined;
    const amount = state.pressed ? 0.12 : 0.06;
    if (variant == null || variant === "default") {
        return mixInteractionColor(colors.primary, amount);
    }
    if (variant === "destructive") {
        return mixInteractionColor(colors.destructive, amount);
    }
    return undefined;
}
