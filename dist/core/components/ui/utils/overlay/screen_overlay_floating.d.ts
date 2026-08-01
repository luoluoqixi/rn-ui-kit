import { type UseFloatingFn } from "@tamagui/floating";
import { type ReactNode } from "react";
import { type View } from "react-native";
type MeasureCallback = (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void;
/**
 * 与 @floating-ui/react-native `createPlatform` 对 reference 的 Android 修正保持一致。
 * offsetParent 也必须同步，否则 reference.y 含 StatusBar 而 offset 不含 → 锚点浮层整体偏下。
 */
export declare function adjustFloatingUiAndroidMeasureInWindowY(y: number): number;
/** 供 @floating-ui/react-native 使用的 offsetParent：用 measureInWindow 与 reference 对齐坐标系 */
export declare function createFloatingMeasureOffsetParent(hostView: View | null): {
    measure(callback: MeasureCallback): void;
} | undefined;
export declare function useScreenOverlayTeleportHostNode(): View | null;
/**
 * True Sheet / pageSheet 等 scoped overlay 内 Popover、Menu 的锚点定位：
 * teleport 后浮层坐标需相对 PortalHost，而非整窗 measureInWindow。
 *
 * 注入 FloatingOverrideContext 的 hook；必须调用 useFloatingRaw，勿用包内 useFloating（会再读 context 导致栈溢出）。
 */
export declare const useScreenOverlayFloating: UseFloatingFn;
export declare function ScreenOverlayFloatingProvider({ children, teleportHostNode, }: {
    children: ReactNode;
    teleportHostNode: View | null;
}): import("react").JSX.Element;
export {};
