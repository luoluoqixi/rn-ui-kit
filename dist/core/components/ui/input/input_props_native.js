import { useImperativeHandle, useRef } from "react";
import { useDefaultTextStyle } from "../provider/font_provider";
import { useMergedRefs } from "../utils/field_state";
export function useNativeInputProps(props, nativeProps, className) {
    const { controlRef, style, type, inputMode, name: _, accessibilityLabel, isReadOnly, isRequired: _required, ...shared } = props;
    const inputRef = useRef(null);
    useImperativeHandle(controlRef, () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
    }), []);
    const ref = useMergedRefs(inputRef, nativeProps?.ref);
    const resolvedMode = inputMode ??
        (type === "email" || type === "url" || type === "tel" || type === "search"
            ? type
            : undefined);
    return {
        ...nativeProps,
        ...shared,
        inputMode: resolvedMode,
        ref,
        className,
        accessibilityLabel,
        secureTextEntry: type === "password",
        ...(props.isDisabled !== undefined || isReadOnly !== undefined
            ? { editable: !(props.isDisabled || isReadOnly) }
            : {}),
        accessibilityState: {
            ...nativeProps?.accessibilityState,
            disabled: props.isDisabled,
        },
        style: useDefaultTextStyle([style, nativeProps?.style], className),
    };
}
