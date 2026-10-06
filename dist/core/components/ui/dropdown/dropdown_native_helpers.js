/** Split data-driven items into native menu groups without empty sections. */
export function splitMenuItemsBySeparators(items) {
    const groups = [];
    let currentGroup = [];
    for (const item of items) {
        if (item.separator) {
            if (currentGroup.length > 0)
                groups.push(currentGroup);
            currentGroup = [];
        }
        else {
            currentGroup.push(item);
        }
    }
    if (currentGroup.length > 0)
        groups.push(currentGroup);
    return groups;
}
/** Keep iOS menu groups and items in the same order as the data source. */
export function resolveIosMenuItemGroups(items) {
    return splitMenuItemsBySeparators(items);
}
/** Fold Android separators into the next valid item because PopupMenu has no separator action. */
export function resolveAndroidMenuItems(items) {
    const resolvedItems = [];
    let separatorBefore = false;
    for (const item of items) {
        if (item.separator) {
            if (resolvedItems.length > 0)
                separatorBefore = true;
            continue;
        }
        resolvedItems.push({ item, separatorBefore });
        separatorBefore = false;
    }
    return resolvedItems;
}
