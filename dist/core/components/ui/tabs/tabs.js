import { createElement as _createElement } from "react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
import { resolveRenderProp } from "../utils/render";
import * as TabsPrimitive from "@rn-primitives/tabs";
import * as React from "react";
import { Platform } from "react-native";
const TabsHapticsContext = React.createContext(undefined);
const TabsSizeContext = React.createContext("default");
const tabsSizes = {
    default: { list: "h-10 p-[3px]", trigger: "gap-1.5 px-2.5 py-1", text: "text-base" },
    "2xs": { list: "h-7 p-0.5", trigger: "gap-1 px-1.5 py-0.5", text: "text-xs" },
    "xs": { list: "h-8 p-0.5", trigger: "gap-1 px-2 py-1", text: "text-xs" },
    "sm": { list: "h-9 p-[3px]", trigger: "gap-1.5 px-2 py-1", text: "text-sm" },
    "md": { list: "h-10 p-[3px]", trigger: "gap-1.5 px-2.5 py-1", text: "text-base" },
    "lg": { list: "h-11 p-[3px]", trigger: "gap-2 px-3 py-1.5", text: "text-base" },
    "xl": { list: "h-12 p-[3px]", trigger: "gap-2 px-4 py-1.5", text: "text-lg" },
    "2xl": { list: "h-14 p-1", trigger: "gap-2.5 px-5 py-2.5", text: "text-xl" },
};
function normalizeTabsChildren(children) {
    if (typeof children === "function")
        return children;
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
}
function Tabs({ children, className, contentProps, items, listProps, nativeHaptics, size = "default", triggerProps, ...props }) {
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    const renderedChildren = children ??
        (items != null ? (_jsxs(_Fragment, { children: [_jsx(TabsList, { ...listProps, children: items.map((item) => (_createElement(TabsTrigger, { ...triggerProps, ...item.triggerProps, disabled: item.disabled ?? item.triggerProps?.disabled ?? triggerProps?.disabled, key: item.value, value: item.value, nativeHaptics: resolvedNativeHaptics }, resolveRenderProp(item.title, item)))) }), items.map((item) => (_createElement(TabsContent, { ...contentProps, ...item.contentProps, key: item.value, value: item.value }, resolveRenderProp(item.content, item))))] })) : null);
    return (_jsx(TabsPrimitive.Root, { className: cn("flex flex-col gap-2", className), ...props, children: _jsx(TabsHapticsContext.Provider, { value: resolvedNativeHaptics, children: _jsx(TabsSizeContext.Provider, { value: size, children: renderedChildren }) }) }));
}
function TabsList({ className, size, ...props }) {
    const resolvedSize = size ?? React.useContext(TabsSizeContext);
    return (_jsx(TabsPrimitive.List, { className: cn("bg-muted flex flex-row items-center justify-center rounded-lg", tabsSizes[resolvedSize].list, Platform.select({ web: "inline-flex w-fit", native: "mr-auto" }), className), ...props }));
}
function TabsTrigger({ className, children, nativeHaptics, onPress, onPressIn, onPressOut, size, ...props }) {
    const contextNativeHaptics = React.useContext(TabsHapticsContext);
    const resolvedSize = size ?? React.useContext(TabsSizeContext);
    const { value } = TabsPrimitive.useRootContext();
    const isActive = value === props.value;
    const [isPressed, setIsPressed] = React.useState(false);
    const inactiveTextInteractionClass = !isActive && !props.disabled
        ? cn(isPressed && "text-foreground dark:text-foreground", Platform.select({
            web: "group-hover:text-foreground group-active:text-foreground dark:group-hover:text-foreground dark:group-active:text-foreground",
        }))
        : undefined;
    return (_jsx(TextClassContext.Provider, { value: cn("text-muted-foreground font-medium", tabsSizes[resolvedSize].text, isActive ? "text-foreground" : inactiveTextInteractionClass), children: _jsx(TabsPrimitive.Trigger, { className: cn("group flex flex-row items-center justify-center rounded-md border border-transparent shadow-none shadow-black/5", tabsSizes[resolvedSize].trigger, Platform.select({
                web: "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring web:h-[calc(100%-1px)] inline-flex cursor-default whitespace-nowrap transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
            }), props.disabled && "opacity-50", isActive && "bg-background dark:border-foreground/10 dark:bg-input/30", className), ...props, onPress: (event) => {
                onPress?.(event);
                if (!event.defaultPrevented)
                    triggerNativeHaptics(nativeHaptics ?? contextNativeHaptics);
            }, onPressIn: (event) => {
                setIsPressed(true);
                onPressIn?.(event);
            }, onPressOut: (event) => {
                setIsPressed(false);
                onPressOut?.(event);
            }, children: normalizeTabsChildren(children) }) }));
}
function TabsContent({ className, children, ...props }) {
    return (_jsx(TabsPrimitive.Content, { className: cn(Platform.select({ web: "flex-1 outline-none" }), className), ...props, children: normalizeTabsChildren(children) }));
}
const TabsComponent = Object.assign(Tabs, {
    Content: TabsContent,
    List: TabsList,
    Root: Tabs,
    Trigger: TabsTrigger,
});
export { TabsComponent as Tabs };
