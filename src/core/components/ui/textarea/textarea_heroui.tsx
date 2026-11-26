import { TextArea } from "@heroui/react/textarea";
import { useWebInputProps } from "../input/input_props_web";
import type { TextareaProps } from "./types";
export function TextareaHeroUI({
  herouiWebProps,
  herouiNativeProps: _,
  className,
  rows,
  ...props
}: TextareaProps) {
  const input = useWebInputProps<
    HTMLTextAreaElement,
    NonNullable<TextareaProps["herouiWebProps"]>
  >(props, herouiWebProps, className);
  return <TextArea {...input} rows={rows ?? 4} />;
}
