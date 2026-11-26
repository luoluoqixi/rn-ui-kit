import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InputGroup } from "@heroui/react/input-group";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { useWebInputProps } from "../input/input_props_web";
function decorator(props) {
    return {
        ...props?.herouiWebProps,
        className: cn(props?.isDecorative && "pointer-events-none", props?.className),
        "aria-hidden": props?.isDecorative || undefined,
    };
}
function content(value) {
    return typeof value === "string" || typeof value === "number" ? (_jsx(Text, { color: "muted", children: value })) : (value);
}
export function InputGroupHeroUI({ prefix, suffix, prefixProps, suffixProps, inputProps, inputClassName, className, herouiWebProps, herouiNativeProps: _, ...props }) {
    const input = useWebInputProps(props, inputProps?.herouiWebProps, cn("min-w-0", inputProps?.className, inputClassName));
    return (_jsxs(InputGroup, { ...herouiWebProps, className: cn("w-full", className), variant: props.variant, isDisabled: props.isDisabled, isInvalid: props.isInvalid, children: [prefix != null && (_jsx(InputGroup.Prefix, { ...decorator(prefixProps), children: content(prefix) })), _jsx(InputGroup.Input, { ...input, className: cn("min-w-0", inputProps?.className, inputClassName) }), suffix != null && (_jsx(InputGroup.Suffix, { ...decorator(suffixProps), children: content(suffix) }))] }));
}
