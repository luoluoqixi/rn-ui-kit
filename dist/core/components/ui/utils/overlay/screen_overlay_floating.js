import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const ScreenOverlayTeleportHostNodeContext = createContext(null);
export function useScreenOverlayTeleportHostNode() {
    return useContext(ScreenOverlayTeleportHostNodeContext);
}
export function ScreenOverlayFloatingProvider({ children, teleportHostNode, }) {
    return (_jsx(ScreenOverlayTeleportHostNodeContext.Provider, { value: teleportHostNode, children: children }));
}
