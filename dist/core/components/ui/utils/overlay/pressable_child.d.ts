import { type ReactElement, type Ref } from "react";
import type { PressableProps, View } from "react-native";
type ChildProps = PressableProps & {
    ref?: Ref<View>;
};
/** Single-child adapter for the window anchor; never adds a native layout node. */
export declare const PressableChild: import("react").ForwardRefExoticComponent<Omit<PressableProps, "children"> & {
    children: ReactElement<ChildProps>;
} & import("react").RefAttributes<View>>;
export {};
