import type { ReactElement, ReactNode } from "react";
import type {
  ToastNativeToasterProps,
  ToastShowOptions,
  TitleToast,
  ToastCustomViewProps,
} from "./types";
import type { NativeHapticsSetting } from "../utils/haptics";
import { resolveRenderProp } from "../utils/render";

export type BasicToastKind = "default" | "error" | "info" | "loading" | "success" | "warning";

type BasicToastRuntimeConfig = {
  basicHaptics: NativeHapticsSetting;
  haptics: NativeHapticsSetting;
  customToastViewProps?: ToastCustomViewProps;
};

let basicToastRuntimeConfig: BasicToastRuntimeConfig = { basicHaptics: true, haptics: true };

export function configureBasicToastRuntime(config: Partial<BasicToastRuntimeConfig>) {
  basicToastRuntimeConfig = { ...basicToastRuntimeConfig, ...config };
}

export function getBasicToastRuntimeConfig(): BasicToastRuntimeConfig {
  return basicToastRuntimeConfig;
}

export function resolveToastContent(value: TitleToast | undefined): ReactNode | undefined {
  return resolveRenderProp(value, undefined);
}

export function resolveToastText(value: TitleToast | undefined): string | undefined {
  const resolved = resolveToastContent(value);
  return typeof resolved === "string" || typeof resolved === "number" ? String(resolved) : undefined;
}

export function getToastMessage(options?: ToastShowOptions): ReactNode | undefined {
  return resolveToastContent(options?.message ?? options?.description);
}

export function getToastMessageText(options?: ToastShowOptions): string | undefined {
  return resolveToastText(options?.message ?? options?.description);
}

export function resolveBasicOptionContent(
  value: ToastShowOptions["action"] | ToastShowOptions["cancel"] | ToastShowOptions["jsx"],
): ReactNode | undefined {
  return resolveRenderProp(value, undefined);
}

export function getToastId(id: string | number | undefined, next: () => number): string | number {
  return id ?? `toast-${next()}`;
}

export function getBasicOptions(options?: ToastShowOptions): Record<string, unknown> {
  if (options == null) return {};
  const {
    message,
    description,
    native,
    id,
    variant,
    viewportName,
    toasterId,
    preset,
    haptic,
    shouldDismissByTap,
    from,
    layout,
    icon,
    basicHaptics,
    haptics,
    customToastViewProps,
    action,
    cancel,
    jsx,
    sonnerOptions,
    sonnerNativeOptions,
    burntOptions,
    ...basic
  } = options;
  void message;
  void description;
  void native;
  void id;
  void variant;
  void viewportName;
  void toasterId;
  void preset;
  void haptic;
  void shouldDismissByTap;
  void from;
  void layout;
  void icon;
  void basicHaptics;
  void haptics;
  void customToastViewProps;
  void jsx;
  void sonnerOptions;
  void sonnerNativeOptions;
  void burntOptions;
  const basicOptions: Record<string, unknown> = basic;
  if ("action" in options) basicOptions.action = resolveBasicOptionContent(action);
  if ("cancel" in options) basicOptions.cancel = resolveBasicOptionContent(cancel);
  return basicOptions;
}

export function BasicToasterFallback(_props: ToastNativeToasterProps) {
  return null;
}

export type BasicCustom = (jsx: (id: string | number) => ReactElement, options?: ToastShowOptions) => string | number;
