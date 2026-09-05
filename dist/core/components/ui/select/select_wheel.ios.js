import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { Button } from "../button";
import { cn } from "../utils/cn";
import { NativeSheet } from "../sheet/native_sheet";
import { isIos26Plus, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { flattenItems, itemLabel, SelectBasicTrigger, SelectNativeTrigger, useSelectState, } from "./shared";
import { Text } from "../text";
const SELECT_WHEEL_DEFAULT_DETENT = 0.3;
function resolveDefaultWheelDetent(width, height) {
    if (width <= height || height <= 0)
        return SELECT_WHEEL_DEFAULT_DETENT;
    // Keep the same physical sheet height as the portrait 30% detent after rotation.
    const detent = (SELECT_WHEEL_DEFAULT_DETENT * width) / height;
    return Math.min(1, Math.max(SELECT_WHEEL_DEFAULT_DETENT, detent));
}
export const SelectWheel = React.forwardRef(function SelectWheel(props, ref) {
    const { width, height } = useWindowDimensions();
    const { value, setValue } = useSelectState(props);
    const items = flattenItems(props);
    const [open, setOpen] = React.useState(false);
    const [pendingValue, setPendingValue] = React.useState(value ?? items[0]?.value ?? "");
    const haptics = useResolvedNativeHaptics(props.nativeHaptics);
    const openSheet = () => {
        if (props.disabled || props.isDisabled)
            return;
        setPendingValue(value ?? items[0]?.value ?? "");
        setOpen(true);
        props.onOpenChange?.(true);
        triggerNativeHaptics(haptics);
    };
    const closeSheet = (commit) => {
        if (commit && pendingValue !== value) {
            setValue(pendingValue);
            triggerNativeHaptics(haptics);
        }
        setOpen(false);
        props.onOpenChange?.(false);
    };
    React.useImperativeHandle(ref, () => ({
        open: openSheet,
        close: () => closeSheet(false),
    }), [openSheet]);
    const defaultButtonStyle = isIos26Plus() ? "glass" : undefined;
    const defaultButtonSize = {
        width: 40,
        height: isIos26Plus() ? 40 : 20,
    };
    const defaultWheelDetent = resolveDefaultWheelDetent(width, height);
    return (_jsxs(_Fragment, { children: [props.nativeTrigger ? (_jsx(SelectNativeTrigger, { props: props, value: value ?? undefined, onPress: openSheet })) : (_jsx(SelectBasicTrigger, { props: props, value: value ?? undefined, onPress: openSheet })), _jsx(NativeSheet, { ...props.nativeWheelSheetProps, detents: props.nativeWheelSheetProps?.detents ?? [defaultWheelDetent], dismissOnOverlayPress: props.nativeWheelSheetProps?.dismissOnOverlayPress ?? true, grabber: props.nativeWheelSheetProps?.grabber ?? false, open: open, onOpenChange: (next) => {
                    if (!next)
                        closeSheet(false);
                }, children: _jsxs(View, { ...props.nativeWheelContainerProps, className: cn("flex-1 px-4 pb-4", props.nativeWheelContainerProps?.className), children: [_jsxs(View, { ...props.nativeWheelButtonContainerProps, className: cn("flex-row items-center justify-between py-2 h-20", isIos26Plus() ? "h-20" : "h-14", props.nativeWheelButtonContainerProps?.className), children: [_jsx(Button, { ...props.nativeWheelCancelButtonProps, buttonSize: props.nativeWheelCancelButtonProps?.buttonSize ?? defaultButtonSize, native: true, nativeButtonStyle: props.nativeWheelCancelButtonProps?.nativeButtonStyle ?? defaultButtonStyle, title: props.nativeWheelCancelText ?? props.nativeWheelCancelButtonProps?.title ?? "取消", variant: props.nativeWheelCancelButtonProps?.variant ?? "ghost", onPress: props.nativeWheelCancelButtonProps?.onPress ?? (() => closeSheet(false)) }), _jsx(Text, { ...props.nativeWheelTitleProps, className: cn("text-base font-semibold", props.nativeWheelTitleProps?.className), children: typeof props.placeholder === "string" ? props.placeholder : "选择" }), _jsx(Button, { ...props.nativeWheelDoneButtonProps, buttonSize: props.nativeWheelDoneButtonProps?.buttonSize ?? defaultButtonSize, native: true, nativeButtonStyle: props.nativeWheelDoneButtonProps?.nativeButtonStyle ?? defaultButtonStyle, title: props.nativeWheelDoneText ?? props.nativeWheelDoneButtonProps?.title ?? "完成", onPress: props.nativeWheelDoneButtonProps?.onPress ?? (() => closeSheet(true)) })] }), _jsx(Picker, { ...props.nativePickerProps, selectedValue: pendingValue, style: [{ flex: 1 }, props.nativePickerProps?.style], onValueChange: setPendingValue, children: items.map((item) => (_jsx(Picker.Item, { enabled: !(item.disabled ?? item.isDisabled), label: itemLabel(item, pendingValue), value: item.value }, item.value))) })] }) })] }));
});
