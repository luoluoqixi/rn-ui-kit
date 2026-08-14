import type { MenuItemData } from "./types";

/**
 * 按 separator 条目切分菜单项；空分组会被忽略，避免首尾或连续 separator
 * 在原生菜单中产生无内容的 section。
 */
export function splitMenuItemsBySeparators(items: MenuItemData[]): MenuItemData[][] {
  const groups: MenuItemData[][] = [];
  let currentGroup: MenuItemData[] = [];

  for (const item of items) {
    if (item.separator) {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
      }
      continue;
    }

    currentGroup.push(item);
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

/**
 * 生成交给 Tamagui iOS DropdownMenu 的分组顺序。
 * Tamagui 会再次反转 Content / SubContent 的直接 children，因此这里只反转分组顺序，
 * 不能反转分组内部条目。
 */
export function resolveIosMenuItemGroups(items: MenuItemData[]): MenuItemData[][] {
  return splitMenuItemsBySeparators(items).reverse();
}

export interface ResolvedAndroidMenuItem {
  item: MenuItemData;
  separatorBefore: boolean;
}

/**
 * Android PopupMenu 没有独立 separator action；将分割线折叠为下一有效条目的标记。
 * 首尾及连续 separator 不产生空行。
 */
export function resolveAndroidMenuItems(items: MenuItemData[]): ResolvedAndroidMenuItem[] {
  const resolvedItems: ResolvedAndroidMenuItem[] = [];
  let separatorBefore = false;

  for (const item of items) {
    if (item.separator) {
      if (resolvedItems.length > 0) {
        separatorBefore = true;
      }
      continue;
    }

    resolvedItems.push({ item, separatorBefore });
    separatorBefore = false;
  }

  return resolvedItems;
}
