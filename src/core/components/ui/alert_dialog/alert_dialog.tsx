import { buttonTextVariants, buttonVariants } from "../button";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow } from "../utils/overlay/overlay_portal";
import { resolveRenderProp } from "../utils/render";
import { resolveAriaLabel } from "../utils/accessibility";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import * as React from "react";
import { Platform, View, type PressableStateCallbackType, type ViewProps } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";

import type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDestructiveProps,
  AlertDialogDescriptionProps,
  AlertDialogOverlayProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
} from "./types";

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

function AlertDialogPortal({
  hostName,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  const scopedPortalHost = useScopedOverlayPortalHostName();
  return <AlertDialogPrimitive.Portal {...props} hostName={hostName ?? scopedPortalHost} />;
}

type AlertDialogChildren =
  | React.ReactNode
  | ((state: PressableStateCallbackType) => React.ReactNode);

function normalizeAlertDialogChildren(children: AlertDialogChildren): AlertDialogChildren {
  if (typeof children === "function") return children;
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
  ) as React.ReactNode;
}

function normalizeAlertDialogRenderValue(value: React.ReactNode | undefined) {
  const normalized = React.Children.map(value, (child) =>
    typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
  );
  return normalized != null && normalized.length === 1 ? normalized[0] : normalized;
}

function AlertDialogRoot({
  actionAriaLabel,
  actionLabel,
  actionClassName,
  actionProps,
  actions,
  cancelAriaLabel,
  cancelLabel,
  cancelClassName,
  cancelProps,
  children,
  contentClassName,
  contentProps,
  dismissOnBackPress,
  dismissOnOverlayPress,
  disableRemoveScroll,
  description,
  descriptionClassName,
  descriptionProps,
  destructiveAriaLabel,
  destructiveLabel,
  destructiveClassName,
  destructiveProps,
  footerClassName,
  headerClassName,
  overlayProps,
  portalProps,
  title,
  titleClassName,
  titleProps,
  trigger,
  triggerClassName,
  triggerProps,
  ...rootProps
}: AlertDialogProps) {
  void dismissOnBackPress;
  void disableRemoveScroll;
  const renderContext = { open: rootProps.open };
  const renderedActionLabel = normalizeAlertDialogRenderValue(
    resolveRenderProp(actionLabel, renderContext),
  );
  const renderedActions = normalizeAlertDialogRenderValue(
    resolveRenderProp(actions, renderContext),
  );
  const renderedCancelLabel = normalizeAlertDialogRenderValue(
    resolveRenderProp(cancelLabel, renderContext),
  );
  const renderedDescription = normalizeAlertDialogRenderValue(
    resolveRenderProp(description, renderContext),
  );
  const renderedDestructiveLabel = normalizeAlertDialogRenderValue(
    resolveRenderProp(destructiveLabel, renderContext),
  );
  const renderedTitle = normalizeAlertDialogRenderValue(resolveRenderProp(title, renderContext));
  const renderedTrigger = normalizeAlertDialogRenderValue(
    resolveRenderProp(trigger, renderContext),
  );
  const hasDefaultStructure =
    renderedTrigger != null ||
    renderedTitle != null ||
    renderedDescription != null ||
    renderedActions != null ||
    renderedCancelLabel != null ||
    renderedActionLabel != null ||
    renderedDestructiveLabel != null;

  if (!hasDefaultStructure) {
    return <AlertDialogPrimitive.Root {...rootProps}>{children}</AlertDialogPrimitive.Root>;
  }

  return (
    <AlertDialogPrimitive.Root {...rootProps}>
      {renderedTrigger != null ? (
        <AlertDialogTrigger
          {...triggerProps}
          className={cn(triggerClassName, triggerProps?.className)}
          asChild
        >
          {renderedTrigger}
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent
        {...contentProps}
        className={cn(contentClassName, contentProps?.className)}
        overlayProps={{
          ...contentProps?.overlayProps,
          ...overlayProps,
          dismissOnOverlayPress,
        }}
        portalProps={portalProps ?? contentProps?.portalProps}
      >
        {renderedTitle != null || renderedDescription != null ? (
          <AlertDialogHeader className={headerClassName}>
            {renderedTitle != null ? (
              <AlertDialogTitle
                {...titleProps}
                className={cn(titleClassName, titleProps?.className)}
              >
                {renderedTitle}
              </AlertDialogTitle>
            ) : null}
            {renderedDescription != null ? (
              <AlertDialogDescription
                {...descriptionProps}
                className={cn(descriptionClassName, descriptionProps?.className)}
              >
                {renderedDescription}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
        ) : null}
        {children}
        {renderedActions != null ||
        renderedCancelLabel != null ||
        renderedActionLabel != null ||
        renderedDestructiveLabel != null ? (
          <AlertDialogFooter className={footerClassName}>
            {renderedActions}
            {renderedCancelLabel != null ? (
              <AlertDialogCancel
                {...cancelProps}
                className={cn(cancelClassName, cancelProps?.className)}
                aria-label={resolveAriaLabel(
                  cancelAriaLabel ?? cancelProps?.["aria-label"],
                  renderedCancelLabel,
                )}
              >
                {renderedCancelLabel}
              </AlertDialogCancel>
            ) : null}
            {renderedActionLabel != null ? (
              <AlertDialogAction
                {...actionProps}
                className={cn(actionClassName, actionProps?.className)}
                aria-label={resolveAriaLabel(
                  actionAriaLabel ?? actionProps?.["aria-label"],
                  renderedActionLabel,
                )}
              >
                {renderedActionLabel}
              </AlertDialogAction>
            ) : null}
            {renderedDestructiveLabel != null ? (
              <AlertDialogDestructive
                {...destructiveProps}
                className={cn(destructiveClassName, destructiveProps?.className)}
                aria-label={resolveAriaLabel(
                  destructiveAriaLabel ?? destructiveProps?.["aria-label"],
                  renderedDestructiveLabel,
                )}
              >
                {renderedDestructiveLabel}
              </AlertDialogDestructive>
            ) : null}
          </AlertDialogFooter>
        ) : null}
      </AlertDialogContent>
    </AlertDialogPrimitive.Root>
  );
}

function AlertDialogOverlay({
  className,
  children,
  dismissOnOverlayPress = false,
  portalHost,
  onPress,
  ...props
}: Omit<AlertDialogOverlayProps, "asChild"> & {
  children?: React.ReactNode;
  portalHost?: string;
}) {
  const { onOpenChange } = AlertDialogPrimitive.useRootContext();

  function handlePress(event: Parameters<NonNullable<typeof onPress>>[0]) {
    onPress?.(event);
    if (
      !event.isDefaultPrevented() &&
      dismissOnOverlayPress &&
      event.target === event.currentTarget
    ) {
      onOpenChange(false);
    }
  }

  return (
    <OverlayPortalWindow
      forceFullScreen
      onRequestClose={() => onOpenChange(false)}
      portalHost={portalHost}
    >
      <AlertDialogPrimitive.Overlay
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2",
          Platform.select({
            web: "animate-in fade-in-0 fixed",
          }),
          className,
        )}
        {...props}
        {...({ onPress: handlePress } as object)}
        asChild={Platform.OS !== "web"}
      >
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200).delay(50).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable"
        >
          <>{children}</>
        </NativeOnlyAnimatedView>
      </AlertDialogPrimitive.Overlay>
    </OverlayPortalWindow>
  );
}

function AlertDialogContent({
  className,
  portalHost,
  portalProps,
  overlayProps,
  ...props
}: AlertDialogContentProps) {
  const scopedPortalHost = useScopedOverlayPortalHostName();
  const resolvedPortalHost = portalHost ?? portalProps?.hostName ?? scopedPortalHost;

  return (
    <AlertDialogPortal {...portalProps} hostName={resolvedPortalHost}>
      <AlertDialogOverlay {...overlayProps} portalHost={resolvedPortalHost}>
        <AlertDialogPrimitive.Content
          className={cn(
            "bg-background border-border z-50 flex flex-col gap-4 rounded-lg border p-6 shadow-lg shadow-black/5 sm:max-w-lg",
            Platform.select({
              web: "animate-in fade-in-0 zoom-in-95 web:max-w-[calc(100%-2rem)] duration-200",
            }),
            className,
          )}
          {...props}
        />
      </AlertDialogOverlay>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-center sm:text-left">
      <View className={cn("flex flex-col gap-2", className)} {...props} />
    </TextClassContext.Provider>
  );
}

function AlertDialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-foreground text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AlertDialogAction({ className, ...props }: AlertDialogActionProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ className })}>
      <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} {...props}>
        {normalizeAlertDialogChildren(props.children)}
      </AlertDialogPrimitive.Action>
    </TextClassContext.Provider>
  );
}

function AlertDialogCancel({ className, ...props }: AlertDialogCancelProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ className, variant: "outline" })}>
      <AlertDialogPrimitive.Cancel
        className={cn(buttonVariants({ variant: "outline" }), className)}
        {...props}
      >
        {normalizeAlertDialogChildren(props.children)}
      </AlertDialogPrimitive.Cancel>
    </TextClassContext.Provider>
  );
}

function AlertDialogDestructive({ className, ...props }: AlertDialogDestructiveProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ className, variant: "destructive" })}>
      <AlertDialogPrimitive.Action
        className={cn(buttonVariants({ variant: "destructive" }), className)}
        {...props}
      >
        {normalizeAlertDialogChildren(props.children)}
      </AlertDialogPrimitive.Action>
    </TextClassContext.Provider>
  );
}

const AlertDialog = Object.assign(AlertDialogRoot, {
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
  Content: AlertDialogContent,
  Description: AlertDialogDescription,
  Destructive: AlertDialogDestructive,
  Footer: AlertDialogFooter,
  Header: AlertDialogHeader,
  Overlay: AlertDialogOverlay,
  Portal: AlertDialogPortal,
  Root: AlertDialogRoot,
  Title: AlertDialogTitle,
  Trigger: AlertDialogTrigger,
});

export { AlertDialog };
