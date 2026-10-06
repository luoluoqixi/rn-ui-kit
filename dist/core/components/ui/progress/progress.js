import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../utils/cn";
import * as ProgressPrimitive from "@rn-primitives/progress";
import { Platform, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useDerivedValue, withSpring, } from "react-native-reanimated";
function Progress({ className, value, indicatorClassName, ...props }) {
    return (_jsx(ProgressPrimitive.Root, { className: cn("bg-muted relative h-2 w-full overflow-hidden rounded-full", className), ...props, children: _jsx(Indicator, { value: value, className: indicatorClassName }) }));
}
export { Progress };
const Indicator = Platform.select({
    web: WebIndicator,
    native: NativeIndicator,
    default: NullIndicator,
});
function WebIndicator({ value, className }) {
    if (Platform.OS !== "web") {
        return null;
    }
    return (_jsx(View, { className: cn("bg-primary h-full w-full flex-1 transition-all", className), style: { transform: `translateX(-${100 - (value ?? 0)}%)` }, children: _jsx(ProgressPrimitive.Indicator, { className: cn("h-full w-full", className) }) }));
}
function NativeIndicator({ value, className }) {
    const progress = useDerivedValue(() => value ?? 0);
    const indicator = useAnimatedStyle(() => {
        return {
            width: withSpring(`${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`, { overshootClamping: true }),
        };
    }, [value]);
    if (Platform.OS === "web") {
        return null;
    }
    return (_jsx(ProgressPrimitive.Indicator, { asChild: true, children: _jsx(Animated.View, { style: indicator, className: cn("bg-primary h-full", className) }) }));
}
function NullIndicator(_props) {
    return null;
}
