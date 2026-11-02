import { type ReactNode } from "react";
import { type StyleProp, type ViewProps, type ViewStyle } from "react-native";
export type NativeSheetFillContentProps = Omit<ViewProps, "children"> & {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
};
/**
 * NativeSheet 内的非滚动填充容器。
 *
 * iOS TrueSheet 的 NativeStack 子页面可能仍按整窗高度布局，再从 Sheet 顶部开始显示，
 * 导致底部超出物理窗口。这里用自身的窗口坐标约束最大高度；普通页面与其他平台不调整。
 */
export declare function NativeSheetFillContent({ children, onLayout, style, ...props }: NativeSheetFillContentProps): import("react").JSX.Element;
