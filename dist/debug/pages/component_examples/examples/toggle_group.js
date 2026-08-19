import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ToggleGroup } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function ToggleGroupExample() {
    const [mode, setMode] = useState("preview");
    const [format, setFormat] = useState(["bold"]);
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: `当前视图：${mode}`, title: "\u5355\u9009\u6A21\u5F0F", children: _jsx(ToggleGroup, { items: [
                        { label: "编辑", value: "edit" },
                        { label: "预览", value: "preview" },
                        { label: "源码", value: "source" },
                    ], onValueChange: setMode, type: "single", value: mode }) }), _jsx(ExampleBlock, { description: `已启用：${format.join("、") || "无"}`, title: "\u591A\u9009\u683C\u5F0F", children: _jsx(ToggleGroup, { items: [
                        { label: "粗体", value: "bold" },
                        { label: "斜体", value: "italic" },
                    ], onValueChange: setFormat, type: "multiple", value: format }) })] }));
}
