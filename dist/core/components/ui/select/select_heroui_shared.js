import { useState, useImperativeHandle } from "react";
import { useOverlayState } from "../utils/overlay/overlay_state";
import { useResolvedNativeHaptics, triggerNativeHaptics } from "../utils/haptics";
import { flattenItems, itemLabel } from "./shared";
import { resolveSelectItemGroups } from "./select_grouping";
export function useHeroSelect(p, ref) {
    const [local, setLocal] = useState(p.defaultValue ?? null);
    const value = p.value === undefined ? local : p.value;
    const disabled = p.disabled ?? p.isDisabled ?? false;
    const haptics = useResolvedNativeHaptics(p.nativeHaptics);
    const s = useOverlayState({ ...p, onOpenChange: next => {
            p.onOpenWillChange?.(next);
            if (next)
                triggerNativeHaptics(haptics, { delay: p.nativeHapticsDelay });
            p.onOpenChange?.(next);
        } }, disabled);
    useImperativeHandle(ref, () => ({ open: () => s.setOpen(true), close: s.close }), [s.setOpen]);
    const items = flattenItems(p);
    const selected = items.find(i => i.value === value);
    const setValue = (next) => {
        if (disabled || next === value || items.some(i => i.value === next && (i.disabled ?? i.isDisabled)))
            return;
        if (p.value === undefined)
            setLocal(next);
        triggerNativeHaptics(haptics, { delay: p.nativeHapticsDelay });
        p.onValueChange?.(next);
    };
    return { ...s, value: value ?? undefined, selected, disabled, setValue,
        groups: resolveSelectItemGroups(p),
        option: selected ? { value: selected.value, label: itemLabel(selected, selected.value) } : undefined };
}
