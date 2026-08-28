import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { Text } from "../text";
import * as AvatarPrimitive from "@rn-primitives/avatar";
import { Children } from "react";
function normalizeAvatarChildren(children) {
    return Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
}
function Avatar({ alt, children, fallback, fallbackClassName, fallbackProps, imageClassName, imageProps, src, className, ...props }) {
    const hasFallback = fallback != null || fallbackProps != null || src != null;
    const renderedFallback = resolveRenderProp(fallback, { alt, src });
    return (_jsx(AvatarPrimitive.Root, { alt: alt ?? "", className: cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className), ...props, children: children ?? (_jsxs(_Fragment, { children: [src != null ? (_jsx(AvatarImage, { ...imageProps, className: cn(imageClassName, imageProps?.className), source: { uri: src } })) : null, hasFallback ? (_jsx(AvatarFallback, { ...fallbackProps, className: cn(fallbackClassName, fallbackProps?.className), children: renderedFallback })) : null] })) }));
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
