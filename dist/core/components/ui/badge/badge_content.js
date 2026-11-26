import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
const solidText = {
    default: "text-default-foreground", accent: "text-accent-foreground",
    success: "text-success-foreground", warning: "text-warning-foreground", danger: "text-danger-foreground",
};
const softText = {
    default: "text-default-foreground", accent: "text-accent-soft-foreground",
    success: "text-success-soft-foreground", warning: "text-warning-soft-foreground", danger: "text-danger-soft-foreground",
};
export const badgeTextSizes = {
    sm: "text-[10px] leading-[14px]", md: "text-xs leading-4", lg: "text-sm leading-5",
};
export function resolveBadgeContent(props) {
    const context = {
        size: props.size ?? "md",
        variant: props.variant ?? "primary",
        color: props.color ?? "default",
        placement: props.placement ?? "top-right",
    };
    return {
        ...context,
        content: props.isHidden ? undefined : resolveRenderProp(props.content, context),
        textClass: cn("font-medium", badgeTextSizes[context.size], (context.variant === "primary" ? solidText : softText)[context.color]),
    };
}
