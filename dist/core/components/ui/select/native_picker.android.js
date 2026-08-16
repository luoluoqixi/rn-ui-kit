import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable no-spaced-func */
// Select Android 原生 Picker 组件
import { Picker as RNPPicker } from "@react-native-picker/picker";
import { useTheme } from "@tamagui/core";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import { View, } from "react-native";
import { triggerNativeHaptics } from "../utils";
import { NativeTriggerPressable } from "../native_trigger";
const DEFAULT_ANDROID_DROPDOWN_MIN_WIDTH = 240;
/** Android 原生 Picker Dialog：隐藏渲染 Picker 并通过 focus() 触发系统 dialog */
export function NativePickerDialog({ anchorAlign, anchorWidth, anchorEdgeOffset = 0, anchorVerticalAlign = "top", anchorStrategy = "native-offset", visible, value, items, mode, onValueChange, onBlur, }) {
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
    const anchorHorizontalStyle = shouldUseNativeOffset
        ? { left: 0, width: resolvedAnchorWidth }
        : anchorAlign === "center"
            ? {
                left: (resolvedContainerWidth - resolvedAnchorWidth) / 2 + anchorEdgeOffset,
                width: resolvedAnchorWidth,
            }
            : anchorAlign === "end"
                ? { right: anchorEdgeOffset, width: resolvedAnchorWidth }
                : { left: anchorEdgeOffset, width: resolvedAnchorWidth };
    const anchorVerticalStyle = anchorVerticalAlign === "bottom" ? { bottom: 0 } : { top: 0 };
    if (!visible)
        return null;
    return (_jsx(View, { style: styles.dialogContainer, onLayout: handleAnchorContainerLayout, children: _jsx(View, { style: [styles.dialogAnchor, anchorHorizontalStyle, anchorVerticalStyle], children: _jsx(RNPPicker, { ref: pickerRef, dropdownHorizontalOffset: dropdownHorizontalOffset, dropdownWidth: resolvedAnchorWidth, style: [styles.dialogPicker, { width: resolvedAnchorWidth }], selectedValue: value ?? "", onValueChange: onValueChange, onBlur: onBlur, mode: mode, children: items.map((item) => {
                    const isSelected = item.value === value;
                    return (_jsx(RNPPicker.Item, { label: item.label, value: item.value, enabled: !(item.disabled ?? item.isDisabled), ...{ swatchColor: item.swatchColor }, style: {
                            backgroundColor: isSelected ? selectedBg : "transparent",
                            color: isSelected ? selectedColor : undefined,
                        } }, item.value));
                }) }) }) }));
}
export const NativePickerSwiftUI = React.forwardRef((props, ref) => {
    const { items, value, mode, nativeDropdownAlign, nativeDropdownAnchorWidth, nativeDropdownEdgeOffset, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabel, nativeTriggerLabelProps, nativeTriggerPressableProps, onValueChange, resolvedNativeHaptics, } = props;
    const [openSignal, setOpenSignal] = React.useState(0);
    const longPressedRef = useRef(false);
    useImperativeHandle(ref, () => ({
        open() {
            setOpenSignal((c) => c + 1);
        },
    }));
    const [visible, setVisible] = React.useState(false);
    const setPickerVisible = React.useCallback(() => {
        setVisible((prev) => {
            if (prev) {
                requestAnimationFrame(() => setVisible(true));
                return false;
            }
            return true;
        });
    }, []);
    const openPicker = React.useCallback((shouldTriggerHaptics) => {
        if (shouldTriggerHaptics) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
        setPickerVisible();
    }, [resolvedNativeHaptics, setPickerVisible]);
    useEffect(() => {
        if (openSignal == null || openSignal <= 0) {
            return;
        }
        openPicker(false);
    }, [openPicker, openSignal]);
    return (_jsxs(View, { style: styles.triggerAnchor, children: [_jsx(NativeTriggerPressable
            // Android dialog / wheel picker visibility is not a pressed state. Keeping
            // this active while the picker is visible made the trigger stay dim until
            // the dialog closed; the Pressable's real pressed state is sufficient.
            , { 
                // Android dialog / wheel picker visibility is not a pressed state. Keeping
                // this active while the picker is visible made the trigger stay dim until
                // the dialog closed; the Pressable's real pressed state is sufficient.
                active: false, content: nativeTriggerContent, containerStyle: nativeTriggerContainerStyle, disabled: nativeTriggerPressableProps?.disabled, icon: nativeTriggerIcon, label: nativeTriggerLabel, labelProps: nativeTriggerLabelProps, onLongPress: (event) => {
                    longPressedRef.current = true;
                    nativeTriggerPressableProps?.onLongPress?.(event);
                }, onPress: (event) => {
                    if (longPressedRef.current) {
                        longPressedRef.current = false;
                        return;
                    }
                    nativeTriggerPressableProps?.onPress?.(event);
                    openPicker(true);
                }, onPressIn: (event) => {
                    longPressedRef.current = false;
                    nativeTriggerPressableProps?.onPressIn?.(event);
                }, onPressOut: (event) => nativeTriggerPressableProps?.onPressOut?.(event), onTouchCancel: (event) => {
                    longPressedRef.current = false;
                    nativeTriggerPressableProps?.onTouchCancel?.(event);
                }, onTouchEnd: (event) => nativeTriggerPressableProps?.onTouchEnd?.(event) }), _jsx(NativePickerDialog, { anchorAlign: nativeDropdownAlign, anchorWidth: nativeDropdownAnchorWidth, anchorEdgeOffset: nativeDropdownEdgeOffset, anchorVerticalAlign: "top", anchorStrategy: "layout", visible: visible, value: value ?? "", items: items, mode: mode === "wheel" ? "dialog" : mode, onValueChange: (itemValue) => {
                    onValueChange?.(itemValue || null);
                    triggerNativeHaptics(resolvedNativeHaptics);
                    setVisible(false);
                }, onBlur: () => setVisible(false) })] }));
});
const styles = {
    dialogContainer: {
        bottom: 0,
        left: 0,
        opacity: 0,
        pointerEvents: "none",
        position: "absolute",
        right: 0,
        top: 0,
    },
    dialogAnchor: {
        position: "absolute",
    },
    dialogPicker: {
        minWidth: DEFAULT_ANDROID_DROPDOWN_MIN_WIDTH,
    },
    triggerAnchor: {
        position: "relative",
    },
};
