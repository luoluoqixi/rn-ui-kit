import { jsx as _jsx } from "react/jsx-runtime";
import { View } from "react-native";
const iconSlotClasses = {
    default: "min-w-5 min-h-5",
    "2xs": "min-w-3 min-h-3",
    xs: "min-w-3.5 min-h-3.5",
    sm: "min-w-4 min-h-4",
    md: "min-w-5 min-h-5",
    lg: "min-w-6 min-h-6",
    xl: "min-w-7 min-h-7",
    "2xl": "min-w-8 min-h-8",
};
/** Radio groups share a menu level; submenus have their own icon column. */
export function hasMenuItemIcons(items) {
    return items.some((item) => {
        if (item.separator || item.type === "separator" || item.type === "label")
            return false;
        if (item.type === "radio-group")
            return hasMenuItemIcons(item.items ?? []);
        return item.icon != null && item.icon !== false;
    });
}
export function shouldRenderMenuItemIcon(hasIcons, icon, reserveIconSpace = true) {
    return hasIcons && (reserveIconSpace || (icon != null && icon !== false));
}
export function MenuItemIcon({ children, size }) {
    return (_jsx(View, { className: `shrink-0 items-center justify-center ${iconSlotClasses[size]}`, children: children }));
}
