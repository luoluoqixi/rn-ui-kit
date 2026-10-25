import * as React from "react";
import type { PressableProps } from "react-native";
import { getSolidButtonInteractionColor } from "./solid_button_colors";

export function useSolidButtonInteraction({
  colors,
  variant,
  disabled,
  onHoverIn,
  onHoverOut,
}: {
  colors: Parameters<typeof getSolidButtonInteractionColor>[0];
  variant?: string | null;
  disabled?: boolean;
  onHoverIn?: PressableProps["onHoverIn"];
  onHoverOut?: PressableProps["onHoverOut"];
}) {
  const [hovered, setHovered] = React.useState(false);
  return {
    onHoverIn: ((event) => {
      setHovered(true);
      onHoverIn?.(event);
    }) as NonNullable<PressableProps["onHoverIn"]>,
    onHoverOut: ((event) => {
      setHovered(false);
      onHoverOut?.(event);
    }) as NonNullable<PressableProps["onHoverOut"]>,
    backgroundStyle: (pressed: boolean) => {
      const backgroundColor = getSolidButtonInteractionColor(colors, variant, { disabled, hovered, pressed });
      // Native 会用显式 undefined 清除前面的背景；无交互色时不参与样式覆盖。
      return backgroundColor == null ? null : { backgroundColor };
    },
  };
}
