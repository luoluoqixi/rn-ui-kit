import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";
import { useComponentThemeTokens as useTheme } from "../../utils/theme";
import { NativePressRow, styles, resolveEditingInputDisplay, resolveTextAreaHeight, DEFAULT_TEXT_AREA_LINES, } from "../native_list_native.ios";
import { NativeListCustomItem } from "./native_list_custom_item.ios";
import { useNativeListEditMode } from "../edit_mode";
export function NativeListTextAreaItem({ textAreaProps, ...itemProps }) {
    const editMode = useNativeListEditMode();
    const theme = useTheme();
    const [uncontrolledEditingValue, setUncontrolledEditingValue] = useState(typeof textAreaProps.defaultValue === "string" ? textAreaProps.defaultValue : "");
    const disabled = itemProps.disabled || textAreaProps.disabled;
    const textAreaHeight = resolveTextAreaHeight(textAreaProps);
    const { disabled: _inputDisabled, onChangeText, scrollEnabled, style: inputStyle, unstyled: _unstyled, ...nativeTextAreaProps } = textAreaProps;
    void _inputDisabled;
    void _unstyled;
    const editingDisplay = resolveEditingInputDisplay(textAreaProps.value ?? uncontrolledEditingValue, textAreaProps.defaultValue, textAreaProps.placeholder);
    const flattenedInputStyle = StyleSheet.flatten(inputStyle);
    const editingLineLimit = typeof textAreaProps.numberOfLines === "number"
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
        return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, paddingBottom: itemProps.paddingBottom ?? itemProps.paddingVertical ?? 10, paddingTop: itemProps.paddingTop ?? itemProps.paddingVertical ?? 10, rowAlignment: "top", rowMinHeight: textAreaHeight, title: editingDisplay.text, titleColor: editingTextColor, titleLineLimit: editingLineLimit }));
    }
    return (_jsx(NativeListCustomItem, { ...itemProps, disabled: disabled, children: _jsx(View, { collapsable: false, style: [styles.textAreaRow, { height: textAreaHeight }], children: _jsx(TextInput, { ...nativeTextAreaProps, editable: !disabled, multiline: true, onChangeText: (nextValue) => {
                    setUncontrolledEditingValue(nextValue);
                    onChangeText?.(nextValue);
                }, placeholderTextColor: textAreaProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val, scrollEnabled: scrollEnabled ?? true, style: [
                    styles.textArea,
                    {
                        color: theme.gray12?.val ?? theme.color.val,
                        height: textAreaHeight,
                        minHeight: textAreaHeight,
                    },
                    inputStyle,
                ] }) }) }));
}
