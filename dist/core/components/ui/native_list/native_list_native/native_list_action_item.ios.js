import { jsx as _jsx } from "react/jsx-runtime";
import { NativePressRow, supportsNativeTextRow } from "../native_list_native.ios";
export function NativeListActionItem(props) {
    if (!supportsNativeTextRow(props.title, props.subtitle, props.value)) {
        throw new Error("NativeListActionItem requires text title, subtitle, and value on iOS.");
    }
    return _jsx(NativePressRow, { ...props, chevron: props.chevron });
}
