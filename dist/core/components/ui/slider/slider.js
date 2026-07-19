import { createElement as _createElement } from "react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { isWeb } from "../utils/platform";
import { getSliderHapticsBuckets, triggerSliderNativeHaptics, useResolvedNativeHaptics, } from "../utils";
import { NativeSlider } from "./native_slider";
import { Slider as ReplicaSlider } from "./slider/Slider";
const web = isWeb();
const DEFAULT_NATIVE = !web;
function SliderRoot(props) {
    const { children, native = DEFAULT_NATIVE, nativeHaptics, nativeHapticsInterval, onValueChange, thumbCount, thumbProps, trackActiveProps, trackProps, orientation = "horizontal", size = "$4", ...rootProps } = props;
    if (!web && native) {
        return _jsx(NativeSlider, { ...props });
    }
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
    return (_jsx(ReplicaSlider, { ...rootProps, onValueChange: handleValueChange, orientation: orientation, size: size, children: children ?? (_jsxs(_Fragment, { children: [_jsx(ReplicaSlider.Track, { ...trackProps, children: _jsx(ReplicaSlider.TrackActive, { ...trackActiveProps }) }), Array.from({ length: resolvedThumbCount }).map((_, index) => (_createElement(ReplicaSlider.Thumb, { size: 30, ...thumbProps, circular: thumbProps?.circular ?? true, index: index, key: index })))] })) }));
}
function SliderTrackWrapper(props) {
    return _jsx(ReplicaSlider.Track, { ...props });
}
function SliderTrackActiveWrapper(props) {
    return _jsx(ReplicaSlider.TrackActive, { ...props });
}
function SliderThumbWrapper(props) {
    return _jsx(ReplicaSlider.Thumb, { ...props });
}
export const Slider = Object.assign(SliderRoot, {
    Track: SliderTrackWrapper,
    TrackActive: SliderTrackActiveWrapper,
    Thumb: SliderThumbWrapper,
});
