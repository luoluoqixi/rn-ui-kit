import * as React from "react";
import { View } from "react-native";
import type { DropdownProps } from "./types";
export type DropdownTriggerContext = {
    native: boolean;
    open: boolean;
};
export declare const DropdownNativeTrigger: React.ForwardRefExoticComponent<Omit<{
    className?: string;
    containerStyle: DropdownProps["nativeTriggerContainerStyle"];
    content: DropdownProps["nativeTriggerContent"];
    disabled?: boolean | null;
    icon: DropdownProps["nativeTriggerIcon"];
    label: DropdownProps["triggerLabel"];
    labelProps: DropdownProps["nativeTriggerLabelProps"];
    nativeTriggerFeedbackOpacity?: DropdownProps["nativeTriggerFeedbackOpacity"];
    nativeTriggerHoverBackground?: DropdownProps["nativeTriggerHoverBackground"];
    nativeTriggerProps?: DropdownProps["nativeTriggerProps"];
    keepPressedOpacity?: boolean;
    open: boolean;
    pressedOpacity?: boolean;
    trigger: DropdownProps["trigger"];
} & Omit<Omit<import("..").NativeTriggerFaceProps, "opacity"> & Omit<import("react-native").PressableProps, "children"> & {
    active?: boolean;
    pressedOpacity?: boolean;
    keepPressedOpacity?: boolean;
    feedbackOpacity?: import("..").NativeTriggerFeedbackOpacity;
} & React.RefAttributes<View>, "label" | "disabled" | "icon" | "active" | "labelProps" | "content" | "containerStyle" | "pressedOpacity" | "keepPressedOpacity">, "ref"> & React.RefAttributes<View>>;
export declare const DropdownDefaultTrigger: React.ForwardRefExoticComponent<Omit<{
    className?: string;
    disabled?: boolean | null;
    label?: React.ReactNode;
    props?: DropdownProps["triggerProps"];
} & Omit<Omit<import("..").ButtonProps, "ref"> & React.RefAttributes<View>, "className" | "children" | "disabled">, "ref"> & React.RefAttributes<View>>;
export declare function resolveDropdownTrigger(trigger: DropdownProps["trigger"], context: DropdownTriggerContext, disabled?: boolean | null): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.ReactElement<{
    disabled?: boolean;
}, string | React.JSXElementConstructor<any>> | null | undefined;
export declare function DropdownDisabledTrigger({ children }: {
    children?: React.ReactNode;
}): React.JSX.Element;
