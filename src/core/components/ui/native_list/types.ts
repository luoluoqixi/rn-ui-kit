import type { ReactElement, ReactNode } from "react";
import type { ScrollViewProps, ViewStyle } from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";

import type { SelectProps } from "../select";
import type { SwitchProps } from "../switch";
import type { NativeHapticsSetting } from "../utils";
import type { NavigationBarScrollEdgeTrackingProps } from "../utils/navigation";

export type NativeListItemPaddingProps = {
  paddingBottom?: number;
  paddingHorizontal?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingVertical?: number;
};

export type NativeListItemIconProps = {
  /** 自定义 React Native 行首图标；fallback、Android 与 Web 使用。 */
  icon?: ReactElement;
  /**
   * iOS 原生列表使用的 SF Symbol `systemName`。
   * 同时传入 `icon` 时，iOS 原生模式使用 `sfSymbol`，其他模式使用 `icon`。
   */
  sfSymbol?: SFSymbol;
};

/** 通用 item base props */
export type NativeListItemBaseProps = NativeListItemPaddingProps &
  NativeListItemIconProps & {
    /** fallback 行的常态背景色；iOS 原生 List 会忽略。 */
    backgroundColor?: ViewStyle["backgroundColor"];
    /** `true` 或不传时沿用默认主色，传字符串时使用自定义 tint，传 `false` 时不传 tint。 */
    btnTint?: boolean | string;
    chevron?: boolean;
    /** 行尾 chevron 的颜色；未指定时使用平台默认辅助色。 */
    chevronColor?: string;
    disabled?: boolean;
    /** fallback 行的 hover 背景色；iOS 原生 List 会忽略。 */
    hoverBackgroundColor?: ViewStyle["backgroundColor"];
    /** `sfSymbol` 的颜色；自定义 `icon` 需由调用方自行设置颜色。 */
    iconColor?: string;
    /** `sfSymbol` 的尺寸；自定义 `icon` 需由调用方自行设置尺寸。 */
    iconSize?: number;
    /**
     * 行首图标列的宽度。iOS 原生 `sfSymbol` 默认取
     * `Math.max(24, iconSize ?? 20)`；fallback 自定义 `icon` 未指定时保持自身宽度。
     * 多行可统一设置此值以保持标题左边缘对齐。
     */
    iconSlotWidth?: number;
    nativeHaptics?: NativeHapticsSetting;
    /** iOS 原生 List 用于滚动定位的稳定 id。 */
    nativeScrollId?: string | number;
    onPress?: () => void;
    /** fallback 行的按下背景色；iOS 原生 List 会忽略。 */
    pressBackgroundColor?: ViewStyle["backgroundColor"];
    selected?: boolean;
    subtitle?: ReactNode;
    subtitleColor?: string;
    subtitleFontSize?: number;
    title?: ReactNode;
    titleAlign?: "center" | "right" | "left";
    titleColor?: string;
    titleFontSize?: number;
    value?: ReactNode;
    valueColor?: string;
    valueFontSize?: number;
  };

export type NativeListActionItemProps = NativeListItemBaseProps;
export type NativeListNavigationItemProps = NativeListItemBaseProps;

export type NativeListSwitchItemProps = NativeListItemBaseProps & {
  switchProps: Omit<SwitchProps, "label" | "native">;
};

export type NativeListSelectItemProps = NativeListItemBaseProps & {
  selectProps: Omit<SelectProps, "nativeTrigger">;
};

export type NativeListItemProps = NativeListItemBaseProps & {
  title: string | ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  titleAlign?: "center" | "right" | "left";
};

export type NativeListButtonItemProps = NativeListItemProps;

export type NativeListCustomItemProps = NativeListItemPaddingProps & {
  /** fallback 行的常态背景色；iOS 原生 List 会忽略。 */
  backgroundColor?: ViewStyle["backgroundColor"];
  children?: ReactNode;
  disabled?: boolean;
  /** fallback 行的 hover 背景色；iOS 原生 List 会忽略。 */
  hoverBackgroundColor?: ViewStyle["backgroundColor"];
  nativeHaptics?: NativeHapticsSetting;
  onPress?: () => void;
  /** fallback 行的按下背景色；iOS 原生 List 会忽略。 */
  pressBackgroundColor?: ViewStyle["backgroundColor"];
};

/** Section props */
export type NativeListSectionProps = {
  children?: ReactNode;
  footer?: ReactNode;
  title?: ReactNode;
  /** Section 标题文本颜色；复杂 ReactNode 标题请直接在节点上设置样式。 */
  titleColor?: string;
  /** Section 标题字体大小；复杂 ReactNode 标题请直接在节点上设置样式。 */
  titleFontSize?: number;
};

/** NativeList Root props */
export type NativeListRootProps = Omit<ScrollViewProps, "children"> &
  NavigationBarScrollEdgeTrackingProps & {
    /** 列表宿主背景色：iOS 原生 List 直接作用于 List，自定义 fallback 作用于根容器。 */
    backgroundColor?: ViewStyle["backgroundColor"];
    children?: ReactNode;
    /** 原生 List 内容顶部内边距。 */
    contentMarginTop?: number;
    /** 原生 List 内容底部内边距。 */
    contentMarginBottom?: number;
    /**
     * 修正 iOS 26+ 在外层 ScrollView 中嵌套原生 List 时错误缓存窗口底部安全区，
     * 导致内部滚动条提前结束的问题。默认关闭；非 iOS 26+ 平台会被忽略。
     */
    fixesIOS26NestedScrollIndicatorSafeArea?: boolean;
    /** iOS 原生 List 初次挂载后滚动到的目标 id。 */
    initialScrollTarget?: string | number;
    /** 设为 false 时使用 list_group 回退模式（所有平台一致） */
    native?: boolean;
    /**
     * 下拉刷新回调。返回 Promise 时，刷新指示器会保持到 Promise settled。
     * TrueSheet Android 的静态 ScrollView 回退分支不支持此参数。
     */
    onRefresh?: () => Promise<void> | void;
    /** 设为 false 时不创建内部 ScrollView，由外层宿主负责滚动。 */
    scrollable?: boolean;
  };
