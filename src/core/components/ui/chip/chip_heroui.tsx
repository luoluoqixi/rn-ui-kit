import { Chip as HeroUIChip } from "@heroui/react/chip";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent } from "../utils/slot_content";
import { resolveChipContent } from "./chip_content";
import type { ChipProps } from "./types";

export function ChipHeroUI(props: ChipProps) {
  const { size, variant, color, label, start, end, textClass } = resolveChipContent(props);
  const labelClass = cn(props.labelClassName, props.labelProps?.className);
  const labelFont = StyleSheet.flatten(useDefaultTextStyle(undefined, labelClass));
  return (
    <TextClassContext.Provider value={cn(textClass, labelClass)}>
      <HeroUIChip {...props.herouiWebProps} size={size} variant={variant} color={color} className={props.className}>
        {start}
        {hasSlotContent(label) && (
          <HeroUIChip.Label {...props.labelProps?.herouiWebProps} className={labelClass} style={{ fontFamily: labelFont?.fontFamily, ...props.labelProps?.herouiWebProps?.style }}>
            {label}
          </HeroUIChip.Label>
        )}
        {end}
      </HeroUIChip>
    </TextClassContext.Provider>
  );
}
