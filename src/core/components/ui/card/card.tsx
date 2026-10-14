import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import * as React from "react";
import { View } from "react-native";

import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardRenderContext,
  CardTitleProps,
} from "./types";

function normalizeCardChildren(children: React.ReactNode) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
  );
}

function Card({
  className,
  children,
  content,
  contentClassName,
  contentProps,
  description,
  descriptionClassName,
  descriptionProps,
  footer,
  footerClassName,
  footerProps,
  header,
  headerClassName,
  headerProps,
  title,
  titleClassName,
  titleProps,
  ...props
}: CardProps) {
  const renderContext: CardRenderContext = {};
  const renderedHeader = resolveRenderProp(header, renderContext);
  const renderedTitle = resolveRenderProp(title, renderContext);
  const renderedDescription = resolveRenderProp(description, renderContext);
  const renderedContent = resolveRenderProp(content, renderContext);
  const renderedFooter = resolveRenderProp(footer, renderContext);
  const hasHeader = renderedHeader != null || renderedTitle != null || renderedDescription != null;

  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View
        className={cn(
          "bg-card border-border flex flex-col gap-6 rounded-xl border py-6 shadow-sm shadow-black/5",
          className,
        )}
        {...props}
      >
        {hasHeader ? (
          <CardHeader {...headerProps} className={cn(headerClassName, headerProps?.className)}>
            {renderedHeader != null ? (
              normalizeCardChildren(renderedHeader)
            ) : (
              <>
                {renderedTitle != null ? (
                  <CardTitle {...titleProps} className={cn(titleClassName, titleProps?.className)}>
                    {renderedTitle}
                  </CardTitle>
                ) : null}
                {renderedDescription != null ? (
                  <CardDescription
                    {...descriptionProps}
                    className={cn(descriptionClassName, descriptionProps?.className)}
                  >
                    {renderedDescription}
                  </CardDescription>
                ) : null}
              </>
            )}
          </CardHeader>
        ) : null}
        {renderedContent != null ? (
          <CardContent {...contentProps} className={cn(contentClassName, contentProps?.className)}>
            {normalizeCardChildren(renderedContent)}
          </CardContent>
        ) : null}
        {children}
        {renderedFooter != null ? (
          <CardFooter {...footerProps} className={cn(footerClassName, footerProps?.className)}>
            {normalizeCardChildren(renderedFooter)}
          </CardFooter>
        ) : null}
      </View>
    </TextClassContext.Provider>
  );
}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return <View className={cn("flex flex-col gap-1.5 px-6", className)} {...props} />;
}

function CardTitle({ className, ref, ...props }: CardTitleProps) {
  return (
    <Text
      ref={ref}
      role="heading"
      aria-level={3}
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <Text className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function CardContent({ className, ...props }: CardContentProps) {
  return <View className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: CardFooterProps) {
  return <View className={cn("flex flex-row items-center px-6", className)} {...props} />;
}

const CardComponent = Object.assign(Card, {
  Content: CardContent,
  Description: CardDescription,
  Footer: CardFooter,
  Header: CardHeader,
  Root: Card,
  Title: CardTitle,
});

export { CardComponent as Card };
export type * from "./types";
