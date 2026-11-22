import { cloneElement, useCallback, useEffect, useLayoutEffect, useRef, type ReactElement } from "react";
import { Image, Pressable, ScrollView, Text, View, type GestureResponderEvent, type PressableProps, useWindowDimensions } from "react-native";
import { Menu, useMenu } from "heroui-native/menu";
import { HeroUIWindowAnchor } from "../utils/overlay/heroui_anchor.native";
import { MenuSurface } from "../menu/menu_heroui.native";
import { useContextMenuModel } from "./context_menu_heroui_shared";
import type { ContextMenuProps } from "./types";

type Model = ReturnType<typeof useContextMenuModel>;

function LongPressAnchor({ p, model: m }: { p: ContextMenuProps; model: Model }) {
  const menu = useMenu();
  const anchor = useRef<View | null>(null);
  const localSize = useRef({ width: 0, height: 0 });
  const touch = useRef<{ x: number; y: number } | null>(null);
  const longPressed = useRef(false);
  const generation = useRef(0);
  const latest = useRef({ menu, m, p });
  latest.current = { menu, m, p };
  const { width, height } = useWindowDimensions();
  const measure = useCallback((open: boolean) => {
    const id = ++generation.current;
    anchor.current?.measure((_x, _y, w, h, pageX, pageY) => {
      const current = latest.current;
      if (id !== generation.current || current.m.disabled) return;
      if (![w, h, pageX, pageY].every(Number.isFinite) || w <= 0 || h <= 0) return;
      const point = current.p.anchor === "touch" ? touch.current : null;
      // Convert local press coordinates through the already verified window
      // rect. This also handles an inset/scaled iOS TrueSheet presentation.
      current.menu.setTriggerPosition(point ? {
        width: 0, height: 0,
        pageX: pageX + Math.max(0, Math.min(1, point.x / (localSize.current.width || w))) * w,
        pageY: pageY + Math.max(0, Math.min(1, point.y / (localSize.current.height || h))) * h,
      } : { width: w, height: h, pageX, pageY });
      if (open) current.m.setOpen(true);
    });
  }, []);
  useLayoutEffect(() => {
    if (m.open) measure(false);
    else {
      ++generation.current;
      menu.setTriggerPosition(null);
      menu.setContentLayout(null);
    }
    return () => { ++generation.current; };
  }, [m.open, width, height, measure]);
  useEffect(() => () => { ++generation.current; }, []);
  useEffect(() => {
    if (!p.__menuRef) return;
    p.__menuRef.current = { presentMenu: () => { touch.current = null; measure(true); } };
    return () => { if (p.__menuRef) p.__menuRef.current = null; };
  }, [p.__menuRef, measure]);
  const element = m.trigger as ReactElement<PressableProps>;
  const { asChild, ...t } = p.triggerProps ?? {};
  // Non-interactive RN primitives do not consume Pressable event props. Give
  // those regions a responder, while real buttons retain their single responder.
  const interactive = asChild ?? ![View, Text, Image, ScrollView].some(type => element.type === type);
  const child: ReactElement<PressableProps> = interactive ? element : <Pressable>{element}</Pressable>;
  const call = (name: "onPress" | "onLongPress" | "onPressIn" | "onPressOut", event: GestureResponderEvent) => {
    child.props[name]?.(event);
    if (t?.[name] !== child.props[name]) t?.[name]?.(event);
  };
  return <HeroUIWindowAnchor ref={anchor} isOpen={m.open}>{cloneElement(child, {
    ...t,
    disabled: m.disabled || child.props.disabled,
    accessibilityRole: child.props.accessibilityRole ?? "button",
    accessibilityState: { ...child.props.accessibilityState, disabled: m.disabled, expanded: m.open },
    onLayout: event => {
      localSize.current = event.nativeEvent.layout;
      child.props.onLayout?.(event);
      if (t?.onLayout !== child.props.onLayout) t?.onLayout?.(event);
    },
    onPressIn: event => { longPressed.current = false; ++generation.current; call("onPressIn", event); },
    onLongPress: event => {
      call("onLongPress", event);
      if (m.disabled || event.defaultPrevented) return;
      longPressed.current = true;
      touch.current = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
      measure(true);
    },
    onPressOut: event => call("onPressOut", event),
    onPress: event => { if (!longPressed.current && !m.disabled) call("onPress", event); },
  })}</HeroUIWindowAnchor>;
}

export function ContextMenuHeroUI(p: ContextMenuProps) {
  const m = useContextMenuModel(p);
  return <Menu {...p.herouiNativeProps} style={p.style} className={p.className}
    isOpen={m.open} onOpenChange={m.setOpen} isDisabled={m.disabled}>
    <LongPressAnchor p={p} model={m} />
    <MenuSurface items={m.items} contentProps={p.contentProps} accessibilityLabel={p.accessibilityLabel} />
  </Menu>;
}
