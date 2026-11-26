import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { useEffect, useRef, useState, isValidElement } from "react";
import { Toast, ToastQueue } from "@heroui/react/toast";
import { View } from "react-native";
import { ScopedVariables } from "uniwind";
import { Spinner } from "../spinner";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { semanticColorsToVariables, useUiTheme } from "../utils/theme";
import { ToastPortal, ToastPortalBoundary } from "./toast_portal.web";
import { configureBasicToastRuntime, getBasicToastRuntimeConfig, getToastMessage, resolveToastContent } from "./toast_basic_shared";
import { toastBridge, toastDuration, toastVariant } from "./toast_bridge";
const placements = ["top", "top start", "top end", "bottom", "bottom start", "bottom end"];
function legacyPlacement(position) {
    if (!position)
        return;
    return position.replace("-center", "").replace("-left", " start").replace("-right", " end");
}
function placementFor(record, props) {
    const o = record.payload.options;
    return o.herouiWebProps?.placement ?? legacyPlacement(o.sonnerOptions?.position) ?? o.from ?? props.herouiWebProps?.placement
        ?? legacyPlacement(props.sonnerProps?.position) ?? (props.viewportName ? "bottom" : "bottom end");
}
function offsetStyle(placement, props) {
    const offset = props.offset ?? props.sonnerProps?.offset ?? 24;
    const offsets = typeof offset === "object" ? offset : { top: offset, bottom: offset, left: offset, right: offset };
    return {
        [placement.startsWith("top") ? "top" : "bottom"]: placement.startsWith("top") ? offsets.top ?? 24 : offsets.bottom ?? 24,
        ...(placement.endsWith("start") ? { insetInlineStart: offsets.left ?? 24 } : placement.endsWith("end") ? { insetInlineEnd: offsets.right ?? 24 } : {}),
    };
}
function isAction(value) {
    return value != null && typeof value === "object" && "label" in value && "onClick" in value;
}
export function showBasicToast(title, kind, options = {}) {
    return toastBridge.show({ title: resolveToastContent(title), description: getToastMessage(options), kind, options });
}
export function showBasicCustom(custom, options = {}) {
    return toastBridge.show({ custom, kind: "default", options });
}
export const dismissBasicToast = (id) => toastBridge.close(id);
export const dismissAllBasicToasts = () => toastBridge.closeAll();
export function BasicToaster(p) {
    const [queues] = useState(() => new Map(placements.map(placement => [placement, new ToastQueue()])));
    const config = useRef(p);
    config.current = p;
    const font = textWebStyle(useDefaultTextStyle());
    const theme = useUiTheme();
    useEffect(() => {
        configureBasicToastRuntime({ ...(p.customToastViewProps ? { customToastViewProps: p.customToastViewProps } : {}) });
    }, [p.customToastViewProps]);
    useEffect(() => {
        const handles = new Map();
        const options = (record) => {
            const duration = toastDuration(record, config.current.sonnerProps?.duration ?? config.current.sonnerProps?.toastOptions?.duration);
            return { timeout: Number.isFinite(duration) ? Math.max(1, duration) : 0 };
        };
        const add = (record, closed) => {
            const placement = placementFor(record, config.current);
            const queue = queues.get(placement);
            const handle = { queue, placement, key: "", closed, active: true };
            handle.key = queue.add(record, { ...options(record), onClose: () => {
                    if (!handle.active)
                        return;
                    handle.active = false;
                    if (handles.get(record.token) === handle)
                        handles.delete(record.token);
                    closed("auto");
                } });
            handles.set(record.token, handle);
            return record.token;
        };
        const unregister = toastBridge.register(p.viewportName, {
            platform: "web",
            show: add,
            update: (id, record) => {
                const handle = handles.get(id);
                if (!handle)
                    return;
                if (handle.placement !== placementFor(record, config.current)) {
                    handle.active = false;
                    handle.queue.close(handle.key);
                    add(record, handle.closed);
                }
                else
                    handle.queue.update(handle.key, record, options(record));
            },
            close: id => {
                const handle = handles.get(id);
                if (!handle)
                    return;
                handle.active = false;
                handles.delete(id);
                handle.queue.close(handle.key);
            },
        });
        return () => { unregister(); for (const queue of queues.values())
            queue.clear(); };
    }, [queues, p.viewportName]);
    const content = _jsx(ScopedVariables, { variables: semanticColorsToVariables(theme), children: placements.map(placement => _createElement(Toast.Provider, { ...p.herouiWebProps, key: placement, queue: queues.get(placement), placement: placement, maxVisibleToasts: p.herouiWebProps?.maxVisibleToasts ?? p.sonnerProps?.visibleToasts ?? 4, gap: p.herouiWebProps?.gap ?? p.sonnerProps?.gap, isExpanded: p.herouiWebProps?.isExpanded ?? p.sonnerProps?.expand, hotkey: p.herouiWebProps?.hotkey ?? p.sonnerProps?.hotkey, dir: p.herouiWebProps?.dir ?? p.sonnerProps?.dir, className: cn(p.sonnerProps?.className, p.herouiWebProps?.className), style: { zIndex: 10000, ...(p.viewportName ? { position: "absolute" } : {}), ...offsetStyle(placement, p), ...p.sonnerProps?.style, ...p.herouiWebProps?.style } }, ({ toast }) => {
            const r = toast.content;
            const { title, description, options: o, kind } = r.payload;
            const legacy = o.sonnerOptions;
            const defaults = p.sonnerProps?.toastOptions;
            const classes = { ...defaults?.classNames, ...legacy?.classNames };
            const custom = r.payload.custom?.(r.id) ?? resolveRenderProp(o.jsx, undefined);
            const close = o.closeButton ?? legacy?.closeButton ?? p.closeButton ?? p.sonnerProps?.closeButton ?? defaults?.closeButton ?? (kind !== "loading" && !r.payload.custom);
            const dismissible = o.dismissible ?? legacy?.dismissible ?? kind !== "loading";
            const icon = typeof o.icon === "function" ? o.icon(undefined) : isValidElement(o.icon) ? o.icon : legacy?.icon ?? p.sonnerProps?.icons?.[kind === "default" ? "info" : kind];
            const viewProps = o.customToastViewProps ?? p.customToastViewProps ?? getBasicToastRuntimeConfig().customToastViewProps;
            const action = resolveRenderProp(o.action, undefined) ?? legacy?.action;
            const cancel = resolveRenderProp(o.cancel, undefined) ?? legacy?.cancel;
            const renderAction = (value, cancel) => isAction(value) ? _jsx(Toast.ActionButton, { variant: cancel ? "tertiary" : "primary", className: cancel ? classes.cancelButton : classes.actionButton, style: { ...(cancel ? defaults?.cancelButtonStyle : defaults?.actionButtonStyle), ...(cancel ? legacy?.cancelButtonStyle : legacy?.actionButtonStyle), ...value.actionButtonStyle }, onClick: event => {
                    // HeroUI exposes a generic FocusableElement event; this action
                    // renders its default button and preserves Sonner's DOM event API.
                    value.onClick(event);
                    if (!event.defaultPrevented)
                        toastBridge.close(r.id);
                }, children: value.label }) : value;
            return _jsxs(Toast, { ...o.herouiWebProps, toast: toast, placement: placement, variant: o.herouiWebProps?.variant ?? toastVariant(kind), "data-testid": legacy?.testId, className: cn(defaults?.className, classes.toast, legacy?.className, o.herouiWebProps?.className), style: { ...defaults?.style, ...legacy?.style, ...o.herouiWebProps?.style }, children: [custom != null ? _jsxs(Toast.Content, { style: font, children: [_jsx(Toast.Title, { className: "sr-only", children: typeof title === "string" ? title : "通知" }), _jsx(View, { ...viewProps, style: [{ width: "100%" }, viewProps?.style], children: custom })] })
                        : _jsxs(_Fragment, { children: [(kind !== "default" || icon != null) && _jsx(Toast.Indicator, { variant: toastVariant(kind), className: classes.icon, children: icon ?? (kind === "loading" ? _jsx(Spinner, { size: "sm" }) : undefined) }), _jsxs(Toast.Content, { style: font, className: classes.content, children: [_jsx(Toast.Title, { className: classes.title, children: title }), description != null && _jsx(Toast.Description, { className: cn(defaults?.descriptionClassName, classes.description, legacy?.descriptionClassName), children: description })] }), renderAction(action, false), renderAction(cancel, true)] }), close && dismissible && _jsx(Toast.CloseButton, { "aria-label": defaults?.closeButtonAriaLabel ?? "关闭通知", onPress: () => toastBridge.close(r.id), className: cn(classes.closeButton, p.closeButtonClassName), children: p.closeButtonIcon ?? p.sonnerProps?.icons?.close })] });
        })) });
    return p.viewportName ? _jsx(ToastPortalBoundary, { children: content }) : _jsx(ToastPortal, { children: content });
}
