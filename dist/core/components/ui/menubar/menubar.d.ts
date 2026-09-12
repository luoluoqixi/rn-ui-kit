import { Text } from "../text";
import { type NativeHapticsSetting } from "../utils";
import * as MenubarPrimitive from "@rn-primitives/menubar";
import * as React from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import type { MenubarContentProps, MenubarProps, MenubarSubContentProps, MenubarTriggerProps } from "./types";
declare function MenubarPortal({ hostName, ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>): React.JSX.Element;
declare function MenubarRoot({ children, className, items, size, contentSize, nativeHaptics, itemNativeHaptics, value: valueProp, onValueChange: onValueChangeProp, ...props }: MenubarProps): React.JSX.Element;
declare function MenubarTrigger({ className, cursorDefault, size: sizeProp, nativeHaptics, onPress, ...props }: MenubarTriggerProps): React.JSX.Element;
declare function MenubarSubTrigger({ className, inset, children, iconClassName, nativeHaptics, onPress, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
    children?: React.ReactNode;
    iconClassName?: string;
    inset?: boolean;
    nativeHaptics?: NativeHapticsSetting;
}): React.JSX.Element;
declare function MenubarSubContent({ className, children, size: sizeProp, style, ...props }: MenubarSubContentProps): React.JSX.Element;
declare function MenubarContent({ className, children, overlayClassName, overlayStyle, portalHost, size: sizeProp, align, alignOffset, sideOffset, style, ...props }: MenubarContentProps & {
    overlayStyle?: StyleProp<ViewStyle>;
    overlayClassName?: string;
    portalHost?: string;
}): React.JSX.Element;
declare function MenubarItem({ className, disabled, inset, variant, nativeHaptics, onPress, ...props }: React.ComponentProps<typeof MenubarPrimitive.Item> & {
    className?: string;
    inset?: boolean;
    variant?: "default" | "destructive";
    nativeHaptics?: NativeHapticsSetting;
}): React.JSX.Element;
declare function MenubarCheckboxItem({ className, children, disabled, nativeHaptics, onCheckedChange, ...props }: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & {
    children?: React.ReactNode;
    nativeHaptics?: NativeHapticsSetting;
}): React.JSX.Element;
declare function MenubarRadioItem({ className, children, disabled, nativeHaptics, onPress, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & {
    children?: React.ReactNode;
    nativeHaptics?: NativeHapticsSetting;
}): React.JSX.Element;
declare function MenubarLabel({ className, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.Label> & {
    className?: string;
    inset?: boolean;
}): React.JSX.Element;
declare function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>): React.JSX.Element;
declare function MenubarShortcut({ className, ...props }: React.ComponentProps<typeof Text>): React.JSX.Element;
declare const Menubar: typeof MenubarRoot & {
    CheckboxItem: typeof MenubarCheckboxItem;
    Content: typeof MenubarContent;
    Group: {
        ({ asChild, ref, ...props }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
    Item: typeof MenubarItem;
    Label: typeof MenubarLabel;
    Menu: {
        ({ asChild, value, ref, ...viewProps }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & {
            value: string | undefined;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
    Portal: typeof MenubarPortal;
    RadioGroup: {
        ({ asChild, value, onValueChange, ref, ...props }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & {
            value: string | undefined;
            onValueChange: (value: string) => void;
        } & React.RefAttributes<View>): React.JSX.Element;
        displayName: string;
    };
    RadioItem: typeof MenubarRadioItem;
    Root: typeof MenubarRoot;
    Separator: typeof MenubarSeparator;
    Shortcut: typeof MenubarShortcut;
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
    SubContent: typeof MenubarSubContent;
    SubTrigger: typeof MenubarSubTrigger;
    Trigger: typeof MenubarTrigger;
};
export { Menubar };
