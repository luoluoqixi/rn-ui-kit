import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useToastPortalScope } from "../../toast/toast_portal.web";
import { createContext, useContext, useState } from "react";
export const OverlayPortalContainerContext = createContext(undefined);
export function OverlayPortalScope({ children }) {
    const [container, setContainer] = useState(null);
    useToastPortalScope(container);
    return (_jsxs(OverlayPortalContainerContext.Provider, { value: container ?? undefined, children: [children, _jsx("div", { "data-ui-overlay-scope": "", ref: setContainer, style: { height: 0, left: 0, position: "absolute", top: 0, width: 0 } })] }));
}
export function useOverlayPortalContainer() {
    return useContext(OverlayPortalContainerContext);
}
