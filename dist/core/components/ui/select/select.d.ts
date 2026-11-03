import * as React from "react";
import * as SelectPrimitive from "@rn-primitives/select";
import type { SelectHandle, SelectNativeMode, SelectProps } from "./types";
/** The default keeps the browser basic select and uses the native dropdown on mobile. */
export declare const DEFAULT_SELECT_NATIVE: SelectNativeMode;
declare const SelectComponent: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<SelectHandle>> & {
    Content: ({ className, children, position, align, side: sideProp, showScrollButtons, initialScrollOffset, portalHost, viewportProps, size: sizeProp, ...props }: import("./types").SelectContentProps) => React.JSX.Element;
    Group: (props: import("./types").SelectGroupProps) => React.JSX.Element;
    Item: ({ className, children, description, startContent, endContent, itemIndicatorProps, itemTextProps, ...props }: import("./types").SelectItemProps) => React.JSX.Element;
    ItemIndicator: {
        ({ asChild, forceMount, ref, ...props }: import("react-native").ViewProps & {
            asChild?: boolean;
        } & import("@rn-primitives/types").ForceMountable & React.RefAttributes<import("react-native").View>): React.JSX.Element | null;
        displayName: string;
    };
    ItemText: {
        ({ asChild, ref, ...props }: import("@rn-primitives/select").ItemTextProps & React.RefAttributes<import("react-native").Text>): React.JSX.Element;
        displayName: string;
    };
    Label: ({ className, ...props }: import("./types").SelectLabelProps) => React.JSX.Element;
    Overlay: {
        ({ asChild, forceMount, onPress: OnPressProp, closeOnPress, ref, ...props }: import("@rn-primitives/types").ForceMountable & Omit<import("react-native").PressableProps & React.RefAttributes<import("react-native").View>, "ref"> & {
            asChild?: boolean;
        } & {
            onKeyDown?: (ev: React.KeyboardEvent) => void;
            onKeyUp?: (ev: React.KeyboardEvent) => void;
        } & {
            closeOnPress?: boolean;
        } & React.RefAttributes<import("react-native").View>): React.JSX.Element | null;
        displayName: string;
    };
    Portal: typeof SelectPrimitive.Portal;
    Root: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<SelectHandle>>;
    ScrollDownButton: ({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) => React.JSX.Element | null;
    ScrollUpButton: ({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) => React.JSX.Element | null;
    Separator: ({ className, ...props }: import("./types").SelectSeparatorProps) => React.JSX.Element;
    Trigger: ({ className, children, onHoverIn, onHoverOut, onPressIn, onPressOut, size, ...props }: import("./types").SelectTriggerProps) => React.JSX.Element;
    Value: ({ className, ...props }: import("./types").SelectValueProps) => React.JSX.Element;
    Viewport: ({ children }: import("@rn-primitives/select").ViewportProps) => React.JSX.Element;
};
export { SelectComponent as Select };
export type { SelectHandle } from "./types";
