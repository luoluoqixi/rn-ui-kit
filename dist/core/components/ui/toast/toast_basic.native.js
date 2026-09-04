import { jsx as _jsx } from "react/jsx-runtime";
import { toast as SonnerNativeToast, Toaster as SonnerNativeToaster } from "sonner-native";
import * as React from "react";
import { View } from "react-native";
import { CheckCircle2, CircleX, Info, TriangleAlert } from "lucide-react-native";
import { Icon } from "../icon";
import { triggerNativeHaptics } from "../utils/haptics";
import { configureBasicToastRuntime, getBasicOptions, getBasicToastRuntimeConfig, getToastId, getToastMessageText, resolveToastText, } from "./toast_basic_shared";
import { useUiTheme } from "../utils/theme";
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
export function showBasicToast(title, kind, options) {
    return callToast(kind, title, options);
}
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
export function dismissBasicToast(id) {
    SonnerNativeToast.dismiss(id);
}
export function dismissAllBasicToasts() {
    SonnerNativeToast.dismiss();
}
export function BasicToaster({ accentThemeName: _accentThemeName, viewportName, offset, iconSize = "default", basicHaptics, haptics, customToastViewProps, sonnerNativeProps, sonnerProps: _sonnerProps, closeButton, closeButtonIcon: _closeButtonIcon, closeButtonClassName: _closeButtonClassName, ...props }) {
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
        ...sonnerNativeProps?.toastOptions,
        style: {
            // Use the UI theme surface on native, matching the Web basic Toast.
            backgroundColor: theme.background,
            ...sonnerNativeProps?.toastOptions?.style,
        },
        toastContentStyle: {
            alignItems: "center",
            ...sonnerNativeProps?.toastOptions?.toastContentStyle,
        },
    };
    const resolvedIconSize = iconSize === "default" || iconSize === "md" ? "lg" : iconSize;
    const icons = {
        success: _jsx(Icon, { as: CheckCircle2, size: resolvedIconSize, color: "#16a34a" }),
        info: _jsx(Icon, { as: Info, size: resolvedIconSize, color: "#2563eb" }),
        warning: _jsx(Icon, { as: TriangleAlert, size: resolvedIconSize, color: "#d97706" }),
        error: _jsx(Icon, { as: CircleX, size: resolvedIconSize, color: "#dc2626" }),
        ...sonnerNativeProps?.icons,
    };
    return (_jsx(SonnerNativeToaster, { position: "bottom-center", duration: 5000, visibleToasts: 4, ...sonnerNativeProps, ...props, icons: icons, id: viewportName, closeButton: closeButton ?? sonnerNativeProps?.closeButton, offset: offset ?? sonnerNativeProps?.offset ?? 40, toastOptions: toastOptions }));
}
