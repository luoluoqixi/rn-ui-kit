import type { DropdownContentProps, DropdownProps, DropdownSubContentProps } from "./types";
import { type NativeHapticsSetting } from "../utils";
import { Text } from "../text";
import * as DropdownPrimitive from "@rn-primitives/dropdown-menu";
import * as React from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
declare function DropdownPortal({ hostName, ...props }: React.ComponentProps<typeof DropdownPrimitive.Portal>): React.JSX.Element;
declare function DropdownSubTrigger({ className, inset, children, iconClassName, nativeHaptics, onPress, ...props }: React.ComponentProps<typeof DropdownPrimitive.SubTrigger> & {
    children?: React.ReactNode;
    iconClassName?: string;
    inset?: boolean;
    nativeHaptics?: NativeHapticsSetting;
}): React.JSX.Element;
declare function DropdownSubContent({ className, children, size: sizeProp, style, ...props }: DropdownSubContentProps): React.JSX.Element;
declare function DropdownContent({ align, className, children, side: sideProp, itemNativeHaptics, overlayClassName, overlayStyle, portalHost, size: sizeProp, style, ...props }: DropdownContentProps & {
    /** Internal value used to preserve item haptics across the primitive portal host. */
    itemNativeHaptics?: NativeHapticsSetting;
    overlayStyle?: StyleProp<ViewStyle>;
    overlayClassName?: string;
    portalHost?: string;
}): React.JSX.Element;
declare function DropdownItem({ className, disabled, inset, nativeHaptics, onPress, variant, ...props }: React.ComponentProps<typeof DropdownPrimitive.Item> & {
    className?: string;
    inset?: boolean;
    nativeHaptics?: NativeHapticsSetting;
    variant?: "default" | "destructive";
}): React.JSX.Element;
declare function DropdownCheckboxItem({ className, children, disabled, nativeHaptics, onCheckedChange, ...props }: React.ComponentProps<typeof DropdownPrimitive.CheckboxItem> & {
    children?: React.ReactNode;
    nativeHaptics?: NativeHapticsSetting;
}): React.JSX.Element;
declare function DropdownRadioItem({ className, children, disabled, nativeHaptics, onPress, ...props }: React.ComponentProps<typeof DropdownPrimitive.RadioItem> & {
    children?: React.ReactNode;
    nativeHaptics?: NativeHapticsSetting;
}): React.JSX.Element;
declare function DropdownLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownPrimitive.Label> & {
    className?: string;
    inset?: boolean;
}): React.JSX.Element;
declare function DropdownSeparator({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Separator>): React.JSX.Element;
declare function DropdownShortcut({ className, ...props }: React.ComponentProps<typeof Text>): React.JSX.Element;
declare function Dropdown({ children, contentProps, contentSize, __nativeDetachedAnchor, __menuRef, defaultOpen, disabled, items, itemProps, itemNativeHaptics, native, nativeAnchorAlignment, nativeHaptics, nativeSelectedItemBackgroundColor, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabelProps, nativeTriggerProps, nativeTriggerFeedbackOpacity, nativeTriggerHoverBackground, nativeContentProps, open, onOpenChange, onOpenWillChange, trigger, triggerClassName, triggerLabel, triggerProps, ...props }: DropdownProps): React.JSX.Element;
declare const DropdownComponent: typeof Dropdown & {
    CheckboxItem: typeof DropdownCheckboxItem;
    Content: typeof DropdownContent;
    Group: {
        ({ asChild, ref, ...props }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
    Item: typeof DropdownItem;
    Label: typeof DropdownLabel;
    Portal: typeof DropdownPortal;
    RadioGroup: {
        ({ asChild, value, onValueChange, ref, ...props }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & {
            value: string | undefined;
            onValueChange: (value: string) => void;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
    RadioItem: typeof DropdownRadioItem;
    Root: typeof Dropdown;
    Separator: typeof DropdownSeparator;
    Shortcut: typeof DropdownShortcut;
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
    SubContent: typeof DropdownSubContent;
    SubTrigger: typeof DropdownSubTrigger;
    Trigger: {
        ({ asChild, onPress: onPressProp, disabled, ref, ...props }: Omit<import("react-native").PressableProps & React.RefAttributes<View>, "ref"> & {
            asChild?: boolean;
        } & {
            onKeyDown?: (ev: React.KeyboardEvent) => void;
            onKeyUp?: (ev: React.KeyboardEvent) => void;
        } & React.RefAttributes<import("@rn-primitives/dropdown-menu").TriggerRef>): React.JSX.Element;
        displayName: string;
    };
};
export { DropdownComponent as Dropdown };
