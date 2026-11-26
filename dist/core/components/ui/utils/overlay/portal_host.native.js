import { jsx as _jsx } from "react/jsx-runtime";
import { Portal, PortalHost } from "heroui-native/portal";
// HeroUINativeProvider owns the default host. Our sheets use a separate named
// host so neither their contents nor HeroUI's default portals render twice.
const rootHostName = "rn-ui-kit:scoped-overlay-root";
export function OverlayPortal({ hostName = rootHostName, ...props }) {
    return _jsx(Portal, { ...props, hostName: hostName });
}
export function OverlayPortalHost({ name = rootHostName }) {
    return _jsx(PortalHost, { name: name });
}
