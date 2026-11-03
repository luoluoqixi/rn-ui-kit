import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";
export function LinkExample() {
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { title: "Link", children: _jsxs(ExampleRow, { style: { gap: 0 }, children: [_jsx(Link, { href: "https://reactnative.dev", children: "React Native" }), _jsx(Link, { href: "https://uniwind.dev", children: "Uniwind" }), _jsx(Link, { nativeHaptics: true, children: "\u70B9\u51FB\u9707\u52A8" })] }) }) }));
}
