import { jsx as _jsx } from "react/jsx-runtime";
import { NativePressRow, supportsNativeTextRow } from "../native_list_native.ios";
export function NativeListNavigationItem(props) {
    if (!supportsNativeTextRow(props.title, props.subtitle, props.value)) {
        throw new Error("NativeListNavigationItem requires text title, subtitle, and value on iOS.");
    }
    const { iosNavigationSelection = true, iosNavigationSelectionAutoClear = true, iosNavigationSelectionAutoClearDelay, ...itemProps } = props;
    return (_jsx(NativePressRow, { ...itemProps, chevron: itemProps.chevron ?? true, ios15RowType: "navigation", iosNavigationSelection: iosNavigationSelection, iosNavigationSelectionAutoClear: iosNavigationSelectionAutoClear, iosNavigationSelectionAutoClearDelay: iosNavigationSelectionAutoClearDelay }));
}
