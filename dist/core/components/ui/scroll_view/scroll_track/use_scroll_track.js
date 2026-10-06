import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, } from "react-native";
import { ScrollTrack } from "./scroll_tracks";
const DEFAULT_OPTIONS = {
    fadeOutDelay: 2000,
    hitSlop: 22,
    minScrollDistanceToShow: 20,
};
// Adapted from dangervalentine/react-native-scroll-track (MIT).
export function useScrollTrack({ alwaysVisible = false, disableGestures = false, fadeOutDelay = DEFAULT_OPTIONS.fadeOutDelay, hitSlop = DEFAULT_OPTIONS.hitSlop, horizontal = false, insets, minScrollDistanceToShow = DEFAULT_OPTIONS.minScrollDistanceToShow, onContentSizeChange, onDragEnd, onDragStart, onLayout, onPressEnd, onPressStart, onScroll, scrollRef, styling = {}, }) {
    const horizontalScrollPosition = useRef(new Animated.Value(0)).current;
    const verticalScrollPosition = useRef(new Animated.Value(0)).current;
    const [containerSize, setContainerSize] = useState({ height: 0, width: 0 });
    const [contentSize, setContentSize] = useState({ height: 0, width: 0 });
    const [autoHidden, setAutoHidden] = useState(!alwaysVisible);
    const draggingRef = useRef(false);
    const hoveredRef = useRef(false);
    const hideTimer = useRef(null);
    const verticallyScrollable = !horizontal && contentSize.height - containerSize.height > minScrollDistanceToShow;
    const horizontallyScrollable = horizontal && contentSize.width - containerSize.width > minScrollDistanceToShow;
    const scrollable = verticallyScrollable || horizontallyScrollable;
    const clearHideTimer = useCallback(() => {
        if (hideTimer.current != null) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
        }
    }, []);
    const showTemporarily = useCallback(() => {
        clearHideTimer();
        setAutoHidden(false);
        if (!alwaysVisible && !hoveredRef.current) {
            hideTimer.current = setTimeout(() => {
                setAutoHidden(true);
                hideTimer.current = null;
            }, fadeOutDelay);
        }
    }, [alwaysVisible, clearHideTimer, fadeOutDelay]);
    useEffect(() => clearHideTimer, [clearHideTimer]);
    useEffect(() => {
        if (!scrollable) {
            clearHideTimer();
            setAutoHidden(true);
            return;
        }
        if (alwaysVisible) {
            clearHideTimer();
            setAutoHidden(false);
        }
        else {
            showTemporarily();
        }
    }, [alwaysVisible, clearHideTimer, scrollable, showTemporarily]);
    const handleLayout = useCallback((event) => {
        setContainerSize({
            height: event.nativeEvent.layout.height,
            width: event.nativeEvent.layout.width,
        });
        onLayout?.(event);
    }, [onLayout]);
    const handleContentSizeChange = useCallback((width, height) => {
        setContentSize({ height, width });
        onContentSizeChange?.(width, height);
    }, [onContentSizeChange]);
    const handleScroll = useCallback((event) => {
        horizontalScrollPosition.setValue(Math.max(0, event.nativeEvent.contentOffset.x));
        verticalScrollPosition.setValue(Math.max(0, event.nativeEvent.contentOffset.y));
        if (scrollable && !draggingRef.current)
            showTemporarily();
        onScroll?.(event);
    }, [horizontalScrollPosition, onScroll, scrollable, showTemporarily, verticalScrollPosition]);
    const scrollToPosition = useCallback((axis, position) => {
        const offset = Math.max(0, axis === "horizontal"
            ? contentSize.width - containerSize.width
            : contentSize.height - containerSize.height) * position;
        scrollRef.current?.scrollTo?.({
            animated: !draggingRef.current,
            [axis === "horizontal" ? "x" : "y"]: offset,
        });
        if (!draggingRef.current)
            showTemporarily();
    }, [containerSize, contentSize, scrollRef, showTemporarily]);
    const handleDragStart = useCallback(() => {
        draggingRef.current = true;
        clearHideTimer();
        setAutoHidden(false);
        onDragStart?.();
    }, [clearHideTimer, onDragStart]);
    const handleDragEnd = useCallback(() => {
        draggingRef.current = false;
        onDragEnd?.();
        showTemporarily();
    }, [onDragEnd, showTemporarily]);
    const handlePressChange = useCallback((pressed) => {
        if (pressed) {
            clearHideTimer();
            setAutoHidden(false);
            return;
        }
        showTemporarily();
    }, [clearHideTimer, showTemporarily]);
    const handleHoverChange = useCallback((hovered) => {
        hoveredRef.current = hovered;
        if (hovered) {
            clearHideTimer();
            setAutoHidden(false);
        }
        else {
            showTemporarily();
        }
    }, [clearHideTimer, showTemporarily]);
    const ScrollTrackElement = useMemo(() => (_jsxs(_Fragment, { children: [_jsx(ScrollTrack, { alwaysVisible: alwaysVisible, axis: "vertical", containerSize: containerSize.height, contentSize: contentSize.height, disableGestures: disableGestures, hitSlop: hitSlop, insets: insets, onDragEnd: handleDragEnd, onDragStart: handleDragStart, onHoverChange: handleHoverChange, onPressChange: handlePressChange, onPressEnd: onPressEnd, onPressStart: onPressStart, onScrollToPosition: scrollToPosition, scrollPosition: verticalScrollPosition, styling: styling, visible: !autoHidden && verticallyScrollable }), _jsx(ScrollTrack, { alwaysVisible: alwaysVisible, axis: "horizontal", containerSize: containerSize.width, contentSize: contentSize.width, disableGestures: disableGestures, hitSlop: hitSlop, insets: insets, onDragEnd: handleDragEnd, onDragStart: handleDragStart, onHoverChange: handleHoverChange, onPressChange: handlePressChange, onPressEnd: onPressEnd, onPressStart: onPressStart, onScrollToPosition: scrollToPosition, scrollPosition: horizontalScrollPosition, styling: styling, visible: !autoHidden && horizontallyScrollable })] })), [
        alwaysVisible,
        autoHidden,
        containerSize,
        contentSize,
        disableGestures,
        handleDragEnd,
        handleDragStart,
        handleHoverChange,
        handlePressChange,
        hitSlop,
        horizontal,
        onPressEnd,
        onPressStart,
        horizontalScrollPosition,
        scrollToPosition,
        insets,
        styling,
        verticallyScrollable,
        horizontallyScrollable,
        verticalScrollPosition,
    ]);
    return {
        ScrollTrack: ScrollTrackElement,
        onContentSizeChange: handleContentSizeChange,
        onLayout: handleLayout,
        onScroll: handleScroll,
    };
}
