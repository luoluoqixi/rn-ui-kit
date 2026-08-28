import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Platform } from "react-native";
import { NativeListRow } from "../native_list_basic";
import { Switch } from "../../switch";
import { useResolvedNativeListHaptics } from "../haptics";
import { useNativeListEditMode } from "../edit_mode";
export function NativeListSwitchItem(props) {
    const { switchProps, ...itemProps } = props;
    const editMode = useNativeListEditMode();
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(switchProps.defaultChecked ?? false);
    const checked = switchProps.checked ?? uncontrolledChecked;
    const disabled = Boolean(itemProps.disabled || switchProps.disabled);
    const inheritedHaptics = useResolvedNativeListHaptics(itemProps.nativeHaptics ?? switchProps.nativeHaptics);
    const toggle = () => {
        if (disabled || editMode)
            return;
        const next = !checked;
        if (switchProps.checked == null)
            setUncontrolledChecked(next);
        switchProps.onCheckedChange?.(next);
    };
    return (_jsx(NativeListRow, { ...itemProps, disabled: disabled, 
        // Android Compose Switch 保留 48dp 的触控布局；缩小默认行内边距，
        // 避免控件高度与 NativeListRow 的默认 padding 叠加后把整行撑高。
        paddingVertical: itemProps.paddingVertical ?? (Platform.OS === "android" ? 4 : undefined), nativeHaptics: inheritedHaptics ?? true, onPress: () => {
            itemProps.onPress?.();
            toggle();
        }, trailing: _jsx(Switch, { ...switchProps, checked: checked, disabled: disabled || editMode, nativeHaptics: inheritedHaptics ?? true, onCheckedChange: toggle }) }));
}
