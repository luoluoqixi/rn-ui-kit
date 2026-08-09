import type { ReactElement, ReactNode } from "react";
import type { ScrollViewProps, ViewStyle } from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";
import type { SelectProps } from "../select";
import type { MenuProps } from "../menu";
import type { ContextMenuProps } from "../context_menu";
import type { SwitchProps } from "../switch";
import type { InputProps } from "../input";
import type { TextAreaProps } from "../text_area";
import type { NativeHapticsSetting } from "../utils";
import type { NavigationBarScrollEdgeTrackingProps } from "../utils/navigation";
import type { NativeListSectionContent } from "./section_content";
export type { NativeListSectionContent } from "./section_content";
export type NativeListSelectionId = string | number;
/**
 * NativeList 行使用的 ContextMenu 配置。trigger 由列表行自身提供；其余 ContextMenu
 * props（包括 `items`、自定义 children、`contentProps`、`itemProps` 与事件）均可直接传入。
 */
export type NativeListContextMenuProps = Omit<ContextMenuProps, "trigger">;
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
export type NativeListItemBaseProps = NativeListItemPaddingProps & NativeListItemIconProps & {
    /** fallback 行的常态背景色；iOS 原生 List 会忽略。 */
    backgroundColor?: ViewStyle["backgroundColor"];
    /** `true` 或不传时沿用默认主色，传字符串时使用自定义 tint，传 `false` 时不传 tint。 */
    btnTint?: boolean | string;
    chevron?: boolean;
    /** 行尾 chevron 的颜色；未指定时使用平台默认辅助色。 */
    chevronColor?: string;
    /** 当前行的菜单；覆盖 Section 与 NativeList 上的配置。传 `false` 可关闭继承菜单。 */
    contextMenuProps?: NativeListContextMenuProps | false;
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
    /** 编辑模式中用于标识这一行；未传时会在当前挂载周期内自动生成。 */
    selectionId?: NativeListSelectionId;
    selected?: boolean;
    subtitle?: ReactNode;
    subtitleColor?: string;
    subtitleFontSize?: number;
    /** 行尾自定义内容。iOS 原生模式会自动承载 React Native 节点。 */
    trailing?: ReactNode;
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
    /** iOS dropdown 打开时是否让 title/subtitle 跟随 trigger 降低透明度；默认开启，wheel 模式忽略。 */
    fadeTitleOnOpen?: boolean;
    selectProps: Omit<SelectProps, "nativeTrigger">;
};
/** 使用 `Menu` + native trigger 的列表行；Menu 本身不维护选中值。 */
export type NativeListMenuItemProps = NativeListItemBaseProps & {
    /** iOS Menu 打开时是否让 title/subtitle 跟随 trigger 降低透明度；默认开启。 */
    fadeTitleOnOpen?: boolean;
    menuProps: Omit<MenuProps, "nativeTrigger" | "nativeTriggerContainerStyle" | "nativeTriggerContent" | "nativeTriggerIcon" | "nativeTriggerLabel" | "nativeTriggerLabelProps" | "trigger">;
};
export type NativeListItemProps = NativeListItemBaseProps & {
    title: string | ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    titleAlign?: "center" | "right" | "left";
};
export type NativeListButtonItemProps = NativeListItemProps;
/** 单行输入框；传入 title 或 subtitle 时显示在左侧，输入框显示在右侧。 */
export type NativeListInputItemProps = Omit<NativeListItemBaseProps, "onPress" | "selected" | "trailing" | "value"> & {
    /** 传递给 `Input` 的属性，例如 `value`、`onChangeText`、`placeholder` 与 `autoFocus`。 */
    inputProps: InputProps;
};
export type NativeListCustomItemProps = NativeListItemPaddingProps & {
    /** fallback 行的常态背景色；iOS 原生 List 会忽略。 */
    backgroundColor?: ViewStyle["backgroundColor"];
    children?: ReactNode;
    /** 当前行的菜单；覆盖 Section 与 NativeList 上的配置。传 `false` 可关闭继承菜单。 */
    contextMenuProps?: NativeListContextMenuProps | false;
    disabled?: boolean;
    /** fallback 行的 hover 背景色；iOS 原生 List 会忽略。 */
    hoverBackgroundColor?: ViewStyle["backgroundColor"];
    nativeHaptics?: NativeHapticsSetting;
    /** iOS 原生 List 用于滚动定位的稳定 id。 */
    nativeScrollId?: string | number;
    onPress?: () => void;
    /** fallback 行的按下背景色；iOS 原生 List 会忽略。 */
    pressBackgroundColor?: ViewStyle["backgroundColor"];
    /** 编辑模式中用于标识这一行；未传时会在当前挂载周期内自动生成。 */
    selectionId?: NativeListSelectionId;
};
/** 一个占满列表行的多行文本输入框。 */
export type NativeListTextAreaItemProps = Omit<NativeListCustomItemProps, "children"> & {
    /** 传递给 `TextArea` 的属性，例如 `value`、`onChangeText`、`placeholder` 与 `numberOfLines`。 */
    textAreaProps: TextAreaProps;
};
/** Section props */
export type NativeListSectionProps = {
    children?: ReactNode;
    /** 当前 Section 内所有行的菜单；覆盖 NativeList 配置。传 `false` 可关闭继承菜单。 */
    contextMenuProps?: NativeListContextMenuProps | false;
    /** Footer 内容；也可传入无参数函数组件。 */
    footer?: NativeListSectionContent;
    /** 显示在分组标题右侧的内容，例如“全部显示”按钮；也可传入无参数函数组件。 */
    trailing?: NativeListSectionContent;
    /** Section 标题；也可传入无参数函数组件。 */
    title?: NativeListSectionContent;
    /** Section 标题文本颜色；复杂 ReactNode 标题请直接在节点上设置样式。 */
    titleColor?: string;
    /** Section 标题字体大小；复杂 ReactNode 标题请直接在节点上设置样式。 */
    titleFontSize?: number;
};
/** NativeList Root props */
export type NativeListRootProps = Omit<ScrollViewProps, "children"> & NavigationBarScrollEdgeTrackingProps & {
    /** 列表宿主背景色：iOS 原生 List 直接作用于 List，自定义 fallback 作用于根容器。 */
    backgroundColor?: ViewStyle["backgroundColor"];
    children?: ReactNode;
    /** 所有行默认使用的菜单；Section 或 item 可逐级覆盖。 */
    contextMenuProps?: NativeListContextMenuProps;
    /** 原生 List 内容顶部内边距。 */
    contentMarginTop?: number;
    /** 原生 List 内容底部内边距。 */
    contentMarginBottom?: number;
    /** 非受控编辑模式初次挂载时默认选中的行。 */
    defaultSelectedIds?: readonly NativeListSelectionId[];
    /** 开启后，所有 NativeList 行显示左侧选择图标并拦截原点击行为。 */
    editMode?: boolean;
    /**
     * 编辑模式未选中时的自定义 React Native 图标；Android、Web 与 fallback 使用。
     * iOS 原生 List 使用系统选择标记，因此会忽略此项。
     */
    editModeIcon?: ReactElement;
    /** 编辑模式已选中时的自定义 React Native 图标；iOS 原生 List 会忽略。 */
    editModeSelectedIcon?: ReactElement;
    /** 预留给 iOS 原生编辑图标配置；当前 iOS 原生 List 会忽略。 */
    editModeSfSymbol?: SFSymbol;
    /** 预留给 iOS 原生编辑图标配置；当前 iOS 原生 List 会忽略。 */
    editModeSelectedSfSymbol?: SFSymbol;
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
    /** 编辑模式选中项变化时触发。 */
    onSelectedIdsChange?: (selectedIds: NativeListSelectionId[]) => void;
    /** 设为 false 时不创建内部 ScrollView，由外层宿主负责滚动。 */
    scrollable?: boolean;
    /** 受控的编辑模式选中项。 */
    selectedIds?: readonly NativeListSelectionId[];
    /** web 自动还原 scroll */
    webAutoRestoreScroll?: boolean | undefined;
};
