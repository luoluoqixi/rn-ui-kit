import * as React from "react";
import { Platform, View } from "react-native";
import { NativeListRow } from "../native_list_basic";
import { Dropdown } from "../../dropdown";
import { useResolvedNativeListHaptics } from "../haptics";
import { useNativeListEditMode } from "../edit_mode";
import {
  NATIVE_LIST_EDIT_VALUE_OPACITY,
  NATIVE_LIST_ITEM_OPEN_OPACITY,
  NATIVE_LIST_ITEM_PRESS_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN,
  NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
} from "../constants";
import { useUiTheme } from "../../utils/theme";
import { triggerNativeHaptics } from "../../utils";
import type { NativeListDropdownItemProps } from "../types";

export function NativeListDropdownItem(props: NativeListDropdownItemProps) {
  const { dropdownProps, ...itemProps } = props;
  const theme = useUiTheme();
  const menuRef = React.useRef<{ presentMenu: () => void } | null>(null);
  const presentingMenuRef = React.useRef(false);
  // The native trigger and the row can both receive the same iOS touch.
  // Mark trigger touches so the row does not call presentMenu a second time.
  const triggerInteractionRef = React.useRef(false);
  const triggerInteractionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTriggerInteractionTimer = React.useCallback(() => {
    if (triggerInteractionTimerRef.current != null) {
      clearTimeout(triggerInteractionTimerRef.current);
      triggerInteractionTimerRef.current = null;
    }
  }, []);

  React.useEffect(() => clearTriggerInteractionTimer, [clearTriggerInteractionTimer]);

  const beginTriggerInteraction = React.useCallback(
    (_event?: { stopPropagation?: () => void }) => {
      clearTriggerInteractionTimer();
      triggerInteractionRef.current = true;
    },
    [clearTriggerInteractionTimer],
  );

  const finishTriggerInteraction = React.useCallback(
    (_event?: { stopPropagation?: () => void }) => {
      clearTriggerInteractionTimer();
      triggerInteractionTimerRef.current = setTimeout(() => {
        triggerInteractionRef.current = false;
        triggerInteractionTimerRef.current = null;
      }, 750);
    },
    [clearTriggerInteractionTimer],
  );

  const cancelTriggerInteraction = React.useCallback(
    (_event?: { stopPropagation?: () => void }) => {
      clearTriggerInteractionTimer();
      triggerInteractionRef.current = false;
    },
    [clearTriggerInteractionTimer],
  );

  const consumeTriggerInteraction = React.useCallback(() => {
    if (!triggerInteractionRef.current) return false;
    cancelTriggerInteraction();
    return true;
  }, [cancelTriggerInteraction]);
  // 与原生 iOS item 一样，整行和右侧 trigger 都以菜单即将开关的事件
  // 进入反馈状态。不要将该视觉状态作为 Dropdown 的受控 open 回传，
  // 否则原生 trigger 会等到 did-change 才更新，造成两者错拍。
  const [uncontrolledWillOpen, setUncontrolledWillOpen] = React.useState(
    Boolean(dropdownProps.defaultOpen),
  );
  const menuOpen = dropdownProps.open ?? uncontrolledWillOpen;
  const editMode = useNativeListEditMode();
  const inheritedHaptics = useResolvedNativeListHaptics(
    itemProps.nativeHaptics ?? dropdownProps.nativeHaptics,
  );
  const disabled = Boolean(
    itemProps.disabled || dropdownProps.disabled || dropdownProps.triggerProps?.disabled,
  );
  const label = itemProps.value ?? itemProps.title ?? "更多";
  const triggerColor =
    itemProps.valueColor ?? (theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN] as string);
  const nativeTriggerLabelProps = {
    color: triggerColor,
    fontSize: itemProps.valueFontSize,
    numberOfLines: 1,
    opacity: NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
    style: [itemProps.valueColor != null ? { color: itemProps.valueColor } : undefined],
  };

  const presentMenuFromRow = React.useCallback(() => {
    // Android's detached Zeego anchor is mounted one frame after the visible
    // trigger. A row press can therefore arrive while the ref is still empty.
    // Retry on the next frame so row and trigger use the same menu path.
    const present = () => menuRef.current?.presentMenu();
    if (menuRef.current != null) {
      present();
      return;
    }
    requestAnimationFrame(() => {
      if (menuRef.current != null) {
        present();
        return;
      }
      requestAnimationFrame(present);
    });
  }, []);

  if (editMode) {
    return (
      <NativeListRow
        {...itemProps}
        disabled={disabled}
        valueColor={triggerColor as string}
        value={label}
        valueOpacity={NATIVE_LIST_EDIT_VALUE_OPACITY}
      />
    );
  }

  const handleMenuOpenWillChange = (nextOpen: boolean) => {
    if (dropdownProps.open == null) setUncontrolledWillOpen(nextOpen);
    presentingMenuRef.current = nextOpen;
    dropdownProps.onOpenWillChange?.(nextOpen);
  };

  return (
    <NativeListRow
      {...itemProps}
      cursorDefault
      disabled={disabled}
      labelOpacity={props.fadeTitleOnOpen !== false && menuOpen ? NATIVE_LIST_ITEM_OPEN_OPACITY : 1}
      nativeHaptics={false}
      onPress={() => {
        if (Platform.OS === "ios" && consumeTriggerInteraction()) return;
        if (disabled || menuOpen || presentingMenuRef.current) return;
        itemProps.onPress?.();
        triggerNativeHaptics(inheritedHaptics);
        if (dropdownProps.open === undefined) {
          setUncontrolledWillOpen(true);
        }
        presentingMenuRef.current = true;
        presentMenuFromRow();
      }}
      pressedOpacity={NATIVE_LIST_ITEM_PRESS_OPACITY}
      suppressPressBackground
      value={undefined}
      trailing={
        <View
          collapsable={false}
          onTouchCancel={Platform.OS === "ios" ? cancelTriggerInteraction : undefined}
          onTouchEnd={Platform.OS === "ios" ? finishTriggerInteraction : undefined}
          onTouchStart={Platform.OS === "ios" ? beginTriggerInteraction : undefined}
          style={{ alignItems: "center", alignSelf: "stretch", justifyContent: "center" }}
        >
          <Dropdown
            {...dropdownProps}
            __menuRef={menuRef}
            {...(dropdownProps.open === undefined ? {} : { open: dropdownProps.open })}
            nativeHaptics={inheritedHaptics}
            nativeTrigger
            nativeTriggerIcon="chevrons-up-down"
            nativeTriggerLabelProps={nativeTriggerLabelProps}
            nativeTriggerProps={{
              ...dropdownProps.nativeTriggerProps,
              iconColor:
                itemProps.valueColor ??
                dropdownProps.nativeTriggerProps?.iconColor ??
                theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
            }}
            nativeTriggerHoverBackground={false}
            nativeTriggerFeedbackOpacity={{
              disabled: NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
              press: NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
              webHover: NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
              webPress: NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
              ...dropdownProps.nativeTriggerFeedbackOpacity,
            }}
            onOpenWillChange={handleMenuOpenWillChange}
            onOpenChange={(nextOpen) => {
              // Android does not reliably emit the will-change callback when
              // the native menu is dismissed. Keep both guards and the row
              // opacity state in sync from the final state callback as well.
              if (dropdownProps.open == null) {
                setUncontrolledWillOpen(nextOpen);
              }
              presentingMenuRef.current = nextOpen;
              if (!nextOpen && Platform.OS === "ios") {
                cancelTriggerInteraction();
              }
              dropdownProps.onOpenChange?.(nextOpen);
            }}
            triggerLabel={label}
            triggerProps={{ ...dropdownProps.triggerProps, disabled }}
          />
        </View>
      }
    />
  );
}
