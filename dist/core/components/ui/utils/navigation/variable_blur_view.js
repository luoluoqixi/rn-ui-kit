import { jsx as _jsx } from "react/jsx-runtime";
import { requireNativeViewManager } from "expo-modules-core";
import { StyleSheet, View } from "react-native";
import { os } from "../platform";
const VariableBlurViewFallback = function VariableBlurViewFallback({ style, ...props }) {
    return _jsx(View, { ...props, style: [styles.fallback, style] });
};
function resolveVariableBlurView() {
    if (os() !== "ios") {
        return VariableBlurViewFallback;
    }
    try {
        const nativeViewConfig = globalThis.expo?.getViewConfig?.("NativeIosCommon", "VariableBlurView");
        if (!nativeViewConfig) {
            return VariableBlurViewFallback;
        }
        return requireNativeViewManager("NativeIosCommon", "VariableBlurView");
    }
    catch {
        return VariableBlurViewFallback;
    }
}
export const VariableBlurView = resolveVariableBlurView();
const styles = StyleSheet.create({
    fallback: {
        backgroundColor: "rgba(255,255,255,0.92)",
    },
});
