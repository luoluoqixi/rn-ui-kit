import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Collapsible, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function CollapsibleExample() {
    const [open, setOpen] = useState(false);
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: open ? "详细信息已展开。" : "详细信息已收起。", title: "\u6784\u5EFA\u8BE6\u60C5", children: _jsx(Collapsible, { nativeHaptics: true, content: _jsx(Text, { className: "pt-3", children: "\u6784\u5EFA\u5305\u542B 32 \u4E2A\u9875\u9762\u30014 \u4E2A\u5E73\u53F0\u76EE\u6807\u548C 0 \u4E2A\u7C7B\u578B\u9519\u8BEF\u3002" }), onOpenChange: setOpen, open: open, title: ({ open: isOpen }) => (isOpen ? "收起详情" : "展开详情") }) }) }));
}
