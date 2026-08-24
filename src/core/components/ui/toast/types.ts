import type { ReactElement, ReactNode } from "react";

export type TitleToast = ReactNode | (() => ReactNode);

export type ToastShowOptions = {
  burntOptions?: Record<string, unknown>;
  description?: TitleToast;
  duration?: number;
  id?: string | number;
  native?: boolean;
  variant?: string;
  viewportName?: string | "default";
};

export type ToastPromiseData<ToastData = unknown> = {
  description?: ReactNode | ((data: ToastData | unknown) => ReactNode);
  error?: ReactNode | ((error: unknown) => ReactNode | Promise<ReactNode>);
  finally?: () => void;
  loading?: ReactNode;
  native?: boolean;
  success?: ReactNode | ((data: ToastData) => ReactNode | Promise<ReactNode>);
};

export type ToastPromise<ToastData> = PromiseLike<ToastData> | (() => PromiseLike<ToastData>);
export type ToastFunc = (title: TitleToast, options?: ToastShowOptions) => string | number;
export type ToastVariantFunc = ToastFunc;
export type ToastCustomFunc = (
  jsx: (id: string | number) => ReactElement,
  data?: ToastShowOptions,
) => string | number;
export type ToastPromiseFunc = <ToastData>(
  promise: ToastPromise<ToastData>,
  data?: ToastPromiseData<ToastData>,
) => { unwrap: () => Promise<ToastData> };

export interface ToastInterface {
  message: ToastVariantFunc;
  info: ToastVariantFunc;
  success: ToastVariantFunc;
  error: ToastVariantFunc;
  warning: ToastVariantFunc;
  loading: ToastVariantFunc;
  custom: ToastCustomFunc;
  promise: ToastPromiseFunc;
  close: (id: string | number) => void;
  closeAll: () => void;
}

export interface ToastContext {
  toast: ToastFunc & ToastInterface;
}
