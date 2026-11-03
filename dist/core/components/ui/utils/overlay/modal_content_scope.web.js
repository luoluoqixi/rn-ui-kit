import { jsx as _jsx } from "react/jsx-runtime";
import { TrueSheetProvider } from "@lodev09/react-native-true-sheet";
import { OverlayPortalScope } from "./overlay_portal_scope";
/** 子菜单与 Sheet 保留在当前 modal 的 DOM 和焦点范围中。 */
export function ModalContentScope({ children }) {
    return (_jsx("div", { className: "ui-modal-content-scope", style: { display: "contents" }, children: _jsx(TrueSheetProvider, { children: _jsx(OverlayPortalScope, { children: children }) }) }));
}
