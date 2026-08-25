import { useRef, useState } from "react";

import {
  Button as SwiftButton,
  HStack,
  Image,
  Menu as SwiftMenu,
  Spacer,
  Text as SwiftText,
  ZStack,
} from "@luoluoqixi/expo-ui-55/swift-ui";
import {
  buttonStyle,
  contentShape,
  disabled as disabledModifier,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  opacity,
  shapes,
} from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";
import { Dropdown } from "../../dropdown";
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
  NativeRowContainer,
  NativeRowLabel,
  NativePressRow,
  renderNativeListSelectTriggerLabel,
  styles,
  getSelectLabel,
  toPlainText,
} from "../native_list_native.ios";
import { resolveSelectItemGroups } from "../../select/select_grouping";
import { useResolvedNativeListHaptics } from "../haptics";
import { useNativeListEditMode, useNativeListEditRow } from "../edit_mode";
import { useUiTheme } from "../../utils/theme";
import type { NativeListSelectItemProps } from "../types";

function selectValueModifiers(fontSize?: number) {
  return [font({ size: fontSize ?? 17, weight: "regular" }), lineLimit(1)];
}

function NativeIos15MenuSelectRow({
  itemProps,
  selectItems,
  selectProps,
}: {
  itemProps: Omit<NativeListSelectItemProps, "selectProps">;
  selectItems: ReturnType<typeof resolveSelectItemGroups>[number]["items"];
  selectProps: NativeListSelectItemProps["selectProps"];
}) {
  const editMode = useNativeListEditMode();
  const editRow = useNativeListEditRow({
    disabled: Boolean(itemProps.disabled || selectProps.disabled || selectProps.isDisabled),
    nativeScrollId: itemProps.nativeScrollId,
    nativeSelection: true,
    selectionId: itemProps.selectionId,
    selectionDisabled: itemProps.selectionDisabled,
  });
  const theme = useUiTheme();
  const disabled = Boolean(itemProps.disabled || selectProps.disabled || selectProps.isDisabled);
  const selectedValue = selectProps.value ?? selectProps.defaultValue;
  const selectedItem = selectItems.find((item) => item.value === selectedValue);
  const selectedLabel =
    selectedItem == null
      ? (toPlainText(selectProps.placeholder) ?? "请选择")
      : getSelectLabel(selectedItem, selectedValue ?? undefined);
  const triggerColor = itemProps.valueColor ?? theme.primary;

  return (
    <NativeRowContainer
      contextMenuProps={
        itemProps.contextMenuProps === false ? undefined : itemProps.contextMenuProps
      }
      disabled={disabled}
      nativeScrollId={itemProps.nativeScrollId}
      nativeSelectionId={editRow.editMode ? editRow.selectionId : undefined}
      onPress={editRow.onPress}
      paddingBottom={itemProps.paddingBottom}
      paddingHorizontal={itemProps.paddingHorizontal}
      paddingLeft={itemProps.paddingLeft}
      paddingRight={itemProps.paddingRight}
      paddingTop={itemProps.paddingTop}
      paddingVertical={itemProps.paddingVertical}
    >
      <SwiftMenu
        label={
          <HStack
            modifiers={[
              frame({ maxWidth: 99999, alignment: "leading" }),
              contentShape(shapes.rectangle()),
              opacity(editMode || disabled ? NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY : 1),
            ]}
            spacing={12}
          >
            {itemProps.sfSymbol != null ? (
              <ZStack
                alignment="center"
                modifiers={[
                  frame({
                    width: Math.max(24, itemProps.iconSize ?? 20),
                    alignment: "center",
                  }),
                ]}
              >
                <Image
                  color={itemProps.iconColor ?? theme.primary}
                  size={itemProps.iconSize ?? 20}
                  systemName={itemProps.sfSymbol}
                />
              </ZStack>
            ) : null}
            <NativeRowLabel
              subtitle={itemProps.subtitle}
              subtitleColor={itemProps.subtitleColor}
              subtitleFontSize={itemProps.subtitleFontSize}
              title={itemProps.title}
              titleAlign={itemProps.titleAlign}
              titleColor={itemProps.titleColor}
              titleFontSize={itemProps.titleFontSize}
            />
            <Spacer minLength={12} />
            {selectedItem?.swatchColor != null ? (
              <Image color={selectedItem.swatchColor} size={14} systemName="circle.fill" />
            ) : null}
            <SwiftText
              modifiers={[
                ...selectValueModifiers(itemProps.valueFontSize),
                foregroundStyle(triggerColor),
              ]}
            >
              {selectedLabel}
            </SwiftText>
            <Image color={triggerColor} size={13} systemName="chevron.up.chevron.down" />
          </HStack>
        }
        modifiers={[
          buttonStyle("plain"),
          frame({ maxWidth: 99999, alignment: "leading" }),
          contentShape(shapes.rectangle()),
          disabledModifier(editMode || disabled),
        ]}
      >
        {selectItems.map((item) => {
          const itemDisabled = Boolean(item.disabled || item.isDisabled);
          const selected = item.value === selectedValue;

          return (
            <SwiftButton
              key={item.value}
              label={getSelectLabel(item, selectedValue ?? undefined)}
              modifiers={[disabledModifier(itemDisabled)]}
              onPress={() => selectProps.onValueChange?.(item.value)}
              systemImage={selected ? "checkmark" : undefined}
            />
          );
        })}
      </SwiftMenu>
    </NativeRowContainer>
  );
}

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
  // iOS 15 会缓存 RN hosted trigger 的 intrinsic width。显式开启且满足简单 dropdown
  // 条件时，直接使用 SwiftUI Menu，让整行由 SwiftUI 负责测量和打开菜单。
  const usesIos15NativeMenu = itemProps.ios15NativeMenu === true;

  if (usesIos15NativeMenu) {
    return (
      <NativeIos15MenuSelectRow
        itemProps={itemProps}
        selectItems={selectItems}
        selectProps={selectProps}
      />
    );
  }

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
          <Dropdown
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
