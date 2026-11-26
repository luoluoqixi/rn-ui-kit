import type { ComponentProps, ReactNode } from "react";
import type { SearchField as NativeSearch } from "heroui-native/search-field";
import type { SearchField as WebSearch } from "@heroui/react/search-field";
import type { FieldMetadata, FieldSlotProps, TextInputOptions } from "../utils/field_types";
import type { NativeHapticsSetting } from "../utils/haptics";
export type SearchFieldInputProps = FieldSlotProps<ComponentProps<typeof NativeSearch.Input>, ComponentProps<typeof WebSearch.Input>, Exclude<keyof TextInputOptions, "style"> | "onChange" | "editable" | "disabled" | "readOnly" | "required" | "id">;
export type SearchFieldProps = Omit<TextInputOptions, "type"> & FieldMetadata & FieldSlotProps<ComponentProps<typeof NativeSearch>, ComponentProps<typeof WebSearch>, Exclude<keyof TextInputOptions, "style"> | "onChange" | "onClear" | "onSubmit"> & {
    onSubmit?: (value: string) => void;
    onClear?: () => void;
    isClearable?: boolean;
    showSearchIcon?: boolean;
    searchIcon?: ReactNode;
    inputProps?: SearchFieldInputProps;
    inputClassName?: string;
    groupProps?: FieldSlotProps<ComponentProps<typeof NativeSearch.Group>, ComponentProps<typeof WebSearch.Group>>;
    groupClassName?: string;
    clearButtonClassName?: string;
    nativeHaptics?: NativeHapticsSetting;
};
