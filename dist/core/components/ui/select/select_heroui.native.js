import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDefaultTextStyle } from "../provider/font_provider";
import { forwardRef } from "react";
import { View, ScrollView } from "react-native";
import { Select as HeroSelect } from "heroui-native/select";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { useThemeColor } from "heroui-native/hooks";
import { Text } from "../text";
import { resolveRenderProp } from "../utils/render";
import { HeroUIWindowAnchor, HeroUIWindowOverlayScope, useHeroUIOverlayPortalHostName } from "../utils/overlay/heroui_anchor.native";
import { itemLabel, SelectNativeTrigger, SelectBasicTrigger } from "./shared";
import { useHeroSelect } from "./select_heroui_shared";
export const SelectHeroUI = forwardRef(function SelectHeroUI(p, ref) {
    const portalHostName = useHeroUIOverlayPortalHostName();
    const m = useHeroSelect(p, ref);
    const font = useDefaultTextStyle();
    const pressedColor = useThemeColor("default");
    const itemTextStyle = useDefaultTextStyle(p.itemTextProps?.style, p.itemTextProps?.className);
    const c = p.contentProps;
    const placement = c?.herouiNativeProps?.placement ?? c?.side ?? "bottom";
    const align = c?.herouiNativeProps?.align ?? c?.align ?? (placement === "top" || placement === "bottom" ? "center" : "start");
    return _jsxs(HeroSelect, { ...p.herouiNativeProps, value: m.option, onValueChange: o => m.setValue(o?.value ?? null), isDisabled: m.disabled, isOpen: m.open, onOpenChange: m.setOpen, className: p.className, style: p.style, children: [_jsx(HeroSelect.Trigger, { asChild: true, variant: "unstyled", children: _jsx(HeroUIWindowAnchor, { isOpen: m.open, children: p.nativeTrigger ? _jsx(SelectNativeTrigger, { props: p, value: m.value, active: m.open })
                        : _jsx(SelectBasicTrigger, { props: p, value: m.value, disabled: m.disabled }) }) }), _jsx(HeroSelect.Portal, { hostName: portalHostName, children: _jsxs(HeroUIWindowOverlayScope, { children: [_jsx(HeroSelect.Overlay, {}), _jsx(HeroSelect.Content, { ...c?.herouiNativeProps, presentation: "popover", placement: placement, align: align, offset: c?.herouiNativeProps?.offset ?? c?.sideOffset ?? 8, className: c?.className, children: _jsxs(ScrollView, { ...p.viewportProps, style: [{ maxHeight: 320 }, p.viewportProps?.style], keyboardShouldPersistTaps: "handled", children: [m.groups.map(group => _jsxs(View, { children: [group.label != null && _jsx(HeroSelect.ListLabel, { ...group.labelProps, style: [font, group.labelProps?.style], children: resolveRenderProp(group.label, { value: m.value ?? "" }) }), group.items.map(item => {
                                                const ctx = { checked: item.value === m.value, selected: item.value === m.value, disabled: !!(item.disabled ?? item.isDisabled), value: item.value };
                                                const label = resolveRenderProp(item.label, ctx);
                                                return _jsx(PressableFeedback, { asChild: true, isDisabled: ctx.disabled, animation: { scale: { value: 0.98, ignoreScaleCoefficient: true, timingConfig: { duration: 150 } } }, children: _jsxs(HeroSelect.Item, { ...p.itemProps?.herouiNativeProps, ...item.itemProps?.herouiNativeProps, value: item.value, label: itemLabel(item, m.value), disabled: ctx.disabled, className: ["rounded-xl", item.itemProps?.className ?? p.itemProps?.className].filter(Boolean).join(" "), style: item.itemProps?.style ?? p.itemProps?.style, children: [_jsx(PressableFeedback.Highlight, { animation: { backgroundColor: { value: pressedColor }, opacity: { value: [0, 1], timingConfig: { duration: 150 } } } }), item.swatchColor && _jsx(View, { className: "size-4 rounded-full", style: { backgroundColor: item.swatchColor } }), resolveRenderProp(item.startContent, ctx), _jsxs(View, { className: "flex-1", children: [typeof label === "string" || typeof label === "number" ? _jsx(HeroSelect.ItemLabel, { ...p.itemTextProps, style: itemTextStyle }) : label, item.description != null && _jsx(HeroSelect.ItemDescription, { style: font, children: resolveRenderProp(item.description, ctx) })] }), resolveRenderProp(item.endContent, ctx), _jsx(HeroSelect.ItemIndicator, { ...p.itemIndicatorProps })] }) }, item.value);
                                            })] }, group.key)), m.groups.length === 0 && _jsx(Text, { color: "muted", children: "\u6682\u65E0\u9009\u9879" })] }) })] }) })] });
});
