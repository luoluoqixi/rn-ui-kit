import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Text } from "../text";
import { cn } from "../utils/cn";
import { useUiTheme } from "../utils/theme";
import {
  NATIVE_TRIGGER_DISABLE_OPACITY,
  NATIVE_TRIGGER_LABEL_OPACITY,
  NATIVE_TRIGGER_PRESS_OPACITY,
  NATIVE_TRIGGER_WEB_HOVER_OPACITY,
  NATIVE_TRIGGER_WEB_PRESS_OPACITY,
} from "./constants";

import type { TextProps } from "../text";
import {
  NativeTriggerFaceProps,
  NativeTriggerIcon,
  NativeTriggerProps,
  TriggerIconColor,
} from "./types";

function renderTriggerLabel(label: React.ReactNode, labelProps?: TextProps) {
  const { color, opacity, style, ...textProps } = (labelProps ?? {}) as TextProps & {
    color?: string;
    opacity?: number;
  };

  if (typeof label === "string" || typeof label === "number") {
    return (
      <Text
        style={[
          {
            color,
            fontSize: 16,
            opacity: opacity ?? NATIVE_TRIGGER_LABEL_OPACITY,
          },
          style,
        ]}
        {...textProps}
      >
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

export const NativeTriggerFace = React.forwardRef<View, NativeTriggerFaceProps>(
  function NativeTriggerFace(
    {
      content,
      containerStyle,
      icon = "stacked",
      iconColor: iconColorProp,
      labelProps,
      label,
      opacity = 1,
    },
    forwardedRef,
  ) {
    const theme = useUiTheme();
    if (content != null) {
      return (
        <View ref={forwardedRef} pointerEvents="none" style={[styles.customContent, { opacity }]}>
          {content}
        </View>
      );
    }

    const iconColor: TriggerIconColor = iconColorProp ?? theme.foreground;
    // 图标跟随显式设置的文字透明度，避免文字已经恢复为 1 时右侧箭头仍然偏淡。
    const configuredLabelOpacity = (labelProps as (TextProps & { opacity?: number }) | undefined)
      ?.opacity;
    const iconOpacity =
      typeof configuredLabelOpacity === "number"
        ? configuredLabelOpacity
        : NATIVE_TRIGGER_LABEL_OPACITY;

    return (
      <View
        ref={forwardedRef}
        pointerEvents="none"
        style={{ alignSelf: "center", flexGrow: 0, flexShrink: 0, opacity, width: "auto" }}
      >
        <View style={[styles.defaultTrigger, containerStyle]}>
          {renderTriggerLabel(label, labelProps)}
          <View style={{ opacity: iconOpacity }}>{renderTriggerIcon(icon, iconColor)}</View>
        </View>
      </View>
    );
  },
);

export const NativeTrigger = React.forwardRef<View, NativeTriggerProps>(
  (
    {
      active = false,
      content,
      containerStyle,
      disabled,
      feedbackOpacity,
      icon,
      iconColor,
      keepPressedOpacity = false,
      labelProps,
      label,
      onPressIn,
      onLongPress,
      onPressOut,
      pressedOpacity = true,
      style,
      className,
      onHoverIn,
      onHoverOut,
      ...pressableProps
    },
    forwardedRef,
  ) => {
    const [stickyPressed, setStickyPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const hasCursorOverride = className?.split(/\s+/).some((token) => token.startsWith("cursor-"));
    const wasActiveRef = React.useRef(active);
    const disabledOpacity = feedbackOpacity?.disabled ?? NATIVE_TRIGGER_DISABLE_OPACITY;
    const pressOpacity = feedbackOpacity?.press ?? NATIVE_TRIGGER_PRESS_OPACITY;
    const webHoverOpacity = feedbackOpacity?.webHover ?? NATIVE_TRIGGER_WEB_HOVER_OPACITY;
    const webPressOpacity = feedbackOpacity?.webPress ?? NATIVE_TRIGGER_WEB_PRESS_OPACITY;
    const resolvedPressableProps = {
      ...(pressableProps as any),
      onContextMenu: (event: any) => {
        event.stopPropagation?.();
        (pressableProps as any).onContextMenu?.(event);
      },
    };

    React.useEffect(() => {
      if (active) {
        wasActiveRef.current = true;
        return;
      }

      if (wasActiveRef.current) {
        wasActiveRef.current = false;
        setStickyPressed(false);
      }
    }, [active]);

    return (
      <Pressable
        ref={forwardedRef}
        {...(resolvedPressableProps as any)}
        className={cn(Platform.OS === "web" && "cursor-default", className)}
        disabled={disabled}
        onHoverIn={(event) => {
          setHovered(true);
          onHoverIn?.(event);
        }}
        onHoverOut={(event) => {
          setHovered(false);
          onHoverOut?.(event);
        }}
        onPress={(event) => {
          // A NativeTrigger may be hosted inside a NativeList row. Its click
          // must not bubble into the row, otherwise both the trigger and the
          // row call present/open and iOS reports an already-visible menu.
          event.stopPropagation?.();
          (pressableProps as any).onPress?.(event);
        }}
        onPressIn={(event) => {
          if (keepPressedOpacity) {
            setStickyPressed(true);
          }

          onPressIn?.(event);
        }}
        onLongPress={(event) => {
          // NativeList 行可能托管 ContextMenu；直接交互的 trigger 不应
          // 将长按继续冒泡成行级菜单。
          event.stopPropagation?.();
          onLongPress?.(event);
        }}
        onPressOut={(event) => {
          onPressOut?.(event);

          if (!keepPressedOpacity || active || wasActiveRef.current) {
            return;
          }

          setStickyPressed(false);
        }}
        style={(state) => [
          content != null ? styles.customTrigger : undefined,
          Platform.OS === "web"
            ? [
                hasCursorOverride ? undefined : ({ cursor: "default" } as any),
                disabled
                  ? { opacity: disabledOpacity }
                  : active || stickyPressed || (pressedOpacity && state.pressed)
                    ? { opacity: webPressOpacity }
                    : hovered
                      ? { opacity: webHoverOpacity }
                      : undefined,
              ]
            : {
                opacity: disabled
                  ? disabledOpacity
                  : active || stickyPressed || (pressedOpacity && state.pressed)
                    ? pressOpacity
                    : 1,
              },
          typeof style === "function" ? style(state) : style,
        ]}
      >
        <NativeTriggerFace
          content={content}
          containerStyle={containerStyle}
          icon={icon}
          iconColor={iconColor}
          label={label}
          labelProps={labelProps}
        />
      </Pressable>
    );
  },
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
    alignSelf: "flex-start",
    flexDirection: "row",
    flexGrow: 0,
    gap: 4,
    justifyContent: "center",
    minHeight: 36,
    flexShrink: 0,
    width: "auto",
    paddingHorizontal: 4,
  },
});
