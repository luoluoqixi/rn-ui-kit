import { Check, CheckCircle2, ChevronRight, Circle } from "lucide-react-native";
import * as React from "react";
import { Children, Fragment, isValidElement, type ReactNode, useState } from "react";
import { Platform, Pressable, RefreshControl, StyleSheet, View } from "react-native";

import { Input } from "../input";
import { ContextMenu } from "../context_menu";
import { Dropdown } from "../dropdown";
import { Select } from "../select";
import { resolveSelectItemGroups } from "../select/select_grouping";
import type { SelectHandle } from "../select/types";
import { Switch } from "../switch";
import { Text } from "../text";
import { Textarea } from "../textarea";
import { ScrollView } from "../scroll_view";
import { triggerNativeHaptics } from "../utils";
import { resolveRenderProp } from "../utils/render";
import { useAppBackgroundColors, useUiTheme } from "../utils/theme";
import {
  NativeListContextMenuProvider,
  useResolvedNativeListContextMenu,
  useResolvedNativeListDisabledStyle,
} from "./context_menu";
import { NativeListHapticsProvider, useResolvedNativeListHaptics } from "./haptics";
import {
  NATIVE_LIST_BASIC_DIVIDER_OPACITY,
  NATIVE_LIST_BASIC_DEFAULT_STYLE,
  NATIVE_LIST_BASIC_STYLE_DEFAULTS,
  NATIVE_LIST_DISABLED_OPACITY,
  NATIVE_LIST_EDIT_VALUE_OPACITY,
  NATIVE_LIST_ITEM_OPEN_OPACITY,
  NATIVE_LIST_ITEM_PRESS_OPACITY,
  NATIVE_LIST_BASIC_SECTION_TEXT_COLOR_TOKEN,
  NATIVE_LIST_BASIC_SECTION_TEXT_FONT_SIZE,
  NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN,
  NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
  NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
} from "./constants";
import {
  NativeListEditModeProvider,
  useNativeListEditContext,
  useNativeListEditMode,
  useNativeListEditIcons,
  useNativeListEditRow,
} from "./edit_mode";
import type {
  NativeListActionItemProps,
  NativeListButtonItemProps,
  NativeListCustomItemProps,
  NativeListInputItemProps,
  NativeListItemBaseProps,
  NativeListItemProps,
  NativeListDropdownItemProps,
  NativeListNavigationItemProps,
  NativeListRootProps,
  NativeListSectionProps,
  NativeListSelectItemProps,
  NativeListSwitchItemProps,
  NativeListTextAreaItemProps,
  NativeListBasicStyle,
  NativeListBasicStyleOptions,
} from "./types";

const NativeListBasicStyleContext = React.createContext<NativeListBasicStyle>(
  NATIVE_LIST_BASIC_DEFAULT_STYLE,
);
const NativeListBasicBorderRadiusContext = React.createContext<number | undefined>(undefined);
const NativeListBasicShowBorderContext = React.createContext<boolean | undefined>(undefined);
const NativeListBasicBorderColorContext =
  React.createContext<NativeListBasicStyleOptions["borderColor"]>(undefined);
const NativeListBasicDividerColorContext =
  React.createContext<NativeListBasicStyleOptions["dividerColor"]>(undefined);
const NativeListBasicRowBackgroundColorContext =
  React.createContext<NativeListBasicStyleOptions["rowBackgroundColor"]>(undefined);
const NativeListBasicSectionShadowContext =
  React.createContext<NativeListBasicStyleOptions["sectionShadow"]>(undefined);
const NativeListBasicShowDividerContext = React.createContext<boolean>(
  NATIVE_LIST_BASIC_STYLE_DEFAULTS.showDivider,
);
const NativeListBasicDividerWidthContext = React.createContext<number>(
  NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerWidth,
);
const NativeListBasicDividerPaddingContext = React.createContext<number>(
  NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerPaddingLeft,
);
const NativeListBasicDividerRightPaddingContext = React.createContext<number>(
  NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerPaddingRight,
);
const NativeListBasicDividerPlacementContext = React.createContext<"top" | "bottom" | "none">(
  "bottom",
);

function resolveBasicDividerColor(color: string) {
  const hex = color.trim().replace(/^#/, "");
  if (hex.length !== 6 || !/^[0-9a-f]+$/i.test(hex)) return color;
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  return `rgba(${channels.join(", ")}, ${NATIVE_LIST_BASIC_DIVIDER_OPACITY})`;
}

function useBasicDividerColor() {
  const theme = useUiTheme();
  const configuredColor = React.useContext(NativeListBasicDividerColorContext);
  return configuredColor ?? resolveBasicDividerColor(theme.mutedForeground);
}

function BasicRowDivider() {
  const showDivider = React.useContext(NativeListBasicShowDividerContext);
  const dividerWidth = React.useContext(NativeListBasicDividerWidthContext);
  const dividerPaddingLeft = React.useContext(NativeListBasicDividerPaddingContext);
  const dividerPaddingRight = React.useContext(NativeListBasicDividerRightPaddingContext);
  const dividerPlacement = React.useContext(NativeListBasicDividerPlacementContext);
  const dividerColor = useBasicDividerColor();
  if (!showDivider || dividerWidth <= 0 || dividerPlacement === "none") return null;
  return (
    <View
      pointerEvents="none"
      style={[
        styles.rowDivider,
        {
          borderTopColor: dividerColor,
          borderTopWidth: dividerWidth,
          left: dividerPaddingLeft,
          right: dividerPaddingRight,
          ...(dividerPlacement === "top" ? { top: 0 } : { bottom: 0 }),
        },
      ]}
    />
  );
}

function RowText({
  children,
  color,
  fontSize,
  numberOfLines,
  style,
}: {
  children: ReactNode;
  color?: string;
  fontSize?: number;
  numberOfLines?: number;
  style?: object;
}) {
  if (children == null) return null;
  if (isValidElement(children)) {
    return <View style={[{ color, fontSize }, style]}>{normalizeRowTextChildren(children)}</View>;
  }
  if (Array.isArray(children)) {
    return <View style={[{ color, fontSize }, style]}>{normalizeRowTextChildren(children)}</View>;
  }
  return (
    <Text numberOfLines={numberOfLines} style={[{ color, fontSize }, style]}>
      {children}
    </Text>
  );
}

function normalizeRowTextChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (child == null || typeof child === "boolean") return null;
    if (typeof child === "string" || typeof child === "number") {
      return <Text key={`row-text-${String(child)}`}>{child}</Text>;
    }
    if (isValidElement(child) && child.type === Fragment) {
      return normalizeRowTextChildren((child.props as { children?: ReactNode }).children);
    }
    return child;
  });
}

function resolveBasicTriggerLabel(value: ReactNode, title: ReactNode) {
  const candidate = value ?? title;
  return typeof candidate === "string" || typeof candidate === "number"
    ? String(candidate)
    : "更多";
}

function resolveBasicSelectTriggerLabel(selectProps: NativeListSelectItemProps["selectProps"]) {
  const groups = resolveSelectItemGroups({
    itemGroups: selectProps.itemGroups,
    items: selectProps.items,
    options: selectProps.options,
  });
  const selectedValue = selectProps.value ?? selectProps.defaultValue ?? undefined;
  const selectedItem = groups
    .flatMap((group) => group.items)
    .find((item) => item.value === selectedValue);
  const rendered =
    resolveRenderProp(selectProps.renderValue, {
      value: selectedValue,
      item: selectedItem,
    }) ??
    (selectedItem == null
      ? (selectProps.placeholder ?? "选择")
      : resolveRenderProp(selectedItem.label, {
          checked: true,
          disabled: Boolean(selectedItem.disabled ?? selectedItem.isDisabled),
          selected: true,
          value: selectedItem.value,
        }));
  const label =
    typeof rendered === "string" || typeof rendered === "number" ? (
      <Text>{rendered}</Text>
    ) : (
      rendered
    );
  const content =
    selectedItem?.swatchColor == null ? (
      label
    ) : (
      <View style={styles.selectInlineLabel}>
        <View style={[styles.selectSwatch, { backgroundColor: selectedItem.swatchColor }]} />
        {label}
      </View>
    );
  return <View style={{ opacity: NATIVE_LIST_TRAILING_TRIGGER_OPACITY }}>{content}</View>;
}

export function NativeListRow({
  children,
  chevron,
  contextMenuProps,
  disabled,
  disabledStyle,
  icon,
  nativeHaptics,
  nativeScrollId,
  onPress,
  selected,
  subtitle,
  subtitleColor,
  subtitleFontSize,
  title,
  titleAlign,
  titleColor,
  titleFontSize,
  trailing,
  value,
  valueColor,
  valueFontSize,
  valueOpacity = 1,
  rowMinHeight,
  titleNumberOfLines = 2,
  backgroundColor,
  hoverBackgroundColor,
  labelOpacity = 1,
  pressedOpacity = 1,
  suppressPressBackground = false,
  pressBackgroundColor,
  selectionDisabled,
  selectionId,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
  cursorDefault = false,
}: NativeListItemBaseProps & {
  children?: ReactNode;
  labelOpacity?: number;
  pressedOpacity?: number;
  suppressPressBackground?: boolean;
  cursorDefault?: boolean;
  valueOpacity?: number;
  rowMinHeight?: number;
  titleNumberOfLines?: number;
}) {
  const theme = useUiTheme();
  const defaultRowBackgroundColor = React.useContext(NativeListBasicRowBackgroundColorContext);
  const resolvedNativeHaptics = useResolvedNativeListHaptics(nativeHaptics);
  const resolvedContextMenuProps = useResolvedNativeListContextMenu(
    contextMenuProps,
    Boolean(disabled),
  );
  const contextMenuRef = React.useRef<{ presentMenu: () => void } | null>(null);
  const resolvedDisabledStyle = useResolvedNativeListDisabledStyle(disabledStyle);
  const [hovered, setHovered] = useState(false);
  const edit = useNativeListEditRow({
    disabled,
    nativeScrollId,
    onPress,
    selectionDisabled,
    selectionId,
  });
  const editIcons = useNativeListEditIcons();
  const androidContextMenuEnabled =
    Platform.OS === "android" &&
    !edit.editMode &&
    resolvedContextMenuProps != null &&
    !resolvedContextMenuProps.triggerProps?.disabled;
  const resolvedTitleAlign = titleAlign ?? "left";
  const handlePress = () => {
    edit.onPress?.();
    if (edit.onPress != null) triggerNativeHaptics(resolvedNativeHaptics);
  };

  const row = (
    <Pressable
      disabled={disabled || (edit.onPress == null && !androidContextMenuEnabled)}
      className={Platform.OS === "web" && cursorDefault ? "cursor-default" : undefined}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={handlePress}
      onLongPress={
        androidContextMenuEnabled ? () => contextMenuRef.current?.presentMenu() : undefined
      }
      style={({ pressed }) => [
        styles.row,
        {
          alignSelf: "stretch",
          backgroundColor: edit.editingSelected
            ? theme.accent
            : pressed && edit.onPress != null && !suppressPressBackground
              ? (pressBackgroundColor ?? theme.accent)
              : hovered && edit.onPress != null && !disabled
                ? (hoverBackgroundColor ?? theme.muted)
                : (backgroundColor ?? defaultRowBackgroundColor ?? theme.card),
          opacity:
            disabled && resolvedDisabledStyle
              ? NATIVE_LIST_DISABLED_OPACITY
              : pressed
                ? pressedOpacity
                : labelOpacity,
          width: "100%",
          minHeight: rowMinHeight ?? 56,
          paddingBottom: paddingBottom ?? paddingVertical ?? 8,
          paddingLeft: paddingLeft ?? paddingHorizontal ?? 16,
          paddingRight: paddingRight ?? paddingHorizontal ?? 16,
          paddingTop: paddingTop ?? paddingVertical ?? 8,
          ...(Platform.OS === "web" && cursorDefault ? ({ cursor: "default" } as any) : {}),
        },
      ]}
    >
      <View pointerEvents={edit.editMode ? "none" : "auto"} style={styles.rowContent}>
        {edit.editMode && edit.selectionEnabled
          ? edit.editingSelected
            ? (editIcons.editModeSelectedIcon ?? <CheckCircle2 color={theme.primary} size={20} />)
            : (editIcons.editModeIcon ?? <Circle color={theme.mutedForeground} size={20} />)
          : null}
        {icon == null ? null : <View style={styles.icon}>{icon}</View>}
        <View style={styles.labels}>
          <RowText
            color={titleColor ?? theme.foreground}
            fontSize={titleFontSize ?? 16}
            numberOfLines={titleNumberOfLines}
            style={{ textAlign: resolvedTitleAlign }}
          >
            {title}
          </RowText>
          <RowText
            color={subtitleColor ?? theme.mutedForeground}
            fontSize={subtitleFontSize ?? 13}
            numberOfLines={3}
          >
            {subtitle}
          </RowText>
          {normalizeRowTextChildren(children)}
        </View>
        <RowText
          color={valueColor ?? theme.mutedForeground}
          fontSize={valueFontSize ?? 15}
          numberOfLines={1}
          style={{ opacity: valueOpacity }}
        >
          {value}
        </RowText>
        {!edit.editMode && selected ? (
          <Check color={theme.primary} size={18} strokeWidth={2.5} />
        ) : null}
        {normalizeRowTextChildren(trailing)}
        {chevron ? <ChevronRight color={theme.mutedForeground} size={18} /> : null}
      </View>
      <BasicRowDivider />
    </Pressable>
  );

  if (edit.editMode || resolvedContextMenuProps == null) return row;
  if (Platform.OS === "android" && androidContextMenuEnabled) {
    return (
      <View collapsable={false} style={styles.contextMenuRow}>
        {row}
        <View pointerEvents="none" style={styles.contextMenuAnchor}>
          <ContextMenu
            {...resolvedContextMenuProps}
            {...(Platform.OS === "android" ? { anchorAlignment: "center" } : {})}
            trigger={<View collapsable={false} style={styles.contextMenuAnchorTrigger} />}
            __menuRef={contextMenuRef}
          />
        </View>
      </View>
    );
  }
  return (
    <ContextMenu
      {...resolvedContextMenuProps}
      trigger={row}
      triggerProps={
        Platform.OS === "ios"
          ? {
              ...resolvedContextMenuProps.triggerProps,
              style: [styles.contextMenuRow, resolvedContextMenuProps.triggerProps?.style] as any,
            }
          : resolvedContextMenuProps.triggerProps
      }
    />
  );
}

export function NativeListActionItem(props: NativeListActionItemProps) {
  return <NativeListRow {...props} />;
}

export function NativeListNavigationItem(props: NativeListNavigationItemProps) {
  return <NativeListRow {...props} chevron={props.chevron ?? true} />;
}

export function NativeListButtonItem(props: NativeListButtonItemProps) {
  return (
    <NativeListRow
      {...props}
      titleAlign={props.titleAlign ?? "center"}
      titleColor={
        props.titleColor ?? (typeof props.btnTint === "string" ? props.btnTint : undefined)
      }
    />
  );
}

export function NativeListItem(props: NativeListItemProps) {
  return <NativeListRow {...props} />;
}

export function NativeListSwitchItem({ switchProps, ...itemProps }: NativeListSwitchItemProps) {
  const editMode = useNativeListEditMode();
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    switchProps.defaultChecked ?? false,
  );
  const checked = switchProps.checked ?? uncontrolledChecked;
  const disabled = itemProps.disabled || switchProps.disabled;
  const inheritedHaptics = useResolvedNativeListHaptics(
    itemProps.nativeHaptics ?? switchProps.nativeHaptics,
  );
  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (switchProps.checked == null) setUncontrolledChecked(next);
    switchProps.onCheckedChange?.(next);
  };
  return (
    <NativeListRow
      {...itemProps}
      disabled={disabled}
      nativeHaptics={inheritedHaptics ?? true}
      onPress={() => {
        itemProps.onPress?.();
        toggle();
      }}
      trailing={
        <Switch
          {...switchProps}
          checked={checked}
          disabled={disabled || editMode}
          nativeHaptics={inheritedHaptics ?? true}
          onCheckedChange={toggle}
        />
      }
    />
  );
}

export function NativeListSelectItem({ selectProps, ...itemProps }: NativeListSelectItemProps) {
  const theme = useUiTheme();
  const selectRef = React.useRef<SelectHandle | null>(null);
  const [menuOpen, setMenuOpen] = useState(Boolean((selectProps as any).defaultOpen));
  const editMode = useNativeListEditMode();
  const inheritedHaptics = useResolvedNativeListHaptics(
    itemProps.nativeHaptics ?? selectProps.nativeHaptics,
  );
  const triggerColor =
    itemProps.valueColor ??
    selectProps.nativeTriggerLabelProps?.color ??
    theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN];
  const openSelect = () => {
    if (itemProps.disabled || selectProps.disabled || selectProps.isDisabled) return;
    selectRef.current?.open();
  };
  if (editMode) {
    return (
      <NativeListRow
        {...itemProps}
        value={resolveBasicSelectTriggerLabel(selectProps)}
        valueColor={
          (itemProps.valueColor ??
            selectProps.nativeTriggerLabelProps?.color ??
            (theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN] as string)) as string
        }
        valueOpacity={NATIVE_LIST_EDIT_VALUE_OPACITY}
      />
    );
  }
  return (
    <NativeListRow
      {...itemProps}
      cursorDefault
      labelOpacity={menuOpen ? NATIVE_LIST_ITEM_OPEN_OPACITY : 1}
      nativeHaptics={false}
      pressedOpacity={NATIVE_LIST_ITEM_PRESS_OPACITY}
      suppressPressBackground
      onPress={() => {
        itemProps.onPress?.();
        openSelect();
      }}
      value={undefined}
      trailing={
        <Select
          ref={selectRef}
          {...(selectProps as any)}
          nativeTrigger
          nativeTriggerIcon={selectProps.nativeTriggerIcon ?? "chevrons-up-down"}
          nativeHaptics={inheritedHaptics}
          nativeTriggerHoverBackground={false}
          nativeTriggerLabel={selectProps.nativeTriggerLabel}
          nativeTriggerLabelProps={{
            ...selectProps.nativeTriggerLabelProps,
            color: triggerColor,
            opacity:
              selectProps.nativeTriggerLabelProps?.opacity ?? NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
          }}
          nativeTriggerFeedbackOpacity={{
            disabled: NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
            press: NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
            webHover: NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
            webPress: NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
            ...selectProps.nativeTriggerFeedbackOpacity,
          }}
          nativeTriggerProps={{
            ...selectProps.nativeTriggerProps,
            iconColor:
              itemProps.valueColor ??
              selectProps.nativeTriggerProps?.iconColor ??
              theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
          }}
          onOpenWillChange={(nextOpen: boolean) => {
            setMenuOpen(nextOpen);
            selectProps.onOpenWillChange?.(nextOpen);
          }}
          onOpenChange={(nextOpen: boolean) => {
            setMenuOpen(nextOpen);
            selectProps.onOpenChange?.(nextOpen);
          }}
        />
      }
    />
  );
}

export function NativeListDropdownItem({
  dropdownProps,
  ...itemProps
}: NativeListDropdownItemProps) {
  const theme = useUiTheme();
  const inheritedHaptics = useResolvedNativeListHaptics(
    itemProps.nativeHaptics ?? dropdownProps.nativeHaptics,
  );
  const menuRef = React.useRef<{ presentMenu: () => void } | null>(null);
  const presentingMenuRef = React.useRef(false);
  const [uncontrolledWillOpen, setUncontrolledWillOpen] = useState(
    Boolean(dropdownProps.defaultOpen),
  );
  const menuOpen = dropdownProps.open ?? uncontrolledWillOpen;
  const editMode = useNativeListEditMode();
  const fadeTitleOnOpen = itemProps.fadeTitleOnOpen !== false;
  const nativeTriggerLabelProps = {
    color: itemProps.valueColor ?? theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
    fontSize: itemProps.valueFontSize,
    numberOfLines: 1,
    opacity: NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
    style: [itemProps.valueColor != null ? { color: itemProps.valueColor } : undefined],
  };
  const handleMenuOpenWillChange = (nextOpen: boolean) => {
    if (dropdownProps.open === undefined) {
      setUncontrolledWillOpen(nextOpen);
    }
    presentingMenuRef.current = nextOpen;
    dropdownProps.onOpenWillChange?.(nextOpen);
  };
  if (editMode) {
    return (
      <NativeListRow
        {...itemProps}
        value={resolveBasicTriggerLabel(itemProps.value, itemProps.title)}
        valueColor={
          itemProps.valueColor ?? (theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN] as string)
        }
        valueOpacity={NATIVE_LIST_EDIT_VALUE_OPACITY}
      />
    );
  }
  return (
    <NativeListRow
      {...itemProps}
      cursorDefault
      nativeHaptics={false}
      labelOpacity={fadeTitleOnOpen && menuOpen ? NATIVE_LIST_ITEM_OPEN_OPACITY : 1}
      onPress={() => {
        if (
          itemProps.disabled ||
          dropdownProps.disabled ||
          dropdownProps.triggerProps?.disabled ||
          menuOpen ||
          presentingMenuRef.current
        ) {
          return;
        }
        itemProps.onPress?.();
        // 不等待弹层完成回调，整行直接进入与 trigger 相同的打开态。
        if (fadeTitleOnOpen && dropdownProps.open === undefined) {
          setUncontrolledWillOpen(true);
        }
        presentingMenuRef.current = true;
        menuRef.current?.presentMenu();
      }}
      pressedOpacity={NATIVE_LIST_ITEM_PRESS_OPACITY}
      suppressPressBackground
      value={undefined}
      trailing={
        <View style={{ alignItems: "center", alignSelf: "stretch", justifyContent: "center" }}>
          <Dropdown
            {...dropdownProps}
            // 行本身也是触发器；使用同一个受控状态，保证点击整行和点击右侧
            // trigger 时在 Web 与 Android 上都能打开菜单。
            open={dropdownProps.open ?? menuOpen}
            __menuRef={menuRef}
            nativeHaptics={inheritedHaptics}
            nativeTrigger
            nativeTriggerIcon="chevrons-up-down"
            nativeTriggerLabelProps={nativeTriggerLabelProps}
            nativeTriggerProps={{
              ...dropdownProps.nativeTriggerProps,
              iconColor:
                itemProps.valueColor ??
                dropdownProps.nativeTriggerProps?.iconColor ??
                theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
            }}
            nativeTriggerHoverBackground={false}
            nativeTriggerFeedbackOpacity={{
              disabled: NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
              press: NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
              webHover: NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
              webPress: NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
              ...dropdownProps.nativeTriggerFeedbackOpacity,
            }}
            onOpenWillChange={handleMenuOpenWillChange}
            onOpenChange={(nextOpen) => {
              if (dropdownProps.open === undefined) {
                setUncontrolledWillOpen(nextOpen);
              }
              presentingMenuRef.current = nextOpen;
              dropdownProps.onOpenChange?.(nextOpen);
            }}
            triggerLabel={resolveBasicTriggerLabel(itemProps.value, itemProps.title)}
            triggerProps={{
              ...dropdownProps.triggerProps,
              disabled: itemProps.disabled ?? dropdownProps.triggerProps?.disabled,
            }}
          />
        </View>
      }
    />
  );
}

export function NativeListInputItem({
  inputProps,
  inputWidth,
  ...itemProps
}: NativeListInputItemProps) {
  const disabled = itemProps.disabled || inputProps.disabled;
  const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
  const editMode = useNativeListEditMode();
  const resolvedInput = (
    <Input
      {...inputProps}
      disabled={disabled || editMode}
      unstyled
      style={[
        {
          fontSize: 17,
          height: 44,
          minHeight: 44,
          paddingVertical: 0,
          width: hasLeadingLabel ? (inputWidth ?? 160) : "100%",
        },
        inputProps.style,
      ]}
    />
  );

  if (!hasLeadingLabel) {
    return (
      <NativeListCustomItem
        {...itemProps}
        disabled={disabled}
        paddingVertical={itemProps.paddingVertical ?? 0}
      >
        <View
          style={{
            alignItems: "center",
            flex: 1,
            height: 56,
            justifyContent: "center",
            minWidth: 0,
            width: editMode ? undefined : "100%",
          }}
        >
          {resolvedInput}
        </View>
      </NativeListCustomItem>
    );
  }

  return (
    <NativeListRow
      {...itemProps}
      disabled={disabled}
      trailing={<View style={{ width: inputWidth ?? 160 }}>{resolvedInput}</View>}
    />
  );
}

export function NativeListTextAreaItem({
  textAreaProps,
  ...itemProps
}: NativeListTextAreaItemProps) {
  const editMode = useNativeListEditMode();
  const disabled = itemProps.disabled || textAreaProps.disabled;
  const editingValue =
    textAreaProps.value ?? textAreaProps.defaultValue ?? textAreaProps.placeholder ?? "";
  if (editMode) {
    return <NativeListRow {...itemProps} disabled={disabled} title={editingValue} />;
  }
  return (
    <NativeListCustomItem {...itemProps} disabled={disabled}>
      <Textarea {...textAreaProps} unstyled style={[{ width: "100%" }, textAreaProps.style]} />
    </NativeListCustomItem>
  );
}

export function NativeListCustomItem({
  backgroundColor,
  children,
  contextMenuProps,
  disabled,
  disabledStyle,
  hoverBackgroundColor,
  nativeHaptics,
  nativeScrollId,
  onPress,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
  pressBackgroundColor,
  selectionId,
  selectionDisabled,
}: NativeListCustomItemProps) {
  const theme = useUiTheme();
  const defaultRowBackgroundColor = React.useContext(NativeListBasicRowBackgroundColorContext);
  const resolvedNativeHaptics = useResolvedNativeListHaptics(nativeHaptics);
  const resolvedContextMenuProps = useResolvedNativeListContextMenu(
    contextMenuProps,
    Boolean(disabled),
  );
  const contextMenuRef = React.useRef<{ presentMenu: () => void } | null>(null);
  const resolvedDisabledStyle = useResolvedNativeListDisabledStyle(disabledStyle);
  const [hovered, setHovered] = useState(false);
  const edit = useNativeListEditRow({
    disabled,
    nativeScrollId,
    onPress,
    selectionDisabled,
    selectionId,
  });
  const editIcons = useNativeListEditIcons();
  const androidContextMenuEnabled =
    Platform.OS === "android" &&
    !edit.editMode &&
    resolvedContextMenuProps != null &&
    !resolvedContextMenuProps.triggerProps?.disabled;
  const row = (
    <Pressable
      disabled={disabled || (edit.onPress == null && !androidContextMenuEnabled)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => {
        edit.onPress?.();
        if (edit.onPress != null) triggerNativeHaptics(resolvedNativeHaptics);
      }}
      onLongPress={
        androidContextMenuEnabled ? () => contextMenuRef.current?.presentMenu() : undefined
      }
      style={({ pressed }) => [
        {
          alignSelf: "stretch",
          backgroundColor: edit.editingSelected
            ? theme.accent
            : pressed
              ? (pressBackgroundColor ?? theme.accent)
              : hovered && !disabled
                ? (hoverBackgroundColor ?? theme.muted)
                : (backgroundColor ?? defaultRowBackgroundColor ?? theme.card),
          opacity: disabled && resolvedDisabledStyle ? NATIVE_LIST_DISABLED_OPACITY : 1,
          width: "100%",
          position: "relative",
          paddingBottom: paddingBottom ?? paddingVertical ?? 12,
          paddingLeft: paddingLeft ?? paddingHorizontal ?? 16,
          paddingRight: paddingRight ?? paddingHorizontal ?? 16,
          paddingTop: paddingTop ?? paddingVertical ?? 12,
        },
      ]}
    >
      <View pointerEvents={edit.editMode ? "none" : "auto"} style={styles.customRowContent}>
        {edit.editMode && edit.selectionEnabled
          ? edit.editingSelected
            ? (editIcons.editModeSelectedIcon ?? <CheckCircle2 color={theme.primary} size={20} />)
            : (editIcons.editModeIcon ?? <Circle color={theme.mutedForeground} size={20} />)
          : null}
        {normalizeRowTextChildren(children)}
      </View>
      <BasicRowDivider />
    </Pressable>
  );
  if (edit.editMode || resolvedContextMenuProps == null) return row;
  if (Platform.OS === "android" && androidContextMenuEnabled) {
    return (
      <View collapsable={false} style={styles.contextMenuRow}>
        {row}
        <View pointerEvents="none" style={styles.contextMenuAnchor}>
          <ContextMenu
            {...resolvedContextMenuProps}
            {...(Platform.OS === "android" ? { anchorAlignment: "center" } : {})}
            trigger={<View collapsable={false} style={styles.contextMenuAnchorTrigger} />}
            __menuRef={contextMenuRef}
          />
        </View>
      </View>
    );
  }
  return (
    <ContextMenu
      {...resolvedContextMenuProps}
      trigger={row}
      triggerProps={
        Platform.OS === "ios"
          ? {
              ...resolvedContextMenuProps.triggerProps,
              style: [styles.contextMenuRow, resolvedContextMenuProps.triggerProps?.style] as any,
            }
          : resolvedContextMenuProps.triggerProps
      }
    />
  );
}

export function NativeListSection({
  children,
  contextMenuProps,
  disabledStyle,
  footer,
  nativeHaptics,
  title,
  titleColor,
  titleFontSize,
  trailing,
}: NativeListSectionProps) {
  const theme = useUiTheme();
  const listStyle = React.useContext(NativeListBasicStyleContext);
  const borderRadius = React.useContext(NativeListBasicBorderRadiusContext);
  const sectionShadow = React.useContext(NativeListBasicSectionShadowContext);
  const showBorder = React.useContext(NativeListBasicShowBorderContext) ?? listStyle === "rounded";
  const borderColor = React.useContext(NativeListBasicBorderColorContext) ?? theme.border;
  const sectionRadius =
    borderRadius ?? (listStyle === "rounded" ? NATIVE_LIST_BASIC_STYLE_DEFAULTS.borderRadius : 0);
  const sectionShadowStyle =
    sectionShadow === true
      ? styles.sectionShadowDefault
      : sectionShadow === false || sectionShadow == null
        ? undefined
        : sectionShadow;
  const editMode = useNativeListEditMode();
  const editContext = useNativeListEditContext();
  const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
  const resolvedDisabledStyle = useResolvedNativeListDisabledStyle(disabledStyle);
  const resolvedNativeHaptics = useResolvedNativeListHaptics(nativeHaptics);
  const sectionTextColor = titleColor ?? theme[NATIVE_LIST_BASIC_SECTION_TEXT_COLOR_TOKEN];
  const sectionTextFontSize = titleFontSize ?? NATIVE_LIST_BASIC_SECTION_TEXT_FONT_SIZE;
  const renderContext = {
    contextMenuProps: resolvedContextMenuProps,
    disabledStyle: resolvedDisabledStyle,
    editMode,
    isSelected: editContext.isSelected,
    nativeHaptics: resolvedNativeHaptics,
    nativeSelectionEnabled: editContext.nativeSelectionEnabled,
    toggleSelection: editContext.toggleSelection,
  };
  return (
    <View style={[styles.section, listStyle === "plainFullWidth" && styles.sectionFullWidth]}>
      {title == null && trailing == null ? null : (
        <View style={styles.sectionHeader}>
          <RowText color={sectionTextColor} fontSize={sectionTextFontSize}>
            {resolveRenderProp(title, renderContext)}
          </RowText>
          {normalizeRowTextChildren(resolveRenderProp(trailing, renderContext))}
        </View>
      )}
      <NativeListContextMenuProvider
        contextMenuProps={contextMenuProps}
        disabledStyle={disabledStyle}
      >
        <NativeListHapticsProvider nativeHaptics={nativeHaptics}>
          <View style={[styles.sectionShadow, { borderRadius: sectionRadius }, sectionShadowStyle]}>
            <View
              style={[
                styles.sectionBody,
                listStyle !== "rounded" && styles.sectionBodyPlain,
                { borderRadius: sectionRadius },
                showBorder && styles.sectionBodyBorder,
                showBorder && { borderColor },
              ]}
            >
              {Children.toArray(children).map((child, index) => (
                <NativeListBasicDividerPlacementContext.Provider
                  key={`native-list-basic-child-${index}`}
                  value={index === 0 ? "none" : "top"}
                >
                  {child}
                </NativeListBasicDividerPlacementContext.Provider>
              ))}
            </View>
          </View>
        </NativeListHapticsProvider>
      </NativeListContextMenuProvider>
      {footer == null ? null : (
        <View style={styles.sectionFooter}>
          <RowText color={sectionTextColor} fontSize={sectionTextFontSize}>
            {resolveRenderProp(footer, renderContext)}
          </RowText>
        </View>
      )}
    </View>
  );
}

export function NativeListRoot({
  children,
  contextMenuProps,
  contentContainerStyle,
  defaultSelectedIds,
  disabledStyle,
  nativeHaptics,
  editMode,
  editModeIcon,
  editModeSelectedIcon,
  editModeSelectedSfSymbol,
  editModeSfSymbol,
  iosListStyle: _iosListStyle,
  listStyle = NATIVE_LIST_BASIC_DEFAULT_STYLE,
  listStyleOptions,
  onRefresh,
  onSelectedIdsChange,
  refreshColor,
  refreshEnabledInEditMode: _refreshEnabledInEditMode,
  scrollable = true,
  selectedIds,
  style,
  ...scrollViewProps
}: NativeListRootProps) {
  void _iosListStyle;
  void _refreshEnabledInEditMode;
  const backgrounds = useAppBackgroundColors();
  const theme = useUiTheme();
  const {
    borderColor,
    borderRadius,
    dividerColor,
    dividerPaddingLeft,
    dividerPaddingRight,
    dividerWidth,
    rowBackgroundColor,
    sectionShadow = NATIVE_LIST_BASIC_STYLE_DEFAULTS.sectionShadow,
    showBorder,
    showDivider = NATIVE_LIST_BASIC_STYLE_DEFAULTS.showDivider,
  } = listStyleOptions ?? {};
  const resolvedShowBorder = showBorder ?? listStyle === "rounded";
  const [refreshing, setRefreshing] = useState(false);
  const content = (
    <NativeListBasicStyleContext.Provider value={listStyle}>
      <NativeListBasicBorderRadiusContext.Provider value={borderRadius}>
        <NativeListBasicShowBorderContext.Provider value={resolvedShowBorder}>
          <NativeListBasicBorderColorContext.Provider value={borderColor}>
            <NativeListBasicDividerColorContext.Provider value={dividerColor}>
              <NativeListBasicRowBackgroundColorContext.Provider value={rowBackgroundColor}>
                <NativeListBasicSectionShadowContext.Provider value={sectionShadow}>
                  <NativeListBasicShowDividerContext.Provider value={showDivider}>
                    <NativeListBasicDividerWidthContext.Provider
                      value={dividerWidth ?? NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerWidth}
                    >
                      <NativeListBasicDividerPaddingContext.Provider
                        value={
                          dividerPaddingLeft ?? NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerPaddingLeft
                        }
                      >
                        <NativeListBasicDividerRightPaddingContext.Provider
                          value={
                            dividerPaddingRight ??
                            NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerPaddingRight
                          }
                        >
                          <NativeListContextMenuProvider
                            contextMenuProps={contextMenuProps}
                            disabledStyle={disabledStyle}
                          >
                            <NativeListHapticsProvider nativeHaptics={nativeHaptics}>
                              <NativeListEditModeProvider
                                defaultSelectedIds={defaultSelectedIds}
                                editMode={editMode}
                                editModeIcon={editModeIcon}
                                editModeSelectedIcon={editModeSelectedIcon}
                                editModeSelectedSfSymbol={editModeSelectedSfSymbol}
                                editModeSfSymbol={editModeSfSymbol}
                                onSelectedIdsChange={onSelectedIdsChange}
                                selectedIds={selectedIds}
                              >
                                {children}
                              </NativeListEditModeProvider>
                            </NativeListHapticsProvider>
                          </NativeListContextMenuProvider>
                        </NativeListBasicDividerRightPaddingContext.Provider>
                      </NativeListBasicDividerPaddingContext.Provider>
                    </NativeListBasicDividerWidthContext.Provider>
                  </NativeListBasicShowDividerContext.Provider>
                </NativeListBasicSectionShadowContext.Provider>
              </NativeListBasicRowBackgroundColorContext.Provider>
            </NativeListBasicDividerColorContext.Provider>
          </NativeListBasicBorderColorContext.Provider>
        </NativeListBasicShowBorderContext.Provider>
      </NativeListBasicBorderRadiusContext.Provider>
    </NativeListBasicStyleContext.Provider>
  );

  if (!scrollable) {
    return (
      <View style={[styles.root, { backgroundColor: backgrounds.screen }, style]}>{content}</View>
    );
  }

  return (
    <ScrollView
      {...scrollViewProps}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      refreshControl={
        onRefresh == null ? undefined : (
          <RefreshControl
            colors={[refreshColor ?? theme.primary]}
            enabled={!editMode}
            onRefresh={() => {
              setRefreshing(true);
              Promise.resolve(onRefresh()).finally(() => setRefreshing(false));
            }}
            refreshing={refreshing}
            tintColor={refreshColor ?? theme.primary}
          />
        )
      }
      style={[styles.root, { backgroundColor: backgrounds.screen }, style]}
    >
      {content}
    </ScrollView>
  );
}

export const NativeList = NativeListRoot;

const styles = StyleSheet.create({
  content: { paddingBottom: 24, paddingTop: 8 },
  customRowContent: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: 10,
    minHeight: 0,
    width: "100%",
  },
  contextMenuAnchor: {
    height: 1,
    left: "50%",
    position: "absolute",
    top: "50%",
    width: 1,
  },
  contextMenuAnchorTrigger: {
    height: 1,
    opacity: 0,
    width: 1,
  },
  contextMenuRow: {
    position: "relative",
    width: "100%",
  },
  icon: { alignItems: "center", justifyContent: "center", minWidth: 24 },
  labels: { flex: 1, gap: 2 },
  root: { flex: 1 },
  row: {
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 48,
    position: "relative",
    width: "100%",
  },
  rowDivider: { position: "absolute", zIndex: 1 },
  rowContent: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 0,
    width: "100%",
  },
  selectInlineLabel: { alignItems: "center", flexDirection: "row", gap: 8 },
  selectSwatch: { borderRadius: 7, height: 14, width: 14 },
  section: { gap: 6, marginBottom: 18, paddingHorizontal: 16 },
  sectionBody: {
    borderRadius: NATIVE_LIST_BASIC_STYLE_DEFAULTS.borderRadius,
    overflow: "hidden",
  },
  sectionBodyBorder: { borderWidth: NATIVE_LIST_BASIC_STYLE_DEFAULTS.borderWidth },
  sectionBodyPlain: { borderRadius: 0 },
  sectionShadow: {},
  sectionShadowDefault: {
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  sectionFullWidth: { paddingHorizontal: 0 },
  sectionFooter: { paddingHorizontal: 12 },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});
