import { jsx as _jsx } from "react/jsx-runtime";
import { TextArea } from "@heroui/react/textarea";
import { useWebInputProps } from "../input/input_props_web";
export function TextareaHeroUI({ herouiWebProps, herouiNativeProps: _, className, rows, ...props }) {
    const input = useWebInputProps(props, herouiWebProps, className);
    return _jsx(TextArea, { ...input, rows: rows ?? 4 });
}
