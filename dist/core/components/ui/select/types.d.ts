import type { ComponentProps, ReactNode } from "react";
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from "react-native";
import type { Picker } from "@react-native-picker/picker";
import type { Select as HeroNativeSelect } from "heroui-native/select";
import type { Select as HeroWebSelect } from "@heroui/react/select";
import type { ListBox } from "@heroui/react/list-box";
import type { ButtonProps } from "../button";
import type { NativeTriggerFeedbackOpacity, NativeTriggerIcon, NativeTriggerProps } from "../native_trigger";
import type { NativeHapticsDelay, NativeHapticsSetting, RenderProp } from "../utils";
import type { NativeSheetProps } from "../sheet/native_sheet/types";
import type { TextProps } from "../text";
export type SelectNativeMode = boolean | "sheet" | "dialog" | "dropdown" | "wheel";
export type SelectHandle = {
    open: () => void;
    close: () => void;
};
export type SelectNativeDropdownAlign = "start" | "center" | "end";
export type SelectNativeTriggerIcon = NativeTriggerIcon;
export type SelectTriggerSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type SelectContentSize = SelectTriggerSize;
export type SelectNativePickerProps = Omit<ComponentProps<typeof Picker>, "children" | "mode" | "onValueChange" | "selectedValue">;
/** Props for the generated iOS wheel action buttons. `native` and `onPress` are managed by Select. */
export type SelectNativeWheelButtonProps = Omit<ButtonProps, "children" | "native">;
/** Props for the iOS wheel action button row. */
export type SelectNativeWheelButtonContainerProps = Omit<ViewProps, "children">;
/** Props for the iOS wheel title. The title content is managed by Select. */
export type SelectNativeWheelTitleProps = Omit<TextProps, "children">;
/** Props for the outer iOS wheel content container. */
export type SelectNativeWheelContainerProps = Omit<ViewProps, "children">;
/** Props for the generated iOS wheel NativeSheet. `open` and `onOpenChange` are managed by Select. */
export type SelectNativeWheelSheetProps = Omit<NativeSheetProps, "children" | "onOpenChange" | "open">;
export type SelectNativeSelectProps = Omit<ComponentProps<"select">, "children" | "defaultValue" | "disabled" | "onChange" | "value">;
export type SelectSheetProps = Omit<NativeSheetProps, "children" | "onAnimationComplete" | "onOpenChange" | "open" | "scrollable">;
export type SelectItemRenderContext = {
    checked: boolean;
    disabled: boolean;
    selected: boolean;
    value: string;
};
export interface SelectItemData {
    "aria-label"?: string;
    "description"?: RenderProp<SelectItemRenderContext>;
    "disabled"?: boolean;
    "endContent"?: RenderProp<SelectItemRenderContext>;
    "isDisabled"?: boolean;
    "label": RenderProp<SelectItemRenderContext>;
    "startContent"?: RenderProp<SelectItemRenderContext>;
    "swatchColor"?: string;
    "value": string;
    "itemProps"?: Omit<SelectItemProps, "value" | "children">;
}
export interface SelectItemGroupData {
    items: SelectItemData[];
    key?: string;
    label?: RenderProp<{
        value: string;
    }>;
    labelProps?: SelectLabelProps;
}
export type SelectOption = SelectItemData;
export type SelectOptionGroup = SelectItemGroupData;
export type SelectRootPrimitiveProps = {
    open?: boolean;
    defaultOpen?: boolean;
};
export type SelectContentProps = {
    className?: string;
    side?: "top" | "bottom" | "left" | "right";
    /** 相对 trigger 的次轴对齐；上下弹出默认 Native center、Web start。
     * 左右弹出默认保持 Native start、Web center，此时 start / end 对应上 / 下沿。 */
    align?: "start" | "center" | "end";
    sideOffset?: number;
    herouiNativeProps?: Omit<Extract<ComponentProps<typeof HeroNativeSelect.Content>, {
        presentation: "popover";
    }>, "children" | "presentation">;
    herouiWebProps?: Omit<ComponentProps<typeof HeroWebSelect.Popover>, "children">;
};
export type SelectItemProps = {
    className?: string;
    style?: StyleProp<ViewStyle>;
    value?: string;
    children?: ReactNode;
    herouiNativeProps?: Omit<ComponentProps<typeof HeroNativeSelect.Item>, "children" | "value" | "label">;
    herouiWebProps?: Omit<ComponentProps<typeof ListBox.Item>, "children" | "id">;
};
export type SelectLabelProps = TextProps;
export interface SelectProps extends Omit<ViewProps, "ref">, SelectRootPrimitiveProps {
    children?: ReactNode;
    accessibilityLabel?: string;
    herouiNativeProps?: Omit<ComponentProps<typeof HeroNativeSelect>, "children" | "value" | "defaultValue" | "onValueChange" | "isOpen" | "isDefaultOpen" | "onOpenChange" | "selectionMode">;
    herouiWebProps?: Omit<ComponentProps<typeof HeroWebSelect>, "children" | "value" | "defaultValue" | "onChange" | "isOpen" | "defaultOpen" | "onOpenChange" | "selectionMode">;
    contentProps?: SelectContentProps;
    defaultValue?: string | null;
    disabled?: boolean;
    isDisabled?: boolean;
    itemGroups?: SelectItemGroupData[];
    itemIndicatorProps?: {
        className?: string;
    };
    itemProps?: Omit<SelectItemProps, "value" | "children">;
    itemTextProps?: TextProps;
    items?: SelectItemData[];
    native?: SelectNativeMode;
    nativeDropdownAlign?: SelectNativeDropdownAlign;
    nativeDropdownAnchorWidth?: number;
    nativeDropdownEdgeOffset?: number;
    nativeHaptics?: NativeHapticsSetting;
    nativeHapticsDelay?: NativeHapticsDelay;
    /** iOS 原生 dropdown 是否等待菜单退出动画完成后再触发 item 回调，默认 `false`。 */
    nativeShouldWaitForMenuToHideBeforeFiringOnPressMenuItem?: boolean;
    /** Additional props for the Android dialog and iOS wheel Pickers. */
    nativePickerProps?: SelectNativePickerProps;
    /** Text displayed by the iOS wheel cancel button. Defaults to `取消`. */
    nativeWheelCancelText?: string;
    /** Additional props for the iOS wheel cancel button. `native` and `onPress` are ignored. */
    nativeWheelCancelButtonProps?: SelectNativeWheelButtonProps;
    /** Text displayed by the iOS wheel done button. Defaults to `完成`. */
    nativeWheelDoneText?: string;
    /** Additional props for the iOS wheel done button. `native` and `onPress` are ignored. */
    nativeWheelDoneButtonProps?: SelectNativeWheelButtonProps;
    /** Additional props for the iOS wheel action button row. */
    nativeWheelButtonContainerProps?: SelectNativeWheelButtonContainerProps;
    /** Additional props for the outer iOS wheel content container. */
    nativeWheelContainerProps?: SelectNativeWheelContainerProps;
    /** Additional props for the iOS wheel NativeSheet. */
    nativeWheelSheetProps?: SelectNativeWheelSheetProps;
    /** Additional props for the iOS wheel title. */
    nativeWheelTitleProps?: SelectNativeWheelTitleProps;
    /** Additional attributes for the browser-native select element. */
    nativeSelectProps?: SelectNativeSelectProps;
    nativeTrigger?: boolean;
    nativeTriggerContainerStyle?: StyleProp<ViewStyle>;
    nativeTriggerContent?: ReactNode;
    nativeTriggerIcon?: SelectNativeTriggerIcon;
    nativeTriggerLabel?: ReactNode;
    nativeTriggerLabelProps?: {
        style?: StyleProp<TextStyle>;
    } & Record<string, unknown>;
    /** Additional props for the generated NativeTrigger. */
    nativeTriggerProps?: Omit<NativeTriggerProps, "active" | "children" | "content" | "label">;
    /** Feedback opacity overrides for the generated NativeTrigger. */
    nativeTriggerFeedbackOpacity?: NativeTriggerFeedbackOpacity;
    /** Enable the Web-only hover background on the generated native trigger. Defaults to true. */
    nativeTriggerHoverBackground?: boolean;
    /** Enable the Web-only hover opacity feedback. Defaults to false when hover background is enabled. */
    nativeTriggerHoverOpacity?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** 原生 dropdown 开始打开或关闭时触发，不等待动画完成。 */
    onOpenWillChange?: (open: boolean) => void;
    onValueChange?: (nextValue: string | null) => void;
    options?: SelectItemData[];
    placeholder?: ReactNode;
    renderValue?: RenderProp<{
        value: string | undefined;
        item?: SelectItemData;
    }>;
    /**
     * Additional props for the generated Select sheet, excluding Select-managed state.
     * `detents` or `snapPoints` can be used to override the automatic sheet height.
     */
    sheetProps?: SelectSheetProps;
    /** Show Web Select's scroll up/down buttons. Defaults to true. */
    showScrollButtons?: boolean;
    /** Props for the generated non-native trigger Button. */
    triggerProps?: Omit<ButtonProps, "children">;
    /** Shared size for every generated Select trigger. Defaults to `default` (`md`). */
    triggerSize?: SelectTriggerSize;
    /** Size of the generated non-native menu content. */
    contentSize?: SelectContentSize;
    /** Font weight for generated Select trigger labels. Defaults to `500`. */
    triggerFontWeight?: TextStyle["fontWeight"];
    value?: string | null;
    viewportProps?: ViewProps;
}
export type NativeSelectProps = SelectProps;
export type NativeSelectPickerProps = NativeSelectProps & {
    items: SelectItemData[];
};
