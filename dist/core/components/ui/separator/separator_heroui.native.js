import { jsx as _jsx } from "react/jsx-runtime";
import { Separator } from "heroui-native/separator";
export function SeparatorHeroUI({ orientation = "horizontal", variant, thickness, isDecorative = false, className, herouiNativeProps }) {
    return _jsx(Separator, { ...herouiNativeProps, className: className, orientation: orientation, variant: variant, thickness: thickness, role: isDecorative ? "none" : "separator", "aria-orientation": isDecorative ? undefined : orientation, accessible: !isDecorative, accessibilityElementsHidden: isDecorative, importantForAccessibility: isDecorative ? "no-hide-descendants" : "auto" });
}
