import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { Text } from "../../../core/components/ui";
import { componentExampleDefinitions } from "../component_examples/catalog";
import { ComponentExampleEmbeddedProvider } from "../component_examples/presentation_context";
import { ExampleStack } from "../component_examples/shared";
function ExampleEntry({ definition }) {
    const Example = definition.Component;
    return (_jsxs(View, { style: definition.layout === "fill" ? styles.fillEntry : undefined, children: [_jsx(Text, { className: "mb-2 font-semibold", children: definition.label }), _jsx(Example, {})] }));
}
export function RnUiKitUiComponentsDebugPage({ header }) {
    return (_jsx(ComponentExampleEmbeddedProvider, { children: _jsxs(View, { style: styles.root, children: [header, _jsx(ExampleStack, { children: componentExampleDefinitions.map((definition) => (_jsx(ExampleEntry, { definition: definition }, definition.key))) }), _jsx(Text, { className: "text-muted-foreground text-center text-xs", children: "\u7EC4\u4EF6\u603B\u89C8\u4E0E\u7EC4\u4EF6\u793A\u4F8B\u4F7F\u7528\u76F8\u540C\u7684\u5B9E\u73B0\u548C\u4EA4\u4E92\u903B\u8F91\u3002" })] }) }));
}
const styles = StyleSheet.create({
    root: {
        gap: 16,
        padding: 16,
        paddingBottom: 48,
    },
    fillEntry: {
        minHeight: 420,
    },
});
