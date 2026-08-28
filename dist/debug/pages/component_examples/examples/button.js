import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon, Text } from "rn-ui-kit/core";
import { LoaderCircle, Mail } from "lucide-react-native";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function ButtonExample() {
    const [count, setCount] = useState(0);
    const [saving, setSaving] = useState(false);
    const [nativeHaptics, setNativeHaptics] = useState(true);
    const save = () => {
        setSaving(true);
        setTimeout(() => {
            setCount((current) => current + 1);
            setSaving(false);
        }, 700);
    };
    return (_jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { title: "\u4FDD\u5B58\u5DE5\u4F5C\u533A", children: [_jsxs(ExampleRow, { children: [_jsx(Button, { nativeHaptics: nativeHaptics, onPress: save, loading: saving, children: saving ? "正在保存..." : "保存更改" }), _jsx(Button, { nativeHaptics: nativeHaptics, disabled: saving, onPress: () => setCount(0), variant: "outline", children: "\u91CD\u7F6E" }), _jsx(Button, { nativeHaptics: nativeHaptics, onPress: () => setCount((current) => current + 1), variant: "ghost", children: "\u4EC5\u66F4\u65B0" })] }), _jsxs(Text, { className: "text-muted-foreground", children: ["\u5DF2\u5B8C\u6210 ", count, " \u6B21\u4FDD\u5B58"] })] }), _jsx(ExampleBlock, { title: "\u64CD\u4F5C\u5C42\u7EA7", children: _jsxs(ExampleRow, { children: [_jsx(Button, { nativeHaptics: true, children: "\u786E\u8BA4" }), _jsx(Button, { nativeHaptics: nativeHaptics, variant: "destructive", children: "\u5220\u9664" }), _jsx(Button, { nativeHaptics: nativeHaptics, variant: "outline", children: "\u6B21\u8981\u64CD\u4F5C" }), _jsx(Button, { nativeHaptics: nativeHaptics, variant: "secondary", children: "\u8F85\u52A9\u64CD\u4F5C" }), _jsx(Button, { disabled: true, children: "\u4E0D\u53EF\u7528" }), _jsx(Button, { variant: "destructive", disabled: true, children: "\u4E0D\u53EF\u7528" })] }) }), _jsx(ExampleBlock, { title: "\u6269\u5C55\u72B6\u6001", children: _jsxs(ExampleRow, { children: [_jsx(Button, { loading: true, title: "\u8BF7\u7A0D\u5019" }), _jsx(Button, { loading: true, loadingIcon: _jsx(Icon, { as: LoaderCircle, className: "size-4 text-primary-foreground" }), title: "\u81EA\u5B9A\u4E49\u52A0\u8F7D\u56FE\u6807" }), _jsxs(Button, { nativeHaptics: nativeHaptics, children: [_jsx(Icon, { as: Mail, className: "text-primary-foreground" }), _jsx(Text, { children: "\u90AE\u4EF6\u767B\u5F55" })] }), _jsx(Button, { nativeHaptics: nativeHaptics, "aria-label": "\u6253\u5F00\u90AE\u4EF6", size: "icon", children: _jsx(Icon, { as: Mail, className: "text-primary-foreground" }) }), _jsx(Button, { nativeHaptics: nativeHaptics, title: "Button Link", variant: "link" }), _jsx(Button, { nativeHaptics: nativeHaptics, native: true, children: "Native Button" }), _jsx(Button, { native: true, nativeHaptics: nativeHaptics, nativeButtonStyle: "glass", buttonSize: {
                                width: 150,
                                height: 80,
                            }, children: "Native Button Size" })] }) })] }));
}
