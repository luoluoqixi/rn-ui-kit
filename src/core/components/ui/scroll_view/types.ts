import type { ScrollViewProps as ReactNativeScrollViewProps } from "react-native";

import type { NavigationBarScrollEdgeTrackingProps } from "../utils/navigation";

export type ScrollViewProps = ReactNativeScrollViewProps &
  NavigationBarScrollEdgeTrackingProps & {
    /**
     * iOS only. Routes otherwise-unhandled touches in the empty portion of a
     * short ScrollView to the native UIScrollView. Requires the bundled
     * React Native patch and defaults to true in the rn-ui-kit wrapper.
     */
    iosEmptyViewportScrollEnabled?: boolean;
  };
