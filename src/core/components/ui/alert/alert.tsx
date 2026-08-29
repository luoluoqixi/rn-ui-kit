import { Icon } from "../icon";
import type { IconProps } from "../icon";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import * as React from "react";
import { View } from "react-native";

const alertIconPaddingClasses = {
  "2xs": "pl-6",
  xs: "pl-6",
  sm: "pl-6",
  md: "pl-6",
  lg: "pl-8",
  xl: "pl-9",
  "2xl": "pl-10",
} as const;

function getAlertIconPaddingClass(size: IconProps["size"]) {
  if (typeof size === "string" && size in alertIconPaddingClasses) {
    return alertIconPaddingClasses[size as keyof typeof alertIconPaddingClasses];
  }

  if (typeof size === "number") {
    if (size > 28) return "pl-10";
    if (size > 24) return "pl-9";
    if (size > 20) return "pl-8";
  }

  return "pl-6";
}

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
  iconSize = "md",
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
  const iconPaddingClass = getAlertIconPaddingClass(iconSize ?? iconProps?.size);

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
            size={iconSize ?? iconProps?.size}
            className={cn(
              iconSize == null && iconProps?.size == null ? "size-4" : undefined,
              variant === "destructive" && "text-destructive",
              iconClassName,
              iconProps?.className,
            )}
          />
        </View>
        {hasStructuredContent ? (
          <>
            {renderedTitle != null ? (
              <AlertTitle
                {...titleProps}
                className={cn(iconPaddingClass, titleClassName, titleProps?.className)}
              >
                {renderedTitle}
              </AlertTitle>
            ) : null}
            {renderedDescription != null ? (
              <AlertDescription
                {...descriptionProps}
                className={cn(iconPaddingClass, descriptionClassName, descriptionProps?.className)}
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
      className={cn("mb-1 ml-0.5 min-h-4 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  const textClass = React.useContext(TextClassContext);
  return (
    <Text
      className={cn(
        "text-muted-foreground ml-0.5 pb-1.5 text-sm leading-relaxed",
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
