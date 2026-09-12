import { Icon } from "../icon";
import { Text, TextClassContext } from "../text";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { cn } from "../utils/cn";
import { resolveRenderProp } from "../utils/render";
import * as AccordionPrimitive from "@rn-primitives/accordion";
import { ChevronDown } from "lucide-react-native";
import { Children, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import type {
  AccordionContentProps,
  AccordionItemData,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from "./types";

function Accordion({
  children,
  contentClassName,
  contentProps,
  headerProps,
  itemProps,
  items,
  nativeHaptics,
  titleClassName,
  ref,
  triggerProps,
  onValueChange,
  ...props
}: AccordionProps) {
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
  const generatedChildren =
    children ??
    items?.map((item) => {
      const title = resolveRenderProp(item.title, item);
      const content = resolveRenderProp(item.content, item);

      return (
        <AccordionItem
          {...itemProps}
          {...item.itemProps}
          disabled={item.disabled ?? item.itemProps?.disabled ?? itemProps?.disabled}
          key={item.value}
          value={item.value}
        >
          <AccordionTrigger
            {...triggerProps}
            {...item.triggerProps}
            className={cn(
              triggerProps?.className,
              item.triggerProps?.className,
              titleClassName,
              item.titleClassName,
            )}
            aria-label={resolveAriaLabel(
              item["aria-label"] ??
                item.triggerProps?.["aria-label"] ??
                triggerProps?.["aria-label"],
              title,
            )}
            headerProps={item.headerProps ?? headerProps}
          >
            {title}
          </AccordionTrigger>
          <AccordionContent
            {...contentProps}
            {...item.contentProps}
            className={cn(contentProps?.className, item.contentProps?.className, contentClassName)}
          >
            {content}
          </AccordionContent>
        </AccordionItem>
      );
    });

  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        {...(props as AccordionPrimitive.RootProps)}
        onValueChange={(nextValue: string | string[] | undefined) => {
          onValueChange?.(nextValue as never);
          triggerNativeHaptics(resolvedNativeHaptics);
        }}
        asChild={Platform.OS !== "web"}
      >
        <Animated.View layout={LinearTransition.duration(200)}>{generatedChildren}</Animated.View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  );
}

function AccordionItem({ children, className, value, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "border-border border-b",
        Platform.select({ web: "last:border-b-0" }),
        className,
      )}
      value={value}
      asChild
      {...props}
    >
      <Animated.View
        className="native:overflow-hidden"
        layout={Platform.select({ native: LinearTransition.duration(200) })}
      >
        {children}
      </Animated.View>
    </AccordionPrimitive.Item>
  );
}

const Trigger = Platform.OS === "web" ? View : Pressable;

// React Native cannot render a bare string directly inside Pressable/View.
// Keep the compound API ergonomic by normalizing text children at the boundary.
function normalizeAccordionChildren(children: React.ReactNode) {
  return Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
  );
}

function normalizeAccordionTriggerChildren(children: AccordionTriggerProps["children"]) {
  if (typeof children === "function") return children;
  return normalizeAccordionChildren(children);
}

function AccordionTrigger({
  className,
  children,
  headerProps,
  onPressIn,
  onPressOut,
  ...props
}: AccordionTriggerProps) {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  const [isPressed, setIsPressed] = useState(false);

  const progress = useDerivedValue(
    () => (isExpanded ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 })),
    [isExpanded],
  );
  const chevronStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${progress.value * 180}deg` }],
    }),
    [progress],
  );

  return (
    <TextClassContext.Provider
      value={cn(
        "text-left text-sm font-medium",
        isPressed && "underline",
        Platform.select({ web: "group-hover:underline" }),
      )}
    >
      <AccordionPrimitive.Header {...headerProps}>
        <AccordionPrimitive.Trigger
          {...props}
          asChild={Platform.OS !== "web"}
          onPressIn={(event) => {
            setIsPressed(true);
            onPressIn?.(event);
          }}
          onPressOut={(event) => {
            setIsPressed(false);
            onPressOut?.(event);
          }}
        >
          <Trigger
            className={cn(
              "active:bg-muted flex-row items-start justify-between gap-4 px-2 py-4 disabled:opacity-50",
              Platform.select({
                web: "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 outline-none transition-colors hover:bg-muted hover:underline focus-visible:ring-[3px] disabled:pointer-events-none [&[data-state=open]>svg]:rotate-180",
              }),
              className,
            )}
          >
            <>{normalizeAccordionTriggerChildren(children)}</>
            <Animated.View style={chevronStyle}>
              <Icon
                as={ChevronDown}
                size={16}
                className={cn(
                  "text-muted-foreground shrink-0",
                  Platform.select({
                    web: "pointer-events-none translate-y-0.5 transition-transform duration-200",
                  }),
                )}
              />
            </Animated.View>
          </Trigger>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  );
}

function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  return (
    <TextClassContext.Provider value="text-sm">
      <AccordionPrimitive.Content
        className={cn(
          "overflow-hidden",
          Platform.select({
            web: isExpanded ? "animate-accordion-down" : "animate-accordion-up",
          }),
        )}
        {...props}
      >
        <Animated.View
          exiting={Platform.select({
            native: FadeOutUp.duration(200).reduceMotion(ReduceMotion.System),
          })}
          className={cn("px-2 pb-4", className)}
        >
          {normalizeAccordionChildren(children)}
        </Animated.View>
      </AccordionPrimitive.Content>
    </TextClassContext.Provider>
  );
}

const AccordionComponent = Object.assign(Accordion, {
  Content: AccordionContent,
  Item: AccordionItem,
  Root: Accordion,
  Trigger: AccordionTrigger,
});

export { AccordionComponent as Accordion };
