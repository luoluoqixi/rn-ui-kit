import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Icon } from "../icon";
import { Button } from "../button";
import { Text } from "../text";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { cn } from "../utils/cn";
import { OverlayPortalWindow } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { resolveRenderProp } from "../utils/render";
import * as DialogPrimitive from "@rn-primitives/dialog";
import { X } from "lucide-react-native";
import * as React from "react";
import { Platform, View, } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
const DialogTrigger = DialogPrimitive.Trigger;
function DialogPortal({ hostName, ...props }) {
    const scopedPortalHost = useScopedOverlayPortalHostName();
    return _jsx(DialogPrimitive.Portal, { ...props, hostName: hostName ?? scopedPortalHost });
}
const DialogClose = DialogPrimitive.Close;
function normalizeDialogChildren(children) {
    const normalized = React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
    return normalized != null && normalized.length === 1 ? normalized[0] : normalized;
}
function DialogRoot({ actionClassName, actionLabel, actionProps, actions, cancelClassName, cancelLabel, cancelProps, children, content, contentClassName, contentProps, defaultOpen, description, descriptionClassName, descriptionProps, footerClassName, headerClassName, onOpenChange, open, title, titleClassName, titleProps, trigger, triggerClassName, triggerProps, ...rootProps }) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
    const hasDataStructure = children == null &&
        [actionLabel, actions, cancelLabel, content, description, title, trigger].some((value) => value !== undefined);
    if (!hasDataStructure) {
        return (_jsx(DialogPrimitive.Root, { ...rootProps, defaultOpen: defaultOpen, onOpenChange: onOpenChange, open: open, children: children }));
    }
    const resolvedOpen = open ?? uncontrolledOpen;
    const renderContext = { open: resolvedOpen };
    const renderedActionLabel = resolveRenderProp(actionLabel, renderContext);
    const renderedActions = resolveRenderProp(actions, renderContext);
    const renderedCancelLabel = resolveRenderProp(cancelLabel, renderContext);
    const renderedContent = resolveRenderProp(content, renderContext);
    const renderedDescription = resolveRenderProp(description, renderContext);
    const renderedTitle = resolveRenderProp(title, renderContext);
    const renderedTrigger = resolveRenderProp(trigger, renderContext);
    const handleOpenChange = (nextOpen) => {
        if (open === undefined)
            setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen);
    };
    const triggerElement = renderedTrigger == null ? null : React.isValidElement(renderedTrigger) ? (renderedTrigger) : (_jsx(Button, { className: triggerClassName, variant: "outline", children: normalizeDialogChildren(renderedTrigger) }));
    return (_jsxs(DialogPrimitive.Root, { ...rootProps, onOpenChange: handleOpenChange, open: resolvedOpen, children: [triggerElement != null ? (_jsx(DialogTrigger, { ...triggerProps, asChild: true, className: cn(triggerProps?.className, triggerClassName), children: triggerElement })) : null, _jsxs(DialogContent, { ...contentProps, className: cn(contentClassName, contentProps?.className), children: [renderedTitle != null || renderedDescription != null ? (_jsxs(DialogHeader, { className: headerClassName, children: [renderedTitle != null ? (_jsx(DialogTitle, { ...titleProps, className: cn(titleClassName, titleProps?.className), children: renderedTitle })) : null, renderedDescription != null ? (_jsx(DialogDescription, { ...descriptionProps, className: cn(descriptionClassName, descriptionProps?.className), children: renderedDescription })) : null] })) : null, renderedContent != null ? normalizeDialogChildren(renderedContent) : null, renderedActions != null || renderedCancelLabel != null || renderedActionLabel != null ? (_jsxs(DialogFooter, { className: footerClassName, children: [normalizeDialogChildren(renderedActions), renderedCancelLabel != null ? (_jsx(DialogClose, { asChild: true, children: _jsx(Button, { ...cancelProps, className: cn(cancelClassName, cancelProps?.className), variant: "outline", children: normalizeDialogChildren(renderedCancelLabel) }) })) : null, renderedActionLabel != null ? (_jsx(Button, { ...actionProps, className: cn(actionClassName, actionProps?.className), children: normalizeDialogChildren(renderedActionLabel) })) : null] })) : null] })] }));
}
function DialogOverlay({ className, children, portalHost, onPress, ...props }) {
    const { onOpenChange } = DialogPrimitive.useRootContext();
    function onOverlayPress(event) {
        onPress?.(event);
        if (event.target === event.currentTarget && !event.isDefaultPrevented()) {
            onOpenChange(false);
        }
    }
    return (_jsx(OverlayPortalWindow, { forceFullScreen: true, onRequestClose: () => onOpenChange(false), portalHost: portalHost, children: _jsx(DialogPrimitive.Overlay, { className: cn("absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2", Platform.select({
                web: "animate-in fade-in-0 fixed cursor-default [&>*]:cursor-auto",
            }), className), ...props, 
            // Handle dismissal here so presses on dialog controls are not treated as overlay presses.
            closeOnPress: Platform.OS === "web" ? undefined : false, onPress: onOverlayPress, asChild: Platform.OS !== "web", children: _jsx(NativeOnlyAnimatedView, { entering: FadeIn.duration(200).reduceMotion(ReduceMotion.System), exiting: FadeOut.duration(150).reduceMotion(ReduceMotion.System), as: "Pressable", children: _jsx(NativeOnlyAnimatedView, { className: "w-full", entering: FadeIn.delay(50).reduceMotion(ReduceMotion.System), exiting: FadeOut.duration(150).reduceMotion(ReduceMotion.System), children: _jsx(_Fragment, { children: children }) }) }) }) }));
}
function DialogContent({ className, portalHost, portalProps, overlayProps, children, onStartShouldSetResponder, style, ...props }) {
    const scopedPortalHost = useScopedOverlayPortalHostName();
    const resolvedPortalHost = portalHost ?? portalProps?.hostName ?? scopedPortalHost;
    return (_jsx(DialogPortal, { ...portalProps, hostName: resolvedPortalHost, children: _jsx(DialogOverlay, { ...overlayProps, portalHost: resolvedPortalHost, children: _jsxs(DialogPrimitive.Content, { className: cn("bg-background border-border z-50 mx-auto flex w-full flex-col gap-4 rounded-lg border p-6 shadow-lg shadow-black/5 sm:max-w-2xl", Platform.select({
                    web: "animate-in fade-in-0 zoom-in-95 web:max-w-[calc(100%-2rem)] duration-200",
                }), className), style: [
                    Platform.OS === "web"
                        ? {
                            maxWidth: "calc(100vw - 2rem)",
                            width: "min(672px, calc(100vw - 2rem))",
                        }
                        : null,
                    style,
                ], ...props, onStartShouldSetResponder: onStartShouldSetResponder ?? (() => false), children: [_jsx(_Fragment, { children: children }), _jsxs(DialogPrimitive.Close, { className: cn("absolute right-4 top-4 rounded opacity-70 active:opacity-100", Platform.select({
                            web: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
                        })), hitSlop: 12, children: [_jsx(Icon, { as: X, className: cn("text-accent-foreground web:pointer-events-none size-4 shrink-0") }), _jsx(Text, { className: "sr-only", children: "Close" })] })] }) }) }));
}
function DialogHeader({ className, ...props }) {
    return (_jsx(View, { className: cn("flex flex-col gap-2 text-center sm:text-left", className), ...props }));
}
function DialogFooter({ className, ...props }) {
    return (_jsx(View, { className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className), ...props }));
}
function DialogTitle({ className, ...props }) {
    return (_jsx(DialogPrimitive.Title, { className: cn("text-foreground text-lg font-semibold leading-none", className), ...props }));
}
function DialogDescription({ className, ...props }) {
    return (_jsx(DialogPrimitive.Description, { className: cn("text-muted-foreground text-sm", className), ...props }));
}
const Dialog = Object.assign(DialogRoot, {
    Close: DialogClose,
    Content: DialogContent,
    Description: DialogDescription,
    Footer: DialogFooter,
    Header: DialogHeader,
    Overlay: DialogOverlay,
    Portal: DialogPortal,
    Root: DialogRoot,
    Title: DialogTitle,
    Trigger: DialogTrigger,
});
export { Dialog };
