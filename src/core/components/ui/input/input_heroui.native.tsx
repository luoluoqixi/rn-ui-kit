import { Input } from "heroui-native/input";
import { useNativeInputProps } from "../input/input_props_native";
import type { InputProps } from "./types";
export function InputHeroUI({
  herouiNativeProps,
  herouiWebProps: _,
  className,
  ...props
}: InputProps) {
  const input = useNativeInputProps(props, herouiNativeProps, className);
  return <Input {...input} />;
}
