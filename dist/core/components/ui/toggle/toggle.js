import { jsx as _jsx } from "react/jsx-runtime";
import { Icon } from "../icon";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import * as TogglePrimitive from "@rn-primitives/toggle";
import { cva } from "class-variance-authority";
import * as React from "react";
import { Platform } from "react-native";
import { resolveRenderProp } from "../utils/render";
const toggleVariants = cva(cn("active:bg-accent group flex flex-row items-center justify-center gap-2 rounded-md", Platform.select({
    web: "aria-[checked=false]:hover:bg-accent/50 aria-[checked=false]:hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex cursor-default whitespace-nowrap outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:pointer-events-none [&_svg]:pointer-events-none",
})), {
    variants: {
        variant: {
            default: "bg-transparent",
            outline: cn("border-input active:bg-accent border bg-transparent shadow-sm shadow-black/5", Platform.select({
                web: "aria-[checked=false]:hover:bg-accent/50 aria-[checked=false]:hover:text-accent-foreground",
            })),
        },
        size: {
            default: "h-10 min-w-10 px-2.5 sm:h-9 sm:min-w-9 sm:px-2",
            sm: "h-9 min-w-9 px-2 sm:h-8 sm:min-w-8 sm:px-1.5",
            lg: "h-11 min-w-11 px-3 sm:h-10 sm:min-w-10 sm:px-2.5",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
function Toggle({ className, variant, size, nativeHaptics, title, children, onPressedChange, ...props }) {
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    const resolvedChildren = resolveRenderProp(title, {
        disabled: props.disabled,
        pressed: props.pressed,
    }) ?? children;
    return (_jsx(TextClassContext.Provider, { value: cn("text-sm text-foreground font-medium", props.pressed
            ? "text-accent-foreground"
            : Platform.select({ web: "group-hover:text-muted-foreground" }), className), children: _jsx(TogglePrimitive.Root, { ...props, className: cn(toggleVariants({ variant, size }), props.disabled && "opacity-50", props.pressed && "bg-accent", className), onPressedChange: (pressed) => {
                triggerNativeHaptics(resolvedNativeHaptics);
                onPressedChange?.(pressed);
            }, children: typeof resolvedChildren === "function"
                ? resolvedChildren
                : React.Children.map(resolvedChildren, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child) }) }));
}
function ToggleIcon({ className, ...props }) {
    const textClass = React.useContext(TextClassContext);
    return _jsx(Icon, { className: cn("size-4 shrink-0", textClass, className), ...props });
}
const ToggleComponent = Object.assign(Toggle, {
    Icon: ToggleIcon,
    Root: Toggle,
});
export { ToggleComponent as Toggle, toggleVariants };
