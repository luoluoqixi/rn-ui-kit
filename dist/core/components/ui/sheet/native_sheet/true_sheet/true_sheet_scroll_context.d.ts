import type { InsetAdjustment } from "@lodev09/react-native-true-sheet";
import { type ReactNode } from "react";
export type TrueSheetScrollLayoutConfig = {
    active: boolean;
    autoDetent: boolean;
    /**
     * 当前 TrueSheet 是否已经完成原生展示。
     * iOS 15 会在 Sheet 重复展示时丢失 UINavigationController 对根滚动视图的观察关系，
     * 因此根 NativeList 需要随原生展示生命周期重新启用 scroll-edge 跟踪。
     */
    presentationActive: boolean;
    insetAdjustment: InsetAdjustment;
    /**
     * 是否让 ScrollView 使用 iOS 原生 `contentInsetAdjustmentBehavior="automatic"`。
     * 主要用于透明 header 场景修正顶部 inset。
     */
    automaticContentInsetAdjustment: boolean;
    /**
     * RN ScrollView native insets are enabled. Explicit v4 refs work through deep stacks.
     * SwiftUI List retains its own UIKit safe-area handling.
     */
    nativeScrollInsetsApplied: boolean;
};
export declare function TrueSheetScrollLayoutProvider({ autoDetent, automaticContentInsetAdjustment, children, insetAdjustment, nativeScrollInsetsApplied, presentationActive, }: {
    autoDetent?: boolean;
    automaticContentInsetAdjustment?: boolean;
    children: ReactNode;
    insetAdjustment?: InsetAdjustment;
    nativeScrollInsetsApplied?: boolean;
    presentationActive?: boolean;
}): import("react").JSX.Element;
export declare function useTrueSheetScrollLayout(): TrueSheetScrollLayoutConfig;
