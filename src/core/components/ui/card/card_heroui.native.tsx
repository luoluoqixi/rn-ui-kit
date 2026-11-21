import { Card as HeroUICard } from "heroui-native/card";
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
  const titleStyle = useDefaultTextStyle(props.titleProps?.herouiNativeProps?.style, titleClass);
  const descriptionStyle = useDefaultTextStyle(
    props.descriptionProps?.herouiNativeProps?.style,
    descriptionClass,
  );

  return (
    <TextClassContext.Provider value="text-foreground">
      <HeroUICard
        {...props.herouiNativeProps}
        variant={props.variant}
        className={cn("gap-3", props.className)}
      >
        {hasHeader && (
          <HeroUICard.Header
            {...props.headerProps?.herouiNativeProps}
            className={cn(props.headerClassName, props.headerProps?.className)}
          >
            {customHeader ? (
              normalizeCardChildren(header)
            ) : (
              <>
                {hasCardContent(title) && (
                  <HeroUICard.Title
                    {...props.titleProps?.herouiNativeProps}
                    className={titleClass}
                    style={titleStyle}
                  >
                    <TextClassContext.Provider
                      value={cn("text-lg leading-lg text-foreground font-medium", titleClass)}
                    >
                      {title}
                    </TextClassContext.Provider>
                  </HeroUICard.Title>
                )}
                {hasCardContent(description) && (
                  <HeroUICard.Description
                    {...props.descriptionProps?.herouiNativeProps}
                    className={descriptionClass}
                    style={descriptionStyle}
                  >
                    <TextClassContext.Provider value={cn("text-base text-muted", descriptionClass)}>
                      {description}
                    </TextClassContext.Provider>
                  </HeroUICard.Description>
                )}
              </>
            )}
          </HeroUICard.Header>
        )}
        {hasCardContent(content) && (
          <HeroUICard.Body
            {...props.contentProps?.herouiNativeProps}
            className={cn(props.contentClassName, props.contentProps?.className)}
          >
            {normalizeCardChildren(content)}
          </HeroUICard.Body>
        )}
        {normalizeCardChildren(props.children)}
        {hasCardContent(footer) && (
          <HeroUICard.Footer
            {...props.footerProps?.herouiNativeProps}
            className={cn(
              "flex-row items-center",
              props.footerClassName,
              props.footerProps?.className,
            )}
          >
            {normalizeCardChildren(footer)}
          </HeroUICard.Footer>
        )}
      </HeroUICard>
    </TextClassContext.Provider>
  );
}
