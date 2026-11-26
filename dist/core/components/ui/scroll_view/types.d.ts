import type { ScrollViewProps as ReactNativeScrollViewProps } from "react-native";
import type { NavigationBarScrollEdgeTrackingProps } from "../utils/navigation";
import type { ScrollTrackOptions } from "./scroll_track";
export type ScrollViewProps = ReactNativeScrollViewProps & NavigationBarScrollEdgeTrackingProps & {
    /**
     * Replaces the platform vertical indicator with a draggable custom scroll track.
     * Pass an options object to customize its interaction and appearance.
     */
    customScrollbar?: boolean | ScrollTrackOptions;
    /**
     * iOS only. Routes otherwise-unhandled touches in the empty portion of a
     * short ScrollView to the native UIScrollView. Requires the bundled
     * React Native patch and defaults to true in the rn-ui-kit wrapper.
     */
    iosEmptyViewportScrollEnabled?: boolean;
};
export type CustomScrollbarOptions = ScrollTrackOptions;
