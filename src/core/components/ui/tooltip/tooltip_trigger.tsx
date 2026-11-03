import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import type { TooltipRootProps } from "./types";
import { closeTooltipAfterPress, shouldSuppressTooltipHover } from "./tooltip_press_behavior";

type TooltipTriggerRef = React.ComponentRef<typeof TooltipPrimitive.Trigger>;
const TooltipInteractionContext = React.createContext<{
  openOnPress: boolean;
  openOnFocus: boolean;
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
  const suppressHoverRef = React.useRef(false);
  const triggerRef = React.useRef<TooltipTriggerRef>(null);
  const interaction = React.useMemo(
    () => ({ openOnPress, openOnFocus, suppressHoverRef, triggerRef }),
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
  const { openOnPress, openOnFocus, suppressHoverRef, triggerRef } = interaction;

  React.useEffect(() => {
    if (openOnPress) {
      suppressHoverRef.current = false;
    }
  }, [openOnPress, suppressHoverRef]);

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
    if (suppressHoverRef.current) {
      event.preventDefault();
    }
  };

  const handlePointerLeave: NonNullable<
    React.ComponentProps<typeof TooltipPrimitive.Trigger>["onPointerLeave"]
  > = (event) => {
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
