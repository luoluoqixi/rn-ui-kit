import type { ComponentProps } from "react";
import type { TextArea as NativeInput } from "heroui-native/text-area";
import type { TextArea as WebInput } from "@heroui/react/textarea";
import type { FieldSlotProps, TextInputOptions } from "../utils/field_types";
export type { TextInputHandle } from "../utils/field_types";
export type TextareaProps = TextInputOptions & {
  rows?: number;
} & FieldSlotProps<
    ComponentProps<typeof NativeInput>,
    ComponentProps<typeof WebInput>,
    | Exclude<keyof TextInputOptions, "style">
    | "editable"
    | "secureTextEntry"
    | "disabled"
    | "readOnly"
    | "required"
    | "id"
    | "rows"
  >;
