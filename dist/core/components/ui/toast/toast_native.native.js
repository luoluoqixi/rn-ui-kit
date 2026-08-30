import * as Burnt from "burnt";
import { iosMajorVersion, isAndroid } from "../utils/platform";
import { triggerNativeHaptics } from "../utils/haptics";
import { getBasicToastRuntimeConfig, getToastId, getToastMessageText, resolveToastText, } from "./toast_basic_shared";
let toastId = 0;
function getPreset(kind) {
    return kind === "error" ? "error" : kind === "success" ? "done" : "none";
}
function getHaptic(kind) {
    return kind === "error"
        ? "error"
        : kind === "success"
            ? "success"
            : kind === "warning"
                ? "warning"
                : "none";
}
export function showNativeToast(title, kind, options) {
    const titleText = resolveToastText(title);
    if (titleText == null)
        return null;
    const message = getToastMessageText(options);
    const duration = options?.duration == null ? undefined : options.duration / 1000;
    const advancedHaptic = options?.burntOptions != null && "haptic" in options.burntOptions
        ? options.burntOptions.haptic
        : undefined;
    const hapticsEnabled = options?.haptics ??
        options?.basicHaptics ??
        getBasicToastRuntimeConfig().haptics ??
        getBasicToastRuntimeConfig().basicHaptics;
    const explicitHaptic = options?.haptic ?? advancedHaptic;
    const shouldManuallyHaptic = ((isAndroid() && hapticsEnabled !== false && explicitHaptic !== "none") ||
        (iosMajorVersion() === 15 && hapticsEnabled !== false && explicitHaptic == null)) &&
        (kind === "success" || kind === "warning" || kind === "error");
    const haptic = shouldManuallyHaptic
        ? "none"
        : (explicitHaptic ?? (hapticsEnabled === false ? "none" : getHaptic(kind)));
    if (kind === "loading") {
        Burnt.alert({
            title: titleText,
            message,
            duration: duration ?? 30,
            preset: "spinner",
            ...options?.burntOptions,
        });
    }
    else {
        Burnt.toast({
            title: titleText,
            message,
            duration,
            preset: options?.preset === "custom" ? "none" : (options?.preset ?? getPreset(kind)),
            haptic,
            from: options?.from,
            shouldDismissByDrag: options?.shouldDismissByDrag,
            ...(options?.icon && typeof options.icon === "object" && "ios" in options.icon
                ? { preset: "custom", icon: options.icon }
                : {}),
            ...options?.burntOptions,
        });
        if (shouldManuallyHaptic) {
            requestAnimationFrame(() => triggerNativeHaptics(hapticsEnabled));
        }
    }
    return getToastId(options?.id, () => ++toastId);
}
export function dismissNativeToast(_id) {
    Burnt.dismissAllAlerts();
}
export function dismissAllNativeToasts() {
    Burnt.dismissAllAlerts();
}
export function NativeToaster(_props) {
    return null;
}
