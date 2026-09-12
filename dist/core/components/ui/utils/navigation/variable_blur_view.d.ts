import type { ComponentType } from "react";
import type { ViewProps } from "react-native";
export type VariableBlurDirection = "topToBottom" | "bottomToTop";
export type VariableBlurViewProps = ViewProps & {
    blurRadius?: number;
    direction?: VariableBlurDirection;
    transitionHeight?: number;
};
export declare const VariableBlurView: ComponentType<VariableBlurViewProps>;
