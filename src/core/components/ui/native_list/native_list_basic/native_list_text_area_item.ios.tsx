import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { useComponentThemeTokens as useTheme } from "../../utils/theme";
import { NativeListCustomItem } from "../native_list_basic";
import { useNativeListEditMode } from "../edit_mode";
import type { NativeListTextAreaItemProps } from "../types";

/** Basic 列表的 iOS 多行输入行，使用 UIKit TextInput 而非跨平台 Textarea 封装。 */
export function NativeListTextAreaItem({
  textAreaProps,
  ...itemProps
}: NativeListTextAreaItemProps) {
  const editMode = useNativeListEditMode();
  const theme = useTheme();
  const disabled = Boolean(itemProps.disabled || textAreaProps.disabled);
  const {
    disabled: _inputDisabled,
    scrollEnabled,
    style: inputStyle,
    unstyled: _unstyled,
    ...nativeTextAreaProps
  } = textAreaProps;
  void _inputDisabled;
  void _unstyled;
  const textAreaHeight = resolveTextAreaHeight(textAreaProps);

  return (
    <NativeListCustomItem {...itemProps} disabled={disabled}>
      <View style={styles.container}>
        <TextInput
          {...(nativeTextAreaProps as any)}
          editable={!disabled && !editMode}
          multiline
          placeholderTextColor={
            textAreaProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val
          }
          scrollEnabled={scrollEnabled ?? true}
          style={[
            styles.input,
            {
              color: theme.gray12?.val ?? theme.color.val,
              height: textAreaHeight,
              minHeight: textAreaHeight,
            },
            inputStyle,
          ]}
        />
      </View>
    </NativeListCustomItem>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  input: {
    borderWidth: 0,
    fontSize: 17,
    minHeight: 100,
    paddingHorizontal: 0,
    paddingVertical: 10,
    textAlignVertical: "top",
    width: "100%",
  },
});

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
