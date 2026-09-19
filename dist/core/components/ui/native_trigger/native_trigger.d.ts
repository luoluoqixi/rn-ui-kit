import React from "react";
import { View } from "react-native";
import { NativeTriggerFaceProps, NativeTriggerProps } from "./types";
export declare const NativeTriggerFace: React.ForwardRefExoticComponent<NativeTriggerFaceProps & React.RefAttributes<View>>;
export declare const NativeTrigger: React.ForwardRefExoticComponent<Omit<NativeTriggerFaceProps, "opacity"> & Omit<import("react-native").PressableProps, "children"> & {
    active?: boolean;
    pressedOpacity?: boolean;
    keepPressedOpacity?: boolean;
    feedbackOpacity?: import("./types").NativeTriggerFeedbackOpacity;
} & React.RefAttributes<View>>;
/** `NativeTrigger` 的兼容别名。 */
export declare const NativeTriggerPressable: React.ForwardRefExoticComponent<Omit<NativeTriggerFaceProps, "opacity"> & Omit<import("react-native").PressableProps, "children"> & {
    active?: boolean;
    pressedOpacity?: boolean;
    keepPressedOpacity?: boolean;
    feedbackOpacity?: import("./types").NativeTriggerFeedbackOpacity;
} & React.RefAttributes<View>>;
export type NativeTriggerPressableProps = NativeTriggerProps;
