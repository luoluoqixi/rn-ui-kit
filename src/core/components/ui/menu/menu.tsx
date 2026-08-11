import { ChevronRight } from "@tamagui/lucide-icons-2";
import {
  Children,
  createContext,
  type ReactNode,
  isValidElement,
  useContext,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import { SizableText, Menu as TamaguiMenu, YStack } from "tamagui";

import { isWeb, os } from "../utils/platform";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { NativeTrigger } from "../native_trigger";

import type {
  MenuArrowProps,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuGroupProps,
  MenuItemData,
  MenuItemIconProps,
  MenuItemIndicatorProps,
  MenuItemProps,
  MenuItemTitleProps,
  MenuLabelProps,
  MenuPortalProps,
  MenuProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuScrollViewProps,
  MenuSeparatorProps,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
  MenuTriggerState,
  MenuTriggerProps,
} from "./types";

const DEFAULT_MENU_ENTER_STYLE = { opacity: 0, scale: 0.96, y: -4 } as const;
const DEFAULT_MENU_EXIT_STYLE = { opacity: 0, scale: 0.98, y: -2 } as const;
const DEFAULT_MENU_INTERACTIVE_STYLE = { cursor: "default" } as const;
const DEFAULT_MENU_TRIGGER_ACTIVE_OPACITY = 0.6;

const MenuTriggerStateContext = createContext<MenuTriggerState | null>(null);

/**
 * 读取所属 `Menu` 的 trigger 实时状态。
 *
 * 仅能在该 Menu 的 `trigger` render function 返回的后代组件中调用。
 */
export function useMenuTriggerState(): MenuTriggerState {
  const state = useContext(MenuTriggerStateContext);

  if (state == null) {
    throw new Error("useMenuTriggerState 必须在 Menu 的 trigger 后代组件中调用。");
  }

  return state;
}

function mergeMenuStyle<T extends object>(baseStyle: T, style: unknown): T {
  return StyleSheet.flatten([baseStyle, style] as any) as T;
}

function normalizeMenuChildren(children: ReactNode) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <SizableText>{child}</SizableText>;
    }

    if (isValidElement(child)) {
      return child;
    }

    return child;
  });
}

function getChildrenTextValue(children: ReactNode) {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  return undefined;
}

function getMenuItemTextValue(label: ReactNode, fallback: string) {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }

  return fallback;
}

function MenuRoot(props: MenuProps) {
  const {
    arrow,
    arrowProps,
    children,
    contentProps,
    itemProps,
    items,
    nativeHaptics,
    nativeAnchorAlignment,
    nativeSelectedItemBackgroundColor,
    nativeTrigger,
    nativeTriggerContainerStyle,
    nativeTriggerContent,
    nativeTriggerIcon,
    nativeTriggerLabel,
    nativeTriggerLabelProps,
    offset,
    onOpenChange,
    onOpenWillChange,
    portalProps,
    trigger,
    triggerProps,
    ...rootProps
  } = props;
  const triggerIsRenderFunction = typeof trigger === "function";
  const resolvedNativeTriggerLabel =
    nativeTriggerLabel ?? (triggerIsRenderFunction ? undefined : trigger);
  const resolvedNativeAnchorAlignment = nativeAnchorAlignment ?? "center";
  const web = isWeb();
  const ios = os() === "ios";
  const resolvedPlacement = rootProps.placement ?? (web ? "bottom" : undefined);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(rootProps.defaultOpen));
  const [willOpen, setWillOpen] = useState(Boolean(rootProps.defaultOpen));
  const [isTriggerPressed, setIsTriggerPressed] = useState(false);
  const isOpen = rootProps.open ?? uncontrolledOpen;
  const isOpening = willOpen && !isOpen;
  // 保持默认 NativeTrigger 原有的 active 判定；额外的按住状态仅供外部 hook 使用。
  const isNativeTriggerActive = ios ? (rootProps.open ?? willOpen) : isOpen;
  const isTriggerActive = isNativeTriggerActive || isTriggerPressed;
  const triggerState: MenuTriggerState = {
    isActive: isTriggerActive,
    isOpen,
    isOpening,
    isPressed: isTriggerPressed,
    opacity: isTriggerActive ? DEFAULT_MENU_TRIGGER_ACTIVE_OPACITY : 1,
  };
  const renderedTrigger = triggerIsRenderFunction ? trigger(triggerState) : trigger;
  const shouldRenderTrigger =
    renderedTrigger != null ||
    (nativeTrigger === true &&
      (resolvedNativeTriggerLabel != null || nativeTriggerContent != null));
  const hasDefaultStructure = shouldRenderTrigger || items != null || arrow != null;
  const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
  const handleOpenChange: NonNullable<MenuProps["onOpenChange"]> = (nextOpen) => {
    if (rootProps.open === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    if (!nextOpen) {
      setIsTriggerPressed(false);
    }
    onOpenChange?.(nextOpen);

    if (nextOpen && !ios) {
      triggerNativeHaptics(resolvedNativeHaptics);
    }
  };
  const handleOpenWillChange: NonNullable<MenuProps["onOpenWillChange"]> = (nextOpen) => {
    setWillOpen(nextOpen);
    if (!nextOpen) {
      setIsTriggerPressed(false);
    }
    onOpenWillChange?.(nextOpen);

    if (nextOpen) {
      triggerNativeHaptics(resolvedNativeHaptics);
    }
  };
  const iosOpenWillChangeProps = ios ? { onOpenWillChange: handleOpenWillChange } : undefined;
  const resolvedTriggerProps: MenuTriggerProps = {
    ...triggerProps,
    onPressIn: (event: any) => {
      setIsTriggerPressed(true);
      triggerProps?.onPressIn?.(event);
    },
    onPressOut: (event: any) => {
      setIsTriggerPressed(false);
      triggerProps?.onPressOut?.(event);
    },
  };

  // Menu 在 native 上浮动定位后视觉顺序反转，统一反转 children / items
  const resolvedChildren = Children.toArray(children).reverse();
  const renderItems = (menuItems: MenuItemData[], depth = 0): ReactNode => {
    const resolvedMenuItems = ios ? [...menuItems].reverse() : menuItems;

    return resolvedMenuItems.map((item) => {
      if (item.separator) {
        return <MenuSeparator key={item.value} />;
      }

      const label = item.label ?? item.value;
      const textValue = item.textValue ?? getMenuItemTextValue(label, item.value);
      const accessibilityLabel = resolveAriaLabel(
        item["aria-label"] ?? itemProps?.["aria-label"],
        label,
      );
      const hasTrailingContent = item.icon != null || item.indicator != null;

      if (item.subMenu?.length) {
        const subMenuTitle = item.subMenuTitle === false ? null : (item.subMenuTitle ?? label);

        return (
          <MenuSub key={item.value}>
            <MenuSubTrigger
              {...(itemProps as MenuSubTriggerProps)}
              aria-label={accessibilityLabel}
              destructive={item.destructive ?? itemProps?.destructive}
              disabled={item.disabled ?? itemProps?.disabled}
              justify={itemProps?.justify ?? "space-between"}
              textValue={textValue}
            >
              <MenuItemTitle>{label}</MenuItemTitle>
              {item.icon != null ? <MenuItemIcon>{item.icon}</MenuItemIcon> : null}
              {item.indicator}
              {web ? (
                <MenuItemIcon>
                  <ChevronRight color="$color10" size={16} />
                </MenuItemIcon>
              ) : null}
            </MenuSubTrigger>
            <MenuPortal zIndex={200 + depth}>
              <MenuSubContent>
                {web && subMenuTitle != null ? <MenuLabel>{subMenuTitle}</MenuLabel> : null}
                {renderItems(item.subMenu, depth + 1)}
              </MenuSubContent>
            </MenuPortal>
          </MenuSub>
        );
      }

      return (
        <MenuItem
          {...itemProps}
          aria-label={accessibilityLabel}
          destructive={item.destructive ?? itemProps?.destructive}
          disabled={item.disabled ?? itemProps?.disabled}
          justify={itemProps?.justify ?? (hasTrailingContent ? "space-between" : undefined)}
          key={item.value}
          onSelect={item.onSelect ?? item.onPress}
          {...({ selected: item.selected } as any)}
          textValue={textValue}
        >
          <MenuItemTitle>{label}</MenuItemTitle>
          {item.icon != null ? <MenuItemIcon>{item.icon}</MenuItemIcon> : null}
          {item.indicator != null ? <MenuItemIndicator>{item.indicator}</MenuItemIndicator> : null}
        </MenuItem>
      );
    });
  };

  if (!hasDefaultStructure) {
    return (
      <MenuTriggerStateContext.Provider value={triggerState}>
        <TamaguiMenu
          {...rootProps}
          {...({ anchorAlignment: resolvedNativeAnchorAlignment } as any)}
          {...({ isAnchoredToRight: resolvedNativeAnchorAlignment === "end" } as any)}
          {...(nativeSelectedItemBackgroundColor != null
            ? ({ selectedItemBackgroundColor: nativeSelectedItemBackgroundColor } as any)
            : undefined)}
          {...iosOpenWillChangeProps}
          offset={offset ?? 8}
          onOpenChange={handleOpenChange}
          placement={resolvedPlacement}
        >
          {resolvedChildren}
        </TamaguiMenu>
      </MenuTriggerStateContext.Provider>
    );
  }

  return (
    <MenuTriggerStateContext.Provider value={triggerState}>
      <TamaguiMenu
        {...rootProps}
        {...({ anchorAlignment: resolvedNativeAnchorAlignment } as any)}
        {...({ isAnchoredToRight: resolvedNativeAnchorAlignment === "end" } as any)}
        {...(nativeSelectedItemBackgroundColor != null
          ? ({ selectedItemBackgroundColor: nativeSelectedItemBackgroundColor } as any)
          : undefined)}
        {...iosOpenWillChangeProps}
        offset={offset ?? 8}
        onOpenChange={handleOpenChange}
        placement={resolvedPlacement}
      >
        {shouldRenderTrigger ? (
          <MenuTrigger
            {...resolvedTriggerProps}
            asChild={nativeTrigger ? true : triggerProps?.asChild}
          >
            {triggerIsRenderFunction ? (
              renderedTrigger
            ) : nativeTrigger ? (
              <NativeTrigger
                active={isNativeTriggerActive}
                containerStyle={nativeTriggerContainerStyle}
                content={nativeTriggerContent}
                icon={nativeTriggerIcon}
                keepPressedOpacity={ios}
                label={resolvedNativeTriggerLabel}
                labelProps={nativeTriggerLabelProps}
              />
            ) : (
              renderedTrigger
            )}
          </MenuTrigger>
        ) : null}
        <MenuPortal {...portalProps}>
          <MenuContent {...contentProps}>
            {arrow ? <MenuArrow {...arrowProps} /> : null}
            <MenuScrollView>
              {items ? renderItems(items) : null}
              {resolvedChildren}
            </MenuScrollView>
          </MenuContent>
        </MenuPortal>
      </TamaguiMenu>
    </MenuTriggerStateContext.Provider>
  );
}

function MenuTrigger(props: MenuTriggerProps) {
  return <TamaguiMenu.Trigger asChild={props.asChild ?? isWeb()} {...props} />;
}

function MenuPortal(props: MenuPortalProps) {
  return <TamaguiMenu.Portal {...props} zIndex={props.zIndex ?? 100} />;
}

function MenuContent(props: MenuContentProps) {
  const { boxShadow, enterStyle, exitStyle, style, transition, ...contentProps } = props;

  return (
    <TamaguiMenu.Content
      {...contentProps}
      boxShadow={boxShadow ?? "0 4px 5px $shadowColor"}
      enterStyle={enterStyle ?? DEFAULT_MENU_ENTER_STYLE}
      exitStyle={exitStyle ?? DEFAULT_MENU_EXIT_STYLE}
      style={mergeMenuStyle({ borderRadius: 16 }, style)}
      transition={transition ?? "100ms"}
    />
  );
}

function MenuScrollView(props: MenuScrollViewProps) {
  const { children, ...scrollViewProps } = props;

  return (
    <TamaguiMenu.ScrollView {...scrollViewProps}>
      <YStack p={5}>{children}</YStack>
    </TamaguiMenu.ScrollView>
  );
}

function MenuGroup(props: MenuGroupProps) {
  return <TamaguiMenu.Group {...props} />;
}

function MenuLabel(props: MenuLabelProps) {
  const { style, ...labelProps } = props;

  return (
    <TamaguiMenu.Label
      {...labelProps}
      color={props.color ?? "$color9"}
      select={props.select ?? "none"}
      size={props.size ?? "$3"}
      style={mergeMenuStyle({ padding: 5 }, style)}
    />
  );
}

function MenuItem(props: MenuItemProps) {
  const { children, textValue, ...itemProps } = props;

  return (
    <TamaguiMenu.Item
      {...itemProps}
      textValue={textValue ?? getChildrenTextValue(children)}
      style={mergeMenuStyle(DEFAULT_MENU_INTERACTIVE_STYLE, (props as any).style) as any}
    >
      {normalizeMenuChildren(children)}
    </TamaguiMenu.Item>
  );
}

function MenuItemTitle(props: MenuItemTitleProps) {
  return <TamaguiMenu.ItemTitle {...props} />;
}

function MenuItemIcon(props: MenuItemIconProps) {
  return <TamaguiMenu.ItemIcon {...props} />;
}

function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  const { children, textValue, ...itemProps } = props;

  return (
    <TamaguiMenu.CheckboxItem
      {...itemProps}
      textValue={textValue ?? getChildrenTextValue(children)}
      style={mergeMenuStyle(DEFAULT_MENU_INTERACTIVE_STYLE, (props as any).style) as any}
    >
      {normalizeMenuChildren(children)}
    </TamaguiMenu.CheckboxItem>
  );
}

function MenuRadioGroup(props: MenuRadioGroupProps) {
  return <TamaguiMenu.RadioGroup {...props} />;
}

function MenuRadioItem(props: MenuRadioItemProps) {
  const { children, textValue, ...itemProps } = props;

  return (
    <TamaguiMenu.RadioItem
      {...itemProps}
      textValue={textValue ?? getChildrenTextValue(children)}
      style={mergeMenuStyle(DEFAULT_MENU_INTERACTIVE_STYLE, (props as any).style) as any}
    >
      {normalizeMenuChildren(children)}
    </TamaguiMenu.RadioItem>
  );
}

function MenuItemIndicator(props: MenuItemIndicatorProps) {
  return <TamaguiMenu.ItemIndicator {...props} />;
}

function MenuSeparator(props: MenuSeparatorProps) {
  return <TamaguiMenu.Separator {...props} />;
}

function MenuArrow(props: MenuArrowProps) {
  return (
    <TamaguiMenu.Arrow
      {...props}
      borderColor={props.borderColor ?? "$borderColor"}
      borderWidth={props.borderWidth ?? 1}
      size={props.size ?? "$4"}
    />
  );
}

function MenuSub(props: MenuSubProps) {
  return <TamaguiMenu.Sub {...props} />;
}

function MenuSubTrigger(props: MenuSubTriggerProps) {
  const { children, textValue, ...subTriggerProps } = props;

  return (
    <TamaguiMenu.SubTrigger
      {...subTriggerProps}
      textValue={textValue ?? getChildrenTextValue(children)}
      style={mergeMenuStyle(DEFAULT_MENU_INTERACTIVE_STYLE, (props as any).style) as any}
    >
      {normalizeMenuChildren(children)}
    </TamaguiMenu.SubTrigger>
  );
}

function MenuSubContent(props: MenuSubContentProps) {
  const { boxShadow, enterStyle, exitStyle, style, transition, ...contentProps } = props;

  return (
    <TamaguiMenu.SubContent
      {...contentProps}
      boxShadow={boxShadow ?? "0 4px 5px $shadowColor"}
      enterStyle={enterStyle ?? DEFAULT_MENU_ENTER_STYLE}
      exitStyle={exitStyle ?? DEFAULT_MENU_EXIT_STYLE}
      style={mergeMenuStyle({ borderRadius: 16, padding: 5 }, style)}
      transition={transition ?? "100ms"}
    />
  );
}

MenuRoot.displayName = "Menu";
MenuTrigger.displayName = "Trigger";
MenuPortal.displayName = "Portal";
MenuContent.displayName = "Content";
MenuScrollView.displayName = "ScrollView";
MenuGroup.displayName = "Group";
MenuLabel.displayName = "Label";
MenuItem.displayName = "Item";
MenuItemTitle.displayName = "ItemTitle";
MenuItemIcon.displayName = "ItemIcon";
MenuCheckboxItem.displayName = "CheckboxItem";
MenuRadioGroup.displayName = "RadioGroup";
MenuRadioItem.displayName = "RadioItem";
MenuItemIndicator.displayName = "ItemIndicator";
MenuSeparator.displayName = "Separator";
MenuArrow.displayName = "Arrow";
MenuSub.displayName = "Sub";
MenuSubTrigger.displayName = "SubTrigger";
MenuSubContent.displayName = "SubContent";

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Content: MenuContent,
  ScrollView: MenuScrollView,
  Group: MenuGroup,
  Label: MenuLabel,
  Item: MenuItem,
  ItemTitle: MenuItemTitle,
  ItemIcon: MenuItemIcon,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  ItemIndicator: MenuItemIndicator,
  Separator: MenuSeparator,
  Arrow: MenuArrow,
  Sub: MenuSub,
  SubTrigger: MenuSubTrigger,
  SubContent: MenuSubContent,
});
