import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { resolveRenderProp } from "../utils/render";
import * as PopoverPrimitive from "@rn-primitives/popover";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
const PopoverRoot = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
function normalizePopoverChildren(children) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
}
function PopoverRootComponent({ children, content, contentProps, triggerProps, ...props }) {
    if (content === undefined) {
        return _jsx(PopoverRoot, { ...props, children: children });
    }
    const renderedContent = resolveRenderProp(content, {});
    const triggerChildren = React.Children.toArray(children);
    const trigger = triggerChildren.length === 1 ? triggerChildren[0] : null;
    const triggerElement = React.isValidElement(trigger) ? (_jsx(PopoverTrigger, { ...triggerProps, asChild: true, children: trigger })) : (_jsx(PopoverTrigger, { ...triggerProps, children: normalizePopoverChildren(children) }));
    return (_jsxs(PopoverRoot, { ...props, children: [triggerElement, _jsx(PopoverContent, { ...contentProps, children: renderedContent })] }));
}
function PopoverContent({ className, align = "center", sideOffset = 4, portalHost, style, ...props }) {
    const scopedPortalHost = useScopedOverlayPortalHostName();
    const resolvedPortalHost = portalHost ?? scopedPortalHost;
    const contentStyle = useOverlayPortalContentStyle(style);
    return (_jsx(PopoverPrimitive.Portal, { hostName: resolvedPortalHost, children: _jsx(OverlayPortalWindow, { portalHost: resolvedPortalHost, children: _jsx(PopoverPrimitive.Overlay, { style: Platform.select({ native: StyleSheet.absoluteFill }), asChild: Platform.OS !== "web", children: _jsx(NativeOnlyAnimatedView, { entering: FadeIn.duration(200).reduceMotion(ReduceMotion.System), exiting: FadeOut.reduceMotion(ReduceMotion.System), as: "Pressable", children: _jsx(TextClassContext.Provider, { value: "text-popover-foreground", children: _jsx(PopoverPrimitive.Content, { align: align, sideOffset: sideOffset, style: contentStyle, className: cn("bg-popover border-border outline-hidden z-50 w-72 rounded-md border p-4 shadow-md shadow-black/5", Platform.select({
                                web: cn("animate-in fade-in-0 zoom-in-95 origin-(--radix-popover-content-transform-origin) cursor-auto", props.side === "bottom" && "slide-in-from-top-2", props.side === "top" && "slide-in-from-bottom-2"),
                            }), className), ...props }) }) }) }) }) }));
}
const PopoverComponent = Object.assign(PopoverRootComponent, {
    Content: PopoverContent,
    Root: PopoverRoot,
    Trigger: PopoverTrigger,
});
export { PopoverComponent as Popover };
