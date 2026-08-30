import { jsx as _jsx } from "react/jsx-runtime";
import { NativePressRow, supportsNativeTextRow } from "../native_list_native.ios";
export function NativeListItem({ title, onPress, disabled, titleAlign, btnTint, ...itemProps }) {
    if (!supportsNativeTextRow(itemProps.subtitle)) {
        throw new Error("NativeListItem requires a text subtitle on iOS.");
    }
    return (_jsx(NativePressRow, { ...itemProps, title: title, disabled: disabled, onPress: onPress, titleAlign: titleAlign, btnTint: btnTint, preserveLeadingAnchor: titleAlign === "center" }));
}
