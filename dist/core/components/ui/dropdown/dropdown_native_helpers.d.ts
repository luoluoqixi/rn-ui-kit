import type { NativeDropdownItemData } from "./types";
type NativeResolvedAndroidMenuItem = {
    item: NativeDropdownItemData;
    separatorBefore: boolean;
};
/** Split data-driven items into native menu groups without empty sections. */
export declare function splitMenuItemsBySeparators(items: NativeDropdownItemData[]): NativeDropdownItemData[][];
/** Keep iOS menu groups and items in the same order as the data source. */
export declare function resolveIosMenuItemGroups(items: NativeDropdownItemData[]): NativeDropdownItemData[][];
/** Fold Android separators into the next valid item because PopupMenu has no separator action. */
export declare function resolveAndroidMenuItems(items: NativeDropdownItemData[]): NativeResolvedAndroidMenuItem[];
export {};
