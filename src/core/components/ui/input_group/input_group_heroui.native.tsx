import { InputGroup } from "heroui-native/input-group";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { useNativeInputProps } from "../input/input_props_native";
import type { InputGroupDecoratorProps, InputGroupProps } from "./types";
function decorator(props?: InputGroupDecoratorProps) {
  return {
    ...props?.herouiNativeProps,
    className: cn(props?.className),
    isDecorative: props?.isDecorative,
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
  herouiNativeProps,
  herouiWebProps: _,
  ...props
}: InputGroupProps) {
  const input = useNativeInputProps(
    props,
    inputProps?.herouiNativeProps,
    cn("min-w-0", inputProps?.className, inputClassName),
  );
  return (
    <InputGroup
      {...herouiNativeProps}
      className={cn("w-full", className)}
      isDisabled={props.isDisabled}
    >
      {prefix != null && (
        <InputGroup.Prefix {...decorator(prefixProps)}>
          {content(prefix)}
        </InputGroup.Prefix>
      )}
      <InputGroup.Input {...input} />
      {suffix != null && (
        <InputGroup.Suffix {...decorator(suffixProps)}>
          {content(suffix)}
        </InputGroup.Suffix>
      )}
    </InputGroup>
  );
}
