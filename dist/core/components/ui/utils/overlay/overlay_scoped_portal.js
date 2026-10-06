import { jsx as _jsx } from "react/jsx-runtime";
import { Portal } from "@rn-primitives/portal";
import { useId } from "react";
import { useScopedOverlayPortalHostName } from "./screen_overlay_portal";
export function OverlayScopedPortal({ active = true, children, hostName, name, }) {
    const generatedName = useId();
    const scopedHostName = useScopedOverlayPortalHostName();
    if (!active) {
        return null;
    }
    return (_jsx(Portal, { hostName: hostName ?? scopedHostName, name: name ?? generatedName, children: children }));
}
