import { TextArea } from "heroui-native/text-area";
import { useNativeInputProps } from "../input/input_props_native";
import type { TextareaProps } from "./types";
export function TextareaHeroUI({
  herouiNativeProps,
  herouiWebProps: _,
  className,
  rows,
  ...props
}: TextareaProps) {
  const input = useNativeInputProps(props, herouiNativeProps, className);
  return (
    <TextArea
      {...input}
      numberOfLines={rows ?? herouiNativeProps?.numberOfLines}
    />
  );
}
