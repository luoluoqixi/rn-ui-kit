import * as React from "react";

import { NativePressRow, supportsNativeTextRow } from "../native_list_native.ios";
import type { NativeListItemProps } from "../types";

export function NativeListItem({
  title,
  onPress,
  disabled,
  titleAlign,
  btnTint,
  ...itemProps
}: NativeListItemProps) {
  if (!supportsNativeTextRow(itemProps.subtitle)) {
    throw new Error("NativeListItem requires a text subtitle on iOS.");
  }
  return (
    <NativePressRow
      {...itemProps}
      title={title}
      disabled={disabled}
      onPress={onPress}
      titleAlign={titleAlign}
      btnTint={btnTint}
      preserveLeadingAnchor={titleAlign === "center"}
    />
  );
}
