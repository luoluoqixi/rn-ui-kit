import { GestureDetector } from "react-native-gesture-handler";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ColorValue,
  type ViewStyle,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";

import { useUiTheme } from "../utils";
import { isWeb } from "../utils/platform";
import { NativeSlider } from "./native_slider";
import { useSliderBehavior } from "./slider/slider";
import type { SliderProps } from "./types";

function resolveColor(color: ColorValue | undefined, fallback: string) {
  return color == null ? fallback : String(color);
}

function brightenColor(color: string, amount = 0.18) {
  const hex = color.trim().replace(/^#/, "");
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((part) => part + part)
          .join("")
      : hex;
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return color;
  const channels = [0, 2, 4].map((offset) =>
    Number.parseInt(normalized.slice(offset, offset + 2), 16),
  );
  const brightened = channels.map((channel) => Math.round(channel + (255 - channel) * amount));
  return `rgb(${brightened.join(", ")})`;
}

function withAlpha(color: string, alpha: number) {
  const hex = color.trim().replace(/^#/, "");
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((part) => part + part)
          .join("")
      : hex;
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return color;
  const channels = [0, 2, 4].map((offset) =>
    Number.parseInt(normalized.slice(offset, offset + 2), 16),
  );
  return `rgba(${channels.join(", ")}, ${alpha})`;
}

function NonNativeSlider({
  activeTrackStyle,
  className,
  colors,
  defaultValue,
  disabled = false,
  hitSlop,
  max,
  min,
  nativeHaptics,
  nativeHapticsInterval,
  onChange,
  onChangeFinished,
  onLayout,
  onValueChange,
  onValueChangeFinished,
  step,
  style,
  thumbCount,
  thumbStyle,
  trackStyle,
  value,
  ...props
}: SliderProps) {
  const sliderRef = useRef<View>(null);
  const trackWidthRef = useRef(0);
  const hasCursorOverride = className?.split(/\s+/).some((token) => token.startsWith("cursor-"));
  const [hoveredThumbIndex, setHoveredThumbIndex] = useState<number | null>(null);
  const [pressedThumbIndex, setPressedThumbIndex] = useState<number | null>(null);
  const handleActiveThumbChange = useCallback((index: number | null) => {
    setPressedThumbIndex(index);
  }, []);
  const theme = useUiTheme();
  const { handleLayout, nativeGesture, values } = useSliderBehavior({
    defaultValue,
    disabled,
    max,
    min,
    nativeHaptics,
    nativeHapticsInterval,
    onChange,
    onChangeFinished,
    onActiveThumbChange: handleActiveThumbChange,
    onLayout,
    onValueChange,
    onValueChangeFinished,
    step,
    sliderRef,
    thumbCount,
    value,
  });
  const resolvedMin = min ?? 0;
  const resolvedMax = max ?? 100;
  const range = resolvedMax - resolvedMin;
  const activeTrackColor = resolveColor(colors?.activeTrackColor, theme.primary);
  const inactiveTrackColor = resolveColor(colors?.inactiveTrackColor, theme.muted);
  const thumbColor = resolveColor(colors?.thumbColor, theme.primary);
  const activeThumbIndex = pressedThumbIndex ?? hoveredThumbIndex;
  const percentages = values.map((item) =>
    range <= 0
      ? 0
      : ((Math.min(Math.max(item, resolvedMin), resolvedMax) - resolvedMin) / range) * 100,
  );
  const activeTrackStart = percentages.length > 1 ? (percentages[0] ?? 0) : 0;
  const activeTrackEnd = percentages[percentages.length - 1] ?? 0;
  const percentagesRef = useRef(percentages);
  percentagesRef.current = percentages;
  const resolveThumbIndex = useCallback((locationX: number | undefined) => {
    const currentPercentages = percentagesRef.current;
    if (locationX == null || trackWidthRef.current <= 0 || currentPercentages.length <= 1) return 0;
    const percent = (locationX / trackWidthRef.current) * 100;
    return currentPercentages.reduce(
      (closestIndex, item, index) =>
        Math.abs(item - percent) < Math.abs(currentPercentages[closestIndex]! - percent)
          ? index
          : closestIndex,
      0,
    );
  }, []);

  useEffect(() => {
    if (!isWeb() || disabled || sliderRef.current == null) return;
    const node = sliderRef.current as unknown as HTMLElement;
    const handlePointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      if (rect.width <= 0) return;
      trackWidthRef.current = rect.width;
      setHoveredThumbIndex(resolveThumbIndex(event.clientX - rect.left));
    };
    const handlePointerLeave = () => setHoveredThumbIndex(null);

    node.addEventListener("pointermove", handlePointerMove);
    node.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [disabled, resolveThumbIndex]);

  const sliderView = (
    <Pressable
      {...props}
      className={className}
      hitSlop={hitSlop ?? (isWeb() ? undefined : { bottom: 24, top: 12 })}
      onHoverOut={() => {
        setHoveredThumbIndex(null);
      }}
      onLayout={(event) => {
        trackWidthRef.current = event.nativeEvent.layout.width;
        handleLayout(event);
      }}
      ref={sliderRef}
      style={[
        styles.root,
        isWeb() && ({ userSelect: "none" } as unknown as ViewStyle),
        isWeb() && ({ touchAction: "none" } as unknown as ViewStyle),
        isWeb() && !hasCursorOverride && ({ cursor: "default" } as unknown as ViewStyle),
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={[styles.track, { backgroundColor: inactiveTrackColor }, trackStyle]}>
        <View
          style={[
            styles.activeTrack,
            {
              backgroundColor: activeTrackColor,
              left: `${activeTrackStart}%`,
              width: `${Math.max(0, activeTrackEnd - activeTrackStart)}%`,
            },
            activeTrackStyle,
          ]}
        />
      </View>
      {values.map((_item, index) => {
        const percent = percentages[index] ?? 0;
        return (
          <View
            key={`thumb-${index}`}
            pointerEvents="none"
            style={[
              styles.thumb,
              {
                backgroundColor:
                  activeThumbIndex === index ? brightenColor(thumbColor) : thumbColor,
                borderColor:
                  activeThumbIndex === index ? theme.foreground : withAlpha(theme.foreground, 0.18),
                left: `${percent}%`,
              },
              thumbStyle,
            ]}
          />
        );
      })}
    </Pressable>
  );

  return nativeGesture ? (
    <GestureDetector gesture={nativeGesture}>{sliderView}</GestureDetector>
  ) : (
    sliderView
  );
}

export function Slider({ native = true, ...props }: SliderProps) {
  // Web has no native Expo slider host; always use the pointer/gesture implementation there.
  if (!native || Platform.OS === "web") return <NonNativeSlider {...props} />;
  return <NativeSlider {...props} />;
}

const styles = StyleSheet.create({
  activeTrack: { borderRadius: 3, height: "100%", position: "absolute" },
  disabled: { opacity: 0.5 },
  root: { height: 28, justifyContent: "center", minWidth: 100, width: "100%" },
  thumb: {
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    marginLeft: -12,
    position: "absolute",
    width: 24,
  },
  track: { borderRadius: 3, height: 6, overflow: "hidden", width: "100%" },
});
