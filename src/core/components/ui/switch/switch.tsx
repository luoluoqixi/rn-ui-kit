import { Platform, Pressable, View } from "react-native";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { isIos15 } from "../utils/platform";
import { resolveRenderProp } from "../utils/render";
import { useFieldValue } from "../utils/field_state";
import { SwitchHeroUI } from "./switch_heroui";
import { SwitchNative } from "./switch_native";
import { SwitchLabel } from "./switch_label";
import type { SwitchProps } from "./types";

export function Switch(props: SwitchProps) {
  const { isSelected, defaultSelected = false, onSelectedChange, isDisabled = false,
    native = Platform.OS !== "web", size = "md", labelPosition = "right" } = props;
  const [selected, setSelected] = useFieldValue(isSelected, defaultSelected, onSelectedChange);
  const system = native && Platform.OS !== "web";
  const haptics = useResolvedNativeHaptics(props.nativeHaptics, { defaultEnabled: true });
  const select = (next: boolean, fromLabel = false) => {
    if (isDisabled) return;
    setSelected(next);
    // iOS 16+ system toggles provide their own feedback; external labels do not.
    if (fromLabel || !system || Platform.OS !== "ios" || isIos15()) triggerNativeHaptics(haptics);
  };
  const context = { isSelected: selected, isDisabled };
  const resolvedLabel = resolveRenderProp(props.label, context);
  const resolvedDescription = resolveRenderProp(props.description, context);
  if (!system) return <SwitchHeroUI {...props} size={size} selected={selected} onSelect={select}
    resolvedLabel={resolvedLabel} resolvedDescription={resolvedDescription} />;
  const control = <SwitchNative disabled={isDisabled} value={selected} onValueChange={select}
    nativeComposeProps={props.nativeComposeProps} nativeSwiftProps={props.nativeSwiftProps}
    style={[props.style, size !== "md" && { transform: [{ scale: size === "sm" ? 0.9375 : 1.125 }] }]} />;
  if (resolvedLabel == null && resolvedDescription == null) return control;
  return <View nativeID={props.nativeID} className={cn("flex-row items-center self-start gap-3",
    labelPosition === "left" && "flex-row-reverse", props.className, props.containerClassName)}>
    {control}
    <Pressable disabled={isDisabled} onPress={() => select(!selected, true)}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole="switch" accessibilityState={{ checked: selected, disabled: isDisabled }}
      className={cn("min-w-0 shrink gap-1", isDisabled && "opacity-50")}>
      <SwitchLabel content={resolvedLabel} labelProps={props.labelProps} labelClassName={props.labelClassName} />
      {resolvedDescription != null && <Text className={cn("text-sm text-muted", props.descriptionClassName)}>{resolvedDescription}</Text>}
    </Pressable>
  </View>;
}
