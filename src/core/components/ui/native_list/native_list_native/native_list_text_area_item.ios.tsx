import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";

import { useComponentThemeTokens as useTheme } from "../../utils/theme";
import {
  NativePressRow,
  styles,
  resolveEditingInputDisplay,
  resolveTextAreaHeight,
  DEFAULT_TEXT_AREA_LINES,
} from "../native_list_native.ios";
import { NativeListCustomItem } from "./native_list_custom_item.ios";
import { useNativeListEditMode } from "../edit_mode";
import type { NativeListTextAreaItemProps } from "../types";

export function NativeListTextAreaItem({
  textAreaProps,
  ...itemProps
}: NativeListTextAreaItemProps) {
  const editMode = useNativeListEditMode();
  const theme = useTheme();
  const [uncontrolledEditingValue, setUncontrolledEditingValue] = useState(
    typeof textAreaProps.defaultValue === "string" ? textAreaProps.defaultValue : "",
  );
  const disabled = itemProps.disabled || textAreaProps.disabled;
  const textAreaHeight = resolveTextAreaHeight(textAreaProps);
  const {
    disabled: _inputDisabled,
    onChangeText,
    scrollEnabled,
    style: inputStyle,
    unstyled: _unstyled,
    ...nativeTextAreaProps
  } = textAreaProps;
  void _inputDisabled;
  void _unstyled;
  const editingDisplay = resolveEditingInputDisplay(
    textAreaProps.value ?? uncontrolledEditingValue,
    textAreaProps.defaultValue,
    textAreaProps.placeholder,
  );
  const flattenedInputStyle = StyleSheet.flatten(inputStyle) as { color?: unknown } | undefined;
  const editingLineLimit =
    typeof textAreaProps.numberOfLines === "number"
      ? textAreaProps.numberOfLines
      : DEFAULT_TEXT_AREA_LINES;
  const editingTextColor = editingDisplay.placeholder
    ? typeof textAreaProps.placeholderTextColor === "string"
      ? textAreaProps.placeholderTextColor
      : (theme.gray9?.val ?? theme.color10.val)
    : typeof flattenedInputStyle?.color === "string"
      ? flattenedInputStyle.color
      : (theme.gray12?.val ?? theme.color.val);
  if (editMode) {
    return (
      <NativePressRow
        {...itemProps}
        disabled={disabled}
        paddingBottom={itemProps.paddingBottom ?? itemProps.paddingVertical ?? 10}
        paddingTop={itemProps.paddingTop ?? itemProps.paddingVertical ?? 10}
        rowAlignment="top"
        rowMinHeight={textAreaHeight}
        title={editingDisplay.text}
        titleColor={editingTextColor}
        titleLineLimit={editingLineLimit}
      />
    );
  }
  return (
    <NativeListCustomItem {...itemProps} disabled={disabled}>
      <View collapsable={false} style={[styles.textAreaRow, { height: textAreaHeight }]}>
        <TextInput
          {...(nativeTextAreaProps as any)}
          editable={!disabled}
          multiline
          onChangeText={(nextValue) => {
            setUncontrolledEditingValue(nextValue);
            onChangeText?.(nextValue);
          }}
          placeholderTextColor={
            textAreaProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val
          }
          scrollEnabled={scrollEnabled ?? true}
          style={[
            styles.textArea,
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
