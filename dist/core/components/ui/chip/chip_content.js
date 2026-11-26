import { jsx as _jsx } from "react/jsx-runtime";
import { Icon } from "../icon";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
const solidText = {
    default: "text-default-foreground", accent: "text-accent-foreground",
    success: "text-success-foreground", warning: "text-warning-foreground", danger: "text-danger-foreground",
};
const softText = {
    default: "text-default-soft-foreground", accent: "text-accent-soft-foreground",
    success: "text-success-soft-foreground", warning: "text-warning-soft-foreground", danger: "text-danger-soft-foreground",
};
const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" };
const iconSize = { sm: 12, md: 14, lg: 16 };
export function resolveChipContent(props) {
    const context = {
        size: props.size ?? "md", variant: props.variant ?? "primary", color: props.color ?? "accent", icon: props.icon,
    };
    return {
        ...context,
        textClass: cn("font-medium", textSize[context.size], (context.variant === "primary" ? solidText : softText)[context.color]),
        label: props.children ?? resolveRenderProp(props.label, context),
        start: props.startContent !== undefined ? resolveRenderProp(props.startContent, context) : props.icon ? (_jsx(Icon, { as: props.icon, ...props.iconProps, size: props.iconProps?.size ?? iconSize[context.size], className: cn(props.iconClassName, props.iconProps?.className) })) : undefined,
        end: resolveRenderProp(props.endContent, context),
    };
}
