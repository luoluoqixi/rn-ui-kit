import {
  Button as ComposeButton,
  FilledTonalButton,
  Host,
  OutlinedButton,
  Text as ComposeText,
  TextButton,
} from "@luoluoqixi/expo-ui-55/jetpack-compose";
import {
  height as composeHeight,
  size as composeSize,
  width as composeWidth,
} from "@luoluoqixi/expo-ui-55/jetpack-compose/modifiers";
import type * as React from "react";

import type { ButtonNativeProps } from "./button_native";

function resolveContent(children: React.ReactNode, title: string) {
  if (typeof children === "string" || typeof children === "number") {
    return <ComposeText>{String(children)}</ComposeText>;
  }
  return <ComposeText>{title}</ComposeText>;
}

function getButtonStyle(
  variant: ButtonNativeProps["variant"],
  colors: NonNullable<ButtonNativeProps["androidColors"]>,
) {
  if (variant === "outline") {
    return {
      Component: OutlinedButton,
      colors: { contentColor: colors.primary },
    } as const;
  }
  if (variant === "secondary") {
    return {
      Component: FilledTonalButton,
      colors: {
        containerColor: colors.secondary,
        contentColor: colors.secondaryForeground,
      },
    } as const;
  }
  if (variant === "ghost" || variant === "link" || variant === "icon") {
    return {
      Component: TextButton,
      colors: { contentColor: colors.primary },
    } as const;
  }
  return {
    Component: ComposeButton,
    colors: {
      containerColor: variant === "destructive" ? colors.destructive : colors.primary,
      contentColor: colors.primaryForeground,
    },
  } as const;
}

function getButtonSizeModifiers(buttonSize: ButtonNativeProps["buttonSize"]) {
  if (buttonSize?.width != null && buttonSize.height != null) {
    return [composeSize(buttonSize.width, buttonSize.height)];
  }
  if (buttonSize?.width != null) {
    return [composeWidth(buttonSize.width)];
  }
  if (buttonSize?.height != null) {
    return [composeHeight(buttonSize.height)];
  }
  return undefined;
}

/** Expo UI Jetpack Compose renderer used by the Android native Button mode. */
export function ButtonNative({
  androidColors,
  buttonSize,
  buttonColor,
  children,
  disabled: isDisabled,
  nativeComposeProps,
  onPress,
  style,
  title,
  variant,
}: ButtonNativeProps) {
  const colors = androidColors ?? {
    destructive: "#dc2626",
    primary: "#27272a",
    primaryForeground: "#fafafa",
    secondary: "#f4f4f5",
    secondaryForeground: "#27272a",
  };
  const { Component, colors: buttonColors } = getButtonStyle(variant, colors);
  const content = resolveContent(children, title);
  const sizeModifiers = getButtonSizeModifiers(buttonSize);
  const {
    colors: overriddenColors,
    enabled: overriddenEnabled,
    modifiers: overriddenModifiers,
    ...composeButtonProps
  } = nativeComposeProps ?? {};
  const resolvedButtonColors =
    buttonColor == null
      ? overriddenColors ?? buttonColors
      : { ...(overriddenColors ?? buttonColors), contentColor: buttonColor };

  return (
    <Host matchContents style={style}>
      <Component
        {...composeButtonProps}
        colors={resolvedButtonColors as any}
        enabled={overriddenEnabled ?? !isDisabled}
        modifiers={overriddenModifiers ?? sizeModifiers}
        onClick={onPress}
      >
        {content}
      </Component>
    </Host>
  );
}
