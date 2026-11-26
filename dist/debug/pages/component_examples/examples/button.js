import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon, Text } from "rn-ui-kit/core";
import { ArrowDownToLine, Heart, LoaderCircle, Mail, Plus, Trash2 } from "lucide-react-native";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
const variants = [
    { variant: "primary", title: "主要操作" },
    { variant: "secondary", title: "次要操作" },
    { variant: "tertiary", title: "辅助操作" },
    { variant: "outline", title: "描边操作" },
    { variant: "ghost", title: "轻量操作" },
    { variant: "danger", title: "删除内容" },
    { variant: "danger-soft", title: "移除关联" },
];
export function ButtonExample() {
    const [count, setCount] = useState(0);
    const [saving, setSaving] = useState(false);
    const save = () => {
        setSaving(true);
        setTimeout(() => {
            setCount((value) => value + 1);
            setSaving(false);
        }, 700);
    };
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { title: "\u64CD\u4F5C\u5C42\u7EA7", children: [_jsx(ExampleRow, { children: variants.map(({ variant, title }) => (_jsx(Button, { nativeHaptics: true, variant: variant, title: title, onPress: () => setCount((value) => value + 1) }, variant))) }), _jsxs(Text, { className: "text-muted", children: ["\u5DF2\u5B8C\u6210 ", count, " \u6B21\u64CD\u4F5C"] })] }), _jsx(ExampleBlock, { title: "\u4E09\u6863\u5C3A\u5BF8", children: _jsxs(ExampleRow, { children: [_jsx(Button, { nativeHaptics: true, size: "sm", title: "\u5C0F\u6309\u94AE" }), _jsx(Button, { nativeHaptics: true, size: "md", title: "\u4E2D\u6309\u94AE" }), _jsx(Button, { nativeHaptics: true, size: "lg", title: "\u5927\u6309\u94AE" })] }) }), _jsx(ExampleBlock, { title: "\u7981\u7528\u4E0E\u52A0\u8F7D", children: _jsxs(ExampleRow, { children: [_jsx(Button, { nativeHaptics: true, onPress: save, loading: saving, title: saving ? "正在保存…" : "保存更改" }), _jsx(Button, { nativeHaptics: true, loading: true, variant: "secondary", title: "\u6B63\u5728\u540C\u6B65" }), _jsx(Button, { nativeHaptics: true, disabled: true, title: "\u6682\u65E0\u6743\u9650" }), _jsx(Button, { nativeHaptics: true, disabled: true, variant: "danger", title: "\u6682\u4E0D\u53EF\u5220\u9664" }), _jsx(Button, { nativeHaptics: true, loading: true, loadingIcon: _jsx(Icon, { as: LoaderCircle, size: "sm" }), title: "\u81EA\u5B9A\u4E49\u52A0\u8F7D\u56FE\u6807" })] }) }), _jsx(ExampleBlock, { title: "\u56FE\u6807\u4E0E\u6587\u5B57", children: _jsxs(ExampleRow, { children: [_jsxs(Button, { nativeHaptics: true, children: [_jsx(Icon, { as: Plus, size: "sm" }), "\u6DFB\u52A0\u6210\u5458"] }), _jsxs(Button, { nativeHaptics: true, variant: "secondary", children: ["\u4E0B\u8F7D\u6587\u4EF6", _jsx(Icon, { as: ArrowDownToLine, size: "sm" })] }), _jsxs(Button, { nativeHaptics: true, variant: "danger", children: [_jsx(Icon, { as: Trash2, size: "sm" }), _jsx(Text, { children: "\u5220\u9664\u8349\u7A3F" })] })] }) }), _jsx(ExampleBlock, { title: "\u7EAF\u56FE\u6807\u6309\u94AE", children: _jsxs(ExampleRow, { children: [_jsx(Button, { nativeHaptics: true, isIconOnly: true, size: "sm", accessibilityLabel: "\u6253\u5F00\u90AE\u4EF6", children: _jsx(Icon, { as: Mail, size: "sm" }) }), _jsx(Button, { nativeHaptics: true, isIconOnly: true, variant: "secondary", circular: true, accessibilityLabel: "\u6536\u85CF", children: _jsx(Icon, { as: Heart }) }), _jsx(Button, { nativeHaptics: true, isIconOnly: true, size: "lg", variant: "danger", accessibilityLabel: "\u5220\u9664", children: _jsx(Icon, { as: Trash2 }) })] }) }), _jsxs(ExampleBlock, { title: "\u5BBD\u5EA6\u4E0E\u81EA\u5B9A\u4E49\u6837\u5F0F", children: [_jsx(Button, { nativeHaptics: true, className: "w-full", title: "\u5360\u6EE1\u53EF\u7528\u5BBD\u5EA6" }), _jsxs(ExampleRow, { children: [_jsx(Button, { nativeHaptics: true, variant: "outline", buttonSize: { width: 160 }, title: "\u6307\u5B9A\u5BBD\u5EA6" }), _jsx(Button, { nativeHaptics: true, variant: "ghost", buttonColor: "#16a34a", textClassName: "font-bold", title: "\u81EA\u5B9A\u4E49\u6587\u5B57" })] })] }), _jsxs(ExampleBlock, { title: "\u7CFB\u7EDF\u539F\u751F\u6309\u94AE", children: [_jsx(Text, { className: "text-muted", children: "iOS \u4F7F\u7528 SwiftUI\uFF0CAndroid \u4F7F\u7528 Compose\uFF1BWeb \u56DE\u9000\u4E3A\u901A\u7528\u6309\u94AE\u3002" }), _jsxs(ExampleRow, { children: [_jsx(Button, { native: true, nativeHaptics: true, title: "Native Button" }), _jsx(Button, { native: true, nativeHaptics: true, nativeButtonStyle: "glass", buttonSize: { width: 150, height: 80 }, title: "Native Button Size" }), _jsx(Button, { native: true, nativeHaptics: true, nativeButtonStyle: "glassProminent", nativeSystemImage: "heart.fill", accessibilityLabel: "\u7CFB\u7EDF\u6536\u85CF", title: "\u6536\u85CF" })] })] })] }));
}
