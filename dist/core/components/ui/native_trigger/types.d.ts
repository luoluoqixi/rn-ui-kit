import type { ChevronDown } from "lucide-react-native";
import type { TextProps } from "../text";
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from "react-native";
export type NativeTriggerIcon = "stacked" | "chevrons-up-down" | "none";
export type NativeTriggerSize = "default" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type TriggerIconColor = React.ComponentProps<typeof ChevronDown>["color"];
/**
 * 带默认按压反馈的通用原生风格 trigger。
 *
 * 除 `children` 外，全部 React Native `Pressable` props 都可直接传入；未传时保留默认布局和按压反馈。
 */
export type NativeTriggerProps = Omit<NativeTriggerFaceProps, "opacity"> & Omit<PressableProps, "children"> & {
    /** 关联的菜单或选择器打开时，保持按压态透明度。 */
    active?: boolean;
    /** 是否在按住时显示透明度反馈；原生菜单可关闭以避免与打开事件竞争。 */
    pressedOpacity?: boolean;
    /** 按下后保持透明度，直到关联菜单关闭。 */
    keepPressedOpacity?: boolean;
    /** 覆盖默认的禁用、按下与 Web hover 反馈透明度。 */
    feedbackOpacity?: NativeTriggerFeedbackOpacity;
};
export type NativeTriggerFeedbackOpacity = {
    disabled?: number;
    press?: number;
    webHover?: number;
    webPress?: number;
};
/** 通用原生风格 trigger 的纯视觉部分，用于组合到已有的点击容器中。 */
export type NativeTriggerFaceProps = {
    /** 完全替换默认 label 与图标结构的内容。 */
    content?: React.ReactNode;
    /** 默认 trigger 内容容器的样式。 */
    containerStyle?: StyleProp<ViewStyle>;
    /** 右侧图标样式。 */
    icon?: NativeTriggerIcon;
    /** 右侧上下箭头的颜色；未指定时跟随主题前景色。 */
    iconColor?: TriggerIconColor;
    /** 默认 label 的文本属性。 */
    labelProps?: TextProps & {
        opacity?: number;
    };
    /** 默认 label 的字重；未指定时使用 `500`。 */
    fontWeight?: TextStyle["fontWeight"];
    /** 要显示的 label。 */
    label: React.ReactNode;
    /** Standard trigger size. Defaults to `default` (`md`). */
    size?: NativeTriggerSize;
    /** 整个 trigger 的不透明度。 */
    opacity?: number;
};
