import { Separator } from "heroui-native/separator";
import type { SeparatorProps } from "./types";
export function SeparatorHeroUI({ orientation = "horizontal", variant, thickness, isDecorative = false, className, herouiNativeProps }: SeparatorProps) {
  return <Separator {...herouiNativeProps} className={className} orientation={orientation} variant={variant} thickness={thickness}
    role={isDecorative ? "none" : "separator"} aria-orientation={isDecorative ? undefined : orientation}
    accessible={!isDecorative} accessibilityElementsHidden={isDecorative}
    importantForAccessibility={isDecorative ? "no-hide-descendants" : "auto"} />;
}
