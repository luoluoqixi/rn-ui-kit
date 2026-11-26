import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InputOTP } from "@heroui/react/input-otp";
import { Fragment } from "react";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { otpGroups } from "./input_otp_state";
export function InputOTPHeroUI({ maxLength, groupSize, groupProps, slotProps, separatorProps, className, value, defaultValue, onChangeText, onComplete, pattern = "^\\d+$", pasteTransformer, placeholder, inputMode = "numeric", variant, isDisabled, isInvalid, nativeID, accessibilityLabel, herouiWebProps, }) {
    const groups = otpGroups(maxLength, groupSize);
    const length = groups.flat().length;
    const font = useDefaultTextStyle(undefined, slotProps?.className);
    return (_jsx(InputOTP, { ...herouiWebProps, className: className, value: value, defaultValue: defaultValue, onChange: onChangeText, onComplete: onComplete, maxLength: length, pattern: pattern, pasteTransformer: pasteTransformer, placeholder: placeholder, inputMode: inputMode, variant: variant, isDisabled: isDisabled, isInvalid: isInvalid, id: nativeID, "aria-label": accessibilityLabel, children: groups.map((indices, group) => (_jsxs(Fragment, { children: [group > 0 && (_jsx(InputOTP.Separator, { ...separatorProps?.herouiWebProps, className: separatorProps?.className })), _jsx(InputOTP.Group, { ...groupProps?.herouiWebProps, className: groupProps?.className, children: indices.map((index) => (_createElement(InputOTP.Slot, { ...slotProps?.herouiWebProps, className: slotProps?.className, index: index, key: index, style: {
                            ...textWebStyle(font),
                            ...slotProps?.herouiWebProps?.style,
                        } }))) })] }, group))) }));
}
