import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { resolveRenderProp } from "../utils/render";
import * as PopoverPrimitive from "@rn-primitives/popover";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";
import type { PopoverProps } from "./types";

const PopoverRoot = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

function normalizePopoverChildren(children: React.ReactNode) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <Text>{child}</Text>
    ) : (
      child
    ),
  );
}

function PopoverRootComponent({
  children,
  content,
  contentProps,
  triggerProps,
  ...props
}: PopoverProps) {
  if (content === undefined) {
    return <PopoverRoot {...props}>{children}</PopoverRoot>;
  }
  const renderedContent = resolveRenderProp(content, {});

  const triggerChildren = React.Children.toArray(children);
  const trigger = triggerChildren.length === 1 ? triggerChildren[0] : null;
  const triggerElement = React.isValidElement(trigger) ? (
    <PopoverTrigger {...triggerProps} asChild>
      {trigger}
    </PopoverTrigger>
  ) : (
    <PopoverTrigger {...triggerProps}>
      {normalizePopoverChildren(children)}
    </PopoverTrigger>
  );

  return (
    <PopoverRoot {...props}>
      {triggerElement}
      <PopoverContent {...contentProps}>{renderedContent}</PopoverContent>
    </PopoverRoot>
  );
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  portalHost,
  style,
  ...props
}: import("./types").PopoverContentProps) {
  const scopedPortalHost = useScopedOverlayPortalHostName();
  const resolvedPortalHost = portalHost ?? scopedPortalHost;
  const contentStyle = useOverlayPortalContentStyle(style);

  return (
    <PopoverPrimitive.Portal hostName={resolvedPortalHost}>
      <OverlayPortalWindow portalHost={resolvedPortalHost}>
        <PopoverPrimitive.Overlay
          style={Platform.select({ native: StyleSheet.absoluteFill })}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView
            entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextClassContext.Provider value="text-popover-foreground">
              <PopoverPrimitive.Content
                align={align}
                sideOffset={sideOffset}
                style={contentStyle as any}
                className={cn(
                  "bg-popover border-border outline-hidden z-50 w-72 rounded-md border p-4 shadow-md shadow-black/5",
                  Platform.select({
                    web: cn(
                      "animate-in fade-in-0 zoom-in-95 origin-(--radix-popover-content-transform-origin) cursor-auto",
                      props.side === "bottom" && "slide-in-from-top-2",
                      props.side === "top" && "slide-in-from-bottom-2",
                    ),
                  }),
                  className,
                )}
                {...props}
              />
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </PopoverPrimitive.Overlay>
      </OverlayPortalWindow>
    </PopoverPrimitive.Portal>
  );
}

const PopoverComponent = Object.assign(PopoverRootComponent, {
  Content: PopoverContent,
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
});

export { PopoverComponent as Popover };
