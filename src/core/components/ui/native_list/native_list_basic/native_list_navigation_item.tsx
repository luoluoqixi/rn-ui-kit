import * as React from "react";
import { NativeListRow } from "../native_list_basic";
import type { NativeListNavigationItemProps } from "../types";

export function NativeListNavigationItem(props: NativeListNavigationItemProps) {
  return <NativeListRow {...props} chevron={props.chevron ?? true} />;
}
