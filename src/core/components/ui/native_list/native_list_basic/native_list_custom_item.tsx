import * as React from "react";
import { NativeListRow } from "../native_list_basic";
import type { NativeListCustomItemProps } from "../types";

export function NativeListCustomItem(props: NativeListCustomItemProps) {
  const { children, ...rowProps } = props;
  return <NativeListRow {...rowProps}>{children}</NativeListRow>;
}
