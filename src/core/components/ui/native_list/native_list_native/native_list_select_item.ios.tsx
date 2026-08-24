import * as React from "react";
import { useRef, useState } from "react";

import { Dropdown as Menu } from "../../dropdown";
import { SelectWheel } from "../../select/select_wheel.ios";
import type { SelectHandle } from "../../select/types";
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
  NativeHostedTrailingControl,
  NativePressRow,
  renderNativeListSelectTriggerLabel,
  styles,
  getSelectLabel,
  toPlainText,
} from "../native_list_native.ios";
import { resolveSelectItemGroups } from "../../select/select_grouping";
import { useResolvedNativeListHaptics } from "../haptics";
import { useUiTheme } from "../../utils/theme";
import type { NativeListSelectItemProps } from "../types";

export function NativeListSelectItem({ selectProps, ...itemProps }: NativeListSelectItemProps) {
  const theme = useUiTheme();
  const inheritedHaptics = useResolvedNativeListHaptics(
    selectProps.nativeHaptics ?? itemProps.nativeHaptics,
  );
  const resolvedItemGroups = resolveSelectItemGroups({
    itemGroups: selectProps.itemGroups,
    items: selectProps.items,
    options: selectProps.options,
  });
  const selectItems = resolvedItemGroups.flatMap((group) => group.items);
  const selectedValue = selectProps.value ?? selectProps.defaultValue;
  const selectedItem = selectItems.find((item) => item.value === selectedValue);
  const nativeTriggerLabelProps = {
    ...selectProps.nativeTriggerLabelProps,
    color:
      itemProps.valueColor ??
      selectProps.nativeTriggerLabelProps?.color ??
      theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
    opacity:
      (selectProps.nativeTriggerLabelProps as any)?.opacity ?? NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
  } as any;
  const selectedLabel =
    selectedItem == null
      ? (toPlainText(selectProps.placeholder) ?? "请选择")
      : getSelectLabel(selectedItem, selectedValue ?? undefined);
  const selectedTriggerLabel = renderNativeListSelectTriggerLabel(
    selectedLabel,
    selectedItem?.swatchColor,
    nativeTriggerLabelProps,
  );
  const wheelRef = useRef<SelectHandle | null>(null);
  const menuRef = useRef<{ presentMenu: () => void } | null>(null);
  const [menuOpen, setMenuOpen] = useState(Boolean((selectProps as any).defaultOpen));
  const disabled = Boolean(itemProps.disabled || selectProps.disabled || selectProps.isDisabled);
  const fadeTitleOnOpen = itemProps.fadeTitleOnOpen !== false;

  if (selectProps.native === "wheel") {
    return (
      <NativePressRow
        {...itemProps}
        disabled={disabled}
        btnStyle="plain"
        nativeHaptics={false}
        onPress={() => {
          itemProps.onPress?.();
          wheelRef.current?.open();
        }}
        value={undefined}
        trailingControl={
          <NativeHostedTrailingControl disableInEditMode>
            <SelectWheel
              {...(selectProps as any)}
              ref={wheelRef}
              items={selectItems}
              nativeHaptics={inheritedHaptics}
              native="wheel"
              nativeTrigger
              nativeTriggerIcon="chevrons-up-down"
              nativeTriggerLabel={selectProps.nativeTriggerLabel ?? selectedTriggerLabel}
              nativeTriggerLabelProps={nativeTriggerLabelProps}
              nativeTriggerProps={{
                ...(selectProps.nativeTriggerProps as any),
                iconColor:
                  itemProps.valueColor ??
                  selectProps.nativeTriggerProps?.iconColor ??
                  theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
                pressedOpacity: false,
              }}
              nativeTriggerFeedbackOpacity={{
                disabled: NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
                press: NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
                webHover: NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
                webPress: NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
                ...selectProps.nativeTriggerFeedbackOpacity,
              }}
              onOpenChange={selectProps.onOpenChange}
            />
          </NativeHostedTrailingControl>
        }
      />
    );
  }

  const menuItems = selectItems.map((item) => ({
    ...item,
    checkbox: true,
    iconProps:
      item.swatchColor == null
        ? undefined
        : {
            androidIconColor: item.swatchColor,
            androidIconName: "presence_online",
            ios: { hierarchicalColor: item.swatchColor, name: "circle.fill" as any },
          },
    label: (context: any) => getSelectLabel(item, context.value),
    onSelect: () => selectProps.onValueChange?.(item.value),
    selected: item.value === selectedValue,
  }));
  return (
    <NativePressRow
      {...itemProps}
      disabled={disabled}
      labelOpacity={fadeTitleOnOpen && menuOpen ? NATIVE_LIST_ITEM_OPEN_OPACITY : 1}
      nativeHaptics={false}
      onPress={() => menuRef.current?.presentMenu()}
      trailingControl={
        <NativeHostedTrailingControl disableInEditMode>
          <Menu
            {...(selectProps as any)}
            __menuRef={menuRef}
            items={menuItems}
            native
            nativeHaptics={inheritedHaptics}
            nativeTrigger
            nativeTriggerContainerStyle={styles.selectInlineTrigger}
            nativeTriggerIcon="chevrons-up-down"
            nativeTriggerLabelProps={{
              ...(nativeTriggerLabelProps as any),
              opacity: nativeTriggerLabelProps.opacity,
            }}
            nativeTriggerFeedbackOpacity={{
              disabled: NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
              press: NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
              webHover: NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
              webPress: NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
              ...selectProps.nativeTriggerFeedbackOpacity,
            }}
            nativeTriggerProps={{
              ...(selectProps.nativeTriggerProps as any),
              iconColor:
                itemProps.valueColor ??
                selectProps.nativeTriggerProps?.iconColor ??
                theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
            }}
            onOpenWillChange={(nextOpen: boolean) => {
              setMenuOpen(nextOpen);
              (selectProps as any).onOpenWillChange?.(nextOpen);
            }}
            onOpenChange={selectProps.onOpenChange}
            triggerLabel={selectedTriggerLabel}
            triggerProps={{ ...(selectProps as any).triggerProps, disabled }}
          />
        </NativeHostedTrailingControl>
      }
      value={undefined}
    />
  );
}
