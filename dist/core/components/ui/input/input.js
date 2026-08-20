import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet } from "react-native";
import { Input as TamaguiInput } from "tamagui";
import { os } from "../utils/platform";
export function Input(props) {
    const resolvedStyle = os() === "android" && props.multiline !== true
        ? [styles.androidSingleLineInput, props.style]
        : props.style;
    return _jsx(TamaguiInput, { ...props, style: resolvedStyle });
}
const styles = StyleSheet.create({
    androidSingleLineInput: {
        includeFontPadding: false,
        paddingVertical: 0,
        textAlignVertical: "center",
    },
});
