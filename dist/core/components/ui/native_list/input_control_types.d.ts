import type { TextInput } from "react-native";
export type NativeListInputSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type NativeListInputControlProps = Omit<React.ComponentProps<typeof TextInput>, "size"> & React.RefAttributes<TextInput> & {
    autoFocusNative?: boolean;
    disabled?: boolean;
    size?: NativeListInputSize;
    placeholderClassName?: string;
    unstyled?: boolean;
};
export type NativeListTextareaSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type NativeListTextareaControlProps = Omit<React.ComponentProps<typeof TextInput>, "size"> & React.RefAttributes<TextInput> & {
    disabled?: boolean;
    placeholderClassName?: string;
    /** Controls text size only; textarea height remains content-driven. */
    size?: NativeListTextareaSize;
    unstyled?: boolean;
};
