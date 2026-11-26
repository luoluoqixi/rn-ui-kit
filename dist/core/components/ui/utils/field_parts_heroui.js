import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Description } from "@heroui/react/description";
import { FieldError } from "@heroui/react/field-error";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { cn } from "./cn";
export function FieldMessagesHeroUI(p) {
    const description = p.descriptionProps?.herouiWebProps;
    const error = p.errorMessageProps?.herouiWebProps;
    const descriptionClass = cn(p.descriptionProps?.className, p.descriptionClassName);
    const errorClass = cn(p.errorMessageProps?.className, p.errorMessageClassName);
    const descriptionFont = useDefaultTextStyle(undefined, descriptionClass);
    const errorFont = useDefaultTextStyle(undefined, errorClass);
    const errorStyle = error?.style;
    return (_jsxs(_Fragment, { children: [p.description != null && (_jsx(Description, { ...description, id: p.descriptionID, className: descriptionClass, style: { ...textWebStyle(descriptionFont), ...description?.style }, children: p.description })), p.isInvalid && p.errorMessage != null && (_jsx(FieldError, { ...error, id: p.errorID, className: errorClass, style: typeof errorStyle === "function"
                    ? (state) => ({ ...textWebStyle(errorFont), ...errorStyle(state) })
                    : { ...textWebStyle(errorFont), ...errorStyle }, children: p.errorMessage }))] }));
}
