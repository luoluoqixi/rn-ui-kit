import { useEffect, type ReactNode } from "react";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

/** Preserve the existing rotating custom loadingIcon API. Default loading uses HeroUI Spinner. */
export function ButtonLoadingIcon({ children }: { children: ReactNode }) {
  const rotation = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ rotateZ: rotation.value + "deg" }] }));
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);
    return () => { cancelAnimation(rotation); rotation.value = 0; };
  }, [rotation]);
  return <Animated.View pointerEvents="none" style={style}>{children}</Animated.View>;
}
