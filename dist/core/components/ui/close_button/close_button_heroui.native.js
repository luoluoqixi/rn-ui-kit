import { jsx as _jsx } from "react/jsx-runtime";
import { CloseButton } from "heroui-native/close-button";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
export function CloseButtonHeroUI(p) {
    const haptics = useResolvedNativeHaptics(p.nativeHaptics, { defaultEnabled: true });
    return _jsx(CloseButton, { ...p.herouiNativeProps, className: p.className, "aria-label": p.accessibilityLabel ?? "关闭", accessibilityLabel: p.accessibilityLabel ?? "关闭", isDisabled: p.isDisabled, onPress: () => {
            if (p.isDisabled)
                return;
            triggerNativeHaptics(haptics);
            p.onPress?.();
        }, children: p.children });
}
