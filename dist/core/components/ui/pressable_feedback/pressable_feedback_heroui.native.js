import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
export function PressableFeedbackHeroUI(p) {
    const haptics = useResolvedNativeHaptics(p.nativeHaptics, { defaultEnabled: true });
    return _jsxs(PressableFeedback, { ...p.herouiNativeProps, className: p.className, isDisabled: p.isDisabled, accessibilityRole: "button", accessibilityLabel: p.accessibilityLabel, animation: p.isAnimationDisabled ? "disable-all" : undefined, onPress: () => { if (!p.isDisabled) {
            triggerNativeHaptics(haptics);
            p.onPress?.();
        } }, children: [p.children, p.feedback === "highlight" && _jsx(PressableFeedback.Highlight, { className: "z-10" }), p.feedback === "ripple" && _jsx(PressableFeedback.Ripple, { className: "z-10" })] });
}
