import { OverlayPortal } from "./portal_host";
import { type ReactNode, useId } from "react";

import { useScopedOverlayPortalHostName } from "./screen_overlay_portal";

export type OverlayScopedPortalProps = {
  active?: boolean;
  children?: ReactNode;
  hostName?: string;
  name?: string;
};

export function OverlayScopedPortal({
  active = true,
  children,
  hostName,
  name,
}: OverlayScopedPortalProps) {
  const generatedName = useId();
  const scopedHostName = useScopedOverlayPortalHostName();

  if (!active) {
    return null;
  }

  return (
    <OverlayPortal hostName={hostName ?? scopedHostName} name={name ?? generatedName}>
      {children}
    </OverlayPortal>
  );
}
