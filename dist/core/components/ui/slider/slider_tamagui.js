import { createElement as _createElement } from "react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Slider as TamaguiSliderPrimitive } from "@tamagui/slider";
import React from "react";
import { getSliderHapticsBuckets, triggerSliderNativeHaptics, useResolvedNativeHaptics, } from "../utils";
function TamaguiSliderRoot(props) {
    const { children, nativeHaptics, nativeHapticsInterval, onValueChange, thumbCount, thumbProps, trackActiveProps, trackProps, orientation = "horizontal", size = "$4", ...rootProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const lastHapticsBucketsRef = React.useRef(getSliderHapticsBuckets(rootProps.value ?? rootProps.defaultValue, {
        interval: nativeHapticsInterval,
        max: rootProps.max,
        min: rootProps.min,
        step: rootProps.step,
    }));
    React.useEffect(() => {
        if (rootProps.value == null) {
            return;
        }
        lastHapticsBucketsRef.current = getSliderHapticsBuckets(rootProps.value, {
            interval: nativeHapticsInterval,
            max: rootProps.max,
            min: rootProps.min,
            step: rootProps.step,
        });
    }, [nativeHapticsInterval, rootProps.max, rootProps.min, rootProps.step, rootProps.value]);
    const resolvedThumbCount = thumbCount ?? rootProps.value?.length ?? rootProps.defaultValue?.length ?? 1;
    const handleValueChange = (nextValue) => {
        onValueChange?.(nextValue);
        const nextBuckets = getSliderHapticsBuckets(nextValue, {
            interval: nativeHapticsInterval,
            max: rootProps.max,
            min: rootProps.min,
            step: rootProps.step,
        });
        const previousBuckets = lastHapticsBucketsRef.current;
        const hasBucketChanged = previousBuckets.length !== nextBuckets.length ||
            nextBuckets.some((bucket, index) => bucket !== previousBuckets[index]);
        lastHapticsBucketsRef.current = nextBuckets;
        if (!hasBucketChanged) {
            return;
        }
        triggerSliderNativeHaptics(resolvedNativeHaptics);
    };
    return (_jsx(TamaguiSliderPrimitive, { ...rootProps, onValueChange: handleValueChange, orientation: orientation, size: size, children: children ?? (_jsxs(_Fragment, { children: [_jsx(TamaguiSliderPrimitive.Track, { ...trackProps, children: _jsx(TamaguiSliderPrimitive.TrackActive, { ...trackActiveProps }) }), Array.from({ length: resolvedThumbCount }).map((_, index) => (_createElement(TamaguiSliderPrimitive.Thumb, { size: 30, ...thumbProps, circular: thumbProps?.circular ?? true, index: index, key: index })))] })) }));
}
function TamaguiSliderTrackWrapper(props) {
    return _jsx(TamaguiSliderPrimitive.Track, { ...props });
}
function TamaguiSliderTrackActiveWrapper(props) {
    return _jsx(TamaguiSliderPrimitive.TrackActive, { ...props });
}
function TamaguiSliderThumbWrapper(props) {
    return _jsx(TamaguiSliderPrimitive.Thumb, { ...props });
}
export const TamaguiSlider = Object.assign(TamaguiSliderRoot, {
    Track: TamaguiSliderTrackWrapper,
    TrackActive: TamaguiSliderTrackActiveWrapper,
    Thumb: TamaguiSliderThumbWrapper,
});
