import type { ContextMenuArrowProps, ContextMenuAuxiliaryProps, ContextMenuCheckboxItemProps, ContextMenuContentProps, ContextMenuItemComponentProps, ContextMenuItemIconProps, ContextMenuItemImageProps, ContextMenuItemSubtitleProps, ContextMenuItemTitleProps, ContextMenuLabelProps, ContextMenuPreviewProps, ContextMenuProps, ContextMenuRadioItemProps, ContextMenuSeparatorProps, ContextMenuShortcutProps, ContextMenuSubContentProps, ContextMenuSubTriggerProps } from "./types";
import * as ContextMenuPrimitive from "@rn-primitives/context-menu";
import * as React from "react";
import { View } from "react-native";
declare function ContextMenuSubTrigger({ className, inset, children, iconClassName, nativeHaptics, onPress, ...props }: ContextMenuSubTriggerProps): React.JSX.Element;
declare function ContextMenuSubContent({ className, ...props }: ContextMenuSubContentProps): React.JSX.Element;
declare function ContextMenuContent({ className, overlayClassName, overlayStyle, portalHost, style, itemNativeHaptics, side: sideProp, children, ...props }: ContextMenuContentProps): React.JSX.Element;
declare function ContextMenuItem({ className, disabled, inset, nativeHaptics, onPress, variant, ...props }: ContextMenuItemComponentProps): React.JSX.Element;
declare function ContextMenuCheckboxItem({ className, children, disabled, nativeHaptics, onCheckedChange, ...props }: ContextMenuCheckboxItemProps): React.JSX.Element;
declare function ContextMenuRadioItem({ className, children, disabled, nativeHaptics, onPress, ...props }: ContextMenuRadioItemProps): React.JSX.Element;
declare function ContextMenuLabel({ className, inset, ...props }: ContextMenuLabelProps): React.JSX.Element;
declare function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps): React.JSX.Element;
declare function ContextMenuShortcut({ className, ...props }: ContextMenuShortcutProps): React.JSX.Element;
declare function ContextMenuItemTitle({ className, ...props }: ContextMenuItemTitleProps): React.JSX.Element;
declare function ContextMenuItemSubtitle({ className, ...props }: ContextMenuItemSubtitleProps): React.JSX.Element;
declare function ContextMenuItemIcon({ children }: ContextMenuItemIconProps): React.JSX.Element;
declare function ContextMenuItemImage({ children }: ContextMenuItemImageProps): React.JSX.Element;
declare function ContextMenuArrow({ children }: ContextMenuArrowProps): React.JSX.Element;
declare function ContextMenuPreview({ children }: ContextMenuPreviewProps): React.JSX.Element;
declare function ContextMenuAuxiliary({ children }: ContextMenuAuxiliaryProps): React.JSX.Element;
declare function ContextMenu({ children, items, itemProps, itemNativeHaptics, native, nativeHaptics, nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem, __menuRef, __unsafeIosProps, onOpenChange, onOpenWillChange, trigger, triggerProps, ...props }: ContextMenuProps): React.JSX.Element;
declare const ContextMenuComponent: typeof ContextMenu & {
    Arrow: typeof ContextMenuArrow;
    Auxiliary: typeof ContextMenuAuxiliary;
    CheckboxItem: typeof ContextMenuCheckboxItem;
    Content: typeof ContextMenuContent;
    Group: {
        ({ asChild, ref, ...props }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
    Item: typeof ContextMenuItem;
    ItemIcon: typeof ContextMenuItemIcon;
    ItemImage: typeof ContextMenuItemImage;
    ItemIndicator: {
        ({ asChild, forceMount, ref, ...props }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & import("@rn-primitives/types").ForceMountable & React.RefAttributes<View>): React.JSX.Element | null;
        displayName: string;
    };
    ItemSubtitle: typeof ContextMenuItemSubtitle;
    ItemTitle: typeof ContextMenuItemTitle;
    Label: typeof ContextMenuLabel;
    Portal: typeof ContextMenuPrimitive.Portal;
    Preview: typeof ContextMenuPreview;
    RadioGroup: {
        ({ asChild, value, onValueChange, ref, ...props }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & {
            value: string | undefined;
            onValueChange: (value: string) => void;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
    RadioItem: typeof ContextMenuRadioItem;
    Root: typeof ContextMenu;
    Separator: typeof ContextMenuSeparator;
    Shortcut: typeof ContextMenuShortcut;
    Sub: {
        ({ asChild, defaultOpen, open: openProp, onOpenChange: onOpenChangeProp, ref, ...props }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & {
            defaultOpen?: boolean;
            open?: boolean;
            onOpenChange?: (value: boolean) => void;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
    SubContent: typeof ContextMenuSubContent;
    SubTrigger: typeof ContextMenuSubTrigger;
    Trigger: {
        ({ asChild, onLongPress: onLongPressProp, disabled, onAccessibilityAction: onAccessibilityActionProp, ref, ...props }: Omit<import("react-native").PressableProps & React.RefAttributes<View>, "ref"> & {
            asChild?: boolean;
        } & {
            onKeyDown?: (ev: React.KeyboardEvent) => void;
            onKeyUp?: (ev: React.KeyboardEvent) => void;
        } & React.RefAttributes<import("@rn-primitives/context-menu").TriggerRef>): React.JSX.Element;
        displayName: string;
    };
};
export { ContextMenuComponent as ContextMenu };
