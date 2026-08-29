import { Icon } from "../icon";
import type {
  ContextMenuArrowProps,
  ContextMenuAuxiliaryProps,
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuItemComponentProps,
  ContextMenuItemData,
  ContextMenuItemIconProps,
  ContextMenuItemImageProps,
  ContextMenuItemSubtitleProps,
  ContextMenuItemTitleProps,
  ContextMenuLabelProps,
  ContextMenuPreviewProps,
  ContextMenuProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubContentProps,
  ContextMenuSubTriggerProps,
} from "./types";
import { ContextMenuNative } from "./context_menu_native";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import type { NativeHapticsSetting } from "../utils";
import { resolveRenderProp } from "../utils/render";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { semanticColorsToVariables, useUiTheme } from "../utils/theme";
import * as ContextMenuPrimitive from "@rn-primitives/context-menu";
import { Check, ChevronDown, ChevronRight, ChevronUp } from "lucide-react-native";
import * as React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { FadeIn, ReduceMotion } from "react-native-reanimated";

const ContextMenuPrimitiveRoot = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
const CONTEXT_MENU_MAX_HEIGHT_RATIO = 0.45;

const ContextMenuHapticsContext = React.createContext<{
  item?: NativeHapticsSetting;
}>({});

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  iconClassName,
  nativeHaptics,
  onPress,
  ...props
}: ContextMenuSubTriggerProps) {
  const { open } = ContextMenuPrimitive.useSubContext();
  const contextHaptics = React.useContext(ContextMenuHapticsContext);
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
      <ContextMenuPrimitive.SubTrigger
        className={cn(
          "group flex flex-row items-center justify-between rounded-sm px-2 py-2 sm:py-1.5",
          !disabled && "active:bg-accent",
          Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none [&_svg]:pointer-events-none",
          }),
          className,
          open && cn("bg-accent", Platform.select({ native: "mb-1" })),
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
      </ContextMenuPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
}

function ContextMenuSubContent({ className, style, ...props }: ContextMenuSubContentProps) {
  const theme = useUiTheme();

  return (
    <NativeOnlyAnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <ContextMenuPrimitive.SubContent
        className={cn(
          "bg-popover border-border overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5",
          Platform.select({
            web: "animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fade-in-0 data-[state=closed]:zoom-out-95 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin) z-50 min-w-[8rem]",
          }),
          className,
        )}
        // The web primitive renders SubContent through its own Radix portal,
        // outside the provider-scoped variables applied by OverlayPortalWindow.
        style={
          [
            Platform.OS === "web" ? (semanticColorsToVariables(theme) as any) : null,
            style,
          ] as any
        }
        {...props}
      />
    </NativeOnlyAnimatedView>
  );
}

function ContextMenuContent({
  className,
  overlayClassName,
  overlayStyle,
  portalHost,
  style,
  itemNativeHaptics,
  side: sideProp,
  children,
  ...props
}: ContextMenuContentProps) {
  const { height: windowHeight } = useWindowDimensions();
  const {
    pressPosition: triggerPosition,
    contentLayout,
    onOpenChange: setOpen,
    setPressPosition,
    setContentLayout,
  } = ContextMenuPrimitive.useRootContext();
  const availableAbove = triggerPosition?.pageY ?? 0;
  const availableBelow = triggerPosition
    ? windowHeight - triggerPosition.pageY - triggerPosition.height
    : windowHeight;
  const estimatedHeight = contentLayout?.height ?? windowHeight * CONTEXT_MENU_MAX_HEIGHT_RATIO;
  const resolvedSide =
    Platform.OS === "web" || sideProp != null
      ? sideProp
      : availableBelow < estimatedHeight && availableAbove > availableBelow
        ? "top"
        : "bottom";
  const scopedPortalHost = useScopedOverlayPortalHostName();
  const resolvedPortalHost = portalHost ?? scopedPortalHost;
  const contentStyle = useOverlayPortalContentStyle(style);
  const resolvedContentStyle = StyleSheet.flatten(contentStyle as any) as Record<string, unknown>;
  const inheritedHaptics = React.useContext(ContextMenuHapticsContext);
  const handleNativeOverlayPress = (event: any) => {
    const target = event?.target ?? event?.nativeEvent?.target;
    const currentTarget = event?.currentTarget;
    if (target != null && currentTarget != null && target !== currentTarget) return;
    setPressPosition(null);
    setContentLayout(null);
    setOpen(false);
  };

  return (
    <ContextMenuPrimitive.Portal hostName={resolvedPortalHost}>
      <OverlayPortalWindow portalHost={resolvedPortalHost}>
        <ContextMenuPrimitive.Overlay
          style={[Platform.OS === "web" ? undefined : StyleSheet.absoluteFillObject, overlayStyle]}
          className={overlayClassName}
          closeOnPress={Platform.OS === "web" ? undefined : false}
          onPress={Platform.OS === "web" ? undefined : handleNativeOverlayPress}
          asChild={Platform.OS !== "web"}
        >
          <NativeOnlyAnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)} as="View">
            {Platform.OS !== "web" ? (
              <Pressable onPress={handleNativeOverlayPress} style={StyleSheet.absoluteFillObject} />
            ) : null}
            <TextClassContext.Provider value="text-popover-foreground">
              <ContextMenuHapticsContext.Provider
                value={{ item: itemNativeHaptics ?? inheritedHaptics.item }}
              >
                <ContextMenuPrimitive.Content
                  style={
                    {
                      maxHeight: windowHeight * CONTEXT_MENU_MAX_HEIGHT_RATIO,
                      ...resolvedContentStyle,
                    } as any
                  }
                  className={cn(
                    "bg-popover border-border min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5",
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
                  side={resolvedSide}
                  {...props}
                  asChild
                  // The primitive Content claims the responder on touch start by
                  // default. Let the nested ScrollView own drag gestures instead.
                  onStartShouldSetResponder={() => false}
                >
                  <View collapsable={false}>
                    {Platform.OS === "web" ? (
                      children
                    ) : (
                      <ScrollView
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                        onMoveShouldSetResponderCapture={() => true}
                        style={{ maxHeight: windowHeight * CONTEXT_MENU_MAX_HEIGHT_RATIO }}
                      >
                        {children}
                      </ScrollView>
                    )}
                  </View>
                </ContextMenuPrimitive.Content>
              </ContextMenuHapticsContext.Provider>
            </TextClassContext.Provider>
          </NativeOnlyAnimatedView>
        </ContextMenuPrimitive.Overlay>
      </OverlayPortalWindow>
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  disabled,
  inset,
  nativeHaptics,
  onPress,
  variant,
  ...props
}: ContextMenuItemComponentProps) {
  const contextHaptics = React.useContext(ContextMenuHapticsContext);
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-popover-foreground",
        !disabled && "group-active:text-popover-foreground",
        variant === "destructive" && "text-destructive",
        variant === "destructive" && !disabled && "group-active:text-destructive",
      )}
    >
      <ContextMenuPrimitive.Item
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

function ContextMenuCheckboxItem({
  className,
  children,
  disabled,
  nativeHaptics,
  onCheckedChange,
  ...props
}: ContextMenuCheckboxItemProps) {
  const contextHaptics = React.useContext(ContextMenuHapticsContext);
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm text-popover-foreground select-none",
        !disabled && "group-active:text-accent-foreground",
      )}
    >
      <ContextMenuPrimitive.CheckboxItem
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
          <ContextMenuPrimitive.ItemIndicator>
            <Icon
              as={Check}
              className={cn(
                "text-foreground size-4",
                Platform.select({ web: "pointer-events-none" }),
              )}
            />
          </ContextMenuPrimitive.ItemIndicator>
        </View>
        <>{children}</>
      </ContextMenuPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  disabled,
  nativeHaptics,
  onPress,
  ...props
}: ContextMenuRadioItemProps) {
  const contextHaptics = React.useContext(ContextMenuHapticsContext);
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm text-popover-foreground select-none",
        !disabled && "group-active:text-accent-foreground",
      )}
    >
      <ContextMenuPrimitive.RadioItem
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
          <ContextMenuPrimitive.ItemIndicator>
            <View className="bg-foreground h-2 w-2 rounded-full" />
          </ContextMenuPrimitive.ItemIndicator>
        </View>
        <>{children}</>
      </ContextMenuPrimitive.RadioItem>
    </TextClassContext.Provider>
  );
}

function ContextMenuLabel({ className, inset, ...props }: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.Label
      className={cn(
        "text-foreground px-2 py-2 text-sm font-medium sm:py-1.5",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
      // Separators are decoration. Let a drag started here reach the ScrollView.
      pointerEvents="none"
    />
  );
}

function ContextMenuShortcut({ className, ...props }: ContextMenuShortcutProps) {
  return (
    <Text
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

function ContextMenuItemTitle({ className, ...props }: ContextMenuItemTitleProps) {
  return <Text className={cn("text-sm text-popover-foreground", className)} {...props} />;
}

function ContextMenuItemSubtitle({ className, ...props }: ContextMenuItemSubtitleProps) {
  return <Text className={cn("text-muted-foreground text-xs", className)} {...props} />;
}

function ContextMenuItemIcon({ children }: ContextMenuItemIconProps) {
  return <>{children}</>;
}

function ContextMenuItemImage({ children }: ContextMenuItemImageProps) {
  return <>{children}</>;
}

const ContextMenuItemIndicator = ContextMenuPrimitive.ItemIndicator;
function ContextMenuArrow({ children }: ContextMenuArrowProps) {
  return <>{children}</>;
}
function ContextMenuPreview({ children }: ContextMenuPreviewProps) {
  return <>{children}</>;
}
function ContextMenuAuxiliary({ children }: ContextMenuAuxiliaryProps) {
  return <>{children}</>;
}

function renderContextMenuItems(
  items: ContextMenuItemData[],
  itemProps?: Record<string, unknown>,
  defaultNativeHaptics?: NativeHapticsSetting,
  depth = 0,
): React.ReactNode {
  return items.map((item, index) => {
    const key = `${depth}:${item.value}:${index}`;
    if (item.separator) return <ContextMenuSeparator key={key} />;
    const label = resolveRenderProp(item.label, item) ?? item.textValue ?? item.value;
    const resolvedItemProps = { ...(itemProps ?? {}), ...(item.itemProps ?? {}) };
    const itemHaptics = item.nativeHaptics ?? defaultNativeHaptics;
    if (item.subMenu?.length) {
      return (
        <ContextMenuSub key={key}>
          <ContextMenuSubTrigger
            {...(item.triggerProps as object)}
            disabled={item.disabled ?? (item.triggerProps?.disabled as boolean | undefined)}
            nativeHaptics={itemHaptics}
          >
            <Text>{label}</Text>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent {...(item.contentProps as object)}>
            {item.subMenuTitle === false ? null : (
              <ContextMenuLabel>
                {resolveRenderProp(item.subMenuTitle, item) ?? label}
              </ContextMenuLabel>
            )}
            {renderContextMenuItems(item.subMenu, itemProps, defaultNativeHaptics, depth + 1)}
          </ContextMenuSubContent>
        </ContextMenuSub>
      );
    }
    if (item.checked !== undefined) {
      return (
        <ContextMenuCheckboxItem
          {...(resolvedItemProps as object)}
          checked={item.checked}
          disabled={item.disabled ?? (resolvedItemProps.disabled as boolean | undefined)}
          key={key}
          nativeHaptics={itemHaptics}
          onCheckedChange={(checked) => {
            item.onCheckedChange?.(checked);
            item.onSelect?.();
            (resolvedItemProps.onCheckedChange as ((checked: boolean) => void) | undefined)?.(
              checked,
            );
          }}
          textValue={item.textValue}
        >
          <Text>{label}</Text>
        </ContextMenuCheckboxItem>
      );
    }
    return (
      <ContextMenuItem
        {...(resolvedItemProps as object)}
        disabled={item.disabled ?? (resolvedItemProps.disabled as boolean | undefined)}
        key={key}
        nativeHaptics={itemHaptics}
        onPress={item.onSelect ?? item.onPress ?? (resolvedItemProps.onPress as any)}
        textValue={item.textValue}
        variant={item.destructive ? "destructive" : "default"}
      >
        <Text>{label}</Text>
        {resolveRenderProp(item.icon, item)}
        {resolveRenderProp(item.indicator, item)}
      </ContextMenuItem>
    );
  });
}

function ContextMenu({
  children,
  items,
  itemProps,
  itemNativeHaptics,
  native = Platform.OS !== "web",
  nativeHaptics,
  nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem,
  __menuRef,
  __unsafeIosProps,
  onOpenChange,
  onOpenWillChange,
  trigger,
  triggerProps,
  ...props
}: ContextMenuProps) {
  const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
  const resolvedItemHaptics = useResolvedNativeHaptics(itemNativeHaptics);
  if (native && Platform.OS !== "web") {
    return React.createElement(ContextMenuNative as React.ComponentType<any>, {
      ...props,
      children,
      items,
      itemProps,
      itemNativeHaptics,
      nativeHaptics,
      nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem,
      __menuRef,
      __unsafeIosProps,
      onOpenChange,
      onOpenWillChange,
      trigger,
      triggerProps,
    });
  }
  const generated = items != null || trigger != null;
  return (
    <ContextMenuHapticsContext.Provider value={{ item: resolvedItemHaptics }}>
      <ContextMenuPrimitiveRoot
        {...props}
        onOpenChange={(open) => {
          onOpenWillChange?.(open);
          if (open) triggerNativeHaptics(resolvedHaptics);
          onOpenChange?.(open);
        }}
      >
        {generated ? (
          <>
            {trigger != null ? (
              <ContextMenuTrigger {...(triggerProps as object)} asChild>
                {resolveRenderProp(trigger, { native: false, open: false }) as React.ReactElement}
              </ContextMenuTrigger>
            ) : null}
            {items != null ? (
              <ContextMenuContent itemNativeHaptics={resolvedItemHaptics}>
                {renderContextMenuItems(items, itemProps, resolvedItemHaptics)}
              </ContextMenuContent>
            ) : null}
            {children}
          </>
        ) : (
          children
        )}
      </ContextMenuPrimitiveRoot>
    </ContextMenuHapticsContext.Provider>
  );
}

const ContextMenuComponent = Object.assign(ContextMenu, {
  Arrow: ContextMenuArrow,
  Auxiliary: ContextMenuAuxiliary,
  CheckboxItem: ContextMenuCheckboxItem,
  Content: ContextMenuContent,
  Group: ContextMenuGroup,
  Item: ContextMenuItem,
  ItemIcon: ContextMenuItemIcon,
  ItemImage: ContextMenuItemImage,
  ItemIndicator: ContextMenuItemIndicator,
  ItemSubtitle: ContextMenuItemSubtitle,
  ItemTitle: ContextMenuItemTitle,
  Label: ContextMenuLabel,
  Portal: ContextMenuPrimitive.Portal,
  Preview: ContextMenuPreview,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Root: ContextMenu,
  Separator: ContextMenuSeparator,
  Shortcut: ContextMenuShortcut,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
  Trigger: ContextMenuTrigger,
});

export { ContextMenuComponent as ContextMenu };
