import type { ReactElement, ReactNode } from "react";
import type { ColorValue, ScrollViewProps, TextStyle, ViewStyle } from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";

import type { SelectProps } from "../select";
import type { ContextMenuProps } from "../context_menu";
import type { DropdownProps } from "../dropdown";
import type { SwitchProps } from "../switch";
import type { InputProps } from "../input";
import type { TextareaProps } from "../textarea";
import type { ColorPickerProps } from "../color_picker";
import type { NativeSheetProps } from "../sheet/native_sheet/types";
import type { NativeHapticsSetting } from "../utils";
import type { NavigationBarScrollEdgeTrackingProps } from "../utils/navigation";
import type { RenderProp } from "../utils/render";

export type NativeListSelectionId = string | number;

/** iOS 26 原生列表行按下反馈策略。 */
export type NativeListIosPressFeedback = "automatic" | "immediate";

/** iOS 原生 SwiftUI List 支持的系统列表样式。 */
export type NativeListIosStyle =
  | "automatic"
  | "plain"
  | "inset"
  | "insetGrouped"
  | "grouped"
  | "sidebar";

/** Basic NativeList 的通用列表样式。 */
export type NativeListBasicStyle = "rounded" | "plain" | "plainFullWidth";

/** Basic NativeList 样式的可选覆盖配置。 */
export type NativeListBasicStyleOptions = {
  /** Section 容器圆角；传入后优先于 listStyle 的圆角规则。 */
  borderRadius?: number;
  /** Section 外框颜色；仅在 showBorder 生效时使用。 */
  borderColor?: ViewStyle["borderColor"];
  /** Section 外框粗细；仅在 showBorder 生效时使用，默认为 hairlineWidth。 */
  borderWidth?: ViewStyle["borderWidth"];
  /** 行分割线颜色；未传时使用主题中性色并自动降低透明度。 */
  dividerColor?: ViewStyle["borderBottomColor"];
  /** 行分割线左侧内缩距离；默认不内缩。 */
  dividerPaddingLeft?: number;
  /** 行分割线右侧内缩距离；默认不内缩。 */
  dividerPaddingRight?: number;
  /** 行分割线粗细；默认 1。 */
  dividerWidth?: number;
  /** Section 阴影；传 `false` 关闭，传 `true` 使用默认阴影，也可传 ViewStyle 自定义。 */
  sectionShadow?: boolean | ViewStyle;
  /** 所有 Basic 行的默认背景色；单行 backgroundColor 优先级更高。 */
  rowBackgroundColor?: ViewStyle["backgroundColor"];
  /** 是否绘制 Section 外框；默认为关闭。 */
  showBorder?: boolean;
  /** 是否显示行分割线；默认开启。 */
  showDivider?: boolean;
};

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
export type NativeListItemBaseProps = NativeListItemPaddingProps &
  NativeListItemIconProps & {
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
    /** disabled 时是否显示禁用视觉；默认继承 NativeList/Section 的设置，最终默认为 true。 */
    disabledStyle?: boolean;
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
    /** NativeList 右侧 Select/Dropdown trigger 的默认字重；Section 或 item 可覆盖。 */
    nativeTriggerFontWeight?: TextStyle["fontWeight"];
    /** iOS 原生 List 用于滚动定位的稳定 id。 */
    nativeScrollId?: string | number;
    onPress?: () => void;
    /** fallback 行的按下背景色；iOS 原生 List 会忽略。 */
    pressBackgroundColor?: ViewStyle["backgroundColor"];
    /** 编辑模式中用于标识这一行；未传时会在当前挂载周期内自动生成。 */
    selectionId?: NativeListSelectionId;
    /**
     * 编辑模式中禁止此行参与多选，并隐藏该行的选择标记。
     * 不影响非编辑模式下的行点击行为。
     */
    selectionDisabled?: boolean;
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

export type NativeListColorPickerItemProps = NativeListItemBaseProps & {
  /** 当前颜色值，支持 color picker 的所有颜色格式。 */
  color: string;
  /** 颜色变化时回调，返回标准化后的 hex 颜色。 */
  onColorChange?: (color: string) => void;
  /** 是否等待点击“完成”后再回写颜色；默认开启。设为 false 时实时回写且隐藏操作按钮。 */
  confirmOnDone?: boolean;
  /** 透传给 color picker 的配置；value 与事件由列表项接管。 */
  colorPickerProps?: Omit<ColorPickerProps, "value">;
  /** 透传给 NativeSheet 的配置；open、detents、children 由列表项接管。 */
  sheetProps?: Omit<
    NativeSheetProps,
    "children" | "content" | "open" | "onOpenChange" | "detents" | "snapPoints"
  >;
  /** picker 内容的估计高度，用于首次打开时选择合适的 detent。 */
  pickerHeight?: number;
};

export type NativeListSelectItemProps = NativeListItemBaseProps & {
  /** iOS Select 打开时是否让 title/subtitle 跟随 trigger 降低透明度；默认开启。 */
  fadeTitleOnOpen?: boolean;
  /** 显式使用 SwiftUI Menu，绕过 iOS hosted React Native trigger 的测量缓存问题；默认关闭。 */
  iosSwiftNativeMenu?: boolean;
  selectProps: Omit<SelectProps, "nativeTrigger">;
};

/** 使用 Dropdown + native trigger 的列表行；Dropdown 本身不维护选中值。 */
export type NativeListDropdownItemProps = NativeListItemBaseProps & {
  /** iOS Dropdown 打开时是否让 title/subtitle 跟随 trigger 降低透明度；默认开启。 */
  fadeTitleOnOpen?: boolean;
  dropdownProps: Omit<
    DropdownProps,
    | "nativeTrigger"
    | "nativeTriggerContainerStyle"
    | "nativeTriggerContent"
    | "nativeTriggerIcon"
    | "nativeTriggerLabelProps"
    | "trigger"
  >;
};

export type NativeListItemProps = NativeListItemBaseProps & {
  title: string | ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  titleAlign?: "center" | "right" | "left";
};

export type NativeListButtonItemProps = NativeListItemProps;

/** 单行输入框；传入 title 或 subtitle 时显示在左侧，输入框显示在右侧。 */
export type NativeListInputItemProps = Omit<
  NativeListItemBaseProps,
  "onPress" | "selected" | "trailing" | "value"
> & {
  /** 带标题时控制右侧输入框容器宽度；未传时使用列表默认宽度。 */
  inputWidth?: ViewStyle["width"];
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
  /** disabled 时是否显示禁用视觉；默认继承 NativeList/Section 的设置，最终默认为 true。 */
  disabledStyle?: boolean;
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
  /**
   * 编辑模式中禁止此行参与多选，并隐藏该行的选择标记。
   * 不影响非编辑模式下的行点击行为。
   */
  selectionDisabled?: boolean;
};

/** 一个占满列表行的多行文本输入框。 */
export type NativeListTextAreaItemProps = Omit<NativeListCustomItemProps, "children"> & {
  /** 传递给 `TextArea` 的属性，例如 `value`、`onChangeText`、`placeholder` 与 `numberOfLines`。 */
  textAreaProps: TextareaProps;
};

/** Section 各 RenderProp 可读取的 NativeList 状态。 */
export type NativeListSectionRenderContext = {
  /** 当前列表是否处于编辑模式。 */
  editMode: boolean;
  /** 当前 Section 解析后的 disabled 样式策略。 */
  disabledStyle: boolean;
  /** 当前 Section 解析后的震动设置。 */
  nativeHaptics?: NativeHapticsSetting;
  /** 当前 Section 解析后的 ContextMenu 配置。 */
  contextMenuProps?: NativeListContextMenuProps;
  /** 查询一行是否已选中。 */
  isSelected: (selectionId: NativeListSelectionId) => boolean;
  /** 切换一行的编辑态选中状态。 */
  toggleSelection: (selectionId: NativeListSelectionId) => void;
  /** 当前平台是否启用了原生编辑态选择控件。 */
  nativeSelectionEnabled: boolean;
};

/** Section props */
export type NativeListSectionProps = {
  children?: ReactNode;
  /** 当前 Section 内所有行的菜单；覆盖 NativeList 配置。传 `false` 可关闭继承菜单。 */
  contextMenuProps?: NativeListContextMenuProps | false;
  /** Section 内 disabled 行是否显示禁用视觉；覆盖 NativeList 设置，默认继承。 */
  disabledStyle?: boolean;
  /** Section 内行默认使用的震动设置；覆盖 NativeList 根节点。 */
  nativeHaptics?: NativeHapticsSetting;
  /** Section 内行默认使用的 NativeList trigger 字重；覆盖 NativeList 根节点。 */
  nativeTriggerFontWeight?: TextStyle["fontWeight"];
  /** Footer RenderProp；需要使用 Hook 时请传入已包裹 Hook 的 React 元素。 */
  footer?: RenderProp<NativeListSectionRenderContext>;
  /** 标题右侧内容的 RenderProp，例如“全部显示”按钮。 */
  trailing?: RenderProp<NativeListSectionRenderContext>;
  /** Section 标题 RenderProp。 */
  title?: RenderProp<NativeListSectionRenderContext>;
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
    /** 原生列表是否在触点按下时立即显示行反馈；iOS 26 默认开启，其他版本默认沿用系统行为。 */
    iosPressFeedback?: NativeListIosPressFeedback;
    /** 所有行默认使用的菜单；Section 或 item 可逐级覆盖。 */
    contextMenuProps?: NativeListContextMenuProps;
    /** 所有 disabled 行是否显示禁用视觉；Section 或 item 可逐级覆盖，默认 true。 */
    disabledStyle?: boolean;
    /** 所有行默认使用的震动设置；Section 或 item 可逐级覆盖。 */
    nativeHaptics?: NativeHapticsSetting;
    /** 所有行默认使用的 NativeList trigger 字重；Section 或 item 可逐级覆盖。 */
    nativeTriggerFontWeight?: TextStyle["fontWeight"];
    /** 原生 List 内容顶部内边距。 */
    contentMarginTop?: number;
    /** 原生 List 内容底部内边距。 */
    contentMarginBottom?: number;
    /**
     * fallback 列表下拉刷新指示器颜色；未传时使用当前主题色。
     * iOS 原生 SwiftUI List 会忽略此项。
     */
    refreshColor?: ColorValue;
    /** 非受控编辑模式初次挂载时默认选中的行。 */
    defaultSelectedIds?: readonly NativeListSelectionId[];
    /** 开启后，所有 NativeList 行显示左侧选择图标并拦截原点击行为。 */
    editMode?: boolean;
    /**
     * 编辑模式中是否仍允许下拉刷新。默认关闭。
     * iOS 原生 List 会直接挂载或解绑稳定的 UIRefreshControl，不会动态增删 refreshable modifier。
     */
    refreshEnabledInEditMode?: boolean;
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
    /**
     * iOS 原生 SwiftUI List 的系统样式。默认 `insetGrouped`。
     * 使用 `plain` 可显示为无分组圆角、横向铺满的列表；fallback、Android 与 Web 忽略此项。
     */
    iosListStyle?: NativeListIosStyle;
    /** Basic List 样式。默认 `rounded`；iOS 原生 List 忽略此项。 */
    listStyle?: NativeListBasicStyle;
    /** Basic List 样式覆盖配置；iOS 原生 List 忽略此项。 */
    listStyleOptions?: NativeListBasicStyleOptions;
    /**
     * iOS 原生 List 空白区域被点按时收起当前键盘。
     * 默认关闭，避免改变已有页面的原生 List 点按语义。
     */
    dismissKeyboardOnTap?: boolean;
    /**
     * 是否使用平台原生列表。iOS 默认 true；其他平台默认 false。
     * 其他平台显式传 true 时使用 Basic 实现；iOS 才会启用 SwiftUI 原生列表。
     */
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
