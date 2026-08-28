import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from "../icon";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import * as React from "react";
import { View } from "react-native";
function Alert({ className, variant, children, description, descriptionClassName, descriptionProps, icon, iconAlign = "center", iconContainerClassName, iconClassName, iconProps, title, titleClassName, titleProps, ...props }) {
    const renderContext = { icon, variant };
    const renderedTitle = resolveRenderProp(title, renderContext);
    const renderedDescription = resolveRenderProp(description, renderContext);
    const hasStructuredContent = renderedTitle != null || renderedDescription != null;
    return (_jsx(TextClassContext.Provider, { value: cn("text-sm text-foreground", variant === "destructive" && "text-destructive", className), children: _jsxs(View, { role: "alert", className: cn("bg-card border-border relative w-full rounded-lg border px-4 pb-2 pt-3.5", className), ...props, children: [_jsx(View, { className: cn("absolute left-3.5", iconAlign === "center" ? "bottom-0 top-0 justify-center" : "top-3", iconContainerClassName), children: _jsx(Icon, { as: icon, ...iconProps, className: cn("size-4", variant === "destructive" && "text-destructive", iconClassName, iconProps?.className) }) }), hasStructuredContent ? (_jsxs(_Fragment, { children: [renderedTitle != null ? (_jsx(AlertTitle, { ...titleProps, className: cn(titleClassName, titleProps?.className), children: renderedTitle })) : null, renderedDescription != null ? (_jsx(AlertDescription, { ...descriptionProps, className: cn(descriptionClassName, descriptionProps?.className), children: renderedDescription })) : null, children] })) : (children)] }) }));
}
function AlertTitle({ className, ...props }) {
    return (_jsx(Text, { className: cn("mb-1 ml-0.5 min-h-4 pl-6 font-medium leading-none tracking-tight", className), ...props }));
}
function AlertDescription({ className, ...props }) {
    const textClass = React.useContext(TextClassContext);
    return (_jsx(Text, { className: cn("text-muted-foreground ml-0.5 pb-1.5 pl-6 text-sm leading-relaxed", textClass?.includes("text-destructive") && "text-destructive/90", className), ...props }));
}
const AlertComponent = Object.assign(Alert, {
    Description: AlertDescription,
    Root: Alert,
    Title: AlertTitle,
});
export { AlertComponent as Alert };
