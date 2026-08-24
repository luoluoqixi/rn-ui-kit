import { type ReactNode, createContext, useContext } from "react";
import type { View } from "react-native";

const ScreenOverlayTeleportHostNodeContext = createContext<View | null>(null);

export function useScreenOverlayTeleportHostNode(): View | null {
  return useContext(ScreenOverlayTeleportHostNodeContext);
}

export function ScreenOverlayFloatingProvider({
  children,
  teleportHostNode,
}: {
  children: ReactNode;
  teleportHostNode: View | null;
}) {
  return (
    <ScreenOverlayTeleportHostNodeContext.Provider value={teleportHostNode}>
      {children}
    </ScreenOverlayTeleportHostNodeContext.Provider>
  );
}
