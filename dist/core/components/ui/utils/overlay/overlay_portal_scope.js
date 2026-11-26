import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
// Native 的窗口归属继续由 ScreenOverlayPortalProvider 管理。
export function OverlayPortalScope({ children }) {
    return _jsx(_Fragment, { children: children });
}
export function useOverlayPortalContainer() {
    return undefined;
}
