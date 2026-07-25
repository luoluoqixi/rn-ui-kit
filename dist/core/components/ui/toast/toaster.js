import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CircleAlert, CircleCheckBig, Info, TriangleAlert } from "@tamagui/lucide-icons-2";
import { Toast } from "@tamagui/toast/v2";
import { useEffect } from "react";
import { Spinner, XStack, YStack } from "tamagui";
import { isWeb, os } from "../utils/platform";
import { useTrueSheetOverlayLayout } from "../sheet/native_sheet/true_sheet/overlay_layout_context";
import { resolveAccentThemeName, useUiPreferences, } from "../utils/theme";
import { getScopedToastViewportBottomInset } from "../sheet/native_sheet/true_sheet/overlay_toast_layout";
const DEFAULT_CLOSE_BTN_STYLE = {
    top: "50%",
    right: 14,
    transform: "translateY(-50%)",
    zIndex: 1,
};
const WEB_TOAST_ANIMATION_STYLE_ID = "rn-ui-kit-web-toast-animation";
const WEB_TOAST_ANIMATION_CSS = `
[data-toast-container] [data-mounted="true"][data-removed="false"] {
  transition-duration: 560ms !important;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1) !important;
}

[data-toast-container] [data-removed="true"] {
  transition-duration: 220ms !important;
}
`;
const TOAST_APPEARANCES = {
    default: {
        background: "$background",
        borderColor: "$borderColor",
        closeBorderColor: "$borderColor",
        descriptionColor: "$color10",
        iconBackground: "$color4",
        titleColor: "$color11",
    },
    error: {
        background: "$red2",
        borderColor: "$red6",
        closeBorderColor: "$red7",
        descriptionColor: "$red10",
        iconBackground: "$red4",
        titleColor: "$red11",
    },
    info: {
        background: "$accent2",
        borderColor: "$accent6",
        closeBorderColor: "$accent7",
        descriptionColor: "$accent10",
        iconBackground: "$accent4",
        titleColor: "$accent11",
    },
    loading: {
        background: "$accent1",
        borderColor: "$accent6",
        closeBorderColor: "$accent7",
        descriptionColor: "$accent10",
        iconBackground: "$accent3",
        titleColor: "$accent11",
    },
    success: {
        background: "$green2",
        borderColor: "$green6",
        closeBorderColor: "$green7",
        descriptionColor: "$green10",
        iconBackground: "$green4",
        titleColor: "$green11",
    },
    warning: {
        background: "$yellow2",
        borderColor: "$yellow6",
        closeBorderColor: "$yellow7",
        descriptionColor: "$yellow11",
        iconBackground: "$yellow4",
        titleColor: "$yellow11",
    },
};
function getToastAppearance(toast) {
    return TOAST_APPEARANCES[toast.type ?? "default"];
}
function getToastIconStyle(centered) {
    if (centered) {
        return undefined;
    }
    return {
        marginTop: 3,
        transform: [{ translateY: 2 }],
    };
}
function ToastTypeIcon(props) {
    const { background, centered = false, children } = props;
    const isFixCenter = isWeb() || os() === "ios";
    const iosStyle = isFixCenter ? getToastIconStyle(centered) : undefined;
    return (_jsx(YStack, { background: background, mt: !isFixCenter && !centered ? "$0.5" : 0, rounded: "$10", shrink: 0, width: 28, height: 28, style: {
            alignItems: "center",
            justifyContent: "center",
            ...iosStyle,
        }, children: children }));
}
function useWebToastAnimationOverride() {
    useEffect(() => {
        if (!isWeb()) {
            return;
        }
        if (document.getElementById(WEB_TOAST_ANIMATION_STYLE_ID) != null) {
            return;
        }
        const styleElement = document.createElement("style");
        styleElement.id = WEB_TOAST_ANIMATION_STYLE_ID;
        styleElement.textContent = WEB_TOAST_ANIMATION_CSS;
        document.head.appendChild(styleElement);
        return () => {
            styleElement.remove();
        };
    }, []);
}
function ToastContent({ appearance, toast: t }) {
    const title = typeof t.title === "function" ? t.title() : t.title;
    const description = typeof t.description === "function" ? t.description() : t.description;
    const isTitleOnlyToast = description == null;
    const toastType = t.type ?? "default";
    const iconByType = {
        error: _jsx(CircleAlert, { color: "$red11", size: 16 }),
        info: _jsx(Info, { color: "$accent11", size: 16 }),
        loading: _jsx(Spinner, { color: "$accent11", size: "small" }),
        success: _jsx(CircleCheckBig, { color: "$green11", size: 16 }),
        warning: _jsx(TriangleAlert, { color: "$yellow11", size: 16 }),
    };
    const leadingIcon = t.icon !== undefined ? (_jsx(ToastTypeIcon, { background: appearance.iconBackground, centered: isTitleOnlyToast, children: t.icon })) : toastType in iconByType ? (_jsx(ToastTypeIcon, { background: appearance.iconBackground, centered: isTitleOnlyToast, children: iconByType[toastType] })) : null;
    return (_jsxs(_Fragment, { children: [_jsxs(XStack, { gap: "$3", style: { alignItems: isTitleOnlyToast ? "center" : "flex-start" }, children: [leadingIcon, _jsxs(YStack, { flex: 1, gap: isTitleOnlyToast ? 0 : "$0.5", children: [title && (_jsx(Toast.Title, { color: appearance.titleColor, fontWeight: "600", size: "$3", children: title })), description && (_jsx(Toast.Description, { color: appearance.descriptionColor, size: "$2", children: description }))] })] }), isWeb() && (_jsx(Toast.Close, { background: "$background", borderColor: appearance.closeBorderColor, testID: "toast-close-button", position: "absolute", style: DEFAULT_CLOSE_BTN_STYLE }))] }));
}
function shouldRenderToastInViewport(toast, viewportName) {
    if (viewportName == null) {
        return toast.viewportName == null || toast.viewportName === "default";
    }
    return toast.viewportName === viewportName;
}
function ToastList({ viewportName }) {
    return (_jsx(Toast.List, { renderItem: ({ toast: t, index }) => {
            const scopedToast = t;
            if (!shouldRenderToastInViewport(scopedToast, viewportName)) {
                return null;
            }
            const appearance = getToastAppearance(t);
            return (_jsx(Toast.Item, { background: appearance.background, borderColor: appearance.borderColor, toast: t, index: index, onPointerDown: isWeb()
                    ? (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    : undefined, children: t.jsx ?? _jsx(ToastContent, { appearance: appearance, toast: t }) }, t.id));
        } }));
}
export { IOS_PAGE_SHEET_TOAST_VIEWPORT_INSET, IOS_TRUE_SHEET_TOAST_VIEWPORT_INSET, SCOPED_TOAST_VIEWPORT_INSET, } from "../sheet/native_sheet/true_sheet/overlay_toast_layout";
export function Toaster({ accentThemeName, viewportName, }) {
    useWebToastAnimationOverride();
    const { detent } = useTrueSheetOverlayLayout();
    const { preferences } = useUiPreferences();
    const resolvedAccentThemeName = resolveAccentThemeName(accentThemeName ?? preferences.appearance.accentColor);
    const position = isWeb() ? "bottom-right" : "bottom-center";
    const scopedViewport = viewportName != null;
    const viewportStyle = scopedViewport
        ? {
            bottom: getScopedToastViewportBottomInset(viewportName, detent),
            left: 16,
            right: 16,
            top: "auto",
        }
        : undefined;
    const portalToRoot = viewportName == null;
    return (_jsx(Toast, { position: position, visibleToasts: 4, duration: 5000, gap: 16, theme: resolvedAccentThemeName, children: _jsx(Toast.Viewport, { "data-toast-container": true, ...(!portalToRoot ? { portalToRoot: false } : null), ...(viewportStyle != null ? { style: viewportStyle } : null), children: _jsx(ToastList, { viewportName: viewportName }) }) }));
}
