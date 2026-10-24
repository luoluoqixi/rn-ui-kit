import { createContext, useContext, useState, type ReactNode } from "react";

export const OverlayPortalContainerContext = createContext<HTMLElement | undefined>(undefined);

export function OverlayPortalScope({ children }: { children?: ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <OverlayPortalContainerContext.Provider value={container ?? undefined}>
      <div data-ui-overlay-scope="" ref={setContainer} style={{ display: "contents" }}>
        {children}
      </div>
    </OverlayPortalContainerContext.Provider>
  );
}

export function useOverlayPortalContainer(): HTMLElement | undefined {
  return useContext(OverlayPortalContainerContext);
}
