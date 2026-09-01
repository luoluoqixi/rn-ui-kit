import { jsx as _jsx } from "react/jsx-runtime";
import { NativeListRow } from "../native_list_basic";
export function NativeListNavigationItem(props) {
    return _jsx(NativeListRow, { ...props, chevron: props.chevron ?? true });
}
