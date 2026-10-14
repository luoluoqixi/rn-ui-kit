import * as React from "react";

import { NativePressRow, supportsNativeTextRow } from "../native_list_native.ios";
import type { NativeListNavigationItemProps } from "../types";

export function NativeListNavigationItem(props: NativeListNavigationItemProps) {
  if (!supportsNativeTextRow(props.title, props.subtitle, props.value)) {
    throw new Error("NativeListNavigationItem requires text title, subtitle, and value on iOS.");
  }
  const {
    iosNavigationSelection = true,
    iosNavigationSelectionAutoClear = true,
    iosNavigationSelectionAutoClearDelay,
    ...itemProps
  } = props;
  return (
    <NativePressRow
      {...itemProps}
      chevron={itemProps.chevron ?? true}
      ios15RowType="navigation"
      iosNavigationSelection={iosNavigationSelection}
      iosNavigationSelectionAutoClear={iosNavigationSelectionAutoClear}
      iosNavigationSelectionAutoClearDelay={iosNavigationSelectionAutoClearDelay}
    />
  );
}
