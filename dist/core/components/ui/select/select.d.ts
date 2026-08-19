import React from "react";
import { View } from "react-native";
import type { SelectAdaptContentsProps, SelectAdaptProps, SelectContentProps, SelectFocusScopeProps, SelectGroupProps, SelectIconProps, SelectIndicatorProps, SelectItemIndicatorProps, SelectItemProps, SelectItemTextProps, SelectLabelProps, SelectProps, SelectScrollDownButtonProps, SelectScrollUpButtonProps, SelectTriggerProps, SelectValueProps, SelectViewportProps } from "./types";
declare function SelectAdaptContents(props: SelectAdaptContentsProps): React.JSX.Element;
declare function SelectAdaptRoot(props: SelectAdaptProps): React.JSX.Element;
declare function SelectContent(props: SelectContentProps): React.JSX.Element | null;
declare function SelectGroup(props: SelectGroupProps): React.JSX.Element;
declare function SelectIcon(props: SelectIconProps): React.JSX.Element;
declare function SelectItem(props: SelectItemProps): React.JSX.Element;
declare function SelectItemIndicator(props: SelectItemIndicatorProps): React.JSX.Element;
declare function SelectItemText(props: SelectItemTextProps): React.JSX.Element;
declare function SelectLabel(props: SelectLabelProps): React.JSX.Element;
declare function SelectScrollDownButton(props: SelectScrollDownButtonProps): React.JSX.Element;
declare function SelectScrollUpButton(props: SelectScrollUpButtonProps): React.JSX.Element;
declare function SelectValue(props: SelectValueProps): React.JSX.Element;
declare function SelectViewport(props: SelectViewportProps): React.JSX.Element | null;
declare function SelectIndicator(props: SelectIndicatorProps): React.JSX.Element;
declare function SelectFocusScope(props: SelectFocusScopeProps): React.JSX.Element;
/** 供外部主动唤起 Select 的实例方法。 */
export type SelectHandle = {
    open: () => void;
};
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<SelectHandle>> & {
    Adapt: typeof SelectAdaptRoot & {
        Contents: typeof SelectAdaptContents;
    };
    Content: typeof SelectContent;
    Group: typeof SelectGroup;
    Icon: typeof SelectIcon;
    Item: typeof SelectItem;
    ItemIndicator: typeof SelectItemIndicator;
    ItemText: typeof SelectItemText;
    Label: typeof SelectLabel;
    ScrollDownButton: typeof SelectScrollDownButton;
    ScrollUpButton: typeof SelectScrollUpButton;
    Trigger: React.ForwardRefExoticComponent<Omit<SelectTriggerProps, "ref"> & React.RefAttributes<any>>;
    Value: typeof SelectValue;
    Viewport: typeof SelectViewport;
    Indicator: typeof SelectIndicator;
    FocusScope: typeof SelectFocusScope;
    /** 可独立点击的 native trigger。 */
    NativeTrigger: React.ForwardRefExoticComponent<Omit<import("..").NativeTriggerFaceProps, "opacity"> & Omit<import("react-native").PressableProps, "children"> & {
        active?: boolean;
        pressedOpacity?: boolean;
        keepPressedOpacity?: boolean;
    } & React.RefAttributes<View>>;
    /** `NativeTrigger` 的兼容别名。 */
    NativeTriggerPressable: React.ForwardRefExoticComponent<Omit<import("..").NativeTriggerFaceProps, "opacity"> & Omit<import("react-native").PressableProps, "children"> & {
        active?: boolean;
        pressedOpacity?: boolean;
        keepPressedOpacity?: boolean;
    } & React.RefAttributes<View>>;
};
export {};
