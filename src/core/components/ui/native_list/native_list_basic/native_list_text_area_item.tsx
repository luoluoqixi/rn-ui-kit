import * as React from "react";
import { StyleSheet } from "react-native";
import { NativeListCustomItem } from "../native_list_basic";
import { Textarea } from "../../textarea";
import { useNativeListEditMode } from "../edit_mode";
import type { NativeListTextAreaItemProps } from "../types";

export function NativeListTextAreaItem(props: NativeListTextAreaItemProps) {
  const { textAreaProps, ...itemProps } = props;
  const editMode = useNativeListEditMode();
  const disabled = Boolean(itemProps.disabled || textAreaProps.disabled);
  const textAreaHeight = resolveTextAreaHeight(textAreaProps);
  return (
    <NativeListCustomItem {...itemProps} disabled={disabled}>
      <Textarea
        {...textAreaProps}
        disabled={disabled || editMode}
        unstyled
        style={[
          {
            height: textAreaHeight,
            minHeight: textAreaHeight,
            width: "100%",
          },
          textAreaProps.style,
        ]}
      />
    </NativeListCustomItem>
  );
}

function resolveTextAreaHeight(textAreaProps: NativeListTextAreaItemProps["textAreaProps"]) {
  const style = StyleSheet.flatten(textAreaProps.style) as {
    height?: unknown;
    minHeight?: unknown;
  };
  const numberOfLines =
    typeof textAreaProps.numberOfLines === "number" ? textAreaProps.numberOfLines : 4;
  const configuredHeight =
    typeof style?.height === "number"
      ? style.height
      : typeof style?.minHeight === "number"
        ? style.minHeight
        : undefined;
  return configuredHeight ?? Math.max(100, numberOfLines * 24 + 20);
}
