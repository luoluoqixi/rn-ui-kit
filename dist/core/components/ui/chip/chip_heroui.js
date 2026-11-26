import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Chip as HeroUIChip } from "@heroui/react/chip";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent } from "../utils/slot_content";
import { resolveChipContent } from "./chip_content";
export function ChipHeroUI(props) {
    const { size, variant, color, label, start, end, textClass } = resolveChipContent(props);
    const labelClass = cn(props.labelClassName, props.labelProps?.className);
    const labelFont = StyleSheet.flatten(useDefaultTextStyle(undefined, labelClass));
    return (_jsx(TextClassContext.Provider, { value: cn(textClass, labelClass), children: _jsxs(HeroUIChip, { ...props.herouiWebProps, size: size, variant: variant, color: color, className: props.className, children: [start, hasSlotContent(label) && (_jsx(HeroUIChip.Label, { ...props.labelProps?.herouiWebProps, className: labelClass, style: { fontFamily: labelFont?.fontFamily, ...props.labelProps?.herouiWebProps?.style }, children: label })), end] }) }));
}
