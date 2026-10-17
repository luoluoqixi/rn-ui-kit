import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, TextInput, View } from "react-native";
import { useComponentThemeTokens as useTheme } from "../../utils/theme";
import { NativeListCustomItem, NativeListRow } from "../native_list_basic";
import { useNativeListEditMode } from "../edit_mode";
/** Basic 列表的 iOS 输入行，保留 UIKit 文本框的清除按钮。 */
export function NativeListInputItem({ inputProps, inputWidth, ...itemProps }) {
    const editMode = useNativeListEditMode();
    const theme = useTheme();
    const disabled = Boolean(itemProps.disabled || inputProps.disabled);
    const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
    const { autoFocusNative, disabled: _inputDisabled, style: inputStyle, unstyled: _unstyled, ...nativeInputProps } = inputProps;
    void _inputDisabled;
    void _unstyled;
    const input = (_jsx(TextInput, { ...nativeInputProps, autoFocus: autoFocusNative ?? inputProps.autoFocus ?? false, clearButtonMode: inputProps.clearButtonMode ?? "while-editing", editable: !disabled && !editMode, multiline: inputProps.multiline ?? false, placeholderTextColor: inputProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val, textAlign: inputProps.textAlign ?? (hasLeadingLabel ? "right" : undefined), style: [
            styles.input,
            !hasLeadingLabel ? styles.fullWidthInput : null,
            { color: theme.gray12?.val ?? theme.color.val },
            { width: hasLeadingLabel ? (inputWidth ?? 160) : "100%" },
            inputStyle,
        ] }));
    if (!hasLeadingLabel) {
        return (_jsx(NativeListCustomItem, { ...itemProps, disabled: disabled, paddingVertical: itemProps.paddingVertical ?? 0, children: _jsx(View, { style: styles.fullWidth, children: input }) }));
    }
    return (_jsx(NativeListRow, { ...itemProps, disabled: disabled, trailing: _jsx(View, { style: { width: inputWidth ?? 160 }, children: input }) }));
}
const styles = StyleSheet.create({
    fullWidth: { height: 44, width: "100%" },
    fullWidthInput: { paddingHorizontal: 0 },
    input: {
        borderWidth: 0,
        fontSize: 17,
        height: 44,
        includeFontPadding: false,
        maxHeight: 44,
        minHeight: 0,
        paddingHorizontal: 16,
        paddingVertical: 0,
        textAlignVertical: "center",
        width: "100%",
    },
});
