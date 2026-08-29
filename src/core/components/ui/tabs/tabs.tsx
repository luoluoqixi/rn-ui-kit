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
import type { TabsListProps, TabsProps, TabsSize, TabsTriggerProps } from "./types";

const TabsHapticsContext = React.createContext<NativeHapticsSetting | undefined>(undefined);
const TabsSizeContext = React.createContext<TabsSize>("default");

const tabsSizes: Record<TabsSize, { list: string; trigger: string; text: string }> = {
  default: { list: "h-10 p-[3px]", trigger: "gap-1.5 px-2.5 py-1", text: "text-base" },
  "2xs": { list: "h-7 p-0.5", trigger: "gap-1 px-1.5 py-0.5", text: "text-xs" },
  "xs": { list: "h-8 p-0.5", trigger: "gap-1 px-2 py-1", text: "text-xs" },
  "sm": { list: "h-9 p-[3px]", trigger: "gap-1.5 px-2 py-1", text: "text-sm" },
  "md": { list: "h-10 p-[3px]", trigger: "gap-1.5 px-2.5 py-1", text: "text-base" },
  "lg": { list: "h-11 p-[3px]", trigger: "gap-2 px-3 py-1.5", text: "text-base" },
  "xl": { list: "h-12 p-[3px]", trigger: "gap-2 px-4 py-1.5", text: "text-lg" },
  "2xl": { list: "h-14 p-1", trigger: "gap-2.5 px-5 py-2.5", text: "text-xl" },
};

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
  size = "default",
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
        <TabsSizeContext.Provider value={size}>{renderedChildren}</TabsSizeContext.Provider>
      </TabsHapticsContext.Provider>
    </TabsPrimitive.Root>
  );
}

function TabsList({ className, size, ...props }: TabsListProps) {
  const resolvedSize = size ?? React.useContext(TabsSizeContext);
  return (
    <TabsPrimitive.List
      className={cn(
        "bg-muted flex flex-row items-center justify-center rounded-lg",
        tabsSizes[resolvedSize].list,
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
  size,
  ...props
}: TabsTriggerProps) {
  const contextNativeHaptics = React.useContext(TabsHapticsContext);
  const resolvedSize = size ?? React.useContext(TabsSizeContext);
  const { value } = TabsPrimitive.useRootContext();
  const isActive = value === props.value;
  const [isPressed, setIsPressed] = React.useState(false);
  const inactiveTextInteractionClass =
    !isActive && !props.disabled
      ? cn(
          isPressed && "text-foreground dark:text-foreground",
          Platform.select({
            web: "group-hover:text-foreground group-active:text-foreground dark:group-hover:text-foreground dark:group-active:text-foreground",
          }),
        )
      : undefined;
  return (
    <TextClassContext.Provider
      value={cn(
        "text-foreground dark:text-muted-foreground font-medium",
        tabsSizes[resolvedSize].text,
        isActive ? "dark:text-foreground" : inactiveTextInteractionClass,
      )}
    >
      <TabsPrimitive.Trigger
        className={cn(
          "group flex flex-row items-center justify-center rounded-md border border-transparent shadow-none shadow-black/5",
          tabsSizes[resolvedSize].trigger,
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
