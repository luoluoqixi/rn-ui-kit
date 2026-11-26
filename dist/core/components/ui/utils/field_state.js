import { useMemo, useState } from "react";
export function useFieldValue(value, defaultValue, onChange) {
    const [local, setLocal] = useState(defaultValue);
    return [
        value === undefined ? local : value,
        (next) => {
            if (value === undefined)
                setLocal(next);
            onChange?.(next);
        },
    ];
}
export function useMergedRefs(first, second) {
    return useMemo(() => (node) => {
        const cleanups = [first, second].map((ref) => {
            if (typeof ref === "function")
                return ref(node);
            if (ref)
                ref.current = node;
        });
        return () => {
            [first, second].forEach((ref, index) => {
                if (typeof cleanups[index] === "function")
                    cleanups[index]();
                else if (typeof ref === "function")
                    ref(null);
                else if (ref)
                    ref.current = null;
            });
        };
    }, [first, second]);
}
