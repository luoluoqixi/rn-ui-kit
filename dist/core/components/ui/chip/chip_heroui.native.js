import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Chip as HeroUIChip } from "heroui-native/chip";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent, normalizeSlotText } from "../utils/slot_content";
import { resolveChipContent } from "./chip_content";
export function ChipHeroUI(props) {
    const { size, variant, color, label, start, end, textClass } = resolveChipContent(props);
    const labelClass = cn(props.labelClassName, props.labelProps?.className);
    const labelFont = useDefaultTextStyle(props.labelProps?.herouiNativeProps?.style, labelClass);
    return (_jsx(TextClassContext.Provider, { value: cn(textClass, labelClass), children: _jsxs(HeroUIChip, { ...props.herouiNativeProps, size: size, variant: variant, color: color, className: props.className, children: [normalizeSlotText(start), hasSlotContent(label) && (_jsx(HeroUIChip.Label, { ...props.labelProps?.herouiNativeProps, className: labelClass, style: labelFont, children: label })), normalizeSlotText(end)] }) }));
}
