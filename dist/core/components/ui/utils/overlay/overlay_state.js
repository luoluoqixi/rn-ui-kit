import { useCallback, useState } from "react";
export function useOverlayState(props, disabled = false) {
    const [local, setLocal] = useState(props.defaultOpen ?? false);
    const open = props.open ?? local;
    const setOpen = useCallback((next) => {
        if ((disabled && next) || next === open)
            return;
        if (props.open === undefined)
            setLocal(next);
        props.onOpenChange?.(next);
    }, [disabled, open, props.open, props.onOpenChange]);
    return { open, setOpen, close: () => setOpen(false) };
}
