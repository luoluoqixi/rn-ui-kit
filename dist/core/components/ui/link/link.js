import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { Linking } from "react-native";
import { Button } from "../button";
export const DEFAULT_LINK_PRESS_STYLE = { opacity: 0.5 };
export const DEFAULT_LINK_FOCUS_VISIBLE_STYLE = {};
/** Link uses the RNR Button link variant so native and web share the same button semantics. */
export const Link = forwardRef(function Link({ children, href, nativeHaptics, onPress, pressStyle, style, ...props }, ref) {
    return (_jsx(Button, { ...props, accessibilityRole: "link", nativeHaptics: nativeHaptics, onPress: (event) => {
            onPress?.(event);
            if (event.defaultPrevented)
                return;
            if (href != null)
                void Linking.openURL(href);
        }, ref: ref, style: ({ pressed }) => [style, pressed ? (pressStyle ?? DEFAULT_LINK_PRESS_STYLE) : null], variant: "link", children: children }));
});
