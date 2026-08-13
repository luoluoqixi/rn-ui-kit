import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Accordion, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function AccordionExample() {
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: "\u5355\u9009\u6A21\u5F0F\u9002\u5408 FAQ\u3001\u8BBE\u7F6E\u5206\u7EC4\u7B49\u4E00\u6B21\u53EA\u5173\u6CE8\u4E00\u9879\u7684\u5185\u5BB9\u3002", title: "\u5355\u9879\u5C55\u5F00", children: _jsx(Accordion, { collapsible: true, items: [
                        {
                            content: _jsx(Text, { children: "Accordion \u9ED8\u8BA4\u751F\u6210 Header\u3001Trigger \u548C Content\u3002" }),
                            title: "基础结构",
                            value: "structure",
                        },
                        {
                            content: (_jsx(Text, { children: "\u901A\u8FC7 items \u53EF\u4EE5\u5FEB\u901F\u751F\u6210\u591A\u4E2A\u6761\u76EE\uFF0C\u4E5F\u80FD\u7EDF\u4E00\u914D\u7F6E Header \u548C Trigger\u3002" })),
                            title: "数据驱动",
                            value: "items",
                        },
                        {
                            content: _jsx(Text, { children: "\u5173\u95ED\u5F53\u524D\u9879\u540E\uFF0C\u9875\u9762\u4F1A\u4FDD\u7559\u5B8C\u6574\u7684\u5217\u8868\u7ED3\u6784\u3002" }),
                            title: "可收起",
                            value: "collapsible",
                        },
                    ], type: "single" }) }), _jsx(ExampleBlock, { description: "\u591A\u9009\u6A21\u5F0F\u5141\u8BB8\u540C\u65F6\u5BF9\u7167\u591A\u4E2A\u8BF4\u660E\u3002", title: "\u591A\u9879\u5C55\u5F00", children: _jsx(Accordion, { items: [
                        { content: _jsx(Text, { children: "\u652F\u6301\u540C\u65F6\u5C55\u5F00\u591A\u4E2A\u9762\u677F\u3002" }), title: "缓存策略", value: "cache" },
                        {
                            content: _jsx(Text, { children: "\u5185\u5BB9\u533A\u57DF\u53EF\u4EE5\u653E\u4EFB\u610F React \u8282\u70B9\u3002" }),
                            title: "同步策略",
                            value: "sync",
                        },
                    ], type: "multiple" }) })] }));
}
