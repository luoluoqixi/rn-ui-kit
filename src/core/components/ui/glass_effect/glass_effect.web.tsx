import { forwardRef } from "react";
import { View } from "react-native";

import type { GlassEffectContainerProps, GlassEffectProps } from "./types";

const GlassEffectRoot = forwardRef<View, GlassEffectProps>(
  function GlassEffectRoot({ keyboardAvoidance: _keyboardAvoidance, ...props }, forwardedRef) {
    return <View {...props} ref={forwardedRef} />;
  },
);

export const GlassEffectContainer = forwardRef<View, GlassEffectContainerProps>(
  function GlassEffectContainer(props, forwardedRef) {
    return <View {...props} ref={forwardedRef} />;
  },
);

/** Web fallback for Liquid Glass. */
export const GlassEffect = Object.assign(GlassEffectRoot, {
  Container: GlassEffectContainer,
});
