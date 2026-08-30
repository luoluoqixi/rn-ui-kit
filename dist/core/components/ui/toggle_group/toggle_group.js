import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { Icon } from "../icon";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { ToggleSizeContext, toggleTextVariants, toggleVariants } from "../toggle";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics, useUiTheme, } from "../utils";
import { resolveRenderProp } from "../utils/render";
import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
const ToggleGroupContext = React.createContext(null);
function hasExplicitItemSizing(className, style) {
    const hasSizingClass = className
        ?.split(/\s+/)
        .some((token) => token.startsWith("w-") ||
        token.startsWith("basis-") ||
        token.startsWith("[width:") ||
        token.startsWith("[flex-basis:"));
    if (hasSizingClass)
        return true;
    const flattenedStyle = StyleSheet.flatten(style);
    return flattenedStyle?.width != null || flattenedStyle?.flexBasis != null;
}
function ToggleGroup({ className, variant, size, nativeHaptics, children, items, ...props }) {
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    return (_jsx(ToggleGroupPrimitive.Root, { className: cn("flex flex-row items-center rounded-md shadow-none", Platform.select({ web: "w-fit" }), variant === "outline" && "shadow-sm shadow-black/5", className), ...props, children: _jsx(ToggleGroupContext.Provider, { value: { nativeHaptics: resolvedNativeHaptics, variant, size: size ?? "md" }, children: children ??
                items?.map((item, index) => (_createElement(ToggleGroupItem, { ...item.itemProps, key: item.value, value: item.value, disabled: item.disabled ?? item.itemProps?.disabled, isFirst: index === 0, isLast: index === items.length - 1, title: item.title }, item.children))) }) }));
}
function useToggleGroupContext() {
    const context = React.useContext(ToggleGroupContext);
    if (context === null) {
        throw new Error("ToggleGroup compound components cannot be rendered outside the ToggleGroup component");
    }
    return context;
}
function ToggleGroupItem({ className, children, variant, size, isFirst, isLast, nativeHaptics, title, onPress, onPressIn, onPressOut, ...props }) {
    const context = useToggleGroupContext();
    const { value } = ToggleGroupPrimitive.useRootContext();
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics ?? context.nativeHaptics);
    const theme = useUiTheme();
    const pressed = ToggleGroupPrimitive.utils.getIsSelected(value, props.value);
    const [isPressed, setIsPressed] = React.useState(false);
    const resolvedStyle = typeof props.style === "function" ? props.style({ pressed: isPressed }) : props.style;
    const interactionStyle = StyleSheet.flatten([
        resolvedStyle,
        isPressed && !pressed && !props.disabled ? { backgroundColor: theme.accent } : undefined,
    ]);
    const hasCustomSizing = hasExplicitItemSizing(className, props.style);
    const renderedTitle = resolveRenderProp(title, {
        pressed,
        value: String(props.value ?? ""),
    });
    const resolvedSize = context.size || size || "md";
    return (_jsx(TextClassContext.Provider, { value: cn(toggleTextVariants({ size: resolvedSize }), pressed && "text-accent-foreground"), children: _jsx(ToggleSizeContext.Provider, { value: resolvedSize === "default" ? "md" : resolvedSize, children: _jsx(ToggleGroupPrimitive.Item, { ...props, className: cn(toggleVariants({
                    variant: context.variant || variant,
                    size: resolvedSize,
                }), props.disabled && "opacity-50", pressed && "bg-accent", "min-w-0 shrink-0 rounded-none shadow-none", isFirst && "rounded-l-md", isLast && "rounded-r-md", (context.variant === "outline" || variant === "outline") && "border-l-0", (context.variant === "outline" || variant === "outline") && isFirst && "border-l", Platform.select({
                    web: cn("flex-1 focus:z-10 focus-visible:z-10", hasCustomSizing && "flex-none"),
                }), className), style: interactionStyle, onPress: (event) => {
                    onPress?.(event);
                    if (!event.defaultPrevented)
                        triggerNativeHaptics(resolvedNativeHaptics);
                }, onPressIn: (event) => {
                    setIsPressed(true);
                    onPressIn?.(event);
                }, onPressOut: (event) => {
                    setIsPressed(false);
                    onPressOut?.(event);
                }, children: renderedTitle != null ? (typeof renderedTitle === "string" || typeof renderedTitle === "number" ? (_jsx(Text, { children: renderedTitle })) : (renderedTitle)) : typeof children === "function" ? (children) : (React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child)) }) }) }));
}
function ToggleGroupIcon({ className, ...props }) {
    const textClass = React.useContext(TextClassContext);
    return _jsx(Icon, { className: cn("size-4 shrink-0", textClass, className), ...props });
}
const ToggleGroupComponent = Object.assign(ToggleGroup, {
    Icon: ToggleGroupIcon,
    Item: ToggleGroupItem,
    Root: ToggleGroup,
});
export { ToggleGroupComponent as ToggleGroup };
