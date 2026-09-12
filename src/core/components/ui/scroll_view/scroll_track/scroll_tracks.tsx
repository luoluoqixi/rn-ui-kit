import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { isWeb } from "../../utils/platform";
import { useUiColorScheme } from "../../utils/theme";

import type { ScrollTrackOptions, ScrollTrackStyling } from "./types";

type Axis = "horizontal" | "vertical";

type ScrollTrackProps = Required<
  Pick<ScrollTrackOptions, "alwaysVisible" | "disableGestures" | "hitSlop">
> & {
  axis: Axis;
  containerSize: number;
  contentSize: number;
  onHoverChange?: (hovered: boolean) => void;
  onPressChange?: (pressed: boolean) => void;
  onScrollToPosition: (axis: Axis, position: number) => void;
  scrollPosition: Animated.Value;
  styling: ScrollTrackStyling;
  visible: boolean;
} & Pick<
    ScrollTrackOptions,
    "insets" | "onDragEnd" | "onDragStart" | "onPressEnd" | "onPressStart"
  >;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

/** One axis of the custom draggable scrollbar. */
export function ScrollTrack({
  alwaysVisible,
  axis,
  containerSize,
  contentSize,
  disableGestures,
  hitSlop,
  insets,
  onDragEnd,
  onDragStart,
  onHoverChange,
  onPressChange,
  onPressEnd,
  onPressStart,
  onScrollToPosition,
  scrollPosition,
  styling,
  visible,
}: ScrollTrackProps) {
  const colorScheme = useUiColorScheme();
  const colors =
    colorScheme === "dark"
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
  const {
    thumbBorderRadius = 4,
    thumbColor = colors.thumb,
    thumbHoverColor = colors.thumbHover,
    thumbHeight: fixedThumbLength,
    minThumbHeight = 28,
    thumbOpacity = 1,
    thumbPressedColor = colors.thumbPressed,
    thumbShadow,
    trackBorderRadius = 4,
    trackColor = colors.track,
    trackHoverColor = colors.trackHover,
    trackOpacity = 1,
    trackPressedColor = colors.trackPressed,
    trackVisible = false,
    trackWidth = 6,
    zIndex = 1000,
  } = styling;
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const activePan = useRef(false);
  const dragThumbOffset = useRef(0);
  const draggingThumb = useRef(false);
  const scrollOffset = useRef(0);
  const trackOpacityValue = useRef(new Animated.Value(0)).current;
  const thumbOpacityValue = useRef(new Animated.Value(0)).current;

  const startInset = axis === "vertical" ? (insets?.top ?? 0) : (insets?.left ?? 0);
  const endInset = axis === "vertical" ? (insets?.bottom ?? 0) : (insets?.right ?? 0);
  const edgeInset = axis === "vertical" ? (insets?.right ?? 0) : (insets?.bottom ?? 0);
  const trackLength = Math.max(0, containerSize - startInset - endInset);
  const thumbLength = useMemo(() => {
    if (contentSize <= containerSize || containerSize <= 0 || trackLength <= 0) return 0;
    const dynamicLength = (trackLength * containerSize) / contentSize;
    const minimumLength = Math.min(minThumbHeight, trackLength * 0.8);
    return clamp(
      fixedThumbLength ?? Math.max(minimumLength, dynamicLength),
      0,
      trackLength * 0.8,
    );
  }, [containerSize, contentSize, fixedThumbLength, minThumbHeight, trackLength]);
  const maxThumbPosition = Math.max(0, trackLength - thumbLength);
  const scrollRange = Math.max(1, contentSize - containerSize);
  const thumbPosition = scrollPosition.interpolate({
    extrapolate: "clamp",
    inputRange: [0, scrollRange],
    outputRange: [0, maxThumbPosition],
  });
  const touchSize = Math.max(trackWidth, 22);
  const web = isWeb();
  const thumbFillColor = pressed ? thumbPressedColor : hovered ? thumbHoverColor : thumbColor;
  const trackFillColor = pressed ? trackPressedColor : hovered ? trackHoverColor : trackColor;
  const shadow = {
    color: thumbShadow?.color ?? "#000000",
    elevation: thumbShadow?.elevation ?? 0,
    offset: thumbShadow?.offset ?? { height: 1, width: 0 },
    opacity: thumbShadow?.opacity ?? 0,
    radius: thumbShadow?.radius ?? 2,
  };

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

  const scrollToTrackPosition = useCallback(
    (touchPosition: number) => {
      onScrollToPosition(axis, clamp(touchPosition / Math.max(1, trackLength), 0, 1));
    },
    [axis, onScrollToPosition, trackLength],
  );
  const scrollToThumbPosition = useCallback(
    (position: number) => {
      onScrollToPosition(axis, clamp(position / Math.max(1, maxThumbPosition), 0, 1));
    },
    [axis, maxThumbPosition, onScrollToPosition],
  );
  const getThumbPosition = useCallback(
    () => clamp((scrollOffset.current / scrollRange) * maxThumbPosition, 0, maxThumbPosition),
    [maxThumbPosition, scrollRange],
  );
  const captureDragStart = useCallback(
    (touchPosition: number) => {
      const thumbStart = getThumbPosition();
      draggingThumb.current =
        touchPosition >= thumbStart && touchPosition <= thumbStart + thumbLength;
      dragThumbOffset.current = draggingThumb.current ? touchPosition - thumbStart : 0;
    },
    [getThumbPosition, thumbLength],
  );
  const handleDragStart = useCallback(
    (touchPosition: number) => {
      activePan.current = true;
      setDragging(true);
      setPressed(true);
      onPressChange?.(true);
      onDragStart?.();
      onPressStart?.();
      if (!draggingThumb.current) scrollToTrackPosition(touchPosition);
    },
    [onDragStart, onPressChange, onPressStart, scrollToTrackPosition],
  );
  const handleDragUpdate = useCallback(
    (touchPosition: number) => {
      if (draggingThumb.current) {
        scrollToThumbPosition(touchPosition - dragThumbOffset.current);
      } else {
        scrollToTrackPosition(touchPosition);
      }
    },
    [scrollToThumbPosition, scrollToTrackPosition],
  );
  const handleDragEnd = useCallback(() => {
    if (!activePan.current) return;
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
  const handlePressEnd = useCallback(
    (touchPosition: number) => {
      scrollToTrackPosition(touchPosition);
      setPressed(false);
      onPressChange?.(false);
      onPressEnd?.();
    },
    [onPressChange, onPressEnd, scrollToTrackPosition],
  );
  const handlePressCancel = useCallback(() => {
    if (activePan.current) return;
    setPressed(false);
    onPressChange?.(false);
    onPressEnd?.();
  }, [onPressChange, onPressEnd]);
  const panGesture = Gesture.Pan()
    .minDistance(2)
    .maxPointers(1)
    .hitSlop(hitSlop)
    .shouldCancelWhenOutside(false)
    .onBegin((event) =>
      runOnJS(captureDragStart)(axis === "vertical" ? event.y : event.x),
    )
    .onStart((event) => runOnJS(handleDragStart)(axis === "vertical" ? event.y : event.x))
    .onUpdate((event) => runOnJS(handleDragUpdate)(axis === "vertical" ? event.y : event.x))
    .onFinalize(() => runOnJS(handleDragEnd)());
  const tapGesture = Gesture.Tap()
    .maxDistance(20)
    .hitSlop(hitSlop)
    .onBegin(() => runOnJS(handlePressStart)())
    .onEnd((event, success) => {
      if (success) runOnJS(handlePressEnd)(axis === "vertical" ? event.y : event.x);
      else runOnJS(handlePressCancel)();
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

  if (containerSize <= 0 || contentSize <= containerSize || trackLength <= 0) return null;

  const vertical = axis === "vertical";
  const touchAreaLayout = vertical
    ? { height: trackLength, right: edgeInset, top: startInset, width: touchSize }
    : { bottom: edgeInset, height: touchSize, left: startInset, width: trackLength };
  const indicatorLayout = vertical
    ? { height: trackLength, width: trackWidth }
    : { height: trackWidth, width: trackLength };
  const thumbLayout = vertical
    ? {
        height: thumbLength,
        right: 0,
        top: 0,
        transform: [{ translateY: thumbPosition }],
        width: trackWidth,
      }
    : {
        bottom: 0,
        height: trackWidth,
        left: 0,
        transform: [{ translateX: thumbPosition }],
        width: thumbLength,
      };
  const thumb = (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.thumb,
        {
          ...thumbLayout,
          backgroundColor: thumbFillColor,
          borderRadius: thumbBorderRadius,
          elevation: dragging ? shadow.elevation * 1.4 : shadow.elevation,
          opacity: thumbOpacityValue,
          shadowColor: shadow.color,
          shadowOffset: shadow.offset,
          shadowOpacity: dragging ? Math.min(shadow.opacity * 1.4, 1) : shadow.opacity,
          shadowRadius: dragging ? shadow.radius * 1.4 : shadow.radius,
        },
      ]}
    />
  );

  return (
    <View pointerEvents="box-none" style={[styles.container, { zIndex }]}>
      {trackVisible ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.track,
            touchAreaLayout,
            indicatorLayout,
            {
              backgroundColor: trackFillColor,
              borderRadius: trackBorderRadius,
              opacity: trackOpacityValue,
            },
          ]}
        />
      ) : null}
      {disableGestures ? (
        <View
          onPointerEnter={web ? handlePointerEnter : undefined}
          onPointerLeave={web ? handlePointerLeave : undefined}
          pointerEvents={web ? "auto" : "none"}
          style={[styles.touchArea, touchAreaLayout]}
        >
          {thumb}
        </View>
      ) : (
        <GestureDetector gesture={gesture}>
          <View
            onPointerEnter={web ? handlePointerEnter : undefined}
            onPointerLeave={web ? handlePointerLeave : undefined}
            style={[styles.touchArea, touchAreaLayout]}
          >
            {thumb}
          </View>
        </GestureDetector>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  thumb: { elevation: 4, position: "absolute" },
  touchArea: { alignItems: "center", justifyContent: "center", position: "absolute" },
  track: { position: "absolute" },
});
