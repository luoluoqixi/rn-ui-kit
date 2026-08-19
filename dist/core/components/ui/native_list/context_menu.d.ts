import { type ReactNode } from "react";
import type { NativeListContextMenuProps } from "./types";
export declare function NativeListContextMenuProvider({ children, contextMenuProps, disabledStyle, }: {
    children: ReactNode;
    contextMenuProps?: NativeListContextMenuProps;
    disabledStyle?: boolean;
}): import("react").JSX.Element;
export declare function useResolvedNativeListDisabledStyle(disabledStyle?: boolean): boolean;
export declare function resolveNativeListDisabledStyle(disabledStyle?: boolean, inherited?: boolean): boolean;
export declare function resolveNativeListContextMenu(contextMenuProps?: NativeListContextMenuProps | false, inheritedContextMenuProps?: NativeListContextMenuProps, disabled?: boolean): NativeListContextMenuProps | undefined;
export declare function useResolvedNativeListContextMenu(contextMenuProps?: NativeListContextMenuProps | false, disabled?: boolean): NativeListContextMenuProps | undefined;
