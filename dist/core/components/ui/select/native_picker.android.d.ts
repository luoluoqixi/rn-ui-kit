import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { useResolvedNativeHaptics } from "../utils";
import type { TextProps } from "../text";
import type { ResolvedSelectItemData } from "./select_grouping";
import type { SelectNativeDropdownAlign, SelectNativeTriggerIcon } from "./types";
/** Android 原生 Picker Dialog：隐藏渲染 Picker 并通过 focus() 触发系统 dialog */
export declare function NativePickerDialog({ anchorAlign, anchorWidth, anchorEdgeOffset, anchorStrategy, visible, value, items, mode, onValueChange, onBlur, }: {
    anchorAlign?: SelectNativeDropdownAlign;
    anchorWidth?: number;
    anchorEdgeOffset?: number;
    anchorStrategy?: "layout" | "native-offset";
    visible: boolean;
    value: string | undefined;
    items: ResolvedSelectItemData[];
    mode: "dialog" | "dropdown";
    onValueChange: (itemValue: string) => void;
    onBlur: () => void;
}): React.JSX.Element | null;
export type NativePickerSwiftUIHandle = {
    open: () => void;
};
export declare const NativePickerSwiftUI: React.ForwardRefExoticComponent<{
    items: ResolvedSelectItemData[];
    value: string | null | undefined;
    placeholder?: React.ReactNode;
    mode: "dropdown" | "wheel" | "dialog";
    nativeDropdownAlign?: SelectNativeDropdownAlign;
    nativeDropdownAnchorWidth?: number;
    nativeDropdownEdgeOffset?: number;
    nativeTrigger?: boolean;
    nativeTriggerContainerStyle?: StyleProp<ViewStyle>;
    nativeTriggerContent?: React.ReactNode;
    nativeTriggerIcon?: SelectNativeTriggerIcon;
    nativeTriggerLabelProps?: TextProps;
    onValueChange?: (value: string | null) => void;
    resolvedNativeHaptics: ReturnType<typeof useResolvedNativeHaptics>;
} & React.RefAttributes<NativePickerSwiftUIHandle>>;
