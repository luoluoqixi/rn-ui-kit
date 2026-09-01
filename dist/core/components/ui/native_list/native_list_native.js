import * as React from "react";
/**
 * Non-iOS native mode uses the fully functional Basic implementation. The
 * resolver is deliberately lazy because Basic Select's sheet path imports
 * NativeList again during module initialization.
 */
function renderBasic(name, props) {
    const implementation = require("./native_list_basic")[name];
    return React.createElement(implementation, props);
}
export function NativeListRoot(props) {
    return renderBasic("NativeListRoot", props);
}
export function NativeListSection(props) {
    return renderBasic("NativeListSection", props);
}
export function NativeListActionItem(props) {
    return renderBasic("NativeListActionItem", props);
}
export function NativeListNavigationItem(props) {
    return renderBasic("NativeListNavigationItem", props);
}
export function NativeListSwitchItem(props) {
    return renderBasic("NativeListSwitchItem", props);
}
export function NativeListColorPickerItem(props) {
    return renderBasic("NativeListColorPickerItem", props);
}
export function NativeListSelectItem(props) {
    return renderBasic("NativeListSelectItem", props);
}
export function NativeListDropdownItem(props) {
    return renderBasic("NativeListDropdownItem", props);
}
export function NativeListButtonItem(props) {
    return renderBasic("NativeListButtonItem", props);
}
export function NativeListInputItem(props) {
    return renderBasic("NativeListInputItem", props);
}
export function NativeListTextAreaItem(props) {
    return renderBasic("NativeListTextAreaItem", props);
}
export function NativeListItem(props) {
    return renderBasic("NativeListItem", props);
}
export function NativeListCustomItem(props) {
    return renderBasic("NativeListCustomItem", props);
}
