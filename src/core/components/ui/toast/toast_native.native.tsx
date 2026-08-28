import * as Burnt from "burnt";
import { iosMajorVersion, isAndroid } from "../utils/platform";
import { triggerNativeHaptics } from "../utils/haptics";
import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
import {
  getBasicToastRuntimeConfig,
  getToastId,
  getToastMessageText,
  resolveToastText,
} from "./toast_basic_shared";
import type { ToastKind } from "./toast_native";

let toastId = 0;
function getPreset(kind: ToastKind): "done" | "error" | "none" {
  return kind === "error" ? "error" : kind === "success" ? "done" : "none";
}
function getHaptic(kind: ToastKind): "success" | "warning" | "error" | "none" {
  return kind === "error" ? "error" : kind === "success" ? "success" : kind === "warning" ? "warning" : "none";
}
export function showNativeToast(title: TitleToast, kind: ToastKind, options?: ToastShowOptions): string | number | null {
  const titleText = resolveToastText(title);
  if (titleText == null) return null;
  const message = getToastMessageText(options);
  const duration = options?.duration == null ? undefined : options.duration / 1000;
  const advancedHaptic =
    options?.burntOptions != null && "haptic" in options.burntOptions
      ? (options.burntOptions as { haptic?: ToastShowOptions["haptic"] }).haptic
      : undefined;
  const hapticsEnabled =
    options?.haptics ??
    options?.basicHaptics ??
    getBasicToastRuntimeConfig().haptics ??
    getBasicToastRuntimeConfig().basicHaptics;
  const explicitHaptic = options?.haptic ?? advancedHaptic;
  const shouldManuallyHaptic =
    ((isAndroid() && hapticsEnabled !== false && explicitHaptic !== "none") ||
      (iosMajorVersion() === 15 && hapticsEnabled !== false && explicitHaptic == null)) &&
    (kind === "success" || kind === "warning" || kind === "error");
  const haptic = shouldManuallyHaptic
    ? "none"
    : explicitHaptic ?? (hapticsEnabled === false ? "none" : getHaptic(kind));
  if (kind === "loading") {
    Burnt.alert({
      title: titleText,
      message,
      duration: duration ?? 30,
      preset: "spinner",
      ...options?.burntOptions,
    } as Parameters<typeof Burnt.alert>[0]);
  } else {
    Burnt.toast({
      title: titleText,
      message,
      duration,
      preset: options?.preset === "custom" ? "none" : options?.preset ?? getPreset(kind),
      haptic,
      from: options?.from,
      shouldDismissByDrag: options?.shouldDismissByDrag,
      ...(options?.icon && typeof options.icon === "object" && "ios" in options.icon
        ? { preset: "custom" as const, icon: options.icon }
        : {}),
      ...options?.burntOptions,
    } as Parameters<typeof Burnt.toast>[0]);
    if (shouldManuallyHaptic) {
      requestAnimationFrame(() => triggerNativeHaptics(hapticsEnabled));
    }
  }
  return getToastId(options?.id, () => ++toastId);
}
export function dismissNativeToast(_id?: string | number): void { Burnt.dismissAllAlerts(); }
export function dismissAllNativeToasts(): void { Burnt.dismissAllAlerts(); }
export function NativeToaster(_props: ToastNativeToasterProps) { return null; }
