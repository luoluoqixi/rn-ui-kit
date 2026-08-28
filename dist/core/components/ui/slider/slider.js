import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GestureDetector } from "react-native-gesture-handler";
import { Platform, StyleSheet, View } from "react-native";
import { useRef } from "react";
import { useUiTheme } from "../utils";
import { isWeb } from "../utils/platform";
import { NativeSlider } from "./native_slider";
import { useSliderBehavior } from "./slider/slider";
function resolveColor(color, fallback) {
    return color == null ? fallback : String(color);
}
function NonNativeSlider({ activeTrackStyle, className, colors, defaultValue, disabled = false, hitSlop, max, min, nativeHaptics, nativeHapticsInterval, onChange, onChangeFinished, onLayout, onValueChange, onValueChangeFinished, step, style, thumbCount, thumbStyle, trackStyle, value, ...props }) {
    const sliderRef = useRef(null);
    const theme = useUiTheme();
    const { handleLayout, nativeGesture, values } = useSliderBehavior({
        defaultValue,
        disabled,
        max,
        min,
        nativeHaptics,
        nativeHapticsInterval,
        onChange,
        onChangeFinished,
        onLayout,
        onValueChange,
        onValueChangeFinished,
        step,
        sliderRef,
        thumbCount,
        value,
    });
    const resolvedMin = min ?? 0;
    const resolvedMax = max ?? 100;
    const range = resolvedMax - resolvedMin;
    const activeTrackColor = resolveColor(colors?.activeTrackColor, theme.primary);
    const inactiveTrackColor = resolveColor(colors?.inactiveTrackColor, theme.muted);
    const thumbColor = resolveColor(colors?.thumbColor, theme.primary);
    const percentages = values.map((item) => range <= 0
        ? 0
        : ((Math.min(Math.max(item, resolvedMin), resolvedMax) - resolvedMin) / range) * 100);
    const activeTrackStart = percentages.length > 1 ? percentages[0] ?? 0 : 0;
    const activeTrackEnd = percentages[percentages.length - 1] ?? 0;
    const sliderView = (_jsxs(View, { ...props, className: className, hitSlop: hitSlop ?? (isWeb() ? undefined : { bottom: 24, top: 12 }), onLayout: handleLayout, ref: sliderRef, style: [
            styles.root,
            isWeb() && { userSelect: "none" },
            isWeb() && { touchAction: "none" },
            disabled && styles.disabled,
            style,
        ], children: [_jsx(View, { style: [styles.track, { backgroundColor: inactiveTrackColor }, trackStyle], children: _jsx(View, { style: [
                        styles.activeTrack,
                        {
                            backgroundColor: activeTrackColor,
                            left: `${activeTrackStart}%`,
                            width: `${Math.max(0, activeTrackEnd - activeTrackStart)}%`,
                        },
                        activeTrackStyle,
                    ] }) }), values.map((_item, index) => {
                const percent = percentages[index] ?? 0;
                return (_jsx(View, { pointerEvents: "none", style: [
                        styles.thumb,
                        { backgroundColor: thumbColor, borderColor: theme.background, left: `${percent}%` },
                        thumbStyle,
                    ] }, `thumb-${index}`));
            })] }));
    return nativeGesture ? (_jsx(GestureDetector, { gesture: nativeGesture, children: sliderView })) : (sliderView);
}
export function Slider({ native = true, ...props }) {
    // Web has no native Expo slider host; always use the pointer/gesture implementation there.
    if (!native || Platform.OS === "web")
        return _jsx(NonNativeSlider, { ...props });
    return _jsx(NativeSlider, { ...props });
}
const styles = StyleSheet.create({
    activeTrack: { borderRadius: 3, height: "100%", position: "absolute" },
    disabled: { opacity: 0.5 },
    root: { height: 28, justifyContent: "center", minWidth: 100, width: "100%" },
    thumb: {
        borderRadius: 12,
        borderWidth: 2,
        height: 24,
        marginLeft: -12,
        position: "absolute",
        width: 24,
    },
    track: { borderRadius: 3, height: 6, overflow: "hidden", width: "100%" },
});
