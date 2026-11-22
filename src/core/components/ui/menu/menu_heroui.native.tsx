import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu, useMenu } from "heroui-native/menu";
import { SubMenu } from "heroui-native/sub-menu";
import { useAnimationSettings } from "heroui-native/contexts";
import { Separator } from "../separator";
import { Text } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import { HeroUIWindowOverlayScope } from "../utils/overlay/heroui_anchor.native";
import type { MenuEntry, MenuSurfaceProps } from "./types";

// HeroUI reserves only the trigger row for its floating SubMenu. Inside a
// ScrollView the expanded surface must also participate in the scroll extent.
const submenuPaddingTop = 12;
const submenuSpring = { damping: 100, stiffness: 950, mass: 3 };
const submenuAnimation = {
  rootContent: {
    marginHorizontal: 0,
    marginVertical: 0,
    paddingTop: submenuPaddingTop,
    springConfig: submenuSpring,
  },
};

function ScrollableSubMenu({ item, children }: { item: MenuEntry; children: ReactNode }) {
  const font = useDefaultTextStyle();
  const [open, setOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const { isAllAnimationsDisabled } = useAnimationSettings();
  const space = useAnimatedStyle(() => {
    const paddingBottom = open ? contentHeight + submenuPaddingTop : 0;
    return {
      paddingBottom: isAllAnimationsDisabled
        ? paddingBottom
        : withSpring(paddingBottom, submenuSpring),
    };
  }, [open, contentHeight, isAllAnimationsDisabled]);
  return (
    <Animated.View style={[space, { zIndex: open ? 50 : 0 }]}>
      <SubMenu
        isDisabled={item.disabled}
        isOpen={open}
        onOpenChange={setOpen}
        animation={submenuAnimation}
      >
        <SubMenu.Trigger textValue={item.textValue}>
          {(item.icon != null || item.reserveIconSpace) && (
            <View className="size-5 shrink-0">{item.icon}</View>
          )}
          <Text className="flex-1 text-base font-medium text-foreground" style={font}>
            {item.label}
          </Text>
          <SubMenu.TriggerIndicator />
        </SubMenu.Trigger>
        <SubMenu.Content onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}>
          {children}
        </SubMenu.Content>
      </SubMenu>
    </Animated.View>
  );
}

function MenuScrollBody({ maxHeight, children }: { maxHeight: number; children: ReactNode }) {
  const { isSubMenuOpen, openSubMenuId, closeSubMenu } = useMenu();
  return (
    <ScrollView
      style={{ maxHeight, marginHorizontal: -5, zIndex: isSubMenuOpen ? 50 : 0 }}
      contentContainerStyle={{ paddingHorizontal: 5 }}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
      {/* Keep HeroUI's dismiss layer inside the same stacking context as its
        submenus; a sibling overlay above ScrollView intercepts their touches. */}
      {isSubMenuOpen && (
        <Pressable
          accessibilityLabel="返回上级菜单"
          accessibilityRole="button"
          style={{ position: "absolute", inset: 0, zIndex: 40 }}
          onPress={() => {
            if (openSubMenuId !== null) closeSubMenu(openSubMenuId);
          }}
        />
      )}
      {children}
    </ScrollView>
  );
}

function MenuItems({ items }: { items: MenuEntry[] }) {
  const font = useDefaultTextStyle();
  return (
    <>
      {items.map((item) => {
        if (item.separator)
          return (
            <Separator
              key={item.value}
              variant={item.separatorVariant}
              className={
                item.separatorVariant === "thick"
                  ? "-mx-[5px] my-1 opacity-25"
                  : "mx-2 my-1 opacity-75"
              }
            />
          );
        if (item.subMenu)
          return (
            <ScrollableSubMenu key={item.value} item={item}>
              {item.subMenuTitle !== false && (
                <Menu.Label style={font}>{item.subMenuTitle ?? item.label}</Menu.Label>
              )}
              <MenuItems items={item.subMenu} />
            </ScrollableSubMenu>
          );
        const choice = item.checkbox || item.selected !== undefined;
        return (
          <Menu.Item
            {...item.herouiNativeProps}
            key={item.value}
            id={item.value}
            accessibilityLabel={item.textValue}
            isDisabled={item.disabled}
            isSelected={choice ? !!item.selected : undefined}
            variant={item.destructive ? "danger" : "default"}
            shouldCloseOnSelect={
              item.shouldCloseOnSelect ??
              item.herouiNativeProps?.shouldCloseOnSelect ??
              !item.checkbox
            }
            onPress={item.onAction}
          >
            {choice && item.selectionIndicatorPosition !== "right" && (
              <Menu.ItemIndicator variant={item.selectionIndicatorVariant}>
                {item.indicator}
              </Menu.ItemIndicator>
            )}
            {(item.icon != null || item.reserveIconSpace) && (
              <View className="size-5 shrink-0">{item.icon}</View>
            )}
            <View className="flex-1">
              <Menu.ItemTitle style={font}>{item.label}</Menu.ItemTitle>
              {item.subtitle && (
                <Menu.ItemDescription style={font}>{item.subtitle}</Menu.ItemDescription>
              )}
            </View>
            {item.shortcut != null && (
              <Text className="shrink-0 text-sm" color="muted" style={font}>
                {item.shortcut}
              </Text>
            )}
            {choice && item.selectionIndicatorPosition === "right" && (
              <Menu.ItemIndicator variant={item.selectionIndicatorVariant}>
                {item.indicator}
              </Menu.ItemIndicator>
            )}
          </Menu.Item>
        );
      })}
    </>
  );
}

export function MenuSurface({ items, contentProps: c, accessibilityLabel }: MenuSurfaceProps) {
  const placement = c?.herouiNativeProps?.placement ?? c?.side ?? "bottom";
  const align =
    c?.herouiNativeProps?.align ??
    c?.align ??
    (placement === "top" || placement === "bottom" ? "center" : "start");
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const maxHeight = Math.max(
    1,
    Math.min(c?.maxHeight ?? 320, height - insets.top - insets.bottom - 32),
  );
  return (
    <Menu.Portal>
      <HeroUIWindowOverlayScope>
        <Menu.Overlay />
        <Menu.Content
          {...c?.herouiNativeProps}
          presentation="popover"
          placement={placement}
          align={align}
          offset={c?.herouiNativeProps?.offset ?? c?.sideOffset ?? 8}
          className={c?.className}
          accessibilityLabel={accessibilityLabel ?? "菜单"}
        >
          <MenuScrollBody maxHeight={maxHeight}>
            <MenuItems items={items} />
          </MenuScrollBody>
        </Menu.Content>
      </HeroUIWindowOverlayScope>
    </Menu.Portal>
  );
}
