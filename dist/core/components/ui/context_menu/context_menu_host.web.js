import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { resolveRenderProp } from "../utils/render";
import { elementMenuRect, useHostMenu } from "../menu/use_host_menu.web";
export function ContextMenuHost(p) {
    // 仅将 View 属性交给包装层，不把菜单配置泄漏到 DOM。
    const { items, itemProps, trigger, triggerProps, children, onOpenChange, onOpenWillChange, open, defaultOpen, disabled, native, nativeHaptics, nativeHapticsDelay, itemNativeHaptics, itemNativeHapticsDelay, contentProps, anchor, herouiNativeProps, herouiWebProps, menuAdapter, menuAdapterOptions, __menuRef, __unsafeIosProps, nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem, ...viewProps } = p;
    const ref = useRef(null);
    const unavailable = !!(disabled || triggerProps?.disabled);
    const element = () => ref.current;
    const model = useHostMenu(p, "context-menu", unavailable, () => elementMenuRect(element()), () => element()?.ownerDocument ?? document);
    useEffect(() => {
        if (!__menuRef)
            return;
        __menuRef.current = { presentMenu: () => model.present() };
        return () => { __menuRef.current = null; };
    }, [__menuRef, model.present]);
    const { asChild, disabled: triggerDisabled, style, ...restTriggerProps } = triggerProps ?? {};
    return _jsxs(View, { ...viewProps, ...restTriggerProps, ref: ref, style: [viewProps.style, typeof style === "function" ? style({ pressed: false, hovered: false }) : style], onContextMenu: (event) => {
            triggerProps?.onContextMenu?.(event);
            if (event.defaultPrevented || unavailable)
                return;
            event.preventDefault();
            event.stopPropagation();
            model.present({ rect: elementMenuRect(event.currentTarget), point: { x: event.clientX, y: event.clientY } }, "pointer");
        },
        onKeyDown: (event) => {
            triggerProps?.onKeyDown?.(event);
            if (event.defaultPrevented || unavailable ||
                (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10")))
                return;
            event.preventDefault();
            event.stopPropagation();
            model.present({ rect: elementMenuRect(event.target) }, "keyboard");
        }, children: [resolveRenderProp(trigger, { native: true, open: model.open }), children] });
}
