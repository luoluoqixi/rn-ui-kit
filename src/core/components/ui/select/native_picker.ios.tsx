/* eslint-disable no-spaced-func */
// Select iOS 原生 Picker 组件
import { Picker as RNPPicker } from "@react-native-picker/picker";
import { useTheme } from "@tamagui/core";
import { Check, ChevronDown } from "@tamagui/lucide-icons-2";
import { useCallback } from "react";
import React from "react";
import {
  Platform,
  type PressableProps,
  type StyleProp,
  View,
  type ViewStyle,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListItem as TamaguiListItem, XStack } from "tamagui";

import { Button } from "../button";
import { Menu } from "../menu";
import { NativeTriggerPressable } from "../native_trigger";
import { dismissTrueSheet, presentTrueSheet } from "../sheet/native_sheet/true_sheet";
import {
  TrueSheetInnerStack,
  TrueSheetStackHost,
  trueSheetInnerStackScreenOptions,
} from "../sheet/native_sheet/true_sheet/stack";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import type { ResolvedColorScheme } from "../utils/theme";

import type { TextProps } from "../text";
import type { ResolvedSelectItemData } from "./select_grouping";
import type {
  SelectNativeDropdownAlign,
  SelectNativeTriggerIcon,
} from "./types";

/** 用于为每个 wheel sheet 实例生成唯一名称的计数器 */
let wheelSheetCounter = 0;

/** wheel sheet 默认 detent 配置（iOS 16+ 有效，iOS < 16 降级为 mediumDetent） */
const WHEEL_SHEET_DETENT_DEFAULT = 0.3;
const DEFAULT_TRIGGER_HOVER_STYLE = { background: "$color3" } as const;
const DEFAULT_TRIGGER_PRESS_STYLE = { background: "$color4" } as const;
const NATIVE_PICKER_TRIGGER_SWATCH_SIZE = 14;

function renderNativePickerDefaultTriggerLabel(
  label: React.ReactNode,
  placeholder: boolean,
  swatchColor?: string,
) {
  const text = (
    <TamaguiListItem.Text color="$color" opacity={placeholder ? 0.58 : 1}>
      {label}
    </TamaguiListItem.Text>
  );

  if (swatchColor == null) {
    return text;
  }

  return (
    <XStack flex={1} items="center">
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          backgroundColor: swatchColor,
          borderRadius: NATIVE_PICKER_TRIGGER_SWATCH_SIZE / 2,
          height: NATIVE_PICKER_TRIGGER_SWATCH_SIZE,
          marginRight: 12,
          width: NATIVE_PICKER_TRIGGER_SWATCH_SIZE,
        }}
      />
      {text}
    </XStack>
  );
}

/** wheel 模式共享的 TrueSheet 弹出层 */
function WheelTrueSheet({
  items,
  title,
  sheetName,
  pendingValue,
  setPendingValue,
  onCancel,
  onDone,
}: {
  items: ResolvedSelectItemData[];
  title: string;
  sheetName: string;
  pendingValue: string;
  setPendingValue: (v: string) => void;
  onCancel: () => void;
  onDone: () => void;
}) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const iOSVersion = parseInt(Platform.Version as string, 10);

  /** iOS < 16 不支持自定义 fraction detent，sheet 实际为 mediumDetent（~50%），
   *  内容区域偏大，需更多顶部偏移让 Picker 垂直居中 */
  const topPadding = iOSVersion < 16 ? Math.max(insets.top, 90) : Math.max(insets.top, 28);

  return (
    <TrueSheetStackHost
      name={sheetName}
      initialRouteName="picker"
      onRequestClose={onCancel}
      sheetProps={{ detents: [WHEEL_SHEET_DETENT_DEFAULT], dismissible: true }}
      screenOptions={{
        ...trueSheetInnerStackScreenOptions(
          (colorScheme ?? "light") as ResolvedColorScheme,
          undefined,
          theme.color10.val,
          theme.gray12.val,
        ),
        title,
        headerLeft: () => <Button native onPress={onCancel} title="关闭" />,
        headerRight: () => <Button native onPress={onDone} title="完成" />,
      }}
    >
      <TrueSheetInnerStack.Screen name="picker">
        {() => (
          <View style={{ paddingTop: topPadding, flex: 1 }}>
            {/**
             * 连续点击 Wheel 10 次左右会导致闪退, 未解决的问题
             * 使用 ui/patches/@react-native-picker+picker@2.11.4.patch 修复
             * https://github.com/react-native-picker/picker/issues/519
             * https://github.com/react-native-picker/picker/issues/627
             */}
            <RNPPicker
              selectedValue={pendingValue}
              onValueChange={setPendingValue}
              style={{ flex: 1 }}
            >
              {items.map((item) => (
                <RNPPicker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                  enabled={!(item.disabled ?? item.isDisabled)}
                />
              ))}
            </RNPPicker>
          </View>
        )}
      </TrueSheetInnerStack.Screen>
    </TrueSheetStackHost>
  );
}

/**
 * 非 nativeTrigger 的 iOS 原生 Picker 入口。
 * 使用 Tamagui Select.Trigger 相同的 ListItem componentName，确保组件主题色、尺寸和边框一致。
 */
function NativePickerDefaultTrigger({
  disabled,
  label,
  placeholder,
  swatchColor,
  onPress,
}: {
  disabled?: boolean;
  label: React.ReactNode;
  placeholder: boolean;
  swatchColor?: string;
  onPress?: () => void;
}) {
  return (
    <TamaguiListItem
      componentName="SelectTrigger"
      background="$background"
      rounded="$4"
      borderWidth={1}
      disabled={disabled}
      hoverStyle={DEFAULT_TRIGGER_HOVER_STYLE}
      iconAfter={ChevronDown}
      onPress={onPress}
      pressStyle={DEFAULT_TRIGGER_PRESS_STYLE}
      size="$true"
    >
      {renderNativePickerDefaultTriggerLabel(label, placeholder, swatchColor)}
    </TamaguiListItem>
  );
}

/** wheel + 自定义 trigger */
const NativePickerWheelSheet = React.forwardRef<
  NativePickerSwiftUIHandle,
  {
    disabled?: boolean;
    items: ResolvedSelectItemData[];
    value: string | null | undefined;
    placeholder?: React.ReactNode;
    onValueChange?: (value: string | null) => void;
    resolvedNativeHaptics: ReturnType<typeof useResolvedNativeHaptics>;
  }
>(({ disabled, items, value, placeholder, onValueChange, resolvedNativeHaptics }, ref) => {
  const [pendingValue, setPendingValue] = React.useState<string>(
    (value as string) ?? items[0]?.value ?? "",
  );
  const selectedItem = items.find((item) => item.value === value);
  const selectedLabel = selectedItem?.label ?? null;
  const [sheetName] = React.useState(() => `select-wheel-${++wheelSheetCounter}`);

  const openSheet = useCallback(
    (shouldTriggerHaptics: boolean) => {
      if (disabled) return;

      if (shouldTriggerHaptics) {
        triggerNativeHaptics(resolvedNativeHaptics);
      }

      setPendingValue((value as string) ?? items[0]?.value ?? "");
      presentTrueSheet(sheetName);
    },
    [disabled, resolvedNativeHaptics, value, items, sheetName],
  );

  React.useImperativeHandle(ref, () => ({
    open() {
      openSheet(true);
    },
  }));

  const handleDone = useCallback(() => {
    onValueChange?.(pendingValue || null);
    triggerNativeHaptics(resolvedNativeHaptics);
    dismissTrueSheet(sheetName);
  }, [onValueChange, resolvedNativeHaptics, pendingValue, sheetName]);

  const handleCancel = useCallback(() => {
    triggerNativeHaptics(resolvedNativeHaptics);
    dismissTrueSheet(sheetName);
  }, [resolvedNativeHaptics, sheetName]);

  const title = typeof placeholder === "string" ? placeholder : "选择";

  return (
    <>
      <NativePickerDefaultTrigger
        disabled={disabled}
        label={selectedLabel ?? (typeof placeholder === "string" ? placeholder : "选择")}
        onPress={() => openSheet(true)}
        placeholder={selectedLabel == null}
        swatchColor={selectedItem?.swatchColor}
      />

      <WheelTrueSheet
        items={items}
        title={title}
        sheetName={sheetName}
        pendingValue={pendingValue}
        setPendingValue={setPendingValue}
        onCancel={handleCancel}
        onDone={handleDone}
      />
    </>
  );
});

/**
 * iOS/Android 共用的自绘原生 trigger。
 * 不再依赖 SwiftUI Picker 自带按钮，避免嵌套 sheet 等系统着色差异。
 */
type NativePickerSwiftUIMenuTriggerProps = {
  active?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  content?: React.ReactNode;
  disabled?: boolean;
  icon?: SelectNativeTriggerIcon;
  label: React.ReactNode;
  labelProps?: TextProps;
  keepPressedOpacity?: boolean;
  onPress?: PressableProps["onPress"];
  pressedOpacity?: boolean;
};

const NativePickerSwiftUIMenuTrigger = React.forwardRef<View, NativePickerSwiftUIMenuTriggerProps>(
  ({
    active,
    containerStyle,
    content,
    disabled,
    icon,
    keepPressedOpacity,
    label,
    labelProps,
    onPress,
    pressedOpacity,
  }, forwardedRef) => (
    <NativeTriggerPressable
      ref={forwardedRef}
      active={active}
      content={content}
      containerStyle={containerStyle}
      disabled={disabled}
      icon={icon}
      keepPressedOpacity={keepPressedOpacity}
      label={label}
      labelProps={labelProps}
      onPress={onPress}
      pressedOpacity={pressedOpacity}
      style={disabled ? { opacity: 0.5 } : undefined}
    />
  ),
);

/** wheel + 原生 trigger（SwiftUI menu 按钮） */
const NativePickerWheelNativeTriggerSheet = React.forwardRef<
  NativePickerSwiftUIHandle,
  {
    disabled?: boolean;
    nativeTriggerContainerStyle?: StyleProp<ViewStyle>;
    nativeTriggerContent?: React.ReactNode;
    nativeTriggerIcon?: SelectNativeTriggerIcon;
    nativeTriggerLabel: React.ReactNode;
    nativeTriggerLabelProps?: TextProps;
    nativeTriggerPressedOpacity?: boolean;
    items: ResolvedSelectItemData[];
    placeholder?: React.ReactNode;
    value: string | null | undefined;
    onValueChange?: (value: string | null) => void;
    resolvedNativeHaptics: ReturnType<typeof useResolvedNativeHaptics>;
  }
>(
  (
    {
      disabled,
      nativeTriggerContainerStyle,
      nativeTriggerContent,
      nativeTriggerIcon,
      nativeTriggerLabel,
      nativeTriggerLabelProps,
      nativeTriggerPressedOpacity,
      items,
      placeholder,
      value,
      onValueChange,
      resolvedNativeHaptics,
    },
    ref,
  ) => {
    const [pendingValue, setPendingValue] = React.useState<string>(
      (value as string) ?? items[0]?.value ?? "",
    );
    const [sheetName] = React.useState(() => `select-wheel-${++wheelSheetCounter}`);

    const openSheet = useCallback(
      (shouldTriggerHaptics: boolean) => {
        if (disabled) return;

        if (shouldTriggerHaptics) {
          triggerNativeHaptics(resolvedNativeHaptics);
        }

        setPendingValue((value as string) ?? items[0]?.value ?? "");
        presentTrueSheet(sheetName);
      },
      [disabled, resolvedNativeHaptics, value, items, sheetName],
    );

    React.useImperativeHandle(ref, () => ({
      open() {
        openSheet(true);
      },
    }));

    const handleDone = useCallback(() => {
      onValueChange?.(pendingValue || null);
      triggerNativeHaptics(resolvedNativeHaptics);
      dismissTrueSheet(sheetName);
    }, [onValueChange, resolvedNativeHaptics, pendingValue, sheetName]);

    const handleCancel = useCallback(() => {
      triggerNativeHaptics(resolvedNativeHaptics);
      dismissTrueSheet(sheetName);
    }, [resolvedNativeHaptics, sheetName]);

    const title = typeof placeholder === "string" ? placeholder : "选择";

    return (
      <>
        <NativePickerSwiftUIMenuTrigger
          containerStyle={nativeTriggerContainerStyle}
          content={nativeTriggerContent}
          disabled={disabled}
          icon={nativeTriggerIcon}
          label={nativeTriggerLabel}
          labelProps={nativeTriggerLabelProps}
          onPress={() => openSheet(true)}
          pressedOpacity={nativeTriggerPressedOpacity}
        />

        <WheelTrueSheet
          items={items}
          title={title}
          sheetName={sheetName}
          pendingValue={pendingValue}
          setPendingValue={setPendingValue}
          onCancel={handleCancel}
          onDone={handleDone}
        />
      </>
    );
  },
);

/**
 * dropdown + 自定义 trigger：复用 Menu 组件实现。
 * Menu 的 MenuTrigger 包装自定义 YStack，点击时显示选项列表。
 */
function NativePickerDropdownCustom({
  disabled,
  items,
  value,
  placeholder,
  onValueChange,
  onOpenChange,
  onOpenWillChange,
  resolvedNativeHaptics,
  nativeTrigger,
  nativeTriggerContainerStyle,
  nativeTriggerContent,
  nativeTriggerIcon,
  nativeTriggerLabel,
  nativeTriggerLabelProps,
  __menuRef,
}: {
  disabled?: boolean;
  items: ResolvedSelectItemData[];
  value: string | null | undefined;
  placeholder?: React.ReactNode;
  onValueChange?: (value: string | null) => void;
  onOpenChange?: (open: boolean) => void;
  onOpenWillChange?: (open: boolean) => void;
  resolvedNativeHaptics: ReturnType<typeof useResolvedNativeHaptics>;
  nativeTrigger: boolean | undefined;
  nativeTriggerContainerStyle?: StyleProp<ViewStyle>;
  nativeTriggerContent?: React.ReactNode;
  nativeTriggerIcon?: SelectNativeTriggerIcon;
  nativeTriggerLabel: React.ReactNode;
  nativeTriggerLabelProps?: TextProps;
  __menuRef?: React.MutableRefObject<{ presentMenu: () => void } | null>;
}) {
  const selectedItem = items.find((item) => item.value === value);
  const selectedLabel = selectedItem?.label ?? null;

  const handleSelect = useCallback(
    (itemValue: string) => {
      if (disabled) return;

      onValueChange?.(itemValue || null);
      triggerNativeHaptics(resolvedNativeHaptics);
    },
    [disabled, onValueChange, resolvedNativeHaptics],
  );
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => onOpenChange?.(nextOpen),
    [onOpenChange],
  );
  const trigger = nativeTrigger ? undefined : (
    <NativePickerDefaultTrigger
      disabled={disabled}
      label={selectedLabel ?? (typeof placeholder === "string" ? placeholder : "选择")}
      placeholder={selectedLabel == null}
      swatchColor={selectedItem?.swatchColor}
    />
  );

  // iOS 原生菜单的容器本身仍会接收点击；禁用时不挂载菜单，只保留静态 trigger。
  if (disabled) {
    return nativeTrigger ? (
      <NativePickerSwiftUIMenuTrigger
        containerStyle={nativeTriggerContainerStyle}
        content={nativeTriggerContent}
        disabled
        icon={nativeTriggerIcon}
        label={nativeTriggerLabel}
        labelProps={nativeTriggerLabelProps}
      />
    ) : (
      trigger
    );
  }

  return (
    <Menu
      nativeHaptics={resolvedNativeHaptics}
      nativeTrigger={nativeTrigger}
      nativeTriggerContainerStyle={nativeTriggerContainerStyle}
      nativeTriggerContent={nativeTriggerContent}
      nativeTriggerIcon={nativeTriggerIcon}
      nativeTriggerLabel={nativeTriggerLabel}
      nativeTriggerLabelProps={nativeTriggerLabelProps}
      onOpenChange={handleOpenChange}
      onOpenWillChange={onOpenWillChange}
      trigger={trigger}
      // @ts-expect-error patch
      __menuRef={__menuRef}
    >
      {items.map((item) => (
        <Menu.CheckboxItem
          key={item.value}
          checked={item.value === value}
          onSelect={() => handleSelect(item.value)}
          disabled={item.disabled ?? item.isDisabled}
        >
          <Menu.ItemTitle>{item.label}</Menu.ItemTitle>
          <Menu.ItemIndicator>
            <Check size={16} color="$color10" />
          </Menu.ItemIndicator>
          {item.swatchColor != null ? (
            <Menu.ItemIcon
              ios={{ name: "circle.fill", hierarchicalColor: item.swatchColor }}
            />
          ) : null}
        </Menu.CheckboxItem>
      ))}
    </Menu>
  );
}

/**
 * iOS NativePicker 的 ref handle。
 * 通过 open() 方法在外部控制选项列表的打开。
 */
export type NativePickerSwiftUIHandle = {
  open: () => void;
};

/**
 * iOS NativePicker：switch 入口。
 * dropdown → NativePickerDropdownCustom（含可选的 nativeTrigger SwiftUI menu）
 * wheel + nativeTrigger → NativePickerWheelNativeTriggerSheet
 * wheel + 自定义 trigger → NativePickerWheelSheet
 */
export const NativePickerSwiftUI = React.forwardRef<
  NativePickerSwiftUIHandle,
  {
    disabled?: boolean;
    items: ResolvedSelectItemData[];
    value: string | null | undefined;
    placeholder?: React.ReactNode;
    mode: "dropdown" | "wheel";
    nativeDropdownAlign?: SelectNativeDropdownAlign;
    nativeDropdownAnchorWidth?: number;
    nativeDropdownEdgeOffset?: number;
    nativeTrigger?: boolean;
    nativeTriggerContainerStyle?: StyleProp<ViewStyle>;
    nativeTriggerContent?: React.ReactNode;
    nativeTriggerIcon?: SelectNativeTriggerIcon;
    nativeTriggerLabel: React.ReactNode;
    nativeTriggerLabelProps?: TextProps;
    nativeTriggerPressedOpacity?: boolean;
    onValueChange?: (value: string | null) => void;
    onOpenChange?: (open: boolean) => void;
    onOpenWillChange?: (open: boolean) => void;
    resolvedNativeHaptics: ReturnType<typeof useResolvedNativeHaptics>;
  }
>((props, ref) => {
  const menuControlRef = React.useRef<{ presentMenu: () => void } | null>(null);
  const wheelNativeRef = React.useRef<NativePickerSwiftUIHandle>(null);
  const wheelCustomRef = React.useRef<NativePickerSwiftUIHandle>(null);

  React.useImperativeHandle(ref, () => ({
    open() {
      if (props.disabled) return;

      if (props.mode === "dropdown") {
        menuControlRef.current?.presentMenu();
      } else if (props.mode === "wheel" && props.nativeTrigger) {
        wheelNativeRef.current?.open();
      } else {
        wheelCustomRef.current?.open();
      }
    },
  }));

  const {
    disabled,
    items,
    value,
    placeholder,
    mode,
    nativeTrigger,
    nativeTriggerContainerStyle,
    nativeTriggerContent,
    nativeTriggerIcon,
    nativeTriggerLabel,
    nativeTriggerLabelProps,
    nativeTriggerPressedOpacity,
    onValueChange,
    onOpenChange,
    onOpenWillChange,
    resolvedNativeHaptics,
  } = props;

  // dropdown 组件
  if (mode === "dropdown") {
    return (
      <NativePickerDropdownCustom
        disabled={disabled}
        items={items}
        value={value}
        placeholder={placeholder}
        onValueChange={onValueChange}
        onOpenChange={(next) => {
          onOpenChange?.(next);
        }}
        onOpenWillChange={onOpenWillChange}
        resolvedNativeHaptics={resolvedNativeHaptics}
        nativeTrigger={nativeTrigger}
        nativeTriggerContainerStyle={nativeTriggerContainerStyle}
        nativeTriggerContent={nativeTriggerContent}
        nativeTriggerIcon={nativeTriggerIcon}
        nativeTriggerLabel={nativeTriggerLabel}
        nativeTriggerLabelProps={nativeTriggerLabelProps}
        __menuRef={menuControlRef}
      />
    );
  }

  // wheel + Sheet + 原生 trigger
  if (mode === "wheel" && nativeTrigger) {
    return (
      <NativePickerWheelNativeTriggerSheet
        ref={wheelNativeRef}
        disabled={disabled}
        items={items}
        nativeTriggerContainerStyle={nativeTriggerContainerStyle}
        nativeTriggerContent={nativeTriggerContent}
        nativeTriggerIcon={nativeTriggerIcon}
        nativeTriggerLabel={nativeTriggerLabel}
        nativeTriggerLabelProps={nativeTriggerLabelProps}
        nativeTriggerPressedOpacity={nativeTriggerPressedOpacity}
        value={value}
        placeholder={placeholder}
        onValueChange={onValueChange}
        resolvedNativeHaptics={resolvedNativeHaptics}
      />
    );
  }

  // wheel + Sheet + 自定义 trigger
  return (
    <NativePickerWheelSheet
      ref={wheelCustomRef}
      disabled={disabled}
      items={items}
      value={value}
      placeholder={placeholder}
      onValueChange={onValueChange}
      resolvedNativeHaptics={resolvedNativeHaptics}
    />
  );
});

/** iOS 端永不渲染（shouldRenderNativePicker 恒为 false） */
export const NativePickerDialog: React.FC<any> = () => null;
