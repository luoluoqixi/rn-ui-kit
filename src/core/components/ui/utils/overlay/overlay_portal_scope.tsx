import type { ReactNode } from "react";

export function hasOpenOverlayPortal(_root: unknown): boolean {
  return false;
}

// Native 的窗口归属继续由 ScreenOverlayPortalProvider 管理。
export function OverlayPortalScope({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function useOverlayPortalContainer(): HTMLElement | undefined {
  return undefined;
}
