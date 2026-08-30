import * as React from "react";
import { Platform } from "react-native";
import { NativeListRow } from "../native_list_basic";
import { Switch } from "../../switch";
import { useResolvedNativeListHaptics } from "../haptics";
import { useNativeListEditMode } from "../edit_mode";
import type { NativeListSwitchItemProps } from "../types";
import { isWeb } from "../../utils";

export function NativeListSwitchItem(props: NativeListSwitchItemProps) {
  const { switchProps, ...itemProps } = props;
  const editMode = useNativeListEditMode();
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
    switchProps.defaultChecked ?? false,
  );
  const checked = switchProps.checked ?? uncontrolledChecked;
  const disabled = Boolean(itemProps.disabled || switchProps.disabled);
  const inheritedHaptics = useResolvedNativeListHaptics(
    itemProps.nativeHaptics ?? switchProps.nativeHaptics,
  );
  const toggle = () => {
    if (disabled || editMode) return;
    const next = !checked;
    if (switchProps.checked == null) setUncontrolledChecked(next);
    switchProps.onCheckedChange?.(next);
  };
  return (
    <NativeListRow
      {...itemProps}
      disabled={disabled}
      // Android Compose Switch 保留 48dp 的触控布局；缩小默认行内边距，
      // 避免控件高度与 NativeListRow 的默认 padding 叠加后把整行撑高。
      paddingVertical={itemProps.paddingVertical ?? (Platform.OS === "android" ? 4 : undefined)}
      nativeHaptics={inheritedHaptics ?? true}
      onPress={() => {
        itemProps.onPress?.();
        toggle();
      }}
      trailing={
        <Switch
          {...switchProps}
          native={!isWeb()}
          size={switchProps.size ?? (isWeb() ? "xl" : undefined)}
          checked={checked}
          disabled={disabled || editMode}
          nativeHaptics={inheritedHaptics ?? true}
          onCheckedChange={toggle}
        />
      }
    />
  );
}
