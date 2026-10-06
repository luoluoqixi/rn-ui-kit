import { jsx as _jsx } from "react/jsx-runtime";
import { Host, Slider as ExpoSlider } from "@luoluoqixi/expo-ui-55/swift-ui";
import { tint } from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { supportsImpactHaptics, toSwiftUIHexColor, triggerSliderNativeHaptics, useResolvedNativeHaptics, useUiTheme, } from "../utils";
import { resolveSliderFirstValue } from "./types";
export function NativeSlider({ defaultValue, max, min, nativeHaptics, onChange, onChangeFinished, onValueChange, onValueChangeFinished, step: stepProp, style, value, }) {
    const theme = useUiTheme();
    const safeMin = min ?? 0;
    const safeMax = max ?? 100;
    const safeStep = stepProp === 0
        ? undefined
        : typeof stepProp === "number" && Number.isFinite(stepProp) && stepProp > 0
            ? stepProp
            : 1;
    const currentValue = resolveSliderFirstValue(value ?? defaultValue, safeMin);
    const trackTintColor = toSwiftUIHexColor(theme.primary);
    // 触感反馈：iOS 原生 Slider 在边界位置可能已有系统反馈，因此边界值不重复触发。
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    const hasNativeSystemEdgeHaptics = supportsImpactHaptics();
    const lastHapticsValueRef = useRef(currentValue);
    const latestValueRef = useRef(currentValue);
    useEffect(() => {
        lastHapticsValueRef.current = currentValue;
        latestValueRef.current = currentValue;
    }, [currentValue]);
    const handleValueChange = (nextValue) => {
        const stepped = safeStep == null
            ? Math.min(safeMax, Math.max(safeMin, nextValue))
            : Math.min(safeMax, Math.max(safeMin, Math.round((nextValue - safeMin) / safeStep) * safeStep + safeMin));
        latestValueRef.current = stepped;
        onChange?.(stepped);
        onValueChange?.([stepped]);
        if (stepped === lastHapticsValueRef.current)
            return;
        lastHapticsValueRef.current = stepped;
        if (hasNativeSystemEdgeHaptics && (stepped === safeMin || stepped === safeMax))
            return;
        triggerSliderNativeHaptics(resolvedNativeHaptics);
    };
    return (_jsx(View, { style: [{ height: 48, width: "100%" }, style], children: _jsx(Host
        // 嵌套 TrueSheet 中，SwiftUI Host 会把当前可见 safe area 当作宿主约束，
        // 导致原生 Slider 在滚到视口上/下边缘时出现反向“自动避让”偏移。
        // 对这类固定高度控件直接忽略 safe area，可避免其跟随 sheet 可见区域漂移。
        //
        // 已知问题：
        // iOS 26 的系统原生 Slider 在启用 step 后，拖拽到起点/终点时会持续触发控件自带 haptics。
        // https://www.reddit.com/r/SwiftUI/comments/1tru5h4/swiftui_slider_spams_sensory_feedback/
        , { 
            // 嵌套 TrueSheet 中，SwiftUI Host 会把当前可见 safe area 当作宿主约束，
            // 导致原生 Slider 在滚到视口上/下边缘时出现反向“自动避让”偏移。
            // 对这类固定高度控件直接忽略 safe area，可避免其跟随 sheet 可见区域漂移。
            //
            // 已知问题：
            // iOS 26 的系统原生 Slider 在启用 step 后，拖拽到起点/终点时会持续触发控件自带 haptics。
            // https://www.reddit.com/r/SwiftUI/comments/1tru5h4/swiftui_slider_spams_sensory_feedback/
            ignoreSafeArea: "all", style: { flex: 1, width: "100%" }, children: _jsx(ExpoSlider, { max: safeMax, min: safeMin, modifiers: trackTintColor == null ? undefined : [tint(trackTintColor)], onEditingChanged: (isEditing) => {
                    if (!isEditing) {
                        onChangeFinished?.(latestValueRef.current);
                        onValueChangeFinished?.([latestValueRef.current]);
                    }
                }, onValueChange: handleValueChange, step: safeStep, value: currentValue }) }) }));
}
