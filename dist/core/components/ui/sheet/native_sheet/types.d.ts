import type { ParamListBase } from "@react-navigation/native";
import type { NativeStackHeaderItemButton, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { StackNavigationOptions } from "@react-navigation/stack";
import type { SheetDetent, TrueSheetProps } from "@lodev09/react-native-true-sheet";
import type { ComponentType, ReactNode } from "react";
import type { ButtonProps } from "../../button";
/** Percentage convenience value. Numbers are fractions (0..1), strings are CSS percentages. */
export type NativeSheetSnapPoint = number | `${number}%`;
export type NativeSheetDetent = SheetDetent;
type NativeSheetEventProps = Pick<TrueSheetProps, "onBackPress" | "onDidDismiss" | "onDidPresent" | "onDetentChange" | "onDragBegin" | "onDragChange" | "onDragEnd" | "onMount" | "onPositionChange" | "onWillBlur" | "onWillDismiss" | "onWillFocus" | "onWillPresent" | "onDidBlur" | "onDidFocus">;
type NativeSheetDirectProps = Omit<TrueSheetProps, "backgroundColor" | "children" | "detents" | "name" | "onBackPress" | "onDidBlur" | "onDidDismiss" | "onDidFocus" | "onDidPresent" | "onDetentChange" | "onDragBegin" | "onDragChange" | "onDragEnd" | "onMount" | "onWillBlur" | "onWillDismiss" | "onWillFocus" | "onWillPresent">;
export type NativeSheetStackScreenOptions = NativeStackNavigationOptions | StackNavigationOptions;
/** iOS Native Stack 左侧原生导航栏 items；完整透传给 `unstable_headerLeftItems`。 */
export type NativeSheetStackHeaderLeftItems = NonNullable<NativeStackNavigationOptions["unstable_headerLeftItems"]>;
/** iOS Native Stack 右侧原生导航栏 items；完整透传给 `unstable_headerRightItems`。 */
export type NativeSheetStackHeaderRightItems = NonNullable<NativeStackNavigationOptions["unstable_headerRightItems"]>;
/**
 * NativeSheetStack 单个 Header 按钮的跨平台配置。
 *
 * 公共字段会覆盖平台扩展中的同名字段。iOS 使用真正的原生 Header item；
 * Android/Web 使用 rn-ui-kit Button。平台扩展中的 onPress 会先于公共 onPress 执行。
 */
export type NativeSheetStackHeaderButtonProps = {
    accessibilityHint?: string;
    accessibilityLabel?: string;
    /** 按下后是否关闭当前 Sheet。右侧内置关闭按钮默认 true，左侧按钮默认 false。 */
    closeSheetOnPress?: boolean;
    /** Android/Web React Button 的完整属性。 */
    customButtonProps?: ButtonProps;
    disabled?: boolean;
    /** iOS 原生 button item 的完整属性；`type` 始终固定为 `button`。 */
    iosButtonProps?: Partial<Omit<NativeStackHeaderItemButton, "type">>;
    label?: string;
    onPress?: () => void;
    tintColor?: NativeStackHeaderItemButton["tintColor"];
    /** @deprecated 使用 `label`。 */
    title?: string;
};
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
    /** Android/Web Stack Header 左侧 React 内容；iOS 请使用 `headerLeftItems`。 */
    headerLeft?: NativeSheetStackScreenOptions["headerLeft"];
    /** 左侧单按钮便捷配置。iOS 使用原生 item，Android/Web 使用 React Button。 */
    headerLeftButtonProps?: NativeSheetStackHeaderButtonProps;
    /** iOS `unstable_headerLeftItems` 的完整透传配置，优先于 `headerLeftButtonProps`。 */
    headerLeftItems?: NativeSheetStackHeaderLeftItems;
    /** Android/Web Stack Header 右侧 React 内容；iOS 请使用 `headerRightItems`。 */
    headerRight?: NativeSheetStackScreenOptions["headerRight"];
    /**
     * 是否显示内置的右侧关闭按钮。iOS 默认显示；Android/Web 默认不显示。
     * 不影响 `headerRight` 或 iOS 的 `headerRightItems` 等显式自定义内容。
     */
    headerRightButtonVisible?: boolean;
    /**
     * 右侧单按钮便捷配置。iOS 使用原生 item，Android/Web 使用 React Button。
     * 默认按钮用于关闭 Sheet；设置 `closeSheetOnPress: false` 可改为普通操作按钮。
     */
    headerRightButtonProps?: NativeSheetStackHeaderButtonProps;
    /** iOS `unstable_headerRightItems` 的完整透传配置，优先于内置关闭按钮。 */
    headerRightItems?: NativeSheetStackHeaderRightItems;
    screenOptions?: NativeSheetStackScreenOptions;
    sheetProps?: NativeSheetStackSheetProps;
}
export {};
