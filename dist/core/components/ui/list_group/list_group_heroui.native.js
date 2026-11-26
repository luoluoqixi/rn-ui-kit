import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDefaultTextStyle } from "../provider/font_provider";
import { Fragment } from "react";
import { View } from "react-native";
import { ListGroup } from "heroui-native/list-group";
import { Check } from "lucide-react-native";
import { Text } from "../text";
import { Icon } from "../icon";
import { Separator } from "../separator";
import { cn } from "../utils/cn";
import { useKeySelection } from "../utils/key_selection";
import { resolveRenderProp } from "../utils/render";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
export function ListGroupHeroUI(p) {
    const sections = p.sections ?? [{ id: "default", items: p.items ?? [] }];
    const font = useDefaultTextStyle();
    const all = sections.flatMap(s => [...s.items]);
    const state = useKeySelection({ ...p, selectionMode: p.selectionMode ?? "none" }, all);
    const haptics = useResolvedNativeHaptics(p.nativeHaptics);
    return _jsxs(View, { className: cn("gap-4", p.className), accessibilityLabel: p.accessibilityLabel, children: [all.length === 0 && (p.emptyContent ?? _jsx(Text, { color: "muted", children: "\u6682\u65E0\u5185\u5BB9" })), sections.filter(s => s.items.length).map(section => _jsxs(View, { className: "gap-2", children: [section.title != null && _jsx(Text, { color: "muted", className: "px-2 text-sm", children: section.title }), _jsx(ListGroup, { ...p.herouiNativeProps, children: section.items.map((item, index) => {
                            const ctx = { id: item.id, isSelected: state.selected.has(item.id), isDisabled: !!p.isDisabled || state.disabled.has(item.id) };
                            const selection = p.selectionMode && p.selectionMode !== "none";
                            return _jsxs(Fragment, { children: [_jsxs(ListGroup.Item, { ...item.herouiNativeProps, disabled: ctx.isDisabled, accessibilityLabel: item.textValue ?? (typeof item.title === "string" ? item.title : item.id), accessibilityRole: selection ? p.selectionMode === "single" ? "radio" : "checkbox" : "button", accessibilityState: { disabled: ctx.isDisabled, ...(selection ? { checked: ctx.isSelected } : {}) }, className: cn(ctx.isSelected && "bg-accent-soft", ctx.isDisabled && "opacity-disabled", item.className), onPress: () => { if (ctx.isDisabled)
                                            return; state.toggle(item.id); triggerNativeHaptics(haptics); item.onPress?.(); }, children: [item.startContent != null && _jsx(ListGroup.ItemPrefix, { children: resolveRenderProp(item.startContent, ctx) }), _jsxs(ListGroup.ItemContent, { children: [_jsx(ListGroup.ItemTitle, { style: font, children: resolveRenderProp(item.title, ctx) }), item.description != null && _jsx(ListGroup.ItemDescription, { style: font, children: resolveRenderProp(item.description, ctx) })] }), item.endContent != null && _jsx(ListGroup.ItemSuffix, { children: resolveRenderProp(item.endContent, ctx) }), selection ? ctx.isSelected && _jsx(ListGroup.ItemSuffix, { children: _jsx(Icon, { as: Check, size: "sm", color: "accent" }) }) : p.showChevron && _jsx(ListGroup.ItemSuffix, {})] }), p.showSeparators && index < section.items.length - 1 && _jsx(Separator, { className: "mx-4" })] }, item.id);
                        }) })] }, section.id))] });
}
