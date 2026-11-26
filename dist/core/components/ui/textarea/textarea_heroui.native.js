import { jsx as _jsx } from "react/jsx-runtime";
import { TextArea } from "heroui-native/text-area";
import { useNativeInputProps } from "../input/input_props_native";
export function TextareaHeroUI({ herouiNativeProps, herouiWebProps: _, className, rows, ...props }) {
    const input = useNativeInputProps(props, herouiNativeProps, className);
    return (_jsx(TextArea, { ...input, numberOfLines: rows ?? herouiNativeProps?.numberOfLines }));
}
