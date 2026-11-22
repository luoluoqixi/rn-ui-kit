import type { ReactNode } from "react";

export type OverlayPortalProps = { children: ReactNode; name: string; hostName?: string };
export type OverlayPortalHostProps = { name?: string };

// Web sheets already own their DOM portal. Keep this entry free of Native imports.
export function OverlayPortal({ children }: OverlayPortalProps) {
  return <>{children}</>;
}

export function OverlayPortalHost(_props: OverlayPortalHostProps) {
  return null;
}
