import { useRef, useState } from "react";
import { dropdownEntries } from "../dropdown/dropdown_heroui_shared";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
export function useMenubarModel(p) {
    const [local, setLocal] = useState(p.defaultValue);
    const controlled = Object.prototype.hasOwnProperty.call(p, "value");
    const value = controlled ? p.value : local;
    const current = useRef(value);
    current.current = value;
    const enabled = p.items.filter(item => !p.disabled && !item.disabled && !item.triggerProps?.disabled && !item.triggerProps?.isDisabled);
    if (new Set(p.items.map(item => item.value)).size !== p.items.length || p.items.some(item => !item.value)) {
        throw new Error("Menubar menu values must be non-empty and unique");
    }
    const [active, setActive] = useState(enabled[0]?.value);
    const tabStop = enabled.some(item => item.value === active) ? active : enabled[0]?.value;
    const haptics = useResolvedNativeHaptics(p.nativeHaptics);
    const itemHaptics = useResolvedNativeHaptics(p.itemNativeHaptics ?? p.nativeHaptics);
    function select(next) {
        if (next !== undefined && !enabled.some(item => item.value === next))
            return;
        if (next === current.current)
            return;
        current.current = next;
        if (!controlled)
            setLocal(next);
        if (next !== undefined) {
            setActive(next);
            triggerNativeHaptics(p.items.find(item => item.value === next)?.nativeHaptics ?? haptics);
        }
        p.onValueChange?.(next);
    }
    function change(item, open) {
        if (open)
            select(item.value);
        // A late blur/dismiss from the previous menu must not close the next one.
        else if (current.current === item.value)
            select(undefined);
    }
    function entries(menu) {
        return dropdownEntries(menu.items, {}, item => {
            if (p.disabled || menu.disabled || item.disabled)
                return;
            triggerNativeHaptics(item.nativeHaptics ?? itemHaptics, { delay: item.nativeHapticsDelay ?? p.itemNativeHapticsDelay });
            item.onPress?.();
            if (item.onSelect !== item.onPress)
                item.onSelect?.();
        });
    }
    return { value, enabled, tabStop, setActive, select, change, entries };
}
