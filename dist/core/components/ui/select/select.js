import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Platform } from "react-native";
import { SelectBasic } from "./select_basic";
import { SelectDialog } from "./select_dialog";
import { SelectDropdown } from "./select_dropdown";
import { SelectNative } from "./select_native";
import { SelectSheet } from "./select_sheet";
import { SelectWheel } from "./select_wheel";
/** The default keeps the browser basic select and uses the native dropdown on mobile. */
export const DEFAULT_SELECT_NATIVE = Platform.OS === "web" ? false : true;
function hasGeneratedItems(props) {
    return (props.items != null || props.options != null || props.itemGroups != null);
}
function resolveImplementation(native) {
    const resolved = native ?? DEFAULT_SELECT_NATIVE;
    if (resolved === false)
        return SelectBasic;
    if (resolved === true)
        return Platform.OS === "web" ? SelectNative : SelectDropdown;
    if (resolved === "sheet")
        return SelectSheet;
    if (resolved === "dialog")
        return Platform.OS === "android" ? SelectDialog : SelectNative;
    if (resolved === "dropdown")
        return Platform.OS === "android" || Platform.OS === "ios"
            ? SelectDropdown
            : SelectNative;
    if (resolved === "wheel")
        return Platform.OS === "ios" ? SelectWheel : SelectNative;
    return SelectNative;
}
const SelectRoot = React.forwardRef(function SelectRoot(props, ref) {
    if (props.children != null && !hasGeneratedItems(props)) {
        return _jsx(SelectBasic, { ...props, ref: ref });
    }
    const Implementation = resolveImplementation(props.native);
    const RoutedImplementation = Implementation;
    if (Implementation === SelectBasic) {
        return _jsx(RoutedImplementation, { ...props, ref: ref });
    }
    const { contentSize: _contentSize, ...nativeProps } = props;
    return _jsx(RoutedImplementation, { ...nativeProps, ref: ref });
});
export { SelectRoot as Select };
