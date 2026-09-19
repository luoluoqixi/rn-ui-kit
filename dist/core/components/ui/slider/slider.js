import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GestureDetector } from "react-native-gesture-handler";
import { Platform, Pressable, StyleSheet, View, } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUiColorScheme, useUiTheme } from "../utils";
import { isWeb } from "../utils/platform";
import { NativeSlider } from "./native_slider";
import { useSliderBehavior } from "./slider/slider";
const sliderVisualSizes = {
    "default": { root: 32, track: 6, thumb: 24 },
    "2xs": { root: 20, track: 4, thumb: 16 },
    "xs": { root: 24, track: 4, thumb: 18 },
    "sm": { root: 28, track: 5, thumb: 20 },
    "md": { root: 32, track: 6, thumb: 24 },
    "lg": { root: 36, track: 7, thumb: 28 },
    "xl": { root: 42, track: 8, thumb: 32 },
    "2xl": { root: 48, track: 10, thumb: 36 },
};
function resolveColor(color, fallback) {
    return color == null ? fallback : String(color);
}
function brightenColor(color, amount = 0.18) {
    const hex = color.trim().replace(/^#/, "");
    const normalized = hex.length === 3
        ? hex
            .split("")
            .map((part) => part + part)
            .join("")
        : hex;
    if (!/^[0-9a-f]{6}$/i.test(normalized))
        return color;
    const channels = [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
    const brightened = channels.map((channel) => Math.round(channel + (255 - channel) * amount));
    return `rgb(${brightened.join(", ")})`;
}
function withAlpha(color, alpha) {
    const hex = color.trim().replace(/^#/, "");
    const normalized = hex.length === 3
        ? hex
            .split("")
            .map((part) => part + part)
            .join("")
        : hex;
    if (!/^[0-9a-f]{6}$/i.test(normalized))
        return color;
    const channels = [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
    return `rgba(${channels.join(", ")}, ${alpha})`;
}
function NonNativeSlider({ activeTrackStyle, className, colors, defaultValue, disabled = false, hitSlop, max, min, nativeHaptics, nativeHapticsInterval, onChange, onChangeFinished, onLayout, onValueChange, onValueChangeFinished, orientation = "horizontal", step, size = "default", style, thumbCount, thumbStyle, trackStyle, value, ...props }) {
    const visualSize = sliderVisualSizes[size];
    const sliderRef = useRef(null);
    const trackLengthRef = useRef(0);
    const hasCursorOverride = className?.split(/\s+/).some((token) => token.startsWith("cursor-"));
    const [hoveredThumbIndex, setHoveredThumbIndex] = useState(null);
    const [pressedThumbIndex, setPressedThumbIndex] = useState(null);
    const handleActiveThumbChange = useCallback((index) => {
        setPressedThumbIndex(index);
    }, []);
    const theme = useUiTheme();
    const colorScheme = useUiColorScheme();
    const { handleLayout, nativeGesture, values } = useSliderBehavior({
        defaultValue,
        disabled,
        max,
        min,
        nativeHaptics,
        nativeHapticsInterval,
        onChange,
        onChangeFinished,
        onActiveThumbChange: handleActiveThumbChange,
        onLayout,
        onValueChange,
        onValueChangeFinished,
        orientation,
        trackInset: 0,
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
    const activeThumbBorderColor = colorScheme === "dark" ? theme.foreground : brightenColor(thumbColor, 0.3);
    const defaultThumbBorderColor = withAlpha(theme.foreground, colorScheme === "dark" ? 0.18 : 0.04);
    const activeThumbIndex = pressedThumbIndex ?? hoveredThumbIndex;
    const percentages = values.map((item) => range <= 0
        ? 0
        : ((Math.min(Math.max(item, resolvedMin), resolvedMax) - resolvedMin) / range) * 100);
    const activeTrackStart = percentages.length > 1 ? (percentages[0] ?? 0) : 0;
    const activeTrackEnd = percentages[percentages.length - 1] ?? 0;
    const percentagesRef = useRef(percentages);
    percentagesRef.current = percentages;
    const resolveThumbIndex = useCallback((location) => {
        const currentPercentages = percentagesRef.current;
        if (location == null || trackLengthRef.current <= 0 || currentPercentages.length <= 1)
            return 0;
        const percent = (location / trackLengthRef.current) * 100;
        return currentPercentages.reduce((closestIndex, item, index) => Math.abs(item - percent) < Math.abs(currentPercentages[closestIndex] - percent)
            ? index
            : closestIndex, 0);
    }, []);
    useEffect(() => {
        if (!isWeb() || disabled || sliderRef.current == null)
            return;
        const node = sliderRef.current;
        const handlePointerMove = (event) => {
            const rect = node.getBoundingClientRect();
            const length = orientation === "horizontal" ? rect.width : rect.height;
            if (length <= 0)
                return;
            trackLengthRef.current = length;
            const position = orientation === "horizontal" ? event.clientX - rect.left : rect.bottom - event.clientY;
            setHoveredThumbIndex(resolveThumbIndex(position));
        };
        const handlePointerLeave = () => setHoveredThumbIndex(null);
        node.addEventListener("pointermove", handlePointerMove);
        node.addEventListener("pointerleave", handlePointerLeave);
        return () => {
            node.removeEventListener("pointermove", handlePointerMove);
            node.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, [disabled, orientation, resolveThumbIndex]);
    const sliderView = (_jsx(Pressable, { ...props, className: className, hitSlop: hitSlop ?? {
            bottom: visualSize.thumb / 2,
            left: visualSize.thumb / 2,
            right: visualSize.thumb / 2,
            top: visualSize.thumb / 2,
        }, onHoverOut: () => {
            setHoveredThumbIndex(null);
        }, onLayout: (event) => {
            const length = orientation === "horizontal"
                ? event.nativeEvent.layout.width
                : event.nativeEvent.layout.height;
            trackLengthRef.current = length;
            handleLayout(event);
        }, ref: sliderRef, style: [
            styles.root,
            orientation === "horizontal"
                ? { height: visualSize.root, minWidth: 100, width: "100%" }
                : {
                    alignItems: "center",
                    height: 200,
                    minHeight: 100,
                    minWidth: visualSize.root,
                    width: visualSize.root,
                },
            isWeb() && { userSelect: "none" },
            isWeb() && { touchAction: "none" },
            isWeb() && !hasCursorOverride && { cursor: "default" },
            disabled && styles.disabled,
            style,
        ], children: _jsxs(View, { style: [
                styles.trackFrame,
                orientation === "horizontal"
                    ? {
                        height: visualSize.track,
                        left: 0,
                        marginTop: -visualSize.track / 2,
                        right: 0,
                        top: "50%",
                    }
                    : {
                        bottom: 0,
                        left: "50%",
                        marginLeft: -visualSize.track / 2,
                        top: 0,
                        width: visualSize.track,
                    },
            ], children: [_jsx(View, { style: [
                        styles.track,
                        orientation === "horizontal"
                            ? { borderRadius: visualSize.track / 2, height: visualSize.track, width: "100%" }
                            : { borderRadius: visualSize.track / 2, height: "100%", width: "100%" },
                        { backgroundColor: inactiveTrackColor },
                        trackStyle,
                    ], children: _jsx(View, { style: [
                            styles.activeTrack,
                            {
                                backgroundColor: activeTrackColor,
                                borderRadius: visualSize.track / 2,
                                ...(orientation === "horizontal"
                                    ? {
                                        left: `${activeTrackStart}%`,
                                        width: `${Math.max(0, activeTrackEnd - activeTrackStart)}%`,
                                    }
                                    : {
                                        bottom: `${activeTrackStart}%`,
                                        height: `${Math.max(0, activeTrackEnd - activeTrackStart)}%`,
                                        width: "100%",
                                    }),
                            },
                            activeTrackStyle,
                        ] }) }), values.map((_item, index) => {
                    const percent = percentages[index] ?? 0;
                    return (_jsx(View, { pointerEvents: "auto", style: [
                            styles.thumb,
                            {
                                backgroundColor: activeThumbIndex === index ? brightenColor(thumbColor) : thumbColor,
                                borderColor: activeThumbIndex === index ? activeThumbBorderColor : defaultThumbBorderColor,
                                borderRadius: visualSize.thumb / 2,
                                ...(orientation === "horizontal"
                                    ? {
                                        left: `${percent}%`,
                                        marginLeft: -visualSize.thumb / 2,
                                        marginTop: -visualSize.thumb / 2,
                                        top: "50%",
                                    }
                                    : {
                                        bottom: `${percent}%`,
                                        left: "50%",
                                        marginBottom: -visualSize.thumb / 2,
                                        marginLeft: -visualSize.thumb / 2,
                                    }),
                                height: visualSize.thumb,
                                width: visualSize.thumb,
                            },
                            thumbStyle,
                        ] }, `thumb-${index}`));
                })] }) }));
    return nativeGesture ? (_jsx(GestureDetector, { gesture: nativeGesture, children: sliderView })) : (sliderView);
}
export function Slider({ native = true, orientation = "horizontal", ...props }) {
    // Web has no native Expo slider host; always use the pointer/gesture implementation there.
    if (!native || Platform.OS === "web" || orientation === "vertical") {
        return _jsx(NonNativeSlider, { ...props, orientation: orientation });
    }
    return _jsx(NativeSlider, { ...props, orientation: orientation });
}
const styles = StyleSheet.create({
    activeTrack: { borderRadius: 3, height: "100%", position: "absolute" },
    disabled: { opacity: 0.5 },
    root: { height: 28, justifyContent: "center", minWidth: 100, width: "100%" },
    trackFrame: { position: "absolute" },
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
