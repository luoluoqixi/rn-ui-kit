import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { resolveRenderProp } from "../utils/render";
import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { FadeInDown, FadeInUp, FadeOut, ReduceMotion } from "react-native-reanimated";
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipSizeContext = React.createContext("default");
const tooltipSizes = {
    default: { content: "px-3 py-1.5", text: "text-sm" },
    "2xs": { content: "px-2 py-1", text: "text-[10px]" },
    "xs": { content: "px-2.5 py-1", text: "text-xs" },
    "sm": { content: "px-2.5 py-1.5", text: "text-sm" },
    "md": { content: "px-3 py-1.5", text: "text-sm" },
    "lg": { content: "px-3.5 py-2", text: "text-lg" },
    "xl": { content: "px-4 py-2.5", text: "text-xl" },
    "2xl": { content: "px-5 py-3", text: "text-2xl" },
};
function normalizeTooltipChildren(children) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
}
function TooltipRootComponent({ children, content, contentProps, size = "default", triggerProps, ...props }) {
    if (content === undefined) {
        return (_jsx(TooltipRoot, { ...props, children: _jsx(TooltipSizeContext.Provider, { value: size, children: children }) }));
    }
    const renderedContent = resolveRenderProp(content, {});
    const triggerChildren = React.Children.toArray(children);
    const trigger = triggerChildren.length === 1 ? triggerChildren[0] : null;
    const triggerElement = React.isValidElement(trigger) ? (_jsx(TooltipTrigger, { ...triggerProps, asChild: true, children: trigger })) : (_jsx(TooltipTrigger, { ...triggerProps, children: normalizeTooltipChildren(children) }));
    return (_jsxs(TooltipRoot, { ...props, children: [triggerElement, _jsx(TooltipContent, { ...contentProps, size: contentProps?.size ?? size, children: renderedContent })] }));
}
function TooltipContent({ className, children, sideOffset = 4, portalHost, side = "top", size: sizeProp, style, ...props }) {
    const size = sizeProp ?? React.useContext(TooltipSizeContext);
    const scopedPortalHost = useScopedOverlayPortalHostName();
    const resolvedPortalHost = portalHost ?? scopedPortalHost;
    const contentStyle = useOverlayPortalContentStyle(style);
    return (_jsx(TooltipPrimitive.Portal, { hostName: resolvedPortalHost, children: _jsx(OverlayPortalWindow, { portalHost: resolvedPortalHost, children: _jsx(TooltipPrimitive.Overlay, { style: Platform.select({ native: StyleSheet.absoluteFill }), asChild: Platform.OS !== "web", children: _jsx(NativeOnlyAnimatedView, { entering: side === "top"
                        ? FadeInDown.withInitialValues({
                            transform: [{ translateY: 3 }],
                        })
                            .duration(150)
                            .reduceMotion(ReduceMotion.System)
                        : FadeInUp.withInitialValues({
                            transform: [{ translateY: -5 }],
                        }).reduceMotion(ReduceMotion.System), exiting: FadeOut.reduceMotion(ReduceMotion.System), as: "Pressable", children: _jsx(TextClassContext.Provider, { value: cn(tooltipSizes[size].text, "text-primary-foreground"), children: _jsx(TooltipPrimitive.Content, { sideOffset: sideOffset, style: contentStyle, className: cn(cn("bg-primary z-50 rounded-md", tooltipSizes[size].content), Platform.select({
                                web: cn("animate-in fade-in-0 zoom-in-95 origin-(--radix-tooltip-content-transform-origin) w-fit text-balance", side === "bottom" && "slide-in-from-top-2", side === "left" && "slide-in-from-right-2", side === "right" && "slide-in-from-left-2", side === "top" && "slide-in-from-bottom-2"),
                            }), className), side: side, ...props, children: React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { children: child })) : (child)) }) }) }) }) }) }));
}
const Tooltip = Object.assign(TooltipRootComponent, {
    Content: TooltipContent,
    Overlay: TooltipPrimitive.Overlay,
    Portal: function TooltipPortal({ hostName, ...props }) {
        const scopedPortalHost = useScopedOverlayPortalHostName();
        return _jsx(TooltipPrimitive.Portal, { ...props, hostName: hostName ?? scopedPortalHost });
    },
    Root: TooltipRoot,
    Trigger: TooltipTrigger,
});
export { Tooltip };
