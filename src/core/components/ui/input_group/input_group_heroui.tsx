import { InputGroup } from "@heroui/react/input-group";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { useWebInputProps } from "../input/input_props_web";
import type { InputProps } from "../input";
import type { InputGroupDecoratorProps, InputGroupProps } from "./types";
function decorator(props?: InputGroupDecoratorProps) {
  return {
    ...props?.herouiWebProps,
    className: cn(
      props?.isDecorative && "pointer-events-none",
      props?.className,
    ),
    "aria-hidden": props?.isDecorative || undefined,
  };
}
function content(value: React.ReactNode) {
  return typeof value === "string" || typeof value === "number" ? (
    <Text color="muted">{value}</Text>
  ) : (
    value
  );
}
export function InputGroupHeroUI({
  prefix,
  suffix,
  prefixProps,
  suffixProps,
  inputProps,
  inputClassName,
  className,
  herouiWebProps,
  herouiNativeProps: _,
  ...props
}: InputGroupProps) {
  const input = useWebInputProps<
    HTMLInputElement,
    NonNullable<InputProps["herouiWebProps"]>
  >(
    props,
    inputProps?.herouiWebProps,
    cn("min-w-0", inputProps?.className, inputClassName),
  );
  return (
    <InputGroup
      {...herouiWebProps}
      className={cn("w-full", className)}
      variant={props.variant}
      isDisabled={props.isDisabled}
      isInvalid={props.isInvalid}
    >
      {prefix != null && (
        <InputGroup.Prefix {...decorator(prefixProps)}>
          {content(prefix)}
        </InputGroup.Prefix>
      )}
      <InputGroup.Input
        {...input}
        className={cn("min-w-0", inputProps?.className, inputClassName)}
      />
      {suffix != null && (
        <InputGroup.Suffix {...decorator(suffixProps)}>
          {content(suffix)}
        </InputGroup.Suffix>
      )}
    </InputGroup>
  );
}
