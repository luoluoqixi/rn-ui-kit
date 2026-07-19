import { jsx as _jsx } from "react/jsx-runtime";
import { Portal } from "@tamagui/portal";
import { isWeb } from "./platform";
import { SheetPortal } from "../sheet/sheet/replica_sheet/sheet_portal";
import { useScopedOverlayPortalHostName } from "./screen_overlay_portal";
/**
 * 在 ScreenOverlayPortalProvider 子树内替代 Tamagui Portal / Dialog.Portal 的 root 硬编码。
 * Toast 走 Toaster viewport；Dialog / Menu 等须显式使用本组件。
 */
export function OverlayScopedPortal({ active = true, children, passThrough, stackZIndex, zIndex, ...rest }) {
    const host = useScopedOverlayPortalHostName();
    if (host == null || isWeb()) {
        return (_jsx(Portal, { passThrough: passThrough, stackZIndex: stackZIndex, zIndex: zIndex, ...rest, children: children }));
    }
    return (_jsx(SheetPortal, { active: active, hostName: host, passThrough: passThrough, stackZIndex: stackZIndex, zIndex: zIndex, ...rest, children: children }));
}
