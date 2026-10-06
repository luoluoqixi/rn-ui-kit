import * as React from "react";
import { NativeListRow } from "../native_list_basic";
import type { NativeListNavigationItemProps } from "../types";

export function NativeListNavigationItem(props: NativeListNavigationItemProps) {
  const {
    iosNavigationSelection: _iosNavigationSelection,
    iosNavigationSelectionAutoClear: _iosNavigationSelectionAutoClear,
    iosNavigationSelectionAutoClearDelay: _iosNavigationSelectionAutoClearDelay,
    ...itemProps
  } = props;
  return <NativeListRow {...itemProps} chevron={itemProps.chevron ?? true} />;
}
