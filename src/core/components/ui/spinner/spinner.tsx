import { Loader2 } from "lucide-react-native";
import { type ComponentProps, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useUiTheme } from "../utils/theme";
import type { SpinnerProps } from "./types";

export function Spinner({
  animating = true,
  color,
  hidesWhenStopped = true,
  size = "small",
  style,
  ...props
}: SpinnerProps) {
  const theme = useUiTheme();
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));
  const iconSize = typeof size === "number" ? size : size === "large" ? 36 : 20;

  useEffect(() => {
    if (!animating) {
      cancelAnimation(rotation);
      return;
    }

    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
    );

    return () => cancelAnimation(rotation);
  }, [animating, rotation]);

  if (!animating && hidesWhenStopped) return null;

  return (
    <Animated.View
      {...(props as ComponentProps<typeof View>)}
      style={[style, animatedStyle]}
    >
      <Loader2 color={color == null ? theme.primary : String(color)} size={iconSize} />
    </Animated.View>
  );
}
