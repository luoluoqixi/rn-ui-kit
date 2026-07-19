import type { PortalProps } from "@tamagui/portal";
import { type ReactNode } from "react";
export type SheetPortalProps = PortalProps & {
    active?: boolean;
    children?: ReactNode;
    /** 默认 `root`；pageSheet 内应传入 `ScreenOverlayPortalProvider` 的 hostName。 */
    hostName?: string;
    /** Android Modal onRequestClose 回调，用于处理硬件返回键 */
    onRequestClose?: () => void;
};
/**
 * Tamagui `Portal` 在 native 上写死 `hostName="root"`。
 * 非 root overlay host（iOS pageSheet、Android True Sheet 等）走透明 Modal，
 * 避免 teleport 落点高度为 0 或手势被外层 sheet 吞掉。
 */
export declare function SheetPortal(props: SheetPortalProps): import("react").JSX.Element | null;
