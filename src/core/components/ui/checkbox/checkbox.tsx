import { Icon } from "../icon";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { resolveRenderProp } from "../utils/render";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { Check } from "lucide-react-native";
import * as React from "react";
import { Platform, Pressable, StyleSheet, View, type GestureResponderEvent } from "react-native";
import type { CheckboxProps, CheckboxRenderContext, CheckboxSize } from "./types";
import { useUiTheme } from "../utils/theme";

const DEFAULT_HIT_SLOP = 24;

const checkboxSizeClasses: Record<CheckboxSize, string> = {
  "default": "size-5",
  "2xs": "size-3",
  "xs": "size-3.5",
  "sm": "size-4",
  "md": "size-5",
  "lg": "size-6",
  "xl": "size-7",
  "2xl": "size-8",
};

const checkboxIconSizes: Record<CheckboxSize, number> = {
  "default": 14,
  "2xs": 10,
  "xs": 11,
  "sm": 12,
  "md": 14,
  "lg": 18,
  "xl": 21,
  "2xl": 24,
};

function withAlpha(color: string, alpha: number): string {
  const value = color.trim();
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (hex != null) {
    const expanded =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    const channels = [0, 2, 4].map((index) =>
      Number.parseInt(expanded.slice(index, index + 2), 16),
    );
    return `rgba(${channels.join(",")},${alpha})`;
  }

  const rgb = value.match(
    /^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,[\d.]+)?\s*\)$/i,
  );
  return rgb == null ? value : `rgba(${rgb[1]},${rgb[2]},${rgb[3]},${alpha})`;
}

function Checkbox({
  className,
  checkedClassName,
  indicatorClassName,
  indicatorProps,
  iconClassName,
  iconProps,
  nativeHaptics,
  label,
  description,
  labelPosition = "right",
  card = false,
  containerClassName,
  labelClassName,
  descriptionClassName,
  onCheckedChange,
  onPress,
  checked,
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  size = "default",
  ...props
}: CheckboxProps) {
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
    defaultEnabled: true,
  });

  const hasContainer = label != null || description != null || card;
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const theme = useUiTheme();
  const resolvedChecked = checked ?? uncontrolledChecked;
  const renderContext: CheckboxRenderContext = {
    card,
    checked: resolvedChecked,
    disabled: props.disabled,
    size,
  };
  const renderedLabel = resolveRenderProp(label, renderContext);
  const renderedDescription = resolveRenderProp(description, renderContext);
  const resolvedRootStyle =
    typeof props.style === "function"
      ? props.style({ hovered: isHovered, pressed: isPressed })
      : props.style;
  const pressedRootStyle =
    isPressed && !resolvedChecked && !props.disabled
      ? { backgroundColor: theme.accent04 }
      : undefined;
  const rootStyle = StyleSheet.flatten([resolvedRootStyle, pressedRootStyle]);
  const pressedCheckedBackground = withAlpha(theme.accent, 0.85);
  const indicatorStyle = StyleSheet.flatten([
    indicatorProps?.style,
    isPressed && resolvedChecked && !props.disabled
      ? { backgroundColor: pressedCheckedBackground }
      : undefined,
  ]);

  const handleCheckedChange = (nextChecked: boolean) => {
    if (checked === undefined) {
      setUncontrolledChecked(nextChecked);
    }
    triggerNativeHaptics(resolvedNativeHaptics);
    onCheckedChange?.(nextChecked);
  };

  const normalizeCheckboxChildren = (value: React.ReactNode, className: string) =>
    React.Children.map(value, (child) =>
      typeof child === "string" || typeof child === "number" ? (
        <Text className={className}>{child}</Text>
      ) : (
        child
      ),
    );

  if (hasContainer) {
    const toggle = (event: GestureResponderEvent) => {
      onPress?.(event);
      if (event.defaultPrevented || props.disabled) return;
      handleCheckedChange(resolvedChecked === true ? false : true);
    };

    const labelContent = normalizeCheckboxChildren(
      renderedLabel,
      cn("text-sm font-medium", Platform.select({ web: "leading-none" }), labelClassName),
    );
    const descriptionContent = normalizeCheckboxChildren(
      renderedDescription,
      cn("text-muted text-sm", descriptionClassName),
    );

    return (
      <Pressable
        className={cn(
          "group flex-row gap-3",
          card
            ? "items-center"
            : renderedDescription != null
              ? "items-start self-start"
              : "items-center self-start",
          labelPosition === "left" && "flex-row-reverse",
          card && "rounded-lg border border-border p-3",
          card && resolvedChecked === true && "border-accent bg-accent/10",
          card &&
            resolvedChecked === true &&
            !props.disabled &&
            Platform.select({
              web: "hover:bg-accent/15 active:bg-accent/15",
              native: "active:bg-accent/15",
            }),
          card &&
            resolvedChecked !== true &&
            !props.disabled &&
            Platform.select({
              web: "hover:bg-accent-soft/50 active:bg-accent-soft/50",
            }),
          props.disabled && "opacity-50",
          containerClassName,
        )}
        disabled={props.disabled}
        onPress={toggle}
        onPressIn={(event) => {
          setIsPressed(true);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          setIsPressed(false);
          onPressOut?.(event);
        }}
        onHoverIn={(event) => {
          setIsHovered(true);
          onHoverIn?.(event);
        }}
        onHoverOut={(event) => {
          setIsHovered(false);
          onHoverOut?.(event);
        }}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: resolvedChecked,
          disabled: props.disabled,
        }}
      >
        <CheckboxPrimitive.Root
          {...props}
          checked={resolvedChecked}
          className={cn(
            "group border-field-border dark:bg-field-border/30 shrink-0 rounded-[4px] border shadow-sm shadow-black/5",
            checkboxSizeClasses[size],
            Platform.select({
              web: !resolvedChecked && "group-hover:bg-accent-soft/50 group-active:bg-accent-soft/50",
              native: "overflow-hidden",
            }),
            renderedDescription != null && !card && "mt-0.5",
            resolvedChecked === true && cn("border-accent", checkedClassName),
            props.disabled && "opacity-50",
            className,
          )}
          style={rootStyle}
          pointerEvents="none"
          accessible={false}
          onCheckedChange={() => undefined}
        >
          <CheckboxPrimitive.Indicator
            {...indicatorProps}
            className={cn(
              "bg-accent h-full w-full items-center justify-center",
              resolvedChecked &&
                Platform.select({
                  web: "group-hover:bg-accent/85 group-active:bg-accent/85",
                }),
              indicatorClassName,
              indicatorProps?.className,
            )}
            style={indicatorStyle}
          >
            <Icon
              as={Check}
              {...iconProps}
              size={iconProps?.size ?? checkboxIconSizes[size]}
              strokeWidth={iconProps?.strokeWidth ?? (Platform.OS === "web" ? 2.5 : 3.5)}
              color={iconProps?.color}
              className={cn("text-accent-foreground", iconClassName, iconProps?.className)}
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <View className={cn("min-w-0 justify-center gap-2", card && "flex-1")}>
          {labelContent}
          {descriptionContent}
        </View>
      </Pressable>
    );
  }

  return (
    <CheckboxPrimitive.Root
      className={cn(
        "group border-field-border dark:bg-field-border/30 shrink-0 rounded-[4px] border shadow-sm shadow-black/5",
        checkboxSizeClasses[size],
        Platform.select({
          web: "focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger peer cursor-default outline-none transition-shadow focus-visible:ring-[3px] disabled:cursor-not-allowed",
          native: "overflow-hidden",
        }),
        !resolvedChecked &&
          Platform.select({
            native: "active:bg-accent-soft/50",
            web: "hover:bg-accent-soft/50 active:bg-accent-soft/50",
          }),
        resolvedChecked && cn("border-accent", checkedClassName),
        props.disabled && "opacity-50",
        className,
      )}
      style={rootStyle}
      hitSlop={DEFAULT_HIT_SLOP}
      checked={resolvedChecked}
      onPress={onPress}
      onPressIn={(event) => {
        setIsPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setIsPressed(false);
        onPressOut?.(event);
      }}
      onHoverIn={(event) => {
        setIsHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setIsHovered(false);
        onHoverOut?.(event);
      }}
      onCheckedChange={(nextChecked) => {
        if (checked === undefined) {
          setUncontrolledChecked(nextChecked);
        }
        triggerNativeHaptics(resolvedNativeHaptics);
        onCheckedChange?.(nextChecked);
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        {...indicatorProps}
        className={cn(
          "bg-accent h-full w-full items-center justify-center",
          resolvedChecked &&
            Platform.select({
              web: "group-hover:bg-accent/85 group-active:bg-accent/85",
            }),
          indicatorClassName,
          indicatorProps?.className,
        )}
        style={indicatorStyle}
      >
        <Icon
          as={Check}
          {...iconProps}
          size={iconProps?.size ?? checkboxIconSizes[size]}
          strokeWidth={iconProps?.strokeWidth ?? (Platform.OS === "web" ? 2.5 : 3.5)}
          color={iconProps?.color}
          className={cn("text-accent-foreground", iconClassName, iconProps?.className)}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
