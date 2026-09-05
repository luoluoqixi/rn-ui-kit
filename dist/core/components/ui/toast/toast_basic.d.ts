import type { ReactElement } from "react";
import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
export * from "./toast_basic_shared";
import type { BasicToastKind } from "./toast_basic_shared";
export declare function showBasicToast(_title: TitleToast, _kind: BasicToastKind, _options?: ToastShowOptions): string | number;
export declare function showBasicCustom(_jsx: (id: string | number) => ReactElement, _options?: ToastShowOptions): string | number;
export declare function dismissBasicToast(_id?: string | number): void;
export declare function dismissAllBasicToasts(): void;
export declare function BasicToaster(_props: ToastNativeToasterProps): null;
