import { useEffect, useSyncExternalStore } from "react";

type SheetEntry = {
  id: string;
  open: boolean;
};

let entries: readonly SheetEntry[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function updateEntry(id: string, open: boolean) {
  const entry = entries.find((item) => item.id === id);
  if (entry == null) {
    entries = [...entries, { id, open }];
    notify();
    return;
  }

  if (entry.open !== open) {
    if (open) {
      // The actual presentation order, rather than JSX mount order, defines
      // which sheet is above another one.
      entries = [...entries.filter((item) => item.id !== id), { ...entry, open: true }];
    } else {
      entries = entries.map((item) => (item.id === id ? { ...item, open: false } : item));
    }
    notify();
  }
}

function removeEntry(id: string) {
  const index = entries.findIndex((item) => item.id === id);
  if (index < 0) return;
  entries = [...entries.slice(0, index), ...entries.slice(index + 1)];
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return entries;
}

/** Returns true when another currently-open sheet was registered after this sheet. */
export function useHasOpenWebSheetAbove(id: string, open: boolean) {
  useEffect(() => {
    updateEntry(id, open);
    return () => removeEntry(id);
  }, [id, open]);

  const stack = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const index = stack.findIndex((entry) => entry.id === id);
  return open && index >= 0 && stack.slice(index + 1).some((entry) => entry.open);
}
