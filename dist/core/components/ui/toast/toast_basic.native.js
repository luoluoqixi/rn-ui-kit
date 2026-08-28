import { jsx as _jsx } from "react/jsx-runtime";
import { toast as SonnerNativeToast, Toaster as SonnerNativeToaster } from "sonner-native";
import * as React from "react";
import { View } from "react-native";
import { triggerNativeHaptics } from "../utils/haptics";
import { configureBasicToastRuntime, getBasicOptions, getBasicToastRuntimeConfig, getToastId, getToastMessageText, resolveToastText, } from "./toast_basic_shared";
let toastId = 0;
function callToast(kind, title, options) {
    const titleText = resolveToastText(title);
    if (titleText == null)
        return getToastId(options?.id, () => ++toastId);
    const data = {
        ...getBasicOptions(options),
        ...options?.sonnerNativeOptions,
        id: options?.id,
        description: getToastMessageText(options),
        toasterId: options?.toasterId ?? options?.viewportName,
        ...(kind === "loading" ? { dismissible: options?.dismissible ?? false } : {}),
    };
    if (kind === "default")
        return SonnerNativeToast(titleText, data);
    const id = SonnerNativeToast[kind](titleText, data);
    if (kind === "success" || kind === "warning" || kind === "error") {
        triggerNativeHaptics(options?.haptics ??
            options?.basicHaptics ??
            getBasicToastRuntimeConfig().haptics ??
            getBasicToastRuntimeConfig().basicHaptics);
    }
    return id;
}
export function showBasicToast(title, kind, options) { return callToast(kind, title, options); }
export function showBasicCustom(jsx, options) {
    const requestedId = options?.id;
    const id = requestedId == null || (typeof requestedId === "string" && requestedId.length === 0)
        ? `toast-${++toastId}`
        : requestedId;
    const viewProps = options?.customToastViewProps ?? getBasicToastRuntimeConfig().customToastViewProps;
    return SonnerNativeToast.custom(_jsx(View, { ...viewProps, style: [{ width: "100%", paddingHorizontal: 16 }, viewProps?.style], children: jsx(id) }), {
        ...getBasicOptions(options),
        ...options?.sonnerNativeOptions,
        id,
        toasterId: options?.toasterId ?? options?.viewportName,
    });
}
export function dismissBasicToast(id) { SonnerNativeToast.dismiss(id); }
export function dismissAllBasicToasts() { SonnerNativeToast.dismiss(); }
export function BasicToaster({ accentThemeName: _accentThemeName, viewportName, offset, basicHaptics, haptics, customToastViewProps, sonnerNativeProps, sonnerProps: _sonnerProps, closeButton, closeButtonIcon: _closeButtonIcon, closeButtonClassName: _closeButtonClassName, ...props }) {
    React.useEffect(() => {
        const runtimeConfig = {
            ...(basicHaptics !== undefined
                ? { basicHaptics, ...(haptics === undefined ? { haptics: basicHaptics } : {}) }
                : {}),
            ...(haptics !== undefined ? { haptics, basicHaptics: haptics } : {}),
            ...(customToastViewProps !== undefined ? { customToastViewProps } : {}),
        };
        if (Object.keys(runtimeConfig).length > 0) {
            configureBasicToastRuntime(runtimeConfig);
        }
    }, [basicHaptics, haptics, customToastViewProps]);
    const toastOptions = {
        ...sonnerNativeProps?.toastOptions,
        toastContentStyle: {
            alignItems: "center",
            ...sonnerNativeProps?.toastOptions?.toastContentStyle,
        },
    };
    return (_jsx(SonnerNativeToaster, { position: "bottom-center", duration: 5000, visibleToasts: 4, ...sonnerNativeProps, ...props, id: viewportName, closeButton: closeButton ?? sonnerNativeProps?.closeButton, offset: offset ?? sonnerNativeProps?.offset ?? 40, toastOptions: toastOptions }));
}
