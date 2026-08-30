import { type ScrollViewProps as ReactNativeScrollViewProps } from "react-native";
import { type ScrollTrackOptions } from "./scroll_track";
export declare const ScrollView: import("react").ForwardRefExoticComponent<ReactNativeScrollViewProps & import("..").NavigationBarScrollEdgeTrackingProps & {
    customScrollbar?: boolean | ScrollTrackOptions;
    iosEmptyViewportScrollEnabled?: boolean;
} & import("react").RefAttributes<any>>;
