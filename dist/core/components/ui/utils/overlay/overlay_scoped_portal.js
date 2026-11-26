import { jsx as _jsx } from "react/jsx-runtime";
import { OverlayPortal } from "./portal_host";
import { useId } from "react";
import { useScopedOverlayPortalHostName } from "./screen_overlay_portal";
export function OverlayScopedPortal({ active = true, children, hostName, name, }) {
    const generatedName = useId();
    const scopedHostName = useScopedOverlayPortalHostName();
    if (!active) {
        return null;
    }
    return (_jsx(OverlayPortal, { hostName: hostName ?? scopedHostName, name: name ?? generatedName, children: children }));
}
