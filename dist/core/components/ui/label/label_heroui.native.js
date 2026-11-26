import { jsx as _jsx } from "react/jsx-runtime";
import { Pressable } from "react-native";
import { Label } from "heroui-native/label";
import { cn } from "../utils/cn";
import { useDefaultTextStyle } from "../provider/font_provider";
export function LabelHeroUI({ children, className, textClassName, nativeID, isRequired, isInvalid, isDisabled = false, controlRef, herouiNativeProps, textProps }) {
    const classes = cn(textClassName, textProps?.className);
    const font = useDefaultTextStyle(textProps?.herouiNativeProps?.style, classes);
    return _jsx(Label, { ...herouiNativeProps, className: className, isRequired: isRequired, isInvalid: isInvalid, isDisabled: isDisabled, asChild: true, accessibilityState: { ...herouiNativeProps?.accessibilityState, disabled: isDisabled }, onPress: event => {
            herouiNativeProps?.onPress?.(event);
            if (!event.defaultPrevented)
                controlRef?.current?.focus();
        }, children: _jsx(Pressable, { disabled: isDisabled, children: _jsx(Label.Text, { ...textProps?.herouiNativeProps, nativeID: nativeID, className: classes, style: font, children: children }) }) });
}
