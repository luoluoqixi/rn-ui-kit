import { type ReactNode } from "react";
import { type ViewProps, type StyleProp, type ViewStyle } from "react-native";
export type NativeSheetFillContentProps = Omit<ViewProps, "children"> & {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
};
/** v4 propagates the visible sheet height through Yoga, including native stack pages. */
export declare function NativeSheetFillContent({ children, onLayout, style, ...props }: NativeSheetFillContentProps): import("react").JSX.Element;
