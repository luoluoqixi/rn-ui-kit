import * as Burnt from "burnt";

import { isMobile } from "../utils/platform";

import type {
  TitleToast,
  ToastContext,
  ToastPromise,
  ToastPromiseData,
  ToastShowOptions,
} from "./types";

let toastId = 0;

type NativeToastType = "default" | "error" | "info" | "loading" | "success" | "warning";

function resolveText(value: unknown): string | undefined {
  const resolved = typeof value === "function" ? value() : value;
  return typeof resolved === "string" || typeof resolved === "number"
    ? String(resolved)
    : undefined;
}

function showToast(title: TitleToast, type: NativeToastType, options?: ToastShowOptions): string {
  const id = options?.id ?? `toast-${++toastId}`;
  const titleText = resolveText(title);

  if (isMobile() && options?.native !== false && titleText != null) {
    Burnt.toast({
      duration: options?.duration == null ? undefined : options.duration / 1000,
      haptic:
        type === "error"
          ? "error"
          : type === "success"
            ? "success"
            : type === "warning"
              ? "warning"
              : "none",
      message: resolveText(options?.description),
      preset: type === "error" ? "error" : type === "success" ? "done" : "none",
      title: titleText,
      ...options?.burntOptions,
    } as Parameters<typeof Burnt.toast>[0]);
  }

  return String(id);
}

function resolvePromise<ToastData>(promise: ToastPromise<ToastData>): Promise<ToastData> {
  return Promise.resolve(typeof promise === "function" ? promise() : promise);
}

export function useToast(): ToastContext {
  const message = (title: TitleToast, options?: ToastShowOptions) =>
    showToast(title, "default", options);
  const info = (title: TitleToast, options?: ToastShowOptions) => showToast(title, "info", options);
  const success = (title: TitleToast, options?: ToastShowOptions) =>
    showToast(title, "success", options);
  const error = (title: TitleToast, options?: ToastShowOptions) =>
    showToast(title, "error", options);
  const warning = (title: TitleToast, options?: ToastShowOptions) =>
    showToast(title, "warning", options);
  const loading = (title: TitleToast, options?: ToastShowOptions) =>
    showToast(title, "loading", options);
  const promise = <ToastData>(
    promiseValue: ToastPromise<ToastData>,
    data?: ToastPromiseData<ToastData>,
  ) => {
    if (data?.loading != null) {
      loading(data.loading, { native: data.native });
    }

    const wrapped = resolvePromise(promiseValue)
      .then(async (result) => {
        if (data?.success != null) {
          const title =
            typeof data.success === "function" ? await data.success(result) : data.success;
          success(title, { native: data.native });
        }
        return result;
      })
      .catch(async (reason: unknown) => {
        if (data?.error != null) {
          const title = typeof data.error === "function" ? await data.error(reason) : data.error;
          error(title, { native: data.native });
        }
        throw reason;
      })
      .finally(() => data?.finally?.());

    return { unwrap: () => wrapped };
  };

  const toast = Object.assign(message, {
    close: (_id: string | number) => Burnt.dismissAllAlerts(),
    closeAll: () => Burnt.dismissAllAlerts(),
    custom: (_jsx: (id: string | number) => React.ReactElement) => `toast-${++toastId}`,
    error,
    info,
    loading,
    message,
    promise,
    success,
    warning,
  });

  return { toast };
}
