import { useFieldValue } from "./field_state";
export function useKeySelection(p, items) {
    const [value, setValue] = useFieldValue(p.selectedKeys === undefined ? undefined : new Set(p.selectedKeys), new Set(p.defaultSelectedKeys ?? []), p.onSelectionChange);
    const available = new Set(items.map(item => item.id));
    const selected = new Set([...value].filter(key => available.has(key)));
    if (p.selectionMode === "single" && selected.size > 1) {
        const first = selected.values().next().value;
        selected.clear();
        selected.add(first);
    }
    const disabled = new Set(p.disabledKeys ?? []);
    for (const item of items)
        if (item.isDisabled)
            disabled.add(item.id);
    function change(keys) {
        if (p.isDisabled || p.selectionMode === "none")
            return;
        const next = new Set(keys === "all" ? items.filter(item => !disabled.has(item.id)).map(item => item.id) : [...keys].map(String).filter(key => available.has(key)));
        if (p.selectionMode === "single" && next.size > 1)
            return;
        for (const key of disabled) {
            if (next.has(key) && !selected.has(key))
                return;
            // Multiple selection keeps disabled selections. Single selection may move
            // from a disabled selection to another enabled item, but cannot clear it.
            if (selected.has(key)) {
                if (p.selectionMode === "multiple")
                    next.add(key);
                else if (next.size === 0)
                    return;
            }
        }
        if (p.disallowEmptySelection && next.size === 0)
            return;
        if (next.size === selected.size && [...next].every(key => selected.has(key)))
            return;
        setValue(next);
    }
    function toggle(key) {
        if (disabled.has(key) || !available.has(key))
            return;
        const next = p.selectionMode === "single" ? new Set() : new Set(selected);
        if (!selected.has(key))
            next.add(key);
        else
            next.delete(key);
        change(next);
    }
    return { selected, disabled, change, toggle };
}
