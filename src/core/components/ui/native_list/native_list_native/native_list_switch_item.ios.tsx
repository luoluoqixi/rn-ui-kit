import * as React from "react";
import { useState } from "react";
import { Toggle as SwiftToggle } from "@expo/ui/swift-ui";
import { disabled as disabledModifier, tint, toggleStyle } from "@expo/ui/swift-ui/modifiers";

import { useComponentThemeTokens as useTheme } from "../../utils/theme";
import { isIos15 } from "../../utils/platform";
import { toSwiftUIHexColor, triggerNativeHaptics, useResolvedNativeHaptics } from "../../utils";
import { NativePressRow, supportsNativeTextRow } from "../native_list_native.ios";
import { useResolvedNativeListHaptics } from "../haptics";
import { useNativeListEditMode } from "../edit_mode";
import type { NativeListSwitchItemProps } from "../types";

export function NativeListSwitchItem({ switchProps, ...itemProps }: NativeListSwitchItemProps) {
  if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
    throw new Error("NativeListSwitchItem requires text title and subtitle on iOS.");
  }
  const editMode = useNativeListEditMode();
  const theme = useTheme();
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    switchProps.defaultChecked ?? false,
  );
  const checked = switchProps.checked ?? uncontrolledChecked;
  const disabled = Boolean(itemProps.disabled || switchProps.disabled);
  const inheritedHaptics = useResolvedNativeListHaptics(
    itemProps.nativeHaptics ?? switchProps.nativeHaptics,
  );
  const nativeHaptics = inheritedHaptics ?? !editMode;
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
  const themeSwitchTint = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
  const switchTint =
    itemProps.btnTint === false
      ? null
      : typeof itemProps.btnTint === "string"
        ? (toSwiftUIHexColor(itemProps.btnTint) ?? itemProps.btnTint)
        : themeSwitchTint;
  const handleCheckedChange = (nextChecked: boolean) => {
    if (switchProps.checked == null) setUncontrolledChecked(nextChecked);
    switchProps.onCheckedChange?.(nextChecked);
  };
  const handleSwiftToggleChange = (nextChecked: boolean) => {
    handleCheckedChange(nextChecked);
    if (isIos15()) triggerNativeHaptics(resolvedNativeHaptics);
  };
  return (
    <NativePressRow
      {...itemProps}
      nativeHaptics={nativeHaptics}
      disabled={disabled}
      onPress={() => handleCheckedChange(!checked)}
      trailingControl={
        <SwiftToggle
          isOn={checked}
          modifiers={[
            toggleStyle("switch"),
            ...(switchTint != null ? [tint(switchTint)] : []),
            disabledModifier(editMode || disabled),
          ]}
          onIsOnChange={handleSwiftToggleChange}
        />
      }
      value={undefined}
    />
  );
}
