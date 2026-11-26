import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InputGroup } from "heroui-native/input-group";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { useNativeInputProps } from "../input/input_props_native";
function decorator(props) {
    return {
        ...props?.herouiNativeProps,
        className: cn(props?.className),
        isDecorative: props?.isDecorative,
    };
}
function content(value) {
    return typeof value === "string" || typeof value === "number" ? (_jsx(Text, { color: "muted", children: value })) : (value);
}
export function InputGroupHeroUI({ prefix, suffix, prefixProps, suffixProps, inputProps, inputClassName, className, herouiNativeProps, herouiWebProps: _, ...props }) {
    const input = useNativeInputProps(props, inputProps?.herouiNativeProps, cn("min-w-0", inputProps?.className, inputClassName));
    return (_jsxs(InputGroup, { ...herouiNativeProps, className: cn("w-full", className), isDisabled: props.isDisabled, children: [prefix != null && (_jsx(InputGroup.Prefix, { ...decorator(prefixProps), children: content(prefix) })), _jsx(InputGroup.Input, { ...input }), suffix != null && (_jsx(InputGroup.Suffix, { ...decorator(suffixProps), children: content(suffix) }))] }));
}
