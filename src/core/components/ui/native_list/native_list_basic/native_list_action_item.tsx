import * as React from "react";
import { NativeListRow } from "../native_list_basic";
import type { NativeListActionItemProps } from "../types";

export function NativeListActionItem(props: NativeListActionItemProps) {
  return <NativeListRow {...props} />;
}
