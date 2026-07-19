import { type ReactNode } from "react";
import { ScrollView, type ScrollViewProps, type StyleProp, type ViewStyle } from "react-native";
export type TrueSheetScrollContentProps = Omit<ScrollViewProps, "children"> & {
    children: ReactNode;
    /** 追加在底部安全区与默认留白之后 */
    extraBottomPadding?: number;
    contentContainerStyle?: StyleProp<ViewStyle>;
};
/**
 * True Sheet 内滚动容器：约束 flex、避免 `flexGrow: 1` 占满导致 iOS 滚不到底。
 * 须置于 `TrueSheetScrollLayoutProvider` 子树内（由 `TrueSheetPanel` / `TrueSheetStackHost` 提供）。
 */
export declare const TrueSheetScrollContent: import("react").ForwardRefExoticComponent<Omit<ScrollViewProps, "children"> & {
    children: ReactNode;
    /** 追加在底部安全区与默认留白之后 */
    extraBottomPadding?: number;
    contentContainerStyle?: StyleProp<ViewStyle>;
} & import("react").RefAttributes<ScrollView>>;
