import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch } from "@heroui/react/switch";
import { SwitchLabel } from "./switch_label";
import { FieldMessages } from "../utils/field_parts";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
export function SwitchHeroUI(p) {
    const context = { isSelected: p.selected, isDisabled: p.isDisabled ?? false };
    return _jsxs(Switch, { ...p.herouiWebProps, id: p.nativeID ?? p.herouiWebProps?.id, size: p.size, isSelected: p.selected, isDisabled: p.isDisabled, onChange: p.onSelect, name: p.name, value: p.value, className: cn(p.className, p.containerClassName), children: [_jsxs(Switch.Content, { "aria-label": p.accessibilityLabel, className: cn(p.labelPosition === "left" && "flex-row-reverse"), children: [_jsx(Switch.Control, { ...p.controlProps?.herouiWebProps, "aria-hidden": true, className: p.controlProps?.className, children: _jsx(Switch.Thumb, { ...p.thumbProps?.herouiWebProps, className: p.thumbProps?.className, children: resolveRenderProp(p.thumbContent, context) }) }), _jsx(SwitchLabel, { content: p.resolvedLabel, labelProps: p.labelProps, labelClassName: p.labelClassName })] }), _jsx(FieldMessages, { description: p.resolvedDescription, descriptionProps: p.descriptionProps, descriptionClassName: cn(p.labelPosition === "left" && "ps-0", p.descriptionClassName) })] });
}
