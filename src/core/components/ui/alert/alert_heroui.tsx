import { Alert as HeroUIAlert } from "@heroui/react/alert";
import { useId } from "react";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasSlotContent, normalizeSlotText } from "../utils/slot_content";
import { alertStatusText, resolveAlertContent } from "./alert_content";
import type { AlertProps } from "./types";

export function AlertHeroUI(props: AlertProps) {
  const { status, title, description, content, action, indicator, showIndicator } = resolveAlertContent(props);
  const generatedId = useId();
  const titleId = props.titleProps?.herouiWebProps?.id ?? generatedId + "-title";
  const descriptionId = props.descriptionProps?.herouiWebProps?.id ?? generatedId + "-description";
  const titleClass = cn(props.titleClassName, props.titleProps?.className);
  const descriptionClass = cn(props.descriptionClassName, props.descriptionProps?.className);
  const titleFont = StyleSheet.flatten(useDefaultTextStyle(undefined, titleClass));
  const descriptionFont = StyleSheet.flatten(useDefaultTextStyle(undefined, descriptionClass));
  const hasContent = [title, description, content, props.children].some(hasSlotContent);
  return (
    <TextClassContext.Provider value="text-sm text-muted">
      <HeroUIAlert role="alert"
        aria-labelledby={hasSlotContent(title) ? titleId : undefined}
        aria-describedby={hasSlotContent(description) ? descriptionId : undefined}
        {...props.herouiWebProps} status={status} className={props.className}
      >
        {showIndicator && (
          <HeroUIAlert.Indicator {...props.indicatorProps?.herouiWebProps}
            className={cn(props.iconAlign === "center" && "self-center pt-0",
              props.iconContainerClassName, props.indicatorClassName, props.indicatorProps?.className)}
          >
            {indicator === undefined ? undefined : normalizeSlotText(indicator)}
          </HeroUIAlert.Indicator>
        )}
        {hasContent && (
          <HeroUIAlert.Content {...props.contentProps?.herouiWebProps}
            className={cn("min-w-0", props.contentClassName, props.contentProps?.className)}
          >
            {hasSlotContent(title) && (
              <HeroUIAlert.Title {...props.titleProps?.herouiWebProps}
                id={titleId} className={titleClass} style={{ fontFamily: titleFont?.fontFamily, ...props.titleProps?.herouiWebProps?.style }}
              >
                <TextClassContext.Provider value={cn("text-sm font-medium", alertStatusText[status], titleClass)}>
                  {title}
                </TextClassContext.Provider>
              </HeroUIAlert.Title>
            )}
            {hasSlotContent(description) && (
              <HeroUIAlert.Description {...props.descriptionProps?.herouiWebProps}
                id={descriptionId} className={descriptionClass} style={{ fontFamily: descriptionFont?.fontFamily, ...props.descriptionProps?.herouiWebProps?.style }}
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
