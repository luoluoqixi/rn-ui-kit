import * as React from "react";
import { tint } from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";

import { NativeListColorPickerSheet as NativeListColorPickerSheetBase } from "./color_picker_sheet";
import type { NativeListColorPickerSheetProps } from "./color_picker_sheet";
import { useUiTheme } from "../utils/theme";

export function NativeListColorPickerSheet(props: NativeListColorPickerSheetProps) {
  const theme = useUiTheme();

  return (
    <NativeListColorPickerSheetBase
      {...props}
      nativeButtonSwiftProps={{ modifiers: [tint(theme.primary)] }}
    />
  );
}
