import { useSyncExternalStore } from "react";
import { NATIVE_LIST_BASIC_DEFAULT_PRESS_FEEDBACK } from "../core/components/ui/native_list/constants";
// Host navigation mounts each debug route separately, so a provider inside a
// route cannot share this setting with pushed routes. Keep it debug-only and
// in memory: normal pages and their sheets share it; app restarts reset it.
const defaults = { iosPressFeedback: "automatic", basicPressFeedback: NATIVE_LIST_BASIC_DEFAULT_PRESS_FEEDBACK };
let settings = defaults;
const listeners = new Set();
function subscribe(listener) {
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
function setIosPressFeedback(next) {
    if (settings.iosPressFeedback === next)
        return;
    settings = { ...settings, iosPressFeedback: next };
    listeners.forEach((listener) => listener());
}
function setBasicPressFeedback(next) {
    if (settings.basicPressFeedback === next)
        return;
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
