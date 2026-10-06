import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as Sonner from "sonner";
import { CheckCircle2, CircleX, Info, TriangleAlert, X } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "../icon";
import { configureBasicToastRuntime, getBasicOptions, getBasicToastRuntimeConfig, getToastId, getToastMessage, resolveToastContent, } from "./toast_basic_shared";
import { useUiColorScheme, useUiTheme } from "../utils/theme";
let toastId = 0;
const CLOSE_BUTTON_CLASS = "rn-ui-kit-toast-close-button";
function callToast(kind, title, options) {
    const titleContent = resolveToastContent(title);
    if (titleContent == null)
        return getToastId(options?.id, () => ++toastId);
    const data = {
        ...getBasicOptions(options),
        ...options?.sonnerOptions,
        id: options?.id,
        description: getToastMessage(options),
        toasterId: options?.toasterId ?? options?.viewportName,
        ...(kind === "loading" ? { dismissible: options?.dismissible ?? false } : {}),
    };
    if (kind === "default")
        return Sonner.toast(titleContent, data);
    return Sonner.toast[kind](titleContent, data);
}
export function showBasicToast(title, kind, options) {
    return callToast(kind, title, options);
}
export function showBasicCustom(jsx, options) {
    const requestedId = options?.id;
    const id = requestedId == null || (typeof requestedId === "string" && requestedId.length === 0)
        ? `toast-${++toastId}`
        : requestedId;
    const viewProps = options?.customToastViewProps ?? getBasicToastRuntimeConfig().customToastViewProps;
    return Sonner.toast.custom((toastId) => (_jsx(View, { ...viewProps, style: [{ width: "100%", paddingHorizontal: 16 }, viewProps?.style], children: jsx(toastId) })), {
        ...getBasicOptions(options),
        ...options?.sonnerOptions,
        id,
        toasterId: options?.toasterId ?? options?.viewportName,
    });
}
export function dismissBasicToast(id) {
    Sonner.toast.dismiss(id);
}
export function dismissAllBasicToasts() {
    Sonner.toast.dismiss();
}
export function BasicToaster({ accentThemeName: _accentThemeName, viewportName, offset, defaultNative: _defaultNative, iconSize = "default", basicHaptics, haptics, customToastViewProps, closeButton, closeButtonIcon, closeButtonClassName, sonnerProps, sonnerNativeProps: _sonnerNativeProps, ...props }) {
    const colorScheme = useUiColorScheme();
    const theme = useUiTheme();
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
        ...sonnerProps?.toastOptions,
        classNames: {
            ...sonnerProps?.toastOptions?.classNames,
            closeButton: [
                CLOSE_BUTTON_CLASS,
                sonnerProps?.toastOptions?.classNames?.closeButton,
                closeButtonClassName,
            ]
                .filter(Boolean)
                .join(" "),
        },
    };
    const resolvedIconSize = iconSize === "default" || iconSize === "md" ? "lg" : iconSize;
    const icons = {
        success: _jsx(Icon, { as: CheckCircle2, size: resolvedIconSize, color: "#16a34a" }),
        info: _jsx(Icon, { as: Info, size: resolvedIconSize, color: "#2563eb" }),
        warning: _jsx(Icon, { as: TriangleAlert, size: resolvedIconSize, color: "#d97706" }),
        error: _jsx(Icon, { as: CircleX, size: resolvedIconSize, color: "#dc2626" }),
        close: closeButtonIcon ?? _jsx(X, { size: 15, color: "currentColor" }),
        ...sonnerProps?.icons,
    };
    const style = {
        "--toast-close-button-start": "unset",
        "--toast-close-button-end": "16px",
        "--toast-close-button-transform": "translate(0, -50%)",
        // A named toaster is mounted inside a TrueSheet. Sonner's fixed position
        // otherwise uses the transformed sheet wrapper (which can be taller than
        // the visible sheet) as its containing block and places the stack below
        // the viewport. Keep an explicit user position untouched.
        ...(viewportName != null && sonnerProps?.style?.position == null
            ? { position: "absolute" }
            : {}),
        ...sonnerProps?.style,
    };
    return (_jsxs(_Fragment, { children: [_jsx(Sonner.Toaster, { position: viewportName == null ? "bottom-right" : "bottom-center", duration: 5000, visibleToasts: 4, theme: colorScheme, ...sonnerProps, ...props, id: viewportName, offset: offset ?? sonnerProps?.offset ?? 24, closeButton: closeButton ?? sonnerProps?.closeButton ?? true, icons: icons, style: style, toastOptions: toastOptions }), _jsx("style", { children: `
        [data-sonner-toast][data-styled="true"] {
          background-color: ${theme.background};
        }
        [data-sonner-toast][data-styled="true"] .${CLOSE_BUTTON_CLASS} {
          top: 50% !important;
          left: auto !important;
          right: 16px !important;
          transform: translate(0, -50%) !important;
        }
        [data-sonner-toast][data-styled="true"] [data-icon] {
          width: auto;
          height: auto;
        }
        [data-sonner-toast][data-styled="true"][data-type="loading"] [data-icon],
        [data-sonner-toast][data-styled="true"][data-promise="true"] [data-icon] {
          width: 16px;
          height: 16px;
        }
      ` })] }));
}
