import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch } from "heroui-native/switch";
import { ControlField } from "heroui-native/control-field";
import { View } from "react-native";
import { Text } from "../text";
import { FieldMessages } from "../utils/field_parts";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { SwitchLabel } from "./switch_label";
// Native has no size prop. md keeps its official default; the other two only adjust geometry.
const sizes = { sm: { root: "h-5 w-10", thumb: "h-4 w-6" }, md: { root: "", thumb: "" }, lg: { root: "h-7 w-14", thumb: "h-6 w-8" } };
export function SwitchHeroUI(p) {
    const size = sizes[p.size ?? "md"];
    const context = { isSelected: p.selected, isDisabled: p.isDisabled ?? false };
    const thumb = resolveRenderProp(p.thumbContent, context);
    return _jsxs(ControlField, { ...p.herouiNativeProps, nativeID: p.nativeID ?? p.herouiNativeProps?.nativeID, isSelected: p.selected, onSelectedChange: p.onSelect, isDisabled: p.isDisabled, accessible: true, accessibilityRole: "switch", accessibilityLabel: p.accessibilityLabel ?? (typeof p.resolvedLabel === "string" ? p.resolvedLabel : undefined), accessibilityHint: typeof p.resolvedDescription === "string" ? p.resolvedDescription : undefined, accessibilityState: { checked: p.selected, disabled: p.isDisabled ?? false }, className: cn("flex-row items-center self-start gap-3", p.labelPosition === "left" && "flex-row-reverse", p.className, p.containerClassName), children: [_jsx(ControlField.Indicator, { pointerEvents: "none", accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants", children: _jsx(Switch, { ...p.controlProps?.herouiNativeProps, className: cn(size.root, p.controlProps?.className), children: _jsx(Switch.Thumb, { ...p.thumbProps?.herouiNativeProps, className: cn(size.thumb, p.thumbProps?.className), children: typeof thumb === "string" || typeof thumb === "number" ? _jsx(Text, { children: thumb }) : thumb }) }) }), (p.resolvedLabel != null || p.resolvedDescription != null) && _jsxs(View, { className: cn("min-w-0 shrink gap-1", p.isDisabled && "opacity-50"), children: [_jsx(SwitchLabel, { content: p.resolvedLabel, labelProps: p.labelProps, labelClassName: p.labelClassName }), _jsx(FieldMessages, { description: p.resolvedDescription, descriptionProps: p.descriptionProps, descriptionClassName: p.descriptionClassName })] })] });
}
