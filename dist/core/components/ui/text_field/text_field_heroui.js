import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextField } from "@heroui/react/textfield";
import { useId, useRef } from "react";
import { Input } from "../input";
import { InputGroup } from "../input_group";
import { Textarea } from "../textarea";
import { Label } from "../label";
import { FieldMessages } from "../utils/field_parts";
import { cn } from "../utils/cn";
import { useMergedRefs } from "../utils/field_state";
export function TextFieldHeroUI({ label, description, errorMessage, labelProps, labelClassName, descriptionProps, descriptionClassName, errorMessageProps, errorMessageClassName, inputProps, textareaProps, inputGroupProps, multiline, rows, className, herouiWebProps, herouiNativeProps: _, ...props }) {
    const generatedId = useId();
    const id = props.nativeID ?? generatedId;
    const labelID = id + "-label";
    const descriptionID = id + "-description";
    const errorID = id + "-error";
    const control = useRef(null);
    const controlRef = useMergedRefs(control, props.controlRef);
    // React Aria's TextField context owns these. Passing defaultValue again to
    // Textarea would combine the child's defaultValue with the context value.
    const { value, defaultValue, onChangeText, ...inputOptions } = props;
    const input = {
        ...inputOptions,
        // React Aria owns the Web field value and invokes the public callback once.
        onChangeText: undefined,
        controlRef,
        nativeID: id,
        accessibilityLabel: props.accessibilityLabel ??
            (typeof label === "string" ? label : undefined),
        "aria-labelledby": props["aria-labelledby"] ?? (label != null ? labelID : undefined),
        "aria-describedby": [
            props["aria-describedby"],
            description != null && descriptionID,
            props.isInvalid && errorMessage != null && errorID,
        ]
            .filter(Boolean)
            .join(" ") || undefined,
    };
    return (_jsxs(TextField, { ...herouiWebProps, className: cn("w-full", className), isDisabled: props.isDisabled, isInvalid: props.isInvalid, isRequired: props.isRequired, isReadOnly: props.isReadOnly, value: value, defaultValue: value === undefined ? defaultValue : undefined, onChange: onChangeText, validationBehavior: herouiWebProps?.validationBehavior ?? "aria", variant: props.variant, children: [label != null && (_jsx(Label, { ...labelProps, nativeID: labelID, htmlFor: id, controlRef: control, isDisabled: props.isDisabled, isInvalid: props.isInvalid, isRequired: props.isRequired, className: cn(labelProps?.className, labelClassName), children: label })), multiline ? (_jsx(Textarea, { ...textareaProps, ...input, rows: rows })) : inputGroupProps ? (_jsx(InputGroup, { ...inputGroupProps, ...input, inputProps: { ...inputProps, ...inputGroupProps.inputProps } })) : (_jsx(Input, { ...inputProps, ...input })), _jsx(FieldMessages, { description,
                descriptionProps,
                descriptionClassName,
                errorMessage,
                errorMessageProps,
                errorMessageClassName,
                descriptionID,
                errorID, isInvalid: props.isInvalid })] }));
}
