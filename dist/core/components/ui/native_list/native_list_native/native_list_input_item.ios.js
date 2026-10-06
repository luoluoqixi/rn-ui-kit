import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";
import { useComponentThemeTokens as useTheme } from "../../utils/theme";
import { NativeHostedTrailingControl, NativePressRow, styles, resolveEditingInputDisplay, } from "../native_list_native.ios";
import { NativeListCustomItem } from "./native_list_custom_item.ios";
import { useNativeListEditMode } from "../edit_mode";
export function NativeListInputItem({ inputProps, inputWidth, ...itemProps }) {
    const editMode = useNativeListEditMode();
    const theme = useTheme();
    const [uncontrolledEditingValue, setUncontrolledEditingValue] = useState(typeof inputProps.defaultValue === "string" ? inputProps.defaultValue : "");
    const disabled = itemProps.disabled || inputProps.disabled;
    const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
    const { autoFocusNative, disabled: _inputDisabled, onChangeText, style: inputStyle, unstyled: _unstyled, ...nativeInputProps } = inputProps;
    void _inputDisabled;
    void _unstyled;
    const editingDisplay = resolveEditingInputDisplay(inputProps.value ?? uncontrolledEditingValue, inputProps.defaultValue, inputProps.placeholder);
    const flattenedInputStyle = StyleSheet.flatten(inputStyle);
    const editingTextColor = editingDisplay.placeholder
        ? typeof inputProps.placeholderTextColor === "string"
            ? inputProps.placeholderTextColor
            : (theme.gray9?.val ?? theme.color10.val)
        : typeof flattenedInputStyle?.color === "string"
            ? flattenedInputStyle.color
            : (theme.gray12?.val ?? theme.color.val);
    const resolvedInput = (_jsx(TextInput, { ...nativeInputProps, autoFocus: autoFocusNative ?? inputProps.autoFocus ?? false, textAlign: inputProps.textAlign ?? (hasLeadingLabel ? "right" : undefined), clearButtonMode: inputProps.clearButtonMode ?? "while-editing", editable: !disabled, multiline: inputProps.multiline ?? false, onChangeText: (nextValue) => {
            setUncontrolledEditingValue(nextValue);
            onChangeText?.(nextValue);
        }, placeholderTextColor: inputProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val, style: [
            styles.input,
            !hasLeadingLabel ? styles.fullWidthInput : null,
            { color: theme.gray12?.val ?? theme.color.val },
            inputStyle,
        ] }));
    if (editMode) {
        return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, title: hasLeadingLabel ? itemProps.title : editingDisplay.text, subtitle: hasLeadingLabel ? itemProps.subtitle : undefined, value: hasLeadingLabel ? editingDisplay.text : undefined, valueColor: editingTextColor, titleColor: !hasLeadingLabel ? editingTextColor : itemProps.titleColor }));
    }
    if (hasLeadingLabel) {
        return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, trailingControl: _jsx(NativeHostedTrailingControl, { children: _jsx(View, { collapsable: false, style: [styles.inputTrailing, inputWidth != null ? { width: inputWidth } : null], children: resolvedInput }) }) }));
    }
    return (_jsx(NativeListCustomItem, { ...itemProps, disabled: disabled, paddingVertical: itemProps.paddingVertical ?? 0, children: _jsx(View, { collapsable: false, style: styles.inputRow, children: resolvedInput }) }));
}
