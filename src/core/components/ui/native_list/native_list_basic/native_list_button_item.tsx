import * as React from "react";
import { NativeListRow } from "../native_list_basic";
import type { NativeListButtonItemProps } from "../types";

export function NativeListButtonItem(props: NativeListButtonItemProps) {
  return (
    <NativeListRow
      {...props}
      titleAlign={props.titleAlign ?? "center"}
      titleColor={
        props.titleColor ?? (typeof props.btnTint === "string" ? props.btnTint : undefined)
      }
    />
  );
}
