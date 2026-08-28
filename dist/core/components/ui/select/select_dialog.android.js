import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { useUiTheme } from "../utils/theme";
import { itemLabel, flattenItems, SelectNativeTrigger, SelectBasicTrigger, useSelectState, } from "./shared";
export const SelectDialog = React.forwardRef(function SelectDialog(props, ref) {
    const { value, setValue } = useSelectState(props);
    const pickerRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const items = flattenItems(props);
    const theme = useUiTheme();
    const haptics = useResolvedNativeHaptics(props.nativeHaptics);
    const openPicker = () => {
        if (props.disabled || props.isDisabled)
            return;
        triggerNativeHaptics(haptics);
        setOpen(true);
        requestAnimationFrame(() => pickerRef.current?.focus());
        props.onOpenChange?.(true);
    };
    React.useImperativeHandle(ref, () => ({
        open: openPicker,
        close: () => setOpen(false),
    }), [openPicker]);
    return (_jsxs(View, { children: [props.nativeTrigger ? (_jsx(SelectNativeTrigger, { props: props, value: value ?? undefined, onPress: openPicker })) : (_jsx(SelectBasicTrigger, { props: props, value: value ?? undefined, onPress: openPicker })), open ? (_jsx(View, { style: styles.pickerHost, children: _jsx(Picker, { ...props.nativePickerProps, ref: pickerRef, mode: "dialog", selectedValue: value ?? "", onBlur: () => {
                        setOpen(false);
                        props.onOpenChange?.(false);
                    }, onValueChange: (next) => {
                        setValue(next);
                        triggerNativeHaptics(haptics);
                        setOpen(false);
                        props.onOpenChange?.(false);
                    }, children: items.map((item) => {
                        const selected = item.value === value;
                        return (_jsx(Picker.Item, { enabled: !(item.disabled ?? item.isDisabled), label: itemLabel(item, value ?? undefined), value: item.value, ...{
                                swatchColor: item.swatchColor,
                                style: {
                                    backgroundColor: selected ? theme.accent : "transparent",
                                    color: selected ? theme.accentForeground : undefined,
                                },
                            } }, item.value));
                    }) }) })) : null] }));
});
const styles = StyleSheet.create({
    pickerHost: { height: 1, left: 0, opacity: 0, position: "absolute", top: 0, width: 1 },
});
