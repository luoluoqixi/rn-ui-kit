import { type ReactNode } from "react";
import type { View } from "react-native";
export declare function useScreenOverlayTeleportHostNode(): View | null;
export declare function ScreenOverlayFloatingProvider({ children, teleportHostNode, }: {
    children: ReactNode;
    teleportHostNode: View | null;
}): import("react").JSX.Element;
