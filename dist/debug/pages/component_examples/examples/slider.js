import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Slider, isWeb } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function SliderExample() {
    const [value, setValue] = useState(42);
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: `字号：${value}px`, title: "\u53EF\u62D6\u62FD\u6570\u503C", children: [_jsx(Slider, { max: 72, min: 12, onValueChange: (next) => setValue(next[0] ?? 12), step: 1, value: [value] }), !isWeb() && (_jsx(Slider, { style: {
                        marginVertical: 15,
                    }, native: false, max: 72, min: 12, onValueChange: (next) => setValue(next[0] ?? 12), step: 1, value: [value] })), _jsxs(ExampleRow, { children: [_jsx(Button, { onPress: () => setValue(12), size: "$3", variant: "outlined", children: "\u6700\u5C0F" }), _jsx(Button, { onPress: () => setValue(42), size: "$3", variant: "outlined", children: "\u9ED8\u8BA4" }), _jsx(Button, { onPress: () => setValue(72), size: "$3", variant: "outlined", children: "\u6700\u5927" })] })] }) }));
}
