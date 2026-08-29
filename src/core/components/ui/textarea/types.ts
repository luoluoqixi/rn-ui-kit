import { TextInput } from "react-native";

export type TextareaSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type TextareaProps = Omit<React.ComponentProps<typeof TextInput>, "size"> &
  React.RefAttributes<TextInput> & {
    disabled?: boolean;
    placeholderClassName?: string;
    /** Controls text size only; textarea height remains content-driven. */
    size?: TextareaSize;
    unstyled?: boolean;
  };
