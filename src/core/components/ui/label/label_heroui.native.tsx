import { Pressable } from "react-native";
import { Label } from "heroui-native/label";
import { cn } from "../utils/cn";
import { useDefaultTextStyle } from "../provider/font_provider";
import type { LabelProps } from "./types";
export function LabelHeroUI({ children, className, textClassName, nativeID, isRequired, isInvalid, isDisabled = false, controlRef, herouiNativeProps, textProps }: LabelProps) {
  const classes = cn(textClassName, textProps?.className);
  const font = useDefaultTextStyle(textProps?.herouiNativeProps?.style, classes);
  return <Label {...herouiNativeProps} className={className} isRequired={isRequired} isInvalid={isInvalid} isDisabled={isDisabled} asChild
    accessibilityState={{ ...herouiNativeProps?.accessibilityState, disabled: isDisabled }}
    onPress={event => {
      herouiNativeProps?.onPress?.(event);
      if (!event.defaultPrevented) controlRef?.current?.focus();
    }}>
    <Pressable disabled={isDisabled}><Label.Text {...textProps?.herouiNativeProps} nativeID={nativeID} className={classes} style={font}>{children}</Label.Text></Pressable>
  </Label>;
}
