import { useEffect, useRef, useState } from "react";
import { getSliderHapticsBuckets, triggerSliderNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
export function resolveSliderValues(value) {
    return value == null ? undefined : Array.isArray(value) ? value : [value];
}
export function resolveSliderFirstValue(value, fallback) {
    return resolveSliderValues(value)?.[0] ?? fallback;
}
export function sliderBounds(minValue = 0, maxValue = 100, step = 1) {
    const min = Number.isFinite(minValue) ? minValue : 0;
    const max = Number.isFinite(maxValue) && maxValue > min ? maxValue : min + 100;
    const nativeStep = step === 0 ? 0 : Number.isFinite(step) && step > 0 ? step : 1;
    // React Aria and HeroUI Native require a positive divisor. Never pass step=0 to either.
    return { min, max, nativeStep, step: nativeStep === 0 ? (max - min) / 10000 : nativeStep };
}
export function normalizeSliderValues(value, min, max, step) {
    const source = resolveSliderValues(value);
    return (source?.length ? source : [min]).map((v) => {
        const raw = Number.isFinite(v) ? v : min;
        const snapped = step === 0 ? raw : min + Math.round((raw - min) / step) * step;
        return Math.min(max, Math.max(min, Number(snapped.toFixed(12))));
    }).sort((a, b) => a - b);
}
export function useSliderState(p, custom) {
    const { min, max, nativeStep, step } = sliderBounds(p.minValue, p.maxValue, p.step);
    const [local, setLocal] = useState(p.defaultValue ?? min);
    const valueStep = custom ? step : nativeStep;
    const values = normalizeSliderValues(p.value ?? local, min, max, valueStep);
    const array = Array.isArray(p.value ?? p.defaultValue);
    const buckets = (next) => getSliderHapticsBuckets(next, { min, max, step: nativeStep, interval: p.nativeHapticsInterval });
    const lastBuckets = useRef(buckets(values));
    const haptics = useResolvedNativeHaptics(p.nativeHaptics, { defaultEnabled: true });
    const key = values.join(",");
    useEffect(() => { lastBuckets.current = buckets(values); }, [key, min, max, nativeStep, p.nativeHapticsInterval]);
    const shape = (next) => (array ? next : next[0]);
    return {
        values, min, max, step, nativeStep,
        change(next) {
            if (p.isDisabled)
                return;
            const normalized = normalizeSliderValues(next, min, max, valueStep);
            if (p.value === undefined)
                setLocal(shape(normalized));
            p.onChange?.(shape(normalized));
            p.onValueChange?.([...normalized]);
            const nextBuckets = buckets(normalized);
            if (custom && nextBuckets.some((bucket, i) => bucket !== lastBuckets.current[i]))
                triggerSliderNativeHaptics(haptics);
            lastBuckets.current = nextBuckets;
        },
        end(next) {
            if (p.isDisabled)
                return;
            const normalized = normalizeSliderValues(next, min, max, valueStep);
            p.onChangeEnd?.(shape(normalized));
            p.onChangeFinished?.(normalized[0]);
            p.onValueChangeFinished?.([...normalized]);
        },
    };
}
