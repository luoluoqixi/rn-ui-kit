import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { resolveRenderProp } from "../utils/render";
import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { FadeInDown, FadeInUp, FadeOut, ReduceMotion } from "react-native-reanimated";
import type { TooltipProps, TooltipSize } from "./types";

const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipSizeContext = React.createContext<TooltipSize>("default");

const tooltipSizes: Record<TooltipSize, { content: string; text: string }> = {
  default: { content: "px-3 py-1.5", text: "text-sm" },
  "2xs": { content: "px-2 py-1", text: "text-[10px]" },
  "xs": { content: "px-2.5 py-1", text: "text-xs" },
  "sm": { content: "px-2.5 py-1.5", text: "text-sm" },
  "md": { content: "px-3 py-1.5", text: "text-sm" },
  "lg": { content: "px-3.5 py-2", text: "text-lg" },
  "xl": { content: "px-4 py-2.5", text: "text-xl" },
  "2xl": { content: "px-5 py-3", text: "text-2xl" },
};

function normalizeTooltipChildren(children: React.ReactNode) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
  );
}

function TooltipRootComponent({
  children,
  content,
  contentProps,
  size = "default",
  triggerProps,
  ...props
}: TooltipProps) {
  if (content === undefined) {
    return (
      <TooltipRoot {...props}>
        <TooltipSizeContext.Provider value={size}>{children}</TooltipSizeContext.Provider>
      </TooltipRoot>
    );
  }
  const renderedContent = resolveRenderProp(content, {});

  const triggerChildren = React.Children.toArray(children);
  const trigger = triggerChildren.length === 1 ? triggerChildren[0] : null;
  const triggerElement = React.isValidElement(trigger) ? (
    <TooltipTrigger {...triggerProps} asChild>
      {trigger}
    </TooltipTrigger>
  ) : (
    <TooltipTrigger {...triggerProps}>{normalizeTooltipChildren(children)}</TooltipTrigger>
  );

  return (
    <TooltipRoot {...props}>
      {triggerElement}
      <TooltipContent {...contentProps} size={contentProps?.size ?? size}>
        {renderedContent}
      </TooltipContent>
    </TooltipRoot>
  );
}

function TooltipContent({
  className,
  children,
  sideOffset = 4,
  portalHost,
  side = "top",
  size: sizeProp,
  style,
  ...props
}: import("./types").TooltipContentProps) {
  const size = sizeProp ?? React.useContext(TooltipSizeContext);
  const scopedPortalHost = useScopedOverlayPortalHostName();
  const resolvedPortalHost = portalHost ?? scopedPortalHost;
  const contentStyle = useOverlayPortalContentStyle(style);

  return (
    <TooltipPrimitive.Portal hostName={resolvedPortalHost}>
      <OverlayPortalWindow portalHost={resolvedPortalHost}>
        <TooltipPrimitive.Overlay
          style={Platform.select({ native: StyleSheet.absoluteFill })}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView
            entering={
              side === "top"
                ? FadeInDown.withInitialValues({
                    transform: [{ translateY: 3 }],
                  })
                    .duration(150)
                    .reduceMotion(ReduceMotion.System)
                : FadeInUp.withInitialValues({
                    transform: [{ translateY: -5 }],
                  }).reduceMotion(ReduceMotion.System)
            }
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextClassContext.Provider
              value={cn(tooltipSizes[size].text, "text-primary-foreground")}
            >
              <TooltipPrimitive.Content
                sideOffset={sideOffset}
                style={contentStyle as any}
                className={cn(
                  cn("bg-primary z-50 rounded-md", tooltipSizes[size].content),
                  Platform.select({
                    web: cn(
                      "animate-in fade-in-0 zoom-in-95 origin-(--radix-tooltip-content-transform-origin) w-fit text-balance",
                      side === "bottom" && "slide-in-from-top-2",
                      side === "left" && "slide-in-from-right-2",
                      side === "right" && "slide-in-from-left-2",
                      side === "top" && "slide-in-from-bottom-2",
                    ),
                  }),
                  className,
                )}
                side={side}
                {...props}
              >
                {React.Children.map(children, (child) =>
                  typeof child === "string" || typeof child === "number" ? (
                    <Text>{child}</Text>
                  ) : (
                    child
                  ),
                )}
              </TooltipPrimitive.Content>
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </TooltipPrimitive.Overlay>
      </OverlayPortalWindow>
    </TooltipPrimitive.Portal>
  );
}

const Tooltip = Object.assign(TooltipRootComponent, {
  Content: TooltipContent,
  Overlay: TooltipPrimitive.Overlay,
  Portal: function TooltipPortal({
    hostName,
    ...props
  }: React.ComponentProps<typeof TooltipPrimitive.Portal>) {
    const scopedPortalHost = useScopedOverlayPortalHostName();
    return <TooltipPrimitive.Portal {...props} hostName={hostName ?? scopedPortalHost} />;
  },
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
});

export { Tooltip };
