import type { TextInput } from "react-native";

export type InputProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> & {
    autoFocusNative?: boolean;
    disabled?: boolean;
    placeholderClassName?: string;
    unstyled?: boolean;
  };
