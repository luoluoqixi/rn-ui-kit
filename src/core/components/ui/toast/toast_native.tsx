import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
export type ToastKind = "default" | "error" | "info" | "loading" | "success" | "warning";
export function showNativeToast(_title: TitleToast, _kind: ToastKind, _options?: ToastShowOptions): string | number | null { return null; }
export function dismissNativeToast(_id?: string | number): void {}
export function dismissAllNativeToasts(): void {}
export function NativeToaster(_props: ToastNativeToasterProps) { return null; }
