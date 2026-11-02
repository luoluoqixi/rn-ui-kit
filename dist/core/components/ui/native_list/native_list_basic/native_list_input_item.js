import { jsx as _jsx } from "react/jsx-runtime";
import { View } from "react-native";
import { Input } from "../../input";
import { NativeListCustomItem, NativeListRow } from "../native_list_basic";
import { useNativeListEditMode } from "../edit_mode";
export function NativeListInputItem(props) {
    const { inputProps, inputWidth, ...itemProps } = props;
    const disabled = Boolean(itemProps.disabled || inputProps.disabled);
    const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
    const editMode = useNativeListEditMode();
    const input = (_jsx(Input, { ...inputProps, disabled: disabled || editMode, unstyled: true, style: [
            {
                fontSize: 17,
                height: 44,
                minHeight: 44,
                paddingVertical: 0,
                textAlign: inputProps.textAlign ?? (hasLeadingLabel ? "right" : undefined),
                width: hasLeadingLabel ? (inputWidth ?? 160) : "100%",
            },
            inputProps.style,
        ] }));
    if (!hasLeadingLabel) {
        return (_jsx(NativeListCustomItem, { ...itemProps, disabled: disabled, paddingVertical: itemProps.paddingVertical ?? 0, children: _jsx(View, { style: {
                    alignItems: "center",
                    flex: 1,
                    height: 56,
                    justifyContent: "center",
                    minWidth: 0,
                    width: editMode ? undefined : "100%",
                }, children: input }) }));
    }
    return (_jsx(NativeListRow, { ...itemProps, disabled: disabled, trailing: _jsx(View, { style: { width: inputWidth ?? 160 }, children: input }) }));
}
