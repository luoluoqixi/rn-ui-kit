import type { GlassColorScheme, GlassContainerProps, GlassEffectStyleConfig, GlassStyle, GlassViewProps } from "expo-glass-effect";
import type { ComponentType, ReactNode, RefObject } from "react";
import type { StyleProp, TextInput, TextInputProps, TextStyle, ViewStyle } from "react-native";
import type { ButtonProps } from "../button";
export type GlassEffectKeyboardAvoidance = boolean | {
    /** 是否启用键盘跟随。默认启用。 */
    enabled?: boolean;
    /** 在键盘顶部额外保留的距离，正值会继续向上移动。默认 0。 */
    offset?: number;
    /** 是否扣除底部安全区，适合已经按 safe-area 定位的底部工具栏。默认 true。 */
    subtractSafeAreaInset?: boolean;
};
export type GlassEffectKeyboardHiddenConfirmation = {
    /** 认为键盘已隐藏的最大高度。默认 10。 */
    heightThreshold?: number;
    /** 键盘高度满足阈值后，连续确认的渲染帧数。默认 3。 */
    consecutiveFrames?: number;
    /** 确认隐藏后显示高度的最终值；仅负值有效，默认 0。 */
    finalHeight?: number;
};
/** `expo-glass-effect` GlassView 的完整属性，包含任意 React Native children。 */
export type GlassEffectProps = GlassViewProps & {
    /** 让整个 GlassEffect 在 UI 线程逐帧跟随软键盘高度。 */
    keyboardAvoidance?: GlassEffectKeyboardAvoidance;
    /** `keyboardWillHide` 后确认键盘已完全隐藏的阈值与连续帧数。 */
    keyboardHiddenConfirmation?: GlassEffectKeyboardHiddenConfirmation;
    /**
     * 键盘在非导航手势中完成隐藏时调用。
     * 适合关闭键盘上方工具栏；工具栏的打开状态应由输入框自身的 focus 管理。
     */
    onKeyboardHidden?: () => void;
};
export type GlassEffectSearchBarTrailingContext = {
    /** 当前输入框是否聚焦。 */
    focused: boolean;
    /** 清空输入、收起键盘并关闭搜索状态。 */
    cancel: () => void;
    /** 内部 TextInput 引用，可用于自定义按钮触发 focus 或 blur。 */
    inputRef: RefObject<TextInput | null>;
};
/** 搜索栏右侧插槽，可以是 ReactNode、接收状态的函数组件或 false。 */
export type GlassEffectSearchBarTrailing = ReactNode | ComponentType<GlassEffectSearchBarTrailingContext> | false;
/** 默认关闭按钮允许覆盖的本库 `Button` 属性。 */
export type GlassEffectSearchBarCancelButtonProps = Omit<ButtonProps, "aria-label" | "children" | "native" | "nativeButtonStyle" | "nativeSystemImage" | "onPress">;
/**
 * 固定在页面上的 Liquid Glass 搜索栏。
 *
 * 默认未聚焦时搜索栏占满容器宽度；输入框获取焦点后才显示取消按钮并收缩搜索栏。
 */
export type GlassEffectSearchBarProps = Omit<GlassEffectProps, "children" | "style"> & {
    /** 外层容器样式，通常用于 absolute 定位与宽度。 */
    style?: StyleProp<ViewStyle>;
    /** 搜索 GlassView 的样式，例如圆角或降级平台的背景色。 */
    searchStyle?: StyleProp<ViewStyle>;
    /** 透传给内部 React Native TextInput 的属性。 */
    inputProps?: TextInputProps;
    /** 输入框附加样式。 */
    inputStyle?: StyleProp<TextStyle>;
    /** 搜索图标，未传时使用默认放大镜图标。 */
    searchIcon?: ReactNode;
    /** 默认搜索图标颜色。 */
    searchIconColor?: string;
    /** 输入框文字颜色。 */
    inputColor?: string;
    /** 占位文字颜色。 */
    placeholderTextColor?: string;
    /** 占位文字，默认“搜索”。 */
    placeholder?: string;
    /** 控制聚焦状态；不传时由组件根据 TextInput 焦点维护。 */
    focused?: boolean;
    /** 聚焦状态变化回调。 */
    onFocusChange?: (focused: boolean) => void;
    /** 未聚焦时的右侧内容；默认不渲染。传 false 可显式保持为空。 */
    unfocusedTrailing?: GlassEffectSearchBarTrailing;
    /** 聚焦时的右侧内容；默认渲染关闭按钮。传 false 可关闭默认按钮。 */
    focusedTrailing?: GlassEffectSearchBarTrailing;
    /** 取消按钮的辅助功能标签。 */
    cancelButtonAccessibilityLabel?: string;
    /** 取消按钮外层样式。 */
    cancelButtonContainerStyle?: StyleProp<ViewStyle>;
    /** iOS 26+ 默认关闭按钮的原生 SwiftUI buttonStyle。默认 glass。 */
    cancelButtonStyle?: ButtonProps["nativeButtonStyle"];
    /** 默认关闭按钮的其余 Button 属性；native 与 onPress 由搜索栏控制。 */
    cancelButtonProps?: GlassEffectSearchBarCancelButtonProps;
    /** 点击取消按钮时调用。 */
    onCancel?: () => void;
    /** 点击取消按钮时是否通过 inputProps.onChangeText 清空内容。默认 true。 */
    clearOnCancel?: boolean;
    /** 点击取消按钮时是否收起键盘。默认 true。 */
    dismissKeyboardOnCancel?: boolean;
};
/** `expo-glass-effect` GlassContainer 的完整属性。 */
export type GlassEffectContainerProps = GlassContainerProps;
export type { GlassColorScheme, GlassEffectStyleConfig, GlassStyle };
