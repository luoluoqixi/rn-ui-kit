import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import { Platform } from "react-native";
import type { TooltipRootProps } from "./types";
import { listenForTooltipHoverDismiss } from "./tooltip_hover_dismiss.web";
import { closeTooltipAfterPress, shouldSuppressTooltipHover } from "./tooltip_press_behavior";

type TooltipTriggerRef = React.ComponentRef<typeof TooltipPrimitive.Trigger>;
const TooltipInteractionContext = React.createContext<{
  openOnPress: boolean;
  openOnFocus: boolean;
  openRef: React.RefObject<boolean>;
  hoverDismissCleanupRef: React.RefObject<(() => void) | null>;
  suppressHoverRef: React.RefObject<boolean>;
  triggerRef: React.RefObject<TooltipTriggerRef | null>;
} | null>(null);

function TooltipRoot({
  children,
  openOnPress = false,
  openOnFocus = true,
  onOpenChange,
  ...props
}: TooltipRootProps) {
  const openRef = React.useRef(false);
  const hoverDismissCleanupRef = React.useRef<(() => void) | null>(null);
  const suppressHoverRef = React.useRef(false);
  const triggerRef = React.useRef<TooltipTriggerRef>(null);
  const interaction = React.useMemo(
    () => ({ openOnPress, openOnFocus, openRef, hoverDismissCleanupRef, suppressHoverRef, triggerRef }),
    [openOnPress, openOnFocus],
  );
  return (
    <TooltipInteractionContext.Provider value={interaction}>
      <TooltipPrimitive.Root
        {...props}
        onOpenChange={(open) => {
          if (open && !openOnPress && suppressHoverRef.current) {
            // primitive 的 close() 不会取消 Radix 的 hover 计时器；拦截迟到的打开请求。
            // 同步关闭让两次状态更新合并，避免显示一帧以及通知业务层已经打开。
            triggerRef.current?.close();
            return;
          }
          openRef.current = open;
          if (!open) {
            hoverDismissCleanupRef.current?.();
            hoverDismissCleanupRef.current = null;
          }
          onOpenChange?.(open);
        }}
      >
        {children}
      </TooltipPrimitive.Root>
    </TooltipInteractionContext.Provider>
  );
}

const TooltipTrigger = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentProps<typeof TooltipPrimitive.Trigger>
>(function TooltipTrigger(
  { onPointerDown, onPointerLeave, onPointerMove, onPress, onFocus, ...props },
  forwardedRef,
) {
  const interaction = React.useContext(TooltipInteractionContext);
  if (!interaction) throw new Error("Tooltip.Trigger must be rendered inside Tooltip.Root");
  const { openOnPress, openOnFocus, openRef, hoverDismissCleanupRef, suppressHoverRef, triggerRef } = interaction;
  const stopHoverDismiss = React.useCallback(() => {
    hoverDismissCleanupRef.current?.();
    hoverDismissCleanupRef.current = null;
  }, [hoverDismissCleanupRef]);
  const dismissHover = () => {
    suppressHoverRef.current = true;
    triggerRef.current?.close();
    stopHoverDismiss();
  };

  React.useEffect(() => stopHoverDismiss, [stopHoverDismiss]);
  React.useEffect(() => {
    if (openOnPress) {
      stopHoverDismiss();
      suppressHoverRef.current = false;
    }
  }, [openOnPress, suppressHoverRef, stopHoverDismiss]);

  const setTriggerRef = React.useCallback(
    (node: React.ComponentRef<typeof TooltipPrimitive.Trigger> | null) => {
      triggerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef != null) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef, triggerRef],
  );

  const handlePointerDown: NonNullable<
    React.ComponentProps<typeof TooltipPrimitive.Trigger>["onPointerDown"]
  > = (event) => {
    onPointerDown?.(event);
    suppressHoverRef.current = shouldSuppressTooltipHover(openOnPress);
    if (suppressHoverRef.current) {
      triggerRef.current?.close();
    }
  };

  const handlePointerMove: NonNullable<
    React.ComponentProps<typeof TooltipPrimitive.Trigger>["onPointerMove"]
  > = (event) => {
    onPointerMove?.(event);
    if (!openOnPress && event.nativeEvent.buttons > 0) {
      dismissHover();
      event.preventDefault();
      return;
    }
    if (suppressHoverRef.current) {
      event.preventDefault();
      return;
    }
    if (
      !event.defaultPrevented &&
      !openOnPress &&
      event.nativeEvent.pointerType !== "touch" &&
      Platform.OS === "web" &&
      !hoverDismissCleanupRef.current &&
      triggerRef.current
    ) {
      // 原生窗口拖拽可能缺少 leave/up/click；在进入系统拖拽前捕获按下以终止 hover。
      hoverDismissCleanupRef.current = listenForTooltipHoverDismiss(
        triggerRef.current as unknown as HTMLElement,
        dismissHover,
      );
    }
  };

  const handlePointerLeave: NonNullable<
    React.ComponentProps<typeof TooltipPrimitive.Trigger>["onPointerLeave"]
  > = (event) => {
    // hoverable content 可能在离开触发器后继续显示，保留监听直至真正关闭。
    if (!openRef.current) stopHoverDismiss();
    suppressHoverRef.current = false;
    onPointerLeave?.(event);
  };

  const handlePress: NonNullable<
    React.ComponentProps<typeof TooltipPrimitive.Trigger>["onPress"]
  > = (event) => {
    suppressHoverRef.current = shouldSuppressTooltipHover(openOnPress);
    closeTooltipAfterPress(openOnPress, () => triggerRef.current?.close());
    onPress?.(event);
  };

  return (
    <TooltipPrimitive.Trigger
      {...props}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPress={handlePress}
      onFocus={(event) => {
        onFocus?.(event);
        if (!openOnFocus || suppressHoverRef.current) event.preventDefault();
      }}
      ref={setTriggerRef}
    />
  );
});

export { TooltipRoot, TooltipTrigger };
