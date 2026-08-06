import { HeaderHeightContext } from "@react-navigation/elements";
import { NavigationContext } from "@react-navigation/native";
import { Check, ChevronRight, ChevronsUpDown } from "@tamagui/lucide-icons-2";
import {
  Children,
  createContext,
  useCallback,
  type ComponentProps,
  type ComponentType,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";

import { isWeb, os } from "../utils/platform";
import { useAppBackgroundColors, useUiPreferences } from "../utils/theme";

import { FlashList, type FlashListRef, type ListRenderItemInfo } from "../flash_list";
import { Input } from "../input";
import { Menu } from "../menu";
import { Select } from "../select";
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
import type {
  NativeListActionItemProps,
  NativeListButtonItemProps,
  NativeListCustomItemProps,
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
  disabled?: boolean;
  hoverBackgroundColor?: ViewStyle["backgroundColor"];
  nativeHaptics?: NativeListItemBaseProps["nativeHaptics"];
  onPress?: () => void;
  pressResetToken?: number;
  pressBackgroundColor?: ViewStyle["backgroundColor"];
};

type PressableHoverEvent = Parameters<
  NonNullable<ComponentProps<typeof Pressable>["onHoverIn"]>
>[0];

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
      key: string;
      nativeScrollId?: string | number;
      renderRow: () => ReactElement | null;
      rowType:
        | "actionRow"
        | "buttonRow"
        | "customRow"
        | "inputRow"
        | "itemRow"
        | "menuRow"
        | "navigationRow"
        | "selectRow"
        | "switchRow"
        | "textAreaRow"
        | "unknownRow";
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

const FallbackListScrollCaptureContext = createContext<(() => void) | null>(null);

function getWebScrollableNode(
  list: FlashListRef<FallbackListEntry> | null,
): WebScrollableNode | null {
  try {
    const scrollableNode = list?.getScrollableNode() as WebScrollableNode | null | undefined;
    return scrollableNode != null && typeof scrollableNode.scrollTop === "number"
      ? scrollableNode
      : null;
  } catch {
    // FlashList can expose its public ref one render before the inner ScrollView ref is ready.
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
  disabled,
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
  const captureListScrollPosition = useContext(FallbackListScrollCaptureContext);
  const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
  const { defaultRowBackground, theme } = useFallbackRowThemeColors();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const usesIosSwitchPressFallback = os() === "ios" && pressResetToken != null;
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
    backgroundColor:
      pressed && !disabled
        ? pressedRowBackground
        : hovered && !disabled
          ? hoveredRowBackground
          : normalRowBackground,
  });

  if (onPress == null) {
    return (
      <View
        style={[
          styles.rowContainer,
          resolvedRowPadding,
          getRowBackground(),
          disabled ? styles.disabledContent : null,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <Pressable
      disabled={disabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={usesIosSwitchPressFallback ? () => setPressed(true) : undefined}
      onPress={() => {
        captureListScrollPosition?.();
        onPress();
        triggerNativeHaptics(resolvedHaptics);
      }}
      onPressOut={usesIosSwitchPressFallback ? () => setPressed(false) : undefined}
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
}

type NativeListRowProps = NativeListItemBaseProps & {
  iconAfter?: ReactNode;
  pressResetToken?: number;
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

function renderValueNode(value: ReactNode, valueColor?: string, valueFontSize?: number) {
  if (value == null || typeof value === "boolean") {
    return null;
  }

  if (typeof value === "string" || typeof value === "number") {
    return (
      <Text
        color={(valueColor ?? "$color") as any}
        fontSize={valueFontSize ?? "$4"}
        numberOfLines={1}
        opacity={valueColor == null ? 0.58 : 1}
      >
        {value}
      </Text>
    );
  }

  return value;
}

function NativeListRow({
  backgroundColor,
  chevron = false,
  chevronColor,
  disabled,
  hoverBackgroundColor,
  icon,
  iconAfter,
  iconSlotWidth,
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
}: NativeListRowProps) {
  const titleAlignment =
    titleAlign === "center" ? "center" : titleAlign === "right" ? "flex-end" : "flex-start";
  const textAlign = titleAlign === "center" ? "center" : titleAlign === "right" ? "right" : "left";
  const titleNode = renderTitleNode(title, titleColor, titleFontSize, textAlign);
  const subtitleNode = renderSubtitleNode(subtitle, subtitleColor, subtitleFontSize);
  const valueNode = renderValueNode(value, valueColor, valueFontSize);
  const trailingNode = renderValueNode(trailing);
  const customIcon = icon;

  return (
    <FallbackRowContainer
      backgroundColor={backgroundColor}
      disabled={disabled}
      hoverBackgroundColor={hoverBackgroundColor}
      nativeHaptics={nativeHaptics}
      onPress={onPress}
      paddingBottom={paddingBottom}
      paddingHorizontal={paddingHorizontal}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingTop={paddingTop}
      paddingVertical={paddingVertical}
      pressResetToken={pressResetToken}
      pressBackgroundColor={pressBackgroundColor}
    >
      <View style={styles.rowContent}>
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
        <View style={[styles.textColumn, { alignItems: titleAlignment }]}>
          {titleNode}
          {subtitleNode}
        </View>
        <View style={styles.iconAfterRow}>
          {valueNode}
          {selected ? <Check color="$accent10" size={18} /> : null}
          {trailingNode}
          {iconAfter}
          {chevron ? (
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
): FallbackListEntry {
  if (isNativeListElementType(child, NativeListActionItem)) {
    return {
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListActionItem {...child.props} />,
      rowType: "actionRow",
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListNavigationItem)) {
    return {
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListNavigationItem {...child.props} />,
      rowType: "navigationRow",
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListSwitchItem)) {
    return {
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListSwitchItem {...child.props} />,
      rowType: "switchRow",
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListSelectItem)) {
    return {
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListSelectItem {...child.props} />,
      rowType: "selectRow",
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListMenuItem)) {
    return {
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListMenuItem {...child.props} />,
      rowType: "menuRow",
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListButtonItem)) {
    return {
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListButtonItem {...child.props} />,
      rowType: "buttonRow",
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListInputItem)) {
    return {
      key,
      renderRow: () => <NativeListInputItem {...child.props} />,
      rowType: "inputRow",
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListTextAreaItem)) {
    return {
      key,
      renderRow: () => <NativeListTextAreaItem {...child.props} />,
      rowType: "textAreaRow",
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListItem)) {
    return {
      key,
      nativeScrollId: child.props.nativeScrollId,
      renderRow: () => <NativeListItem {...child.props} />,
      rowType: "itemRow",
      sectionKey,
      type: "row",
    };
  }

  if (isNativeListElementType(child, NativeListCustomItem)) {
    return {
      key,
      nativeScrollId: getNativeScrollId(child),
      renderRow: () => <NativeListCustomItem {...child.props} />,
      rowType: "customRow",
      sectionKey,
      type: "row",
    };
  }

  return {
    key,
    nativeScrollId: getNativeScrollId(child),
    renderRow: () => (isValidElement(child) ? child : null),
    rowType: "unknownRow",
    sectionKey,
    type: "row",
  };
}

function FallbackListRowFrame({ children }: { children: ReactNode }) {
  return (
    <View collapsable={false} style={styles.rowFrame}>
      {children}
    </View>
  );
}

function appendSectionEntries(
  entries: FallbackListEntry[],
  sectionProps: NativeListSectionProps,
  sectionKey: string,
) {
  const sectionChildren = Children.toArray(sectionProps.children);
  const hasSectionContent =
    sectionProps.title != null ||
    sectionProps.trailing != null ||
    sectionChildren.length > 0 ||
    sectionProps.footer != null;

  if (!hasSectionContent) {
    return;
  }

  if (sectionProps.title != null || sectionProps.trailing != null) {
    entries.push({
      key: `${sectionKey}-header`,
      sectionKey,
      title: sectionProps.title,
      titleColor: sectionProps.titleColor,
      titleFontSize: sectionProps.titleFontSize,
      trailing: sectionProps.trailing,
      type: "sectionHeader",
    });
  }

  sectionChildren.forEach((child, index) => {
    entries.push(
      createFallbackRowEntry(
        child,
        `${sectionKey}-row-${getNodeKey(child, String(index))}`,
        sectionKey,
      ),
    );
  });

  if (sectionProps.footer != null) {
    entries.push({
      footer: sectionProps.footer,
      key: `${sectionKey}-footer`,
      sectionKey,
      type: "sectionFooter",
    });
  }
}

function createFallbackListEntries(children: ReactNode) {
  const entries: FallbackListEntry[] = [];

  Children.toArray(children).forEach((child, index) => {
    if (isNativeListSectionElement(child)) {
      appendSectionEntries(entries, child.props, getNodeKey(child, `section-${index}`));
      return;
    }

    entries.push(
      createFallbackRowEntry(
        child,
        `direct-row-${getNodeKey(child, String(index))}`,
        `direct-${index}`,
      ),
    );
  });

  return entries;
}

function renderFallbackListEntry({
  item,
}: ListRenderItemInfo<FallbackListEntry>): ReactElement | null {
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
      return <FallbackListRowFrame>{item.renderRow()}</FallbackListRowFrame>;
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
        {renderFallbackListEntry({ item: entry, index, target: "Cell" })}
        <FallbackListItemSeparator leadingItem={entry} trailingItem={trailingItem} />
      </View>
    );
  });
}

function getEntryType(item: FallbackListEntry) {
  return item.type === "row" ? item.rowType : item.type;
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
  const resetRowPress = () => {
    if (isIos) {
      setPressResetToken((token) => token + 1);
    }
  };

  return (
    <NativeListRow
      {...itemProps}
      disabled={disabled}
      nativeHaptics={itemProps.nativeHaptics ?? true}
      onPress={() => switchProps.onCheckedChange?.(!checked)}
      pressResetToken={isIos ? pressResetToken : undefined}
      iconAfter={
        <View style={styles.trailingControl}>
          <Switch
            {...switchProps}
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
                    resetRowPress();
                  },
                  onPressOut: (
                    event: Parameters<NonNullable<typeof switchProps.onPressOut>>[0],
                  ) => {
                    switchProps.onPressOut?.(event);
                    resetRowPress();
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
  const { defaultRowBackground } = useFallbackRowThemeColors();
  const normalRowBackground = itemProps.backgroundColor ?? defaultRowBackground;

  return (
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
        hoverStyle:
          selectProps.triggerProps?.hoverStyle ??
          ({
            backgroundColor: itemProps.hoverBackgroundColor ?? "$color4",
          } as any),
        pressStyle:
          selectProps.triggerProps?.pressStyle ??
          ({
            background: itemProps.pressBackgroundColor ?? "$color5",
            opacity: 0.6,
          } as any),
      }}
    />
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

/** 以整行 NativeList 样式作为 `Menu` 的 native trigger，不维护选中状态。 */
export function NativeListMenuItem({
  menuProps,
  ...itemProps
}: NativeListMenuItemProps) {
  const disabled = itemProps.disabled || menuProps.triggerProps?.disabled;
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
        isWeb()
          ? hovered && !disabled
            ? hoveredRowBackground
            : normalRowBackground
          : undefined
      }
      disabled={disabled}
      itemProps={itemProps}
    />
  );

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
  disabled,
  hoverBackgroundColor,
  nativeHaptics,
  onPress,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
  pressBackgroundColor,
}: NativeListCustomItemProps) {
  return (
    <FallbackRowContainer
      backgroundColor={backgroundColor}
      disabled={disabled}
      hoverBackgroundColor={hoverBackgroundColor}
      nativeHaptics={nativeHaptics}
      onPress={onPress}
      paddingBottom={paddingBottom}
      paddingHorizontal={paddingHorizontal}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingTop={paddingTop}
      paddingVertical={paddingVertical}
      pressBackgroundColor={pressBackgroundColor}
    >
      <View style={styles.customRowContent}>{children}</View>
    </FallbackRowContainer>
  );
}

export function NativeListSection({
  children,
  footer,
  trailing,
  title,
  titleColor,
  titleFontSize,
}: NativeListSectionProps) {
  const entries = createFallbackListEntries(
    <NativeListSection
      footer={footer}
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
  contentContainerStyle,
  contentMarginBottom,
  contentMarginTop,
  fixesIOS26NestedScrollIndicatorSafeArea: _fixesIOS26NestedScrollIndicatorSafeArea,
  initialScrollTarget,
  native: _native,
  navigationBarScrollEdgeOptions,
  onRefresh,
  scrollable = true,
  style,
  tracksNavigationBarScrollEdge = false,
  ...rest
}: NativeListRootProps) {
  void _native;
  void _fixesIOS26NestedScrollIndicatorSafeArea;
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
  const flashListRef = useRef<FlashListRef<FallbackListEntry> | null>(null);
  const currentWebScrollOffsetRef = useRef(0);
  const pendingWebScrollRestoreRef = useRef(false);
  const savedWebScrollOffsetRef = useRef(0);

  const isRestoreScroll = webAutoRestoreScroll && isWeb();
  const captureWebScrollPosition = useCallback(() => {
    if (!isRestoreScroll) return;

    const actualOffset = getWebScrollableNode(flashListRef.current)?.scrollTop;
    const offset = Math.max(0, actualOffset ?? currentWebScrollOffsetRef.current);
    currentWebScrollOffsetRef.current = offset;
    savedWebScrollOffsetRef.current = offset;
  }, []);
  const entries = useMemo(() => createFallbackListEntries(children), [children]);
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
  const trackedOnScroll = useNavigationBarScrollEdge({
    navigationBarScrollEdgeOptions,
    onScroll,
    tracksNavigationBarScrollEdge,
  });
  const handleFlashListScroll = useCallback(
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
  const restoreWebScrollPosition = useCallback(() => {
    if (!isRestoreScroll || contentOffset != null || !pendingWebScrollRestoreRef.current) return;

    const offset = savedWebScrollOffsetRef.current;
    if (offset <= 0) return;

    flashListRef.current?.scrollToOffset({ animated: false, offset });
    const scrollableNode = getWebScrollableNode(flashListRef.current);
    if (scrollableNode != null) {
      scrollableNode.scrollTop = offset;
    }
  }, [contentOffset]);
  const getActualWebScrollOffset = useCallback(() => {
    return getWebScrollableNode(flashListRef.current)?.scrollTop ?? null;
  }, []);
  const handleFlashListLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onLayout?.(event);
      if (!isRestoreScroll || event.nativeEvent.layout.height <= 0) return;

      restoreWebScrollPosition();
    },
    [onLayout, restoreWebScrollPosition],
  );

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
    // The Web native-stack transition may reset FlashList after focus has already restored it.
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
  const shouldUseTrueSheetScrollView = insideTrueSheet && os() === "android";
  const handleRefresh =
    onRefresh == null
      ? undefined
      : async () => {
          setRefreshing(true);
          try {
            await onRefresh();
          } finally {
            setRefreshing(false);
          }
        };

  if (shouldUseTrueSheetScrollView) {
    return (
      <ScrollView
        alwaysBounceVertical={alwaysBounceVertical}
        contentContainerStyle={[
          styles.rootContent,
          styles.scrollViewportFill,
          rootBackground,
          contentSpacingStyle,
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? "handled"}
        nestedScrollEnabled={nestedScrollEnabled ?? true}
        onLayout={onLayout}
        onScroll={trackedOnScroll}
        scrollEnabled={scrollable}
        scrollEventThrottle={resolvedScrollEventThrottle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator ?? true}
        style={[styles.root, rootBackground, style]}
        {...scrollViewProps}
      >
        {renderStaticEntries(entries)}
      </ScrollView>
    );
  }

  return (
    <FallbackListScrollCaptureContext.Provider value={captureWebScrollPosition}>
      <FlashList
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
        getItemType={getEntryType}
        initialScrollIndex={initialScrollIndex}
        ItemSeparatorComponent={FallbackListItemSeparator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? "handled"}
        keyExtractor={getEntryKey}
        nestedScrollEnabled={nestedScrollEnabled ?? true}
        onLayout={handleFlashListLayout}
        onRefresh={handleRefresh}
        onScroll={handleFlashListScroll}
        ref={flashListRef}
        refreshing={onRefresh != null ? refreshing : undefined}
        renderItem={renderFallbackListEntry}
        scrollEnabled={scrollable}
        scrollEventThrottle={scrollEventThrottle ?? 16}
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
    </FallbackListScrollCaptureContext.Provider>
  );
}

const styles = StyleSheet.create({
  customRowContent: {
    width: "100%",
  },
  disabledContent: {
    opacity: 0.5,
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
