import { type ReactNode } from "react";
import { ScrollView, type ScrollViewProps, type StyleProp, type ViewStyle } from "react-native";
import { type NavigationBarScrollEdgeTrackingProps } from "../../utils/navigation";
export type NativeSheetScrollContentProps = Omit<ScrollViewProps, "children"> & NavigationBarScrollEdgeTrackingProps & {
    children: ReactNode;
    extraBottomPadding?: number;
    /** Defaults to registering the focused page. Explicit false retains automatic discovery. */
    bindToNativeSheet?: boolean;
    /**
     * @deprecated v4 always bounds the viewport synchronously; false no longer
     * requests full-window overflow. Use a Portal for content outside the sheet.
     */
    constrainToNativeSheetViewport?: boolean;
    iosEmptyViewportScrollEnabled?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
};
export declare const NativeSheetScrollContent: import("react").ForwardRefExoticComponent<Omit<ScrollViewProps, "children"> & NavigationBarScrollEdgeTrackingProps & {
    children: ReactNode;
    extraBottomPadding?: number;
    /** Defaults to registering the focused page. Explicit false retains automatic discovery. */
    bindToNativeSheet?: boolean;
    /**
     * @deprecated v4 always bounds the viewport synchronously; false no longer
     * requests full-window overflow. Use a Portal for content outside the sheet.
     */
    constrainToNativeSheetViewport?: boolean;
    iosEmptyViewportScrollEnabled?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
} & import("react").RefAttributes<ScrollView>>;
