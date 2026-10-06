import { jsx as _jsx } from "react/jsx-runtime";
import { Host, Slider as ExpoSlider } from "@luoluoqixi/expo-ui-55/jetpack-compose";
import { useEffect, useRef } from "react";
import { getSliderHapticsBuckets, toARGB, triggerSliderNativeHaptics, useResolvedNativeHaptics, useUiTheme, } from "../utils";
import { resolveSliderFirstValue } from "./types";
export function NativeSlider({ colors: colorsProp, defaultValue, max, min, nativeHaptics, nativeHapticsInterval, onChange, onChangeFinished, onValueChange, onValueChangeFinished, step: stepProp, style, value, }) {
    const theme = useUiTheme();
    const safeMin = min ?? 0;
    const safeMax = max ?? 100;
    const safeStep = stepProp === 0
        ? undefined
        : typeof stepProp === "number" && Number.isFinite(stepProp) && stepProp > 0
            ? stepProp
            : 1;
    const currentValue = resolveSliderFirstValue(value ?? defaultValue, safeMin);
    // 无用户颜色时从 UI 主题读取默认色，所有值转换为 Android ARGB 整数。
    const resolvedColors = {
        activeTickColor: toARGB(colorsProp?.activeTickColor ?? theme.primary),
        activeTrackColor: toARGB(colorsProp?.activeTrackColor ?? theme.primary),
        inactiveTickColor: toARGB(colorsProp?.inactiveTickColor ?? theme.mutedForeground),
        inactiveTrackColor: toARGB(colorsProp?.inactiveTrackColor ?? theme.muted),
        thumbColor: toARGB(colorsProp?.thumbColor ?? theme.primary),
    };
    // 触感反馈按 interval / step 计算 bucket，仅在跨 bucket 时触发，避免拖动过程中连续震动。
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    const lastHapticsBucketsRef = useRef(getSliderHapticsBuckets([currentValue], {
        interval: nativeHapticsInterval,
        max: safeMax,
        min: safeMin,
        step: safeStep,
    }));
    const latestValueRef = useRef(currentValue);
    useEffect(() => {
        if (value == null)
            return;
        const nextValue = resolveSliderFirstValue(value, safeMin);
        latestValueRef.current = nextValue;
        lastHapticsBucketsRef.current = getSliderHapticsBuckets([nextValue], {
            interval: nativeHapticsInterval,
            max: safeMax,
            min: safeMin,
            step: safeStep,
        });
    }, [nativeHapticsInterval, safeMax, safeMin, safeStep, value]);
    const resolvedSteps = safeStep == null ? 0 : Math.max(0, Math.round((safeMax - safeMin) / safeStep) - 1);
    const handleValueChange = (nextValue) => {
        const stepped = safeStep == null
            ? nextValue
            : Math.round((nextValue - safeMin) / safeStep) * safeStep + safeMin;
        latestValueRef.current = stepped;
        onChange?.(stepped);
        onValueChange?.([stepped]);
        const nextBuckets = getSliderHapticsBuckets([stepped], {
            interval: nativeHapticsInterval,
            max: safeMax,
            min: safeMin,
            step: safeStep,
        });
        const previousBuckets = lastHapticsBucketsRef.current;
        const hasBucketChanged = previousBuckets.length !== nextBuckets.length ||
            nextBuckets.some((bucket, index) => bucket !== previousBuckets[index]);
        lastHapticsBucketsRef.current = nextBuckets;
        if (hasBucketChanged)
            triggerSliderNativeHaptics(resolvedNativeHaptics);
    };
    return (_jsx(Host, { style: [{ height: 48, justifyContent: "center", width: "100%" }, style], children: _jsx(ExpoSlider, { colors: resolvedColors, max: safeMax, min: safeMin, onValueChange: handleValueChange, onValueChangeFinished: () => {
                onChangeFinished?.(latestValueRef.current ?? safeMin);
                onValueChangeFinished?.([latestValueRef.current]);
            }, steps: resolvedSteps, value: currentValue }) }));
}
