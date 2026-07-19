import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { useResolvedNativeHaptics } from "../utils";
import type { TextProps } from "../text";
import type { ResolvedSelectItemData } from "./select_grouping";
import type { SelectNativeDropdownAlign, SelectNativeTriggerIcon } from "./types";
/**
 * iOS NativePicker 的 ref handle。
 * 通过 open() 方法在外部控制选项列表的打开。
 */
export type NativePickerSwiftUIHandle = {
    open: () => void;
};
/**
 * iOS NativePicker：switch 入口。
 * dropdown → NativePickerDropdownCustom（含可选的 nativeTrigger SwiftUI menu）
 * wheel + nativeTrigger → NativePickerWheelNativeTriggerSheet
 * wheel + 自定义 trigger → NativePickerWheelSheet
 */
export declare const NativePickerSwiftUI: React.ForwardRefExoticComponent<{
    items: ResolvedSelectItemData[];
    value: string | null | undefined;
    placeholder?: React.ReactNode;
    mode: "dropdown" | "wheel";
    nativeDropdownAlign?: SelectNativeDropdownAlign;
    nativeDropdownAnchorWidth?: number;
    nativeDropdownEdgeOffset?: number;
    nativeTrigger?: boolean;
    nativeTriggerContainerStyle?: StyleProp<ViewStyle>;
    nativeTriggerContent?: React.ReactNode;
    nativeTriggerIcon?: SelectNativeTriggerIcon;
    nativeTriggerLabelProps?: TextProps;
    onValueChange?: (value: string | null) => void;
    onOpenChange?: (open: boolean) => void;
    resolvedNativeHaptics: ReturnType<typeof useResolvedNativeHaptics>;
} & React.RefAttributes<NativePickerSwiftUIHandle>>;
/** iOS 端永不渲染（shouldRenderNativePicker 恒为 false） */
export declare const NativePickerDialog: React.FC<any>;
