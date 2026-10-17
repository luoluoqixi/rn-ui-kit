import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { View } from "react-native";
import { BrightnessSlider, ColorPicker, HueCircular, HueSlider, OpacitySlider, Panel1, Panel2, Panel3, Preview, PreviewText, SaturationSlider, Swatches, } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
const SWATCHES = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
];
export function ColorPickerExample() {
    const [color, setColor] = useState("#3b82f6");
    return (_jsxs(ExampleStack, { children: [_jsx(ExampleBlock, { description: `当前颜色：${color}`, title: "ColorPicker", children: _jsxs(ColorPicker, { value: color, onChangeJS: ({ hex }) => setColor(hex), onCompleteJS: ({ hex }) => setColor(hex), style: { gap: 14, width: "100%" }, children: [_jsx(Preview, { style: { height: 48, width: "100%" } }), _jsx(Panel1, { style: { height: 260, width: "100%" } }), _jsx(HueSlider, {}), _jsx(BrightnessSlider, {}), _jsx(OpacitySlider, {}), _jsx(PreviewText, { colorFormat: "hex" }), _jsx(Swatches, { colors: SWATCHES, style: { gap: 8 }, swatchStyle: { height: 30, width: 30 } })] }) }), _jsx(ExampleBlock, { title: "\u4E0D\u540C\u5E03\u5C40", children: _jsx(View, { style: { gap: 12 }, children: _jsxs(ColorPicker, { style: { gap: 14 }, value: color, onChangeJS: ({ hex }) => setColor(hex), children: [_jsx(Panel1, { style: { height: 180, width: "100%" } }), _jsx(HueSlider, {}), _jsx(PreviewText, { colorFormat: "rgb" })] }) }) }), _jsx(ExampleBlock, { description: "Panel2 \u9002\u5408\u4EE5\u8272\u76F8\u548C\u660E\u5EA6\u4E3A\u4E3B\u7684\u7D27\u51D1\u5E03\u5C40\u3002", title: "Panel2", children: _jsxs(ColorPicker, { value: color, onChangeJS: ({ hex }) => setColor(hex), style: { gap: 16 }, thumbShape: "ring", thumbSize: 28, children: [_jsx(Panel2, { style: { height: 220, width: "100%" } }), _jsx(HueSlider, {}), _jsx(PreviewText, { colorFormat: "hsl" })] }) }), _jsx(ExampleBlock, { description: "Panel3 \u4E0E\u72EC\u7ACB\u901A\u9053\u6ED1\u5757\u53EF\u4EE5\u7EC4\u5408\u6210\u66F4\u5B8C\u6574\u7684\u7F16\u8F91\u5668\u3002", title: "\u591A\u901A\u9053\u7EC4\u5408", children: _jsxs(ColorPicker, { sliderThickness: 24, style: { gap: 16 }, thumbSize: 24, value: color, onChangeJS: ({ hex }) => setColor(hex), children: [_jsx(Panel3, { style: { height: 220, width: "100%" } }), _jsx(HueSlider, {}), _jsx(SaturationSlider, {}), _jsx(BrightnessSlider, {}), _jsx(PreviewText, { colorFormat: "hsva" })] }) }), _jsx(ExampleBlock, { description: "\u73AF\u5F62\u8272\u76F8\u9009\u62E9\u5668\u9002\u5408\u7A84\u5C4F\u6216\u6A2A\u5411\u5DE5\u5177\u680F\u3002", title: "HueCircular", children: _jsxs(ColorPicker, { style: { gap: 16 }, value: color, onChangeJS: ({ hex }) => setColor(hex), children: [_jsx(View, { style: { alignItems: "center" }, children: _jsx(HueCircular, { style: { height: 220, width: 220 } }) }), _jsx(Panel1, { style: { height: 160, width: "100%" } }), _jsx(PreviewText, { colorFormat: "hex" })] }) })] }));
}
