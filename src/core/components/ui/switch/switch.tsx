import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { isIos15 } from "../utils/platform";
import { resolveRenderProp } from "../utils/render";
import * as SwitchPrimitives from "@rn-primitives/switch";
import * as React from "react";
import { Platform, Pressable, View } from "react-native";

import { SwitchNative } from "./switch_native";
import type { SwitchProps } from "./types";

function Switch({
  className,
  containerClassName,
  defaultChecked = false,
  label,
  labelClassName,
  labelPosition = "right",
  native = Platform.OS !== "web",
  nativeComposeProps,
  nativeHaptics,
  nativeSwiftProps,
  onCheckedChange,
  ...props
}: SwitchProps) {
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
    defaultEnabled: true,
  });
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const checked = props.checked ?? uncontrolledChecked;
  // Native iOS switches provide their own haptics from iOS 16 onward.
  const shouldTriggerDirectHaptics = native !== true || Platform.OS !== "ios" || isIos15();
  const handleCheckedChange = (nextChecked: boolean, fromLabel = false) => {
    if (fromLabel || shouldTriggerDirectHaptics) {
      triggerNativeHaptics(resolvedNativeHaptics);
    }
    if (props.checked === undefined) setUncontrolledChecked(nextChecked);
    onCheckedChange?.(nextChecked);
  };
  const handleLabelPress = () => {
    if (props.disabled) return;
    handleCheckedChange(!checked, true);
  };
  const renderedLabel = resolveRenderProp(label, {
    checked,
    disabled: props.disabled,
  });

  const switchControl =
    native === true && Platform.OS !== "web" ? (
      <SwitchNative
        disabled={props.disabled}
        nativeComposeProps={nativeComposeProps}
        nativeSwiftProps={nativeSwiftProps}
        onValueChange={handleCheckedChange}
        style={props.style as never}
        value={checked}
      />
    ) : (
      <SwitchPrimitives.Root
        className={cn(
          "flex h-[1.15rem] w-8 shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm shadow-black/5",
          Platform.select({
            web: "focus-visible:border-ring focus-visible:ring-ring/50 peer inline-flex outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed",
          }),
          checked ? "bg-primary" : "bg-input dark:bg-input/80",
          props.disabled && "opacity-50",
          className,
        )}
        {...props}
        checked={checked}
        onCheckedChange={handleCheckedChange}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "bg-background size-4 rounded-full transition-transform",
            Platform.select({
              web: "pointer-events-none block ring-0",
            }),
            checked
              ? "dark:bg-primary-foreground translate-x-3.5"
              : "dark:bg-foreground translate-x-0",
          )}
        />
      </SwitchPrimitives.Root>
    );

  if (renderedLabel == null) return switchControl;

  return (
    <View
      className={cn(
        "flex-row items-center self-start",
        labelPosition === "left" && "flex-row-reverse",
        props.disabled && "opacity-50",
        containerClassName,
      )}
    >
      {switchControl}
      <Pressable
        className={cn("self-stretch justify-center", labelPosition === "left" ? "pr-3" : "pl-3")}
        disabled={props.disabled}
        onPress={handleLabelPress}
      >
        {typeof renderedLabel === "string" || typeof renderedLabel === "number" ? (
          <Text className={cn("text-sm font-medium", labelClassName)}>{renderedLabel}</Text>
        ) : (
          renderedLabel
        )}
      </Pressable>
    </View>
  );
}

const SwitchComponent = Object.assign(Switch, {
  Root: Switch,
});

export { SwitchComponent as Switch };
