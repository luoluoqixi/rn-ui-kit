import { jsx as _jsx } from "react/jsx-runtime";
import { CloseButton } from "@heroui/react/close-button";
export function CloseButtonHeroUI(p) {
    return _jsx(CloseButton, { ...p.herouiWebProps, className: p.className, "aria-label": p.accessibilityLabel ?? "关闭", isDisabled: p.isDisabled, onPress: () => { if (!p.isDisabled)
            p.onPress?.(); }, children: p.children });
}
