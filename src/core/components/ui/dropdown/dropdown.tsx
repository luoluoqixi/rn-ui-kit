import { Icon } from "../icon";
import type { DropdownItemData, DropdownProps } from "./types";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import {
  triggerNativeHaptics,
  useResolvedNativeHaptics,
  type NativeHapticsSetting,
} from "../utils";
import { resolveRenderProp } from "../utils/render";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import * as DropdownPrimitive from "@rn-primitives/dropdown-menu";
import { Check, ChevronDown, ChevronRight, ChevronUp } from "lucide-react-native";
import * as React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  useWindowDimensions,
} from "react-native";
import { FadeIn, ReduceMotion } from "react-native-reanimated";

const DROPDOWN_MENU_MAX_HEIGHT_RATIO = 0.45;

import { DropdownNative } from "./dropdown_native";
import { DropdownDefaultTrigger, DropdownNativeTrigger, resolveDropdownTrigger } from "./shared";

const DropdownNativeTriggerWithContext = React.forwardRef<
  View,
  Omit<React.ComponentProps<typeof DropdownNativeTrigger>, "open">
>(function DropdownNativeTriggerWithContext(props, ref) {
  const { open } = DropdownPrimitive.useRootContext();
  return <DropdownNativeTrigger {...props} open={open} ref={ref} />;
});

const DropdownPrimitiveRoot = DropdownPrimitive.Root;

const DropdownTrigger = DropdownPrimitive.Trigger;

const DropdownGroup = DropdownPrimitive.Group;

function DropdownPortal({
  hostName,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Portal>) {
  const scopedPortalHost = useScopedOverlayPortalHostName();
  return <DropdownPrimitive.Portal {...props} hostName={hostName ?? scopedPortalHost} />;
}

const DropdownSub = DropdownPrimitive.Sub;

const DropdownRadioGroup = DropdownPrimitive.RadioGroup;

const DropdownHapticsContext = React.createContext<{
  item?: NativeHapticsSetting;
}>({});

function DropdownSubTrigger({
  className,
  inset,
  children,
  iconClassName,
  nativeHaptics,
  onPress,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.SubTrigger> & {
  children?: React.ReactNode;
  iconClassName?: string;
  inset?: boolean;
  nativeHaptics?: NativeHapticsSetting;
}) {
  const { open } = DropdownPrimitive.useSubContext();
  const contextHaptics = React.useContext(DropdownHapticsContext);
  const disabled = props.disabled === true;
  const icon = Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm select-none",
        !disabled && "group-active:text-accent-foreground",
        open && "text-accent-foreground",
      )}
    >
      <DropdownPrimitive.SubTrigger
        className={cn(
          "group flex flex-row items-center justify-between rounded-sm px-2 py-2 sm:py-1.5",
          !disabled && "active:bg-accent",
          Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none [&_svg]:pointer-events-none",
          }),
          className,
          open && "bg-accent",
          inset && "pl-8",
        )}
        {...props}
        pointerEvents={disabled ? "none" : props.pointerEvents}
        onPress={(event) => {
          if (disabled) return;
          onPress?.(event);
          if (!event.defaultPrevented) {
            triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
          }
        }}
      >
        <>{children}</>
        <Icon as={icon} className={cn("text-foreground size-4 shrink-0", iconClassName)} />
      </DropdownPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
}

function DropdownSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.SubContent>) {
  return (
    <NativeOnlyAnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <DropdownPrimitive.SubContent
        className={cn(
          "bg-popover border-border overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5",
          Platform.select({
            web: "animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fade-in-0 data-[state=closed]:zoom-out-95 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin) z-50 min-w-[8rem]",
          }),
          className,
        )}
        {...props}
      />
    </NativeOnlyAnimatedView>
  );
}

function DropdownContent({
  align = "center",
  className,
  children,
  side: sideProp,
  itemNativeHaptics,
  overlayClassName,
  overlayStyle,
  portalHost,
  style,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Content> & {
  /** Internal value used to preserve item haptics across the primitive portal host. */
  itemNativeHaptics?: NativeHapticsSetting;
  overlayStyle?: StyleProp<ViewStyle>;
  overlayClassName?: string;
  portalHost?: string;
}) {
  const { height: windowHeight } = useWindowDimensions();
  const {
    triggerPosition,
    contentLayout,
    onOpenChange: setOpen,
    setTriggerPosition,
    setContentLayout,
  } = DropdownPrimitive.useRootContext();
  const availableAbove = triggerPosition?.pageY ?? 0;
  const availableBelow = triggerPosition
    ? windowHeight - triggerPosition.pageY - triggerPosition.height
    : windowHeight;
  const estimatedHeight = contentLayout?.height ?? windowHeight * DROPDOWN_MENU_MAX_HEIGHT_RATIO;
  const resolvedSide =
    Platform.OS === "web" || sideProp != null
      ? sideProp
      : availableBelow < estimatedHeight && availableAbove > availableBelow
        ? "top"
        : "bottom";
  const scopedPortalHost = useScopedOverlayPortalHostName();
  const resolvedPortalHost = portalHost ?? scopedPortalHost;
  const contentStyle = useOverlayPortalContentStyle(style);
  const resolvedChildren =
    typeof children === "function" ? children({ pressed: false } as any) : children;
  const handleNativeOverlayPress = (event: any) => {
    const target = event?.target ?? event?.nativeEvent?.target;
    const currentTarget = event?.currentTarget;
    if (target != null && currentTarget != null && target !== currentTarget) return;
    setTriggerPosition(null);
    setContentLayout(null);
    setOpen(false);
  };

  const handleWebOverlayPress = (event: any) => {
    // The portal content remains a child of the overlay on Web. Only a click
    // on the transparent viewport layer itself should close the menu; clicks
    // inside Content must keep their normal item handling.
    if (event?.target !== event?.currentTarget) return;
    setTriggerPosition(null);
    setContentLayout(null);
    setOpen(false);
  };

  return (
    <DropdownPrimitive.Portal hostName={resolvedPortalHost}>
      <OverlayPortalWindow portalHost={resolvedPortalHost}>
        <DropdownPrimitive.Overlay
          style={[
            Platform.OS === "web"
              ? ({
                  bottom: 0,
                  cursor: "default",
                  left: 0,
                  position: "fixed",
                  right: 0,
                  top: 0,
                  zIndex: 1,
                } as any)
              : StyleSheet.absoluteFillObject,
            overlayStyle,
          ]}
          pointerEvents="auto"
          className={overlayClassName}
          closeOnPress={Platform.OS === "web" ? undefined : false}
          onPress={Platform.OS === "web" ? handleWebOverlayPress : handleNativeOverlayPress}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)} as="View">
            {Platform.OS !== "web" ? (
              <Pressable onPress={handleNativeOverlayPress} style={StyleSheet.absoluteFillObject} />
            ) : null}
            <DropdownHapticsContext.Provider value={{ item: itemNativeHaptics }}>
              <TextClassContext.Provider value="text-popover-foreground">
                <DropdownPrimitive.Content
                  style={
                    [
                      Platform.OS === "web"
                        ? {
                            maxHeight: windowHeight * DROPDOWN_MENU_MAX_HEIGHT_RATIO,
                            zIndex: 50,
                          }
                        : { maxHeight: windowHeight * DROPDOWN_MENU_MAX_HEIGHT_RATIO },
                      contentStyle as any,
                    ] as any
                  }
                  className={cn(
                    "bg-popover border-border min-w-[8rem] overflow-x-hidden rounded-md border p-1 shadow-lg shadow-black/5",
                    Platform.select({
                      web: cn(
                        cn(
                          "animate-in fade-in-0 zoom-in-95 max-h-[45vh] overflow-y-auto origin-(--radix-context-menu-content-transform-origin) z-50 cursor-default",
                          "ui-menu-scrollbar",
                        ),
                        resolvedSide === "bottom" && "slide-in-from-top-2",
                        resolvedSide === "top" && "slide-in-from-bottom-2",
                      ),
                    }),
                    className,
                  )}
                  {...props}
                  asChild
                  align={align}
                  side={resolvedSide}
                >
                  <View collapsable={false}>
                    {Platform.OS === "web" ? (
                      resolvedChildren
                    ) : (
                      <ScrollView
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                        onMoveShouldSetResponderCapture={() => true}
                        style={{ maxHeight: windowHeight * DROPDOWN_MENU_MAX_HEIGHT_RATIO }}
                      >
                        {resolvedChildren}
                      </ScrollView>
                    )}
                  </View>
                </DropdownPrimitive.Content>
              </TextClassContext.Provider>
            </DropdownHapticsContext.Provider>
          </NativeOnlyAnimatedView>
        </DropdownPrimitive.Overlay>
      </OverlayPortalWindow>
    </DropdownPrimitive.Portal>
  );
}

function DropdownItem({
  className,
  disabled,
  inset,
  nativeHaptics,
  onPress,
  variant,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Item> & {
  className?: string;
  inset?: boolean;
  nativeHaptics?: NativeHapticsSetting;
  variant?: "default" | "destructive";
}) {
  const contextHaptics = React.useContext(DropdownHapticsContext);
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-popover-foreground",
        !disabled && "group-active:text-popover-foreground",
        variant === "destructive" && "text-destructive",
        variant === "destructive" && !disabled && "group-active:text-destructive",
      )}
    >
      <DropdownPrimitive.Item
        className={cn(
          "group relative flex flex-row items-center gap-2 rounded-sm px-2 py-2 sm:py-1.5",
          !disabled && "active:bg-accent",
          Platform.select({
            web: cn(
              "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
              variant === "destructive" && "focus:bg-destructive/10 dark:focus:bg-destructive/20",
            ),
          }),
          !disabled &&
            variant === "destructive" &&
            "active:bg-destructive/10 dark:active:bg-destructive/20",
          disabled && "opacity-50",
          inset && "pl-8",
          className,
        )}
        {...props}
        disabled={disabled}
        // Disabled rows are transparent to native touch handling so a drag that
        // begins on one still belongs to the menu ScrollView.
        pointerEvents={disabled ? "none" : props.pointerEvents}
        onPress={(event) => {
          if (disabled) return;
          onPress?.(event);
          if (!event.defaultPrevented) {
            triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
          }
        }}
      />
    </TextClassContext.Provider>
  );
}

function DropdownCheckboxItem({
  className,
  children,
  disabled,
  nativeHaptics,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.CheckboxItem> & {
  children?: React.ReactNode;
  nativeHaptics?: NativeHapticsSetting;
}) {
  const contextHaptics = React.useContext(DropdownHapticsContext);
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm text-popover-foreground select-none",
        !disabled && "group-active:text-accent-foreground",
      )}
    >
      <DropdownPrimitive.CheckboxItem
        className={cn(
          "group relative flex flex-row items-center gap-2 rounded-sm py-2 pl-8 pr-2 sm:py-1.5",
          !disabled && "active:bg-accent",
          Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
          }),
          disabled && "opacity-50 disabled:active:bg-transparent",
          className,
        )}
        {...props}
        disabled={disabled}
        pointerEvents={disabled ? "none" : props.pointerEvents}
        onCheckedChange={(checked) => {
          if (disabled) return;
          onCheckedChange?.(checked);
          triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
        }}
      >
        <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <DropdownPrimitive.ItemIndicator>
            <Icon
              as={Check}
              className={cn(
                "text-foreground size-4",
                Platform.select({ web: "pointer-events-none" }),
              )}
            />
          </DropdownPrimitive.ItemIndicator>
        </View>
        <>{children}</>
      </DropdownPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  );
}

function DropdownRadioItem({
  className,
  children,
  disabled,
  nativeHaptics,
  onPress,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.RadioItem> & {
  children?: React.ReactNode;
  nativeHaptics?: NativeHapticsSetting;
}) {
  const contextHaptics = React.useContext(DropdownHapticsContext);
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm text-popover-foreground select-none",
        !disabled && "group-active:text-accent-foreground",
      )}
    >
      <DropdownPrimitive.RadioItem
        className={cn(
          "group relative flex flex-row items-center gap-2 rounded-sm py-2 pl-8 pr-2 sm:py-1.5",
          !disabled && "active:bg-accent",
          Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
          }),
          disabled && "opacity-50 disabled:active:bg-transparent",
          className,
        )}
        {...props}
        disabled={disabled}
        pointerEvents={disabled ? "none" : props.pointerEvents}
        onPress={(event) => {
          if (disabled) return;
          onPress?.(event);
          if (!event.defaultPrevented) {
            triggerNativeHaptics(nativeHaptics ?? contextHaptics.item);
          }
        }}
      >
        <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <DropdownPrimitive.ItemIndicator>
            <View className="bg-foreground h-2 w-2 rounded-full" />
          </DropdownPrimitive.ItemIndicator>
        </View>
        <>{children}</>
      </DropdownPrimitive.RadioItem>
    </TextClassContext.Provider>
  );
}

function DropdownLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Label> & {
  className?: string;
  inset?: boolean;
}) {
  return (
    <DropdownPrimitive.Label
      className={cn(
        "text-foreground px-2 py-2 text-sm font-medium sm:py-1.5",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Separator>) {
  return (
    <DropdownPrimitive.Separator
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
      // Separators are decoration. Let a drag started here reach the ScrollView.
      pointerEvents="none"
    />
  );
}

function DropdownShortcut({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

function renderDropdownItems(
  items: DropdownItemData[],
  itemProps?: Record<string, unknown>,
  defaultNativeHaptics?: NativeHapticsSetting,
  depth = 0,
): React.ReactNode {
  return items.map((item, index) => {
    const key = `${depth}:${item.value}:${index}`;
    if (item.separator) return <DropdownSeparator key={key} />;
    const label = resolveRenderProp(item.label, item) ?? item.textValue ?? item.value;
    const resolvedItemProps = {
      ...(itemProps ?? {}),
      ...(item.itemProps ?? {}),
    };
    const itemHaptics =
      item.nativeHaptics ??
      (resolvedItemProps.nativeHaptics as NativeHapticsSetting | undefined) ??
      defaultNativeHaptics;
    if (item.subMenu?.length) {
      return (
        <DropdownSub {...(item.subMenuProps as object)} key={key}>
          <DropdownSubTrigger
            {...(item.triggerProps as object)}
            aria-label={
              item["aria-label"] ?? (item.triggerProps?.["aria-label"] as string | undefined)
            }
            disabled={item.disabled ?? (item.triggerProps?.disabled as boolean | undefined)}
            nativeHaptics={itemHaptics}
          >
            <Text>{label}</Text>
          </DropdownSubTrigger>
          <DropdownSubContent {...(item.contentProps as object)}>
            {item.subMenuTitle === false ? null : (
              <DropdownLabel>{resolveRenderProp(item.subMenuTitle, item) ?? label}</DropdownLabel>
            )}
            {renderDropdownItems(item.subMenu, itemProps, defaultNativeHaptics, depth + 1)}
          </DropdownSubContent>
        </DropdownSub>
      );
    }
    return (
      <DropdownItem
        {...resolvedItemProps}
        aria-label={item["aria-label"] ?? (resolvedItemProps["aria-label"] as string | undefined)}
        disabled={item.disabled ?? (resolvedItemProps.disabled as boolean | undefined)}
        key={key}
        nativeHaptics={itemHaptics}
        onPress={
          item.onSelect ??
          item.onPress ??
          (resolvedItemProps.onPress as ((event: any) => void) | undefined)
        }
        textValue={item.textValue ?? (resolvedItemProps.textValue as string | undefined)}
        variant={
          item.destructive === true
            ? "destructive"
            : item.destructive === false
              ? "default"
              : (resolvedItemProps.variant as "default" | "destructive" | undefined)
        }
      >
        <Text>{label}</Text>
        {resolveRenderProp(item.icon, item)}
        {resolveRenderProp(item.indicator, item)}
      </DropdownItem>
    );
  });
}

function Dropdown({
  children,
  contentProps,
  __nativeDetachedAnchor,
  __menuRef,
  defaultOpen,
  disabled,
  items,
  itemProps,
  itemNativeHaptics,
  native = Platform.OS !== "web",
  nativeAnchorAlignment,
  nativeHaptics,
  nativeSelectedItemBackgroundColor,
  nativeTrigger,
  nativeTriggerContainerStyle,
  nativeTriggerContent,
  nativeTriggerIcon,
  nativeTriggerLabelProps,
  nativeTriggerProps,
  nativeTriggerFeedbackOpacity,
  nativeTriggerHoverBackground,
  nativeContentProps,
  open,
  onOpenChange,
  onOpenWillChange,
  trigger,
  triggerClassName,
  triggerLabel,
  triggerProps,
  ...props
}: DropdownProps) {
  if (native && Platform.OS !== "web") {
    return React.createElement(DropdownNative as React.ComponentType<any>, {
      ...props,
      children,
      __nativeDetachedAnchor,
      __menuRef,
      defaultOpen,
      disabled,
      items,
      itemProps,
      itemNativeHaptics,
      nativeAnchorAlignment,
      nativeHaptics,
      nativeSelectedItemBackgroundColor,
      nativeTrigger,
      nativeTriggerContainerStyle,
      nativeTriggerContent,
      nativeTriggerIcon,
      nativeTriggerLabelProps,
      nativeTriggerProps,
      nativeTriggerFeedbackOpacity,
      nativeTriggerHoverBackground,
      nativeContentProps,
      onOpenChange,
      onOpenWillChange,
      open,
      trigger,
      triggerClassName,
      triggerLabel,
      triggerProps,
    });
  }

  const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
  // Item feedback inherits the dropdown setting unless an item-specific
  // setting was supplied. This keeps generated items consistent with the
  // trigger and with native dropdown rendering.
  const resolvedItemHaptics = useResolvedNativeHaptics(itemNativeHaptics ?? nativeHaptics);
  const generated = items != null || trigger != null || nativeTrigger === true;
  const resolvedDisabled = disabled ?? triggerProps?.disabled;
  const triggerRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (__menuRef == null) return;
    __menuRef.current = {
      presentMenu: () => triggerRef.current?.open?.(),
    };
    return () => {
      __menuRef.current = null;
    };
  }, [__menuRef]);

  return (
    <DropdownHapticsContext.Provider value={{ item: resolvedItemHaptics }}>
      <DropdownPrimitiveRoot
        {...props}
        {...(defaultOpen === undefined ? {} : { defaultOpen })}
        {...(open === undefined ? {} : { open })}
        onOpenChange={(open) => {
          if (resolvedDisabled && open) return;
          onOpenWillChange?.(open);
          if (open) triggerNativeHaptics(resolvedHaptics);
          onOpenChange?.(open);
        }}
      >
        {generated ? (
          <>
            {nativeTrigger ? (
              <DropdownTrigger
                ref={triggerRef}
                {...(triggerProps as object)}
                asChild
                disabled={resolvedDisabled}
              >
                <DropdownNativeTriggerWithContext
                  className={triggerClassName}
                  containerStyle={nativeTriggerContainerStyle}
                  content={nativeTriggerContent}
                  disabled={resolvedDisabled}
                  icon={nativeTriggerIcon}
                  label={triggerLabel}
                  labelProps={nativeTriggerLabelProps}
                  nativeTriggerProps={nativeTriggerProps}
                  nativeTriggerFeedbackOpacity={nativeTriggerFeedbackOpacity}
                  nativeTriggerHoverBackground={nativeTriggerHoverBackground}
                  trigger={trigger}
                />
              </DropdownTrigger>
            ) : trigger != null ? (
              <DropdownTrigger
                ref={triggerRef}
                {...(triggerProps as object)}
                asChild
                disabled={resolvedDisabled}
              >
                {resolveDropdownTrigger(trigger, { native: false, open: false }, resolvedDisabled)}
              </DropdownTrigger>
            ) : items != null ? (
              <DropdownTrigger
                ref={triggerRef}
                {...(triggerProps as object)}
                asChild
                disabled={resolvedDisabled}
              >
                <DropdownDefaultTrigger
                  className={triggerClassName}
                  disabled={resolvedDisabled}
                  label={resolveRenderProp(triggerLabel, { native: false, open: false })}
                  props={triggerProps}
                />
              </DropdownTrigger>
            ) : null}
            {items != null ? (
              <DropdownContent
                {...(contentProps as object)}
                itemNativeHaptics={resolvedItemHaptics}
              >
                {renderDropdownItems(items, itemProps, resolvedItemHaptics)}
              </DropdownContent>
            ) : null}
            {children}
          </>
        ) : (
          children
        )}
      </DropdownPrimitiveRoot>
    </DropdownHapticsContext.Provider>
  );
}

const DropdownComponent = Object.assign(Dropdown, {
  CheckboxItem: DropdownCheckboxItem,
  Content: DropdownContent,
  Group: DropdownGroup,
  Item: DropdownItem,
  Label: DropdownLabel,
  Portal: DropdownPortal,
  RadioGroup: DropdownRadioGroup,
  RadioItem: DropdownRadioItem,
  Root: Dropdown,
  Separator: DropdownSeparator,
  Shortcut: DropdownShortcut,
  Sub: DropdownSub,
  SubContent: DropdownSubContent,
  SubTrigger: DropdownSubTrigger,
  Trigger: DropdownTrigger,
});

export { DropdownComponent as Dropdown };
