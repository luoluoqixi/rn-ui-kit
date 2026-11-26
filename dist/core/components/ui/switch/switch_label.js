import { jsx as _jsx } from "react/jsx-runtime";
import { Text } from "../text";
import { cn } from "../utils/cn";
/** Only plain labels receive automatic text wrapping; custom layouts stay intact. */
export function SwitchLabel({ content, labelProps, labelClassName }) {
    if (typeof content !== "string" && typeof content !== "number")
        return content;
    return _jsx(Text, { ...labelProps, className: cn("font-medium", labelProps?.className, labelClassName), children: content });
}
