import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../button";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import * as CollapsiblePrimitive from "@rn-primitives/collapsible";
import * as React from "react";
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
const CollapsibleContent = CollapsiblePrimitive.Content;
function normalizeCollapsibleChildren(children, className) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { className: className, children: child })) : (child));
}
function CollapsibleRoot({ children, content, contentClassName, contentProps, defaultOpen, disabled = false, nativeHaptics, onOpenChange, open, title, titleClassName, trigger, triggerButtonProps, triggerClassName, triggerProps, ...rootProps }) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
    const hasDataStructure = children == null && [content, title, trigger].some((value) => value !== undefined);
    if (!hasDataStructure) {
        return (_jsx(CollapsiblePrimitive.Root, { ...rootProps, disabled: disabled, defaultOpen: defaultOpen, onOpenChange: onOpenChange, open: open, children: children }));
    }
    const resolvedOpen = open ?? uncontrolledOpen;
    const renderContext = {
        disabled,
        open: resolvedOpen,
    };
    const renderedTitle = resolveRenderProp(title, renderContext);
    const renderedTrigger = resolveRenderProp(trigger, renderContext);
    const renderedContent = resolveRenderProp(content, renderContext);
    const handleOpenChange = (nextOpen) => {
        if (open === undefined)
            setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen);
    };
    const defaultTrigger = (_jsx(Button, { ...triggerButtonProps, className: cn("self-start w-full", triggerClassName, triggerButtonProps?.className), disabled: disabled || triggerButtonProps?.disabled, nativeHaptics: triggerButtonProps?.nativeHaptics ?? nativeHaptics, variant: triggerButtonProps?.variant ?? "secondary", children: normalizeCollapsibleChildren(renderedTitle ?? (resolvedOpen ? "收起详情" : "展开详情"), titleClassName) }));
    return (_jsxs(CollapsiblePrimitive.Root, { ...rootProps, disabled: disabled, onOpenChange: handleOpenChange, open: resolvedOpen, children: [_jsx(CollapsibleTrigger, { ...triggerProps, asChild: true, className: cn(triggerProps?.className, triggerClassName), children: renderedTrigger ?? defaultTrigger }), renderedContent != null ? (_jsx(CollapsibleContent, { ...contentProps, className: cn(contentClassName, contentProps?.className), children: normalizeCollapsibleChildren(renderedContent) })) : null] }));
}
const Collapsible = Object.assign(CollapsibleRoot, {
    Content: CollapsibleContent,
    Root: CollapsibleRoot,
    Trigger: CollapsibleTrigger,
});
export { Collapsible };
