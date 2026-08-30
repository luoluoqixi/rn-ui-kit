import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, } from "react-native";
import { ScrollTrack } from "./scroll_track";
const DEFAULT_OPTIONS = {
    fadeOutDelay: 2000,
    hitSlop: 22,
    minScrollDistanceToShow: 20,
};
// Adapted from dangervalentine/react-native-scroll-track (MIT).
export function useScrollTrack({ alwaysVisible = false, disableGestures = false, fadeOutDelay = DEFAULT_OPTIONS.fadeOutDelay, hitSlop = DEFAULT_OPTIONS.hitSlop, minScrollDistanceToShow = DEFAULT_OPTIONS.minScrollDistanceToShow, onContentSizeChange, onDragEnd, onDragStart, onLayout, onPressEnd, onPressStart, onScroll, scrollRef, styling = {}, }) {
    const scrollPosition = useRef(new Animated.Value(0)).current;
    const [containerHeight, setContainerHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const [autoHidden, setAutoHidden] = useState(!alwaysVisible);
    const draggingRef = useRef(false);
    const hoveredRef = useRef(false);
    const hideTimer = useRef(null);
    const scrollable = contentHeight - containerHeight > minScrollDistanceToShow;
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
        setContainerHeight(event.nativeEvent.layout.height);
        onLayout?.(event);
    }, [onLayout]);
    const handleContentSizeChange = useCallback((width, height) => {
        setContentHeight(height);
        onContentSizeChange?.(width, height);
    }, [onContentSizeChange]);
    const handleScroll = useCallback((event) => {
        scrollPosition.setValue(Math.max(0, event.nativeEvent.contentOffset.y));
        if (scrollable && !draggingRef.current)
            showTemporarily();
        onScroll?.(event);
    }, [onScroll, scrollPosition, scrollable, showTemporarily]);
    const scrollToPosition = useCallback((position) => {
        const offset = Math.max(0, contentHeight - containerHeight) * position;
        scrollRef.current?.scrollTo?.({ animated: !draggingRef.current, y: offset });
        if (!draggingRef.current)
            showTemporarily();
    }, [containerHeight, contentHeight, scrollPosition, scrollRef, showTemporarily]);
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
    const ScrollTrackElement = useMemo(() => (_jsx(ScrollTrack, { alwaysVisible: alwaysVisible, containerHeight: containerHeight, contentHeight: contentHeight, disableGestures: disableGestures, hitSlop: hitSlop, onDragEnd: handleDragEnd, onDragStart: handleDragStart, onHoverChange: handleHoverChange, onPressChange: handlePressChange, onPressEnd: onPressEnd, onPressStart: onPressStart, onScrollToPosition: scrollToPosition, scrollPosition: scrollPosition, styling: styling, visible: !autoHidden && scrollable })), [
        alwaysVisible,
        autoHidden,
        containerHeight,
        contentHeight,
        disableGestures,
        handleDragEnd,
        handleDragStart,
        handleHoverChange,
        handlePressChange,
        hitSlop,
        onPressEnd,
        onPressStart,
        scrollPosition,
        scrollToPosition,
        scrollable,
        styling,
    ]);
    return {
        ScrollTrack: ScrollTrackElement,
        onContentSizeChange: handleContentSizeChange,
        onLayout: handleLayout,
        onScroll: handleScroll,
    };
}
