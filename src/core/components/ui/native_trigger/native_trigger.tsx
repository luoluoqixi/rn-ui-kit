import { ChevronDown, ChevronUp, ChevronsUpDown } from "@tamagui/lucide-icons-2";
import React from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { Text, getFontSize } from "tamagui";

import type { TextProps } from "../text";

export type NativeTriggerIcon = "stacked" | "chevrons-up-down" | "none";

type TriggerIconColor = React.ComponentProps<typeof ChevronDown>["color"];

function renderTriggerLabel(label: React.ReactNode, labelProps?: TextProps) {
  const resolvedOpacity = typeof labelProps?.opacity === "number" ? labelProps.opacity : 0.58;

  if (typeof label === "string" || typeof label === "number") {
    return (
      <Text color="$color" fontSize={getFontSize("$4")} opacity={resolvedOpacity} {...labelProps}>
        {label}
      </Text>
    );
  }

  return label;
}

function renderTriggerIcon(icon: NativeTriggerIcon, color: TriggerIconColor) {
  if (icon === "none") {
    return null;
  }

  if (icon === "chevrons-up-down") {
    return <ChevronsUpDown color={color} size={14} />;
  }

  return (
    <View style={styles.chevronColumn}>
      <ChevronUp color={color} size={10} />
      <ChevronDown color={color} size={10} />
    </View>
  );
}

/** 通用原生风格 trigger 的纯视觉部分，用于组合到已有的点击容器中。 */
export type NativeTriggerFaceProps = {
  /** 完全替换默认 label 与图标结构的内容。 */
  content?: React.ReactNode;
  /** 默认 trigger 内容容器的样式。 */
  containerStyle?: StyleProp<ViewStyle>;
  /** 右侧图标样式。 */
  icon?: NativeTriggerIcon;
  /** 默认 label 的文本属性。 */
  labelProps?: TextProps;
  /** 要显示的 label。 */
  label: React.ReactNode;
  /** 整个 trigger 的不透明度。 */
  opacity?: number;
};

export function NativeTriggerFace({
  content,
  containerStyle,
  icon = "stacked",
  labelProps,
  label,
  opacity = 1,
}: NativeTriggerFaceProps) {
  if (content != null) {
    return (
      <View pointerEvents="none" style={[styles.customContent, { opacity }]}>
        {content}
      </View>
    );
  }

  const iconColor: TriggerIconColor =
    typeof labelProps?.color === "string" ? (labelProps.color as TriggerIconColor) : "$color";
  const iconOpacity = typeof labelProps?.opacity === "number" ? labelProps.opacity : 0.58;

  return (
    <View pointerEvents="none" style={{ opacity }}>
      <View style={[styles.defaultTrigger, containerStyle]}>
        {renderTriggerLabel(label, labelProps)}
        <View style={{ opacity: iconOpacity }}>{renderTriggerIcon(icon, iconColor)}</View>
      </View>
    </View>
  );
}

/**
 * 带默认按压反馈的通用原生风格 trigger。
 *
 * 除 `children` 外，全部 React Native `Pressable` props 都可直接传入；未传时保留默认布局和按压反馈。
 */
export type NativeTriggerProps = Omit<NativeTriggerFaceProps, "opacity"> &
  Omit<PressableProps, "children">;

export const NativeTrigger = React.forwardRef<View, NativeTriggerProps>(
  (
    { content, containerStyle, icon, labelProps, label, style, ...pressableProps },
    forwardedRef,
  ) => (
    <Pressable
      ref={forwardedRef}
      {...pressableProps}
      style={(state) => [
        content != null ? styles.customTrigger : undefined,
        { opacity: state.pressed ? 0.6 : 1 },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <NativeTriggerFace
        content={content}
        containerStyle={containerStyle}
        icon={icon}
        label={label}
        labelProps={labelProps}
      />
    </Pressable>
  ),
);

/** `NativeTrigger` 的兼容别名。 */
export const NativeTriggerPressable = NativeTrigger;
export type NativeTriggerPressableProps = NativeTriggerProps;

const styles = StyleSheet.create({
  chevronColumn: {
    alignItems: "center",
    justifyContent: "center",
  },
  customContent: {
    alignSelf: "stretch",
    width: "100%",
  },
  customTrigger: {
    alignSelf: "stretch",
    width: "100%",
  },
  defaultTrigger: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 180,
  },
});
