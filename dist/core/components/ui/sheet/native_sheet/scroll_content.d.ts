import { type ReactNode } from "react";
import { ScrollView, type ScrollViewProps, type StyleProp, type ViewStyle } from "react-native";
export type NativeSheetScrollContentProps = Omit<ScrollViewProps, "children"> & {
    children: ReactNode;
    /** 追加在底部安全区与默认留白之后 */
    extraBottomPadding?: number;
    /**
     * 将当前 ScrollView 显式注册为所在 TrueSheet 的滚动视图。
     * NativeSheetStack 页面应传入当前页面的 focus 状态；默认不注册，保留 TrueSheet 原有查找逻辑。
     */
    bindToNativeSheet?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
};
/**
 * NativeSheet 内滚动容器：
 * - iOS TrueSheet 子树下复用现有 inset / detent 补偿
 * - Android TrueSheet 下使用裁剪滚动容器，避免滚动内容溢出圆角区域
 */
export declare const NativeSheetScrollContent: import("react").ForwardRefExoticComponent<Omit<ScrollViewProps, "children"> & {
    children: ReactNode;
    /** 追加在底部安全区与默认留白之后 */
    extraBottomPadding?: number;
    /**
     * 将当前 ScrollView 显式注册为所在 TrueSheet 的滚动视图。
     * NativeSheetStack 页面应传入当前页面的 focus 状态；默认不注册，保留 TrueSheet 原有查找逻辑。
     */
    bindToNativeSheet?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
} & import("react").RefAttributes<ScrollView>>;
