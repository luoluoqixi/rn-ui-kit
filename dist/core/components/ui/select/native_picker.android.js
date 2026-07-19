import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable no-spaced-func */
// Select Android 原生 Picker 组件
import { Picker as RNPPicker } from "@react-native-picker/picker";
import { useTheme } from "@tamagui/core";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { triggerNativeHaptics } from "../utils";
import { NativeTriggerPressable } from "./native_trigger";
const DEFAULT_ANDROID_DROPDOWN_MIN_WIDTH = 240;
/** Android 原生 Picker Dialog：隐藏渲染 Picker 并通过 focus() 触发系统 dialog */
export function NativePickerDialog({ anchorAlign, anchorWidth, anchorEdgeOffset = 0, anchorStrategy = "native-offset", visible, value, items, mode, onValueChange, onBlur, }) {
    const pickerRef = useRef(null);
    const theme = useTheme();
    const [anchorContainerWidth, setAnchorContainerWidth] = React.useState(0);
    const handleAnchorContainerLayout = React.useCallback((event) => {
        const nextWidth = event.nativeEvent.layout.width;
        setAnchorContainerWidth((prevWidth) => Math.abs(prevWidth - nextWidth) < 0.5 ? prevWidth : nextWidth);
    }, []);
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => pickerRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [visible]);
    if (!visible)
        return null;
    const selectedBg = theme.color3?.val ?? "rgba(0,0,0,0.06)";
    const selectedColor = theme.color?.val ?? "#1A73E8";
    const resolvedAnchorWidth = anchorWidth ?? DEFAULT_ANDROID_DROPDOWN_MIN_WIDTH;
    const resolvedContainerWidth = anchorContainerWidth || resolvedAnchorWidth;
    const shouldUseNativeOffset = anchorStrategy === "native-offset";
    const dropdownHorizontalOffset = shouldUseNativeOffset
        ? anchorAlign === "center"
            ? (resolvedContainerWidth - resolvedAnchorWidth) / 2 + anchorEdgeOffset
            : anchorAlign === "end"
                ? resolvedContainerWidth - resolvedAnchorWidth - anchorEdgeOffset
                : anchorEdgeOffset
        : 0;
    const anchorStyle = shouldUseNativeOffset
        ? { left: 0, width: resolvedAnchorWidth }
        : anchorAlign === "center"
            ? {
                left: (resolvedContainerWidth - resolvedAnchorWidth) / 2 + anchorEdgeOffset,
                width: resolvedAnchorWidth,
            }
            : anchorAlign === "end"
                ? { right: anchorEdgeOffset, width: resolvedAnchorWidth }
                : { left: anchorEdgeOffset, width: resolvedAnchorWidth };
    return (_jsx(View, { style: styles.dialogContainer, onLayout: handleAnchorContainerLayout, children: _jsx(View, { style: [styles.dialogAnchor, anchorStyle], children: _jsx(RNPPicker, { ref: pickerRef, dropdownHorizontalOffset: dropdownHorizontalOffset, dropdownWidth: resolvedAnchorWidth, style: [styles.dialogPicker, { width: resolvedAnchorWidth }], selectedValue: value ?? "", onValueChange: onValueChange, onBlur: onBlur, mode: mode, children: items.map((item) => {
                    const isSelected = item.value === value;
                    return (_jsx(RNPPicker.Item, { label: item.label, value: item.value, enabled: !(item.disabled ?? item.isDisabled), style: {
                            backgroundColor: isSelected ? selectedBg : "transparent",
                            color: isSelected ? selectedColor : undefined,
                        } }, item.value));
                }) }) }) }));
}
export const NativePickerSwiftUI = React.forwardRef((props, ref) => {
    const { items, value, mode, nativeDropdownAlign, nativeDropdownAnchorWidth, nativeDropdownEdgeOffset, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabelProps, onValueChange, resolvedNativeHaptics, } = props;
    const [openSignal, setOpenSignal] = React.useState(0);
    useImperativeHandle(ref, () => ({
        open() {
            setOpenSignal((c) => c + 1);
        },
    }));
    const [visible, setVisible] = React.useState(false);
    const selectedLabel = items.find((item) => item.value === (value ?? items[0]?.value ?? ""))?.label ?? "";
    const openPicker = React.useCallback((shouldTriggerHaptics) => {
        if (shouldTriggerHaptics) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
        setVisible((prev) => {
            if (prev) {
                requestAnimationFrame(() => setVisible(true));
                return false;
            }
            return true;
        });
    }, [resolvedNativeHaptics]);
    useEffect(() => {
        if (openSignal == null || openSignal <= 0) {
            return;
        }
        openPicker(false);
    }, [openPicker, openSignal]);
    return (_jsxs(View, { style: styles.triggerAnchor, children: [_jsx(NativeTriggerPressable, { content: nativeTriggerContent, containerStyle: nativeTriggerContainerStyle, icon: nativeTriggerIcon, label: selectedLabel, labelProps: nativeTriggerLabelProps, onPress: () => {
                    openPicker(true);
                } }), _jsx(NativePickerDialog, { anchorAlign: nativeDropdownAlign, anchorWidth: nativeDropdownAnchorWidth, anchorEdgeOffset: nativeDropdownEdgeOffset, anchorStrategy: "layout", visible: visible, value: value ?? "", items: items, mode: mode === "wheel" ? "dialog" : mode, onValueChange: (itemValue) => {
                    onValueChange?.(itemValue || null);
                    triggerNativeHaptics(resolvedNativeHaptics);
                    setVisible(false);
                }, onBlur: () => setVisible(false) })] }));
});
const styles = {
    dialogContainer: {
        left: 0,
        opacity: 0,
        pointerEvents: "none",
        position: "absolute",
        right: 0,
        top: 0,
    },
    dialogAnchor: {
        position: "absolute",
        top: 0,
    },
    dialogPicker: {
        minWidth: DEFAULT_ANDROID_DROPDOWN_MIN_WIDTH,
    },
    triggerAnchor: {
        position: "relative",
    },
};
