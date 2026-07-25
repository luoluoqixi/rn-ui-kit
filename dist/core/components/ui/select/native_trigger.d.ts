import React from "react";
import { type PressableProps, type StyleProp, View, type ViewProps, type ViewStyle } from "react-native";
import type { TextProps } from "../text";
import type { SelectNativeTriggerIcon } from "./types";
export declare function NativeTriggerFace({ content, containerStyle, icon, labelProps, label, opacity, }: {
    content?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    icon?: SelectNativeTriggerIcon;
    labelProps?: TextProps;
    label: React.ReactNode;
    opacity?: number;
}): React.JSX.Element;
export declare const NativeTriggerPressable: React.ForwardRefExoticComponent<{
    content?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    icon?: SelectNativeTriggerIcon;
    labelProps?: TextProps;
    label: React.ReactNode;
    onPress?: PressableProps["onPress"];
} & Omit<ViewProps, "children" | "onPress"> & React.RefAttributes<View>>;
