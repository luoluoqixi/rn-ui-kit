import * as React from "react";
import { Platform } from "react-native";
import {
  dismissAllBasicToasts,
  dismissBasicToast,
  showBasicCustom,
  showBasicToast,
} from "./toast_basic";
import { dismissNativeToast, dismissAllNativeToasts, showNativeToast } from "./toast_native";
import { getToastId } from "./toast_basic_shared";
import { resolveRenderProp } from "../utils/render";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import type {
  TitleToast,
  ToastContext,
  ToastPromise,
  ToastPromiseData,
  ToastShowOptions,
} from "./types";
import { isIos, isWeb } from "../utils";

let toastId = 0;
type ToastKind = "default" | "error" | "info" | "loading" | "success" | "warning";

function useNative(options?: ToastShowOptions) {
  if (isWeb()) return false;
  if (options?.native === undefined) {
    return isIos();
  }
  return options.native === true;
}
function show(title: TitleToast, kind: ToastKind, options?: ToastShowOptions): string | number {
  if (useNative(options)) {
    return showNativeToast(title, kind, options) ?? getToastId(options?.id, () => ++toastId);
  }
  return showBasicToast(title, kind, options);
}
function resolvePromise<T>(value: ToastPromise<T>): Promise<T> {
  return Promise.resolve(typeof value === "function" ? value() : value);
}

export function useToast(): ToastContext {
  const scopedPortalHost = useScopedOverlayPortalHostName();
  // TrueSheet mounts a named Toaster in its own native window; route unqualified
  // Sonner toasts there so they render above the Sheet without a touch-blocking Modal.
  const resolveOptions = React.useCallback(
    (options?: ToastShowOptions): ToastShowOptions | undefined => {
      if (scopedPortalHost == null) {
        return options;
      }
      if (options == null) {
        return { toasterId: scopedPortalHost };
      }
      if (options.toasterId != null || options.viewportName != null) {
        return options;
      }
      return { ...options, toasterId: scopedPortalHost };
    },
    [scopedPortalHost],
  );
  const message = (title: TitleToast, options?: ToastShowOptions) =>
    show(title, "default", resolveOptions(options));
  const info = (title: TitleToast, options?: ToastShowOptions) =>
    show(title, "info", resolveOptions(options));
  const success = (title: TitleToast, options?: ToastShowOptions) =>
    show(title, "success", resolveOptions(options));
  const error = (title: TitleToast, options?: ToastShowOptions) =>
    show(title, "error", resolveOptions(options));
  const warning = (title: TitleToast, options?: ToastShowOptions) =>
    show(title, "warning", resolveOptions(options));
  const loading = (title: TitleToast, options?: ToastShowOptions) =>
    show(title, "loading", resolveOptions(options));
  const custom = (jsx: (id: string | number) => React.ReactElement, options?: ToastShowOptions) =>
    showBasicCustom(jsx, resolveOptions(options));
  const promise = <ToastData,>(
    promiseValue: ToastPromise<ToastData>,
    data?: ToastPromiseData<ToastData>,
  ) => {
    const native = useNative({ native: data?.native });
    const loadingId =
      data?.loading != null
        ? loading(resolveRenderProp(data.loading, undefined), {
            native: data.native,
            // Burnt's spinner requires a finite safety timeout; Sonner can stay open
            // indefinitely until the promise settles.
            duration: native ? 30_000 : Number.POSITIVE_INFINITY,
          })
        : undefined;
    const resolveDescription = async (value: ToastData | unknown) =>
      typeof data?.description === "function" ? data.description(value) : data?.description;
    const wrapped = resolvePromise(promiseValue)
      .then(async (result) => {
        if (loadingId != null) {
          native ? dismissNativeToast(loadingId) : dismissBasicToast(loadingId);
        }
        if (data?.success != null) {
          const title =
            typeof data.success === "function" ? await data.success(result) : data.success;
          success(title, { native: data.native, description: await resolveDescription(result) });
        }
        return result;
      })
      .catch(async (reason: unknown) => {
        if (loadingId != null) {
          native ? dismissNativeToast(loadingId) : dismissBasicToast(loadingId);
        }
        if (data?.error != null) {
          const title = typeof data.error === "function" ? await data.error(reason) : data.error;
          error(title, { native: data.native, description: await resolveDescription(reason) });
        }
        throw reason;
      })
      .finally(() => data?.finally?.());
    return { unwrap: () => wrapped };
  };
  const toast = Object.assign(message, {
    close: (id: string | number) => {
      // IDs are intentionally shared across adapters, so dismiss both stores. This also
      // handles callers that show a basic toast and later close it without retaining options.
      dismissNativeToast(id);
      dismissBasicToast(id);
    },
    closeAll: () => {
      dismissAllNativeToasts();
      dismissAllBasicToasts();
    },
    custom,
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
