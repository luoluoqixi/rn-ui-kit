import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
import { YGroup } from "tamagui";
import { ListItem } from "../list_item";
import { Separator } from "../separator";
function ListGroupItemSlot(props) {
    return _jsx(YGroup.Item, { ...props });
}
function getItemKey(item, index) {
    if (item.key) {
        return item.key;
    }
    if (typeof item.title === "string") {
        return item.title;
    }
    return `list-group-item-${index}`;
}
function getItemsContent(items, itemProps, groupItemProps, nativeHaptics, separator, separatorProps) {
    return items?.map((item, index) => {
        const shouldShowSeparator = index > 0 && (item.showSeparator ?? separator);
        return (_jsxs(Fragment, { children: [shouldShowSeparator ? _jsx(Separator, { ...separatorProps }) : null, _jsx(ListGroupItemSlot, { ...groupItemProps, ...item.groupItemProps, children: _jsx(ListItem, { ...itemProps, ...item, nativeHaptics: item.nativeHaptics ?? itemProps?.nativeHaptics ?? nativeHaptics }) })] }, getItemKey(item, index)));
    });
}
function ListGroupRoot(props) {
    const { children, groupItemProps, itemProps, items, nativeHaptics, separator, separatorProps, ...groupProps } = props;
    return (_jsx(YGroup, { ...groupProps, borderColor: groupProps.borderColor ?? "$borderColor", borderWidth: groupProps.borderWidth ?? 1, overflow: groupProps.overflow ?? "hidden", children: children ??
            getItemsContent(items, itemProps, groupItemProps, nativeHaptics, separator, separatorProps) }));
}
export const ListGroup = Object.assign(ListGroupRoot, {
    Group: YGroup,
    GroupItem: ListGroupItemSlot,
    Item: ListItem,
    Separator,
});
