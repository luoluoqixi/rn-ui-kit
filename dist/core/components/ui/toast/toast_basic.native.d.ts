import type { ReactElement } from "react";
import * as React from "react";
import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
import type { BasicToastKind } from "./toast_basic_shared";
export declare function showBasicToast(title: TitleToast, kind: BasicToastKind, options?: ToastShowOptions): string | number;
export declare function showBasicCustom(jsx: (id: string | number) => ReactElement, options?: ToastShowOptions): string | number;
export declare function dismissBasicToast(id?: string | number): void;
export declare function dismissAllBasicToasts(): void;
export declare function BasicToaster({ accentThemeName: _accentThemeName, viewportName, offset, iconSize, basicHaptics, haptics, customToastViewProps, sonnerNativeProps, sonnerProps: _sonnerProps, closeButton, closeButtonIcon: _closeButtonIcon, closeButtonClassName: _closeButtonClassName, ...props }: ToastNativeToasterProps): React.JSX.Element;
