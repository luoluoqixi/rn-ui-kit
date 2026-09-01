import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ToggleGroup } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const items = [
    { value: "bold", title: "粗体" },
    { value: "italic", title: "斜体" },
    {
        value: "underline",
        title: "下划线",
        itemProps: {
            className: "w-24",
        },
    },
];
const itemsSize = [
    {
        value: "bold",
        title: "粗体",
    },
    {
        value: "italic",
        title: "斜体",
    },
];
export function ToggleGroupExample() {
    const [format, setFormat] = useState([]);
    const [formatSize, setFormatSize] = useState([]);
    const onValueChange = (value) => {
        setFormat(value);
    };
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: `已启用：${format.join("、") || "无"}`, title: "\u6587\u672C\u683C\u5F0F", children: _jsx(ToggleGroup, { type: "multiple", variant: "outline", value: format, onValueChange: onValueChange, className: "self-center", items: items }) }), _jsxs(ExampleBlock, { title: "\u5927\u5C0F", children: [_jsx(ToggleGroup, { size: "2xs", type: "multiple", variant: "outline", value: formatSize, onValueChange: setFormatSize, className: "self-center", items: itemsSize }), _jsx(ToggleGroup, { size: "xs", type: "multiple", variant: "outline", value: formatSize, onValueChange: setFormatSize, className: "self-center", items: itemsSize }), _jsx(ToggleGroup, { size: "sm", type: "multiple", variant: "outline", value: formatSize, onValueChange: setFormatSize, className: "self-center", items: itemsSize }), _jsx(ToggleGroup, { size: "md", type: "multiple", variant: "outline", value: formatSize, onValueChange: setFormatSize, className: "self-center", items: itemsSize }), _jsx(ToggleGroup, { size: "lg", type: "multiple", variant: "outline", value: formatSize, onValueChange: setFormatSize, className: "self-center", items: itemsSize }), _jsx(ToggleGroup, { size: "xl", type: "multiple", variant: "outline", value: formatSize, onValueChange: setFormatSize, className: "self-center", items: itemsSize })] })] }));
}
