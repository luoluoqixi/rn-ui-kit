import { createElement as _createElement } from "react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs } from "heroui-native/tabs";
import { Text } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import { triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils/haptics";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { useTabsState } from "./tabs_state";
export function TabsHeroUI(props) {
    const { items, className, variant, isDisabled, accessibilityLabel, listProps, triggerProps, contentProps, indicatorProps, keepMounted, isScrollable, nativeHaptics, herouiNativeProps, } = props;
    const [value, setValue] = useTabsState(props);
    const haptics = useResolvedNativeHaptics(nativeHaptics, {
        defaultEnabled: true,
    });
    const font = useDefaultTextStyle();
    const triggers = (_jsxs(_Fragment, { children: [_jsx(Tabs.Indicator, { ...indicatorProps?.herouiNativeProps, className: indicatorProps?.className }), items.map((item) => (_createElement(Tabs.Trigger, { ...triggerProps?.herouiNativeProps, ...item.triggerProps?.herouiNativeProps, value: item.value, key: item.value, isDisabled: isDisabled || item.isDisabled, className: cn(triggerProps?.className, item.triggerProps?.className) },
                _jsx(Tabs.Label, { className: item.titleClassName, style: font, children: resolveRenderProp(item.title, {
                        value: item.value,
                        isSelected: value === item.value,
                        isDisabled: !!(isDisabled || item.isDisabled),
                    }) }))))] }));
    return (_jsxs(Tabs, { ...herouiNativeProps, value: value, onValueChange: (next) => {
            if (isDisabled ||
                items.find((item) => item.value === next)?.isDisabled ||
                next === value)
                return;
            setValue(next);
            triggerNativeHaptics(haptics);
        }, variant: variant, className: className, children: [_jsx(Tabs.List, { ...listProps?.herouiNativeProps, className: listProps?.className, accessibilityLabel: accessibilityLabel, children: isScrollable ? (_jsx(Tabs.ScrollView, { children: triggers })) : (triggers) }), items.map((item) => (_createElement(Tabs.Content, { ...contentProps?.herouiNativeProps, ...item.contentProps?.herouiNativeProps, key: item.value, value: item.value, forceMount: keepMounted || undefined, className: cn("pt-3", keepMounted && value !== item.value && "hidden", contentProps?.className, item.contentProps?.className) }, (() => {
                const content = resolveRenderProp(item.content, {
                    value: item.value,
                    isSelected: value === item.value,
                    isDisabled: !!(isDisabled || item.isDisabled),
                });
                return typeof content === "string" ||
                    typeof content === "number" ? (_jsx(Text, { children: content })) : (content);
            })())))] }));
}
