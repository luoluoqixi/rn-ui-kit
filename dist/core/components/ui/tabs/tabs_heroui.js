import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { Tabs } from "@heroui/react/tabs";
import { Text } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import { textWebStyle } from "../text/text_style_web";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { useTabsState } from "./tabs_state";
export function TabsHeroUI(props) {
    const { items, className, variant, isDisabled, accessibilityLabel = "选项卡", listProps, triggerProps, contentProps, indicatorProps, keepMounted, isScrollable, herouiWebProps, } = props;
    const [value, setValue] = useTabsState(props);
    const font = useDefaultTextStyle();
    return (_jsxs(Tabs, { ...herouiWebProps, selectedKey: value, onSelectionChange: (key) => setValue(String(key)), isDisabled: isDisabled, variant: variant, className: className, children: [_jsx(Tabs.ListContainer, { className: cn(isScrollable && "max-w-full overflow-x-auto"), children: _jsx(Tabs.List, { ...listProps?.herouiWebProps, className: listProps?.className, "aria-label": accessibilityLabel, children: items.map((item) => {
                        const trigger = {
                            ...triggerProps?.herouiWebProps,
                            ...item.triggerProps?.herouiWebProps,
                        };
                        const context = {
                            value: item.value,
                            isSelected: value === item.value,
                            isDisabled: !!(isDisabled || item.isDisabled),
                        };
                        const webStyle = trigger.style;
                        return (_createElement(Tabs.Tab, { ...trigger, key: item.value, id: item.value, isDisabled: context.isDisabled, className: cn(triggerProps?.className, item.triggerProps?.className), style: typeof webStyle === "function"
                                ? (state) => ({ ...textWebStyle(font), ...webStyle(state) })
                                : { ...textWebStyle(font), ...webStyle } },
                            _jsx(Text, { className: cn("text-inherit text-sm font-medium leading-none", item.titleClassName), children: resolveRenderProp(item.title, context) }),
                            _jsx(Tabs.Indicator, { ...indicatorProps?.herouiWebProps, className: indicatorProps?.className })));
                    }) }) }), items.map((item) => (_createElement(Tabs.Panel, { ...contentProps?.herouiWebProps, ...item.contentProps?.herouiWebProps, key: item.value, id: item.value, shouldForceMount: keepMounted, className: cn("pt-3", keepMounted && value !== item.value && "hidden", contentProps?.className, item.contentProps?.className) }, resolveRenderProp(item.content, {
                value: item.value,
                isSelected: value === item.value,
                isDisabled: !!(isDisabled || item.isDisabled),
            }))))] }));
}
