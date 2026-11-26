import type { ComponentProps } from "react";
import type { TextField as NativeField } from "heroui-native/text-field";
import type { TextField as WebField } from "@heroui/react/textfield";
import type { InputProps } from "../input";
import type { TextareaProps } from "../textarea";
import type { InputGroupProps } from "../input_group";
import type { FieldMetadata, FieldSlotProps, TextInputOptions } from "../utils/field_types";
/** A complete field; the caller supplies data rather than compound children. */
export type TextFieldProps = TextInputOptions & FieldMetadata & FieldSlotProps<ComponentProps<typeof NativeField>, ComponentProps<typeof WebField>, keyof TextInputOptions | "onChange"> & {
    multiline?: boolean;
    rows?: number;
    inputProps?: Omit<InputProps, keyof TextInputOptions>;
    textareaProps?: Omit<TextareaProps, keyof TextInputOptions | "rows">;
    /** Prefix/suffix input; ignored for multiline fields. */
    inputGroupProps?: Omit<InputGroupProps, keyof TextInputOptions>;
};
