import { useToastPortalScope } from "../../toast/toast_portal.web";
import { createContext, useContext, useState, type ReactNode } from "react";

export const OverlayPortalContainerContext = createContext<HTMLElement | undefined>(undefined);

export function hasOpenOverlayPortal(root: ParentNode): boolean {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-ui-overlay-scope]")).some((scope) =>
    Array.from(scope.children).some(
      (child) => !(child instanceof HTMLElement) || !child.hasAttribute("data-ui-toast-portal"),
    ),
  );
}

export function OverlayPortalScope({ children }: { children?: ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  useToastPortalScope(container);
  return (
    <OverlayPortalContainerContext.Provider value={container ?? undefined}>
      {children}
      <div
        data-ui-overlay-scope=""
        ref={setContainer}
        style={{ height: 0, left: 0, position: "absolute", top: 0, width: 0 }}
      />
    </OverlayPortalContainerContext.Provider>
  );
}

export function useOverlayPortalContainer(): HTMLElement | undefined {
  return useContext(OverlayPortalContainerContext);
}
