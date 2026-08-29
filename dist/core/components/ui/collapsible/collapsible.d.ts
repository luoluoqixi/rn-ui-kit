import * as React from "react";
import type { CollapsibleProps } from "./types";
declare function CollapsibleRoot({ children, content, contentClassName, contentProps, defaultOpen, disabled, nativeHaptics, onOpenChange, open, title, titleClassName, trigger, triggerButtonProps, triggerClassName, triggerProps, ...rootProps }: CollapsibleProps): React.JSX.Element;
declare const Collapsible: typeof CollapsibleRoot & {
    Content: {
        ({ asChild, forceMount, ref, ...props }: import("@rn-primitives/types").ForceMountable & import("react-native").ViewProps & {
            asChild?: boolean;
        } & React.RefAttributes<import("react-native").View>): React.JSX.Element | null;
        displayName: string;
    };
    Root: typeof CollapsibleRoot;
    Trigger: {
        ({ asChild, onPress: onPressProp, disabled: disabledProp, ref, ...props }: Omit<import("react-native").PressableProps & React.RefAttributes<import("react-native").View>, "ref"> & {
            asChild?: boolean;
        } & {
            onKeyDown?: (ev: React.KeyboardEvent) => void;
            onKeyUp?: (ev: React.KeyboardEvent) => void;
        } & React.RefAttributes<import("react-native").View>): React.JSX.Element;
        displayName: string;
    };
};
export { Collapsible };
export type * from "./types";
