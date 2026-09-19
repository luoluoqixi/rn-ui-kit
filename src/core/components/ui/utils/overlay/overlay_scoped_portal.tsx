import { Portal } from "@rn-primitives/portal";
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
    <Portal hostName={hostName ?? scopedHostName} name={name ?? generatedName}>
      {children}
    </Portal>
  );
}
