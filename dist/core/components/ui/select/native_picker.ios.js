import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable no-spaced-func */
// Select iOS 原生 Picker 组件
import { Picker as RNPPicker } from "@react-native-picker/picker";
import { useTheme } from "@tamagui/core";
import { Check, ChevronDown } from "@tamagui/lucide-icons-2";
import { useCallback } from "react";
import React from "react";
import { Platform, View, useColorScheme, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem as TamaguiListItem, XStack } from "tamagui";
import { Button } from "../button";
import { Menu } from "../menu";
import { NativeTriggerPressable } from "../native_trigger";
import { dismissTrueSheet, presentTrueSheet } from "../sheet/native_sheet/true_sheet";
import { TrueSheetInnerStack, TrueSheetStackHost, trueSheetInnerStackScreenOptions, } from "../sheet/native_sheet/true_sheet/stack";
import { triggerNativeHaptics } from "../utils";
/** 用于为每个 wheel sheet 实例生成唯一名称的计数器 */
let wheelSheetCounter = 0;
/** wheel sheet 默认 detent 配置（iOS 16+ 有效，iOS < 16 降级为 mediumDetent） */
const WHEEL_SHEET_DETENT_DEFAULT = 0.3;
const DEFAULT_TRIGGER_HOVER_STYLE = { background: "$color3" };
const DEFAULT_TRIGGER_PRESS_STYLE = { background: "$color4" };
const NATIVE_PICKER_TRIGGER_SWATCH_SIZE = 14;
function renderNativePickerDefaultTriggerLabel(label, placeholder, swatchColor) {
    const text = (_jsx(TamaguiListItem.Text, { color: "$color", opacity: placeholder ? 0.58 : 1, children: label }));
    if (swatchColor == null) {
        return text;
    }
    return (_jsxs(XStack, { flex: 1, items: "center", children: [_jsx(View, { accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants", style: {
                    backgroundColor: swatchColor,
                    borderRadius: NATIVE_PICKER_TRIGGER_SWATCH_SIZE / 2,
                    height: NATIVE_PICKER_TRIGGER_SWATCH_SIZE,
                    marginRight: 12,
                    width: NATIVE_PICKER_TRIGGER_SWATCH_SIZE,
                } }), text] }));
}
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
function NativePickerDefaultTrigger({ disabled, label, placeholder, swatchColor, onPress, }) {
    return (_jsx(TamaguiListItem, { componentName: "SelectTrigger", background: "$background", rounded: "$4", borderWidth: 1, disabled: disabled, hoverStyle: DEFAULT_TRIGGER_HOVER_STYLE, iconAfter: ChevronDown, onPress: onPress, pressStyle: DEFAULT_TRIGGER_PRESS_STYLE, size: "$true", children: renderNativePickerDefaultTriggerLabel(label, placeholder, swatchColor) }));
}
/** wheel + 自定义 trigger */
const NativePickerWheelSheet = React.forwardRef(({ disabled, items, value, placeholder, onValueChange, resolvedNativeHaptics }, ref) => {
    const [pendingValue, setPendingValue] = React.useState(value ?? items[0]?.value ?? "");
    const selectedItem = items.find((item) => item.value === value);
    const selectedLabel = selectedItem?.label ?? null;
    const [sheetName] = React.useState(() => `select-wheel-${++wheelSheetCounter}`);
    const openSheet = useCallback((shouldTriggerHaptics) => {
        if (disabled)
            return;
        if (shouldTriggerHaptics) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
        setPendingValue(value ?? items[0]?.value ?? "");
        presentTrueSheet(sheetName);
    }, [disabled, resolvedNativeHaptics, value, items, sheetName]);
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
    return (_jsxs(_Fragment, { children: [_jsx(NativePickerDefaultTrigger, { disabled: disabled, label: selectedLabel ?? (typeof placeholder === "string" ? placeholder : "选择"), onPress: () => openSheet(true), placeholder: selectedLabel == null, swatchColor: selectedItem?.swatchColor }), _jsx(WheelTrueSheet, { items: items, title: title, sheetName: sheetName, pendingValue: pendingValue, setPendingValue: setPendingValue, onCancel: handleCancel, onDone: handleDone })] }));
});
const NativePickerSwiftUIMenuTrigger = React.forwardRef(({ active, containerStyle, content, disabled, icon, keepPressedOpacity, label, labelProps, onPress, pressedOpacity, }, forwardedRef) => (_jsx(NativeTriggerPressable, { ref: forwardedRef, active: active, content: content, containerStyle: containerStyle, disabled: disabled, icon: icon, keepPressedOpacity: keepPressedOpacity, label: label, labelProps: labelProps, onPress: onPress, pressedOpacity: pressedOpacity, style: disabled ? { opacity: 0.5 } : undefined })));
/** wheel + 原生 trigger（SwiftUI menu 按钮） */
const NativePickerWheelNativeTriggerSheet = React.forwardRef(({ disabled, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabel, nativeTriggerLabelProps, nativeTriggerPressedOpacity, items, placeholder, value, onValueChange, resolvedNativeHaptics, }, ref) => {
    const [pendingValue, setPendingValue] = React.useState(value ?? items[0]?.value ?? "");
    const [sheetName] = React.useState(() => `select-wheel-${++wheelSheetCounter}`);
    const openSheet = useCallback((shouldTriggerHaptics) => {
        if (disabled)
            return;
        if (shouldTriggerHaptics) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
        setPendingValue(value ?? items[0]?.value ?? "");
        presentTrueSheet(sheetName);
    }, [disabled, resolvedNativeHaptics, value, items, sheetName]);
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
    return (_jsxs(_Fragment, { children: [_jsx(NativePickerSwiftUIMenuTrigger, { containerStyle: nativeTriggerContainerStyle, content: nativeTriggerContent, disabled: disabled, icon: nativeTriggerIcon, label: nativeTriggerLabel, labelProps: nativeTriggerLabelProps, onPress: () => openSheet(true), pressedOpacity: nativeTriggerPressedOpacity }), _jsx(WheelTrueSheet, { items: items, title: title, sheetName: sheetName, pendingValue: pendingValue, setPendingValue: setPendingValue, onCancel: handleCancel, onDone: handleDone })] }));
});
/**
 * dropdown + 自定义 trigger：复用 Menu 组件实现。
 * Menu 的 MenuTrigger 包装自定义 YStack，点击时显示选项列表。
 */
function NativePickerDropdownCustom({ disabled, items, value, placeholder, onValueChange, onOpenChange, onOpenWillChange, resolvedNativeHaptics, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabel, nativeTriggerLabelProps, __menuRef, }) {
    const selectedItem = items.find((item) => item.value === value);
    const selectedLabel = selectedItem?.label ?? null;
    const handleSelect = useCallback((itemValue) => {
        if (disabled)
            return;
        onValueChange?.(itemValue || null);
        triggerNativeHaptics(resolvedNativeHaptics);
    }, [disabled, onValueChange, resolvedNativeHaptics]);
    const handleOpenChange = useCallback((nextOpen) => onOpenChange?.(nextOpen), [onOpenChange]);
    const trigger = nativeTrigger ? undefined : (_jsx(NativePickerDefaultTrigger, { disabled: disabled, label: selectedLabel ?? (typeof placeholder === "string" ? placeholder : "选择"), placeholder: selectedLabel == null, swatchColor: selectedItem?.swatchColor }));
    // iOS 原生菜单的容器本身仍会接收点击；禁用时不挂载菜单，只保留静态 trigger。
    if (disabled) {
        return nativeTrigger ? (_jsx(NativePickerSwiftUIMenuTrigger, { containerStyle: nativeTriggerContainerStyle, content: nativeTriggerContent, disabled: true, icon: nativeTriggerIcon, label: nativeTriggerLabel, labelProps: nativeTriggerLabelProps })) : (trigger);
    }
    return (_jsx(Menu, { nativeHaptics: resolvedNativeHaptics, nativeTrigger: nativeTrigger, nativeTriggerContainerStyle: nativeTriggerContainerStyle, nativeTriggerContent: nativeTriggerContent, nativeTriggerIcon: nativeTriggerIcon, nativeTriggerLabel: nativeTriggerLabel, nativeTriggerLabelProps: nativeTriggerLabelProps, onOpenChange: handleOpenChange, onOpenWillChange: onOpenWillChange, trigger: trigger, 
        // @ts-expect-error patch
        __menuRef: __menuRef, children: items.map((item) => (_jsxs(Menu.CheckboxItem, { checked: item.value === value, onSelect: () => handleSelect(item.value), disabled: item.disabled ?? item.isDisabled, children: [_jsx(Menu.ItemTitle, { children: item.label }), _jsx(Menu.ItemIndicator, { children: _jsx(Check, { size: 16, color: "$color10" }) }), item.swatchColor != null ? (_jsx(Menu.ItemIcon, { ios: { name: "circle.fill", hierarchicalColor: item.swatchColor } })) : null] }, item.value))) }));
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
            if (props.disabled)
                return;
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
    const { disabled, items, value, placeholder, mode, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabel, nativeTriggerLabelProps, nativeTriggerPressedOpacity, onValueChange, onOpenChange, onOpenWillChange, resolvedNativeHaptics, } = props;
    // dropdown 组件
    if (mode === "dropdown") {
        return (_jsx(NativePickerDropdownCustom, { disabled: disabled, items: items, value: value, placeholder: placeholder, onValueChange: onValueChange, onOpenChange: (next) => {
                onOpenChange?.(next);
            }, onOpenWillChange: onOpenWillChange, resolvedNativeHaptics: resolvedNativeHaptics, nativeTrigger: nativeTrigger, nativeTriggerContainerStyle: nativeTriggerContainerStyle, nativeTriggerContent: nativeTriggerContent, nativeTriggerIcon: nativeTriggerIcon, nativeTriggerLabel: nativeTriggerLabel, nativeTriggerLabelProps: nativeTriggerLabelProps, __menuRef: menuControlRef }));
    }
    // wheel + Sheet + 原生 trigger
    if (mode === "wheel" && nativeTrigger) {
        return (_jsx(NativePickerWheelNativeTriggerSheet, { ref: wheelNativeRef, disabled: disabled, items: items, nativeTriggerContainerStyle: nativeTriggerContainerStyle, nativeTriggerContent: nativeTriggerContent, nativeTriggerIcon: nativeTriggerIcon, nativeTriggerLabel: nativeTriggerLabel, nativeTriggerLabelProps: nativeTriggerLabelProps, nativeTriggerPressedOpacity: nativeTriggerPressedOpacity, value: value, placeholder: placeholder, onValueChange: onValueChange, resolvedNativeHaptics: resolvedNativeHaptics }));
    }
    // wheel + Sheet + 自定义 trigger
    return (_jsx(NativePickerWheelSheet, { ref: wheelCustomRef, disabled: disabled, items: items, value: value, placeholder: placeholder, onValueChange: onValueChange, resolvedNativeHaptics: resolvedNativeHaptics }));
});
/** iOS 端永不渲染（shouldRenderNativePicker 恒为 false） */
export const NativePickerDialog = () => null;
