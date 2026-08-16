import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { View } from "react-native";
const GlassEffectRoot = forwardRef(function GlassEffectRoot({ keyboardAvoidance: _keyboardAvoidance, ...props }, forwardedRef) {
    return _jsx(View, { ...props, ref: forwardedRef });
});
export const GlassEffectContainer = forwardRef(function GlassEffectContainer(props, forwardedRef) {
    return _jsx(View, { ...props, ref: forwardedRef });
});
/** Web fallback for Liquid Glass. */
export const GlassEffect = Object.assign(GlassEffectRoot, {
    Container: GlassEffectContainer,
});
