import { jsx as _jsx } from "react/jsx-runtime";
import { Separator } from "@heroui/react/separator";
export function SeparatorHeroUI({ orientation = "horizontal", variant = "thin", thickness, isDecorative = false, className, herouiWebProps }) {
    const resolvedThickness = thickness ?? (variant === "thick" ? 2 : undefined);
    return _jsx(Separator, { ...herouiWebProps, elementType: herouiWebProps?.elementType ?? (isDecorative ? "div" : undefined), className: className, orientation: orientation, isDecorative: isDecorative, style: { ...(resolvedThickness == null ? {} : orientation === "horizontal" ? { height: resolvedThickness } : { width: resolvedThickness }), ...herouiWebProps?.style } });
}
