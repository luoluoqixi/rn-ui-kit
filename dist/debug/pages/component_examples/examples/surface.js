import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Surface, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function SurfaceExample() {
    return _jsx(ExampleStack, { children: _jsx(ExampleSection, { title: "\u8868\u9762\u5C42\u7EA7", description: "\u6309\u5185\u5BB9\u5C42\u7EA7\u9009\u7528\u80CC\u666F\uFF1BSurface \u4E0D\u8D1F\u8D23\u6807\u9898\u6216\u9875\u811A\u7ED3\u6784\u3002", children: [{ variant: "default", title: "基础表面", text: "用于主要内容区域。" }, { variant: "secondary", title: "次级表面", text: "用于嵌套或辅助区域。" }, { variant: "tertiary", title: "第三级表面", text: "进一步区分内容层级。" }, { variant: "transparent", title: "透明表面", text: "透出父容器的背景。" }].map(item => _jsxs(Surface, { variant: item.variant, className: "gap-2 rounded-xl p-4", children: [_jsx(Text, { weight: "medium", children: item.title }), _jsx(Text, { color: "muted", children: item.text })] }, item.variant)) }) });
}
