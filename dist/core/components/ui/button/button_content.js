import { Children } from "react";
const foreground = {
    primary: "text-accent-foreground",
    secondary: "text-accent-soft-foreground",
    tertiary: "text-default-foreground",
    outline: "text-default-foreground",
    ghost: "text-default-foreground",
    danger: "text-danger-foreground",
    "danger-soft": "text-danger-soft-foreground",
};
/** Only supply context to library Text / Icon; HeroUI still owns the button surface. */
export function buttonTextClass(variant, size, native = false) {
    return ["font-medium", foreground[variant], native
            ? size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
            : size === "lg" ? "text-base" : "text-sm"].join(" ");
}
export function buttonChildren(children, label) {
    return Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? label(child) : child);
}
export function buttonDimensions(size) {
    return size == null ? undefined : {
        ...(size.width == null ? {} : { width: size.width }),
        ...(size.height == null ? {} : { height: size.height }),
    };
}
