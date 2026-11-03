import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
export type ToastKind = "default" | "error" | "info" | "loading" | "success" | "warning";
export declare function showNativeToast(_title: TitleToast, _kind: ToastKind, _options?: ToastShowOptions): string | number | null;
export declare function dismissNativeToast(_id?: string | number): void;
export declare function dismissAllNativeToasts(): void;
export declare function NativeToaster(_props: ToastNativeToasterProps): null;
