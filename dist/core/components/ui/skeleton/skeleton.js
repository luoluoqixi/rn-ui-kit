import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../utils/cn";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, } from "react-native-reanimated";
import * as React from "react";
const duration = 1000;
function Skeleton({ className, ...props }) {
    const sv = useSharedValue(1);
    React.useEffect(() => {
        sv.value = withRepeat(withTiming(0.5, { duration }), -1, true);
    }, []);
    const style = useAnimatedStyle(() => ({
        opacity: sv.value,
    }), [sv]);
    return (_jsx(Animated.View, { style: style, className: cn("bg-secondary dark:bg-muted rounded-md", className), ...props }));
}
export { Skeleton };
