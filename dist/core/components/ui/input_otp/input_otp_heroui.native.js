import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InputOTP } from "heroui-native/input-otp";
import { Fragment } from "react";
import { useDefaultTextStyle } from "../provider/font_provider";
import { otpGroups } from "./input_otp_state";
export function InputOTPHeroUI({ maxLength, groupSize, groupProps, slotProps, separatorProps, className, value, defaultValue, onChangeText, onComplete, pattern = "^\\d+$", pasteTransformer, placeholder, inputMode = "numeric", variant, isDisabled, isInvalid, nativeID, accessibilityLabel, herouiNativeProps, }) {
    const groups = otpGroups(maxLength, groupSize);
    const length = groups.flat().length;
    const font = useDefaultTextStyle(undefined, slotProps?.className);
    return (_jsx(InputOTP, { ...herouiNativeProps, className: className, value: value, defaultValue: defaultValue, onChange: onChangeText, onComplete: onComplete, maxLength: length, pattern: pattern, pasteTransformer: pasteTransformer, placeholder: placeholder, inputMode: inputMode, variant: variant, isDisabled: isDisabled, isInvalid: isInvalid, textInputProps: {
            ...herouiNativeProps?.textInputProps,
            nativeID,
            accessibilityLabel,
        }, children: groups.map((indices, group) => (_jsxs(Fragment, { children: [group > 0 && (_jsx(InputOTP.Separator, { ...separatorProps?.herouiNativeProps, className: separatorProps?.className })), _jsx(InputOTP.Group, { ...groupProps?.herouiNativeProps, className: groupProps?.className, children: indices.map((index) => (_createElement(InputOTP.Slot, { ...slotProps?.herouiNativeProps, className: slotProps?.className, index: index, key: index },
                        _jsx(InputOTP.SlotPlaceholder, { style: font }),
                        _jsx(InputOTP.SlotValue, { style: font }),
                        _jsx(InputOTP.SlotCaret, {})))) })] }, group))) }));
}
