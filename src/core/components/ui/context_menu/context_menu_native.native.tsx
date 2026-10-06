import * as React from "react";
import { Platform } from "react-native";
import * as Zeego from "zeego/context-menu";

import type { ContextMenuItemData, ContextMenuProps } from "./types";
import {
  triggerNativeHaptics,
  type NativeHapticsDelay,
  useResolvedNativeHaptics,
  type NativeHapticsSetting,
} from "../utils";
import { resolveRenderProp } from "../utils/render";

function splitMenuItemsBySeparators(items: ContextMenuItemData[]): ContextMenuItemData[][] {
  const groups: ContextMenuItemData[][] = [];
  let currentGroup: ContextMenuItemData[] = [];

  for (const item of items) {
    if (item.separator) {
      if (currentGroup.length > 0) groups.push(currentGroup);
      currentGroup = [];
      continue;
    }
    currentGroup.push(item);
  }

  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
}

function resolveAndroidMenuItems(items: ContextMenuItemData[]) {
  const resolvedItems: { item: ContextMenuItemData; separatorBefore: boolean }[] = [];
  let separatorBefore = false;

  for (const item of items) {
    if (item.separator) {
      if (resolvedItems.length > 0) separatorBefore = true;
      continue;
    }
    resolvedItems.push({ item, separatorBefore });
    separatorBefore = false;
  }

  return resolvedItems;
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

const NativeContextMenuHapticsContext = React.createContext<{
  item?: NativeHapticsSetting;
  itemDelay?: NativeHapticsDelay;
}>({});

function renderItems(
  items: ContextMenuItemData[],
  itemProps?: Record<string, unknown>,
  defaultNativeHaptics?: NativeHapticsSetting,
  defaultNativeHapticsDelay?: NativeHapticsDelay,
  depth = 0,
): React.ReactNode {
  if (Platform.OS === "ios") {
    const groups = splitMenuItemsBySeparators(items);
    if (groups.length > 1) {
      return groups.map((group, index) => (
        <Zeego.Group key={`${depth}:group:${index}`}>
          {renderItems(
            group,
            itemProps,
            defaultNativeHaptics,
            defaultNativeHapticsDelay,
            depth + 1,
          )}
        </Zeego.Group>
      ));
    }
    items = groups[0] ?? [];
  }

  const resolvedItems =
    Platform.OS === "android"
      ? resolveAndroidMenuItems(items)
      : items.map((item) => ({ item, separatorBefore: false }));

  return resolvedItems.map(({ item, separatorBefore }, index) => {
    const key = `${depth}:${item.value}:${index}`;
    if (item.separator) return <Zeego.Separator key={key} />;
    const resolvedItem = { ...(itemProps ?? {}), ...(item.itemProps ?? {}), ...item };
    const label =
      resolvedItem.textValue ??
      (textValue(resolveRenderProp(resolvedItem.label, resolvedItem)) || resolvedItem.value);
    const itemHaptics = resolvedItem.nativeHaptics ?? defaultNativeHaptics;
    const itemHapticsDelay = resolvedItem.nativeHapticsDelay ?? defaultNativeHapticsDelay;
    if (resolvedItem.subMenu?.length) {
      return (
        <Zeego.Sub {...resolvedItem.subMenuProps} key={key}>
          <Zeego.SubTrigger
            {...resolvedItem.triggerProps}
            aria-label={resolvedItem["aria-label"] ?? label}
            disabled={resolvedItem.disabled}
            key={`${key}:trigger`}
            onSelect={() => {
              triggerNativeHaptics(itemHaptics, { delay: itemHapticsDelay });
              (resolvedItem.triggerProps?.onSelect as (() => void) | undefined)?.();
            }}
            textValue={label}
          >
            <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
            {resolvedItem.iconProps ? <Zeego.ItemIcon {...resolvedItem.iconProps} /> : null}
          </Zeego.SubTrigger>
          <Zeego.SubContent {...resolvedItem.contentProps}>
            {resolvedItem.subMenuTitle === false ? null : resolvedItem.subMenuTitle ? (
              <Zeego.Label
                textValue={textValue(resolveRenderProp(resolvedItem.subMenuTitle, resolvedItem))}
              >
                {textValue(resolveRenderProp(resolvedItem.subMenuTitle, resolvedItem))}
              </Zeego.Label>
            ) : null}
            {renderItems(
              resolvedItem.subMenu,
              itemProps,
              defaultNativeHaptics,
              defaultNativeHapticsDelay,
              depth + 1,
            )}
          </Zeego.SubContent>
        </Zeego.Sub>
      );
    }
    if (resolvedItem.checked !== undefined) {
      return (
        <Zeego.CheckboxItem
          {...resolvedItem.itemProps}
          aria-label={resolvedItem["aria-label"] ?? label}
          disabled={resolvedItem.disabled}
          key={key}
          onValueChange={(next: "mixed" | "on" | "off", previous: "mixed" | "on" | "off") => {
            triggerNativeHaptics(itemHaptics, { delay: itemHapticsDelay });
            resolvedItem.onCheckedChange?.(next === "on");
            resolvedItem.onSelect?.();
            (
              resolvedItem.itemProps?.onValueChange as
                | ((next: "mixed" | "on" | "off", previous: "mixed" | "on" | "off") => void)
                | undefined
            )?.(next, previous);
          }}
          textValue={label}
          value={resolvedItem.checked ? "on" : "off"}
        >
          <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
        </Zeego.CheckboxItem>
      );
    }
    return (
      <Zeego.Item
        {...resolvedItem.itemProps}
        aria-label={resolvedItem["aria-label"] ?? label}
        destructive={resolvedItem.destructive}
        disabled={resolvedItem.disabled}
        key={key}
        onSelect={() => {
          triggerNativeHaptics(itemHaptics, { delay: itemHapticsDelay });
          (resolvedItem.onSelect ?? resolvedItem.onPress)?.();
          (resolvedItem.itemProps?.onSelect as (() => void) | undefined)?.();
        }}
        {...({ separatorBefore } as object)}
        {...({ selected: resolvedItem.selected } as object)}
        textValue={label}
      >
        <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
        {resolvedItem.subtitle ? (
          <Zeego.ItemSubtitle>{resolvedItem.subtitle}</Zeego.ItemSubtitle>
        ) : null}
        {resolvedItem.iconProps ? <Zeego.ItemIcon {...resolvedItem.iconProps} /> : null}
      </Zeego.Item>
    );
  });
}

function ContextMenu({
  children,
  items,
  itemProps,
  itemNativeHaptics,
  itemNativeHapticsDelay,
  nativeHaptics,
  nativeHapticsDelay,
  onOpenChange,
  onOpenWillChange,
  trigger,
  triggerProps,
  nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem,
  __menuRef,
  __unsafeIosProps,
  ...props
}: ContextMenuProps) {
  const haptics = useResolvedNativeHaptics(nativeHaptics);
  const itemHaptics = useResolvedNativeHaptics(itemNativeHaptics);
  const itemHapticsDelay = itemNativeHapticsDelay ?? nativeHapticsDelay;
  const generated = items != null || trigger != null;
  return (
    <NativeContextMenuHapticsContext.Provider
      value={{ item: itemHaptics, itemDelay: itemHapticsDelay }}
    >
      <Zeego.Root
        {...(props as React.ComponentProps<typeof Zeego.Root>)}
        {...({ __menuRef } as object)}
        {...(Platform.OS === "ios"
          ? {
              __unsafeIosProps: {
                ...(__unsafeIosProps as object | undefined),
                shouldWaitForMenuToHideBeforeFiringOnPressMenuItem:
                  nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem ?? false,
              },
            }
          : __unsafeIosProps == null
            ? {}
            : { __unsafeIosProps })}
        onOpenChange={(open) => {
          if (open && Platform.OS === "android") triggerNativeHaptics(haptics);
          onOpenChange?.(open);
        }}
        {...({ onOpenWillChange } as object)}
      >
        {generated ? (
          <>
            {trigger != null ? (
              <Zeego.Trigger {...({ action: "longPress", ...triggerProps } as object)}>
                {resolveRenderProp(trigger, { native: true, open: false }) as React.ReactElement}
              </Zeego.Trigger>
            ) : null}
            {items != null ? (
              <Zeego.Content>
                {renderItems(
                  items,
                  {
                    nativeHaptics: itemHaptics,
                    nativeHapticsDelay: itemHapticsDelay,
                    ...itemProps,
                  },
                  itemHaptics,
                  itemHapticsDelay,
                )}
              </Zeego.Content>
            ) : null}
            {children}
          </>
        ) : (
          children
        )}
      </Zeego.Root>
    </NativeContextMenuHapticsContext.Provider>
  );
}

function ContextMenuTrigger({ children, ...props }: any) {
  return (
    <Zeego.Trigger {...({ action: "longPress", ...props } as object)}>{children}</Zeego.Trigger>
  );
}
const ContextMenuGroup = Zeego.Group;
const ContextMenuSub = Zeego.Sub;
const ContextMenuPortal = React.Fragment;
const ContextMenuSeparator = Zeego.Separator;
const ContextMenuPreview = Zeego.Preview;
const ContextMenuAuxiliary = Zeego.Auxiliary;

function ContextMenuContent({ children, ...props }: any) {
  return <Zeego.Content {...props}>{children}</Zeego.Content>;
}
function ContextMenuSubContent({ children, ...props }: any) {
  return <Zeego.SubContent {...props}>{children}</Zeego.SubContent>;
}
function ContextMenuSubTrigger({ children, ...props }: any) {
  const contextHaptics = React.useContext(NativeContextMenuHapticsContext);
  const { title: label, subtitle } = resolveItemTitleAndSubtitle(
    children,
    props.textValue,
    props.subtitle,
  );
  return (
    <Zeego.SubTrigger
      {...props}
      onSelect={() => {
        triggerNativeHaptics(props.nativeHaptics ?? contextHaptics.item, {
          delay: props.nativeHapticsDelay ?? contextHaptics.itemDelay,
        });
        props.onSelect?.();
      }}
      textValue={label}
    >
      <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
      {subtitle ? <Zeego.ItemSubtitle>{subtitle}</Zeego.ItemSubtitle> : null}
    </Zeego.SubTrigger>
  );
}
function ContextMenuItem({ children, variant, ...props }: any) {
  const contextHaptics = React.useContext(NativeContextMenuHapticsContext);
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
        triggerNativeHaptics(props.nativeHaptics ?? contextHaptics.item, {
          delay: props.nativeHapticsDelay ?? contextHaptics.itemDelay,
        });
        (props.onSelect ?? props.onPress)?.();
      }}
      textValue={label}
    >
      <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
      {subtitle ? <Zeego.ItemSubtitle>{subtitle}</Zeego.ItemSubtitle> : null}
    </Zeego.Item>
  );
}
function ContextMenuCheckboxItem({ children, checked, onCheckedChange, ...props }: any) {
  const contextHaptics = React.useContext(NativeContextMenuHapticsContext);
  const { title: label, subtitle } = resolveItemTitleAndSubtitle(
    children,
    props.textValue,
    props.subtitle,
  );
  return (
    <Zeego.CheckboxItem
      {...props}
      onValueChange={(next: "mixed" | "on" | "off", previous: "mixed" | "on" | "off") => {
        triggerNativeHaptics(props.nativeHaptics ?? contextHaptics.item, {
          delay: props.nativeHapticsDelay ?? contextHaptics.itemDelay,
        });
        props.onValueChange?.(next, previous);
        onCheckedChange?.(next === "on");
      }}
      textValue={label}
      value={checked ? "on" : "off"}
    >
      <Zeego.ItemTitle>{label}</Zeego.ItemTitle>
      {subtitle ? <Zeego.ItemSubtitle>{subtitle}</Zeego.ItemSubtitle> : null}
    </Zeego.CheckboxItem>
  );
}
const RadioContext = React.createContext<{
  onValueChange?: (value: string) => void;
  value?: string;
}>({});
function ContextMenuRadioGroup({ children, onValueChange, value }: any) {
  return <RadioContext.Provider value={{ onValueChange, value }}>{children}</RadioContext.Provider>;
}
function ContextMenuRadioItem({ children, value, ...props }: any) {
  const radio = React.useContext(RadioContext);
  return (
    <ContextMenuCheckboxItem
      {...props}
      checked={radio.value === value}
      onCheckedChange={(checked: boolean) => checked && radio.onValueChange?.(value)}
    >
      {children}
    </ContextMenuCheckboxItem>
  );
}
function ContextMenuLabel({ children, ...props }: any) {
  const label = props.textValue ?? textValue(children);
  return (
    <Zeego.Label {...props} textValue={label}>
      {label}
    </Zeego.Label>
  );
}
function ContextMenuShortcut() {
  return null;
}

const ContextMenuComponent = Object.assign(ContextMenu, {
  Arrow: Zeego.Arrow,
  Auxiliary: ContextMenuAuxiliary,
  CheckboxItem: ContextMenuCheckboxItem,
  Content: ContextMenuContent,
  Group: ContextMenuGroup,
  Item: ContextMenuItem,
  ItemIcon: Zeego.ItemIcon,
  ItemImage: Zeego.ItemImage,
  ItemIndicator: Zeego.ItemIndicator,
  ItemSubtitle: Zeego.ItemSubtitle,
  ItemTitle: Zeego.ItemTitle,
  Label: ContextMenuLabel,
  Portal: ContextMenuPortal,
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
export const ContextMenuNative = ContextMenuComponent;
