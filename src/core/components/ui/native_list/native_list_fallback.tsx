import { HeaderHeightContext } from "@react-navigation/elements";
import { NavigationContext } from "@react-navigation/native";
import { Check, ChevronRight, ChevronsUpDown } from "@tamagui/lucide-icons-2";
import {
  Children,
  createContext,
  forwardRef,
  useCallback,
  type ComponentRef,
  type ComponentProps,
  type ComponentType,
  type ReactElement,
  type ReactNode,
  type RefObject,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";

import { isIos15, isWeb, os } from "../utils/platform";
import { useAppBackgroundColors, useUiPreferences } from "../utils/theme";

import { Input } from "../input";
import { ContextMenu } from "../context_menu";
import { Menu } from "../menu";
import { NativeTriggerPressable } from "../native_trigger";
import { Select } from "../select";
import { NativePickerSwiftUI } from "../select/native_picker";
import type { NativePickerSwiftUIHandle } from "../select/native_picker";
import { resolveSelectItemGroups } from "../select/select_grouping";
import {
  getTrueSheetScrollBottomPadding,
  getTrueSheetScrollIndicatorBottomInset,
} from "../sheet/native_sheet/true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { Switch } from "../switch";
import { SizableText, Text } from "../text";
import { TextArea } from "../text_area";
import {
  triggerNativeHaptics,
  useNavigationBarScrollEdge,
  useResolvedNativeHaptics,
} from "../utils";
import {
  NativeListEditModeProvider,
  NativeListEditRowIdProvider,
  useNativeListEditIcons,
  useNativeListEditMode,
  useNativeListEditRow,
} from "./edit_mode";
import {
  NativeListContextMenuProvider,
  resolveNativeListContextMenu,
  useResolvedNativeListContextMenu,
} from "./context_menu";
import { renderNativeListSectionContent } from "./section_content";
import type {
  NativeListActionItemProps,
  NativeListButtonItemProps,
  NativeListCustomItemProps,
  NativeListContextMenuProps,
  NativeListItemBaseProps,
  NativeListInputItemProps,
  NativeListItemPaddingProps,
  NativeListItemProps,
  NativeListMenuItemProps,
  NativeListNavigationItemProps,
  NativeListRootProps,
  NativeListSectionProps,
  NativeListSelectItemProps,
  NativeListSwitchItemProps,
  NativeListTextAreaItemProps,
} from "./types";

type RowContainerProps = NativeListItemPaddingProps & {
  backgroundColor?: ViewStyle["backgroundColor"];
  children: ReactNode;
  contextMenuProps?: NativeListContextMenuProps | false;
  disabled?: boolean;
  editingSelected?: boolean;
  hoverBackgroundColor?: ViewStyle["backgroundColor"];
  nativeHaptics?: NativeListItemBaseProps["nativeHaptics"];
  onPress?: () => void;
  pressResetToken?: number;
  pressBackgroundColor?: ViewStyle["backgroundColor"];
};

type PressableHoverEvent = Parameters<
  NonNullable<ComponentProps<typeof Pressable>["onHoverIn"]>
>[0];

type NativeMenuHandle = {
  presentMenu: () => void;
};

function useInlineNativeTriggerGuard() {
  const triggerInteractionRef = useRef(false);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (clearTimerRef.current != null) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  };
  const beginTriggerInteraction = (event?: GestureResponderEvent) => {
    event?.stopPropagation();
    clearTimer();
    triggerInteractionRef.current = true;
  };
  const finishTriggerInteraction = (event?: GestureResponderEvent) => {
    event?.stopPropagation();
    clearTimer();
    // Keep the marker through Pressable's touch-end -> onPress handoff. The native
    // trigger has already opened the menu, so the parent row must not open it again.
    clearTimerRef.current = setTimeout(() => {
      triggerInteractionRef.current = false;
      clearTimerRef.current = null;
    }, 750);
  };
  const cancelTriggerInteraction = (event?: GestureResponderEvent) => {
    event?.stopPropagation();
    clearTimer();
    triggerInteractionRef.current = false;
  };
  const consumeTriggerInteraction = () => {
    if (!triggerInteractionRef.current) return false;

    cancelTriggerInteraction();
    return true;
  };

  useEffect(() => cancelTriggerInteraction, []);

  return {
    beginTriggerInteraction,
    cancelTriggerInteraction,
    consumeTriggerInteraction,
    finishTriggerInteraction,
  };
}

type FallbackListEntry =
  | {
      key: string;
      sectionKey: string;
      title?: ReactNode;
      titleColor?: string;
      titleFontSize?: number;
      trailing?: ReactNode;
      type: "sectionHeader";
    }
  | {
      contextMenuProps?: NativeListContextMenuProps;
      key: string;
      nativeScrollId?: string | number;
      renderRow: () => ReactElement | null;
      sectionKey: string;
      type: "row";
    }
  | {
      footer: ReactNode;
      key: string;
      sectionKey: string;
      type: "sectionFooter";
    };

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

type NavigationWithFocusEvents = {
  addListener: (event: "blur" | "focus" | "transitionEnd", listener: () => void) => () => void;
  isFocused: () => boolean;
};

type WebScrollableNode = {
  scrollTop: number;
};

const WEB_SCROLL_RESTORE_STABLE_FRAMES = 8;
const WEB_SCROLL_RESTORE_MAX_FRAMES = 30;
const WEB_SCROLL_RESTORE_TOLERANCE = 1;
const DEFAULT_TEXT_AREA_LINES = 4;
const TEXT_AREA_LINE_HEIGHT = 24;
const TEXT_AREA_VERTICAL_PADDING = 20;

const FallbackListInteractionContext = createContext<{
  captureScrollPosition: () => void;
  scrollGenerationRef: RefObject<number>;
} | null>(null);

function getWebScrollableNode(list: FlatList<FallbackListEntry> | null): WebScrollableNode | null {
  try {
    const scrollableNode = list?.getScrollableNode() as WebScrollableNode | null | undefined;
    return scrollableNode != null && typeof scrollableNode.scrollTop === "number"
      ? scrollableNode
      : null;
  } catch {
    // FlatList can expose its public ref one render before the inner scroll node is ready.
    return null;
  }
}

function resolveTextAreaHeight(textAreaProps: NativeListTextAreaItemProps["textAreaProps"]) {
  const style = StyleSheet.flatten(textAreaProps.style) as {
    height?: unknown;
    minHeight?: unknown;
  };
  const numberOfLines =
    typeof textAreaProps.numberOfLines === "number"
      ? textAreaProps.numberOfLines
      : DEFAULT_TEXT_AREA_LINES;
  const configuredHeight =
    typeof style?.height === "number"
      ? style.height
      : typeof style?.minHeight === "number"
        ? style.minHeight
        : undefined;

  return (
    configuredHeight ??
    Math.max(100, numberOfLines * TEXT_AREA_LINE_HEIGHT + TEXT_AREA_VERTICAL_PADDING)
  );
}

function useFallbackRowThemeColors() {
  const appBackgroundColors = useAppBackgroundColors();
  const { preferences } = useUiPreferences();
  const theme = useTheme();
  // When the page background follows an accent theme, color2 may be visually indistinguishable
  // from theme.background. Use the next surface step so fallback rows retain list hierarchy.
  const defaultRowBackground = preferences.appearance.backgroundFollowsTheme
    ? (theme.color3?.val ?? appBackgroundColors.card)
    : appBackgroundColors.card;

  return { defaultRowBackground, theme };
}

function resolveFallbackRowPadding({
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
}: NativeListItemPaddingProps): ViewStyle | undefined {
  if (
    paddingBottom == null &&
    paddingHorizontal == null &&
    paddingLeft == null &&
    paddingRight == null &&
    paddingTop == null &&
    paddingVertical == null
  ) {
    return undefined;
  }

  return {
    ...((paddingTop ?? paddingVertical) != null
      ? { paddingTop: paddingTop ?? paddingVertical }
      : null),
    ...((paddingRight ?? paddingHorizontal) != null
      ? { paddingRight: paddingRight ?? paddingHorizontal }
      : null),
    ...((paddingBottom ?? paddingVertical) != null
      ? { paddingBottom: paddingBottom ?? paddingVertical }
      : null),
    ...((paddingLeft ?? paddingHorizontal) != null
      ? { paddingLeft: paddingLeft ?? paddingHorizontal }
      : null),
  };
}

function FallbackRowContainer({
  backgroundColor,
  children,
  contextMenuProps,
  disabled,
  editingSelected,
  hoverBackgroundColor,
  nativeHaptics,
  onPress,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
  pressResetToken,
  pressBackgroundColor,
}: RowContainerProps) {
  const listInteraction = useContext(FallbackListInteractionContext);
  const captureListScrollPosition = listInteraction?.captureScrollPosition;
  const listScrollGenerationRef = listInteraction?.scrollGenerationRef;
  const editMode = useNativeListEditMode();
  const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
  const contextMenuRef = useRef<NativeMenuHandle | null>(null);
  const activeNativeContextMenuProps =
    !isWeb() &&
    !editMode &&
    resolvedContextMenuProps != null &&
    !resolvedContextMenuProps.triggerProps?.disabled
      ? resolvedContextMenuProps
      : undefined;
  // iOS 必须将 UIContextMenuInteraction 直接挂载到可见行。通过隐藏锚点弹出菜单会绕过
  // 原生的按压与取消生命周期，导致 Pressable、TextInput 和列表滚动手势争抢同一次触摸。
  // Android 继续使用现有的程序式锚点实现。
  const usesIosNativeContextMenuTrigger = os() === "ios" && activeNativeContextMenuProps != null;
  const programmaticContextMenuProps = usesIosNativeContextMenuTrigger
    ? undefined
    : activeNativeContextMenuProps;
  const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
  const { defaultRowBackground, theme } = useFallbackRowThemeColors();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const usesIosSwitchPressFallback = os() === "ios" && pressResetToken != null;
  const usesIos15PressRecovery = isIos15() && onPress != null;
  const ios15PressScrollGenerationRef = useRef<number | null>(null);
  const ios15PressHandledRef = useRef(false);
  // A native UISwitch can take over a gesture after the parent Pressable has already
  // entered its pressed state, without delivering a matching press-out event to it.
  // Keep the visual state under our control so an embedded control can clear it.
  useEffect(() => {
    if (usesIosSwitchPressFallback) {
      setPressed(false);
    }
  }, [pressResetToken, usesIosSwitchPressFallback]);
  const resolvedRowPadding = resolveFallbackRowPadding({
    paddingBottom,
    paddingHorizontal,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingVertical,
  });
  // Read interactive colors while this component renders so Tamagui can track these
  // theme tokens. Reading them only inside Pressable's render callback can retain the
  // previous token values when "system" resolves to a different color scheme.
  const normalRowBackground = backgroundColor ?? defaultRowBackground;
  const pressedRowBackground =
    pressBackgroundColor ??
    theme.color5?.val ??
    theme.backgroundPress?.val ??
    theme.background?.val;
  const hoveredRowBackground =
    hoverBackgroundColor ??
    theme.color4?.val ??
    theme.backgroundHover?.val ??
    theme.background?.val;

  const getRowBackground = (pressed = false) => ({
    backgroundColor: editingSelected
      ? pressedRowBackground
      : pressed && !disabled
        ? pressedRowBackground
        : hovered && !disabled
          ? hoveredRowBackground
          : normalRowBackground,
  });

  const contextMenuAnchor =
    programmaticContextMenuProps != null ? (
      <FallbackNativeContextMenuAnchor
        contextMenuProps={programmaticContextMenuProps}
        menuRef={contextMenuRef}
      />
    ) : null;

  const wrapIosNativeContextMenu = (row: ReactElement) =>
    usesIosNativeContextMenuTrigger ? (
      <ContextMenu
        {...activeNativeContextMenuProps}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            ios15PressScrollGenerationRef.current = null;
            ios15PressHandledRef.current = true;
          }
          activeNativeContextMenuProps.onOpenChange?.(nextOpen);
        }}
        trigger={row}
        triggerProps={{
          ...activeNativeContextMenuProps.triggerProps,
          style: [styles.contextMenuRow, activeNativeContextMenuProps.triggerProps?.style] as any,
        }}
      />
    ) : (
      row
    );

  const handleRowPress = () => {
    if (usesIos15PressRecovery) {
      if (ios15PressHandledRef.current) {
        return;
      }
      ios15PressHandledRef.current = true;
    }

    captureListScrollPosition?.();
    onPress?.();
    triggerNativeHaptics(resolvedHaptics);
  };

  const armIos15PressRecovery = () => {
    ios15PressScrollGenerationRef.current = listScrollGenerationRef?.current ?? 0;
    ios15PressHandledRef.current = false;
  };

  const handlePressIn = () => {
    if (usesIosSwitchPressFallback) {
      setPressed(true);
    }
    if (usesIos15PressRecovery && !editMode) {
      armIos15PressRecovery();
    }
  };

  const handleTouchStart = (_event: GestureResponderEvent) => {
    if (usesIos15PressRecovery && editMode) {
      armIos15PressRecovery();
    }
  };

  const clearIos15Press = () => {
    ios15PressScrollGenerationRef.current = null;
  };

  const handleTouchCancel = () => {
    if (usesIosSwitchPressFallback) {
      setPressed(false);
    }
    clearIos15Press();
  };

  const handleTouchEnd = (_event: GestureResponderEvent) => {
    if (usesIosSwitchPressFallback) {
      setPressed(false);
    }
    const touchScrollGeneration = ios15PressScrollGenerationRef.current;
    clearIos15Press();
    if (
      !usesIos15PressRecovery ||
      touchScrollGeneration == null ||
      touchScrollGeneration !== (listScrollGenerationRef?.current ?? 0)
    ) {
      return;
    }

    // iOS 15 偶尔会在原始触摸正常结束后丢失 Pressable.onPress/onPressOut。
    // 直接用触摸结束完成点击；若 FlatList 已开始滚动，上面的滚动代次会阻止触发。
    handleRowPress();
  };

  if (onPress == null && programmaticContextMenuProps == null) {
    return wrapIosNativeContextMenu(
      <View
        style={[
          styles.rowContainer,
          resolvedRowPadding,
          getRowBackground(),
          disabled ? styles.disabledContent : null,
        ]}
      >
        {children}
      </View>,
    );
  }

  const row = (
    <Pressable
      disabled={disabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={usesIosSwitchPressFallback || usesIos15PressRecovery ? handlePressIn : undefined}
      onLongPress={
        programmaticContextMenuProps != null
          ? () => contextMenuRef.current?.presentMenu()
          : undefined
      }
      onPress={onPress != null ? handleRowPress : undefined}
      onPressOut={usesIosSwitchPressFallback ? () => setPressed(false) : undefined}
      onTouchCancel={
        usesIosSwitchPressFallback || usesIos15PressRecovery ? handleTouchCancel : undefined
      }
      onTouchEnd={
        usesIosSwitchPressFallback || usesIos15PressRecovery ? handleTouchEnd : undefined
      }
      onTouchStart={usesIos15PressRecovery && editMode ? handleTouchStart : undefined}
      style={styles.pressable}
    >
      {({ pressed: pressablePressed }) => (
        <View
          style={[
            styles.rowContainer,
            resolvedRowPadding,
            getRowBackground(usesIosSwitchPressFallback ? pressed : pressablePressed),
            disabled ? styles.disabledContent : null,
          ]}
        >
          {children}
        </View>
      )}
    </Pressable>
  );

  if (usesIosNativeContextMenuTrigger) {
    return wrapIosNativeContextMenu(row);
  }

  if (contextMenuAnchor == null) {
    return row;
  }

  return (
    <View collapsable={false} style={styles.contextMenuRow}>
      {row}
      {contextMenuAnchor}
    </View>
  );
}

function FallbackNativeContextMenuAnchor({
  contextMenuProps,
  menuRef,
}: {
  contextMenuProps: NativeListContextMenuProps;
  menuRef: RefObject<NativeMenuHandle | null>;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.contextMenuAnchor,
        os() === "android" ? styles.contextMenuAnchorCenter : styles.contextMenuAnchorEnd,
      ]}
    >
      <ContextMenu
        {...contextMenuProps}
        trigger={<View collapsable={false} style={styles.contextMenuAnchorTrigger} />}
        {...({ __menuRef: menuRef } as any)}
      />
    </View>
  );
}

function FallbackNativeContextMenuHost({
  children,
  contextMenuProps,
  menuRef,
}: {
  children: ReactElement;
  contextMenuProps?: NativeListContextMenuProps;
  menuRef: RefObject<NativeMenuHandle | null>;
}) {
  if (contextMenuProps == null) {
    return children;
  }

  return (
    <View collapsable={false} style={styles.contextMenuRow}>
      {children}
      <FallbackNativeContextMenuAnchor contextMenuProps={contextMenuProps} menuRef={menuRef} />
    </View>
  );
}

function FallbackEditingIndicator({ selected }: { selected: boolean }) {
  const theme = useTheme();
  const { editModeIcon, editModeSelectedIcon } = useNativeListEditIcons();
  const customIcon = selected ? editModeSelectedIcon : editModeIcon;
  const accentColor = theme.accent10?.val ?? theme.color10?.val ?? theme.color?.val;
  const borderColor = theme.gray8?.val ?? theme.color7?.val ?? theme.borderColor?.val;

  if (customIcon != null) {
    return <View style={styles.editingIndicatorSlot}>{customIcon}</View>;
  }

  return (
    <View
      style={[
        styles.editingIndicator,
        {
          backgroundColor: selected ? accentColor : "transparent",
          borderColor: selected ? accentColor : borderColor,
        },
      ]}
    >
      {selected ? <Check color="white" size={15} strokeWidth={3} /> : null}
    </View>
  );
}

type NativeListRowProps = NativeListItemBaseProps & {
  iconAfter?: ReactNode;
  labelOpacity?: number;
  pressResetToken?: number;
  valueOpacity?: number;
};

function renderTitleNode(
  title: ReactNode,
  titleColor: string | false | undefined,
  titleFontSize: number | undefined,
  textAlign: "center" | "left" | "right",
) {
  if (title == null || typeof title === "boolean") {
    return null;
  }

  if (typeof title === "string" || typeof title === "number") {
    const titleStyle = {
      ...(titleColor ? { color: titleColor } : null),
      ...(titleFontSize != null ? { fontSize: titleFontSize } : null),
      textAlign,
    };

    return (
      <SizableText numberOfLines={1} size="$true" style={titleStyle}>
        {title}
      </SizableText>
    );
  }

  return title;
}

function renderSubtitleNode(
  subtitle: ReactNode,
  subtitleColor?: string,
  subtitleFontSize?: number,
) {
  if (subtitle == null || typeof subtitle === "boolean") {
    return null;
  }

  if (typeof subtitle === "string" || typeof subtitle === "number") {
    return (
      <Text
        color={subtitleColor as any}
        opacity={subtitleColor == null ? 0.6 : 1}
        fontSize={subtitleFontSize ?? "$3"}
        numberOfLines={4}
      >
        {subtitle}
      </Text>
    );
  }

  return subtitle;
}

function renderValueNode(
  value: ReactNode,
  valueColor?: string,
  valueFontSize?: number,
  valueOpacity?: number,
) {
  if (value == null || typeof value === "boolean") {
    return null;
  }

  if (typeof value === "string" || typeof value === "number") {
    return (
      <Text
        color={(valueColor ?? "$color") as any}
        fontSize={valueFontSize ?? "$4"}
        numberOfLines={1}
        opacity={valueOpacity ?? (valueColor == null ? 0.58 : 1)}
      >
        {value}
      </Text>
    );
  }

  return valueOpacity == null ? value : <View style={{ opacity: valueOpacity }}>{value}</View>;
}

function NativeListRow({
  backgroundColor,
  chevron = false,
  chevronColor,
  contextMenuProps,
  disabled,
  hoverBackgroundColor,
  icon,
  iconAfter,
  iconSlotWidth,
  labelOpacity = 1,
  nativeHaptics,
  nativeScrollId,
  onPress,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
  pressResetToken,
  pressBackgroundColor,
  selectionId,
  selectionDisabled,
  selected = false,
  subtitle,
  subtitleColor,
  subtitleFontSize,
  trailing,
  title,
  titleAlign,
  titleColor,
  titleFontSize,
  value,
  valueColor,
  valueFontSize,
  valueOpacity,
}: NativeListRowProps) {
  const editRow = useNativeListEditRow({
    disabled,
    nativeScrollId,
    onPress,
    selectionId,
    selectionDisabled,
  });
  const titleAlignment =
    titleAlign === "center" ? "center" : titleAlign === "right" ? "flex-end" : "flex-start";
  const textAlign = titleAlign === "center" ? "center" : titleAlign === "right" ? "right" : "left";
  const titleNode = renderTitleNode(title, titleColor, titleFontSize, textAlign);
  const subtitleNode = renderSubtitleNode(subtitle, subtitleColor, subtitleFontSize);
  const valueNode = renderValueNode(value, valueColor, valueFontSize, valueOpacity);
  const trailingNode = renderValueNode(trailing);
  const customIcon = icon;

  return (
    <FallbackRowContainer
      backgroundColor={backgroundColor}
      contextMenuProps={contextMenuProps}
      disabled={disabled}
      editingSelected={editRow.editingSelected}
      hoverBackgroundColor={hoverBackgroundColor}
      nativeHaptics={nativeHaptics}
      onPress={editRow.onPress}
      paddingBottom={paddingBottom}
      paddingHorizontal={paddingHorizontal}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingTop={paddingTop}
      paddingVertical={paddingVertical}
      pressResetToken={pressResetToken}
      pressBackgroundColor={pressBackgroundColor}
    >
      <View pointerEvents={editRow.editMode ? "none" : "auto"} style={styles.rowContent}>
        {editRow.selectionEnabled ? (
          <FallbackEditingIndicator selected={editRow.editingSelected} />
        ) : null}
        {customIcon != null ? (
          <View
            style={[
              styles.iconBefore,
              iconSlotWidth != null ? { width: iconSlotWidth } : undefined,
            ]}
          >
            {customIcon}
          </View>
        ) : null}
        <View style={[styles.textColumn, { alignItems: titleAlignment, opacity: labelOpacity }]}>
          {titleNode}
          {subtitleNode}
        </View>
        <View style={styles.iconAfterRow}>
          {valueNode}
          {!editRow.editMode && selected ? <Check color="$accent10" size={18} /> : null}
          {trailingNode}
          {iconAfter}
          {!editRow.editMode && chevron ? (
            <ChevronRight
              color={(chevronColor ?? "$color") as ComponentProps<typeof ChevronRight>["color"]}
              opacity={chevronColor == null ? 0.58 : 1}
              size={18}
            />
          ) : null}
        </View>
      </View>
    </FallbackRowContainer>
  );
}

type PressRowProps = NativeListItemBaseProps & {
  trailingControl?: ReactNode;
};

function FallbackPressRow({ trailingControl, ...props }: PressRowProps) {
  return <NativeListRow {...props} iconAfter={trailingControl} />;
}

function getSelectedLabel(selectProps: NativeListSelectItemProps["selectProps"]) {
  const selectedValue = selectProps.value ?? selectProps.defaultValue;
  const items = [
    ...(selectProps.items ?? selectProps.options ?? []),
    ...(selectProps.itemGroups?.flatMap((group) => group.items) ?? []),
  ];

  return (
    items.find((item) => item.value === selectedValue)?.label ??
    (typeof selectProps.placeholder === "string" ? selectProps.placeholder : "")
  );
}

function getNodeKey(node: ReactNode, fallback: string) {
  if (isValidElement(node) && node.key != null) {
    return String(node.key);
  }

  return fallback;
}

function getNativeScrollId(node: ReactNode) {
  if (!isValidElement<NativeListItemBaseProps>(node)) {
    return undefined;
  }

  return node.props.nativeScrollId;
}

function getFallbackContextMenuProps(node: ReactNode) {
  if (!isValidElement<{ contextMenuProps?: NativeListContextMenuProps | false }>(node)) {
    return undefined;
  }

  return node.props.contextMenuProps;
}

function isNativeListSectionType(type: ReactElement["type"]) {
  if (type === NativeListSection) {
    return true;
  }

  return typeof type === "function" && type.name === "NativeListSection";
}

function isNativeListSectionElement(node: ReactNode): node is ReactElement<NativeListSectionProps> {
  return isValidElement<NativeListSectionProps>(node) && isNativeListSectionType(node.type);
}

function isNativeListElementType<Props>(
  node: ReactNode,
  type: ComponentType<Props>,
): node is ReactElement<Props> {
  return isValidElement<Props>(node) && node.type === type;
}

function createFallbackRowEntry(
  child: ReactNode,
  key: string,
  sectionKey: string,
  inheritedContextMenuProps?: NativeListContextMenuProps,
): FallbackListEntry {
  const contextMenuProps = resolveNativeListContextMenu(
    getFallbackContextMenuProps(child),
    inheritedContextMenuProps,
  );

  if (isNativeListElementType(child, NativeListActionItem)) {
    return {
      contextMenuProps,
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListActionItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListNavigationItem)) {
    return {
      contextMenuProps,
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListNavigationItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListSwitchItem)) {
    return {
      contextMenuProps,
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListSwitchItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListSelectItem)) {
    return {
      contextMenuProps,
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListSelectItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListMenuItem)) {
    return {
      contextMenuProps,
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListMenuItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListButtonItem)) {
    return {
      contextMenuProps,
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListButtonItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListInputItem)) {
    return {
      contextMenuProps,
      key,
      renderRow: () => <NativeListInputItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListTextAreaItem)) {
    return {
      contextMenuProps,
      key,
      renderRow: () => <NativeListTextAreaItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListItem)) {
    return {
      contextMenuProps,
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListCustomItem)) {
    return {
      contextMenuProps,
      key,
      nativeScrollId: getNativeScrollId(child),
      renderRow: () => <NativeListCustomItem {...child.props} />,
      sectionKey,
      type: "row",
    };
  }

  return {
    contextMenuProps,
    key,
    nativeScrollId: getNativeScrollId(child),
    renderRow: () => (isValidElement(child) ? child : null),
    sectionKey,
    type: "row",
  };
}

const FallbackListRowFrame = forwardRef<ComponentRef<typeof View>, ComponentProps<typeof View>>(
  function FallbackListRowFrame({ children, style, ...viewProps }, forwardedRef) {
    return (
      <View ref={forwardedRef} {...viewProps} collapsable={false} style={[styles.rowFrame, style]}>
        {children}
      </View>
    );
  },
);

function FallbackListContextMenuRow({
  children,
  contextMenuProps,
}: {
  children: ReactElement;
  contextMenuProps?: NativeListContextMenuProps;
}) {
  const editMode = useNativeListEditMode();

  if (editMode || contextMenuProps == null) {
    return children;
  }

  if (isWeb()) {
    return <ContextMenu {...contextMenuProps} trigger={children} />;
  }

  return (
    <NativeListContextMenuProvider contextMenuProps={contextMenuProps}>
      {children}
    </NativeListContextMenuProvider>
  );
}

function appendSectionEntries(
  entries: FallbackListEntry[],
  sectionProps: NativeListSectionProps,
  sectionKey: string,
  inheritedContextMenuProps?: NativeListContextMenuProps,
) {
  const sectionChildren = Children.toArray(sectionProps.children);
  const footer = renderNativeListSectionContent(sectionProps.footer);
  const title = renderNativeListSectionContent(sectionProps.title);
  const trailing = renderNativeListSectionContent(sectionProps.trailing);
  const sectionContextMenuProps = resolveNativeListContextMenu(
    sectionProps.contextMenuProps,
    inheritedContextMenuProps,
  );
  const hasSectionContent =
    title != null || trailing != null || sectionChildren.length > 0 || footer != null;

  if (!hasSectionContent) {
    return;
  }

  if (title != null || trailing != null) {
    entries.push({
      key: `${sectionKey}-header`,
      sectionKey,
      title,
      titleColor: sectionProps.titleColor,
      titleFontSize: sectionProps.titleFontSize,
      trailing,
      type: "sectionHeader",
    });
  }

  sectionChildren.forEach((child, index) => {
    entries.push(
      createFallbackRowEntry(
        child,
        `${sectionKey}-row-${getNodeKey(child, String(index))}`,
        sectionKey,
        sectionContextMenuProps,
      ),
    );
  });

  if (footer != null) {
    entries.push({
      footer,
      key: `${sectionKey}-footer`,
      sectionKey,
      type: "sectionFooter",
    });
  }
}

function createFallbackListEntries(
  children: ReactNode,
  contextMenuProps?: NativeListContextMenuProps,
) {
  const entries: FallbackListEntry[] = [];

  Children.toArray(children).forEach((child, index) => {
    if (isNativeListSectionElement(child)) {
      appendSectionEntries(
        entries,
        child.props,
        getNodeKey(child, `section-${index}`),
        contextMenuProps,
      );
      return;
    }

    entries.push(
      createFallbackRowEntry(
        child,
        `direct-row-${getNodeKey(child, String(index))}`,
        `direct-${index}`,
        contextMenuProps,
      ),
    );
  });

  return entries;
}

function renderFallbackListEntry({
  item,
}: Pick<ListRenderItemInfo<FallbackListEntry>, "item">): ReactElement | null {
  switch (item.type) {
    case "sectionHeader":
      return (
        <View style={styles.sectionLabel}>
          <View style={styles.sectionTitle}>
            {typeof item.title === "string" || typeof item.title === "number" ? (
              <Text
                color={(item.titleColor ?? "$color10") as any}
                fontSize={item.titleFontSize ?? "$3"}
              >
                {item.title}
              </Text>
            ) : (
              item.title
            )}
          </View>
          {item.trailing != null ? (
            <View style={styles.sectionTrailing}>
              {typeof item.trailing === "string" || typeof item.trailing === "number" ? (
                <Text color="$accent10" fontSize="$4">
                  {item.trailing}
                </Text>
              ) : (
                item.trailing
              )}
            </View>
          ) : null}
        </View>
      );
    case "row":
      return (
        <NativeListEditRowIdProvider selectionId={item.nativeScrollId ?? item.key}>
          <FallbackListContextMenuRow contextMenuProps={item.contextMenuProps}>
            <FallbackListRowFrame>{item.renderRow()}</FallbackListRowFrame>
          </FallbackListContextMenuRow>
        </NativeListEditRowIdProvider>
      );
    case "sectionFooter":
      return (
        <View style={styles.sectionFooter}>
          {typeof item.footer === "string" || typeof item.footer === "number" ? (
            <Text color="$color10" fontSize="$3">
              {item.footer}
            </Text>
          ) : (
            item.footer
          )}
        </View>
      );
  }
}

function FallbackListItemSeparator({
  leadingItem,
  trailingItem,
}: {
  leadingItem?: FallbackListEntry;
  trailingItem?: FallbackListEntry;
}) {
  const theme = useTheme();

  if (leadingItem == null || trailingItem == null) {
    return null;
  }

  if (leadingItem.sectionKey !== trailingItem.sectionKey) {
    return <View style={styles.sectionSpacer} />;
  }

  if (leadingItem.type === "row" && trailingItem.type === "row") {
    return (
      <View style={styles.rowSeparatorOuter}>
        <View
          style={[
            styles.rowSeparator,
            { backgroundColor: theme.borderColor?.val ?? theme.color4?.val },
          ]}
        />
      </View>
    );
  }

  return null;
}

function renderStaticEntries(entries: FallbackListEntry[]) {
  return entries.map((entry, index) => {
    const trailingItem = entries[index + 1];

    return (
      <View key={entry.key}>
        {renderFallbackListEntry({ item: entry })}
        <FallbackListItemSeparator leadingItem={entry} trailingItem={trailingItem} />
      </View>
    );
  });
}

function getEntryKey(item: FallbackListEntry) {
  return item.key;
}

function getInitialScrollIndex(
  entries: FallbackListEntry[],
  initialScrollTarget?: string | number,
) {
  if (initialScrollTarget == null) {
    return undefined;
  }

  const index = entries.findIndex((entry) => {
    return entry.type === "row" && entry.nativeScrollId === initialScrollTarget;
  });

  return index >= 0 ? index : undefined;
}

export function NativeListActionItem(props: NativeListActionItemProps) {
  return <FallbackPressRow {...props} chevron={props.chevron} />;
}

export function NativeListNavigationItem(props: NativeListNavigationItemProps) {
  return <FallbackPressRow {...props} chevron={props.chevron ?? true} />;
}

export function NativeListSwitchItem({ switchProps, ...itemProps }: NativeListSwitchItemProps) {
  const checked = switchProps.checked ?? switchProps.defaultChecked ?? false;
  const disabled = itemProps.disabled || switchProps.disabled;
  const isIos = os() === "ios";
  const [pressResetToken, setPressResetToken] = useState(0);
  const switchGestureResetRef = useRef(false);
  const resetRowPress = () => {
    if (isIos) {
      setPressResetToken((token) => token + 1);
    }
  };
  const resetRowPressDuringDrag = () => {
    if (switchGestureResetRef.current) return;

    switchGestureResetRef.current = true;
    resetRowPress();
  };
  const finishSwitchGesture = () => {
    switchGestureResetRef.current = false;
    resetRowPress();
  };
  const editMode = useNativeListEditMode();
  const switchDisabled = disabled || editMode;

  return (
    <NativeListRow
      {...itemProps}
      disabled={disabled}
      nativeHaptics={itemProps.nativeHaptics ?? !editMode}
      onPress={() => switchProps.onCheckedChange?.(!checked)}
      pressResetToken={isIos ? pressResetToken : undefined}
      iconAfter={
        <View style={styles.trailingControl}>
          <Switch
            {...switchProps}
            disabled={switchDisabled}
            native
            onPress={(event) => {
              switchProps.onPress?.(event);
              event.stopPropagation();
              resetRowPress();
            }}
            {...(isIos
              ? {
                  onCheckedChange: (nextChecked: boolean) => {
                    switchProps.onCheckedChange?.(nextChecked);
                    finishSwitchGesture();
                  },
                  onPressOut: (
                    event: Parameters<NonNullable<typeof switchProps.onPressOut>>[0],
                  ) => {
                    switchProps.onPressOut?.(event);
                    finishSwitchGesture();
                  },
                  onResponderTerminate: (event: GestureResponderEvent) => {
                    switchProps.onResponderTerminate?.(event);
                    finishSwitchGesture();
                  },
                  onTouchCancel: (event: GestureResponderEvent) => {
                    switchProps.onTouchCancel?.(event);
                    finishSwitchGesture();
                  },
                  onTouchEnd: (event: GestureResponderEvent) => {
                    switchProps.onTouchEnd?.(event);
                    event.stopPropagation();
                    finishSwitchGesture();
                  },
                  onTouchMove: (event: GestureResponderEvent) => {
                    switchProps.onTouchMove?.(event);
                    // UISwitch can retain the native gesture after it leaves the row and omit
                    // the matching JS press-out. Clear the row as soon as a drag is observed.
                    resetRowPressDuringDrag();
                  },
                  onTouchStart: (event: GestureResponderEvent) => {
                    switchGestureResetRef.current = false;
                    switchProps.onTouchStart?.(event);
                  },
                }
              : null)}
          />
        </View>
      }
    />
  );
}

export function NativeListButtonItem({
  title,
  onPress,
  disabled,
  titleAlign = "center",
  btnTint,
  ...itemProps
}: NativeListButtonItemProps) {
  const theme = useTheme();
  const defaultColor = theme.color10.val;
  const resolveColor = btnTint ?? defaultColor;

  return (
    <NativeListItem
      {...itemProps}
      btnTint={resolveColor}
      titleAlign={titleAlign}
      title={title}
      disabled={disabled}
      onPress={onPress}
    />
  );
}

/**
 * A full-width editable text field that follows the surrounding NativeList row styling.
 * `clearButtonMode` defaults to `while-editing` so iOS gets the familiar clear affordance.
 */
export function NativeListInputItem({ inputProps, ...itemProps }: NativeListInputItemProps) {
  const theme = useTheme();
  const disabled = itemProps.disabled || inputProps.disabled;
  const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
  const {
    autoFocusNative,
    disabled: _inputDisabled,
    style: inputStyle,
    unstyled,
    ...nativeInputProps
  } = inputProps;
  const resolvedInputBackground =
    (StyleSheet.flatten(inputStyle) as ViewStyle | undefined)?.backgroundColor ?? "transparent";
  const inputStyleWithLayout = StyleSheet.flatten([
    styles.input,
    !hasLeadingLabel ? styles.fullWidthInput : null,
    { color: theme.gray12?.val ?? theme.color.val },
    inputStyle,
  ]);
  const inputFocusStyle = {
    borderColor: "transparent",
    borderWidth: 0,
    outlineColor: "transparent",
    outlineStyle: "none",
    outlineWidth: 0,
    ...(inputProps.focusStyle as object),
  };
  const inputFocusVisibleStyle = {
    borderColor: "transparent",
    borderWidth: 0,
    outlineColor: "transparent",
    outlineStyle: "none",
    outlineWidth: 0,
    ...(inputProps.focusVisibleStyle as object),
  };
  const resolvedInput = isWeb() ? (
    <Input
      {...(nativeInputProps as any)}
      autoFocus={autoFocusNative ?? inputProps.autoFocus ?? false}
      backgroundColor={resolvedInputBackground as any}
      borderWidth={0}
      disabled={disabled}
      focusStyle={inputFocusStyle as any}
      focusVisibleStyle={inputFocusVisibleStyle as any}
      placeholderTextColor={
        inputProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val
      }
      style={inputStyleWithLayout as any}
      textAlign={inputProps.textAlign ?? (hasLeadingLabel ? "right" : undefined)}
      unstyled={unstyled}
    />
  ) : (
    <TextInput
      {...(nativeInputProps as any)}
      autoFocus={autoFocusNative ?? inputProps.autoFocus ?? false}
      textAlign={inputProps.textAlign ?? (hasLeadingLabel ? "right" : undefined)}
      clearButtonMode={inputProps.clearButtonMode ?? "while-editing"}
      editable={!disabled}
      multiline={inputProps.multiline ?? false}
      placeholderTextColor={
        inputProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val
      }
      style={inputStyleWithLayout}
    />
  );

  if (hasLeadingLabel) {
    return (
      <NativeListRow
        {...itemProps}
        disabled={disabled}
        iconAfter={<View style={styles.inputTrailing}>{resolvedInput}</View>}
      />
    );
  }

  return (
    <NativeListCustomItem
      {...itemProps}
      disabled={disabled}
      paddingVertical={itemProps.paddingVertical ?? 0}
    >
      <View collapsable={false} style={styles.inputRow}>
        {resolvedInput}
      </View>
    </NativeListCustomItem>
  );
}

export function NativeListTextAreaItem({
  textAreaProps,
  ...itemProps
}: NativeListTextAreaItemProps) {
  const theme = useTheme();
  const disabled = itemProps.disabled || textAreaProps.disabled;
  const textAreaHeight = resolveTextAreaHeight(textAreaProps);
  const {
    disabled: _inputDisabled,
    scrollEnabled,
    style: inputStyle,
    unstyled,
    ...nativeTextAreaProps
  } = textAreaProps;
  const resolvedTextAreaBackground =
    (StyleSheet.flatten(inputStyle) as ViewStyle | undefined)?.backgroundColor ?? "transparent";
  const textAreaStyle = StyleSheet.flatten([
    styles.textArea,
    {
      color: theme.gray12?.val ?? theme.color.val,
      height: textAreaHeight,
      minHeight: textAreaHeight,
    },
    isWeb() ? ({ resize: "none" } as any) : null,
    inputStyle,
  ]);
  const textAreaFocusStyle = {
    borderColor: "transparent",
    borderWidth: 0,
    outlineColor: "transparent",
    outlineStyle: "none",
    outlineWidth: 0,
    ...(textAreaProps.focusStyle as object),
  };
  const textAreaFocusVisibleStyle = {
    borderColor: "transparent",
    borderWidth: 0,
    outlineColor: "transparent",
    outlineStyle: "none",
    outlineWidth: 0,
    ...(textAreaProps.focusVisibleStyle as object),
  };

  return (
    <NativeListCustomItem {...itemProps} disabled={disabled}>
      <View collapsable={false} style={[styles.textAreaRow, { height: textAreaHeight }]}>
        {isWeb() ? (
          <TextArea
            {...(nativeTextAreaProps as any)}
            backgroundColor={resolvedTextAreaBackground as any}
            borderWidth={0}
            disabled={disabled}
            focusStyle={textAreaFocusStyle as any}
            focusVisibleStyle={textAreaFocusVisibleStyle as any}
            placeholderTextColor={
              textAreaProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val
            }
            scrollEnabled={scrollEnabled ?? true}
            style={textAreaStyle as any}
            unstyled={unstyled}
          />
        ) : (
          <TextInput
            {...(nativeTextAreaProps as any)}
            editable={!disabled}
            multiline
            placeholderTextColor={
              textAreaProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val
            }
            scrollEnabled={scrollEnabled ?? true}
            style={textAreaStyle}
          />
        )}
      </View>
    </NativeListCustomItem>
  );
}

export function NativeListItem({
  title,
  onPress,
  disabled,
  titleAlign,
  btnTint,
  ...itemProps
}: NativeListItemProps) {
  return (
    <NativeListRow
      {...itemProps}
      btnTint={btnTint}
      titleAlign={titleAlign}
      titleColor={itemProps.titleColor ?? (typeof btnTint !== "boolean" ? btnTint : undefined)}
      title={title}
      disabled={disabled}
      onPress={onPress}
    />
  );
}

export function NativeListSelectItem({ selectProps, ...itemProps }: NativeListSelectItemProps) {
  const disabled = itemProps.disabled || selectProps.disabled || selectProps.isDisabled;
  const selectedLabel = getSelectedLabel(selectProps);
  const editMode = useNativeListEditMode();
  const resolvedHaptics = useResolvedNativeHaptics(
    selectProps.nativeHaptics ?? itemProps.nativeHaptics ?? false,
  );
  const resolvedPickerMode = selectProps.nativePickerMode ?? "dropdown";
  const usesIosInlineDropdown =
    os() === "ios" && resolvedPickerMode === "dropdown" && (selectProps.native ?? true) === true;
  const pickerRef = useRef<NativePickerSwiftUIHandle>(null);
  const inlineTriggerGuard = useInlineNativeTriggerGuard();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uncontrolledSelectValue, setUncontrolledSelectValue] = useState<string | null>(
    selectProps.defaultValue ?? null,
  );
  const resolvedItemGroups = resolveSelectItemGroups({
    itemGroups: selectProps.itemGroups,
    items: selectProps.items,
    options: selectProps.options,
  });
  const selectItems = resolvedItemGroups.flatMap((group) => group.items);
  const selectedValue =
    selectProps.value !== undefined ? selectProps.value : uncontrolledSelectValue;
  const selectedItem = selectItems.find((item) => item.value === selectedValue);
  const defaultTriggerLabel = selectedItem?.label ?? selectProps.placeholder ?? "";
  const nativeTriggerLabel =
    selectedValue == null || selectedValue === "" || selectProps.renderValue == null
      ? defaultTriggerLabel
      : selectProps.renderValue(selectedValue);
  const resolvedSelectedLabel = usesIosInlineDropdown ? defaultTriggerLabel : selectedLabel;
  const fadeTitleOnOpen = itemProps.fadeTitleOnOpen !== false;
  const resolvedContextMenuProps = useResolvedNativeListContextMenu(itemProps.contextMenuProps);
  const contextMenuRef = useRef<NativeMenuHandle | null>(null);
  const activeAndroidContextMenuProps =
    os() === "android" &&
    !editMode &&
    !disabled &&
    resolvedContextMenuProps != null &&
    !resolvedContextMenuProps.triggerProps?.disabled
      ? resolvedContextMenuProps
      : undefined;
  const { defaultRowBackground } = useFallbackRowThemeColors();
  const normalRowBackground = itemProps.backgroundColor ?? defaultRowBackground;

  if (editMode) {
    return (
      <NativeListRow
        {...itemProps}
        disabled={disabled}
        value={resolvedSelectedLabel}
        valueColor={itemProps.valueColor ?? "$color10"}
        valueOpacity={0.5}
      />
    );
  }

  if (usesIosInlineDropdown) {
    return (
      <NativeListRow
        {...itemProps}
        disabled={disabled}
        labelOpacity={fadeTitleOnOpen && dropdownOpen ? 0.6 : 1}
        nativeHaptics={resolvedHaptics}
        onPress={() => {
          if (inlineTriggerGuard.consumeTriggerInteraction()) return;

          const picker = pickerRef.current;
          if (picker == null) return;

          if (fadeTitleOnOpen) {
            setDropdownOpen(true);
          }
          picker.open();
        }}
        iconAfter={
          <View
            collapsable={false}
            onTouchCancel={inlineTriggerGuard.cancelTriggerInteraction}
            onTouchEnd={inlineTriggerGuard.finishTriggerInteraction}
            onTouchStart={inlineTriggerGuard.beginTriggerInteraction}
          >
            <NativePickerSwiftUI
              ref={pickerRef}
              disabled={disabled}
              items={selectItems}
              mode="dropdown"
              nativeDropdownAlign={selectProps.nativeDropdownAlign ?? "end"}
              nativeDropdownAnchorWidth={selectProps.nativeDropdownAnchorWidth}
              nativeDropdownEdgeOffset={selectProps.nativeDropdownEdgeOffset}
              nativeTrigger
              nativeTriggerContainerStyle={[
                styles.selectInlineTrigger,
                disabled ? styles.disabledContent : null,
                selectProps.nativeTriggerContainerStyle,
              ]}
              nativeTriggerContent={selectProps.nativeTriggerContent}
              nativeTriggerIcon={selectProps.nativeTriggerIcon ?? "chevrons-up-down"}
              nativeTriggerLabel={nativeTriggerLabel}
              nativeTriggerLabelProps={{
                color: itemProps.valueColor ?? "$color10",
                fontSize: itemProps.valueFontSize ?? "$4",
                numberOfLines: 1,
                opacity: 1,
                ...selectProps.nativeTriggerLabelProps,
              }}
              onOpenChange={(nextOpen: boolean) => {
                selectProps.onOpenChange?.(nextOpen);
              }}
              onOpenWillChange={(nextOpen: boolean) => {
                setDropdownOpen(nextOpen);
                if (!nextOpen) {
                  inlineTriggerGuard.cancelTriggerInteraction();
                }
              }}
              onValueChange={(nextValue: string | null) => {
                if (selectProps.value === undefined) {
                  setUncontrolledSelectValue(nextValue);
                }
                selectProps.onValueChange?.(nextValue);
              }}
              placeholder={selectProps.placeholder}
              resolvedNativeHaptics={resolvedHaptics}
              value={selectedValue ?? null}
            />
          </View>
        }
        value={undefined}
      />
    );
  }

  const select = (
    <Select
      {...selectProps}
      disabled={disabled}
      native={selectProps.native ?? !isWeb()}
      nativeHaptics={selectProps.nativeHaptics ?? itemProps.nativeHaptics ?? false}
      nativeDropdownAlign={selectProps.nativeDropdownAlign ?? "end"}
      nativeDropdownEdgeOffset={selectProps.nativeDropdownEdgeOffset ?? -14}
      nativeTrigger
      nativeTriggerContent={
        <NativeListRow
          {...itemProps}
          backgroundColor={itemProps.backgroundColor ?? (isWeb() ? "transparent" : undefined)}
          contextMenuProps={
            activeAndroidContextMenuProps != null ? false : itemProps.contextMenuProps
          }
          disabled={disabled}
          iconAfter={
            <View style={styles.selectValue}>
              <Text
                color={(itemProps.valueColor ?? "$color10") as any}
                fontSize={itemProps.valueFontSize ?? "$4"}
                numberOfLines={1}
                opacity={1}
              >
                {selectedLabel}
              </Text>
              <ChevronsUpDown color={(itemProps.valueColor ?? "$color10") as any} size={14} />
            </View>
          }
        />
      }
      viewportProps={{
        ...selectProps.viewportProps,
        style: [
          isWeb()
            ? {
                minWidth: 220,
              }
            : null,
          selectProps.viewportProps?.style,
        ] as any,
      }}
      placement={selectProps.placement ?? (isWeb() ? "bottom-end" : undefined)}
      triggerProps={{
        backgroundColor: isWeb() ? (normalRowBackground as any) : undefined,
        ...selectProps.triggerProps,
        onLongPress:
          activeAndroidContextMenuProps != null
            ? (event: any) => {
                (selectProps.triggerProps as any)?.onLongPress?.(event);
                contextMenuRef.current?.presentMenu();
              }
            : (selectProps.triggerProps as any)?.onLongPress,
        hoverStyle:
          selectProps.triggerProps?.hoverStyle ??
          ({
            backgroundColor: itemProps.hoverBackgroundColor ?? "$color4",
          } as any),
        pressStyle:
          selectProps.triggerProps?.pressStyle ??
          ({
            background: itemProps.pressBackgroundColor ?? "$color5",
            // Android 的原生 Select trigger 可能在长按手势被内部控件接管后收不到
            // press-out。透明度反馈由 Select 的 NativeTriggerFace 负责，避免外层
            // pressStyle 永久停留在按下态。
            opacity: os() === "android" ? 1 : 0.6,
          } as any),
      }}
    />
  );

  return (
    <FallbackNativeContextMenuHost
      contextMenuProps={activeAndroidContextMenuProps}
      menuRef={contextMenuRef}
    >
      {select}
    </FallbackNativeContextMenuHost>
  );
}

function NativeListMenuTrigger({
  backgroundColor,
  disabled,
  itemProps,
}: {
  backgroundColor?: ViewStyle["backgroundColor"];
  disabled?: boolean;
  itemProps: NativeListItemBaseProps;
}) {
  const triggerLabel = itemProps.value ?? "更多";
  const triggerColor = itemProps.valueColor ?? "$color10";

  return (
    <NativeListRow
      {...itemProps}
      backgroundColor={
        backgroundColor ?? itemProps.backgroundColor ?? (isWeb() ? "transparent" : undefined)
      }
      disabled={disabled}
      iconAfter={
        <View style={styles.selectValue}>
          <Text
            color={triggerColor as any}
            fontSize={itemProps.valueFontSize ?? "$4"}
            numberOfLines={1}
          >
            {triggerLabel}
          </Text>
          <ChevronsUpDown color={triggerColor as any} size={14} />
        </View>
      }
      value={undefined}
    />
  );
}

function AndroidNativeListMenuItem({
  contextMenuProps,
  disabled,
  itemProps,
  menuProps,
}: {
  contextMenuProps: NativeListContextMenuProps;
  disabled?: boolean;
  itemProps: NativeListItemBaseProps;
  menuProps: NativeListMenuItemProps["menuProps"];
}) {
  const contextMenuRef = useRef<NativeMenuHandle | null>(null);
  const menuRef = useRef<NativeMenuHandle | null>(null);
  const longPressedRef = useRef(false);
  const [anchorSize, setAnchorSize] = useState({ height: 1, width: 1 });
  const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(menuProps.defaultOpen));
  const triggerProps = menuProps.triggerProps as any;
  const resolvedOpen = menuProps.open ?? uncontrolledOpen;
  const trigger = (
    <NativeListMenuTrigger
      disabled={disabled}
      itemProps={{
        ...itemProps,
        contextMenuProps: false,
        onPress: undefined,
      }}
    />
  );

  return (
    <View collapsable={false} style={styles.contextMenuRow}>
      <NativeTriggerPressable
        accessibilityLabel={triggerProps?.["aria-label"]}
        active={resolvedOpen}
        content={trigger}
        delayLongPress={triggerProps?.delayLongPress}
        disabled={disabled}
        hitSlop={triggerProps?.hitSlop}
        label={itemProps.value ?? "更多"}
        onLayout={(event) => {
          triggerProps?.onLayout?.(event);
          const { height, width } = event.nativeEvent.layout;
          setAnchorSize((current) =>
            Math.abs(current.height - height) < 0.5 && Math.abs(current.width - width) < 0.5
              ? current
              : { height, width },
          );
        }}
        onLongPress={(event) => {
          longPressedRef.current = true;
          triggerProps?.onLongPress?.(event);
          contextMenuRef.current?.presentMenu();
        }}
        onPress={(event) => {
          if (longPressedRef.current) {
            longPressedRef.current = false;
            return;
          }

          triggerProps?.onPress?.(event);
          menuRef.current?.presentMenu();
        }}
        onPressIn={(event) => {
          longPressedRef.current = false;
          triggerProps?.onPressIn?.(event);
        }}
        onPressOut={(event) => triggerProps?.onPressOut?.(event)}
        onTouchCancel={(event) => {
          longPressedRef.current = false;
          triggerProps?.onTouchCancel?.(event);
        }}
        onTouchEnd={(event) => triggerProps?.onTouchEnd?.(event)}
        style={triggerProps?.style}
        testID={triggerProps?.testID}
      />
      <View pointerEvents="none" style={styles.nativeMenuAnchorFill}>
        <Menu
          {...menuProps}
          nativeAnchorAlignment={menuProps.nativeAnchorAlignment ?? "end"}
          nativeHaptics={menuProps.nativeHaptics ?? itemProps.nativeHaptics ?? false}
          onOpenChange={(nextOpen) => {
            if (menuProps.open === undefined) {
              setUncontrolledOpen(nextOpen);
            }
            menuProps.onOpenChange?.(nextOpen);
          }}
          style={anchorSize as any}
          trigger={
            <View
              collapsable={false}
              style={{
                height: anchorSize.height,
                opacity: 0,
                width: anchorSize.width,
              }}
            />
          }
          triggerProps={{ asChild: true }}
          {...({ __menuRef: menuRef } as any)}
        />
      </View>
      <FallbackNativeContextMenuAnchor
        contextMenuProps={contextMenuProps}
        menuRef={contextMenuRef}
      />
    </View>
  );
}

/** 以整行 NativeList 样式作为 `Menu` 的 native trigger，不维护选中状态。 */
export function NativeListMenuItem({ menuProps, ...itemProps }: NativeListMenuItemProps) {
  const disabled = itemProps.disabled || menuProps.triggerProps?.disabled;
  const editMode = useNativeListEditMode();
  const menuRef = useRef<NativeMenuHandle | null>(null);
  const inlineTriggerGuard = useInlineNativeTriggerGuard();
  const [uncontrolledWillOpen, setUncontrolledWillOpen] = useState(
    Boolean(menuProps.defaultOpen),
  );
  const menuOpen = menuProps.open ?? uncontrolledWillOpen;
  const fadeTitleOnOpen = itemProps.fadeTitleOnOpen !== false;
  const resolvedContextMenuProps = useResolvedNativeListContextMenu(itemProps.contextMenuProps);
  const activeAndroidContextMenuProps =
    os() === "android" &&
    !editMode &&
    !disabled &&
    resolvedContextMenuProps != null &&
    !resolvedContextMenuProps.triggerProps?.disabled
      ? resolvedContextMenuProps
      : undefined;
  const [hovered, setHovered] = useState(false);
  const { defaultRowBackground, theme } = useFallbackRowThemeColors();
  const normalRowBackground = itemProps.backgroundColor ?? defaultRowBackground;
  const hoveredRowBackground =
    itemProps.hoverBackgroundColor ??
    theme.color4?.val ??
    theme.backgroundHover?.val ??
    theme.background?.val;
  const trigger = (
    <NativeListMenuTrigger
      backgroundColor={
        isWeb() ? (hovered && !disabled ? hoveredRowBackground : normalRowBackground) : undefined
      }
      disabled={disabled}
      itemProps={itemProps}
    />
  );

  if (editMode) {
    return (
      <NativeListRow
        {...itemProps}
        disabled={disabled}
        valueColor={itemProps.valueColor ?? "$color10"}
        valueOpacity={0.5}
      />
    );
  }

  if (os() === "ios") {
    return (
      <NativeListRow
        {...itemProps}
        disabled={disabled}
        labelOpacity={fadeTitleOnOpen && menuOpen ? 0.6 : 1}
        nativeHaptics={false}
        onPress={() => {
          if (inlineTriggerGuard.consumeTriggerInteraction()) return;

          const menu = menuRef.current;
          if (menu == null) return;

          if (fadeTitleOnOpen && menuProps.open === undefined) {
            setUncontrolledWillOpen(true);
          }
          menu.presentMenu();
        }}
        iconAfter={
          <View
            collapsable={false}
            onTouchCancel={inlineTriggerGuard.cancelTriggerInteraction}
            onTouchEnd={inlineTriggerGuard.finishTriggerInteraction}
            onTouchStart={inlineTriggerGuard.beginTriggerInteraction}
          >
            <Menu
              {...menuProps}
              nativeHaptics={menuProps.nativeHaptics ?? itemProps.nativeHaptics ?? false}
              nativeTrigger
              nativeTriggerContainerStyle={[
                styles.selectInlineTrigger,
                disabled ? styles.disabledContent : null,
              ]}
              nativeTriggerIcon="chevrons-up-down"
              nativeTriggerLabel={itemProps.value ?? "更多"}
              nativeTriggerLabelProps={
                {
                  color: itemProps.valueColor ?? "$color10",
                  fontSize: itemProps.valueFontSize ?? "$4",
                  numberOfLines: 1,
                  opacity: 1,
                } as any
              }
              onOpenChange={(nextOpen) => {
                menuProps.onOpenChange?.(nextOpen);
              }}
              onOpenWillChange={(nextOpen) => {
                if (menuProps.open === undefined) {
                  setUncontrolledWillOpen(nextOpen);
                }
                if (!nextOpen) {
                  inlineTriggerGuard.cancelTriggerInteraction();
                }
                menuProps.onOpenWillChange?.(nextOpen);
              }}
              triggerProps={{
                ...menuProps.triggerProps,
                disabled,
              }}
              {...({ __menuRef: menuRef } as any)}
            />
          </View>
        }
        value={undefined}
      />
    );
  }

  if (activeAndroidContextMenuProps != null) {
    return (
      <AndroidNativeListMenuItem
        contextMenuProps={activeAndroidContextMenuProps}
        disabled={disabled}
        itemProps={itemProps}
        menuProps={menuProps}
      />
    );
  }

  return (
    <Menu
      {...menuProps}
      nativeAnchorAlignment={
        menuProps.nativeAnchorAlignment ?? (os() === "android" ? "end" : undefined)
      }
      nativeHaptics={menuProps.nativeHaptics ?? itemProps.nativeHaptics ?? false}
      nativeTrigger
      nativeTriggerContent={trigger}
      placement={menuProps.placement ?? (isWeb() ? "bottom-end" : undefined)}
      triggerProps={{
        ...menuProps.triggerProps,
        disabled: disabled || menuProps.triggerProps?.disabled,
        onHoverIn: (event: PressableHoverEvent) => {
          menuProps.triggerProps?.onHoverIn?.(event);
          setHovered(true);
        },
        onHoverOut: (event: PressableHoverEvent) => {
          menuProps.triggerProps?.onHoverOut?.(event);
          setHovered(false);
        },
      }}
    />
  );
}

export function NativeListCustomItem({
  backgroundColor,
  children,
  contextMenuProps,
  disabled,
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
  const editRow = useNativeListEditRow({
    disabled,
    nativeScrollId,
    onPress,
    selectionId,
    selectionDisabled,
  });

  return (
    <FallbackRowContainer
      backgroundColor={backgroundColor}
      contextMenuProps={contextMenuProps}
      disabled={disabled}
      editingSelected={editRow.editingSelected}
      hoverBackgroundColor={hoverBackgroundColor}
      nativeHaptics={nativeHaptics}
      onPress={editRow.onPress}
      paddingBottom={paddingBottom}
      paddingHorizontal={paddingHorizontal}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingTop={paddingTop}
      paddingVertical={paddingVertical}
      pressBackgroundColor={pressBackgroundColor}
    >
      <View
        pointerEvents={editRow.editMode ? "none" : "auto"}
        style={editRow.editMode ? styles.editingCustomRowContent : styles.customRowContent}
      >
        {editRow.selectionEnabled ? (
          <FallbackEditingIndicator selected={editRow.editingSelected} />
        ) : null}
        <View style={styles.customRowContent}>{children}</View>
      </View>
    </FallbackRowContainer>
  );
}

export function NativeListSection({
  children,
  contextMenuProps,
  footer,
  trailing,
  title,
  titleColor,
  titleFontSize,
}: NativeListSectionProps) {
  const entries = createFallbackListEntries(
    <NativeListSection
      footer={footer}
      contextMenuProps={contextMenuProps}
      trailing={trailing}
      title={title}
      titleColor={titleColor}
      titleFontSize={titleFontSize}
    >
      {children}
    </NativeListSection>,
  );

  return <View style={styles.staticSection}>{renderStaticEntries(entries)}</View>;
}

export function NativeListRoot({
  backgroundColor,
  children,
  contextMenuProps,
  contentContainerStyle,
  contentMarginBottom,
  contentMarginTop,
  defaultSelectedIds,
  dismissKeyboardOnTap: _dismissKeyboardOnTap,
  editMode,
  editModeIcon,
  editModeSelectedIcon,
  editModeSelectedSfSymbol,
  editModeSfSymbol,
  fixesIOS26NestedScrollIndicatorSafeArea: _fixesIOS26NestedScrollIndicatorSafeArea,
  initialScrollTarget,
  native: _native,
  navigationBarScrollEdgeOptions,
  onRefresh,
  onSelectedIdsChange,
  refreshColor,
  refreshEnabledInEditMode = false,
  scrollable = true,
  selectedIds,
  style,
  tracksNavigationBarScrollEdge = false,
  ...rest
}: NativeListRootProps) {
  void _native;
  void _fixesIOS26NestedScrollIndicatorSafeArea;
  void _dismissKeyboardOnTap;
  const {
    alwaysBounceVertical,
    automaticallyAdjustsScrollIndicatorInsets,
    contentInset,
    contentInsetAdjustmentBehavior,
    contentOffset,
    keyboardShouldPersistTaps,
    maintainVisibleContentPosition: _maintainVisibleContentPosition,
    nestedScrollEnabled,
    onLayout,
    onScroll,
    onScrollBeginDrag,
    scrollEventThrottle,
    scrollIndicatorInsets,
    showsVerticalScrollIndicator,
    webAutoRestoreScroll = true,
    ...scrollViewProps
  } = rest;
  void _maintainVisibleContentPosition;
  const headerHeight = useContext(HeaderHeightContext) ?? 0;
  const navigation = useContext(NavigationContext) as NavigationWithFocusEvents | undefined;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList<FallbackListEntry> | null>(null);
  const scrollToIndexRetryRef = useRef({ attempts: 0, index: -1 });
  const scrollToIndexRetryFrameRef = useRef<number | undefined>(undefined);
  const listScrollGenerationRef = useRef(0);
  const currentWebScrollOffsetRef = useRef(0);
  const pendingWebScrollRestoreRef = useRef(false);
  const savedWebScrollOffsetRef = useRef(0);

  const isRestoreScroll = webAutoRestoreScroll && isWeb();
  const captureWebScrollPosition = useCallback(() => {
    if (!isRestoreScroll) return;

    const actualOffset = getWebScrollableNode(flatListRef.current)?.scrollTop;
    const offset = Math.max(0, actualOffset ?? currentWebScrollOffsetRef.current);
    currentWebScrollOffsetRef.current = offset;
    savedWebScrollOffsetRef.current = offset;
  }, []);
  const listInteractionContext = useMemo(
    () => ({
      captureScrollPosition: captureWebScrollPosition,
      scrollGenerationRef: listScrollGenerationRef,
    }),
    [captureWebScrollPosition],
  );
  const entries = useMemo(
    () => createFallbackListEntries(children, contextMenuProps),
    [children, contextMenuProps],
  );
  const initialScrollIndex = useMemo(
    () => getInitialScrollIndex(entries, initialScrollTarget),
    [entries, initialScrollTarget],
  );
  const {
    active: insideTrueSheet,
    automaticContentInsetAdjustment,
    insetAdjustment,
    nativeScrollInsetsApplied,
  } = useTrueSheetScrollLayout();
  const appBackgroundColors = useAppBackgroundColors();
  const theme = useTheme();
  const resolvedRefreshColor = refreshColor ?? theme.color10.val;
  const refreshControlEnabled =
    onRefresh != null && (editMode !== true || refreshEnabledInEditMode);
  const trackedOnScroll = useNavigationBarScrollEdge({
    navigationBarScrollEdgeOptions,
    onScroll,
    tracksNavigationBarScrollEdge,
  });
  const handleFlatListScroll = useCallback(
    (event: ScrollEvent) => {
      trackedOnScroll?.(event);
      // native-stack's Web fallback can emit a final zero-offset event while hiding this route.
      // It is a layout reset, not user scroll input, so it must not overwrite the saved position.
      if (isRestoreScroll && (navigation == null || navigation.isFocused())) {
        currentWebScrollOffsetRef.current = Math.max(0, event.nativeEvent.contentOffset.y);
      }
    },
    [navigation, trackedOnScroll],
  );
  const handleScrollBeginDrag = useCallback(
    (event: ScrollEvent) => {
      listScrollGenerationRef.current += 1;
      onScrollBeginDrag?.(event);
    },
    [onScrollBeginDrag],
  );
  const restoreWebScrollPosition = useCallback(() => {
    if (!isRestoreScroll || contentOffset != null || !pendingWebScrollRestoreRef.current) return;

    const offset = savedWebScrollOffsetRef.current;
    if (offset <= 0) return;

    flatListRef.current?.scrollToOffset({ animated: false, offset });
    const scrollableNode = getWebScrollableNode(flatListRef.current);
    if (scrollableNode != null) {
      scrollableNode.scrollTop = offset;
    }
  }, [contentOffset]);
  const getActualWebScrollOffset = useCallback(() => {
    return getWebScrollableNode(flatListRef.current)?.scrollTop ?? null;
  }, []);
  const handleFlatListLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onLayout?.(event);
      if (!isRestoreScroll || event.nativeEvent.layout.height <= 0) return;

      restoreWebScrollPosition();
    },
    [onLayout, restoreWebScrollPosition],
  );
  const handleScrollToIndexFailed = useCallback(
    ({ averageItemLength, index }: { averageItemLength: number; index: number }) => {
      const retryState = scrollToIndexRetryRef.current;
      if (retryState.index !== index) {
        retryState.index = index;
        retryState.attempts = 0;
      }
      if (retryState.attempts >= 2) return;

      retryState.attempts += 1;
      flatListRef.current?.scrollToOffset({
        animated: false,
        offset: Math.max(0, averageItemLength * index),
      });
      if (scrollToIndexRetryFrameRef.current != null) {
        cancelAnimationFrame(scrollToIndexRetryFrameRef.current);
      }
      scrollToIndexRetryFrameRef.current = requestAnimationFrame(() => {
        scrollToIndexRetryFrameRef.current = undefined;
        flatListRef.current?.scrollToIndex({ animated: false, index });
      });
    },
    [],
  );

  useEffect(() => {
    scrollToIndexRetryRef.current = { attempts: 0, index: initialScrollIndex ?? -1 };
    if (initialScrollIndex != null) {
      scrollToIndexRetryFrameRef.current = requestAnimationFrame(() => {
        scrollToIndexRetryFrameRef.current = undefined;
        flatListRef.current?.scrollToIndex({ animated: false, index: initialScrollIndex });
      });
    }
    return () => {
      if (scrollToIndexRetryFrameRef.current != null) {
        cancelAnimationFrame(scrollToIndexRetryFrameRef.current);
        scrollToIndexRetryFrameRef.current = undefined;
      }
    };
  }, [initialScrollIndex]);

  useEffect(() => {
    if (!isRestoreScroll || navigation == null || contentOffset != null) return;

    let restoreAnimationFrame: number | undefined;
    const cancelScrollRestore = () => {
      pendingWebScrollRestoreRef.current = false;
      if (restoreAnimationFrame != null) {
        cancelAnimationFrame(restoreAnimationFrame);
        restoreAnimationFrame = undefined;
      }
    };
    const requestScrollRestore = () => {
      if (savedWebScrollOffsetRef.current <= 0) return;

      if (restoreAnimationFrame != null) {
        cancelAnimationFrame(restoreAnimationFrame);
      }
      pendingWebScrollRestoreRef.current = true;
      const targetOffset = savedWebScrollOffsetRef.current;
      let stableFrames = 0;
      let attemptedFrames = 0;

      const verifyScrollPosition = () => {
        if (!pendingWebScrollRestoreRef.current) return;

        const actualOffset = getActualWebScrollOffset();
        if (
          actualOffset != null &&
          Math.abs(actualOffset - targetOffset) <= WEB_SCROLL_RESTORE_TOLERANCE
        ) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
          restoreWebScrollPosition();
        }
        attemptedFrames += 1;

        if (
          stableFrames >= WEB_SCROLL_RESTORE_STABLE_FRAMES ||
          attemptedFrames >= WEB_SCROLL_RESTORE_MAX_FRAMES
        ) {
          pendingWebScrollRestoreRef.current = false;
          restoreAnimationFrame = undefined;
          return;
        }

        restoreAnimationFrame = requestAnimationFrame(verifyScrollPosition);
      };

      restoreWebScrollPosition();
      restoreAnimationFrame = requestAnimationFrame(verifyScrollPosition);
    };
    const unsubscribeBlur = navigation.addListener("blur", () => {
      cancelScrollRestore();
      savedWebScrollOffsetRef.current = currentWebScrollOffsetRef.current;
    });
    const unsubscribeFocus = navigation.addListener("focus", requestScrollRestore);
    // The Web native-stack transition may reset FlatList after focus has already restored it.
    // Start a fresh verified restore once the transition itself has finished.
    const unsubscribeTransitionEnd = navigation.addListener("transitionEnd", requestScrollRestore);

    return () => {
      cancelScrollRestore();
      unsubscribeBlur();
      unsubscribeFocus();
      unsubscribeTransitionEnd();
    };
  }, [contentOffset, getActualWebScrollOffset, navigation, restoreWebScrollPosition]);
  const resolvedScrollEventThrottle =
    scrollEventThrottle ?? (trackedOnScroll == null ? undefined : 16);
  const rootBackground = { backgroundColor: backgroundColor ?? appBackgroundColors.screen };
  const isNestedFallbackList = nestedScrollEnabled === true;

  const bottomPadding =
    insideTrueSheet && !isNestedFallbackList
      ? getTrueSheetScrollBottomPadding({
          insetAdjustment,
          nativeScrollInsetsApplied,
          safeAreaBottom: insets.bottom,
        })
      : undefined;
  const indicatorBottomInset =
    insideTrueSheet && !isNestedFallbackList && automaticallyAdjustsScrollIndicatorInsets !== false
      ? getTrueSheetScrollIndicatorBottomInset({
          automaticContentInsetAdjustment,
          nativeScrollInsetsApplied,
          safeAreaBottom: insets.bottom,
        })
      : undefined;
  const shouldUseManualHeaderSpacing =
    !insideTrueSheet &&
    !isNestedFallbackList &&
    os() === "ios" &&
    headerHeight > 0 &&
    contentInset == null &&
    contentInsetAdjustmentBehavior == null &&
    contentOffset == null;
  const manuallyAdjustNormalPageIndicator =
    os() === "ios" &&
    (!insideTrueSheet || isNestedFallbackList) &&
    automaticallyAdjustsScrollIndicatorInsets == null;
  const resolvedContentInsetAdjustmentBehavior = isNestedFallbackList
    ? (contentInsetAdjustmentBehavior ?? "never")
    : insideTrueSheet && os() === "ios"
      ? automaticContentInsetAdjustment
        ? "automatic"
        : "never"
      : shouldUseManualHeaderSpacing
        ? "never"
        : contentInsetAdjustmentBehavior;
  const contentTopPadding =
    contentMarginTop ?? (shouldUseManualHeaderSpacing ? headerHeight + 8 : undefined);
  const contentBottomPadding =
    bottomPadding != null ? bottomPadding + (contentMarginBottom ?? 0) : contentMarginBottom;
  const contentSpacingStyle = {
    ...(contentTopPadding != null ? { paddingTop: contentTopPadding } : null),
    ...(contentBottomPadding != null ? { paddingBottom: contentBottomPadding } : null),
  };
  const handleRefresh =
    onRefresh == null
      ? undefined
      : async () => {
          if (!refreshControlEnabled) return;
          setRefreshing(true);
          try {
            await onRefresh();
          } finally {
            setRefreshing(false);
          }
        };

  return (
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
      <FallbackListInteractionContext.Provider value={listInteractionContext}>
        <FlatList
          automaticallyAdjustsScrollIndicatorInsets={
            manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets
          }
          alwaysBounceVertical={alwaysBounceVertical ?? (!insideTrueSheet && os() === "ios")}
          contentInset={contentInset}
          contentContainerStyle={[
            insideTrueSheet ? styles.rootContent : styles.scrollRootContent,
            styles.scrollViewportFill,
            rootBackground,
            contentSpacingStyle,
            contentContainerStyle,
          ]}
          contentInsetAdjustmentBehavior={resolvedContentInsetAdjustmentBehavior}
          contentOffset={contentOffset}
          data={entries}
          extraData={entries}
          ItemSeparatorComponent={FallbackListItemSeparator}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? "handled"}
          keyExtractor={getEntryKey}
          nestedScrollEnabled={nestedScrollEnabled ?? true}
          onLayout={handleFlatListLayout}
          onScroll={handleFlatListScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          ref={flatListRef}
          removeClippedSubviews={false}
          refreshControl={
            onRefresh != null ? (
              <RefreshControl
                colors={[resolvedRefreshColor]}
                enabled={refreshControlEnabled}
                onRefresh={handleRefresh}
                refreshing={refreshControlEnabled && refreshing}
                tintColor={refreshControlEnabled ? resolvedRefreshColor : "transparent"}
              />
            ) : undefined
          }
          renderItem={renderFallbackListEntry}
          scrollEnabled={scrollable}
          scrollEventThrottle={resolvedScrollEventThrottle}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator ?? true}
          scrollIndicatorInsets={
            indicatorBottomInset != null
              ? {
                  ...scrollIndicatorInsets,
                  bottom: indicatorBottomInset,
                }
              : scrollIndicatorInsets
          }
          style={[styles.root, rootBackground, style]}
          {...scrollViewProps}
        />
      </FallbackListInteractionContext.Provider>
    </NativeListEditModeProvider>
  );
}

const styles = StyleSheet.create({
  customRowContent: {
    width: "100%",
  },
  disabledContent: {
    opacity: 0.5,
  },
  editingCustomRowContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  editingIndicator: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    flexShrink: 0,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  editingIndicatorSlot: {
    alignItems: "center",
    flexShrink: 0,
    justifyContent: "center",
    minWidth: 24,
  },
  iconAfterRow: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: 4,
    justifyContent: "flex-end",
    maxWidth: "50%",
    minWidth: 0,
  },
  iconBefore: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
    justifyContent: "center",
  },
  input: {
    borderWidth: 0,
    fontSize: 17,
    height: 44,
    includeFontPadding: false,
    maxHeight: 44,
    minHeight: 0,
    paddingHorizontal: 16,
    paddingVertical: 0,
    textAlignVertical: "center",
    width: "100%",
  },
  inputRow: {
    height: 44,
    width: "100%",
  },
  fullWidthInput: {
    paddingHorizontal: 0,
  },
  inputTrailing: {
    width: 160,
  },
  contextMenuAnchor: {
    height: 1,
    position: "absolute",
    top: "50%",
    width: 1,
  },
  contextMenuAnchorCenter: {
    left: "50%",
  },
  contextMenuAnchorEnd: {
    right: 0,
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
  nativeMenuAnchorFill: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  pressable: {
    width: "100%",
  },
  root: {
    flex: 1,
    minHeight: 0,
  },
  rootContent: {
    overflow: "hidden",
    paddingVertical: 8,
    width: "100%",
  },
  rowContainer: {
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 30,
    paddingVertical: 12,
    width: "100%",
  },
  rowContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  rowFrame: {
    width: "100%",
  },
  rowSeparator: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  rowSeparatorOuter: {
    paddingLeft: 30,
    width: "100%",
  },
  scrollRootContent: {
    paddingVertical: 8,
    width: "100%",
  },
  scrollViewportFill: {
    flexGrow: 1,
  },
  sectionFooter: {
    paddingHorizontal: 30,
    paddingTop: 8,
  },
  sectionLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingBottom: 8,
    paddingHorizontal: 30,
    paddingTop: 18,
    width: "100%",
  },
  sectionTitle: {
    flex: 1,
    minWidth: 0,
  },
  sectionTrailing: {
    alignItems: "center",
    flexDirection: "row",
  },
  sectionSpacer: {
    height: 16,
  },
  selectValue: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: 4,
    minWidth: 0,
  },
  selectInlineTrigger: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: 4,
    maxWidth: 180,
    minHeight: 32,
    minWidth: 0,
  },
  staticRoot: {
    width: "100%",
  },
  staticSection: {
    width: "100%",
  },
  textColumn: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  textArea: {
    borderWidth: 0,
    fontSize: 17,
    minHeight: 100,
    paddingHorizontal: 0,
    paddingVertical: 10,
    textAlignVertical: "top",
    width: "100%",
  },
  textAreaRow: {
    width: "100%",
  },
  trailingControl: {
    alignItems: "center",
    flexDirection: "row",
  },
});
