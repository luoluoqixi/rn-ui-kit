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
