import type { ReactElement } from "react";
import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
export * from "./toast_basic_shared";
import type { BasicToastKind } from "./toast_basic_shared";

export function showBasicToast(_title: TitleToast, _kind: BasicToastKind, _options?: ToastShowOptions): string | number {
  return "toast-unavailable";
}
export function showBasicCustom(_jsx: (id: string | number) => ReactElement, _options?: ToastShowOptions): string | number {
  return "toast-unavailable";
}
export function dismissBasicToast(_id?: string | number): void {}
export function dismissAllBasicToasts(): void {}
export function BasicToaster(_props: ToastNativeToasterProps) {
  return null;
}
