import { Icon } from "../icon";
import { NativeOnlyAnimatedView } from "../utils/native_only_animated_view";
import { Text, TextClassContext } from "../text";
import { cn } from "../utils/cn";
import { OverlayPortalWindow, useOverlayPortalContentStyle } from "../utils/overlay/overlay_portal";
import { useScopedOverlayPortalHostName } from "../utils/overlay";
import { semanticColorsToVariables, useUiTheme } from "../utils/theme";
import {
  resolveRenderProp,
  triggerNativeHaptics,
  useResolvedNativeHaptics,
  type NativeHapticsSetting,
} from "../utils";
import * as MenubarPrimitive from "@rn-primitives/menubar";
import { Portal } from "@rn-primitives/portal";
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

import type {
  MenubarContentProps,
  MenubarItemData,
  MenubarProps,
  MenubarSize,
  MenubarSubContentProps,
  MenubarTriggerProps,
} from "./types";
import {
  menuIconSizeClasses,
  menuItemPaddingClasses,
  menuTextSizeClasses,
} from "../utils/menu_size";

const MENUBAR_MENU_MAX_HEIGHT_RATIO = 0.45;

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

function MenubarPortal({
  hostName,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  const scopedPortalHost = useScopedOverlayPortalHostName();
  return <MenubarPrimitive.Portal {...props} hostName={hostName ?? scopedPortalHost} />;
}

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const MenubarHapticsContext = React.createContext<{
  trigger?: NativeHapticsSetting;
  item?: NativeHapticsSetting;
}>({});
const MenubarSizeContext = React.createContext<MenubarSize>("default");
const MenubarContentSizeContext = React.createContext<MenubarSize>("default");

const menubarRootSizeClasses: Record<MenubarSize, string> = {
  "default": "h-11 p-1.5",
  "2xs": "h-8 p-0.5",
  "xs": "h-9 p-0.5",
  "sm": "h-10 p-1",
  "md": "h-11 p-1.5",
  "lg": "h-12 p-1.5",
  "xl": "h-14 p-2",
  "2xl": "h-16 p-2",
};

// Native text metrics are tighter than the browser's default line box. Keep
// the main triggers on predictable line heights so their labels stay centered
// at every menu size.
const menubarTriggerTextSizeClasses: Record<MenubarSize, string> = {
  default: "text-base leading-6",
  "2xs": "text-[10px] leading-3.5",
  xs: "text-xs leading-4",
  sm: "text-sm leading-5",
  md: "text-base leading-6",
  lg: "text-lg leading-7",
  xl: "text-xl leading-7",
  "2xl": "text-2xl leading-8",
};

const menubarTriggerSizeClasses: Record<MenubarSize, string> = {
  "default": "px-2.5 py-1.5",
  "2xs": "px-1.5 py-0.5",
  "xs": "px-2 py-1",
  "sm": "px-2 py-1",
  "md": "px-2.5 py-1.5",
  "lg": "px-3 py-2",
  "xl": "px-4 py-2.5",
  "2xl": "px-5 py-3",
};

function normalizeMenubarChildren(children: React.ReactNode) {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
  );
}

function MenubarRoot({
  children,
  className,
  items,
  size = "default",
  contentSize = "default",
  nativeHaptics,
  itemNativeHaptics,
  value: valueProp,
  onValueChange: onValueChangeProp,
  ...props
}: MenubarProps) {
  const id = React.useId();
  const scopedPortalHost = useScopedOverlayPortalHostName();
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const resolvedTriggerHaptics = useResolvedNativeHaptics(nativeHaptics);
  const resolvedItemHaptics = useResolvedNativeHaptics(itemNativeHaptics);

  function closeMenu() {
    if (onValueChangeProp) {
      onValueChangeProp(undefined);
      return;
    }
    setValue(undefined);
  }

  const renderedChildren =
    children ??
    (items != null
      ? items.map((menu) => (
          <MenubarNamespace.Menu key={menu.value} value={menu.value}>
            <MenubarNamespace.Trigger {...menu.triggerProps} nativeHaptics={menu.nativeHaptics}>
              {normalizeMenubarChildren(resolveRenderProp(menu.title, { value: menu.value }))}
            </MenubarNamespace.Trigger>
            <MenubarNamespace.Content {...menu.contentProps}>
              {menu.items.map((item, index) =>
                renderMenubarItem(item, `${menu.value}-${index}`, itemNativeHaptics),
              )}
            </MenubarNamespace.Content>
          </MenubarNamespace.Menu>
        ))
      : null);

  return (
    <MenubarSizeContext.Provider value={size}>
      <MenubarContentSizeContext.Provider value={contentSize}>
        <MenubarHapticsContext.Provider
          value={{ trigger: resolvedTriggerHaptics, item: resolvedItemHaptics }}
        >
          {Platform.OS !== "web" && (value || valueProp) ? (
            <Portal hostName={scopedPortalHost} name={`menubar-overlay-${id}`}>
              <Pressable onPress={closeMenu} style={StyleSheet.absoluteFill} />
            </Portal>
          ) : null}
          <MenubarPrimitive.Root
            className={cn(
              "bg-background border-border flex flex-row items-center gap-1 rounded-md border shadow-sm shadow-black/5",
              menubarRootSizeClasses[size],
              Platform.select({ native: "p-1" }),
              className,
            )}
            value={value ?? valueProp}
            onValueChange={onValueChangeProp ?? setValue}
            {...props}
          >
            {renderedChildren}
          </MenubarPrimitive.Root>
        </MenubarHapticsContext.Provider>
      </MenubarContentSizeContext.Provider>
    </MenubarSizeContext.Provider>
  );
}

function MenubarTrigger({
  className,
  cursorDefault = true,
  size: sizeProp,
  nativeHaptics,
  onPress,
  ...props
}: MenubarTriggerProps) {
  const { value } = MenubarPrimitive.useRootContext();
  const { value: itemValue } = MenubarPrimitive.useMenuContext();
  const contextHaptics = React.useContext(MenubarHapticsContext);
  const size = sizeProp ?? React.useContext(MenubarSizeContext);
  const hasCursorOverride = className?.split(/\s+/).some((token) => token.startsWith("cursor-"));

  return (
    <TextClassContext.Provider
      value={cn(
        cn(
          menubarTriggerTextSizeClasses[size],
          "font-medium select-none group-active:text-accent-foreground",
        ),
        value === itemValue && "text-accent-foreground",
      )}
    >
      <MenubarPrimitive.Trigger
        className={cn(
          cn("group flex items-center rounded-md", menubarTriggerSizeClasses[size]),
          Platform.select({
            web: cn(
              "hover:bg-accent hover:text-accent-foreground outline-none",
              cursorDefault && !hasCursorOverride && "!cursor-default",
            ),
          }),
          value === itemValue && "bg-accent",
          className,
        )}
        {...props}
        onPress={(event) => {
          onPress?.(event);
          if (!event.defaultPrevented) {
            triggerNativeHaptics(nativeHaptics ?? contextHaptics.trigger);
          }
        }}
      />
    </TextClassContext.Provider>
  );
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  iconClassName,
  nativeHaptics,
  onPress,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  children?: React.ReactNode;
  iconClassName?: string;
  inset?: boolean;
  nativeHaptics?: NativeHapticsSetting;
}) {
  const { open } = MenubarPrimitive.useSubContext();
  const contextHaptics = React.useContext(MenubarHapticsContext);
  const size = React.useContext(MenubarContentSizeContext);
  const disabled = props.disabled === true;
  const icon = Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;
  return (
    <TextClassContext.Provider
      value={cn(
        cn(menuTextSizeClasses[size], "select-none"),
        !disabled && "group-active:text-accent-foreground",
        open && "text-accent-foreground",
      )}
    >
      <MenubarPrimitive.SubTrigger
        className={cn(
          cn(
            "group flex flex-row items-center justify-between rounded-sm px-2",
            menuItemPaddingClasses[size],
          ),
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
        {normalizeMenubarChildren(children)}
        <Icon
          as={icon}
          className={cn("text-foreground shrink-0", menuIconSizeClasses[size], iconClassName)}
        />
      </MenubarPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
}

function MenubarSubContent({
  className,
  children,
  size: sizeProp,
  style,
  ...props
}: MenubarSubContentProps) {
  const theme = useUiTheme();
  const size = sizeProp ?? React.useContext(MenubarContentSizeContext);

  return (
    <NativeOnlyAnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <MenubarPrimitive.SubContent
        className={cn(
          "bg-popover border-border overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5",
          Platform.select({
            web: "animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fade-in-0 data-[state=closed]:zoom-out-95 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin) z-50 min-w-[8rem] max-h-[45vh] overflow-y-auto ui-menu-scrollbar",
          }),
          className,
        )}
        // The web primitive renders SubContent through its own Radix portal,
        // outside the provider-scoped variables applied by OverlayPortalWindow.
        style={
          [Platform.OS === "web" ? (semanticColorsToVariables(theme) as any) : null, style] as any
        }
        {...props}
      >
        <MenubarContentSizeContext.Provider value={size}>
          <TextClassContext.Provider
            value={cn("text-popover-foreground", menuTextSizeClasses[size])}
          >
            {children}
          </TextClassContext.Provider>
        </MenubarContentSizeContext.Provider>
      </MenubarPrimitive.SubContent>
    </NativeOnlyAnimatedView>
  );
}

function MenubarContent({
  className,
  children,
  overlayClassName,
  overlayStyle,
  portalHost,
  size: sizeProp,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  style,
  ...props
}: MenubarContentProps & {
  overlayStyle?: StyleProp<ViewStyle>;
  overlayClassName?: string;
  portalHost?: string;
}) {
  const { height: windowHeight } = useWindowDimensions();
  const { triggerPosition, contentLayout } = MenubarPrimitive.useRootContext();
  const availableAbove = triggerPosition?.pageY ?? 0;
  const availableBelow = triggerPosition
    ? windowHeight - triggerPosition.pageY - triggerPosition.height
    : windowHeight;
  const estimatedHeight = contentLayout?.height ?? windowHeight * MENUBAR_MENU_MAX_HEIGHT_RATIO;
  const resolvedSide =
    Platform.OS === "web" || props.side != null
      ? props.side
      : availableBelow < estimatedHeight && availableAbove > availableBelow
        ? "top"
        : "bottom";
  const scopedPortalHost = useScopedOverlayPortalHostName();
  const resolvedPortalHost = portalHost ?? scopedPortalHost;
  const contentStyle = useOverlayPortalContentStyle(style);
  const size = sizeProp ?? React.useContext(MenubarContentSizeContext);

  return (
    <MenubarPrimitive.Portal hostName={resolvedPortalHost}>
      <OverlayPortalWindow portalHost={resolvedPortalHost}>
        <NativeOnlyAnimatedView
          as="View"
          accessible={false}
          entering={FadeIn.reduceMotion(ReduceMotion.System)}
          style={StyleSheet.absoluteFill}
          pointerEvents="box-none"
        >
          <TextClassContext.Provider
            value={cn("text-popover-foreground", menuTextSizeClasses[size])}
          >
            <MenubarPrimitive.Content
              style={
                [{ maxHeight: windowHeight * MENUBAR_MENU_MAX_HEIGHT_RATIO }, contentStyle] as any
              }
              className={cn(
                "bg-popover border-border max-h-[45vh] min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-lg shadow-black/5",
                Platform.select({
                  web: cn(
                    "animate-in fade-in-0 zoom-in-95 max-h-[45vh] overflow-y-auto origin-(--radix-context-menu-content-transform-origin) z-50 cursor-default ui-menu-scrollbar",
                    props.side === "bottom" && "slide-in-from-top-2",
                    props.side === "top" && "slide-in-from-bottom-2",
                  ),
                }),
                className,
              )}
              align={align}
              alignOffset={alignOffset}
              sideOffset={sideOffset}
              {...props}
              asChild
              side={resolvedSide}
              onStartShouldSetResponder={() => false}
            >
              <View collapsable={false}>
                {Platform.OS === "web" ? (
                  <MenubarContentSizeContext.Provider value={size}>
                    {children}
                  </MenubarContentSizeContext.Provider>
                ) : (
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                    onMoveShouldSetResponderCapture={() => true}
                    style={{ maxHeight: windowHeight * MENUBAR_MENU_MAX_HEIGHT_RATIO }}
                  >
                    <MenubarContentSizeContext.Provider value={size}>
                      {children}
                    </MenubarContentSizeContext.Provider>
                  </ScrollView>
                )}
              </View>
            </MenubarPrimitive.Content>
          </TextClassContext.Provider>
        </NativeOnlyAnimatedView>
      </OverlayPortalWindow>
    </MenubarPrimitive.Portal>
  );
}

function MenubarItem({
  className,
  disabled,
  inset,
  variant,
  nativeHaptics,
  onPress,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  className?: string;
  inset?: boolean;
  variant?: "default" | "destructive";
  nativeHaptics?: NativeHapticsSetting;
}) {
  const contextHaptics = React.useContext(MenubarHapticsContext);
  const size = React.useContext(MenubarContentSizeContext);
  return (
    <TextClassContext.Provider
      value={cn(
        cn(menuTextSizeClasses[size], "select-none text-popover-foreground"),
        !disabled && "group-active:text-popover-foreground",
        variant === "destructive" && "text-destructive",
        variant === "destructive" && !disabled && "group-active:text-destructive",
      )}
    >
      <MenubarPrimitive.Item
        className={cn(
          cn(
            "group relative flex flex-row items-center gap-2 rounded-sm px-2",
            menuItemPaddingClasses[size],
          ),
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

function MenubarCheckboxItem({
  className,
  children,
  disabled,
  nativeHaptics,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & {
  children?: React.ReactNode;
  nativeHaptics?: NativeHapticsSetting;
}) {
  const contextHaptics = React.useContext(MenubarHapticsContext);
  const size = React.useContext(MenubarContentSizeContext);
  return (
    <TextClassContext.Provider
      value={cn(
        cn(menuTextSizeClasses[size], "text-popover-foreground select-none"),
        !disabled && "group-active:text-accent-foreground",
      )}
    >
      <MenubarPrimitive.CheckboxItem
        className={cn(
          cn(
            "group relative flex flex-row items-center gap-2 rounded-sm pl-8 pr-2",
            menuItemPaddingClasses[size],
          ),
          !disabled && "active:bg-accent",
          Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
          }),
          disabled && "opacity-50",
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
          <MenubarPrimitive.ItemIndicator>
            <Icon
              as={Check}
              className={cn(
                cn("text-foreground shrink-0", menuIconSizeClasses[size]),
                Platform.select({ web: "pointer-events-none" }),
              )}
            />
          </MenubarPrimitive.ItemIndicator>
        </View>
        {normalizeMenubarChildren(children)}
      </MenubarPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  );
}

function MenubarRadioItem({
  className,
  children,
  disabled,
  nativeHaptics,
  onPress,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & {
  children?: React.ReactNode;
  nativeHaptics?: NativeHapticsSetting;
}) {
  const contextHaptics = React.useContext(MenubarHapticsContext);
  const size = React.useContext(MenubarContentSizeContext);
  return (
    <TextClassContext.Provider
      value={cn(
        cn(menuTextSizeClasses[size], "text-popover-foreground select-none"),
        !disabled && "group-active:text-accent-foreground",
      )}
    >
      <MenubarPrimitive.RadioItem
        className={cn(
          cn(
            "group relative flex flex-row items-center gap-2 rounded-sm pl-8 pr-2",
            menuItemPaddingClasses[size],
          ),
          !disabled && "active:bg-accent",
          Platform.select({
            web: "focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none",
          }),
          disabled && "opacity-50",
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
          <MenubarPrimitive.ItemIndicator>
            <View className="bg-foreground h-2 w-2 rounded-full" />
          </MenubarPrimitive.ItemIndicator>
        </View>
        {normalizeMenubarChildren(children)}
      </MenubarPrimitive.RadioItem>
    </TextClassContext.Provider>
  );
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  className?: string;
  inset?: boolean;
}) {
  const size = React.useContext(MenubarContentSizeContext);
  return (
    <MenubarPrimitive.Label
      className={cn(
        cn(
          "text-foreground px-2 font-medium",
          menuTextSizeClasses[size],
          menuItemPaddingClasses[size],
        ),
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
      pointerEvents="none"
    />
  );
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<typeof Text>) {
  const size = React.useContext(MenubarContentSizeContext);
  return (
    <Text
      className={cn(
        "text-muted-foreground ml-auto tracking-widest",
        menuTextSizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

function MenubarDataItem({
  item,
  itemKey,
  defaultNativeHaptics,
}: {
  item: MenubarItemData;
  itemKey: string;
  defaultNativeHaptics?: NativeHapticsSetting;
}) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
    item.defaultChecked ?? false,
  );
  const checked = item.checked ?? uncontrolledChecked;
  const context = {
    checked,
    disabled: item.disabled,
    value: item.value,
  };
  const title = normalizeMenubarChildren(resolveRenderProp(item.title ?? item.children, context));
  const shortcut = normalizeMenubarChildren(resolveRenderProp(item.shortcut, context));
  const itemHaptics = item.nativeHaptics ?? defaultNativeHaptics;

  if (item.type === "separator") {
    return <MenubarNamespace.Separator {...item.separatorProps} />;
  }

  if (item.type === "label") {
    return (
      <MenubarNamespace.Label {...item.labelProps} inset={item.inset}>
        {title}
      </MenubarNamespace.Label>
    );
  }

  if (item.type === "submenu") {
    return (
      <MenubarNamespace.Sub {...item.submenuProps}>
        <MenubarNamespace.SubTrigger
          disabled={item.disabled}
          inset={item.inset}
          nativeHaptics={itemHaptics}
        >
          {title}
        </MenubarNamespace.SubTrigger>
        <MenubarNamespace.SubContent {...item.contentProps}>
          {item.items?.map((child, index) => (
            <MenubarDataItem
              defaultNativeHaptics={defaultNativeHaptics}
              item={child}
              itemKey={`${itemKey}-${index}`}
              key={`${itemKey}-${index}`}
            />
          ))}
        </MenubarNamespace.SubContent>
      </MenubarNamespace.Sub>
    );
  }

  if (item.type === "checkbox") {
    return (
      <MenubarNamespace.CheckboxItem
        {...item.checkboxProps}
        checked={checked}
        disabled={item.disabled ?? item.checkboxProps?.disabled}
        nativeHaptics={itemHaptics}
        onCheckedChange={(nextChecked: boolean) => {
          if (item.checked === undefined) setUncontrolledChecked(nextChecked);
          item.onCheckedChange?.(nextChecked);
        }}
      >
        {title}
        {shortcut != null ? (
          <MenubarNamespace.Shortcut>{shortcut}</MenubarNamespace.Shortcut>
        ) : null}
      </MenubarNamespace.CheckboxItem>
    );
  }

  if (item.type === "radio-group") {
    return (
      <MenubarNamespace.RadioGroup
        {...item.radioGroupProps}
        onValueChange={item.radioGroupProps?.onValueChange ?? (() => undefined)}
        value={item.radioGroupProps?.value}
      >
        {item.items?.map((child, index) => (
          <MenubarDataItem
            defaultNativeHaptics={defaultNativeHaptics}
            item={child}
            itemKey={`${itemKey}-${index}`}
            key={`${itemKey}-${index}`}
          />
        ))}
      </MenubarNamespace.RadioGroup>
    );
  }

  if (item.type === "radio") {
    return (
      <MenubarNamespace.RadioItem
        {...item.radioItemProps}
        disabled={item.disabled ?? item.radioItemProps?.disabled}
        nativeHaptics={itemHaptics}
        value={item.value ?? itemKey}
      >
        {title}
        {shortcut != null ? (
          <MenubarNamespace.Shortcut>{shortcut}</MenubarNamespace.Shortcut>
        ) : null}
      </MenubarNamespace.RadioItem>
    );
  }

  return (
    <MenubarNamespace.Item
      {...item.itemProps}
      disabled={item.disabled ?? item.itemProps?.disabled}
      inset={item.inset}
      nativeHaptics={itemHaptics}
    >
      {title}
      {shortcut != null ? <MenubarNamespace.Shortcut>{shortcut}</MenubarNamespace.Shortcut> : null}
    </MenubarNamespace.Item>
  );
}

function renderMenubarItem(
  item: MenubarItemData,
  itemKey: string,
  defaultNativeHaptics?: NativeHapticsSetting,
) {
  return (
    <MenubarDataItem
      defaultNativeHaptics={defaultNativeHaptics}
      item={item}
      itemKey={itemKey}
      key={itemKey}
    />
  );
}

const MenubarNamespace = {
  CheckboxItem: MenubarCheckboxItem,
  Content: MenubarContent,
  Group: MenubarGroup,
  Item: MenubarItem,
  Label: MenubarLabel,
  Menu: MenubarMenu,
  Portal: MenubarPortal,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  Root: MenubarRoot,
  Separator: MenubarSeparator,
  Shortcut: MenubarShortcut,
  Sub: MenubarSub,
  SubContent: MenubarSubContent,
  SubTrigger: MenubarSubTrigger,
  Trigger: MenubarTrigger,
};

const Menubar = Object.assign(MenubarRoot, MenubarNamespace);

export { Menubar };
