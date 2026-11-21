import { LinkButton } from "heroui-native/link-button";
import { Linking } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
import {
  triggerNativeHaptics,
  useResolvedNativeHaptics,
} from "../utils/haptics";
import type { LinkProps } from "./types";
export function LinkHeroUI({
  children,
  href,
  size = "md",
  isDisabled,
  onPress,
  nativeHaptics,
  className,
  labelClassName,
  herouiNativeProps,
}: LinkProps) {
  const haptics = useResolvedNativeHaptics(nativeHaptics);
  const labelClasses = cn("text-accent", labelClassName);
  const font = useDefaultTextStyle(undefined, labelClasses);
  return (
    <LinkButton
      {...herouiNativeProps}
      size={size}
      isDisabled={isDisabled}
      className={cn("self-start", className)}
      accessibilityRole="link"
      onPress={(event) => {
        if (isDisabled) return;
        if (typeof herouiNativeProps?.onPress === "function")
          herouiNativeProps.onPress(event);
        if (event.defaultPrevented) return;
        onPress?.();
        triggerNativeHaptics(haptics);
        if (href) void Linking.openURL(href);
      }}
    >
      <LinkButton.Label className={labelClasses} style={font}>
        {children}
      </LinkButton.Label>
    </LinkButton>
  );
}
