import { jsx as _jsx } from "react/jsx-runtime";
import { NativeListRow } from "../native_list_basic";
export function NativeListButtonItem(props) {
    return (_jsx(NativeListRow, { ...props, titleAlign: props.titleAlign ?? "center", titleColor: props.titleColor ?? (typeof props.btnTint === "string" ? props.btnTint : undefined) }));
}
