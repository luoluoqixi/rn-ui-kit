import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../../core/components/ui";
import { componentExampleDefinitions } from "../component_examples/catalog";
import { ExampleStack } from "../component_examples/shared";
// 总览与独立组件示例共用实现，避免旧 Tamagui API 在总览中继续漂移。
const GROUP_ORDER = [
    "动作与反馈",
    "输入与表单",
    "组合与布局",
    "浮层与菜单",
    "列表与滚动",
    "内容展示",
];
const GROUP_DESCRIPTION = {
    动作与反馈: "按钮、状态切换、进度反馈和原生交互。",
    输入与表单: "输入、选择、标签和表单控件。",
    组合与布局: "组合控件、布局容器和系统视觉效果。",
    浮层与菜单: "弹窗、菜单、提示和底部面板。",
    列表与滚动: "NativeList 及滚动容器的完整示例。",
    内容展示: "文本、卡片、链接和基础展示组件。",
};
function ExampleEntry({ definition }) {
    const Example = definition.Component;
    return (_jsxs(View, { style: definition.layout === "fill" ? styles.fillEntry : undefined, children: [_jsx(Text, { className: "mb-2 font-semibold", children: definition.label }), _jsx(Example, {})] }));
}
export function RnUiKitUiComponentsDebugPage({ header, }) {
    const groups = useMemo(() => {
        const grouped = new Map();
        for (const definition of componentExampleDefinitions) {
            const entries = grouped.get(definition.group) ?? [];
            entries.push(definition);
            grouped.set(definition.group, entries);
        }
        return grouped;
    }, []);
    return (_jsxs(View, { style: styles.root, children: [header, GROUP_ORDER.map((group) => {
                const definitions = groups.get(group) ?? [];
                if (definitions.length === 0)
                    return null;
                return (_jsxs(View, { style: styles.group, children: [_jsx(Text, { className: "text-xl font-semibold", children: group }), _jsx(Text, { className: "text-muted-foreground text-sm", children: GROUP_DESCRIPTION[group] }), _jsx(ExampleStack, { children: definitions.map((definition) => (_jsx(ExampleEntry, { definition: definition }, definition.key))) })] }, group));
            }), _jsx(Text, { className: "text-muted-foreground text-center text-xs", children: "\u7EC4\u4EF6\u603B\u89C8\u4E0E\u7EC4\u4EF6\u793A\u4F8B\u4F7F\u7528\u76F8\u540C\u7684\u5B9E\u73B0\u548C\u4EA4\u4E92\u903B\u8F91\u3002" })] }));
}
const styles = StyleSheet.create({
    root: {
        gap: 16,
        padding: 16,
        paddingBottom: 48,
    },
    group: {
        gap: 8,
    },
    fillEntry: {
        minHeight: 420,
    },
});
