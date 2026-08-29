import * as React from "react";
import { Platform, View } from "react-native";
import * as Zeego from "zeego/dropdown-menu";

import {
  triggerNativeHaptics,
  useResolvedNativeHaptics,
  type NativeHapticsSetting,
} from "../utils";
import { resolveRenderProp } from "../utils/render";
import type { NativeDropdownItemData, NativeDropdownItemProps, NativeDropdownProps } from "./types";
import {
  resolveAndroidMenuItems,
  resolveIosMenuItemGroups,
  splitMenuItemsBySeparators,
} from "./dropdown_native_helpers";
import { DropdownDefaultTrigger, DropdownDisabledTrigger, DropdownNativeTrigger } from "./shared";

const NativeDropdownHapticsContext = React.createContext<{
  item?: NativeHapticsSetting;
}>({});

function triggerNativeDropdownItemHaptics(setting: NativeHapticsSetting | undefined) {
  if (Platform.OS === "ios") {
    // iOS 似乎有一定几率丢掉震动
    requestAnimationFrame(() => triggerNativeHaptics(setting));
    return;
  }
  triggerNativeHaptics(setting);
}

function textValue(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textValue).join("");
  if (!React.isValidElement<{ children?: React.ReactNode }>(node)) return "";
  return textValue(node.props.children);
}

function childTextValue(children: React.ReactNode, component: unknown): string | undefined {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) continue;
    if (child.type === component) return textValue(child.props.children);
  }
  return undefined;
}

function styleRequestsFullWidth(style: unknown): boolean {
  const styles = Array.isArray(style) ? style : [style];
  return styles.some((entry) => {
    if (entry == null || typeof entry !== "object") return false;
    const candidate = entry as { alignSelf?: unknown; width?: unknown };
    return candidate.width === "100%" || candidate.alignSelf === "stretch";
  });
}

function resolveItemTitleAndSubtitle(
  children: React.ReactNode,
  textValueProp?: string,
  subtitleProp?: string,
) {
  return {
    title: textValueProp ?? childTextValue(children, Zeego.ItemTitle) ?? textValue(children),
    subtitle: subtitleProp ?? childTextValue(children, Zeego.ItemSubtitle),
  };
}

function renderItem(
  item: NativeDropdownItemData,
  itemProps?: NativeDropdownItemProps,
  separatorBefore = false,
  depth = 0,
): React.ReactNode {
  const resolvedItem = { ...itemProps, ...(item.itemProps ?? {}), ...item };
  const label =
    resolvedItem.textValue ??
    (textValue(resolveRenderProp(resolvedItem.label, resolvedItem)) || resolvedItem.value);
  const accessibilityLabel = resolvedItem["aria-label"] ?? label;
  const iconProps = resolvedItem.iconProps;
  const key = `${depth}:${resolvedItem.value}`;
  const onSelect = resolvedItem.onSelect ?? resolvedItem.onPress;
  const handleSelect = () => {
    onSelect?.();
    triggerNativeDropdownItemHaptics(resolvedItem.nativeHaptics);
  };

  if (resolvedItem.subMenu?.length) {
    const triggerOnSelect = resolvedItem.triggerProps?.onSelect as (() => void) | undefined;
    return (
      <Zeego.Sub key={key}>
        <Zeego.SubTrigger
          {...resolvedItem.triggerProps}
          aria-label={accessibilityLabel}
          disabled={resolvedItem.disabled}
          key={`${key}:trigger`}
          textValue={label}
          onSelect={() => {
            triggerOnSelect?.();
            triggerNativeDropdownItemHaptics(resolvedItem.nativeHaptics);
          }}
          {...({ separatorBefore } as object)}
        >
          <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
          {iconProps ? <Zeego.ItemIcon {...iconProps} /> : null}
        </Zeego.SubTrigger>
        <Zeego.SubContent>
          {renderItems(resolvedItem.subMenu, itemProps, depth + 1)}
        </Zeego.SubContent>
      </Zeego.Sub>
    );
  }

  const ItemComponent: any =
    Platform.OS === "ios" && resolvedItem.checkbox ? Zeego.CheckboxItem : Zeego.Item;
  return (
    <ItemComponent
      aria-label={accessibilityLabel}
      destructive={resolvedItem.destructive}
      disabled={resolvedItem.disabled}
      key={key}
      onSelect={() => {
        handleSelect();
      }}
      {...({ separatorBefore } as object)}
      {...({ selected: resolvedItem.selected } as object)}
      {...(resolvedItem.checkbox && Platform.OS === "ios"
        ? {
            value: resolvedItem.selected === true,
            onValueChange: handleSelect,
          }
        : {})}
      textValue={label}
      // The Android Zeego patch reads the color from the item props when it
      // builds @react-native-menu actions. Keep it on the item as well as on
      // ItemIcon so each Select swatch remains independent.
      {...(iconProps?.androidIconColor != null
        ? { androidIconColor: iconProps.androidIconColor }
        : {})}
    >
      <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
      {resolvedItem.subtitle ? (
        <Zeego.ItemSubtitle>{resolvedItem.subtitle}</Zeego.ItemSubtitle>
      ) : null}
      {iconProps ? <Zeego.ItemIcon {...iconProps} /> : null}
    </ItemComponent>
  );
}

function renderItems(
  items: NativeDropdownItemData[],
  itemProps?: NativeDropdownItemProps,
  depth = 0,
): React.ReactNode {
  if (Platform.OS === "ios") {
    const groups = resolveIosMenuItemGroups(items);

    // Keep sections and their items in the same order as the data source.
    if (groups.length > 1) {
      return groups.map((group, index) => (
        <Zeego.Group key={`${depth}:group:${index}`}>
          {group.map((item) => renderItem(item, itemProps, false, depth))}
        </Zeego.Group>
      ));
    }

    return (groups[0] ?? []).map((item) => renderItem(item, itemProps, false, depth));
  }

  if (Platform.OS === "android") {
    return resolveAndroidMenuItems(items).map(({ item, separatorBefore }) =>
      renderItem(item, itemProps, separatorBefore, depth),
    );
  }

  return items.map((item) => renderItem(item, itemProps, false, depth));
}

function NativeDropdownRoot({
  __nativeDetachedAnchor,
  __menuRef,
  children,
  nativeContentProps,
  defaultOpen,
  disabled,
  items,
  itemProps,
  itemNativeHaptics,
  nativeAnchorAlignment = "center",
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
  onOpenChange,
  onOpenWillChange,
  open,
  trigger,
  triggerClassName,
  triggerLabel,
  triggerProps,
  ...props
}: NativeDropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(Boolean(defaultOpen));
  const [willOpen, setWillOpen] = React.useState(Boolean(defaultOpen));
  const [anchorSize, setAnchorSize] = React.useState({ height: 1, width: 1 });
  const internalMenuRef = React.useRef<{ presentMenu: () => void } | null>(null);
  const menuRef = internalMenuRef;

  React.useEffect(() => {
    if (!__menuRef) return;
    __menuRef.current = {
      presentMenu: () => internalMenuRef.current?.presentMenu(),
    };
    return () => {
      __menuRef.current = null;
    };
  }, [__menuRef]);
  const haptics = useResolvedNativeHaptics(nativeHaptics);
  // Generated native items follow the dropdown setting by default; callers
  // can still override it with itemNativeHaptics or per-item nativeHaptics.
  const resolvedItemHaptics = useResolvedNativeHaptics(itemNativeHaptics ?? nativeHaptics);
  const resolvedOpen = open ?? uncontrolledOpen;
  // iOS reports the final menu state after the native presentation animation.
  // Use the will-change state for trigger feedback so press/open opacity does
  // not lag behind the actual interaction.
  const triggerOpen = Platform.OS === "ios" ? (open ?? willOpen) : resolvedOpen;
  const generated = items != null || trigger != null || nativeTrigger === true;
  const resolvedDisabled = disabled ?? triggerProps?.disabled;
  const triggerFromProp =
    trigger != null ? resolveRenderProp(trigger, { native: true, open: triggerOpen }) : null;
  const resolvedTrigger = nativeTrigger ? (
    React.isValidElement(triggerFromProp) ? (
      triggerFromProp
    ) : (
      <DropdownNativeTrigger
        open={Platform.OS === "ios" ? (open ?? willOpen) : resolvedOpen}
        className={triggerClassName}
        containerStyle={nativeTriggerContainerStyle}
        content={nativeTriggerContent}
        disabled={resolvedDisabled}
        icon={nativeTriggerIcon}
        keepPressedOpacity={Platform.OS === "ios"}
        label={triggerLabel}
        labelProps={nativeTriggerLabelProps}
        nativeTriggerProps={nativeTriggerProps}
        nativeTriggerFeedbackOpacity={nativeTriggerFeedbackOpacity}
        nativeTriggerHoverBackground={nativeTriggerHoverBackground}
        pressedOpacity={Platform.OS !== "ios"}
        trigger={trigger}
      />
    )
  ) : trigger != null ? (
    triggerFromProp
  ) : items != null ? (
    <DropdownDefaultTrigger
      className={triggerClassName}
      disabled={resolvedDisabled}
      label={resolveRenderProp(triggerLabel, { native: true, open: resolvedOpen })}
      props={triggerProps}
    />
  ) : null;

  const handleOpenChange = (nextOpen: boolean) => {
    if (resolvedDisabled && nextOpen) return;
    if (open === undefined) setUncontrolledOpen(nextOpen);
    // On iOS this is the later `onMenuDidHide` callback. `willOpen` is the
    // visual state source, so a stale didHide cannot overwrite a newer
    // willShow transition.
    if (!nextOpen && Platform.OS !== "ios") {
      setWillOpen(false);
    }
    onOpenChange?.(nextOpen);
  };

  const handleOpenWillChange = (nextOpen: boolean) => {
    if (resolvedDisabled && nextOpen) return;
    setWillOpen(nextOpen);
    // Android native menus do not consistently emit this callback for a
    // trigger press. The press path below provides the feedback there.
    if (nextOpen && Platform.OS !== "android") triggerNativeHaptics(haptics);
    onOpenWillChange?.(nextOpen);
  };

  const triggerElementStyle = React.isValidElement<{ style?: unknown }>(resolvedTrigger)
    ? resolvedTrigger.props.style
    : undefined;
  const triggerPropStyle = triggerProps?.style;
  const composedTriggerStyle =
    triggerElementStyle == null
      ? triggerPropStyle
      : triggerPropStyle == null
        ? triggerElementStyle
        : [triggerElementStyle, triggerPropStyle];
  const resolvedTriggerProps = {
    ...(triggerProps as object),
    style: composedTriggerStyle,
    onPress: (event: unknown) => {
      (triggerProps as { onPress?: (event: unknown) => void } | undefined)?.onPress?.(event);
      if (!event || !(event as { defaultPrevented?: boolean }).defaultPrevented) {
        if (Platform.OS === "android") triggerNativeHaptics(haptics);
      }
      if (isAndroidDetachedTrigger && !resolvedDisabled) {
        menuRef.current?.presentMenu();
      }
    },
    onPressIn: (event: unknown) => {
      (triggerProps as { onPressIn?: (event: unknown) => void } | undefined)?.onPressIn?.(event);
    },
    onPressOut: (event: unknown) => {
      (triggerProps as { onPressOut?: (event: unknown) => void } | undefined)?.onPressOut?.(event);
    },
  };
  const resolvedChildren = React.Children.toArray(children).reverse();
  const resolvedTriggerClassName = React.isValidElement<{ className?: string }>(resolvedTrigger)
    ? resolvedTrigger.props.className
    : undefined;
  const triggerUsesFullWidth = [
    triggerClassName,
    triggerProps?.className,
    resolvedTriggerClassName,
    React.isValidElement<{ props?: { className?: string } }>(resolvedTrigger)
      ? resolvedTrigger.props.props?.className
      : undefined,
  ].some((className) => className?.split(/\s+/).includes("w-full"));
  const triggerUsesFullWidthStyle =
    styleRequestsFullWidth(triggerProps?.style) ||
    (React.isValidElement<{ style?: unknown; props?: { style?: unknown } }>(resolvedTrigger) &&
      (styleRequestsFullWidth(resolvedTrigger.props.style) ||
        styleRequestsFullWidth(resolvedTrigger.props.props?.style)));
  // Keep the visible trigger separate from MenuView for Android native
  // triggers and compact Select triggers. Otherwise the popup anchor can
  // cause the parent ScrollView to reposition near the bottom of the page.
  const isAndroidDetachedTrigger =
    Platform.OS === "android" && (nativeTrigger === true || __nativeDetachedAnchor === true);
  const { style: rootStyle, ...rootProps } = props as NativeDropdownProps & {
    style?: unknown;
  };
  const nativeAnchorStyle = isAndroidDetachedTrigger
    ? { alignSelf: "flex-start" as const, height: anchorSize.height, width: anchorSize.width }
    : null;

  const menu = (
    <Zeego.Root
      {...(rootProps as React.ComponentProps<typeof Zeego.Root>)}
      {...({
        style: [
          { flexGrow: 0 },
          nativeAnchorStyle ??
            (triggerUsesFullWidth || triggerUsesFullWidthStyle
              ? { alignSelf: "stretch", width: "100%" }
              : { alignSelf: "flex-start" }),
          rootStyle,
        ],
      } as object)}
      {...(defaultOpen === undefined ? {} : { defaultOpen })}
      {...(open === undefined ? {} : { open })}
      {...({
        __menuRef: menuRef,
        anchorAlignment: nativeAnchorAlignment,
        isAnchoredToRight: nativeAnchorAlignment === "end",
        selectedItemBackgroundColor: nativeSelectedItemBackgroundColor,
      } as object)}
      onOpenChange={handleOpenChange}
      {...({ onOpenWillChange: handleOpenWillChange } as object)}
    >
      {generated ? (
        <>
          {resolvedTrigger != null ? (
            <Zeego.Trigger
              asChild
              {...(isAndroidDetachedTrigger
                ? { style: { height: anchorSize.height, width: anchorSize.width } }
                : (resolvedTriggerProps as object))}
              disabled={resolvedDisabled ?? undefined}
            >
              {isAndroidDetachedTrigger ? (
                <View
                  collapsable={false}
                  style={{ height: anchorSize.height, width: anchorSize.width }}
                />
              ) : (
                (resolvedTrigger as React.ReactElement)
              )}
            </Zeego.Trigger>
          ) : null}
          {items != null ? (
            <Zeego.Content {...(nativeContentProps as object)}>
              {renderItems(items, { nativeHaptics: resolvedItemHaptics, ...itemProps })}
            </Zeego.Content>
          ) : null}
          {resolvedChildren}
        </>
      ) : (
        resolvedChildren
      )}
    </Zeego.Root>
  );

  if (isAndroidDetachedTrigger && resolvedTrigger != null && !resolvedDisabled) {
    const triggerElement = resolvedTrigger as React.ReactElement<Record<string, any>>;
    const originalOnLayout = triggerElement.props.onLayout;
    const originalOnPress = triggerElement.props.onPress;
    const {
      onLayout: _triggerLayout,
      onPress: _triggerPress,
      ...triggerPropsForVisibleElement
    } = resolvedTriggerProps as Record<string, any>;
    const visibleTrigger = React.cloneElement(triggerElement, {
      ...triggerPropsForVisibleElement,
      onLayout: (event: any) => {
        originalOnLayout?.(event);
        const nextWidth = event?.nativeEvent?.layout?.width;
        const nextHeight = event?.nativeEvent?.layout?.height;
        if (typeof nextWidth === "number" && typeof nextHeight === "number") {
          setAnchorSize((previous) =>
            Math.abs(previous.width - nextWidth) < 0.5 &&
            Math.abs(previous.height - nextHeight) < 0.5
              ? previous
              : { width: nextWidth, height: nextHeight },
          );
        }
      },
      onPress: (event: any) => {
        originalOnPress?.(event);
        if (!event?.defaultPrevented && Platform.OS === "android") {
          triggerNativeHaptics(haptics);
        }
        if (!event?.defaultPrevented) menuRef.current?.presentMenu();
      },
    });
    return (
      <NativeDropdownHapticsContext.Provider value={{ item: resolvedItemHaptics }}>
        <View style={{ position: "relative" }}>
          {visibleTrigger}
          <View
            pointerEvents="none"
            style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
          >
            {menu}
          </View>
        </View>
      </NativeDropdownHapticsContext.Provider>
    );
  }

  return (
    <NativeDropdownHapticsContext.Provider value={{ item: resolvedItemHaptics }}>
      {resolvedDisabled ? (
        <DropdownDisabledTrigger>{resolvedTrigger}</DropdownDisabledTrigger>
      ) : (
        menu
      )}
    </NativeDropdownHapticsContext.Provider>
  );
}

const NativeDropdownTrigger = Zeego.Trigger;
const NativeDropdownGroup = Zeego.Group;
const NativeDropdownPortal = React.Fragment;
const NativeDropdownSub = Zeego.Sub;

const RadioContext = React.createContext<{
  onValueChange?: (value: string) => void;
  value?: string;
}>({});

function NativeDropdownRadioGroup({
  children,
  onValueChange,
  value,
}: {
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
}) {
  return <RadioContext.Provider value={{ onValueChange, value }}>{children}</RadioContext.Provider>;
}

function NativeDropdownContent({ children, ...props }: any) {
  return <Zeego.Content {...props}>{children}</Zeego.Content>;
}

function NativeDropdownSubContent({ children, ...props }: any) {
  return <Zeego.SubContent {...props}>{children}</Zeego.SubContent>;
}

function NativeDropdownSubTrigger({
  children,
  disabled,
  nativeHaptics,
  onPress,
  onSelect,
  ...props
}: any) {
  const contextHaptics = React.useContext(NativeDropdownHapticsContext);
  const { title: label, subtitle } = resolveItemTitleAndSubtitle(
    children,
    props.textValue,
    props.subtitle,
  );
  return (
    <Zeego.SubTrigger
      {...props}
      disabled={disabled}
      onSelect={() => {
        onPress?.();
        onSelect?.();
        triggerNativeDropdownItemHaptics(nativeHaptics ?? contextHaptics.item);
      }}
      textValue={label}
    >
      <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
      {subtitle ? <Zeego.ItemSubtitle>{subtitle}</Zeego.ItemSubtitle> : null}
    </Zeego.SubTrigger>
  );
}

function NativeDropdownItem({
  children,
  nativeHaptics,
  onPress,
  onSelect,
  variant,
  ...props
}: any) {
  const contextHaptics = React.useContext(NativeDropdownHapticsContext);
  const { title: label, subtitle } = resolveItemTitleAndSubtitle(
    children,
    props.textValue,
    props.subtitle,
  );
  return (
    <Zeego.Item
      {...props}
      destructive={variant === "destructive" || props.destructive}
      onSelect={() => {
        (onSelect ?? onPress)?.();
        triggerNativeDropdownItemHaptics(nativeHaptics ?? contextHaptics.item);
      }}
      textValue={label}
    >
      <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
      {subtitle ? <Zeego.ItemSubtitle>{subtitle}</Zeego.ItemSubtitle> : null}
    </Zeego.Item>
  );
}

function NativeDropdownCheckboxItem({
  checked,
  children,
  onCheckedChange,
  nativeHaptics,
  onValueChange,
  value,
  ...props
}: any) {
  const contextHaptics = React.useContext(NativeDropdownHapticsContext);
  const { title: label, subtitle } = resolveItemTitleAndSubtitle(
    children,
    props.textValue,
    props.subtitle,
  );
  const resolvedValue = value ?? (checked ? "on" : "off");
  return (
    <Zeego.CheckboxItem
      {...props}
      onValueChange={(next: "mixed" | "on" | "off", previous: "mixed" | "on" | "off") => {
        triggerNativeDropdownItemHaptics(nativeHaptics ?? contextHaptics.item);
        onValueChange?.(next, previous);
        onCheckedChange?.(next === "on");
      }}
      textValue={label}
      value={resolvedValue}
    >
      <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
      {subtitle ? <Zeego.ItemSubtitle>{subtitle}</Zeego.ItemSubtitle> : null}
    </Zeego.CheckboxItem>
  );
}

function NativeDropdownRadioItem({ children, value, ...props }: any) {
  const radio = React.useContext(RadioContext);
  return (
    <NativeDropdownCheckboxItem
      {...props}
      checked={radio.value === value}
      onCheckedChange={(checked: boolean) => checked && radio.onValueChange?.(value)}
    >
      {children}
    </NativeDropdownCheckboxItem>
  );
}

function NativeDropdownLabel({ children, ...props }: any) {
  const label = props.textValue ?? textValue(children);
  return (
    <Zeego.Label {...props} textValue={label}>
      {label}
    </Zeego.Label>
  );
}

const NativeDropdownSeparator = Zeego.Separator;
function NativeDropdownShortcut() {
  return null;
}

export const DropdownNative = Object.assign(NativeDropdownRoot, {
  CheckboxItem: NativeDropdownCheckboxItem,
  Content: NativeDropdownContent,
  Group: NativeDropdownGroup,
  Item: NativeDropdownItem,
  Label: NativeDropdownLabel,
  Portal: NativeDropdownPortal,
  RadioGroup: NativeDropdownRadioGroup,
  RadioItem: NativeDropdownRadioItem,
  Root: NativeDropdownRoot,
  Separator: NativeDropdownSeparator,
  Shortcut: NativeDropdownShortcut,
  Sub: NativeDropdownSub,
  SubContent: NativeDropdownSubContent,
  SubTrigger: NativeDropdownSubTrigger,
  Trigger: NativeDropdownTrigger,
});

// Keep the implementation name available for internal platform consumers.
export const NativeDropdown = DropdownNative;
