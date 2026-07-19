import { jsx as _jsx } from "react/jsx-runtime";
/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/
import { isWeb } from "@tamagui/constants";
import { getVariableValue, styled } from "@tamagui/core";
import { getSize } from "@tamagui/get-token";
import { YStack } from "@tamagui/stacks";
import * as React from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { ARROW_KEYS, PAGE_KEYS, useSliderContext } from "./constants";
const NATIVE_GESTURE_OVERFLOW = {
    horizontal: {
        crossAxisEnd: 24,
        crossAxisStart: 12,
    },
    vertical: {
        crossAxisEnd: 24,
        crossAxisStart: 12,
    },
};
const NATIVE_SLIDER_Z_INDEX = 1;
function getExpandedGestureLayerStyle(orientation, overflow) {
    if (orientation === "vertical") {
        return {
            bottom: 0,
            left: -overflow.crossAxisStart,
            position: "absolute",
            right: -overflow.crossAxisEnd,
            top: 0,
        };
    }
    return {
        bottom: -overflow.crossAxisEnd,
        left: 0,
        position: "absolute",
        right: 0,
        top: -overflow.crossAxisStart,
    };
}
function getGestureContentStyle(orientation, overflow) {
    if (orientation === "vertical") {
        return {
            bottom: 0,
            left: overflow.crossAxisStart,
            position: "absolute",
            right: overflow.crossAxisEnd,
            top: 0,
        };
    }
    return {
        bottom: overflow.crossAxisEnd,
        left: 0,
        position: "absolute",
        right: 0,
        top: overflow.crossAxisStart,
    };
}
export const SliderFrame = styled(YStack, {
    position: "relative",
    variants: {
        orientation: {
            horizontal: {},
            vertical: {},
        },
        size: (val, extras) => {
            if (!val) {
                return;
            }
            const orientation = extras.props["orientation"];
            const size = Math.round(getVariableValue(getSize(val)) / 6);
            if (orientation === "horizontal") {
                return {
                    height: size,
                    borderRadius: size,
                    justifyContent: "center",
                };
            }
            return {
                width: size,
                borderRadius: size,
                alignItems: "center",
            };
        },
    },
});
export const SliderImpl = React.forwardRef((props, forwardedRef) => {
    const { __scopeSlider, onSlideStart, onSlideMove, onSlideEnd, onHomeKeyDown, onEndKeyDown, onStepKeyDown, children, ...sliderProps } = props;
    const context = useSliderContext(__scopeSlider);
    const isNative = !isWeb;
    const orientation = sliderProps.orientation;
    const nativeGestureOverflow = isNative ? NATIVE_GESTURE_OVERFLOW[orientation] : null;
    const handleResponderGrant = React.useCallback((event) => {
        props.onResponderGrant?.(event);
        const target = event.target;
        const thumbIndex = context.thumbs.get(target);
        const isStartingOnThumb = thumbIndex !== undefined;
        // Prevent browser focus behaviour because we focus a thumb manually when values change.
        // Touch devices have a delay before focusing so won't focus if touch immediately moves
        // away from target (sliding). We want thumb to focus regardless.
        if (isWeb && target instanceof HTMLElement) {
            if (context.thumbs.has(target)) {
                target.focus();
            }
        }
        // Thumbs won't receive focus events on native, so we have to manually
        // set the value index to change when sliding starts on a thumb.
        if (!isWeb && isStartingOnThumb) {
            context.valueIndexToChangeRef.current = thumbIndex;
        }
        onSlideStart(event, isStartingOnThumb ? "thumb" : "track");
    }, [context, onSlideStart, props.onResponderGrant]);
    const handleResponderMove = React.useCallback((event) => {
        props.onResponderMove?.(event);
        event.stopPropagation();
        onSlideMove(event);
    }, [onSlideMove, props.onResponderMove]);
    const handleResponderRelease = React.useCallback((event) => {
        props.onResponderRelease?.(event);
        onSlideEnd(event);
    }, [onSlideEnd, props.onResponderRelease]);
    const createNativeResponderEvent = React.useCallback((event) => {
        return {
            nativeEvent: {
                locationX: event.x,
                locationY: event.y,
                pageX: event.absoluteX,
                pageY: event.absoluteY,
                target: event.target,
            },
            stopPropagation() { },
        };
    }, []);
    const handleNativeGestureStart = React.useCallback((event) => {
        handleResponderGrant(createNativeResponderEvent(event));
    }, [createNativeResponderEvent, handleResponderGrant]);
    const handleNativeGestureMove = React.useCallback((event) => {
        handleResponderMove(createNativeResponderEvent(event));
    }, [createNativeResponderEvent, handleResponderMove]);
    const handleNativeGestureEnd = React.useCallback((event) => {
        handleResponderRelease(createNativeResponderEvent(event));
    }, [createNativeResponderEvent, handleResponderRelease]);
    const nativeGesture = React.useMemo(() => {
        if (!isNative) {
            return null;
        }
        return Gesture.Pan()
            .minDistance(0)
            .shouldCancelWhenOutside(false)
            .onBegin((event) => {
            "worklet";
            runOnJS(handleNativeGestureStart)(event);
        })
            .onUpdate((event) => {
            "worklet";
            runOnJS(handleNativeGestureMove)(event);
        })
            .onEnd((event) => {
            "worklet";
            runOnJS(handleNativeGestureEnd)(event);
        })
            .onFinalize((event) => {
            "worklet";
            runOnJS(handleNativeGestureEnd)(event);
        });
    }, [handleNativeGestureEnd, handleNativeGestureMove, handleNativeGestureStart, isNative]);
    const content = (_jsx(View, { onMoveShouldSetResponderCapture: isWeb ? () => false : undefined, onMoveShouldSetResponder: isWeb ? () => false : undefined, onStartShouldSetResponder: isWeb ? () => true : undefined, onResponderTerminationRequest: isWeb ? () => false : undefined, onResponderGrant: isWeb ? handleResponderGrant : undefined, onResponderMove: isWeb ? handleResponderMove : undefined, onResponderRelease: isWeb ? handleResponderRelease : undefined, style: isNative && nativeGestureOverflow
            ? getGestureContentStyle(orientation, nativeGestureOverflow)
            : { inset: 0, position: "absolute" }, children: children }));
    return (
    // wrap with plain RN View for responder events - tamagui views no longer handle responder events on web
    _jsx(SliderFrame, { size: "$4", ref: forwardedRef, ...sliderProps, "data-orientation": orientation, style: isNative ? [{ zIndex: NATIVE_SLIDER_Z_INDEX }, sliderProps.style] : sliderProps.style, ...(isWeb && {
            onKeyDown: (event) => {
                if (event.key === "Home") {
                    onHomeKeyDown(event);
                    // Prevent scrolling to page start
                    event.preventDefault();
                }
                else if (event.key === "End") {
                    onEndKeyDown(event);
                    // Prevent scrolling to page end
                    event.preventDefault();
                }
                else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
                    onStepKeyDown(event);
                    // Prevent scrolling for directional key presses
                    event.preventDefault();
                }
            },
        }), children: nativeGesture && nativeGestureOverflow ? (_jsx(GestureDetector, { gesture: nativeGesture, children: _jsx(View, { style: getExpandedGestureLayerStyle(orientation, nativeGestureOverflow), children: content }) })) : (content) }));
});
