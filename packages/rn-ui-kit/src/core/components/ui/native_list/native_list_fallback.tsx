import { HeaderHeightContext } from "@react-navigation/elements";
import { Check, ChevronRight, ChevronsUpDown } from "@tamagui/lucide-icons-2";
import {
  Children,
  type ComponentType,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useContext,
  useMemo,
  useState,
} from "react";
import { Pressable, ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";

import { isWeb, os } from "../utils/platform";
import { useAppBackgroundColors, useUiPreferences } from "../utils/theme";

import { FlashList, type ListRenderItemInfo } from "../flash_list";
import { Select } from "../select";
import {
  getTrueSheetScrollBottomPadding,
  getTrueSheetScrollIndicatorBottomInset,
} from "../sheet/native_sheet/true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { Switch } from "../switch";
import { SizableText, Text } from "../text";
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
  NativeListItemProps,
  NativeListNavigationItemProps,
  NativeListRootProps,
  NativeListSectionProps,
  NativeListSelectItemProps,
  NativeListSwitchItemProps,
} from "./types";

type RowContainerProps = {
  backgroundColor?: ViewStyle["backgroundColor"];
  children: ReactNode;
  disabled?: boolean;
  hoverBackgroundColor?: ViewStyle["backgroundColor"];
  nativeHaptics?: NativeListItemBaseProps["nativeHaptics"];
  onPress?: () => void;
  pressBackgroundColor?: ViewStyle["backgroundColor"];
};

type FallbackListEntry =
  | {
      key: string;
      sectionKey: string;
      title: ReactNode;
      titleColor?: string;
      titleFontSize?: number;
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
        | "itemRow"
        | "navigationRow"
        | "selectRow"
        | "switchRow"
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

function FallbackRowContainer({
  backgroundColor,
  children,
  disabled,
  hoverBackgroundColor,
  nativeHaptics,
  onPress,
  pressBackgroundColor,
}: RowContainerProps) {
  const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
  const { defaultRowBackground, theme } = useFallbackRowThemeColors();
  const [hovered, setHovered] = useState(false);
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
        style={[styles.rowContainer, getRowBackground(), disabled ? styles.disabledContent : null]}
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
      onPress={() => {
        onPress();
        triggerNativeHaptics(resolvedHaptics);
      }}
      style={styles.pressable}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.rowContainer,
            getRowBackground(pressed),
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
  disabled,
  hoverBackgroundColor,
  icon,
  iconAfter,
  nativeHaptics,
  onPress,
  pressBackgroundColor,
  selected = false,
  subtitle,
  subtitleColor,
  subtitleFontSize,
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
  const customIcon = typeof icon === "string" ? null : icon;

  return (
    <FallbackRowContainer
      backgroundColor={backgroundColor}
      disabled={disabled}
      hoverBackgroundColor={hoverBackgroundColor}
      nativeHaptics={nativeHaptics}
      onPress={onPress}
      pressBackgroundColor={pressBackgroundColor}
    >
      <View style={styles.rowContent}>
        {customIcon != null ? <View style={styles.iconBefore}>{customIcon}</View> : null}
        <View style={[styles.textColumn, { alignItems: titleAlignment }]}>
          {titleNode}
          {subtitleNode}
        </View>
        <View style={styles.iconAfterRow}>
          {valueNode}
          {selected ? <Check color="$accent10" size={18} /> : null}
          {iconAfter}
          {chevron ? <ChevronRight color="$color" opacity={0.58} size={18} /> : null}
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
    sectionProps.title != null || sectionChildren.length > 0 || sectionProps.footer != null;

  if (!hasSectionContent) {
    return;
  }

  if (sectionProps.title != null) {
    entries.push({
      key: `${sectionKey}-header`,
      sectionKey,
      title: sectionProps.title,
      titleColor: sectionProps.titleColor,
      titleFontSize: sectionProps.titleFontSize,
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

  return (
    <NativeListRow
      {...itemProps}
      disabled={disabled}
      nativeHaptics={itemProps.nativeHaptics ?? true}
      onPress={() => switchProps.onCheckedChange?.(!checked)}
      iconAfter={
        <View style={styles.trailingControl}>
          <Switch
            {...switchProps}
            native
            onPress={(event) => {
              switchProps.onPress?.(event);
              event.stopPropagation();
            }}
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
                color={(itemProps.valueColor ?? "$color") as any}
                fontSize={itemProps.valueFontSize ?? "$4"}
                numberOfLines={1}
                opacity={itemProps.valueColor == null ? 0.58 : 1}
              >
                {selectedLabel}
              </Text>
              <ChevronsUpDown color="$color" opacity={0.58} size={14} />
            </View>
          }
        />
      }
      viewportProps={{
        ...selectProps.viewportProps,
        style: [
          isWeb()
            ? {
                maxWidth: 360,
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
          } as any),
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
  pressBackgroundColor,
}: NativeListCustomItemProps) {
  return (
    <FallbackRowContainer
      backgroundColor={backgroundColor}
      disabled={disabled}
      hoverBackgroundColor={hoverBackgroundColor}
      nativeHaptics={nativeHaptics}
      onPress={onPress}
      pressBackgroundColor={pressBackgroundColor}
    >
      <View style={styles.customRowContent}>{children}</View>
    </FallbackRowContainer>
  );
}

export function NativeListSection({
  children,
  footer,
  title,
  titleColor,
  titleFontSize,
}: NativeListSectionProps) {
  const entries = createFallbackListEntries(
    <NativeListSection
      footer={footer}
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
    onScroll,
    scrollEventThrottle,
    scrollIndicatorInsets,
    showsVerticalScrollIndicator,
    ...scrollViewProps
  } = rest;
  void _maintainVisibleContentPosition;
  const headerHeight = useContext(HeaderHeightContext) ?? 0;
  const insets = useSafeAreaInsets();
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
        onScroll={trackedOnScroll}
        scrollEnabled={scrollable}
        scrollEventThrottle={
          scrollEventThrottle ?? (tracksNavigationBarScrollEdge ? 16 : undefined)
        }
        showsVerticalScrollIndicator={showsVerticalScrollIndicator ?? true}
        style={[styles.root, rootBackground, style]}
        {...scrollViewProps}
      >
        {renderStaticEntries(entries)}
      </ScrollView>
    );
  }

  return (
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
      onScroll={trackedOnScroll}
      renderItem={renderFallbackListEntry}
      scrollEnabled={scrollable}
      scrollEventThrottle={scrollEventThrottle ?? (tracksNavigationBarScrollEdge ? 16 : undefined)}
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
    paddingBottom: 8,
    paddingHorizontal: 30,
    paddingTop: 18,
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
  trailingControl: {
    alignItems: "center",
    flexDirection: "row",
  },
});
