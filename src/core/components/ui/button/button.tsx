import { forwardRef, type ComponentRef } from "react";
import { Platform, type Pressable } from "react-native";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { useUiTheme } from "../utils/theme";
import { ButtonHeroUI } from "./button_heroui";
import { ButtonNative, type ButtonNativeProps } from "./button_native";
import type { ButtonProps, ButtonVariant } from "./types";

const systemVariants: Record<ButtonVariant, ButtonNativeProps["variant"]> = {
  primary: "default", secondary: "secondary", tertiary: "secondary", outline: "outline",
  ghost: "ghost", danger: "destructive", "danger-soft": "secondary",
};

function SystemButton({
  nativeMatchContents, nativeButtonStyle = "automatic", nativeComposeProps, nativeSwiftProps,
  nativeSystemImage, nativeSystemImageSize, buttonSize, buttonColor, children, title,
  variant = "primary", disabled, style, onPress, accessibilityLabel, "aria-label": ariaLabel,
}: ButtonProps) {
  const theme = useUiTheme();
  const resolvedTitle = title ?? (typeof children === "string" || typeof children === "number" ? String(children) : "");
  return <ButtonNative
    matchContents={nativeMatchContents}
    accessibilityLabel={ariaLabel ?? accessibilityLabel}
    androidColors={{
      destructive: theme.danger, primary: theme.accent, primaryForeground: theme.accentForeground,
      secondary: theme.default,
      secondaryForeground: variant === "danger-soft" ? theme.danger : theme.defaultForeground,
    }}
    buttonSize={buttonSize}
    buttonColor={buttonColor}
    children={title == null && (typeof children === "string" || typeof children === "number") ? children : undefined}
    disabled={!!disabled}
    nativeButtonStyle={nativeButtonStyle}
    nativeComposeProps={nativeComposeProps}
    nativeOpacity={disabled ? 0.5 : 1}
    nativeSystemImage={nativeSystemImage}
    nativeSystemImageSize={nativeSystemImageSize}
    nativeSwiftProps={nativeSwiftProps}
    // Expo UI's system callbacks have no RN gesture payload; retain the existing native API.
    onPress={() => onPress?.({ defaultPrevented: false } as Parameters<NonNullable<ButtonProps["onPress"]>>[0])}
    style={typeof style === "function" ? style({ hovered: false, pressed: false }) : style}
    title={resolvedTitle}
    variant={systemVariants[variant]}
  />;
}

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(function Button(
  { native, nativeHaptics, disabled, isDisabled, loading = false, onPress, ...props }, ref,
) {
  const haptics = useResolvedNativeHaptics(nativeHaptics);
  const unavailable = !!(disabled || isDisabled || loading);
  const handlePress: ButtonProps["onPress"] = (event) => {
    onPress?.(event);
    if (!event.defaultPrevented) triggerNativeHaptics(haptics);
  };
  if (native === true && Platform.OS !== "web")
    return <SystemButton {...props} disabled={unavailable} onPress={handlePress} />;
  return <ButtonHeroUI {...props} loading={loading} disabled={unavailable} onPress={handlePress} ref={ref} />;
});
