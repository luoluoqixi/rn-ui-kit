import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { type ScrollViewProps, type StyleProp, type ViewStyle } from "react-native";
export type NativeStackScrollEdgeHeaderOptions = {
    /** 页面内容区颜色；Android 位于顶部时使用它，让 Header 与页面自然融为一体。 */
    screenBackgroundColor: string;
    /** 常规 Header 颜色；Android 离开顶部后使用它。 */
    headerBackgroundColor: string;
};
/**
 * 页面级滚动容器驱动导航栏边缘状态时的可选配置。
 *
 * iOS 不读取这些颜色或阈值，仍完全由 UIKit 的 scroll-edge appearance 驱动。
 */
export type NavigationBarScrollEdgeTrackingOptions = {
    /** Android 顶部状态颜色；默认使用 `useAppBackgroundColors().screen`。 */
    topBackgroundColor?: string;
    /** Android 非顶部状态颜色；默认使用 `useAppBackgroundColors().header`。 */
    scrolledBackgroundColor?: string;
    /** Android 离开顶部的偏移阈值，单位为 pt；默认 1。 */
    topThreshold?: number;
    /**
     * Android 更新 `headerStyle` 时需要保留的额外样式。
     * 普通 native-stack 页面通常不需要；自定义高度的 JS Stack 可以显式传入。
     */
    androidHeaderStyle?: StyleProp<ViewStyle>;
};
export type NavigationBarScrollEdgeTrackingProps = {
    /**
     * 将当前滚动容器声明为页面级、负责驱动 Header scroll-edge 状态的唯一容器。
     *
     * iOS React Native ScrollView 由 UIKit 原生识别；iOS NativeList 会注册底层原生列表；
     * Android 只在顶部状态发生变化时切换两种实体背景色。
     */
    tracksNavigationBarScrollEdge?: boolean;
    navigationBarScrollEdgeOptions?: NavigationBarScrollEdgeTrackingOptions;
};
type UseNavigationBarScrollEdgeParams = NavigationBarScrollEdgeTrackingProps & {
    onScroll?: ScrollViewProps["onScroll"];
};
/**
 * 生成跨版本、跨平台的 native-stack scroll-edge Header 基础配置。
 *
 * - iOS 15–25：保留当前原生 scrollEdgeAppearance / standardAppearance 路径。
 * - iOS 26+：保持透明 Header、系统 Liquid Glass 与原生返回按钮历史菜单。
 * - Android：Header 始终参与正常布局，顶部先使用页面色；滚动后的颜色由页面级
 *   ScrollView / NativeList 的 `tracksNavigationBarScrollEdge` 驱动。
 */
export declare function getNativeStackScrollEdgeHeaderOptions({ headerBackgroundColor, screenBackgroundColor, }: NativeStackScrollEdgeHeaderOptions): NativeStackNavigationOptions;
/**
 * 合并调用方 onScroll，并只在 Android 的“顶部 / 非顶部”边界发生变化时更新 Header。
 * iOS 和其它平台原样返回调用方 onScroll，不参与状态判断。
 */
export declare function useNavigationBarScrollEdge({ navigationBarScrollEdgeOptions, onScroll, tracksNavigationBarScrollEdge, }: UseNavigationBarScrollEdgeParams): ScrollViewProps["onScroll"];
export {};
