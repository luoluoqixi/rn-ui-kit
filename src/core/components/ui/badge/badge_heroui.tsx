import { Badge as HeroUIBadge } from "@heroui/react/badge";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent } from "../utils/slot_content";
import { resolveBadgeContent } from "./badge_content";
import type { BadgeProps } from "./types";

export function BadgeHeroUI(props: BadgeProps) {
  const { size, variant, color, placement, content, textClass } = resolveBadgeContent(props);
  const labelClass = cn(props.labelClassName, props.labelProps?.className);
  const labelFont = StyleSheet.flatten(useDefaultTextStyle(undefined, labelClass));

  return (
    <HeroUIBadge.Anchor<"div">
      {...props.anchorProps?.herouiWebProps}
      className={cn("self-start", props.anchorClassName, props.anchorProps?.className)}
      // Anchors may contain RN Web Views and buttons, so use a flow-content host.
      render={anchorProps => <div {...anchorProps} />}
    >
      {props.children}
      {!props.isHidden && (
        <TextClassContext.Provider value={cn(textClass, labelClass)}>
          <HeroUIBadge
            {...props.herouiWebProps}
            size={size}
            variant={variant}
            color={color}
            placement={placement}
            className={cn("pointer-events-none z-10", props.className)}
            aria-label={props.accessibilityLabel ?? props.herouiWebProps?.["aria-label"]}
          >
            {hasSlotContent(content) && (
              <HeroUIBadge.Label
                {...props.labelProps?.herouiWebProps}
                className={labelClass}
                style={{ fontFamily: labelFont?.fontFamily, ...props.labelProps?.herouiWebProps?.style }}
              >
                {content}
              </HeroUIBadge.Label>
            )}
          </HeroUIBadge>
        </TextClassContext.Provider>
      )}
    </HeroUIBadge.Anchor>
  );
}
