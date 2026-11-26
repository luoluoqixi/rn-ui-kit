import type { ViewProps } from "react-native";
import type { ButtonProps, ButtonSizeVariant } from "../button";
import type { NativeHapticsDelay, NativeHapticsSetting, RenderProp } from "../utils";
import type { DropdownItemData } from "../dropdown/types";
import type { MenuContentProps } from "../menu/types";
export type MenubarSize = ButtonSizeVariant;
export type MenubarItemData = DropdownItemData;
export type MenubarItemRenderContext = {
    open: boolean;
    disabled: boolean;
    value: string;
};
export type MenubarTriggerProps = Omit<ButtonProps, "children" | "title" | "native" | "onPress">;
export type MenubarContentProps = MenuContentProps;
export type MenubarMenuData = {
    value: string;
    title: RenderProp<MenubarItemRenderContext>;
    items: MenubarItemData[];
    disabled?: boolean;
    nativeHaptics?: NativeHapticsSetting;
    triggerProps?: MenubarTriggerProps;
    /** Menu placement defaults to start alignment; overrides the bar's contentProps. */
    contentProps?: MenubarContentProps;
};
export type MenubarProps = Omit<ViewProps, "children"> & {
    items: MenubarMenuData[];
    /** Controlled open menu. Explicit undefined means all menus are closed. */
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string | undefined) => void;
    size?: MenubarSize;
    disabled?: boolean;
    nativeHaptics?: NativeHapticsSetting;
    itemNativeHaptics?: NativeHapticsSetting;
    itemNativeHapticsDelay?: NativeHapticsDelay;
    /** Menus align to the trigger's start edge by default (left in LTR). */
    contentProps?: MenubarContentProps;
};
