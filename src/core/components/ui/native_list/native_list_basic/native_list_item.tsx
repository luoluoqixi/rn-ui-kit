import * as React from "react";
import { NativeListRow } from "../native_list_basic";
import type { NativeListItemProps } from "../types";

export function NativeListItem(props: NativeListItemProps) {
  return <NativeListRow {...props} />;
}
