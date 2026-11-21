import type { ComponentProps } from "react";
import type { Input as NativeInput } from "heroui-native/input";
import type { Input as WebInput } from "@heroui/react/input";
import type { FieldSlotProps, TextInputOptions } from "../utils/field_types";
export type { TextInputHandle } from "../utils/field_types";
export type InputProps = TextInputOptions &
  FieldSlotProps<
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
