import { useEffect, useRef, type MouseEvent, type KeyboardEvent } from "react";
import { View } from "react-native";
import { resolveRenderProp } from "../utils/render";
import { createNativeMenuItems } from "./native_menu_items";
import { useMenuConfig } from "./menu_provider";
import type { ContextMenuProps } from "./types";

/** 宿主原生菜单保留与自定义菜单相同的触发和生命周期回调。 */
export function ContextMenuHost({
  items,
  itemProps,
  trigger,
  triggerProps,
  children,
  onOpenChange,
  onOpenWillChange,
  ...props
}: ContextMenuProps) {
  const config = useMenuConfig();
  const sequence = useRef(0);
  useEffect(
    () => () => {
      sequence.current += 1;
    },
    [],
  );
  const show = async (x: number, y: number) => {
    const current = ++sequence.current;
    const isCurrent = () => sequence.current === current;
    const focusedElement = document.activeElement;
    onOpenWillChange?.(true);
    onOpenChange?.(true);
    try {
      await config.showNativeMenu?.({
        items: createNativeMenuItems(items ?? [], itemProps),
        x,
        y,
        isCurrent,
      });
    } catch (error) {
      if (isCurrent()) config.onNativeMenuError?.(error);
    } finally {
      if (isCurrent()) {
        onOpenWillChange?.(false);
        onOpenChange?.(false);
        // 系统菜单没有 DOM 锚点；仅在原焦点仍存在时归还焦点。
        if (
          focusedElement instanceof HTMLElement &&
          focusedElement.isConnected &&
          (document.activeElement === focusedElement ||
            document.activeElement === document.body)
        )
          focusedElement.focus({ preventScroll: true });
      }
    }
  };
  return (
    <View
      {...props}
      {...triggerProps}
      style={[
        props.style,
        typeof triggerProps?.style === "function"
          ? triggerProps.style({ pressed: false, hovered: false })
          : triggerProps?.style,
      ]}
      {...{
        onContextMenu: (event: MouseEvent) => {
          if (event.defaultPrevented || triggerProps?.disabled) return;
          event.preventDefault();
          event.stopPropagation();
          void show(event.clientX, event.clientY);
        },
        onKeyDown: (event: KeyboardEvent) => {
          if (
            event.defaultPrevented ||
            triggerProps?.disabled ||
            (event.key !== "ContextMenu" &&
              !(event.shiftKey && event.key === "F10"))
          )
            return;
          event.preventDefault();
          event.stopPropagation();
          const rect = (event.target as HTMLElement).getBoundingClientRect();
          void show(rect.left, rect.bottom);
        },
      }}
    >
      {resolveRenderProp(trigger, { native: true, open: false })}
      {children}
    </View>
  );
}
