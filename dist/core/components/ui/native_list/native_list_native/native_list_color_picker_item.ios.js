import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { View } from "react-native";
import { NativeListColorPickerSheet } from "../color_picker_sheet";
import { NativePressRow, supportsNativeTextRow } from "../native_list_native.ios";
import { OverlayScopedPortal } from "../../utils/overlay";
export function NativeListColorPickerItem({ color, onColorChange, confirmOnDone, colorPickerProps, pickerHeight, sheetProps, ...itemProps }) {
    const [open, setOpen] = React.useState(false);
    const portalName = React.useId();
    const closingRef = React.useRef(false);
    const closeTimerRef = React.useRef(null);
    const disabled = itemProps.disabled;
    React.useEffect(() => () => {
        if (closeTimerRef.current != null)
            clearTimeout(closeTimerRef.current);
    }, []);
    const handleOpenChange = React.useCallback((nextOpen) => {
        if (closeTimerRef.current != null)
            clearTimeout(closeTimerRef.current);
        if (!nextOpen) {
            closingRef.current = true;
            closeTimerRef.current = setTimeout(() => {
                closingRef.current = false;
                closeTimerRef.current = null;
            }, 600);
        }
        else {
            closingRef.current = false;
        }
        setOpen(nextOpen);
    }, []);
    if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
        throw new Error("NativeListColorPickerItem requires text title and subtitle on iOS.");
    }
    return (_jsxs(_Fragment, { children: [_jsx(NativePressRow, { ...itemProps, disabled: disabled, onPress: () => {
                    if (disabled || closingRef.current)
                        return;
                    itemProps.onPress?.();
                    handleOpenChange(true);
                }, trailing: _jsx(View, { style: { backgroundColor: color, borderRadius: 999, height: 24, width: 24 } }) }), _jsx(OverlayScopedPortal, { name: `native-list-color-picker-sheet-${portalName}`, children: _jsx(NativeListColorPickerSheet, { color: color, colorPickerProps: colorPickerProps, confirmOnDone: confirmOnDone, onColorChange: onColorChange, onOpenChange: handleOpenChange, open: open, pickerHeight: pickerHeight, sheetProps: sheetProps }) })] }));
}
