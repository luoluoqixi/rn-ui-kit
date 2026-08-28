import { TextInput } from "react-native";
export type TextareaProps = React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput> & {
    disabled?: boolean;
    placeholderClassName?: string;
    unstyled?: boolean;
};
