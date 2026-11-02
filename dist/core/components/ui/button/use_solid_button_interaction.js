import * as React from "react";
import { getSolidButtonInteractionColor } from "./solid_button_colors";
export function useSolidButtonInteraction({ colors, variant, disabled, onHoverIn, onHoverOut, }) {
    const [hovered, setHovered] = React.useState(false);
    return {
        onHoverIn: ((event) => {
            setHovered(true);
            onHoverIn?.(event);
        }),
        onHoverOut: ((event) => {
            setHovered(false);
            onHoverOut?.(event);
        }),
        backgroundStyle: (pressed) => {
            const backgroundColor = getSolidButtonInteractionColor(colors, variant, { disabled, hovered, pressed });
            // Native 会用显式 undefined 清除前面的背景；无交互色时不参与样式覆盖。
            return backgroundColor == null ? null : { backgroundColor };
        },
    };
}
