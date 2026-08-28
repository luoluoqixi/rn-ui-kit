import { Icon } from "../icon";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import * as React from "react";
import { View } from "react-native";

function Alert({
  className,
  variant,
  children,
  description,
  descriptionClassName,
  descriptionProps,
  icon,
  iconAlign = "center",
  iconContainerClassName,
  iconClassName,
  iconProps,
  title,
  titleClassName,
  titleProps,
  ...props
}: import("./types").AlertProps) {
  const renderContext = { icon, variant };
  const renderedTitle = resolveRenderProp(title, renderContext);
  const renderedDescription = resolveRenderProp(description, renderContext);
  const hasStructuredContent = renderedTitle != null || renderedDescription != null;

  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm text-foreground",
        variant === "destructive" && "text-destructive",
        className,
      )}
    >
      <View
        role="alert"
        className={cn(
          "bg-card border-border relative w-full rounded-lg border px-4 pb-2 pt-3.5",
          className,
        )}
        {...props}
      >
        <View
          className={cn(
            "absolute left-3.5",
            iconAlign === "center" ? "bottom-0 top-0 justify-center" : "top-3",
            iconContainerClassName,
          )}
        >
          <Icon
            as={icon}
            {...iconProps}
            className={cn(
              "size-4",
              variant === "destructive" && "text-destructive",
              iconClassName,
              iconProps?.className,
            )}
          />
        </View>
        {hasStructuredContent ? (
          <>
            {renderedTitle != null ? (
              <AlertTitle {...titleProps} className={cn(titleClassName, titleProps?.className)}>
                {renderedTitle}
              </AlertTitle>
            ) : null}
            {renderedDescription != null ? (
              <AlertDescription
                {...descriptionProps}
                className={cn(descriptionClassName, descriptionProps?.className)}
              >
                {renderedDescription}
              </AlertDescription>
            ) : null}
            {children}
          </>
        ) : (
          children
        )}
      </View>
    </TextClassContext.Provider>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("mb-1 ml-0.5 min-h-4 pl-6 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  const textClass = React.useContext(TextClassContext);
  return (
    <Text
      className={cn(
        "text-muted-foreground ml-0.5 pb-1.5 pl-6 text-sm leading-relaxed",
        textClass?.includes("text-destructive") && "text-destructive/90",
        className,
      )}
      {...props}
    />
  );
}

const AlertComponent = Object.assign(Alert, {
  Description: AlertDescription,
  Root: Alert,
  Title: AlertTitle,
});

export { AlertComponent as Alert };
