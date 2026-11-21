import { Platform, View } from "react-native";
import { ToggleHeroUI } from "../toggle/toggle_heroui.native";
import { useKeySelection } from "../utils/key_selection";
import { cn } from "../utils/cn";
import type { ToggleGroupItemData, ToggleGroupProps } from "./types";
import { resolveToggleGroupLayout } from "./toggle_group_layout";

function withAndroidConnectedCorners(
  props: ToggleGroupItemData["herouiNativeProps"], index: number, count: number,
): ToggleGroupItemData["herouiNativeProps"] {
  // RN 0.83 Android swaps startEnd/endStart compared with iOS/CSS. The older
  // top/bottom + start/end props preserve the standard LTR/RTL mapping.
  const corners = {
    ...(index > 0 && { borderTopStartRadius: 0, borderBottomStartRadius: 0 }),
    ...(index < count - 1 && { borderTopEndRadius: 0, borderBottomEndRadius: 0 }),
  };
  const style = props?.style;
  return { ...props, style: typeof style === "function"
    ? state => [corners, style(state)] : [corners, style] };
}

export function ToggleGroupHeroUI(p: ToggleGroupProps) {
  const state = useKeySelection({ ...p, selectionMode: p.selectionMode ?? "single" }, p.items);
  const vertical = p.orientation === "vertical";
  const androidHorizontal = Platform.OS === "android" && !vertical;
  const layout = resolveToggleGroupLayout(p);
  return <View {...p.herouiNativeProps} accessibilityRole="toolbar" accessibilityLabel={p.accessibilityLabel}
    style={[p.herouiNativeProps?.style, { gap: layout.gap }]}
    className={cn(vertical ? "flex-col" : "flex-row", !p.fullWidth && "self-start", p.className)}>
    {p.items.map((item, index) => <View key={item.id}
      className={cn("relative", !vertical && p.fullWidth && "min-w-0 flex-1", (vertical || p.fullWidth) && "self-stretch")}>
      <ToggleHeroUI {...item} size={p.size} variant={p.variant}
      herouiNativeProps={androidHorizontal && !layout.isDetached && p.items.length > 1
        ? withAndroidConnectedCorners(item.herouiNativeProps, index, p.items.length) : item.herouiNativeProps}
      isScaleDisabled={item.isScaleDisabled ?? layout.isScaleDisabled}
      isDisabled={!!p.isDisabled || state.disabled.has(item.id)} isSelected={state.selected.has(item.id)}
      nativeHaptics={item.nativeHaptics ?? p.nativeHaptics}
      onSelectedChange={() => state.toggle(item.id)}
      className={cn((vertical || p.fullWidth) && "self-stretch",
        !layout.isDetached && !androidHorizontal && index > 0 && (vertical ? "rounded-t-none" : "rounded-s-none"),
        !layout.isDetached && !androidHorizontal && index < p.items.length - 1 && (vertical ? "rounded-b-none" : "rounded-e-none"), item.className)} />
      {!layout.isDetached && index > 0 && <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants"
        className={cn("absolute rounded-sm opacity-15", state.selected.has(item.id) ? "bg-accent-soft-foreground" : "bg-foreground")}
        style={vertical
          ? { top: 0, start: "25%", width: "50%", height: 1 }
          : { start: 0, top: "25%", height: "50%", width: 1 }} />}
    </View>)}
  </View>;
}
