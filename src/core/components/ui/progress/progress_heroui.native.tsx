import { useEffect, useState } from "react";
import { I18nManager, View } from "react-native";
import Animated, { cancelAnimation, Easing, ReduceMotion, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent } from "../utils/slot_content";
import { resolveProgress } from "./progress_state";
import type { ProgressColor, ProgressProps, ProgressSize } from "./types";

const sizes: Record<ProgressSize, string> = { sm: "h-1 rounded-xs", md: "h-2 rounded-sm", lg: "h-3 rounded-md" };
const colors: Record<ProgressColor, string> = { default: "bg-default-foreground", accent: "bg-accent", success: "bg-success", warning: "bg-warning", danger: "bg-danger" };
export function ProgressHeroUI(props: ProgressProps) {
  const { min, max, current, fraction, isIndeterminate, valueText } = resolveProgress(props);
  const { label, labelProps, valueLabelProps, trackProps, indicatorProps, size = "md", color = "accent" } = props;
  const [width, setWidth] = useState(0);
  const progress = useSharedValue(fraction);
  const sweep = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const direction = I18nManager.isRTL ? -1 : 1;
  useEffect(() => {
    progress.value = withTiming(fraction, { duration: 300, reduceMotion: ReduceMotion.System });
    return () => cancelAnimation(progress);
  }, [fraction, progress]);
  useEffect(() => {
    cancelAnimation(sweep);
    sweep.value = 0;
    if (isIndeterminate && !reducedMotion) {
      sweep.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.cubic), reduceMotion: ReduceMotion.System }), -1, false);
    }
    return () => cancelAnimation(sweep);
  }, [isIndeterminate, reducedMotion, sweep]);
  const animatedStyle = useAnimatedStyle(() => isIndeterminate ? {
    width: "40%",
    transform: [{ translateX: reducedMotion ? width * 0.3 * direction : (sweep.value * 1.4 - 0.4) * width * direction }],
  } : { width: (progress.value * 100 + "%") as `${number}%`, transform: [{ translateX: 0 }] });
  const hasLabel = hasSlotContent(label);
  return <View {...props.herouiNativeProps} className={cn("w-full gap-1", props.className)}
    accessible role="progressbar" accessibilityLabel={props.herouiNativeProps?.accessibilityLabel ?? props.accessibilityLabel ?? (typeof label === "string" ? label : "进度")}
    accessibilityValue={isIndeterminate ? { text: valueText } : { min, max, now: current, text: valueText }}>
    {(hasLabel || (props.showValueLabel && valueText != null)) && <View className="flex-row items-center justify-between gap-2">
      {hasLabel && <Text type="body-sm" herouiNativeProps={labelProps?.herouiNativeProps} className={cn("text-sm font-medium", labelProps?.className)}>{label}</Text>}
      {props.showValueLabel && valueText != null && <Text type="body-sm" herouiNativeProps={valueLabelProps?.herouiNativeProps} className={cn("ml-auto text-sm font-medium tabular-nums", valueLabelProps?.className)}>{valueText}</Text>}
    </View>}
    <View {...trackProps?.herouiNativeProps} className={cn("relative overflow-hidden bg-default", sizes[size], trackProps?.className)}
      onLayout={event => { setWidth(event.nativeEvent.layout.width); trackProps?.herouiNativeProps?.onLayout?.(event); }}>
      <Animated.View {...indicatorProps?.herouiNativeProps} className={cn("absolute start-0 top-0 h-full", sizes[size], colors[color], indicatorProps?.className)}
        style={[indicatorProps?.herouiNativeProps?.style, animatedStyle]} />
    </View>
  </View>;
}
