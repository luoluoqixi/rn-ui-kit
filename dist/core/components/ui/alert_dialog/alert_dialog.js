import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { buttonTextVariants, buttonVariants } from "../button";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow } from "../utils/overlay/overlay_portal";
import { resolveRenderProp } from "../utils/render";
import { resolveAriaLabel } from "../utils/accessibility";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import * as React from "react";
import { Platform, View } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
function AlertDialogPortal({ hostName, ...props }) {
    const scopedPortalHost = useScopedOverlayPortalHostName();
    return _jsx(AlertDialogPrimitive.Portal, { ...props, hostName: hostName ?? scopedPortalHost });
}
function normalizeAlertDialogChildren(children) {
    if (typeof children === "function")
        return children;
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
}
function normalizeAlertDialogRenderValue(value) {
    const normalized = React.Children.map(value, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
    return normalized != null && normalized.length === 1 ? normalized[0] : normalized;
}
function AlertDialogRoot({ actionAriaLabel, actionLabel, actionClassName, actionProps, actions, cancelAriaLabel, cancelLabel, cancelClassName, cancelProps, children, contentClassName, contentProps, dismissOnBackPress, dismissOnOverlayPress, disableRemoveScroll, description, descriptionClassName, descriptionProps, destructiveAriaLabel, destructiveLabel, destructiveClassName, destructiveProps, footerClassName, headerClassName, overlayProps, portalProps, title, titleClassName, titleProps, trigger, triggerClassName, triggerProps, ...rootProps }) {
    void dismissOnBackPress;
    void disableRemoveScroll;
    const renderContext = { open: rootProps.open };
    const renderedActionLabel = normalizeAlertDialogRenderValue(resolveRenderProp(actionLabel, renderContext));
    const renderedActions = normalizeAlertDialogRenderValue(resolveRenderProp(actions, renderContext));
    const renderedCancelLabel = normalizeAlertDialogRenderValue(resolveRenderProp(cancelLabel, renderContext));
    const renderedDescription = normalizeAlertDialogRenderValue(resolveRenderProp(description, renderContext));
    const renderedDestructiveLabel = normalizeAlertDialogRenderValue(resolveRenderProp(destructiveLabel, renderContext));
    const renderedTitle = normalizeAlertDialogRenderValue(resolveRenderProp(title, renderContext));
    const renderedTrigger = normalizeAlertDialogRenderValue(resolveRenderProp(trigger, renderContext));
    const hasDefaultStructure = renderedTrigger != null ||
        renderedTitle != null ||
        renderedDescription != null ||
        renderedActions != null ||
        renderedCancelLabel != null ||
        renderedActionLabel != null ||
        renderedDestructiveLabel != null;
    if (!hasDefaultStructure) {
        return _jsx(AlertDialogPrimitive.Root, { ...rootProps, children: children });
    }
    return (_jsxs(AlertDialogPrimitive.Root, { ...rootProps, children: [renderedTrigger != null ? (_jsx(AlertDialogTrigger, { ...triggerProps, className: cn(triggerClassName, triggerProps?.className), asChild: true, children: renderedTrigger })) : null, _jsxs(AlertDialogContent, { ...contentProps, className: cn(contentClassName, contentProps?.className), overlayProps: {
                    ...contentProps?.overlayProps,
                    ...overlayProps,
                    dismissOnOverlayPress,
                }, portalProps: portalProps ?? contentProps?.portalProps, children: [renderedTitle != null || renderedDescription != null ? (_jsxs(AlertDialogHeader, { className: headerClassName, children: [renderedTitle != null ? (_jsx(AlertDialogTitle, { ...titleProps, className: cn(titleClassName, titleProps?.className), children: renderedTitle })) : null, renderedDescription != null ? (_jsx(AlertDialogDescription, { ...descriptionProps, className: cn(descriptionClassName, descriptionProps?.className), children: renderedDescription })) : null] })) : null, children, renderedActions != null ||
                        renderedCancelLabel != null ||
                        renderedActionLabel != null ||
                        renderedDestructiveLabel != null ? (_jsxs(AlertDialogFooter, { className: footerClassName, children: [renderedActions, renderedCancelLabel != null ? (_jsx(AlertDialogCancel, { ...cancelProps, className: cn(cancelClassName, cancelProps?.className), "aria-label": resolveAriaLabel(cancelAriaLabel ?? cancelProps?.["aria-label"], renderedCancelLabel), children: renderedCancelLabel })) : null, renderedActionLabel != null ? (_jsx(AlertDialogAction, { ...actionProps, className: cn(actionClassName, actionProps?.className), "aria-label": resolveAriaLabel(actionAriaLabel ?? actionProps?.["aria-label"], renderedActionLabel), children: renderedActionLabel })) : null, renderedDestructiveLabel != null ? (_jsx(AlertDialogDestructive, { ...destructiveProps, className: cn(destructiveClassName, destructiveProps?.className), "aria-label": resolveAriaLabel(destructiveAriaLabel ?? destructiveProps?.["aria-label"], renderedDestructiveLabel), children: renderedDestructiveLabel })) : null] })) : null] })] }));
}
function AlertDialogOverlay({ className, children, dismissOnOverlayPress = false, portalHost, onPress, ...props }) {
    const { onOpenChange } = AlertDialogPrimitive.useRootContext();
    function handlePress(event) {
        onPress?.(event);
        if (!event.isDefaultPrevented() &&
            dismissOnOverlayPress &&
            event.target === event.currentTarget) {
            onOpenChange(false);
        }
    }
    return (_jsx(OverlayPortalWindow, { forceFullScreen: true, onRequestClose: () => onOpenChange(false), portalHost: portalHost, children: _jsx(AlertDialogPrimitive.Overlay, { className: cn("absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2", Platform.select({
                web: "animate-in fade-in-0 fixed",
            }), className), ...props, ...{ onPress: handlePress }, asChild: Platform.OS !== "web", children: _jsx(NativeOnlyAnimatedView, { entering: FadeIn.duration(200).delay(50).reduceMotion(ReduceMotion.System), exiting: FadeOut.duration(150).reduceMotion(ReduceMotion.System), as: "Pressable", children: _jsx(_Fragment, { children: children }) }) }) }));
}
function AlertDialogContent({ className, portalHost, portalProps, overlayProps, ...props }) {
    const scopedPortalHost = useScopedOverlayPortalHostName();
    const resolvedPortalHost = portalHost ?? portalProps?.hostName ?? scopedPortalHost;
    return (_jsx(AlertDialogPortal, { ...portalProps, hostName: resolvedPortalHost, children: _jsx(AlertDialogOverlay, { ...overlayProps, portalHost: resolvedPortalHost, children: _jsx(AlertDialogPrimitive.Content, { className: cn("bg-background border-border z-50 flex flex-col gap-4 rounded-lg border p-6 shadow-lg shadow-black/5 sm:max-w-lg", Platform.select({
                    web: "animate-in fade-in-0 zoom-in-95 web:max-w-[calc(100%-2rem)] duration-200",
                }), className), ...props }) }) }));
}
function AlertDialogHeader({ className, ...props }) {
    return (_jsx(TextClassContext.Provider, { value: "text-center sm:text-left", children: _jsx(View, { className: cn("flex flex-col gap-2", className), ...props }) }));
}
function AlertDialogFooter({ className, ...props }) {
    return (_jsx(View, { className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className), ...props }));
}
function AlertDialogTitle({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Title, { className: cn("text-foreground text-lg font-semibold", className), ...props }));
}
function AlertDialogDescription({ className, ...props }) {
    return (_jsx(AlertDialogPrimitive.Description, { className: cn("text-muted-foreground text-sm", className), ...props }));
}
function AlertDialogAction({ className, ...props }) {
    return (_jsx(TextClassContext.Provider, { value: buttonTextVariants({ className }), children: _jsx(AlertDialogPrimitive.Action, { className: cn(buttonVariants(), className), ...props, children: normalizeAlertDialogChildren(props.children) }) }));
}
function AlertDialogCancel({ className, ...props }) {
    return (_jsx(TextClassContext.Provider, { value: buttonTextVariants({ className, variant: "outline" }), children: _jsx(AlertDialogPrimitive.Cancel, { className: cn(buttonVariants({ variant: "outline" }), className), ...props, children: normalizeAlertDialogChildren(props.children) }) }));
}
function AlertDialogDestructive({ className, ...props }) {
    return (_jsx(TextClassContext.Provider, { value: buttonTextVariants({ className, variant: "destructive" }), children: _jsx(AlertDialogPrimitive.Action, { className: cn(buttonVariants({ variant: "destructive" }), className), ...props, children: normalizeAlertDialogChildren(props.children) }) }));
}
const AlertDialog = Object.assign(AlertDialogRoot, {
    Action: AlertDialogAction,
    Cancel: AlertDialogCancel,
    Content: AlertDialogContent,
    Description: AlertDialogDescription,
    Destructive: AlertDialogDestructive,
    Footer: AlertDialogFooter,
    Header: AlertDialogHeader,
    Overlay: AlertDialogOverlay,
    Portal: AlertDialogPortal,
    Root: AlertDialogRoot,
    Title: AlertDialogTitle,
    Trigger: AlertDialogTrigger,
});
export { AlertDialog };
