import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  Animated,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import { ScrollTrack } from "./scroll_track";
import type { ScrollTrackOptions } from "./types";

type ScrollableRef = {
  scrollTo?: (options: { animated?: boolean; y: number }) => void;
};

type UseScrollTrackParams = ScrollTrackOptions & {
  onContentSizeChange?: (width: number, height: number) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef: RefObject<ScrollableRef | null>;
};

const DEFAULT_OPTIONS = {
  fadeOutDelay: 2000,
  hitSlop: 22,
  minScrollDistanceToShow: 20,
} as const;

// Adapted from dangervalentine/react-native-scroll-track (MIT).
export function useScrollTrack({
  alwaysVisible = false,
  disableGestures = false,
  fadeOutDelay = DEFAULT_OPTIONS.fadeOutDelay,
  hitSlop = DEFAULT_OPTIONS.hitSlop,
  minScrollDistanceToShow = DEFAULT_OPTIONS.minScrollDistanceToShow,
  onContentSizeChange,
  onDragEnd,
  onDragStart,
  onLayout,
  onPressEnd,
  onPressStart,
  onScroll,
  scrollRef,
  styling = {},
}: UseScrollTrackParams) {
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [autoHidden, setAutoHidden] = useState(!alwaysVisible);
  const draggingRef = useRef(false);
  const hoveredRef = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    } else {
      showTemporarily();
    }
  }, [alwaysVisible, clearHideTimer, scrollable, showTemporarily]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setContainerHeight(event.nativeEvent.layout.height);
      onLayout?.(event);
    },
    [onLayout],
  );
  const handleContentSizeChange = useCallback(
    (width: number, height: number) => {
      setContentHeight(height);
      onContentSizeChange?.(width, height);
    },
    [onContentSizeChange],
  );
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollPosition.setValue(Math.max(0, event.nativeEvent.contentOffset.y));
      if (scrollable && !draggingRef.current) showTemporarily();
      onScroll?.(event);
    },
    [onScroll, scrollPosition, scrollable, showTemporarily],
  );
  const scrollToPosition = useCallback(
    (position: number) => {
      const offset = Math.max(0, contentHeight - containerHeight) * position;
      scrollRef.current?.scrollTo?.({ animated: !draggingRef.current, y: offset });
      if (!draggingRef.current) showTemporarily();
    },
    [containerHeight, contentHeight, scrollPosition, scrollRef, showTemporarily],
  );
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
  const handlePressChange = useCallback(
    (pressed: boolean) => {
      if (pressed) {
        clearHideTimer();
        setAutoHidden(false);
        return;
      }
      showTemporarily();
    },
    [clearHideTimer, showTemporarily],
  );
  const handleHoverChange = useCallback(
    (hovered: boolean) => {
      hoveredRef.current = hovered;
      if (hovered) {
        clearHideTimer();
        setAutoHidden(false);
      } else {
        showTemporarily();
      }
    },
    [clearHideTimer, showTemporarily],
  );
  const ScrollTrackElement = useMemo(
    () => (
      <ScrollTrack
        alwaysVisible={alwaysVisible}
        containerHeight={containerHeight}
        contentHeight={contentHeight}
        disableGestures={disableGestures}
        hitSlop={hitSlop}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onHoverChange={handleHoverChange}
        onPressChange={handlePressChange}
        onPressEnd={onPressEnd}
        onPressStart={onPressStart}
        onScrollToPosition={scrollToPosition}
        scrollPosition={scrollPosition}
        styling={styling}
        visible={!autoHidden && scrollable}
      />
    ),
    [
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
    ],
  );

  return {
    ScrollTrack: ScrollTrackElement,
    onContentSizeChange: handleContentSizeChange,
    onLayout: handleLayout,
    onScroll: handleScroll,
  };
}
