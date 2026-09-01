import { Pressable, PressableProps, StyleProp, TextStyle } from "react-native";
import { type ButtonProps } from "../../../button";
import { Text } from "../../../text";

import { useTrueSheetStackHost } from "./stack_context";
import { ReactNode } from "react";
import React from "react";

function normalizeButtonChildren(
  children: React.ReactNode,
  textClassName?: string,
  textStyle?: StyleProp<TextStyle>,
): React.ReactNode {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <Text className={textClassName} style={textStyle}>
        {child}
      </Text>
    ) : (
      child
    ),
  ) as React.ReactNode;
}

export type HeaderCloseButtonType = PressableProps & {
  title?: ReactNode;
  titleClassName?: string;
  titleStyle?: StyleProp<TextStyle>;
};

/** 原生 Stack `headerRight`：关闭当前 True Sheet。 */
export function TrueSheetStackHeaderCloseButton({
  title,
  titleClassName,
  titleStyle,
  onPress,
  ...buttonProps
}: HeaderCloseButtonType) {
  const { onRequestClose } = useTrueSheetStackHost();
  const titleNode = title ?? (buttonProps.children == null ? "关闭" : undefined);
  const handlePress: NonNullable<ButtonProps["onPress"]> = (event) => {
    onPress?.(event);
    if (!event.defaultPrevented) {
      onRequestClose();
    }
  };

  return (
    <Pressable
      {...buttonProps}
      aria-label={buttonProps["aria-label"] ?? "Close"}
      onPress={handlePress}
    >
      {
        (typeof titleNode === "function"
          ? titleNode
          : normalizeButtonChildren(titleNode, titleClassName, titleStyle)) as React.ReactNode
      }
    </Pressable>
  );
}
