import { useSyncExternalStore } from "react";

import type { NativeListBasicPressFeedback, NativeListIosPressFeedback } from "../core/components/ui/native_list";
import { NATIVE_LIST_BASIC_DEFAULT_PRESS_FEEDBACK } from "../core/components/ui/native_list/constants";

// Host navigation mounts each debug route separately, so a provider inside a
// route cannot share this setting with pushed routes. Keep it debug-only and
// in memory: normal pages and their sheets share it; app restarts reset it.
const defaults: {
  iosPressFeedback: NativeListIosPressFeedback;
  basicPressFeedback: NativeListBasicPressFeedback;
} = { iosPressFeedback: "automatic", basicPressFeedback: NATIVE_LIST_BASIC_DEFAULT_PRESS_FEEDBACK };
let settings = defaults;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return settings;
}

function getServerSnapshot() {
  return defaults;
}

function setIosPressFeedback(next: NativeListIosPressFeedback) {
  if (settings.iosPressFeedback === next) return;
  settings = { ...settings, iosPressFeedback: next };
  listeners.forEach((listener) => listener());
}

function setBasicPressFeedback(next: NativeListBasicPressFeedback) {
  if (settings.basicPressFeedback === next) return;
  settings = { ...settings, basicPressFeedback: next };
  listeners.forEach((listener) => listener());
}

export function useDebugNativeListSettings() {
  return {
    ...useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
    setBasicPressFeedback,
    setIosPressFeedback,
  };
}
