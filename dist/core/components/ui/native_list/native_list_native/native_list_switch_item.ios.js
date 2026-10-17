import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Toggle as SwiftToggle } from "@luoluoqixi/expo-ui-55/swift-ui";
import { disabled as disabledModifier, tint, toggleStyle, } from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";
import { useComponentThemeTokens as useTheme } from "../../utils/theme";
import { isIos15 } from "../../utils/platform";
import { toSwiftUIHexColor, triggerNativeHaptics, useResolvedNativeHaptics } from "../../utils";
import { NativePressRow, supportsNativeTextRow } from "../native_list_native.ios";
import { useResolvedNativeListHaptics } from "../haptics";
import { useNativeListEditMode } from "../edit_mode";
export function NativeListSwitchItem({ switchProps, ...itemProps }) {
    if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
        throw new Error("NativeListSwitchItem requires text title and subtitle on iOS.");
    }
    const editMode = useNativeListEditMode();
    const theme = useTheme();
    const [uncontrolledChecked, setUncontrolledChecked] = useState(switchProps.defaultChecked ?? false);
    const checked = switchProps.checked ?? uncontrolledChecked;
    const disabled = Boolean(itemProps.disabled || switchProps.disabled);
    const inheritedHaptics = useResolvedNativeListHaptics(itemProps.nativeHaptics ?? switchProps.nativeHaptics);
    const nativeHaptics = inheritedHaptics ?? !editMode;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const themeSwitchTint = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
    const switchTint = itemProps.btnTint === false
        ? null
        : typeof itemProps.btnTint === "string"
            ? (toSwiftUIHexColor(itemProps.btnTint) ?? itemProps.btnTint)
            : themeSwitchTint;
    const handleCheckedChange = (nextChecked) => {
        if (switchProps.checked == null)
            setUncontrolledChecked(nextChecked);
        switchProps.onCheckedChange?.(nextChecked);
    };
    const handleSwiftToggleChange = (nextChecked) => {
        handleCheckedChange(nextChecked);
        if (isIos15())
            triggerNativeHaptics(resolvedNativeHaptics);
    };
    return (_jsx(NativePressRow, { ...itemProps, nativeHaptics: nativeHaptics, disabled: disabled, onPress: () => handleCheckedChange(!checked), trailingControl: _jsx(SwiftToggle, { isOn: checked, modifiers: [
                toggleStyle("switch"),
                ...(switchTint != null ? [tint(switchTint)] : []),
                disabledModifier(editMode || disabled),
            ], onIsOnChange: handleSwiftToggleChange }), value: undefined }));
}
