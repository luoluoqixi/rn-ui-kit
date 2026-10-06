import { jsx as _jsx } from "react/jsx-runtime";
import { Loader2 } from "lucide-react-native";
import { useEffect } from "react";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming, } from "react-native-reanimated";
import { useUiTheme } from "../utils/theme";
const spinnerSizes = {
    default: 20,
    "2xs": 12,
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    "2xl": 36,
};
export function Spinner({ animating = true, color, hidesWhenStopped = true, size = "default", style, ...props }) {
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
        rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);
        return () => cancelAnimation(rotation);
    }, [animating, rotation]);
    if (!animating && hidesWhenStopped)
        return null;
    return (_jsx(Animated.View, { ...props, style: [style, animatedStyle], children: _jsx(Loader2, { color: color == null ? theme.primary : String(color), size: iconSize }) }));
}
