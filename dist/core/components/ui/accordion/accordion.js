import { createElement as _createElement } from "react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from "@tamagui/lucide-icons-2";
import { Children, isValidElement } from "react";
import { SizableText, Square, Accordion as TamaguiAccordion, YStack } from "tamagui";
import { isWeb } from "../utils/platform";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
const AccordionPrimitive = TamaguiAccordion;
const SHOULD_PREMEASURE_NATIVE_CONTENT = !isWeb();
const DEFAULT_TRIGGER_HOVER_STYLE = {
    background: "$color3",
};
function normalizeAccordionChildren(children) {
    return Children.map(children, (child) => {
        if (typeof child === "string" || typeof child === "number") {
            return _jsx(SizableText, { children: child });
        }
        if (isValidElement(child)) {
            return child;
        }
        return child;
    });
}
function AccordionRoot(props) {
    if (props.type === "multiple") {
        return _jsx(AccordionMultipleRoot, { ...props });
    }
    return _jsx(AccordionSingleRoot, { ...props });
}
function getItemsContent(children, items, itemProps, headerProps, triggerProps, contentProps) {
    return (children ??
        items?.map((item, index) => {
            const isLast = index === items.length - 1;
            const triggerElement = (_jsx(AccordionTrigger, { ...triggerProps, "aria-label": resolveAriaLabel(item["aria-label"] ?? triggerProps?.["aria-label"], item.title), borderColor: triggerProps?.borderColor ?? "$borderColor", borderWidth: triggerProps?.borderWidth ?? 1, flexDirection: triggerProps?.flexDirection ?? "row", justify: "space-between", width: triggerProps?.width ?? "100%", children: ({ open }) => (_jsxs(_Fragment, { children: [_jsx(SizableText, { children: item.title }), _jsx(Square, { rotate: open ? "180deg" : "0deg", transparent: true, transition: "quick", children: _jsx(ChevronDown, { color: "$color", size: "$1" }) })] })) }));
            return (_createElement(AccordionItem, { ...itemProps, disabled: item.disabled ?? itemProps?.disabled, key: item.value, mb: isLast ? 0 : -1, width: itemProps?.width ?? "100%", value: item.value },
                isWeb() ? (_jsx(AccordionHeader, { ...headerProps, width: headerProps?.width ?? "100%", children: triggerElement })) : (_jsx(YStack, { width: headerProps?.width ?? "100%", children: triggerElement })),
                _jsx(AccordionHeightAnimator, { overflow: "hidden", transition: "300ms", children: _jsx(AccordionContent, { ...contentProps, borderColor: contentProps?.borderColor ?? "$borderColor", borderWidth: contentProps?.borderWidth ?? 1, borderTopWidth: contentProps?.borderTopWidth ?? 0, enterStyle: contentProps?.enterStyle ?? { opacity: 0, y: -8 }, exitStyle: contentProps?.exitStyle ?? { opacity: 0 }, forceMount: contentProps?.forceMount ?? SHOULD_PREMEASURE_NATIVE_CONTENT, transition: contentProps?.transition ?? "300ms", width: contentProps?.width ?? "100%", children: item.content }) })));
        }));
}
function AccordionSingleRoot(props) {
    const { children, contentProps, headerProps, itemProps, items, nativeHaptics, triggerProps, ...rootProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const handleValueChange = rootProps.onValueChange;
    return (_jsx(AccordionPrimitive, { onValueChange: (nextValue) => {
            handleValueChange?.(nextValue);
            triggerNativeHaptics(resolvedNativeHaptics);
        }, ...rootProps, collapsible: rootProps.collapsible ?? true, type: "single", width: rootProps.width ?? "100%", children: getItemsContent(children, items, itemProps, headerProps, triggerProps, contentProps) }));
}
function AccordionMultipleRoot(props) {
    const { children, contentProps, headerProps, itemProps, items, nativeHaptics, triggerProps, ...rootProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const handleValueChange = rootProps.onValueChange;
    return (_jsx(AccordionPrimitive, { onValueChange: (nextValue) => {
            handleValueChange?.(nextValue);
            triggerNativeHaptics(resolvedNativeHaptics);
        }, ...rootProps, type: "multiple", width: rootProps.width ?? "100%", children: getItemsContent(children, items, itemProps, headerProps, triggerProps, contentProps) }));
}
function AccordionTrigger(props) {
    const { children, hoverStyle, ...triggerProps } = props;
    const triggerChildren = typeof children === "function" ? children : normalizeAccordionChildren(children);
    return (_jsx(TamaguiAccordion.Trigger, { ...triggerProps, hoverStyle: hoverStyle ?? DEFAULT_TRIGGER_HOVER_STYLE, children: triggerChildren }));
}
function AccordionHeader(props) {
    if (!isWeb()) {
        return _jsx(YStack, { ...props });
    }
    return _jsx(TamaguiAccordion.Header, { ...props });
}
function AccordionContent(props) {
    return _jsx(TamaguiAccordion.Content, { ...props });
}
function AccordionHeightAnimator(props) {
    return _jsx(TamaguiAccordion.HeightAnimator, { ...props });
}
function AccordionItem(props) {
    return _jsx(TamaguiAccordion.Item, { ...props });
}
export const Accordion = Object.assign(AccordionRoot, {
    Trigger: AccordionTrigger,
    Header: AccordionHeader,
    Content: AccordionContent,
    HeightAnimator: AccordionHeightAnimator,
    Item: AccordionItem,
});
