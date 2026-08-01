import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, isValidElement } from "react";
import { SizableText, Avatar as TamaguiAvatar } from "tamagui";
function normalizeAvatarChildren(children) {
    return Children.map(children, (child) => {
        if (typeof child === "string" || typeof child === "number") {
            return _jsx(SizableText, { children: child });
        }
        if (isValidElement(child)) {
            return child;
        }
        return child;
    });
}
function AvatarRoot(props) {
    const { alt, children, circular, fallback, fallbackProps, imageProps, src, ...rootProps } = props;
    const shouldRenderFallback = fallback != null || fallbackProps != null || src != null;
    const resolvedFallbackProps = shouldRenderFallback
        ? {
            ...fallbackProps,
            bg: fallbackProps?.bg ?? "$gray10",
            delayMs: src ? (fallbackProps?.delayMs ?? 600) : fallbackProps?.delayMs,
        }
        : undefined;
    return (_jsx(TamaguiAvatar, { ...rootProps, circular: circular ?? true, children: children ?? (_jsxs(_Fragment, { children: [src ? (_jsx(AvatarImage, { ...imageProps, "aria-label": imageProps?.["aria-label"] ?? alt, src: src })) : null, shouldRenderFallback ? (_jsx(AvatarFallback, { items: "center", justify: "center", ...resolvedFallbackProps, children: fallback })) : null] })) }));
}
function AvatarImage(props) {
    return _jsx(TamaguiAvatar.Image, { ...props });
}
function AvatarFallback(props) {
    const { children, ...fallbackProps } = props;
    return (_jsx(TamaguiAvatar.Fallback, { ...fallbackProps, children: normalizeAvatarChildren(children) }));
}
export const Avatar = Object.assign(AvatarRoot, {
    Image: AvatarImage,
    Fallback: AvatarFallback,
});
