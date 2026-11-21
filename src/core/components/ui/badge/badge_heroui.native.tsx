import { Chip as HeroUIChip } from "heroui-native/chip";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent, normalizeSlotText } from "../utils/slot_content";
import { resolveBadgeContent } from "./badge_content";
import type { BadgeProps } from "./types";

export function BadgeHeroUI(props: BadgeProps) {
  const { size, variant, color, label, start, end, textClass } = resolveBadgeContent(props);
  const labelClass = cn(props.labelClassName, props.labelProps?.className);
  const labelFont = useDefaultTextStyle(props.labelProps?.herouiNativeProps?.style, labelClass);
  return (
    <TextClassContext.Provider value={cn(textClass, labelClass)}>
      <HeroUIChip {...props.herouiNativeProps} size={size} variant={variant} color={color} className={props.className}>
        {normalizeSlotText(start)}
        {hasSlotContent(label) && (
          <HeroUIChip.Label {...props.labelProps?.herouiNativeProps} className={labelClass} style={labelFont}>
            {label}
          </HeroUIChip.Label>
        )}
        {normalizeSlotText(end)}
      </HeroUIChip>
    </TextClassContext.Provider>
  );
}
