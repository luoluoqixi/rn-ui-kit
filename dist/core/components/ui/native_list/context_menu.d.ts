import { type ReactNode } from "react";
import type { NativeListContextMenuProps } from "./types";
export declare function NativeListContextMenuProvider({ children, contextMenuProps, }: {
    children: ReactNode;
    contextMenuProps?: NativeListContextMenuProps;
}): import("react").JSX.Element;
export declare function resolveNativeListContextMenu(contextMenuProps?: NativeListContextMenuProps | false, inheritedContextMenuProps?: NativeListContextMenuProps): NativeListContextMenuProps | undefined;
export declare function useResolvedNativeListContextMenu(contextMenuProps?: NativeListContextMenuProps | false): NativeListContextMenuProps | undefined;
