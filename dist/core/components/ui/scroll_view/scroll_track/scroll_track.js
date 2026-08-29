import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { isWeb } from "../../utils/platform";
import { useUiColorScheme } from "../../utils/theme";
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
// Adapted from dangervalentine/react-native-scroll-track (MIT).
export function ScrollTrack({ alwaysVisible, containerHeight, contentHeight, disableGestures, hitSlop, onDragEnd, onDragStart, onHoverChange, onPressChange, onPressEnd, onPressStart, onScrollToPosition, scrollPosition, styling, visible, }) {
    const colorScheme = useUiColorScheme();
    const defaultColors = colorScheme === "dark"
        ? {
            thumb: "rgba(228, 228, 231, 0.72)",
            thumbHover: "rgba(244, 244, 245, 0.84)",
            thumbPressed: "rgba(250, 250, 250, 0.96)",
            track: "rgba(228, 228, 231, 0.2)",
            trackHover: "rgba(228, 228, 231, 0.28)",
            trackPressed: "rgba(228, 228, 231, 0.36)",
        }
        : {
            thumb: "rgba(124, 124, 124, 0.56)",
            thumbHover: "rgba(108, 108, 108, 0.68)",
            thumbPressed: "rgba(92, 92, 92, 0.8)",
            track: "rgba(124, 124, 124, 0.14)",
            trackHover: "rgba(124, 124, 124, 0.22)",
            trackPressed: "rgba(124, 124, 124, 0.3)",
        };
    const { thumbBorderRadius = 4, thumbColor = defaultColors.thumb, thumbHoverColor = defaultColors.thumbHover, thumbHeight: fixedThumbHeight, minThumbHeight = 28, thumbOpacity = 1, thumbPressedColor = defaultColors.thumbPressed, thumbShadow, trackBorderRadius = 4, trackColor = defaultColors.track, trackHoverColor = defaultColors.trackHover, trackOpacity = 1, trackPressedColor = defaultColors.trackPressed, trackVisible = false, trackWidth = 6, zIndex = 1000, } = styling;
    const [dragging, setDragging] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    const activePan = useRef(false);
    const dragThumbOffset = useRef(0);
    const draggingThumb = useRef(false);
    const scrollOffset = useRef(0);
    const trackOpacityValue = useRef(new Animated.Value(0)).current;
    const thumbOpacityValue = useRef(new Animated.Value(0)).current;
    const thumbShadowValue = {
        color: thumbShadow?.color ?? "#000000",
        offset: thumbShadow?.offset ?? { height: 1, width: 0 },
        opacity: thumbShadow?.opacity ?? 0.18,
        radius: thumbShadow?.radius ?? 2,
    };
    const thumbHeight = useMemo(() => {
        if (contentHeight <= containerHeight || containerHeight <= 0)
            return 0;
        const dynamicHeight = (containerHeight * containerHeight) / contentHeight;
        const minimumHeight = Math.min(minThumbHeight, containerHeight * 0.8);
        return clamp(fixedThumbHeight ?? Math.max(minimumHeight, dynamicHeight), 0, containerHeight * 0.8);
    }, [containerHeight, contentHeight, fixedThumbHeight, minThumbHeight]);
    const maxThumbPosition = Math.max(0, containerHeight - thumbHeight);
    const scrollRange = Math.max(1, contentHeight - containerHeight);
    const thumbPosition = scrollPosition.interpolate({
        extrapolate: "clamp",
        inputRange: [0, scrollRange],
        outputRange: [0, maxThumbPosition],
    });
    const touchWidth = Math.max(trackWidth, 22);
    const web = isWeb();
    const thumbFillColor = pressed ? thumbPressedColor : hovered ? thumbHoverColor : thumbColor;
    const trackFillColor = pressed ? trackPressedColor : hovered ? trackHoverColor : trackColor;
    useEffect(() => {
        const listener = scrollPosition.addListener(({ value }) => {
            scrollOffset.current = Math.max(0, value);
        });
        return () => scrollPosition.removeListener(listener);
    }, [scrollPosition]);
    useEffect(() => {
        const shown = alwaysVisible || visible;
        const duration = alwaysVisible || pressed ? 0 : 180;
        Animated.parallel([
            Animated.timing(trackOpacityValue, {
                duration,
                toValue: shown && trackVisible ? trackOpacity : 0,
                useNativeDriver: true,
            }),
            Animated.timing(thumbOpacityValue, {
                duration,
                toValue: shown ? thumbOpacity : 0,
                useNativeDriver: true,
            }),
        ]).start();
    }, [
        alwaysVisible,
        pressed,
        thumbOpacity,
        thumbOpacityValue,
        trackOpacity,
        trackOpacityValue,
        trackVisible,
        visible,
    ]);
    const scrollToTrackPosition = useCallback((touchY) => {
        onScrollToPosition(clamp(touchY / Math.max(1, containerHeight), 0, 1));
    }, [containerHeight, onScrollToPosition]);
    const scrollToThumbPosition = useCallback((thumbTop) => {
        onScrollToPosition(clamp(thumbTop / Math.max(1, maxThumbPosition), 0, 1));
    }, [maxThumbPosition, onScrollToPosition]);
    const getThumbTop = useCallback(() => clamp((scrollOffset.current / scrollRange) * maxThumbPosition, 0, maxThumbPosition), [maxThumbPosition, scrollRange]);
    const captureDragStart = useCallback((touchY) => {
        const thumbTop = getThumbTop();
        draggingThumb.current = touchY >= thumbTop && touchY <= thumbTop + thumbHeight;
        dragThumbOffset.current = draggingThumb.current ? touchY - thumbTop : 0;
    }, [getThumbTop, thumbHeight]);
    const handleDragStart = useCallback((touchY) => {
        activePan.current = true;
        setDragging(true);
        setPressed(true);
        onPressChange?.(true);
        onDragStart?.();
        onPressStart?.();
        if (draggingThumb.current)
            return;
        scrollToTrackPosition(touchY);
    }, [onDragStart, onPressChange, onPressStart, scrollToTrackPosition]);
    const handleDragUpdate = useCallback((touchY) => {
        if (draggingThumb.current) {
            scrollToThumbPosition(touchY - dragThumbOffset.current);
            return;
        }
        scrollToTrackPosition(touchY);
    }, [scrollToThumbPosition, scrollToTrackPosition]);
    const handleDragEnd = useCallback(() => {
        if (!activePan.current)
            return;
        activePan.current = false;
        draggingThumb.current = false;
        setDragging(false);
        setPressed(false);
        onPressChange?.(false);
        onDragEnd?.();
        onPressEnd?.();
    }, [onDragEnd, onPressChange, onPressEnd]);
    const handlePressStart = useCallback(() => {
        setPressed(true);
        onPressChange?.(true);
        onPressStart?.();
    }, [onPressChange, onPressStart]);
    const handlePressEnd = useCallback((touchY) => {
        scrollToTrackPosition(touchY);
        setPressed(false);
        onPressChange?.(false);
        onPressEnd?.();
    }, [onPressChange, onPressEnd, scrollToTrackPosition]);
    const handlePressCancel = useCallback(() => {
        if (activePan.current)
            return;
        setPressed(false);
        onPressChange?.(false);
        onPressEnd?.();
    }, [onPressChange, onPressEnd]);
    const panGesture = Gesture.Pan()
        .minDistance(2)
        .maxPointers(1)
        .hitSlop(hitSlop)
        .shouldCancelWhenOutside(false)
        .onBegin((event) => {
        runOnJS(captureDragStart)(event.y);
    })
        .onStart((event) => {
        runOnJS(handleDragStart)(event.y);
    })
        .onUpdate((event) => {
        runOnJS(handleDragUpdate)(event.y);
    })
        .onFinalize(() => {
        runOnJS(handleDragEnd)();
    });
    const tapGesture = Gesture.Tap()
        .maxDistance(20)
        .hitSlop(hitSlop)
        .onBegin(() => {
        runOnJS(handlePressStart)();
    })
        .onEnd((event, success) => {
        if (success) {
            runOnJS(handlePressEnd)(event.y);
        }
        else {
            runOnJS(handlePressCancel)();
        }
    });
    const gesture = Gesture.Exclusive(panGesture, tapGesture);
    const handlePointerEnter = useCallback(() => {
        setHovered(true);
        onHoverChange?.(true);
    }, [onHoverChange]);
    const handlePointerLeave = useCallback(() => {
        setHovered(false);
        onHoverChange?.(false);
    }, [onHoverChange]);
    if (containerHeight <= 0 || contentHeight <= containerHeight)
        return null;
    const thumb = (_jsx(Animated.View, { pointerEvents: "none", style: [
            styles.thumb,
            {
                backgroundColor: thumbFillColor,
                borderRadius: thumbBorderRadius,
                height: thumbHeight,
                opacity: thumbOpacityValue,
                shadowColor: thumbShadowValue.color,
                shadowOffset: thumbShadowValue.offset,
                shadowOpacity: dragging
                    ? Math.min(thumbShadowValue.opacity * 1.4, 1)
                    : thumbShadowValue.opacity,
                shadowRadius: dragging ? thumbShadowValue.radius * 1.4 : thumbShadowValue.radius,
                transform: [{ translateY: thumbPosition }],
                width: trackWidth,
            },
        ] }));
    return (_jsxs(View, { pointerEvents: "box-none", style: [styles.container, { zIndex }], children: [trackVisible ? (_jsx(Animated.View, { pointerEvents: "none", style: [
                    styles.track,
                    {
                        backgroundColor: trackFillColor,
                        borderRadius: trackBorderRadius,
                        height: containerHeight,
                        opacity: trackOpacityValue,
                        width: trackWidth,
                    },
                ] })) : null, disableGestures ? (_jsx(View, { onPointerEnter: web ? handlePointerEnter : undefined, onPointerLeave: web ? handlePointerLeave : undefined, pointerEvents: web ? "auto" : "none", style: [styles.touchArea, { height: containerHeight, width: touchWidth }], children: thumb })) : (_jsx(GestureDetector, { gesture: gesture, children: _jsx(View, { onPointerEnter: web ? handlePointerEnter : undefined, onPointerLeave: web ? handlePointerLeave : undefined, style: [styles.touchArea, { height: containerHeight, width: touchWidth }], children: thumb }) }))] }));
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        bottom: 0,
        position: "absolute",
        right: 0,
        top: 0,
    },
    thumb: {
        elevation: 4,
        position: "absolute",
        right: 0,
    },
    touchArea: {
        alignItems: "center",
        position: "absolute",
        right: 0,
        top: 0,
    },
    track: {
        position: "absolute",
        right: 0,
        top: 0,
    },
});
