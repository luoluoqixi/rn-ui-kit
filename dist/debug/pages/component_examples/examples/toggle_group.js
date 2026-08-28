import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { ToggleGroup } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function ToggleGroupExample() {
    const [format, setFormat] = useState([]);
    const onValueChange = (value) => {
        setFormat(value);
    };
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `已启用：${format.join("、") || "无"}`, title: "\u6587\u672C\u683C\u5F0F", children: _jsx(ToggleGroup, { type: "multiple", variant: "outline", value: format, onValueChange: onValueChange, className: "self-center", items: [
                    { value: "bold", title: "粗体" },
                    { value: "italic", title: "斜体" },
                    {
                        value: "underline",
                        title: "下划线",
                        itemProps: {
                            className: "w-20",
                        },
                    },
                ] }) }) }));
}
