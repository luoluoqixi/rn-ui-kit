import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Accordion as HeroUIAccordion } from "heroui-native/accordion";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { View } from "react-native";
import { resolveAriaLabel } from "../utils/accessibility";
import { cn } from "../utils/cn";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import { resolveRenderProp } from "../utils/render";
import { AccordionText } from "./accordion_text";
import { useAccordionState, validateAccordionItems } from "./use_accordion_state";
export function AccordionHeroUI(props) {
    const state = useAccordionState(props);
    const { items, titleClassName, contentClassName, itemProps, headerProps, triggerProps, contentProps, indicator, nativeHaptics, selectionMode, value, defaultValue, onValueChange, isCollapsible = true, isDisabled, children, herouiNativeProps, herouiWebProps, ...rootProps } = props;
    const haptics = useResolvedNativeHaptics(nativeHaptics);
    // The official default demo composes feedback explicitly; Trigger alone has none.
    const withPressFeedback = (props.variant ?? "default") === "default";
    validateAccordionItems(items);
    function handleChange(next) {
        if (state.onValueChange(next))
            triggerNativeHaptics(haptics);
    }
    // HeroUI treats undefined as uncontrolled; an empty string keeps a closed single
    // accordion controlled. Item keys are validated to reserve this sentinel.
    const selection = state.isMultiple
        ? { selectionMode: "multiple", value: state.values, onValueChange: handleChange }
        : {
            selectionMode: "single",
            value: state.values[0] ?? "",
            onValueChange: handleChange,
        };
    return (_jsx(HeroUIAccordion, { ...herouiNativeProps, ...rootProps, ...selection, isDisabled: isDisabled || undefined, isCollapsible: isCollapsible, children: items.map((item) => {
            const title = resolveRenderProp(item.title, item);
            const itemDisabled = isDisabled ||
                (item.isDisabled ?? item.itemProps?.isDisabled ?? itemProps?.isDisabled) ||
                (item.triggerProps?.isDisabled ?? triggerProps?.isDisabled);
            const indicatorProp = item.indicator !== undefined ? item.indicator : indicator;
            const customIndicator = resolveRenderProp(indicatorProp, {
                item,
                isExpanded: state.values.includes(item.value),
                isDisabled: Boolean(itemDisabled),
            });
            const titleContent = (_jsx(AccordionText, { className: cn("text-base text-foreground font-medium", titleClassName, item.titleClassName), children: title }));
            const indicatorContent = indicatorProp === undefined ? (_jsx(HeroUIAccordion.Indicator, {})) : customIndicator != null && typeof customIndicator !== "boolean" ? (_jsx(HeroUIAccordion.Indicator, { children: _jsx(View, { className: "size-5 items-center justify-center", accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants", children: _jsx(AccordionText, { className: "text-muted", children: customIndicator }) }) })) : null;
            const trigger = (_jsx(HeroUIAccordion.Trigger, { ...triggerProps?.herouiNativeProps, ...item.triggerProps?.herouiNativeProps, asChild: withPressFeedback, onPress: item.triggerProps?.onPress ?? triggerProps?.onPress, isDisabled: itemDisabled, className: cn(itemDisabled && "opacity-[var(--disabled-opacity)]", triggerProps?.className, item.triggerProps?.className), "aria-label": resolveAriaLabel(item["aria-label"] ??
                    item.triggerProps?.["aria-label"] ??
                    triggerProps?.["aria-label"], title), children: withPressFeedback ? (_jsxs(PressableFeedback, { isDisabled: Boolean(itemDisabled), animation: { scale: false }, children: [_jsx(PressableFeedback.Scale, { className: "min-w-0 flex-1", children: titleContent }), indicatorContent, _jsx(PressableFeedback.Highlight, { animation: { opacity: { value: [0, 0.05] } } })] })) : (_jsxs(_Fragment, { children: [_jsx(View, { className: "min-w-0 flex-1", children: titleContent }), indicatorContent] })) }));
            return (_createElement(HeroUIAccordion.Item, { ...itemProps?.herouiNativeProps, ...item.itemProps?.herouiNativeProps, key: item.value, value: item.value, isDisabled: itemDisabled, className: cn(itemProps?.className, item.itemProps?.className) },
                headerProps || item.headerProps ? (_jsx(View, { ...headerProps?.herouiNativeProps, ...item.headerProps?.herouiNativeProps, className: cn(headerProps?.className, item.headerProps?.className), children: trigger })) : (trigger),
                _jsx(HeroUIAccordion.Content, { ...contentProps?.herouiNativeProps, ...item.contentProps?.herouiNativeProps, className: cn(contentProps?.className, contentClassName, item.contentProps?.className, item.contentClassName), children: _jsx(AccordionText, { className: "text-base text-muted", children: resolveRenderProp(item.content, item) }) })));
        }) }));
}
