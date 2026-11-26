import { jsx as _jsx } from "react/jsx-runtime";
import { isValidElement } from "react";
import { Button } from "../button";
import { useOverlayState } from "../utils/overlay/overlay_state";
import { resolveRenderProp } from "../utils/render";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
export function useContextMenuModel(p) {
    const disabled = !!(p.disabled || p.triggerProps?.disabled);
    const haptics = useResolvedNativeHaptics(p.nativeHaptics);
    const itemHaptics = useResolvedNativeHaptics(p.itemNativeHaptics ?? p.nativeHaptics);
    const s = useOverlayState({ ...p, onOpenChange: next => {
            p.onOpenWillChange?.(next);
            if (next)
                triggerNativeHaptics(haptics, { delay: p.nativeHapticsDelay });
            p.onOpenChange?.(next);
        } }, disabled);
    const node = resolveRenderProp(p.trigger, { native: false, open: s.open }) ?? p.children;
    const trigger = isValidElement(node) ? node : _jsx(Button, { isDisabled: disabled, children: node ?? "菜单" });
    function entries(items) {
        return items.map(raw => {
            const item = { ...p.itemProps, ...raw };
            const label = resolveRenderProp(item.label, item);
            return {
                ...item,
                textValue: item.textValue ?? item["aria-label"] ?? (typeof label === "string" || typeof label === "number" ? String(label) : item.value),
                label,
                icon: resolveRenderProp(item.icon, item),
                indicator: resolveRenderProp(item.indicator, item),
                checkbox: item.checked !== undefined,
                selected: item.checked ?? item.selected,
                subMenuTitle: item.subMenuTitle === false ? false : resolveRenderProp(item.subMenuTitle, item),
                subMenu: item.subMenu ? entries(item.subMenu) : undefined,
                onAction: () => {
                    if (disabled || item.disabled)
                        return;
                    triggerNativeHaptics(item.nativeHaptics ?? itemHaptics, { delay: item.nativeHapticsDelay ?? p.itemNativeHapticsDelay ?? p.nativeHapticsDelay });
                    if (item.checked !== undefined)
                        item.onCheckedChange?.(!item.checked);
                    (item.onSelect ?? item.onPress)?.();
                },
            };
        });
    }
    return { ...s, disabled, trigger, items: entries(p.items ?? []) };
}
