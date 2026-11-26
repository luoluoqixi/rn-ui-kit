import { useEffect, useRef } from "react";
import { useOverlayState, type OverlayStateProps } from "../utils/overlay/overlay_state";
import { createNativeMenuItems } from "../context_menu/native_menu_items";
import { resolveMenuAdapter, useMenuConfig } from "../context_menu/menu_provider";
import type { ContextMenuItemData } from "../context_menu/types";
import type { DropdownItemData } from "../dropdown/types";
import { startMenuAdapterSession } from "./menu_adapter_session";
import type { MenuAdapterProps, MenuAdapterRequest, MenuAnchorRect } from "./menu_adapter_types";
import type { MenuContentProps } from "./types";

type Props = OverlayStateProps & MenuAdapterProps & {
  items?: (ContextMenuItemData | DropdownItemData)[];
  itemProps?: Record<string, unknown>;
  contentProps?: MenuContentProps;
  onOpenWillChange?: (open: boolean) => void;
};
type Anchor = MenuAdapterRequest["anchor"];
type Source = MenuAdapterRequest["source"];

export function elementMenuRect(element: Element | null | undefined): MenuAnchorRect {
  const rect = element?.getBoundingClientRect();
  return { x: rect?.left ?? 0, y: rect?.top ?? 0, width: rect?.width ?? 0, height: rect?.height ?? 0 };
}

export function useHostMenu(p: Props, kind: MenuAdapterRequest["kind"], disabled: boolean, measure: () => MenuAnchorRect, ownerDocument: () => Document = () => document) {
  const config = useMenuConfig();
  const state = useOverlayState({ ...p, onOpenChange: next => {
    p.onOpenWillChange?.(next);
    p.onOpenChange?.(next);
  } }, disabled);
  const latest = useRef({ p, config, state, measure, ownerDocument });
  latest.current = { p, config, state, measure, ownerDocument };
  const owner = useRef({}).current;
  const active = useRef<ReturnType<typeof startMenuAdapterSession> | null>(null);
  const pending = useRef<{ anchor: Anchor; source: Source } | null>(null);

  function start() {
    const { p, config, state, measure, ownerDocument } = latest.current;
    const adapter = resolveMenuAdapter(config, p.menuAdapter) ??
      (p.menuAdapter !== false && config.menuAdapter !== false && kind === "context-menu" && config.showNativeMenu
        ? { open: (request: MenuAdapterRequest) => ({ closed: config.showNativeMenu!(request) }) }
        : undefined);
    if (!adapter) { state.setOpen(false); return; }
    const { anchor, source } = pending.current ?? { anchor: { rect: measure() }, source: "programmatic" as const };
    pending.current = null;
    const placement = { side: p.contentProps?.side ?? "bottom", align: p.contentProps?.align ?? "start", sideOffset: p.contentProps?.sideOffset ?? 0 };
    const { rect, point } = anchor;
    const cross = (start: number, length: number) => start + (placement.align === "end" ? length : placement.align === "center" ? length / 2 : 0);
    const x = point?.x ?? (placement.side === "left" ? rect.x - placement.sideOffset
      : placement.side === "right" ? rect.x + rect.width + placement.sideOffset : cross(rect.x, rect.width));
    const y = point?.y ?? (placement.side === "top" ? rect.y - placement.sideOffset
      : placement.side === "bottom" ? rect.y + rect.height + placement.sideOffset : cross(rect.y, rect.height));
    const doc = ownerDocument();
    const focused = doc.activeElement;
    active.current = startMenuAdapterSession({
      scope: doc, owner, adapter,
      request: { kind, source, anchor, x, y, placement, options: p.menuAdapterOptions },
      createItems: isCurrent => createNativeMenuItems(p.items ?? [], p.itemProps, disabled, { kind, isCurrent }),
      onRelease: () => latest.current.state.setOpen(false),
      onError: error => latest.current.config.onNativeMenuError?.(error),
      restoreFocus: () => {
        if (focused?.isConnected && "focus" in focused &&
          (doc.activeElement === focused || doc.activeElement === doc.body))
          (focused as HTMLElement).focus({ preventScroll: true });
      },
    });
  }

  useEffect(() => {
    if (disabled) {
      const releasesFeedback = active.current && !active.current.feedbackReleased;
      active.current?.cancel();
      if (!releasesFeedback) state.setOpen(false);
    } else if (state.open) {
      if (!active.current || active.current.feedbackReleased) start();
    } else if (active.current && !active.current.feedbackReleased) {
      active.current.cancel(false);
      active.current = null;
    }
    // 回调/适配器可随渲染更新，但不能因此重复打开当前菜单。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.open, disabled]);
  useEffect(() => () => {
    active.current?.cancel(false);
    active.current = null;
  }, []);

  return {
    open: state.open,
    present(anchor?: Anchor, source: Source = "programmatic") {
      if (disabled) return;
      pending.current = { anchor: anchor ?? { rect: measure() }, source };
      if (state.open) {
        p.onOpenWillChange?.(true);
        p.onOpenChange?.(true);
        start();
      } else state.setOpen(true);
    },
  };
}
