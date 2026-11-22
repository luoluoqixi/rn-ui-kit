import { Portal, PortalHost } from "heroui-native/portal";
import type { OverlayPortalHostProps, OverlayPortalProps } from "./portal_host";

// HeroUINativeProvider owns the default host. Our sheets use a separate named
// host so neither their contents nor HeroUI's default portals render twice.
const rootHostName = "rn-ui-kit:scoped-overlay-root";

export function OverlayPortal({ hostName = rootHostName, ...props }: OverlayPortalProps) {
  return <Portal {...props} hostName={hostName} />;
}

export function OverlayPortalHost({ name = rootHostName }: OverlayPortalHostProps) {
  return <PortalHost name={name} />;
}
