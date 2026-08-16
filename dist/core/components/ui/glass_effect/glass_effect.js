import { jsx as _jsx } from "react/jsx-runtime";
import { GlassContainer as ExpoGlassContainer, GlassView as ExpoGlassView, } from "expo-glass-effect";
import { forwardRef } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useKeyboardAnimation } from "../utils/keyboard";
const AnimatedExpoGlassView = Animated.createAnimatedComponent(ExpoGlassView);
function KeyboardAvoidingGlassEffect({ forwardedRef, keyboardAvoidance, ...props }) {
    const insets = useSafeAreaInsets();
    const { height } = useKeyboardAnimation();
    const config = typeof keyboardAvoidance === "object" ? keyboardAvoidance : undefined;
    const enabled = keyboardAvoidance === true || config?.enabled !== false;
    const offset = config?.offset ?? 0;
    const safeAreaInset = config?.subtractSafeAreaInset === false ? 0 : insets.bottom;
    const keyboardStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: enabled ? -Math.max(height.value - safeAreaInset + offset, 0) : 0,
            },
        ],
    }), [enabled, offset, safeAreaInset]);
    return (_jsx(AnimatedExpoGlassView, { ...props, ref: forwardedRef, style: [props.style, keyboardStyle] }));
}
const GlassEffectRoot = forwardRef(function GlassEffectRoot({ keyboardAvoidance, ...props }, forwardedRef) {
    if (keyboardAvoidance != null && keyboardAvoidance !== false) {
        return (_jsx(KeyboardAvoidingGlassEffect, { ...props, forwardedRef: forwardedRef, keyboardAvoidance: keyboardAvoidance }));
    }
    return _jsx(ExpoGlassView, { ...props, ref: forwardedRef });
});
export const GlassEffectContainer = forwardRef(function GlassEffectContainer(props, forwardedRef) {
    return _jsx(ExpoGlassContainer, { ...props, ref: forwardedRef });
});
/**
 * iOS 26+ 使用系统原生 Liquid Glass；其他平台由 expo-glass-effect 降级为普通 View。
 *
 * 默认不附加布局或定位语义；启用 `keyboardAvoidance` 后会在 UI 线程跟随键盘位移。
 * 其余 GlassView props、style 与 children 均原样透传。
 */
export const GlassEffect = Object.assign(GlassEffectRoot, {
    Container: GlassEffectContainer,
});
