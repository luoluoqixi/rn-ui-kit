import * as React from "react";
import { Platform, View, type PressableStateCallbackType } from "react-native";

import { Button } from "../button";
import {
  DROPDOWN_TRIGGER_DISABLE_OPACITY,
  DROPDOWN_TRIGGER_PRESS_OPACITY,
  DROPDOWN_TRIGGER_WEB_HOVER_OPACITY,
  DROPDOWN_TRIGGER_WEB_PRESS_OPACITY,
  NativeTrigger,
} from "../native_trigger";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import type { DropdownProps } from "./types";

export type DropdownTriggerContext = { native: boolean; open: boolean };

export const DropdownNativeTrigger = React.forwardRef<
  View,
  {
    className?: string;
    containerStyle: DropdownProps["nativeTriggerContainerStyle"];
    content: DropdownProps["nativeTriggerContent"];
    disabled?: boolean | null;
    icon: DropdownProps["nativeTriggerIcon"];
    label: DropdownProps["triggerLabel"];
    labelProps: DropdownProps["nativeTriggerLabelProps"];
    nativeTriggerFeedbackOpacity?: DropdownProps["nativeTriggerFeedbackOpacity"];
    nativeTriggerHoverBackground?: DropdownProps["nativeTriggerHoverBackground"];
    nativeTriggerProps?: DropdownProps["nativeTriggerProps"];
    keepPressedOpacity?: boolean;
    open: boolean;
    pressedOpacity?: boolean;
    trigger: DropdownProps["trigger"];
  } & Omit<
    React.ComponentProps<typeof NativeTrigger>,
    | "active"
    | "containerStyle"
    | "content"
    | "disabled"
    | "icon"
    | "keepPressedOpacity"
    | "label"
    | "labelProps"
    | "pressedOpacity"
  >
>(function DropdownNativeTrigger(
  {
    className,
    containerStyle,
    content,
    disabled,
    icon,
    keepPressedOpacity = Platform.OS === "web",
    label,
    labelProps,
    nativeTriggerFeedbackOpacity,
    nativeTriggerHoverBackground = true,
    nativeTriggerProps,
    open,
    pressedOpacity = true,
    style,
    trigger,
    ...props
  },
  ref,
) {
  const hasFullWidthClass = className?.split(/\s+/).includes("w-full") === true;
  return (
    <NativeTrigger
      {...props}
      {...nativeTriggerProps}
      active={open}
      className={cn(
        Platform.OS === "web" && "transition-opacity",
        Platform.OS === "web" &&
          nativeTriggerHoverBackground &&
          cn(
            "rounded-md hover:bg-accent hover:text-accent-foreground disabled:hover:bg-transparent disabled:hover:text-foreground",
            open && "bg-accent text-accent-foreground",
          ),
        nativeTriggerProps?.className,
        className,
      )}
      containerStyle={containerStyle}
      content={content}
      disabled={disabled ?? undefined}
      feedbackOpacity={{
        disabled: DROPDOWN_TRIGGER_DISABLE_OPACITY,
        press: DROPDOWN_TRIGGER_PRESS_OPACITY,
        webHover: DROPDOWN_TRIGGER_WEB_HOVER_OPACITY,
        webPress: DROPDOWN_TRIGGER_WEB_PRESS_OPACITY,
        ...nativeTriggerFeedbackOpacity,
      }}
      icon={icon}
      keepPressedOpacity={keepPressedOpacity}
      label={
        resolveRenderProp(label, { native: true, open }) ??
        resolveRenderProp(trigger, { native: true, open }) ??
        ""
      }
      labelProps={labelProps}
      pressedOpacity={pressedOpacity}
      ref={ref}
      style={(state) => [
        {
          alignItems: "center",
          alignSelf: hasFullWidthClass ? "stretch" : "flex-start",
          width: hasFullWidthClass ? "100%" : undefined,
        },
        typeof style === "function" ? style(state) : style,
        typeof nativeTriggerProps?.style === "function"
          ? nativeTriggerProps.style(state)
          : nativeTriggerProps?.style,
      ]}
    />
  );
});

export const DropdownDefaultTrigger = React.forwardRef<
  React.ComponentRef<typeof Button>,
  {
    className?: string;
    disabled?: boolean | null;
    label?: React.ReactNode;
    props?: DropdownProps["triggerProps"];
  } & Omit<React.ComponentProps<typeof Button>, "children" | "className" | "disabled">
>(function DropdownDefaultTrigger({ className, disabled, label, props, ...buttonProps }, ref) {
  const userClassName = cn(props?.className, className);
  const hasCursorOverride = userClassName.split(/\s+/).some((token) => token.startsWith("cursor-"));
  const resolvedButtonStyle = buttonProps.style ?? props?.style;
  return (
    <Button
      variant="outline"
      {...(props as object)}
      {...buttonProps}
      className={cn(
        "self-start",
        Platform.OS === "web" && "cursor-default",
        props?.className,
        className,
      )}
      disabled={disabled ?? props?.disabled}
      ref={ref}
      style={(state) => [
        typeof resolvedButtonStyle === "function"
          ? (resolvedButtonStyle as (state: PressableStateCallbackType) => unknown)(state)
          : resolvedButtonStyle,
        hasCursorOverride ? undefined : ({ cursor: "default" } as any),
      ]}
    >
      {label ?? ""}
    </Button>
  );
});

export function resolveDropdownTrigger(
  trigger: DropdownProps["trigger"],
  context: DropdownTriggerContext,
  disabled?: boolean | null,
) {
  const element = resolveRenderProp(trigger, context);
  if (!React.isValidElement(element)) return element;
  const triggerElement = element as React.ReactElement<{ disabled?: boolean }>;
  return React.cloneElement(triggerElement, {
    disabled: disabled ?? triggerElement.props.disabled,
  });
}

export function DropdownDisabledTrigger({ children }: { children?: React.ReactNode }) {
  return <View pointerEvents="none">{children}</View>;
}
