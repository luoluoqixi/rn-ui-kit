import * as React from "react";
import type { ReactElement } from "react";
import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
import type { BasicToastKind } from "./toast_basic_shared";
export declare function showBasicToast(title: TitleToast, kind: BasicToastKind, options?: ToastShowOptions): string | number;
export declare function showBasicCustom(jsx: (id: string | number) => ReactElement, options?: ToastShowOptions): string | number;
export declare function dismissBasicToast(id?: string | number): void;
export declare function dismissAllBasicToasts(): void;
export declare function BasicToaster({ accentThemeName: _accentThemeName, viewportName, offset, defaultNative: _defaultNative, iconSize, basicHaptics, haptics, customToastViewProps, closeButton, closeButtonIcon, closeButtonClassName, sonnerProps, sonnerNativeProps: _sonnerNativeProps, ...props }: ToastNativeToasterProps): React.JSX.Element;
