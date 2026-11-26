import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from "heroui-native/input";
import { useNativeInputProps } from "../input/input_props_native";
export function InputHeroUI({ herouiNativeProps, herouiWebProps: _, className, ...props }) {
    const input = useNativeInputProps(props, herouiNativeProps, className);
    return _jsx(Input, { ...input });
}
