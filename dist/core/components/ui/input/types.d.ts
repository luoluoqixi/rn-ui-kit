import type { TextInput } from "react-native";
export type InputSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type InputProps = Omit<React.ComponentProps<typeof TextInput>, "size"> & React.RefAttributes<TextInput> & {
    autoFocusNative?: boolean;
    disabled?: boolean;
    size?: InputSize;
    placeholderClassName?: string;
    unstyled?: boolean;
};
