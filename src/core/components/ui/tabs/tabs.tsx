import { TextClassContext } from "../text";
import { Text } from "../text";
import { cn } from "../utils/cn";
import {
  triggerNativeHaptics,
  useResolvedNativeHaptics,
  type NativeHapticsSetting,
} from "../utils";
import { resolveRenderProp } from "../utils/render";
import * as TabsPrimitive from "@rn-primitives/tabs";
import * as React from "react";
import { Platform } from "react-native";
import type { TabsProps } from "./types";

const TabsHapticsContext = React.createContext<NativeHapticsSetting | undefined>(undefined);
const INACTIVE_TAB_TEXT_PRESS_OPACITY_CLASS = "opacity-70";
const INACTIVE_TAB_TEXT_WEB_HOVER_OPACITY_CLASS = "group-hover:opacity-80";
const INACTIVE_TAB_TEXT_WEB_PRESS_OPACITY_CLASS = "group-active:opacity-70";

function normalizeTabsChildren(children: unknown) {
  if (typeof children === "function") return children as any;
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
  ) as React.ReactNode;
}

function Tabs({
  children,
  className,
  contentProps,
  items,
  listProps,
  nativeHaptics,
  triggerProps,
  ...props
}: TabsProps) {
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics, {
    defaultEnabled: true,
  });
  const renderedChildren =
    children ??
    (items != null ? (
      <>
        <TabsList {...listProps}>
          {items.map((item) => (
            <TabsTrigger
              {...triggerProps}
              {...item.triggerProps}
              disabled={item.disabled ?? item.triggerProps?.disabled ?? triggerProps?.disabled}
              key={item.value}
              value={item.value}
              nativeHaptics={resolvedNativeHaptics}
            >
              {resolveRenderProp(item.title, item)}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabsContent {...contentProps} {...item.contentProps} key={item.value} value={item.value}>
            {resolveRenderProp(item.content, item)}
          </TabsContent>
        ))}
      </>
    ) : null);
  return (
    <TabsPrimitive.Root className={cn("flex flex-col gap-2", className)} {...props}>
      <TabsHapticsContext.Provider value={resolvedNativeHaptics}>
        {renderedChildren}
      </TabsHapticsContext.Provider>
    </TabsPrimitive.Root>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "bg-muted flex h-9 flex-row items-center justify-center rounded-lg p-[3px]",
        Platform.select({ web: "inline-flex w-fit", native: "mr-auto" }),
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  children,
  nativeHaptics,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  nativeHaptics?: NativeHapticsSetting;
}) {
  const contextNativeHaptics = React.useContext(TabsHapticsContext);
  const { value } = TabsPrimitive.useRootContext();
  const isActive = value === props.value;
  const [isPressed, setIsPressed] = React.useState(false);
  const inactiveTextInteractionClass =
    !isActive && !props.disabled
      ? cn(
          isPressed && INACTIVE_TAB_TEXT_PRESS_OPACITY_CLASS,
          Platform.select({
            web: cn(
              INACTIVE_TAB_TEXT_WEB_HOVER_OPACITY_CLASS,
              INACTIVE_TAB_TEXT_WEB_PRESS_OPACITY_CLASS,
            ),
          }),
        )
      : undefined;
  return (
    <TextClassContext.Provider
      value={cn(
        "text-foreground dark:text-muted-foreground text-sm font-medium",
        isActive ? "dark:text-foreground" : inactiveTextInteractionClass,
      )}
    >
      <TabsPrimitive.Trigger
        className={cn(
          "group flex flex-row items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 shadow-none shadow-black/5",
          Platform.select({
            web: "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring web:h-[calc(100%-1px)] inline-flex cursor-default whitespace-nowrap transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
          }),
          props.disabled && "opacity-50",
          isActive && "bg-background dark:border-foreground/10 dark:bg-input/30",
          className,
        )}
        {...props}
        onPress={(event) => {
          onPress?.(event);
          if (!event.defaultPrevented) triggerNativeHaptics(nativeHaptics ?? contextNativeHaptics);
        }}
        onPressIn={(event) => {
          setIsPressed(true);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          setIsPressed(false);
          onPressOut?.(event);
        }}
      >
        {normalizeTabsChildren(children)}
      </TabsPrimitive.Trigger>
    </TextClassContext.Provider>
  );
}

function TabsContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(Platform.select({ web: "flex-1 outline-none" }), className)}
      {...props}
    >
      {normalizeTabsChildren(children)}
    </TabsPrimitive.Content>
  );
}

const TabsComponent = Object.assign(Tabs, {
  Content: TabsContent,
  List: TabsList,
  Root: Tabs,
  Trigger: TabsTrigger,
});

export { TabsComponent as Tabs };
