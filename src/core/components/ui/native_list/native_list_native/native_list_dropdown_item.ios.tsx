import * as React from "react";
import { useRef, useState } from "react";

import { Dropdown as Menu } from "../../dropdown";
import {
  NATIVE_LIST_ITEM_OPEN_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN,
  NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
} from "../constants";
import {
  NativePressRow,
  NativeHostedTrailingControl,
  supportsNativeTextRow,
  styles,
} from "../native_list_native.ios";
import { useResolvedNativeListHaptics } from "../haptics";
import { useUiTheme } from "../../utils/theme";
import type { NativeListDropdownItemProps } from "../types";

/** iOS SwiftUI List 中由整行托管 Dropdown 原生 trigger。 */
export function NativeListDropdownItem({
  dropdownProps,
  ...itemProps
}: NativeListDropdownItemProps) {
  if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
    throw new Error("NativeListDropdownItem requires text title and subtitle on iOS.");
  }

  const disabled = itemProps.disabled || dropdownProps.triggerProps?.disabled;
  const theme = useUiTheme();
  const menuRef = useRef<{ presentMenu: () => void } | null>(null);
  const presentingMenuRef = useRef(false);
  const [uncontrolledWillOpen, setUncontrolledWillOpen] = useState(
    Boolean(dropdownProps.defaultOpen),
  );
  const inheritedHaptics = useResolvedNativeListHaptics(
    dropdownProps.nativeHaptics ?? itemProps.nativeHaptics,
  );
  const menuOpen = dropdownProps.open ?? uncontrolledWillOpen;
  const fadeTitleOnOpen = itemProps.fadeTitleOnOpen !== false;
  const menuValue = itemProps.value ?? "更多";
  const nativeTriggerLabelProps = {
    color: itemProps.valueColor ?? theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
    fontSize: itemProps.valueFontSize ?? "$4",
    numberOfLines: 1,
    opacity: NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
    style: [itemProps.valueColor != null ? { color: itemProps.valueColor } : undefined],
  } as any;

  return (
    <NativePressRow
      {...itemProps}
      disabled={disabled ?? undefined}
      labelOpacity={fadeTitleOnOpen && menuOpen ? NATIVE_LIST_ITEM_OPEN_OPACITY : 1}
      nativeHaptics={false}
      onPress={() => {
        if (menuRef.current == null || menuOpen || presentingMenuRef.current) return;
        if (fadeTitleOnOpen && dropdownProps.open === undefined) setUncontrolledWillOpen(true);
        presentingMenuRef.current = true;
        menuRef.current.presentMenu();
      }}
      trailingControl={
        <NativeHostedTrailingControl disableInEditMode>
          <Menu
            {...dropdownProps}
            nativeHaptics={inheritedHaptics}
            nativeTrigger
            nativeTriggerContainerStyle={[styles.selectInlineTrigger]}
            nativeTriggerIcon="chevrons-up-down"
            nativeTriggerLabelProps={nativeTriggerLabelProps}
            nativeTriggerFeedbackOpacity={{
              disabled: NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
              press: NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
              webHover: NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
              webPress: NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
              ...dropdownProps.nativeTriggerFeedbackOpacity,
            }}
            nativeTriggerProps={{
              ...dropdownProps.nativeTriggerProps,
              iconColor:
                itemProps.valueColor ??
                dropdownProps.nativeTriggerProps?.iconColor ??
                theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
            }}
            triggerLabel={menuValue}
            onOpenChange={dropdownProps.onOpenChange}
            onOpenWillChange={(nextOpen) => {
              presentingMenuRef.current = nextOpen;
              if (dropdownProps.open === undefined) setUncontrolledWillOpen(nextOpen);
              dropdownProps.onOpenWillChange?.(nextOpen);
            }}
            triggerProps={{ ...dropdownProps.triggerProps, disabled }}
            // Zeego 的原生菜单句柄用于让整行点击打开同一个菜单。
            // @ts-ignore
            __menuRef={menuRef}
          />
        </NativeHostedTrailingControl>
      }
      value={undefined}
    />
  );
}
