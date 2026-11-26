import { type ReactNode } from "react";
/** 弹出层放在 Drawer 裁切容器之外，同时保留当前 modal 的 DOM 归属。 */
export declare function SheetContentScope({ children, dismissOnOverlayPress, onRequestClose, }: {
    children?: ReactNode;
    dismissOnOverlayPress?: boolean;
    onRequestClose?: () => void;
}): import("react").JSX.Element;
