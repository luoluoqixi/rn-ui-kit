import { Separator } from "@heroui/react/separator";
import type { SeparatorProps } from "./types";
export function SeparatorHeroUI({ orientation = "horizontal", variant = "thin", thickness, isDecorative = false, className, herouiWebProps }: SeparatorProps) {
  const resolvedThickness = thickness ?? (variant === "thick" ? 2 : undefined);
  return <Separator {...herouiWebProps} className={className} orientation={orientation} isDecorative={isDecorative}
    style={{ ...(resolvedThickness == null ? {} : orientation === "horizontal" ? { height: resolvedThickness } : { width: resolvedThickness }), ...herouiWebProps?.style }} />;
}
