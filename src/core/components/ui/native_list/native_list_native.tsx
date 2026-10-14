import * as React from "react";

/**
 * Non-iOS native mode uses the fully functional Basic implementation. The
 * resolver is deliberately lazy because Basic Select's sheet path imports
 * NativeList again during module initialization.
 */
function renderBasic(name: string, props: any) {
  const implementation = require("./native_list_basic")[name] as React.ComponentType<any>;
  return React.createElement(implementation, props);
}

export function NativeListRoot(props: any) {
  return renderBasic("NativeListRoot", props);
}
export function NativeListSection(props: any) {
  return renderBasic("NativeListSection", props);
}
export function NativeListActionItem(props: any) {
  return renderBasic("NativeListActionItem", props);
}
export function NativeListNavigationItem(props: any) {
  return renderBasic("NativeListNavigationItem", props);
}
export function NativeListSwitchItem(props: any) {
  return renderBasic("NativeListSwitchItem", props);
}
export function NativeListColorPickerItem(props: any) {
  return renderBasic("NativeListColorPickerItem", props);
}
export function NativeListSelectItem(props: any) {
  return renderBasic("NativeListSelectItem", props);
}
export function NativeListDropdownItem(props: any) {
  return renderBasic("NativeListDropdownItem", props);
}
export function NativeListButtonItem(props: any) {
  return renderBasic("NativeListButtonItem", props);
}
export function NativeListInputItem(props: any) {
  return renderBasic("NativeListInputItem", props);
}
export function NativeListTextAreaItem(props: any) {
  return renderBasic("NativeListTextAreaItem", props);
}
export function NativeListItem(props: any) {
  return renderBasic("NativeListItem", props);
}
export function NativeListCustomItem(props: any) {
  return renderBasic("NativeListCustomItem", props);
}
