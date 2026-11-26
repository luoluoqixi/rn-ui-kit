import { type ReactElement } from "react";
import { type BasicToastKind } from "./toast_basic_shared";
import type { TitleToast, ToastShowOptions, ToastNativeToasterProps } from "./types";
export declare function showBasicToast(title: TitleToast, kind: BasicToastKind, options?: ToastShowOptions): string | number;
export declare function showBasicCustom(custom: (id: string | number) => ReactElement, options?: ToastShowOptions): string | number;
export declare const dismissBasicToast: (id?: string | number) => void;
export declare const dismissAllBasicToasts: () => void;
export declare function BasicToaster(p: ToastNativeToasterProps): import("react").JSX.Element;
