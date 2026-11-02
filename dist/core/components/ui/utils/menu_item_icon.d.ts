import type { ReactNode } from "react";
import type { MenuSize } from "./menu_size";
type MenuIconItem = {
    icon?: unknown;
    separator?: boolean;
    type?: string;
    items?: MenuIconItem[];
};
/** Radio groups share a menu level; submenus have their own icon column. */
export declare function hasMenuItemIcons(items: readonly MenuIconItem[]): boolean;
export declare function shouldRenderMenuItemIcon(hasIcons: boolean, icon: ReactNode, reserveIconSpace?: boolean): boolean;
export declare function MenuItemIcon({ children, size }: {
    children?: ReactNode;
    size: MenuSize;
}): import("react").JSX.Element;
export {};
