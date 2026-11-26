import { jsx as _jsx } from "react/jsx-runtime";
import { TrueSheetProvider } from "@lodev09/react-native-true-sheet";
import { OverlayPortalScope } from "./overlay_portal_scope";
/** Place beside Dialog, inside Modal.Container: focus stays scoped without Dialog's clipping. */
export function ModalContentScope({ children }) {
    return (_jsx("div", { className: "ui-modal-content-scope", style: { display: "contents" }, children: _jsx(TrueSheetProvider, { children: _jsx(OverlayPortalScope, { children: children }) }) }));
}
