import { TextField } from "heroui-native/text-field";
import { useId, useRef } from "react";
import { Input } from "../input";
import { InputGroup } from "../input_group";
import { Textarea } from "../textarea";
import { Label } from "../label";
import { FieldMessages } from "../utils/field_parts";
import { cn } from "../utils/cn";
import { useMergedRefs } from "../utils/field_state";
import type { TextInputHandle } from "../utils/field_types";
import type { TextFieldProps } from "./types";
export function TextFieldHeroUI({
  label,
  description,
  errorMessage,
  labelProps,
  labelClassName,
  descriptionProps,
  descriptionClassName,
  errorMessageProps,
  errorMessageClassName,
  inputProps,
  textareaProps,
  inputGroupProps,
  multiline,
  rows,
  className,
  herouiNativeProps,
  herouiWebProps: _,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = props.nativeID ?? generatedId;
  const labelID = id + "-label";
  const descriptionID = id + "-description";
  const errorID = id + "-error";
  const control = useRef<TextInputHandle>(null);
  const controlRef = useMergedRefs(control, props.controlRef);
  const input = {
    ...props,
    controlRef,
    nativeID: id,
    accessibilityLabel:
      props.accessibilityLabel ??
      (typeof label === "string" ? label : undefined),
    "aria-labelledby":
      props["aria-labelledby"] ?? (label != null ? labelID : undefined),
    "aria-describedby":
      [
        props["aria-describedby"],
        description != null && descriptionID,
        props.isInvalid && errorMessage != null && errorID,
      ]
        .filter(Boolean)
        .join(" ") || undefined,
  };
  return (
    <TextField
      {...herouiNativeProps}
      className={cn("w-full", className)}
      isDisabled={props.isDisabled}
      isInvalid={props.isInvalid}
      isRequired={props.isRequired}
    >
      {label != null && (
        <Label
          {...labelProps}
          nativeID={labelID}
          htmlFor={id}
          controlRef={control}
          isDisabled={props.isDisabled}
          isInvalid={props.isInvalid}
          isRequired={props.isRequired}
          className={cn(labelProps?.className, labelClassName)}
        >
          {label}
        </Label>
      )}
      {multiline ? (
        <Textarea {...textareaProps} {...input} rows={rows} />
      ) : inputGroupProps ? (
        <InputGroup
          {...inputGroupProps}
          {...input}
          inputProps={{ ...inputProps, ...inputGroupProps.inputProps }}
        />
      ) : (
        <Input {...inputProps} {...input} />
      )}
      <FieldMessages
        {...{
          description,
          descriptionProps,
          descriptionClassName,
          errorMessage,
          errorMessageProps,
          errorMessageClassName,
          descriptionID,
          errorID,
        }}
        isInvalid={props.isInvalid}
      />
    </TextField>
  );
}
