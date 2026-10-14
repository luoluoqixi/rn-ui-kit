import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { getSliderHapticsBuckets, triggerSliderNativeHaptics, useResolvedNativeHaptics, } from "../../utils";
import { isWeb } from "../../utils/platform";
import { resolveSliderValues } from "../types";
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
function resolveStep(step) {
    return step === 0 ? undefined : typeof step === "number" && step > 0 ? step : 1;
}
function resolveCount(value, defaultValue, thumbCount) {
    if (thumbCount != null)
        return Math.max(1, thumbCount);
    return resolveSliderValues(value)?.length ?? resolveSliderValues(defaultValue)?.length ?? 1;
}
function resolveValues(value, count, min, max) {
    const source = resolveSliderValues(value) ?? [];
    return Array.from({ length: count }, (_, index) => clamp(source[index] ?? min, min, max));
}
function normalizeSliderValues(values, min, max, step) {
    const steppedValues = values.map((item) => {
        const stepped = step == null ? item : Math.round((item - min) / step) * step + min;
        // Avoid exposing binary floating-point noise for decimal steps.
        const normalized = step == null ? stepped : Math.round(stepped * 1e12) / 1e12;
        return clamp(normalized, min, max);
    });
    // Normalize the step before applying thumb ordering. Using raw neighbor values
    // here can clamp a thumb to a fractional value when two range thumbs meet.
    return steppedValues.map((item, index) => {
        const lowerBound = index > 0 ? steppedValues[index - 1] : min;
        const upperBound = index < steppedValues.length - 1 ? steppedValues[index + 1] : max;
        return clamp(item, lowerBound, upperBound);
    });
}
export function useSliderBehavior({ defaultValue, disabled = false, orientation = "horizontal", max = 100, min = 0, nativeHaptics, nativeHapticsInterval, onChange, onChangeFinished, onActiveThumbChange, onLayout, onValueChange, onValueChangeFinished, step: stepProp, thumbCount, value, sliderRef, trackInset, }) {
    const safeStep = resolveStep(stepProp);
    const valueCount = resolveCount(value, defaultValue, thumbCount);
    const initialValues = useMemo(() => resolveValues(value ?? defaultValue, valueCount, min, max), [defaultValue, max, min, value, valueCount]);
    const [uncontrolledValues, setUncontrolledValues] = useState(initialValues);
    const resolvedValues = useMemo(() => (value == null ? uncontrolledValues : resolveValues(value, valueCount, min, max)), [max, min, uncontrolledValues, value, valueCount]);
    const valuesRef = useRef(resolvedValues);
    const trackLengthRef = useRef(0);
    const startValuesRef = useRef(resolvedValues);
    const activeThumbRef = useRef(0);
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, { defaultEnabled: true });
    const lastHapticsBucketsRef = useRef(getSliderHapticsBuckets(resolvedValues, {
        interval: nativeHapticsInterval,
        max,
        min,
        step: safeStep,
    }));
    const web = isWeb();
    valuesRef.current = resolvedValues;
    useEffect(() => {
        if (value == null)
            return;
        valuesRef.current = resolvedValues;
        lastHapticsBucketsRef.current = getSliderHapticsBuckets(resolvedValues, {
            interval: nativeHapticsInterval,
            max,
            min,
            step: safeStep,
        });
    }, [max, min, nativeHapticsInterval, resolvedValues, safeStep, value]);
    const setValues = useCallback((nextValues) => {
        const next = normalizeSliderValues(nextValues, min, max, safeStep);
        valuesRef.current = next;
        if (value == null)
            setUncontrolledValues(next);
        onChange?.(next[0] ?? min);
        onValueChange?.(next);
        const nextBuckets = getSliderHapticsBuckets(next, {
            interval: nativeHapticsInterval,
            max,
            min,
            step: safeStep,
        });
        const previousBuckets = lastHapticsBucketsRef.current;
        const changed = nextBuckets.length !== previousBuckets.length ||
            nextBuckets.some((bucket, index) => bucket !== previousBuckets[index]);
        lastHapticsBucketsRef.current = nextBuckets;
        if (changed)
            triggerSliderNativeHaptics(resolvedNativeHaptics);
    }, [
        max,
        min,
        nativeHapticsInterval,
        onChange,
        onValueChange,
        resolvedNativeHaptics,
        safeStep,
        value,
    ]);
    const beginGesture = useCallback((location) => {
        const position = orientation === "horizontal" ? location : trackLengthRef.current - location;
        const ratio = trackLengthRef.current > 0 ? position / trackLengthRef.current : 0;
        const targetValue = min + clamp(ratio, 0, 1) * (max - min);
        const activeThumbIndex = valuesRef.current.reduce((closestIndex, item, index, values) => Math.abs(item - targetValue) < Math.abs(values[closestIndex] - targetValue)
            ? index
            : closestIndex, 0);
        activeThumbRef.current = activeThumbIndex;
        onActiveThumbChange?.(activeThumbIndex);
        // A press on the track is also a value change. Updating it here makes a
        // tap seek immediately, while the first move continues from that point.
        const nextValues = [...valuesRef.current];
        nextValues[activeThumbIndex] = targetValue;
        setValues(nextValues);
        startValuesRef.current = [...valuesRef.current];
    }, [max, min, onActiveThumbChange, orientation, setValues]);
    const updateFromTranslation = useCallback((translation) => {
        const length = trackLengthRef.current;
        if (length <= 0)
            return;
        const index = activeThumbRef.current;
        const range = max - min;
        if (range <= 0)
            return;
        const startValue = startValuesRef.current[index] ?? min;
        const nextValues = [...valuesRef.current];
        nextValues[index] = startValue + (translation / length) * range;
        setValues(nextValues);
    }, [max, min, setValues]);
    const finishGesture = useCallback(() => {
        const finishedValues = [...valuesRef.current];
        onActiveThumbChange?.(null);
        onChangeFinished?.(finishedValues[0] ?? min);
        onValueChangeFinished?.(finishedValues);
    }, [min, onActiveThumbChange, onChangeFinished, onValueChangeFinished]);
    const beginGestureRef = useRef(beginGesture);
    const updateFromTranslationRef = useRef(updateFromTranslation);
    const finishGestureRef = useRef(finishGesture);
    beginGestureRef.current = beginGesture;
    updateFromTranslationRef.current = updateFromTranslation;
    finishGestureRef.current = finishGesture;
    const beginGestureFromNative = useCallback((locationX) => beginGestureRef.current(locationX), []);
    const updateFromTranslationFromNative = useCallback((translationX) => updateFromTranslationRef.current(translationX), []);
    const finishGestureFromNative = useCallback(() => finishGestureRef.current(), []);
    // Use pointer capture on web so controlled value updates cannot replace the
    // responder during a drag. This also prevents the page from selecting text.
    useEffect(() => {
        if (!web || disabled || sliderRef?.current == null)
            return;
        const node = sliderRef.current;
        let activePointerId = null;
        let startClientPosition = 0;
        const handlePointerDown = (event) => {
            if (activePointerId != null)
                return;
            const rect = node.getBoundingClientRect();
            const length = orientation === "horizontal" ? rect.width : rect.height;
            if (length <= 0)
                return;
            event.preventDefault();
            trackLengthRef.current = Math.max(0, length - (trackInset ?? 0) * 2);
            startClientPosition = orientation === "horizontal" ? event.clientX : event.clientY;
            activePointerId = event.pointerId;
            node.setPointerCapture?.(event.pointerId);
            const position = (orientation === "horizontal" ? event.clientX - rect.left : event.clientY - rect.top) -
                (trackInset ?? 0);
            beginGestureRef.current(position);
        };
        const handlePointerMove = (event) => {
            if (event.pointerId !== activePointerId)
                return;
            event.preventDefault();
            const translation = orientation === "horizontal"
                ? event.clientX - startClientPosition
                : startClientPosition - event.clientY;
            updateFromTranslationRef.current(translation);
        };
        const handlePointerEnd = (event) => {
            if (event.pointerId !== activePointerId)
                return;
            event.preventDefault();
            node.releasePointerCapture?.(event.pointerId);
            activePointerId = null;
            finishGestureRef.current();
        };
        node.addEventListener("pointerdown", handlePointerDown, { passive: false });
        node.addEventListener("pointermove", handlePointerMove, { passive: false });
        node.addEventListener("pointerup", handlePointerEnd, { passive: false });
        node.addEventListener("pointercancel", handlePointerEnd, { passive: false });
        return () => {
            node.removeEventListener("pointerdown", handlePointerDown);
            node.removeEventListener("pointermove", handlePointerMove);
            node.removeEventListener("pointerup", handlePointerEnd);
            node.removeEventListener("pointercancel", handlePointerEnd);
        };
    }, [disabled, orientation, sliderRef, trackInset, web]);
    const nativeGesture = useMemo(() => {
        if (web || disabled)
            return null;
        return Gesture.Pan()
            .minDistance(0)
            .shouldCancelWhenOutside(false)
            .onBegin((event) => {
            "worklet";
            runOnJS(beginGestureFromNative)((orientation === "horizontal" ? event.x : event.y) - (trackInset ?? 0));
        })
            .onUpdate((event) => {
            "worklet";
            runOnJS(updateFromTranslationFromNative)(orientation === "horizontal" ? event.translationX : -event.translationY);
        })
            .onFinalize(() => {
            "worklet";
            runOnJS(finishGestureFromNative)();
        });
    }, [
        beginGestureFromNative,
        disabled,
        finishGestureFromNative,
        orientation,
        trackInset,
        updateFromTranslationFromNative,
        web,
    ]);
    const handleLayout = useCallback((event) => {
        const length = orientation === "horizontal" ? event.nativeEvent.layout.width : event.nativeEvent.layout.height;
        trackLengthRef.current = Math.max(0, length - (trackInset ?? 0) * 2);
        onLayout?.(event);
    }, [onLayout, orientation, trackInset]);
    return {
        handleLayout,
        nativeGesture,
        values: resolvedValues,
    };
}
