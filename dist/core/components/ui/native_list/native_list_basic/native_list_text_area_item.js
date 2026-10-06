import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet } from "react-native";
import { NativeListCustomItem } from "../native_list_basic";
import { Textarea } from "../../textarea";
import { useNativeListEditMode } from "../edit_mode";
export function NativeListTextAreaItem(props) {
    const { textAreaProps, ...itemProps } = props;
    const editMode = useNativeListEditMode();
    const disabled = Boolean(itemProps.disabled || textAreaProps.disabled);
    const textAreaHeight = resolveTextAreaHeight(textAreaProps);
    return (_jsx(NativeListCustomItem, { ...itemProps, disabled: disabled, children: _jsx(Textarea, { ...textAreaProps, disabled: disabled || editMode, unstyled: true, style: [
                {
                    height: textAreaHeight,
                    minHeight: textAreaHeight,
                    width: "100%",
                },
                textAreaProps.style,
            ] }) }));
}
function resolveTextAreaHeight(textAreaProps) {
    const style = StyleSheet.flatten(textAreaProps.style);
    const numberOfLines = typeof textAreaProps.numberOfLines === "number" ? textAreaProps.numberOfLines : 4;
    const configuredHeight = typeof style?.height === "number"
        ? style.height
        : typeof style?.minHeight === "number"
            ? style.minHeight
            : undefined;
    return configuredHeight ?? Math.max(100, numberOfLines * 24 + 20);
}
