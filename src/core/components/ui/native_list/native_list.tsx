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
import { NativeListTextAreaItem as NativeTextAreaItem } from "./native_list_native/native_list_text_area_item";
import type {
  NativeListActionItemProps,
  NativeListButtonItemProps,
  NativeListCustomItemProps,
  NativeListInputItemProps,
  NativeListItemProps,
  NativeListDropdownItemProps,
  NativeListNavigationItemProps,
  NativeListRootProps,
  NativeListSectionProps,
  NativeListSelectItemProps,
  NativeListSwitchItemProps,
  NativeListTextAreaItemProps,
} from "./types";

const NativeListModeContext = createContext<boolean | undefined>(undefined);

function useResolvedNativeMode(explicit?: boolean) {
  // NativeList 的原生 SwiftUI 实现目前仅存在于 iOS；其他平台即使显式
  // 传入 native=true，也按 basic 实现渲染，不进入占位的 unsupported 分支。
  if (Platform.OS !== "ios") return false;
  return explicit ?? useContext(NativeListModeContext) ?? true;
}

/** iOS keeps the historical SwiftUI list as its default; other platforms use basic rows. */
export function NativeListRoot({ native, nativeTriggerFontWeight, ...props }: NativeListRootProps) {
  const useNative = useResolvedNativeMode(native);
  const Component = useNative ? Native.NativeListRoot : Basic.NativeListRoot;
  return (
    <NativeListModeContext.Provider value={useNative}>
      <NativeListTriggerFontWeightProvider nativeTriggerFontWeight={nativeTriggerFontWeight}>
        <Component {...props} />
      </NativeListTriggerFontWeightProvider>
    </NativeListModeContext.Provider>
  );
}

export const NativeList = NativeListRoot;

export function NativeListSection({
  native,
  nativeTriggerFontWeight,
  ...props
}: NativeListSectionProps & { native?: boolean }) {
  const useNative = useResolvedNativeMode(native);
  const Component = useNative ? Native.NativeListSection : Basic.NativeListSection;
  return (
    <NativeListTriggerFontWeightProvider nativeTriggerFontWeight={nativeTriggerFontWeight}>
      <Component {...props} />
    </NativeListTriggerFontWeightProvider>
  );
}

function dispatchItem(native: boolean | undefined, NativeItem: any, BasicItem: any, props: any) {
  const useNative = useResolvedNativeMode(native);
  const Component = useNative ? NativeItem : BasicItem;
  return <Component {...props} />;
}

export const NativeListActionItem = (props: NativeListActionItemProps & { native?: boolean }) =>
  dispatchItem(props.native, NativeActionItem, BasicActionItem, props);
export const NativeListNavigationItem = (
  props: NativeListNavigationItemProps & { native?: boolean },
) => dispatchItem(props.native, NativeNavigationItem, BasicNavigationItem, props);
export const NativeListSwitchItem = (props: NativeListSwitchItemProps & { native?: boolean }) =>
  dispatchItem(props.native, NativeSwitchItem, BasicSwitchItem, props);
export const NativeListSelectItem = (props: NativeListSelectItemProps & { native?: boolean }) =>
  dispatchItem(props.native, NativeSelectItem, BasicSelectItem, props);
export const NativeListDropdownItem = (props: NativeListDropdownItemProps & { native?: boolean }) =>
  dispatchItem(props.native, NativeDropdownItem, BasicDropdownItem, props);
export const NativeListButtonItem = (props: NativeListButtonItemProps & { native?: boolean }) =>
  dispatchItem(props.native, NativeButtonItem, BasicButtonItem, props);
export const NativeListInputItem = (props: NativeListInputItemProps & { native?: boolean }) =>
  dispatchItem(props.native, NativeInputItem, BasicInputItem, props);
export const NativeListTextAreaItem = (props: NativeListTextAreaItemProps & { native?: boolean }) =>
  dispatchItem(props.native, NativeTextAreaItem, BasicTextAreaItem, props);
export const NativeListItem = (props: NativeListItemProps & { native?: boolean }) =>
  dispatchItem(props.native, NativeItem, BasicItem, props);
export const NativeListCustomItem = (props: NativeListCustomItemProps & { native?: boolean }) =>
  dispatchItem(props.native, NativeCustomItem, BasicCustomItem, props);
