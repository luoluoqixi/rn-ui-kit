import type { ComponentProps, ReactNode, Ref } from "react";
import type { ScrollView as RNScrollView, NativeScrollEvent } from "react-native";
import type { ScrollShadow as NativeShadow } from "heroui-native/scroll-shadow";
import type { ScrollShadow as WebShadow } from "@heroui/react/scroll-shadow";
import type { ScrollViewProps } from "../scroll_view";
import type { FieldSlotProps } from "../utils/field_types";
/** Owns its scroll container; children are content, not another ScrollView. */
export type ScrollShadowProps = FieldSlotProps<ComponentProps<typeof NativeShadow>, ComponentProps<typeof WebShadow>, "size" | "orientation" | "visibility" | "isEnabled" | "hideScrollBar" | "LinearGradientComponent"> & {
    children: ReactNode;
    size?: number;
    orientation?: "vertical" | "horizontal";
    visibility?: "auto" | "both" | "top" | "bottom" | "left" | "right" | "none";
    isEnabled?: boolean;
    hideScrollBar?: boolean;
    onNativeScroll?: (event: NativeScrollEvent) => void;
    /** Inner Native scroll options. Standard scroll callbacks run on JS. */
    nativeScrollProps?: Omit<ScrollViewProps, "children" | "horizontal" | "customScrollbar" | "tracksNavigationBarScrollEdge" | "navigationBarScrollEdgeOptions" | "onScroll"> & {
        ref?: Ref<RNScrollView>;
    };
};
