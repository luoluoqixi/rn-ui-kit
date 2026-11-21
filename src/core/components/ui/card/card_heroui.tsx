import { Card as HeroUICard } from "@heroui/react/card";
import { StyleSheet } from "react-native";
import { useDefaultTextStyle } from "../provider/font_provider";
import { TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { hasCardContent, normalizeCardChildren, resolveCardContent } from "./card_content";
import type { CardProps } from "./types";

export function CardHeroUI(props: CardProps) {
  const { header, title, description, customHeader, hasHeader, content, footer } =
    resolveCardContent(props);
  const titleClass = cn(props.titleClassName, props.titleProps?.className);
  const descriptionClass = cn(props.descriptionClassName, props.descriptionProps?.className);
  const titleFont = StyleSheet.flatten(useDefaultTextStyle(undefined, titleClass));
  const descriptionFont = StyleSheet.flatten(useDefaultTextStyle(undefined, descriptionClass));

  return (
    <TextClassContext.Provider value="text-foreground">
      <HeroUICard {...props.herouiWebProps} variant={props.variant} className={props.className}>
        {hasHeader && (
          <HeroUICard.Header
            {...props.headerProps?.herouiWebProps}
            className={cn(props.headerClassName, props.headerProps?.className)}
          >
            {customHeader ? (
              normalizeCardChildren(header)
            ) : (
              <>
                {hasCardContent(title) && (
                  <HeroUICard.Title
                    {...props.titleProps?.herouiWebProps}
                    className={titleClass}
                    style={{
                      fontFamily: titleFont?.fontFamily,
                      ...props.titleProps?.herouiWebProps?.style,
                    }}
                  >
                    <TextClassContext.Provider
                      value={cn("text-sm leading-6 text-foreground font-medium", titleClass)}
                    >
                      {title}
                    </TextClassContext.Provider>
                  </HeroUICard.Title>
                )}
                {hasCardContent(description) && (
                  <HeroUICard.Description
                    {...props.descriptionProps?.herouiWebProps}
                    className={descriptionClass}
                    style={{
                      fontFamily: descriptionFont?.fontFamily,
                      ...props.descriptionProps?.herouiWebProps?.style,
                    }}
                  >
                    <TextClassContext.Provider
                      value={cn("text-sm leading-5 text-muted", descriptionClass)}
                    >
                      {description}
                    </TextClassContext.Provider>
                  </HeroUICard.Description>
                )}
              </>
            )}
          </HeroUICard.Header>
        )}
        {hasCardContent(content) && (
          <HeroUICard.Content
            {...props.contentProps?.herouiWebProps}
            className={cn(props.contentClassName, props.contentProps?.className)}
          >
            {normalizeCardChildren(content)}
          </HeroUICard.Content>
        )}
        {normalizeCardChildren(props.children)}
        {hasCardContent(footer) && (
          <HeroUICard.Footer
            {...props.footerProps?.herouiWebProps}
            className={cn(props.footerClassName, props.footerProps?.className)}
          >
            {normalizeCardChildren(footer)}
          </HeroUICard.Footer>
        )}
      </HeroUICard>
    </TextClassContext.Provider>
  );
}
