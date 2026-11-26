import { useMemo, useState, type Ref } from "react";
export function useFieldValue<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [local, setLocal] = useState(defaultValue);
  return [
    value === undefined ? local : value,
    (next: T) => {
      if (value === undefined) setLocal(next);
      onChange?.(next);
    },
  ] as const;
}
export function useMergedRefs<T>(
  first: Ref<T> | undefined,
  second: Ref<T> | undefined,
) {
  return useMemo(
    () => (node: T | null) => {
      const cleanups = [first, second].map((ref) => {
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      });
      return () => {
        [first, second].forEach((ref, index) => {
          if (typeof cleanups[index] === "function") cleanups[index]();
          else if (typeof ref === "function") ref(null);
          else if (ref) ref.current = null;
        });
      };
    },
    [first, second],
  );
}
