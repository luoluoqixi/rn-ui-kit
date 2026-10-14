import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { Text } from "../text";
import * as AvatarPrimitive from "@rn-primitives/avatar";
import { cva } from "class-variance-authority";
import { Children } from "react";
export const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
    variants: {
        size: {
            default: "size-10",
            "2xs": "size-6",
            xs: "size-8",
            sm: "size-9",
            md: "size-10",
            lg: "size-12",
            xl: "size-14",
            "2xl": "size-16",
        },
    },
    defaultVariants: { size: "default" },
});
const avatarFallbackTextVariants = cva("font-medium", {
    variants: {
        size: {
            default: "text-base",
            "2xs": "text-[10px]",
            xs: "text-xs",
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg",
            xl: "text-xl",
            "2xl": "text-2xl",
        },
    },
    defaultVariants: { size: "default" },
});
function normalizeAvatarChildren(children, className) {
    return Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { className: className, children: child })) : (child));
}
function Avatar({ alt, children, fallback, fallbackClassName, fallbackProps, imageClassName, imageProps, src, size = "default", className, ...props }) {
    const hasFallback = fallback != null || fallbackProps != null || src != null;
    const renderedFallback = resolveRenderProp(fallback, { alt, size, src });
    return (_jsx(AvatarPrimitive.Root, { alt: alt ?? "", className: cn(avatarVariants({ size }), className), ...props, children: children ?? (_jsxs(_Fragment, { children: [src != null ? (_jsx(AvatarImage, { ...imageProps, className: cn(imageClassName, imageProps?.className), source: { uri: src } })) : null, hasFallback ? (_jsx(AvatarFallback, { ...fallbackProps, className: cn(fallbackClassName, fallbackProps?.className), children: normalizeAvatarChildren(renderedFallback, avatarFallbackTextVariants({ size })) })) : null] })) }));
}
function AvatarImage({ className, ...props }) {
    return _jsx(AvatarPrimitive.Image, { className: cn("aspect-square size-full", className), ...props });
}
function AvatarFallback({ className, ...props }) {
    return (_jsx(AvatarPrimitive.Fallback, { className: cn("bg-muted flex size-full flex-row items-center justify-center rounded-full", className), ...props, children: normalizeAvatarChildren(props.children) }));
}
const AvatarComponent = Object.assign(Avatar, {
    Fallback: AvatarFallback,
    Image: AvatarImage,
    Root: Avatar,
});
export { AvatarComponent as Avatar };
