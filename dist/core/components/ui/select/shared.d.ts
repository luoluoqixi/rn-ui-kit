import type { SelectItemData, SelectProps } from "./types";
import type { TextProps } from "../text";
import * as React from "react";
import { type TextStyle } from "react-native";
import { SELECT_TRIGGER_DISABLE_OPACITY, SELECT_TRIGGER_PRESS_OPACITY, SELECT_TRIGGER_WEB_HOVER_OPACITY, SELECT_TRIGGER_WEB_PRESS_OPACITY } from "../native_trigger";
export declare const SELECT_TRIGGER_SWATCH_SIZE = 14;
export { SELECT_TRIGGER_DISABLE_OPACITY, SELECT_TRIGGER_PRESS_OPACITY, SELECT_TRIGGER_WEB_HOVER_OPACITY, SELECT_TRIGGER_WEB_PRESS_OPACITY, };
export declare function flattenItems(props: SelectProps): SelectItemData[];
export declare function itemLabel(item: SelectItemData | undefined, value?: string): string;
export declare function renderSelectText(value: React.ReactNode, textProps?: TextProps, defaultColor?: string, defaultOpacity?: number, defaultFontSize?: number, defaultFontWeight?: TextStyle["fontWeight"]): bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null | undefined;
export declare function getSelectTriggerFontSize(props: SelectProps): number;
export declare function SelectedLabel({ defaultFontSize, defaultOpacity, defaultFontWeight, labelProps, props, value, }: {
    defaultFontSize?: number;
    defaultOpacity?: number;
    defaultFontWeight?: TextStyle["fontWeight"];
    labelProps?: TextProps;
    props: SelectProps;
    value?: string;
}): bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null | undefined;
type SelectTriggerSharedProps = {
    active?: boolean;
    label?: React.ReactNode;
    onPress?: () => void;
    props: SelectProps;
    value?: string;
} & Record<string, any>;
export declare const SelectNativeTrigger: React.ForwardRefExoticComponent<Omit<SelectTriggerSharedProps, "ref"> & React.RefAttributes<any>>;
/** The non-native trigger used by picker branches when `nativeTrigger` is false. */
export declare const SelectBasicTrigger: React.ForwardRefExoticComponent<Omit<{
    disabled?: boolean;
    label?: React.ReactNode;
    props: SelectProps;
    value?: string;
    onPress?: () => void;
} & Record<string, any>, "ref"> & React.RefAttributes<any>>;
export declare function useSelectState(props: SelectProps): {
    value: string | null | undefined;
    setValue: (next: string) => void;
};
export declare function triggerSelectHaptics(props: SelectProps): import("..").NativeHapticsSetting | undefined;
export declare function renderNativeItemLabel(item: SelectItemData, selectedValue?: string): bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null | undefined;
