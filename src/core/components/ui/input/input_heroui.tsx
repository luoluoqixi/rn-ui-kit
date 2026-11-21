import { Input } from "@heroui/react/input";
import { useWebInputProps } from "../input/input_props_web";
import type { InputProps } from "./types";
export function InputHeroUI({
  herouiWebProps,
  herouiNativeProps: _,
  className,
  ...props
}: InputProps) {
  const input = useWebInputProps<
    HTMLInputElement,
    NonNullable<InputProps["herouiWebProps"]>
  >(props, herouiWebProps, className);
  return <Input {...input} />;
}
