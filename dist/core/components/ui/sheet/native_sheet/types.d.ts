import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { StackNavigationOptions } from "@react-navigation/stack";
import type { SheetDetent, TrueSheetProps } from "@lodev09/react-native-true-sheet";
import type { ComponentType, ReactNode } from "react";
/** Percentage convenience value. Numbers are fractions (0..1), strings are CSS percentages. */
export type NativeSheetSnapPoint = number | `${number}%`;
export type NativeSheetDetent = SheetDetent;
type NativeSheetEventProps = Pick<TrueSheetProps, "onBackPress" | "onDidDismiss" | "onDidPresent" | "onDetentChange" | "onDragBegin" | "onDragChange" | "onDragEnd" | "onMount" | "onPositionChange" | "onWillBlur" | "onWillDismiss" | "onWillFocus" | "onWillPresent" | "onDidBlur" | "onDidFocus">;
type NativeSheetDirectProps = Omit<TrueSheetProps, "backgroundColor" | "children" | "detents" | "name" | "onBackPress" | "onDidBlur" | "onDidDismiss" | "onDidFocus" | "onDidPresent" | "onDetentChange" | "onDragBegin" | "onDragChange" | "onDragEnd" | "onMount" | "onWillBlur" | "onWillDismiss" | "onWillFocus" | "onWillPresent">;
export type NativeSheetStackScreenOptions = NativeStackNavigationOptions | StackNavigationOptions;
export type NativeSheetStackSheetProps = Omit<TrueSheetProps, "children" | "name"> & {
    snapPoints?: NativeSheetSnapPoint[];
};
export type NativeSheetProps = NativeSheetDirectProps & NativeSheetEventProps & {
    backgroundColor?: TrueSheetProps["backgroundColor"];
    children?: ReactNode;
    content?: ReactNode;
    defaultOpen?: boolean;
    defaultPosition?: number;
    /** TrueSheet 原生 detents；设置后优先于 `snapPoints`。 */
    detents?: SheetDetent[];
    dismissOnBackPress?: boolean;
    dismissOnOverlayPress?: boolean;
    disableDrag?: boolean;
    /**
     * Android 关闭预测系数：用于根据松手速度预测 sheet 的下滑距离。
     * 值越大越容易触发关闭，有效范围为 `>= 0`，默认值为 `2`。
     */
    androidHideFriction?: number;
    /**
     * Android 关闭速度阈值，单位为 px/s：达到该下滑速度后进入速度驱动的关闭判定。
     * 值越小越容易触发，有效范围为 `>= 0`，默认值为 `10`。
     */
    androidSignificantVelocityThreshold?: number;
    /** 原生 grabber 需要避让时，为内容区额外预留顶部占位；默认不预留，让拖拽条悬浮覆盖在内容顶部。 */
    grabberContentInsetTop?: number;
    /** `handle` 是旧别名；TrueSheet 原生 prop 请优先使用 `grabber`。 */
    handle?: boolean;
    modal?: boolean;
    name?: string;
    native?: boolean;
    onAnimationComplete?: (event: {
        open: boolean;
    }) => void;
    onOpenChange?: (open: boolean) => void;
    /** 旧的 detent index 回调，迁移到 TrueSheet 原生 API 后建议使用 `onPositionChange`。 */
    onSnapPointChange?: (position: number) => void;
    open?: boolean;
    overlay?: boolean;
    overlayPortalHostName?: string;
    position?: number;
    /** Percentage convenience alias for `detents`; numbers are 0..1 fractions. */
    snapPoints?: NativeSheetSnapPoint[];
    transition?: string | number;
};
export type NativeSheetStackScreenProps = {
    component?: ComponentType<any>;
    children?: ReactNode | (() => ReactNode);
    name: string;
    options?: Record<string, unknown>;
};
export interface NativeSheetStackProps<ParamList extends ParamListBase = ParamListBase> {
    children: ReactNode;
    initialRouteName?: keyof ParamList & string;
    name?: string;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    overlayPortalHostName?: string;
    screenOptions?: NativeSheetStackScreenOptions;
    sheetProps?: NativeSheetStackSheetProps;
}
export {};
