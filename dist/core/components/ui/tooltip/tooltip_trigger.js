import { jsx as _jsx } from "react/jsx-runtime";
import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import { closeTooltipAfterPress, shouldSuppressTooltipHover } from "./tooltip_press_behavior";
const TooltipInteractionContext = React.createContext(null);
function TooltipRoot({ children, openOnPress = false, openOnFocus = true, onOpenChange, ...props }) {
    const suppressHoverRef = React.useRef(false);
    const triggerRef = React.useRef(null);
    const interaction = React.useMemo(() => ({ openOnPress, openOnFocus, suppressHoverRef, triggerRef }), [openOnPress, openOnFocus]);
    return (_jsx(TooltipInteractionContext.Provider, { value: interaction, children: _jsx(TooltipPrimitive.Root, { ...props, onOpenChange: (open) => {
                if (open && !openOnPress && suppressHoverRef.current) {
                    // primitive 的 close() 不会取消 Radix 的 hover 计时器；拦截迟到的打开请求。
                    // 同步关闭让两次状态更新合并，避免显示一帧以及通知业务层已经打开。
                    triggerRef.current?.close();
                    return;
                }
                onOpenChange?.(open);
            }, children: children }) }));
}
const TooltipTrigger = React.forwardRef(function TooltipTrigger({ onPointerDown, onPointerLeave, onPointerMove, onPress, onFocus, ...props }, forwardedRef) {
    const interaction = React.useContext(TooltipInteractionContext);
    if (!interaction)
        throw new Error("Tooltip.Trigger must be rendered inside Tooltip.Root");
    const { openOnPress, openOnFocus, suppressHoverRef, triggerRef } = interaction;
    React.useEffect(() => {
        if (openOnPress) {
            suppressHoverRef.current = false;
        }
    }, [openOnPress, suppressHoverRef]);
    const setTriggerRef = React.useCallback((node) => {
        triggerRef.current = node;
        if (typeof forwardedRef === "function") {
            forwardedRef(node);
        }
        else if (forwardedRef != null) {
            forwardedRef.current = node;
        }
    }, [forwardedRef, triggerRef]);
    const handlePointerDown = (event) => {
        onPointerDown?.(event);
        suppressHoverRef.current = shouldSuppressTooltipHover(openOnPress);
        if (suppressHoverRef.current) {
            triggerRef.current?.close();
        }
    };
    const handlePointerMove = (event) => {
        onPointerMove?.(event);
        if (suppressHoverRef.current) {
            event.preventDefault();
        }
    };
    const handlePointerLeave = (event) => {
        suppressHoverRef.current = false;
        onPointerLeave?.(event);
    };
    const handlePress = (event) => {
        suppressHoverRef.current = shouldSuppressTooltipHover(openOnPress);
        closeTooltipAfterPress(openOnPress, () => triggerRef.current?.close());
        onPress?.(event);
    };
    return (_jsx(TooltipPrimitive.Trigger, { ...props, onPointerDown: handlePointerDown, onPointerLeave: handlePointerLeave, onPointerMove: handlePointerMove, onPress: handlePress, onFocus: (event) => {
            onFocus?.(event);
            if (!openOnFocus || suppressHoverRef.current)
                event.preventDefault();
        }, ref: setTriggerRef }));
});
export { TooltipRoot, TooltipTrigger };
