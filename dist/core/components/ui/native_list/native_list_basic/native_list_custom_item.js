import { jsx as _jsx } from "react/jsx-runtime";
import { NativeListRow } from "../native_list_basic";
export function NativeListCustomItem(props) {
    const { children, ...rowProps } = props;
    return _jsx(NativeListRow, { ...rowProps, children: children });
}
