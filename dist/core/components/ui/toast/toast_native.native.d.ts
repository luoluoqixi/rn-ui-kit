import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
import type { ToastKind } from "./toast_native";
export declare function showNativeToast(title: TitleToast, kind: ToastKind, options?: ToastShowOptions): string | number | null;
export declare function dismissNativeToast(_id?: string | number): void;
export declare function dismissAllNativeToasts(): void;
export declare function NativeToaster(_props: ToastNativeToasterProps): null;
