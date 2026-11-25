import { useSyncExternalStore } from "react";

import type { NativeListIosPressFeedback } from "../core/components/ui/native_list";

// Host navigation mounts each debug route separately, so a provider inside a
// route cannot share this setting with pushed routes. Keep it debug-only and
// in memory: normal pages and their sheets share it; app restarts reset it.
let iosPressFeedback: NativeListIosPressFeedback = "automatic";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return iosPressFeedback;
}

function getServerSnapshot(): NativeListIosPressFeedback {
  return "automatic";
}

function setIosPressFeedback(next: NativeListIosPressFeedback) {
  if (iosPressFeedback === next) return;
  iosPressFeedback = next;
  listeners.forEach((listener) => listener());
}

export function useDebugNativeListSettings() {
  return {
    iosPressFeedback: useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
    setIosPressFeedback,
  };
}
