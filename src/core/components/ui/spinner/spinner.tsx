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

import { isWeb } from "../utils/platform";
import { useUiTheme } from "../utils/theme";
import type { SpinnerProps } from "./types";

const spinnerSizes = {
  default: 20,
  "2xs": 12,
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  "2xl": 36,
} as const;

export function Spinner(props: SpinnerProps) {
  return isWeb() ? <WebSpinner {...props} /> : <NativeSpinner {...props} />;
}

function WebSpinner({
  animating = true,
  color,
  hidesWhenStopped = true,
  size = "default",
  style,
  ...props
}: SpinnerProps) {
  const theme = useUiTheme();
  const iconSize = typeof size === "number" ? size : spinnerSizes[size];

  if (!animating && hidesWhenStopped) return null;

  return (
    <View {...(props as ComponentProps<typeof View>)} style={style}>
      {/* Web 旋转交给浏览器；仅旋转图标，避免外层被布局拉伸后偏离中心。 */}
      <View
        className={animating ? "animate-spin will-change-transform" : undefined}
        style={{ width: iconSize, height: iconSize }}
      >
        <Loader2 color={color == null ? theme.primary : String(color)} size={iconSize} />
      </View>
    </View>
  );
}

function NativeSpinner({
  animating = true,
  color,
  hidesWhenStopped = true,
  size = "default",
  style,
  ...props
}: SpinnerProps) {
  const theme = useUiTheme();
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));
  const iconSize = typeof size === "number" ? size : spinnerSizes[size];

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
    <Animated.View {...(props as ComponentProps<typeof View>)} style={[style, animatedStyle]}>
      <Loader2 color={color == null ? theme.primary : String(color)} size={iconSize} />
    </Animated.View>
  );
}
