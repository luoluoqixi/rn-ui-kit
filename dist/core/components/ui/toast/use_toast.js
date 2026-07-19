import { getBurnt } from "@tamagui/native";
import { toast as tamaguiToast } from "@tamagui/toast/v2";
import { isMobile } from "../utils/platform";
import { useScopedOverlayPortalHostName } from "../utils/screen_overlay_portal";
let nativeToastId = 1;
function resolveText(value) {
    const resolvedValue = typeof value === "function" ? value() : value;
    return typeof resolvedValue === "string" ? resolvedValue : undefined;
}
function omitNativeOption(options) {
    if (options == null) {
        return options;
    }
    const { native, ...restOptions } = options;
    void native;
    return restOptions;
}
function resolveScopedToastOptions(options, viewportName) {
    const resolvedOptions = omitNativeOption(options);
    if (viewportName == null) {
        return resolvedOptions;
    }
    return { ...resolvedOptions, viewportName };
}
function showNativeToast(title, type, options) {
    if (!isMobile() || options?.native === false) {
        return null;
    }
    const burnt = getBurnt();
    if (!burnt.isEnabled || burnt.state.toast == null) {
        return null;
    }
    const titleText = resolveText(title);
    const descriptionText = resolveText(options?.description);
    if (titleText == null) {
        return null;
    }
    const preset = type === "error" ? "error" : type === "success" ? "done" : "none";
    const haptic = type === "error"
        ? "error"
        : type === "success"
            ? "success"
            : type === "warning"
                ? "warning"
                : "none";
    burnt.state.toast({
        title: titleText,
        message: descriptionText,
        duration: options?.duration ? options.duration / 1000 : undefined,
        preset,
        haptic,
        ...options?.burntOptions,
    });
    const id = `native-${nativeToastId}`;
    nativeToastId += 1;
    return id;
}
function isHttpResponse(value) {
    return typeof Response !== "undefined" && value instanceof Response;
}
export function useToast() {
    const viewportName = useScopedOverlayPortalHostName();
    const messageFunction = (title, options) => {
        const nativeId = showNativeToast(title, "default", options);
        if (nativeId != null) {
            return nativeId;
        }
        return tamaguiToast.message(title, resolveScopedToastOptions(options, viewportName));
    };
    const infoFunction = (title, options) => {
        const nativeId = showNativeToast(title, "info", options);
        if (nativeId != null) {
            return nativeId;
        }
        return tamaguiToast.info(title, resolveScopedToastOptions(options, viewportName));
    };
    const successFunction = (title, options) => {
        const nativeId = showNativeToast(title, "success", options);
        if (nativeId != null) {
            return nativeId;
        }
        return tamaguiToast.success(title, resolveScopedToastOptions(options, viewportName));
    };
    const errorFunction = (title, options) => {
        const nativeId = showNativeToast(title, "error", options);
        if (nativeId != null) {
            return nativeId;
        }
        return tamaguiToast.error(title, resolveScopedToastOptions(options, viewportName));
    };
    const warningFunction = (title, options) => {
        const nativeId = showNativeToast(title, "warning", options);
        if (nativeId != null) {
            return nativeId;
        }
        return tamaguiToast.warning(title, resolveScopedToastOptions(options, viewportName));
    };
    const loadingFunction = (title, options) => {
        const nativeId = showNativeToast(title, "loading", options);
        if (nativeId != null) {
            return nativeId;
        }
        return tamaguiToast.loading(title, resolveScopedToastOptions(options, viewportName));
    };
    const toastFunction = (title, options) => {
        return messageFunction(title, options);
    };
    const customFunction = (jsx, options) => {
        return tamaguiToast.custom(jsx, resolveScopedToastOptions(options, viewportName));
    };
    const promiseFunction = (promise, data) => {
        if (viewportName == null && !isMobile()) {
            return tamaguiToast.promise(promise, data);
        }
        const resolvedPromise = Promise.resolve(typeof promise === "function" ? promise() : promise);
        let toastId;
        if (data?.loading !== undefined) {
            const description = typeof data.description === "function" ? undefined : data.description;
            toastId = loadingFunction(data.loading, {
                description,
                duration: Number.POSITIVE_INFINITY,
                native: data.native,
            });
        }
        const wrappedPromise = resolvedPromise
            .then(async (result) => {
            if (isHttpResponse(result) && !result.ok && data?.error !== undefined) {
                const message = typeof data.error === "function"
                    ? await data.error(`HTTP error! status: ${result.status}`)
                    : data.error;
                const description = typeof data.description === "function"
                    ? await data.description(`HTTP error! status: ${result.status}`)
                    : data.description;
                errorFunction(message, { description, id: toastId, native: data.native });
                toastId = undefined;
                return result;
            }
            if (data?.success !== undefined) {
                const message = typeof data.success === "function" ? await data.success(result) : data.success;
                const description = typeof data.description === "function"
                    ? await data.description(result)
                    : data.description;
                successFunction(message, { description, id: toastId, native: data.native });
                toastId = undefined;
            }
            else if (toastId != null) {
                tamaguiToast.dismiss(toastId);
                toastId = undefined;
            }
            return result;
        })
            .catch(async (error) => {
            if (data?.error !== undefined) {
                const message = typeof data.error === "function" ? await data.error(error) : data.error;
                const description = typeof data.description === "function"
                    ? await data.description(error)
                    : data.description;
                errorFunction(message, { description, id: toastId, native: data.native });
                toastId = undefined;
            }
            else if (toastId != null) {
                tamaguiToast.dismiss(toastId);
                toastId = undefined;
            }
            throw error;
        })
            .finally(() => {
            data?.finally?.();
        });
        return Object.assign(toastId ?? {}, {
            unwrap: () => wrappedPromise,
        });
    };
    return {
        toast: Object.assign(toastFunction, {
            message: messageFunction,
            info: infoFunction,
            success: successFunction,
            error: errorFunction,
            warning: warningFunction,
            loading: loadingFunction,
            custom: customFunction,
            promise: promiseFunction,
            close: (id) => {
                if (isMobile() && typeof id === "string" && id.startsWith("native-")) {
                    getBurnt().state.dismissAllAlerts?.();
                }
                tamaguiToast.dismiss(id);
            },
            closeAll: () => {
                if (isMobile()) {
                    getBurnt().state.dismissAllAlerts?.();
                }
                tamaguiToast.dismiss();
            },
        }),
    };
}
