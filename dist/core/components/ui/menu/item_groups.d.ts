import type { MenuItemData } from "./types";
/**
 * 按 separator 条目切分菜单项；空分组会被忽略，避免首尾或连续 separator
 * 在原生菜单中产生无内容的 section。
 */
export declare function splitMenuItemsBySeparators(items: MenuItemData[]): MenuItemData[][];
/**
 * 生成交给 Tamagui iOS DropdownMenu 的分组顺序。
 * Tamagui 会再次反转 Content / SubContent 的直接 children，因此这里只反转分组顺序，
 * 不能反转分组内部条目。
 */
export declare function resolveIosMenuItemGroups(items: MenuItemData[]): MenuItemData[][];
export interface ResolvedAndroidMenuItem {
    item: MenuItemData;
    separatorBefore: boolean;
}
/**
 * Android PopupMenu 没有独立 separator action；将分割线折叠为下一有效条目的标记。
 * 首尾及连续 separator 不产生空行。
 */
export declare function resolveAndroidMenuItems(items: MenuItemData[]): ResolvedAndroidMenuItem[];
