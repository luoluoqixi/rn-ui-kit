import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
/** Preserve the existing rotating custom loadingIcon API. Default loading uses HeroUI Spinner. */
export function ButtonLoadingIcon({ children }) {
    const rotation = useSharedValue(0);
    const style = useAnimatedStyle(() => ({ transform: [{ rotateZ: rotation.value + "deg" }] }));
    useEffect(() => {
        rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);
        return () => { cancelAnimation(rotation); rotation.value = 0; };
    }, [rotation]);
    return _jsx(Animated.View, { pointerEvents: "none", style: style, children: children });
}
