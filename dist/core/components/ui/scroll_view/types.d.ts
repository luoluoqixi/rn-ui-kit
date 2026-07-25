import type { ComponentProps } from "react";
import type { ScrollView as TamaguiScrollView } from "tamagui";
import type { NavigationBarScrollEdgeTrackingProps } from "../utils/navigation";
export type ScrollViewProps = ComponentProps<typeof TamaguiScrollView> & NavigationBarScrollEdgeTrackingProps & {
    /** 处于 BottomSheet 内时是否接入 gorhom scrollable 协议。 */
    bottomSheetScrollable?: boolean;
    /**
     * iOS only. Routes otherwise-unhandled touches in the empty portion of a
     * short ScrollView to the native UIScrollView. Requires the bundled
     * React Native patch and defaults to false.
     */
    iosEmptyViewportScrollEnabled?: boolean;
};
