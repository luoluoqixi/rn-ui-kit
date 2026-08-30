import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { Platform } from "react-native";
import * as Basic from "./native_list_basic";
import * as Native from "./native_list_native";
import { NativeListTriggerFontWeightProvider } from "./native_trigger";
import { NativeListActionItem as BasicActionItem } from "./native_list_basic/native_list_action_item";
import { NativeListButtonItem as BasicButtonItem } from "./native_list_basic/native_list_button_item";
import { NativeListCustomItem as BasicCustomItem } from "./native_list_basic/native_list_custom_item";
import { NativeListInputItem as BasicInputItem } from "./native_list_basic/native_list_input_item";
import { NativeListItem as BasicItem } from "./native_list_basic/native_list_item";
import { NativeListDropdownItem as BasicDropdownItem } from "./native_list_basic/native_list_dropdown_item";
import { NativeListNavigationItem as BasicNavigationItem } from "./native_list_basic/native_list_navigation_item";
import { NativeListSelectItem as BasicSelectItem } from "./native_list_basic/native_list_select_item";
import { NativeListSwitchItem as BasicSwitchItem } from "./native_list_basic/native_list_switch_item";
import { NativeListColorPickerItem as BasicColorPickerItem } from "./native_list_basic/native_list_color_picker_item";
import { NativeListTextAreaItem as BasicTextAreaItem } from "./native_list_basic/native_list_text_area_item";
import { NativeListActionItem as NativeActionItem } from "./native_list_native/native_list_action_item";
import { NativeListButtonItem as NativeButtonItem } from "./native_list_native/native_list_button_item";
import { NativeListCustomItem as NativeCustomItem } from "./native_list_native/native_list_custom_item";
import { NativeListInputItem as NativeInputItem } from "./native_list_native/native_list_input_item";
import { NativeListItem as NativeItem } from "./native_list_native/native_list_item";
import { NativeListDropdownItem as NativeDropdownItem } from "./native_list_native/native_list_dropdown_item";
import { NativeListNavigationItem as NativeNavigationItem } from "./native_list_native/native_list_navigation_item";
import { NativeListSelectItem as NativeSelectItem } from "./native_list_native/native_list_select_item";
import { NativeListSwitchItem as NativeSwitchItem } from "./native_list_native/native_list_switch_item";
import { NativeListColorPickerItem as NativeColorPickerItem } from "./native_list_native/native_list_color_picker_item";
import { NativeListTextAreaItem as NativeTextAreaItem } from "./native_list_native/native_list_text_area_item";
const NativeListModeContext = createContext(undefined);
function useResolvedNativeMode(explicit) {
    // NativeList 的原生 SwiftUI 实现目前仅存在于 iOS；其他平台即使显式
    // 传入 native=true，也按 basic 实现渲染，不进入占位的 unsupported 分支。
    if (Platform.OS !== "ios")
        return false;
    return explicit ?? useContext(NativeListModeContext) ?? true;
}
/** iOS keeps the historical SwiftUI list as its default; other platforms use basic rows. */
export function NativeListRoot({ native, nativeTriggerFontWeight, ...props }) {
    const useNative = useResolvedNativeMode(native);
    const Component = useNative ? Native.NativeListRoot : Basic.NativeListRoot;
    return (_jsx(NativeListModeContext.Provider, { value: useNative, children: _jsx(NativeListTriggerFontWeightProvider, { nativeTriggerFontWeight: nativeTriggerFontWeight, children: _jsx(Component, { ...props }) }) }));
}
export const NativeList = NativeListRoot;
export function NativeListSection({ native, nativeTriggerFontWeight, ...props }) {
    const useNative = useResolvedNativeMode(native);
    const Component = useNative ? Native.NativeListSection : Basic.NativeListSection;
    return (_jsx(NativeListTriggerFontWeightProvider, { nativeTriggerFontWeight: nativeTriggerFontWeight, children: _jsx(Component, { ...props }) }));
}
function dispatchItem(native, NativeItem, BasicItem, props) {
    const useNative = useResolvedNativeMode(native);
    const Component = useNative ? NativeItem : BasicItem;
    return _jsx(Component, { ...props });
}
export const NativeListActionItem = (props) => dispatchItem(props.native, NativeActionItem, BasicActionItem, props);
export const NativeListNavigationItem = (props) => dispatchItem(props.native, NativeNavigationItem, BasicNavigationItem, props);
export const NativeListSwitchItem = (props) => dispatchItem(props.native, NativeSwitchItem, BasicSwitchItem, props);
export const NativeListColorPickerItem = (props) => dispatchItem(props.native, NativeColorPickerItem, BasicColorPickerItem, props);
export const NativeListSelectItem = (props) => dispatchItem(props.native, NativeSelectItem, BasicSelectItem, props);
export const NativeListDropdownItem = (props) => dispatchItem(props.native, NativeDropdownItem, BasicDropdownItem, props);
export const NativeListButtonItem = (props) => dispatchItem(props.native, NativeButtonItem, BasicButtonItem, props);
export const NativeListInputItem = (props) => dispatchItem(props.native, NativeInputItem, BasicInputItem, props);
export const NativeListTextAreaItem = (props) => dispatchItem(props.native, NativeTextAreaItem, BasicTextAreaItem, props);
export const NativeListItem = (props) => dispatchItem(props.native, NativeItem, BasicItem, props);
export const NativeListCustomItem = (props) => dispatchItem(props.native, NativeCustomItem, BasicCustomItem, props);
