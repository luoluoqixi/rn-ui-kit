import { jsx as _jsx } from "react/jsx-runtime";
import { useToastPortalScope } from "../../../toast/toast_portal.web";
import { useLayoutEffect, useRef, useState } from "react";
import { OverlayPortalContainerContext } from "../../../utils/overlay/overlay_portal_scope.web";
/** 弹出层放在 Drawer 裁切容器之外，同时保留当前 modal 的 DOM 归属。 */
export function SheetContentScope({ children, dismissOnOverlayPress = true, onRequestClose, }) {
    const marker = useRef(null);
    const [container, setContainer] = useState();
    const dismissOnOverlayPressRef = useRef(dismissOnOverlayPress);
    const onRequestCloseRef = useRef(onRequestClose);
    dismissOnOverlayPressRef.current = dismissOnOverlayPress;
    onRequestCloseRef.current = onRequestClose;
    useToastPortalScope(container);
    useLayoutEffect(() => {
        const wrapper = marker.current?.closest("[data-vaul-detached-wrapper]");
        const parent = wrapper?.parentElement;
        if (!parent)
            return;
        const overlay = Array.from(parent.children).find((child) => child instanceof HTMLElement && child.hasAttribute("data-vaul-overlay"));
        // A nested Radix menu can leave the Drawer's outside-pointer bookkeeping
        // set until the following click. The overlay itself remains authoritative,
        // so close this Sheet directly instead of relying on that stale state.
        const handleOverlayPointerDown = () => {
            if (dismissOnOverlayPressRef.current)
                onRequestCloseRef.current?.();
        };
        overlay?.addEventListener("pointerdown", handleOverlayPointerDown);
        const host = document.createElement("div");
        host.dataset.uiSheetOverlayScope = "";
        // Dialog 的 TrueSheetProvider anchor 是零宽节点，absolute 会继承它的
        // 偏移和宽度，React Aria 随后把菜单错误地向右钳制。fixed 让宿主始终
        // 使用 viewport 原点与宽度，同时保留当前 modal 的 DOM / 焦点归属。
        // 零高度不形成整屏点击层；该层仅高于同级 Drawer，不越过外层 modal。
        Object.assign(host.style, { position: "fixed", top: "0", left: "0", width: "100%", height: "0", zIndex: "1", pointerEvents: "auto" });
        parent.appendChild(host);
        setContainer(host);
        return () => {
            overlay?.removeEventListener("pointerdown", handleOverlayPointerDown);
            host.remove();
        };
    }, []);
    return (_jsx(OverlayPortalContainerContext.Provider, { value: container, children: _jsx("div", { ref: marker, style: { display: "contents" }, children: children }) }));
}
