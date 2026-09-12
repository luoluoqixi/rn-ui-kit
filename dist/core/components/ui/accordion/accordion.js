import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { Icon } from "../icon";
import { Text, TextClassContext } from "../text";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import * as AccordionPrimitive from "@rn-primitives/accordion";
import { ChevronDown } from "lucide-react-native";
import { Children, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, { FadeOutUp, LayoutAnimationConfig, LinearTransition, ReduceMotion, useAnimatedStyle, useDerivedValue, withTiming, } from "react-native-reanimated";
function Accordion({ children, contentClassName, contentProps, headerProps, itemProps, items, nativeHaptics, titleClassName, ref, triggerProps, onValueChange, ...props }) {
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const generatedChildren = children ??
        items?.map((item) => {
            const title = resolveRenderProp(item.title, item);
            const content = resolveRenderProp(item.content, item);
            return (_createElement(AccordionItem, { ...itemProps, ...item.itemProps, disabled: item.disabled ?? item.itemProps?.disabled ?? itemProps?.disabled, key: item.value, value: item.value },
                _jsx(AccordionTrigger, { ...triggerProps, ...item.triggerProps, className: cn(triggerProps?.className, item.triggerProps?.className, titleClassName, item.titleClassName), "aria-label": resolveAriaLabel(item["aria-label"] ??
                        item.triggerProps?.["aria-label"] ??
                        triggerProps?.["aria-label"], title), headerProps: item.headerProps ?? headerProps, children: title }),
                _jsx(AccordionContent, { ...contentProps, ...item.contentProps, className: cn(contentProps?.className, item.contentProps?.className, contentClassName), children: content })));
        });
    return (_jsx(LayoutAnimationConfig, { skipEntering: true, children: _jsx(AccordionPrimitive.Root, { ...props, onValueChange: (nextValue) => {
                onValueChange?.(nextValue);
                triggerNativeHaptics(resolvedNativeHaptics);
            }, asChild: Platform.OS !== "web", children: _jsx(Animated.View, { layout: LinearTransition.duration(200), children: generatedChildren }) }) }));
}
function AccordionItem({ children, className, value, ...props }) {
    return (_jsx(AccordionPrimitive.Item, { className: cn("border-border border-b", Platform.select({ web: "last:border-b-0" }), className), value: value, asChild: true, ...props, children: _jsx(Animated.View, { className: "native:overflow-hidden", layout: Platform.select({ native: LinearTransition.duration(200) }), children: children }) }));
}
const Trigger = Platform.OS === "web" ? View : Pressable;
// React Native cannot render a bare string directly inside Pressable/View.
// Keep the compound API ergonomic by normalizing text children at the boundary.
function normalizeAccordionChildren(children) {
    return Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? _jsx(Text, { children: child }) : child);
}
function normalizeAccordionTriggerChildren(children) {
    if (typeof children === "function")
        return children;
    return normalizeAccordionChildren(children);
}
function AccordionTrigger({ className, children, headerProps, onPressIn, onPressOut, ...props }) {
    const { isExpanded } = AccordionPrimitive.useItemContext();
    const [isPressed, setIsPressed] = useState(false);
    const progress = useDerivedValue(() => (isExpanded ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 })), [isExpanded]);
    const chevronStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${progress.value * 180}deg` }],
    }), [progress]);
    return (_jsx(TextClassContext.Provider, { value: cn("text-left text-sm font-medium", isPressed && "underline", Platform.select({ web: "group-hover:underline" })), children: _jsx(AccordionPrimitive.Header, { ...headerProps, children: _jsx(AccordionPrimitive.Trigger, { ...props, asChild: Platform.OS !== "web", onPressIn: (event) => {
                    setIsPressed(true);
                    onPressIn?.(event);
                }, onPressOut: (event) => {
                    setIsPressed(false);
                    onPressOut?.(event);
                }, children: _jsxs(Trigger, { className: cn("active:bg-muted flex-row items-start justify-between gap-4 px-2 py-4 disabled:opacity-50", Platform.select({
                        web: "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 outline-none transition-colors hover:bg-muted hover:underline focus-visible:ring-[3px] disabled:pointer-events-none [&[data-state=open]>svg]:rotate-180",
                    }), className), children: [_jsx(_Fragment, { children: normalizeAccordionTriggerChildren(children) }), _jsx(Animated.View, { style: chevronStyle, children: _jsx(Icon, { as: ChevronDown, size: 16, className: cn("text-muted-foreground shrink-0", Platform.select({
                                    web: "pointer-events-none translate-y-0.5 transition-transform duration-200",
                                })) }) })] }) }) }) }));
}
function AccordionContent({ className, children, ...props }) {
    const { isExpanded } = AccordionPrimitive.useItemContext();
    return (_jsx(TextClassContext.Provider, { value: "text-sm", children: _jsx(AccordionPrimitive.Content, { className: cn("overflow-hidden", Platform.select({
                web: isExpanded ? "animate-accordion-down" : "animate-accordion-up",
            })), ...props, children: _jsx(Animated.View, { exiting: Platform.select({
                    native: FadeOutUp.duration(200).reduceMotion(ReduceMotion.System),
                }), className: cn("px-2 pb-4", className), children: normalizeAccordionChildren(children) }) }) }));
}
const AccordionComponent = Object.assign(Accordion, {
    Content: AccordionContent,
    Item: AccordionItem,
    Root: Accordion,
    Trigger: AccordionTrigger,
});
export { AccordionComponent as Accordion };
