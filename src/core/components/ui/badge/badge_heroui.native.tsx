import { Chip as HeroUIChip } from "heroui-native/chip";
import { View } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent, normalizeSlotText } from "../utils/slot_content";
import { badgeTextSizes, resolveBadgeContent } from "./badge_content";
import type { BadgePlacement, BadgeProps } from "./types";

const placementClasses: Record<BadgePlacement, string> = {
  "top-right": "top-0 right-0 translate-x-1/4 -translate-y-1/4",
  "top-left": "top-0 left-0 -translate-x-1/4 -translate-y-1/4",
  "bottom-right": "bottom-0 right-0 translate-x-1/4 translate-y-1/4",
  "bottom-left": "bottom-0 left-0 -translate-x-1/4 translate-y-1/4",
};
const sizeClasses = { sm: "min-h-4 min-w-4", md: "min-h-7 min-w-7", lg: "min-h-8 min-w-8" };

export function BadgeHeroUI(props: BadgeProps) {
  const { size, variant, color, placement, content, textClass } = resolveBadgeContent(props);
  const labelClass = cn(badgeTextSizes[size], "px-0.5", props.labelClassName, props.labelProps?.className);
  const labelFont = useDefaultTextStyle(props.labelProps?.herouiNativeProps?.style, labelClass);

  return (
    <View
      {...props.anchorProps?.herouiNativeProps}
      className={cn("relative self-start", props.anchorClassName, props.anchorProps?.className)}
    >
      {normalizeSlotText(props.children)}
      {!props.isHidden && (
        <TextClassContext.Provider value={cn(textClass, labelClass)}>
          <HeroUIChip
            pointerEvents="none"
            {...props.herouiNativeProps}
            size={size}
            variant={variant}
            color={color}
            className={cn(
              "absolute z-10 rounded-full border border-background p-0 gap-0.5",
              sizeClasses[size], placementClasses[placement], props.className,
            )}
            accessibilityLabel={props.accessibilityLabel ?? props.herouiNativeProps?.accessibilityLabel}
          >
            {hasSlotContent(content) && (
              <HeroUIChip.Label
                {...props.labelProps?.herouiNativeProps}
                className={labelClass}
                style={labelFont}
              >
                {content}
              </HeroUIChip.Label>
            )}
          </HeroUIChip>
        </TextClassContext.Provider>
      )}
    </View>
  );
}
