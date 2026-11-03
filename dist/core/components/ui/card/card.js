import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import * as React from "react";
import { View } from "react-native";
function normalizeCardChildren(children) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
}
function Card({ className, children, content, contentClassName, contentProps, description, descriptionClassName, descriptionProps, footer, footerClassName, footerProps, header, headerClassName, headerProps, title, titleClassName, titleProps, ...props }) {
    const renderContext = {};
    const renderedHeader = resolveRenderProp(header, renderContext);
    const renderedTitle = resolveRenderProp(title, renderContext);
    const renderedDescription = resolveRenderProp(description, renderContext);
    const renderedContent = resolveRenderProp(content, renderContext);
    const renderedFooter = resolveRenderProp(footer, renderContext);
    const hasHeader = renderedHeader != null || renderedTitle != null || renderedDescription != null;
    return (_jsx(TextClassContext.Provider, { value: "text-card-foreground", children: _jsxs(View, { className: cn("bg-card border-border flex flex-col gap-6 rounded-xl border py-6 shadow-sm shadow-black/5", className), ...props, children: [hasHeader ? (_jsx(CardHeader, { ...headerProps, className: cn(headerClassName, headerProps?.className), children: renderedHeader != null ? (normalizeCardChildren(renderedHeader)) : (_jsxs(_Fragment, { children: [renderedTitle != null ? (_jsx(CardTitle, { ...titleProps, className: cn(titleClassName, titleProps?.className), children: renderedTitle })) : null, renderedDescription != null ? (_jsx(CardDescription, { ...descriptionProps, className: cn(descriptionClassName, descriptionProps?.className), children: renderedDescription })) : null] })) })) : null, renderedContent != null ? (_jsx(CardContent, { ...contentProps, className: cn(contentClassName, contentProps?.className), children: normalizeCardChildren(renderedContent) })) : null, children, renderedFooter != null ? (_jsx(CardFooter, { ...footerProps, className: cn(footerClassName, footerProps?.className), children: normalizeCardChildren(renderedFooter) })) : null] }) }));
}
function CardHeader({ className, ...props }) {
    return _jsx(View, { className: cn("flex flex-col gap-1.5 px-6", className), ...props });
}
function CardTitle({ className, ref, ...props }) {
    return (_jsx(Text, { ref: ref, role: "heading", "aria-level": 3, className: cn("font-semibold leading-none", className), ...props }));
}
function CardDescription({ className, ...props }) {
    return _jsx(Text, { className: cn("text-muted-foreground text-sm", className), ...props });
}
function CardContent({ className, ...props }) {
    return _jsx(View, { className: cn("px-6", className), ...props });
}
function CardFooter({ className, ...props }) {
    return _jsx(View, { className: cn("flex flex-row items-center px-6", className), ...props });
}
const CardComponent = Object.assign(Card, {
    Content: CardContent,
    Description: CardDescription,
    Footer: CardFooter,
    Header: CardHeader,
    Root: Card,
    Title: CardTitle,
});
export { CardComponent as Card };
