import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable no-spaced-func */
// Select iOS 原生 Picker 组件
import { Picker as RNPPicker } from "@react-native-picker/picker";
import { useTheme } from "@tamagui/core";
import { Check, ChevronDown } from "@tamagui/lucide-icons-2";
import { useCallback } from "react";
import React from "react";
import { Platform, View, useColorScheme, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem as TamaguiListItem } from "tamagui";
import { Button } from "../button";
import { Menu } from "../menu";
import { dismissTrueSheet, presentTrueSheet } from "../sheet/native_sheet/true_sheet";
import { TrueSheetInnerStack, TrueSheetStackHost, trueSheetInnerStackScreenOptions, } from "../sheet/native_sheet/true_sheet/stack";
import { triggerNativeHaptics } from "../utils";
import { NativeTriggerPressable } from "./native_trigger";
/** 用于为每个 wheel sheet 实例生成唯一名称的计数器 */
let wheelSheetCounter = 0;
/** wheel sheet 默认 detent 配置（iOS 16+ 有效，iOS < 16 降级为 mediumDetent） */
const WHEEL_SHEET_DETENT_DEFAULT = 0.3;
const DEFAULT_TRIGGER_HOVER_STYLE = { background: "$color3" };
const DEFAULT_TRIGGER_PRESS_STYLE = { background: "$color4" };
/** wheel 模式共享的 TrueSheet 弹出层 */
function WheelTrueSheet({ items, title, sheetName, pendingValue, setPendingValue, onCancel, onDone, }) {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const iOSVersion = parseInt(Platform.Version, 10);
    /** iOS < 16 不支持自定义 fraction detent，sheet 实际为 mediumDetent（~50%），
     *  内容区域偏大，需更多顶部偏移让 Picker 垂直居中 */
    const topPadding = iOSVersion < 16 ? Math.max(insets.top, 90) : Math.max(insets.top, 28);
    return (_jsx(TrueSheetStackHost, { name: sheetName, initialRouteName: "picker", onRequestClose: onCancel, sheetProps: { detents: [WHEEL_SHEET_DETENT_DEFAULT], dismissible: true }, screenOptions: {
            ...trueSheetInnerStackScreenOptions((colorScheme ?? "light"), undefined, theme.color10.val, theme.gray12.val),
            title,
            headerLeft: () => _jsx(Button, { native: true, onPress: onCancel, title: "\u5173\u95ED" }),
            headerRight: () => _jsx(Button, { native: true, onPress: onDone, title: "\u5B8C\u6210" }),
        }, children: _jsx(TrueSheetInnerStack.Screen, { name: "picker", children: () => (_jsx(View, { style: { paddingTop: topPadding, flex: 1 }, children: _jsx(RNPPicker, { selectedValue: pendingValue, onValueChange: setPendingValue, style: { flex: 1 }, children: items.map((item) => (_jsx(RNPPicker.Item, { label: item.label, value: item.value, enabled: !(item.disabled ?? item.isDisabled) }, item.value))) }) })) }) }));
}
/**
 * 非 nativeTrigger 的 iOS 原生 Picker 入口。
 * 使用 Tamagui Select.Trigger 相同的 ListItem componentName，确保组件主题色、尺寸和边框一致。
 */
function NativePickerDefaultTrigger({ label, placeholder, onPress, }) {
    return (_jsx(TamaguiListItem, { componentName: "SelectTrigger", background: "$background", rounded: "$4", borderWidth: 1, hoverStyle: DEFAULT_TRIGGER_HOVER_STYLE, iconAfter: ChevronDown, onPress: onPress, pressStyle: DEFAULT_TRIGGER_PRESS_STYLE, size: "$true", children: _jsx(TamaguiListItem.Text, { color: "$color", opacity: placeholder ? 0.58 : 1, children: label }) }));
}
/** wheel + 自定义 trigger */
const NativePickerWheelSheet = React.forwardRef(({ items, value, placeholder, onValueChange, resolvedNativeHaptics }, ref) => {
    const [pendingValue, setPendingValue] = React.useState(value ?? items[0]?.value ?? "");
    const selectedLabel = items.find((item) => item.value === value)?.label ?? null;
    const [sheetName] = React.useState(() => `select-wheel-${++wheelSheetCounter}`);
    const openSheet = useCallback((shouldTriggerHaptics) => {
        if (shouldTriggerHaptics) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
        setPendingValue(value ?? items[0]?.value ?? "");
        presentTrueSheet(sheetName);
    }, [resolvedNativeHaptics, value, items, sheetName]);
    React.useImperativeHandle(ref, () => ({
        open() {
            openSheet(true);
        },
    }));
    const handleDone = useCallback(() => {
        onValueChange?.(pendingValue || null);
        triggerNativeHaptics(resolvedNativeHaptics);
        dismissTrueSheet(sheetName);
    }, [onValueChange, resolvedNativeHaptics, pendingValue, sheetName]);
    const handleCancel = useCallback(() => {
        triggerNativeHaptics(resolvedNativeHaptics);
        dismissTrueSheet(sheetName);
    }, [resolvedNativeHaptics, sheetName]);
    const title = typeof placeholder === "string" ? placeholder : "选择";
    return (_jsxs(_Fragment, { children: [_jsx(NativePickerDefaultTrigger, { label: selectedLabel ?? (typeof placeholder === "string" ? placeholder : "选择"), onPress: () => openSheet(true), placeholder: selectedLabel == null }), _jsx(WheelTrueSheet, { items: items, title: title, sheetName: sheetName, pendingValue: pendingValue, setPendingValue: setPendingValue, onCancel: handleCancel, onDone: handleDone })] }));
});
const NativePickerSwiftUIMenuTrigger = React.forwardRef(({ containerStyle, content, icon, items, labelProps, onBeforePress, value, onPress }, forwardedRef) => {
    const selectedValue = value ?? items[0]?.value ?? "";
    const selectedLabel = items.find((item) => item.value === selectedValue)?.label ?? "";
    return (_jsx(NativeTriggerPressable, { ref: forwardedRef, content: content, containerStyle: containerStyle, icon: icon, label: selectedLabel, labelProps: labelProps, onPress: (event) => {
            onBeforePress?.();
            onPress?.(event);
        } }));
});
/** wheel + 原生 trigger（SwiftUI menu 按钮） */
const NativePickerWheelNativeTriggerSheet = React.forwardRef(({ nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabelProps, items, placeholder, value, onValueChange, resolvedNativeHaptics, }, ref) => {
    const [pendingValue, setPendingValue] = React.useState(value ?? items[0]?.value ?? "");
    const [sheetName] = React.useState(() => `select-wheel-${++wheelSheetCounter}`);
    const openSheet = useCallback((shouldTriggerHaptics) => {
        if (shouldTriggerHaptics) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
        setPendingValue(value ?? items[0]?.value ?? "");
        presentTrueSheet(sheetName);
    }, [resolvedNativeHaptics, value, items, sheetName]);
    React.useImperativeHandle(ref, () => ({
        open() {
            openSheet(true);
        },
    }));
    const handleDone = useCallback(() => {
        onValueChange?.(pendingValue || null);
        triggerNativeHaptics(resolvedNativeHaptics);
        dismissTrueSheet(sheetName);
    }, [onValueChange, resolvedNativeHaptics, pendingValue, sheetName]);
    const handleCancel = useCallback(() => {
        triggerNativeHaptics(resolvedNativeHaptics);
        dismissTrueSheet(sheetName);
    }, [resolvedNativeHaptics, sheetName]);
    const title = typeof placeholder === "string" ? placeholder : "选择";
    return (_jsxs(_Fragment, { children: [_jsx(NativePickerSwiftUIMenuTrigger, { containerStyle: nativeTriggerContainerStyle, content: nativeTriggerContent, icon: nativeTriggerIcon, items: items, labelProps: nativeTriggerLabelProps, value: value, onPress: () => openSheet(true) }), _jsx(WheelTrueSheet, { items: items, title: title, sheetName: sheetName, pendingValue: pendingValue, setPendingValue: setPendingValue, onCancel: handleCancel, onDone: handleDone })] }));
});
/**
 * dropdown + 自定义 trigger：复用 Menu 组件实现。
 * Menu 的 MenuTrigger 包装自定义 YStack，点击时显示选项列表。
 */
function NativePickerDropdownCustom({ items, value, placeholder, onValueChange, onOpenChange, open, resolvedNativeHaptics, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabelProps, __menuRef, }) {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const selectedLabel = items.find((item) => item.value === value)?.label ?? null;
    const resolvedOpen = open ?? internalOpen;
    const handleSelect = useCallback((itemValue) => {
        onValueChange?.(itemValue || null);
        triggerNativeHaptics(resolvedNativeHaptics);
    }, [onValueChange, resolvedNativeHaptics]);
    const handleOpenChange = useCallback((nextOpen) => {
        if (open == null) {
            setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    }, [onOpenChange, open]);
    const trigger = nativeTrigger ? (_jsx(NativePickerSwiftUIMenuTrigger, { containerStyle: nativeTriggerContainerStyle, content: nativeTriggerContent, icon: nativeTriggerIcon, items: items, labelProps: nativeTriggerLabelProps, onBeforePress: () => triggerNativeHaptics(resolvedNativeHaptics), value: value })) : (_jsx(NativePickerDefaultTrigger, { label: selectedLabel ?? (typeof placeholder === "string" ? placeholder : "选择"), onPress: () => triggerNativeHaptics(resolvedNativeHaptics), placeholder: selectedLabel == null }));
    return (_jsx(Menu, { onOpenChange: handleOpenChange, open: resolvedOpen, trigger: trigger, triggerProps: nativeTrigger ? { asChild: true } : undefined, 
        // @ts-expect-error patch
        __menuRef: __menuRef, children: items.map((item) => (_jsxs(Menu.CheckboxItem, { checked: item.value === value, onSelect: () => handleSelect(item.value), disabled: item.disabled ?? item.isDisabled, children: [_jsx(Menu.ItemTitle, { children: item.label }), _jsx(Menu.ItemIndicator, { children: _jsx(Check, { size: 16, color: "$color10" }) })] }, item.value))) }));
}
/**
 * iOS NativePicker：switch 入口。
 * dropdown → NativePickerDropdownCustom（含可选的 nativeTrigger SwiftUI menu）
 * wheel + nativeTrigger → NativePickerWheelNativeTriggerSheet
 * wheel + 自定义 trigger → NativePickerWheelSheet
 */
export const NativePickerSwiftUI = React.forwardRef((props, ref) => {
    const menuControlRef = React.useRef(null);
    const wheelNativeRef = React.useRef(null);
    const wheelCustomRef = React.useRef(null);
    React.useImperativeHandle(ref, () => ({
        open() {
            if (props.mode === "dropdown") {
                menuControlRef.current?.presentMenu();
            }
            else if (props.mode === "wheel" && props.nativeTrigger) {
                wheelNativeRef.current?.open();
            }
            else {
                wheelCustomRef.current?.open();
            }
        },
    }));
    const { items, value, placeholder, mode, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabelProps, onValueChange, onOpenChange, resolvedNativeHaptics, } = props;
    // dropdown 组件
    if (mode === "dropdown") {
        return (_jsx(NativePickerDropdownCustom, { items: items, value: value, placeholder: placeholder, onValueChange: onValueChange, onOpenChange: (next) => {
                onOpenChange?.(next);
            }, resolvedNativeHaptics: resolvedNativeHaptics, nativeTrigger: nativeTrigger, nativeTriggerContainerStyle: nativeTriggerContainerStyle, nativeTriggerContent: nativeTriggerContent, nativeTriggerIcon: nativeTriggerIcon, nativeTriggerLabelProps: nativeTriggerLabelProps, __menuRef: menuControlRef }));
    }
    // wheel + Sheet + 原生 trigger
    if (mode === "wheel" && nativeTrigger) {
        return (_jsx(NativePickerWheelNativeTriggerSheet, { ref: wheelNativeRef, items: items, nativeTriggerContainerStyle: nativeTriggerContainerStyle, nativeTriggerContent: nativeTriggerContent, nativeTriggerIcon: nativeTriggerIcon, nativeTriggerLabelProps: nativeTriggerLabelProps, value: value, placeholder: placeholder, onValueChange: onValueChange, resolvedNativeHaptics: resolvedNativeHaptics }));
    }
    // wheel + Sheet + 自定义 trigger
    return (_jsx(NativePickerWheelSheet, { ref: wheelCustomRef, items: items, value: value, placeholder: placeholder, onValueChange: onValueChange, resolvedNativeHaptics: resolvedNativeHaptics }));
});
/** iOS 端永不渲染（shouldRenderNativePicker 恒为 false） */
export const NativePickerDialog = () => null;
