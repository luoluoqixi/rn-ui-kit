import { jsx as _jsx } from "react/jsx-runtime";
import { NativeListRow } from "../native_list_basic";
export function NativeListNavigationItem(props) {
    const { iosNavigationSelection: _iosNavigationSelection, iosNavigationSelectionAutoClear: _iosNavigationSelectionAutoClear, iosNavigationSelectionAutoClearDelay: _iosNavigationSelectionAutoClearDelay, ...itemProps } = props;
    return _jsx(NativeListRow, { ...itemProps, chevron: itemProps.chevron ?? true });
}
