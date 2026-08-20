import { createElement as _createElement } from "react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, isValidElement } from "react";
import { SizableText, Tabs as TamaguiTabs } from "tamagui";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
const DEFAULT_ACTIVE_STYLE = {
    backgroundColor: "$color3",
    borderColor: undefined,
};
const DEFAULT_HOVER_STYLE = {
    backgroundColor: "$color3",
};
const DEFAULT_PRESS_STYLE = {
    backgroundColor: "$color4",
};
function normalizeTriggerChildren(children) {
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
function TabsRoot(props) {
    const { "aria-label": ariaLabel, children, contentProps, items, listProps, nativeHaptics, tabProps, ...rootProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const resolvedListProps = ariaLabel != null
        ? {
            ...listProps,
            "aria-label": listProps?.["aria-label"] ?? ariaLabel,
        }
        : listProps;
    return (_jsx(TamaguiTabs, { ...rootProps, onValueChange: (nextValue) => {
            rootProps.onValueChange?.(nextValue);
            triggerNativeHaptics(resolvedNativeHaptics);
        }, children: children ??
            (items == null ? null : (_jsxs(_Fragment, { children: [_jsx(TabsList, { ...resolvedListProps, children: items.map((item) => (_createElement(TabsTab, { ...tabProps, "aria-label": resolveAriaLabel(item["aria-label"] ?? tabProps?.["aria-label"], item.label), disabled: item.disabled ?? tabProps?.disabled, key: item.value, value: item.value }, item.label))) }), items.map((item) => (_createElement(TabsContent, { ...contentProps, key: item.value, value: item.value }, item.content)))] }))) }));
}
function TabsList(props) {
    return _jsx(TamaguiTabs.List, { ...props });
}
function TabsTab(props) {
    const { children, activeStyle, hoverStyle, pressStyle, ...tabProps } = props;
    return (_jsx(TamaguiTabs.Tab, { ...tabProps, activeStyle: activeStyle ?? DEFAULT_ACTIVE_STYLE, hoverStyle: hoverStyle ?? DEFAULT_HOVER_STYLE, pressStyle: pressStyle ?? DEFAULT_PRESS_STYLE, children: normalizeTriggerChildren(children) }));
}
function TabsContent(props) {
    return _jsx(TamaguiTabs.Content, { ...props });
}
export const Tabs = Object.assign(TabsRoot, {
    List: TabsList,
    Tab: TabsTab,
    Content: TabsContent,
});
