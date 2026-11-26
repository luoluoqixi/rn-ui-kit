import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { StyleSheet, Text as RNText, TextInput as RNTextInput } from "react-native";
import { defaultFontStyle } from "./font_style";
const TextFontContext = React.createContext(undefined);
export function TextFontProvider({ family, children, }) {
    return (_jsx(TextFontContext.Provider, { value: family, children: children }));
}
export function useTextFontFamily() {
    return React.useContext(TextFontContext);
}
export function useDefaultTextStyle(style, className) {
    // Web 文字 primitive 可能直接渲染 DOM，必须展开 RN 样式数组。
    return StyleSheet.flatten([defaultFontStyle(useTextFontFamily(), className), style]);
}
export const FontText = React.forwardRef(function FontText(props, ref) {
    const family = useTextFontFamily();
    return (_jsx(RNText, { ...props, ref: ref, style: [defaultFontStyle(family, props.className), props.style] }));
});
export const FontTextInput = React.forwardRef(function FontTextInput(props, ref) {
    const family = useTextFontFamily();
    return (_jsx(RNTextInput, { ...props, ref: ref, style: [defaultFontStyle(family, props.className), props.style] }));
});
