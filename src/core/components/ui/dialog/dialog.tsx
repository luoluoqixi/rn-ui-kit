import { Icon } from "../icon";
import { Button } from "../button";
import { Text } from "../text";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { cn } from "../utils/cn";
import { OverlayPortalWindow } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { resolveRenderProp } from "../utils/render";
import * as DialogPrimitive from "@rn-primitives/dialog";
import { X } from "lucide-react-native";
import * as React from "react";
import {
  Platform,
  View,
  type GestureResponderEvent,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";

import type {
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogProps,
  DialogRenderContext,
  DialogTitleProps,
} from "./types";

const DialogTrigger = DialogPrimitive.Trigger;

function DialogPortal({ hostName, ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  const scopedPortalHost = useScopedOverlayPortalHostName();
  return <DialogPrimitive.Portal {...props} hostName={hostName ?? scopedPortalHost} />;
}

const DialogClose = DialogPrimitive.Close;

function normalizeDialogChildren(children: React.ReactNode) {
  const normalized = React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
  );
  return normalized != null && normalized.length === 1 ? normalized[0] : normalized;
}

function DialogRoot({
  actionClassName,
  actionLabel,
  actionProps,
  actions,
  cancelClassName,
  cancelLabel,
  cancelProps,
  children,
  content,
  contentClassName,
  contentProps,
  defaultOpen,
  description,
  descriptionClassName,
  descriptionProps,
  footerClassName,
  headerClassName,
  onOpenChange,
  open,
  title,
  titleClassName,
  titleProps,
  trigger,
  triggerClassName,
  triggerProps,
  ...rootProps
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const hasDataStructure =
    children == null &&
    [actionLabel, actions, cancelLabel, content, description, title, trigger].some(
      (value) => value !== undefined,
    );

  if (!hasDataStructure) {
    return (
      <DialogPrimitive.Root
        {...rootProps}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        open={open}
      >
        {children}
      </DialogPrimitive.Root>
    );
  }

  const resolvedOpen = open ?? uncontrolledOpen;
  const renderContext: DialogRenderContext = { open: resolvedOpen };
  const renderedActionLabel = resolveRenderProp(actionLabel, renderContext);
  const renderedActions = resolveRenderProp(actions, renderContext);
  const renderedCancelLabel = resolveRenderProp(cancelLabel, renderContext);
  const renderedContent = resolveRenderProp(content, renderContext);
  const renderedDescription = resolveRenderProp(description, renderContext);
  const renderedTitle = resolveRenderProp(title, renderContext);
  const renderedTrigger = resolveRenderProp(trigger, renderContext);
  const handleOpenChange = (nextOpen: boolean) => {
    if (open === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  const triggerElement =
    renderedTrigger == null ? null : React.isValidElement(renderedTrigger) ? (
      renderedTrigger
    ) : (
      <Button className={triggerClassName} variant="outline">
        {normalizeDialogChildren(renderedTrigger)}
      </Button>
    );

  return (
    <DialogPrimitive.Root {...rootProps} onOpenChange={handleOpenChange} open={resolvedOpen}>
      {triggerElement != null ? (
        <DialogTrigger
          {...triggerProps}
          asChild
          className={cn(triggerProps?.className, triggerClassName)}
        >
          {triggerElement}
        </DialogTrigger>
      ) : null}
      <DialogContent {...contentProps} className={cn(contentClassName, contentProps?.className)}>
        {renderedTitle != null || renderedDescription != null ? (
          <DialogHeader className={headerClassName}>
            {renderedTitle != null ? (
              <DialogTitle {...titleProps} className={cn(titleClassName, titleProps?.className)}>
                {renderedTitle}
              </DialogTitle>
            ) : null}
            {renderedDescription != null ? (
              <DialogDescription
                {...descriptionProps}
                className={cn(descriptionClassName, descriptionProps?.className)}
              >
                {renderedDescription}
              </DialogDescription>
            ) : null}
          </DialogHeader>
        ) : null}
        {renderedContent != null ? normalizeDialogChildren(renderedContent) : null}
        {renderedActions != null || renderedCancelLabel != null || renderedActionLabel != null ? (
          <DialogFooter className={footerClassName}>
            {normalizeDialogChildren(renderedActions)}
            {renderedCancelLabel != null ? (
              <DialogClose asChild>
                <Button
                  {...cancelProps}
                  className={cn(cancelClassName, cancelProps?.className)}
                  variant="outline"
                >
                  {normalizeDialogChildren(renderedCancelLabel)}
                </Button>
              </DialogClose>
            ) : null}
            {renderedActionLabel != null ? (
              <Button {...actionProps} className={cn(actionClassName, actionProps?.className)}>
                {normalizeDialogChildren(renderedActionLabel)}
              </Button>
            ) : null}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </DialogPrimitive.Root>
  );
}

function DialogOverlay({
  className,
  children,
  portalHost,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, "asChild"> & {
  children?: React.ReactNode;
  portalHost?: string;
}) {
  const { onOpenChange } = DialogPrimitive.useRootContext();

  function onOverlayPress(event: GestureResponderEvent) {
    onPress?.(event);
    if (event.target === event.currentTarget && !event.isDefaultPrevented()) {
      onOpenChange(false);
    }
  }

  return (
    <OverlayPortalWindow
      forceFullScreen
      onRequestClose={() => onOpenChange(false)}
      portalHost={portalHost}
    >
      <DialogPrimitive.Overlay
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2",
          Platform.select({
            web: "animate-in fade-in-0 fixed cursor-default [&>*]:cursor-auto",
          }),
          className,
        )}
        {...props}
        // Handle dismissal here so presses on dialog controls are not treated as overlay presses.
        closeOnPress={Platform.OS === "web" ? undefined : false}
        onPress={onOverlayPress}
        asChild={Platform.OS !== "web"}
      >
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable"
        >
          <NativeOnlyAnimatedView
            className="w-full"
            entering={FadeIn.delay(50).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          >
            <>{children}</>
          </NativeOnlyAnimatedView>
        </NativeOnlyAnimatedView>
      </DialogPrimitive.Overlay>
    </OverlayPortalWindow>
  );
}
function DialogContent({
  className,
  portalHost,
  portalProps,
  overlayProps,
  children,
  onStartShouldSetResponder,
  style,
  ...props
}: DialogContentProps) {
  const scopedPortalHost = useScopedOverlayPortalHostName();
  const resolvedPortalHost = portalHost ?? portalProps?.hostName ?? scopedPortalHost;

  return (
    <DialogPortal {...portalProps} hostName={resolvedPortalHost}>
      <DialogOverlay {...overlayProps} portalHost={resolvedPortalHost}>
        <DialogPrimitive.Content
          className={cn(
            "bg-background border-border z-50 mx-auto flex w-full flex-col gap-4 rounded-lg border p-6 shadow-lg shadow-black/5 sm:max-w-2xl",
            Platform.select({
              web: "animate-in fade-in-0 zoom-in-95 web:max-w-[calc(100%-2rem)] duration-200",
            }),
            className,
          )}
          style={[
            Platform.OS === "web"
              ? ({
                  maxWidth: "calc(100vw - 2rem)",
                  width: "min(672px, calc(100vw - 2rem))",
                } as unknown as ViewStyle)
              : null,
            style,
          ]}
          {...props}
          onStartShouldSetResponder={onStartShouldSetResponder ?? (() => false)}
        >
          <>{children}</>
          <DialogPrimitive.Close
            className={cn(
              "absolute right-4 top-4 rounded opacity-70 active:opacity-100",
              Platform.select({
                web: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
              }),
            )}
            hitSlop={12}
          >
            <Icon
              as={X}
              className={cn("text-accent-foreground web:pointer-events-none size-4 shrink-0")}
            />
            <Text className="sr-only">Close</Text>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ViewProps) {
  return (
    <View className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-foreground text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

const Dialog = Object.assign(DialogRoot, {
  Close: DialogClose,
  Content: DialogContent,
  Description: DialogDescription,
  Footer: DialogFooter,
  Header: DialogHeader,
  Overlay: DialogOverlay,
  Portal: DialogPortal,
  Root: DialogRoot,
  Title: DialogTitle,
  Trigger: DialogTrigger,
});

export { Dialog };
export type * from "./types";
