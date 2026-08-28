import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { Icon } from "../icon";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import { Slot } from "@rn-primitives/slot";
import { cva } from "class-variance-authority";
import * as React from "react";
import { Platform, View } from "react-native";
const badgeVariants = cva(cn("border-border group shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5", Platform.select({
    web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-fit whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
})), {
    variants: {
        variant: {
            default: cn("bg-primary border-transparent", Platform.select({ web: "[a&]:hover:bg-primary/90" })),
            secondary: cn("bg-secondary border-transparent", Platform.select({ web: "[a&]:hover:bg-secondary/90" })),
            destructive: cn("bg-destructive border-transparent", Platform.select({ web: "[a&]:hover:bg-destructive/90" })),
            outline: Platform.select({
                web: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            }),
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
const badgeTextVariants = cva("text-xs font-medium", {
    variants: {
        variant: {
            default: "text-primary-foreground",
            secondary: "text-secondary-foreground",
            destructive: "text-white",
            outline: "text-foreground",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function normalizeBadgeChildren(children, className, props) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? (_jsx(Text, { ...props, className: className, children: child })) : (child));
}
function Badge({ className, icon, iconClassName, iconProps, label, labelClassName, labelProps, variant, asChild, children, ...props }) {
    const Component = asChild ? Slot : View;
    const renderedLabel = resolveRenderProp(label, { icon, variant });
    const content = children ?? (_jsxs(_Fragment, { children: [icon ? (_jsx(Icon, { as: icon, ...iconProps, className: cn("size-3", iconClassName, iconProps?.className) })) : null, renderedLabel != null
                ? normalizeBadgeChildren(renderedLabel, cn(labelClassName, labelProps?.className), labelProps)
                : null] }));
    return (_jsx(TextClassContext.Provider, { value: badgeTextVariants({ variant }), children: _jsx(Component, { className: cn(badgeVariants({ variant }), className), ...props, children: content }) }));
}
export { Badge, badgeTextVariants, badgeVariants };
