import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Description } from "heroui-native/description";
import { FieldError } from "heroui-native/field-error";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "./cn";
export function FieldMessagesHeroUI(p) {
    const description = p.descriptionProps?.herouiNativeProps;
    const error = p.errorMessageProps?.herouiNativeProps;
    const descriptionClass = cn(p.descriptionProps?.className, p.descriptionClassName);
    const errorClass = cn(p.errorMessageProps?.className, p.errorMessageClassName);
    const descriptionFont = useDefaultTextStyle(undefined, descriptionClass);
    const errorFont = useDefaultTextStyle(error?.textProps?.style, errorClass);
    return (_jsxs(_Fragment, { children: [p.description != null && (_jsx(Description, { ...description, nativeID: p.descriptionID, className: descriptionClass, style: [descriptionFont, description?.style], isInvalid: false, children: p.description })), p.errorMessage != null && (_jsx(FieldError, { ...error, nativeID: p.errorID, className: errorClass, isInvalid: p.isInvalid ?? false, textProps: { ...error?.textProps, style: errorFont }, children: p.errorMessage }))] }));
}
