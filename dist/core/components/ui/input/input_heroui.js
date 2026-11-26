import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from "@heroui/react/input";
import { useWebInputProps } from "../input/input_props_web";
export function InputHeroUI({ herouiWebProps, herouiNativeProps: _, className, ...props }) {
    const input = useWebInputProps(props, herouiWebProps, className);
    return _jsx(Input, { ...input });
}
