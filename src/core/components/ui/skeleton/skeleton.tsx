import { cn } from "../utils/cn";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import * as React from "react";
import { SkeletonProps } from "./types";

const duration = 1000;

function Skeleton({ className, ...props }: SkeletonProps) {
  const sv = useSharedValue(1);

  React.useEffect(() => {
    sv.value = withRepeat(withTiming(0.5, { duration }), -1, true);
  }, []);

  const style = useAnimatedStyle(
    () => ({
      opacity: sv.value,
    }),
    [sv],
  );
  return (
    <Animated.View
      style={style}
      className={cn("bg-secondary dark:bg-muted rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
