import { Alert as HeroUIAlert } from "heroui-native/alert";
import { useId } from "react";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent, normalizeSlotText } from "../utils/slot_content";
import { alertStatusText, resolveAlertContent } from "./alert_content";
import type { AlertProps } from "./types";

export function AlertHeroUI(props: AlertProps) {
  const { status, title, description, content, action, indicator, showIndicator } = resolveAlertContent(props);
  const generatedId = useId();
  const rootId = String(props.herouiNativeProps?.id ?? props.herouiNativeProps?.nativeID ?? generatedId);
  const titleId = props.titleProps?.herouiNativeProps?.id ?? props.titleProps?.herouiNativeProps?.nativeID ?? rootId + "_label";
  const descriptionId = props.descriptionProps?.herouiNativeProps?.id ?? props.descriptionProps?.herouiNativeProps?.nativeID ?? rootId + "_desc";
  const titleClass = cn(props.titleClassName, props.titleProps?.className);
  const descriptionClass = cn(props.descriptionClassName, props.descriptionProps?.className);
  const titleFont = useDefaultTextStyle(props.titleProps?.herouiNativeProps?.style, titleClass);
  const descriptionFont = useDefaultTextStyle(props.descriptionProps?.herouiNativeProps?.style, descriptionClass);
  const hasContent = [title, description, content, props.children].some(hasSlotContent);
  return (
    <TextClassContext.Provider value="text-sm text-muted">
      <HeroUIAlert {...props.herouiNativeProps} id={rootId} nativeID={rootId}
        aria-labelledby={hasSlotContent(title) ? titleId : undefined}
        aria-describedby={hasSlotContent(description) ? descriptionId : undefined}
        status={status} className={props.className}
      >
        {showIndicator && (
          <HeroUIAlert.Indicator {...props.indicatorProps?.herouiNativeProps}
            className={cn(props.iconAlign === "center" && "self-center pt-0",
              props.iconContainerClassName, props.indicatorClassName, props.indicatorProps?.className)}
          >
            {indicator === undefined ? undefined : normalizeSlotText(indicator)}
          </HeroUIAlert.Indicator>
        )}
        {hasContent && (
          <HeroUIAlert.Content {...props.contentProps?.herouiNativeProps}
            className={cn("min-w-0", props.contentClassName, props.contentProps?.className)}
          >
            {hasSlotContent(title) && (
              <HeroUIAlert.Title {...props.titleProps?.herouiNativeProps}
                id={titleId} nativeID={titleId} className={titleClass} style={titleFont}
              >
                <TextClassContext.Provider value={cn("text-base font-medium", alertStatusText[status], titleClass)}>
                  {title}
                </TextClassContext.Provider>
              </HeroUIAlert.Title>
            )}
            {hasSlotContent(description) && (
              <HeroUIAlert.Description {...props.descriptionProps?.herouiNativeProps}
                id={descriptionId} nativeID={descriptionId} className={descriptionClass} style={descriptionFont}
              >
                <TextClassContext.Provider value={cn("text-sm text-muted", descriptionClass)}>
                  {description}
                </TextClassContext.Provider>
              </HeroUIAlert.Description>
            )}
            {normalizeSlotText(content)}
            {normalizeSlotText(props.children)}
          </HeroUIAlert.Content>
        )}
        {normalizeSlotText(action)}
      </HeroUIAlert>
    </TextClassContext.Provider>
  );
}
