import { type ReactNode } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import { type NavigationBarScrollEdgeTrackingProps } from "../../../utils/navigation";
/**
 * Android 嵌套 TrueSheet 会裁剪 ScrollView，但系统滚动条仍按未裁剪高度绘制。
 * 保留原 ScrollView 负责滚动，仅用覆盖层按屏幕内真实可见高度绘制指示器。
 */
export declare const AndroidClippedScrollView: import("react").ForwardRefExoticComponent<Omit<ScrollViewProps, "children"> & NavigationBarScrollEdgeTrackingProps & {
    children: ReactNode;
} & import("react").RefAttributes<ScrollView>>;
