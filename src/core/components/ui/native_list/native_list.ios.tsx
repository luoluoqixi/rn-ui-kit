import {
  HStack,
  Host,
  Image,
  List,
  RNHostView,
  Spacer,
  Button as SwiftButton,
  Text as SwiftText,
  Section as SwiftUISection,
  Toggle as SwiftToggle,
  VStack,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  background,
  buttonStyle,
  contentMargins,
  contentShape,
  disabled as disabledModifier,
  font,
  foregroundStyle,
  frame,
  ios15ListRowTopRoundedBackground,
  layoutPriority,
  lineLimit,
  listRowBackground,
  listRowInsets,
  listRowSeparator,
  listSectionSpacing,
  listStyle,
  multilineTextAlignment,
  opacity,
  padding,
  refreshable,
  scrollContentBackground,
  scrollDisabled,
  shapes,
  tint,
  toggleStyle,
  viewID,
} from "@expo/ui/swift-ui/modifiers";
import {
  Children,
  Fragment,
  type ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SFSymbol } from "sf-symbols-typescript";
import { useTheme } from "tamagui";

import { NativePickerSwiftUI } from "../select/native_picker";
import type { NativePickerSwiftUIHandle } from "../select/native_picker";
import { resolveSelectItemGroups } from "../select/select_grouping";
import { Menu } from "../menu";
import { getTrueSheetScrollBottomPadding } from "../sheet/native_sheet/true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { isIos15, isIos26Plus } from "../utils/platform";
import { toSwiftUIHexColor, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import {
  NativeListEditModeProvider,
  useNativeListEditIcons,
  useNativeListEditMode,
  useNativeListEditRow,
} from "./edit_mode";
import {
  NativeListActionItem as FallbackActionItem,
  NativeListCustomItem as FallbackCustomItem,
  NativeListInputItem as FallbackInputItem,
  NativeListItem as FallbackItem,
  NativeListMenuItem as FallbackMenuItem,
  NativeListNavigationItem as FallbackNavigationItem,
  NativeListRoot as FallbackRoot,
  NativeListSection as FallbackSection,
  NativeListSelectItem as FallbackSelectItem,
  NativeListSwitchItem as FallbackSwitchItem,
} from "./native_list_fallback";
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

type NativeListContextValue = {
  native: boolean;
};

type SwiftUIButtonStyle =
  | "automatic"
  | "bordered"
  | "borderedProminent"
  | "borderless"
  | "glass"
  | "glassProminent"
  | "plain";

const NativeListContext = createContext<NativeListContextValue>({ native: true });
const Ios15FirstVisibleRowContext = createContext(false);

const ROW_INSETS = listRowInsets({ top: 0, leading: 0, bottom: 0, trailing: 0 });
const IOS15_SECTION_HEADER_ROW_INSETS = listRowInsets({
  top: 0,
  leading: 20,
  bottom: 0,
  trailing: 20,
});
const IOS15_SECTION_HEADER_ROW_BACKGROUND = listRowBackground("clear");
const IOS15_SECTION_HEADER_ROW_SEPARATOR = listRowSeparator("hidden");
const ROW_PADDING = { top: 0, bottom: 0, leading: 0, trailing: 0 } as const;
const DEFAULT_TITLE_FONT_SIZE = 17;
const DEFAULT_SUBTITLE_FONT_SIZE = 13;
const DEFAULT_VALUE_FONT_SIZE = 17;
const DEFAULT_SECTION_TITLE_FONT_SIZE = 13;
const DEFAULT_TEXT_AREA_LINES = 4;
const TEXT_AREA_LINE_HEIGHT = 24;
const TEXT_AREA_VERTICAL_PADDING = 20;

function resolveRowPadding({
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
}: NativeListItemPaddingProps) {
  return {
    top: paddingTop ?? paddingVertical ?? ROW_PADDING.top,
    bottom: paddingBottom ?? paddingVertical ?? ROW_PADDING.bottom,
    leading: paddingLeft ?? paddingHorizontal ?? ROW_PADDING.leading,
    trailing: paddingRight ?? paddingHorizontal ?? ROW_PADDING.trailing,
  };
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

function resolveEditingInputDisplay(value: unknown, defaultValue: unknown, placeholder: unknown) {
  const inputValue = value ?? defaultValue;
  const text =
    typeof inputValue === "string" || typeof inputValue === "number" ? String(inputValue) : "";

  if (text.length > 0) {
    return { placeholder: false, text };
  }

  return {
    placeholder: true,
    text: typeof placeholder === "string" ? placeholder : "",
  };
}

function titleModifiers(fontSize?: number) {
  return [font({ size: fontSize ?? DEFAULT_TITLE_FONT_SIZE, weight: "regular" })];
}

function subtitleModifiers(fontSize?: number) {
  return [font({ size: fontSize ?? DEFAULT_SUBTITLE_FONT_SIZE, weight: "regular" }), lineLimit(4)];
}

function valueModifiers(fontSize?: number) {
  return [font({ size: fontSize ?? DEFAULT_VALUE_FONT_SIZE, weight: "regular" }), lineLimit(1)];
}

function toPlainText(value: ReactNode): string | null {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return null;
}

function useNativeListEnabled() {
  return useContext(NativeListContext).native;
}

function supportsNativeTextRow(...values: Array<ReactNode | undefined>) {
  return values.every((value) => value == null || toPlainText(value) != null);
}

function resolveNativeListBtnTintColor(
  btnTint: boolean | string | undefined,
  primaryColor: string,
) {
  if (btnTint === false || btnTint == null) {
    return null;
  }

  return typeof btnTint === "string" ? btnTint : primaryColor;
}

function resolveNativeListTitleColor(
  titleColor: boolean | string | undefined,
  theme: ReturnType<typeof useTheme>,
) {
  if (titleColor === false) {
    return null;
  }
  const primaryColor = toSwiftUIHexColor(theme.gray12.val) ?? theme.gray12.val;
  return typeof titleColor === "string"
    ? (toSwiftUIHexColor(titleColor) ?? titleColor)
    : primaryColor;
}

function resolveNativeListAssistColor(theme: ReturnType<typeof useTheme>) {
  return (
    toSwiftUIHexColor(theme.gray11?.val) ??
    toSwiftUIHexColor(theme.color06?.val) ??
    toSwiftUIHexColor(theme.color4.val) ??
    theme.gray11?.val ??
    theme.color06?.val ??
    theme.color4.val
  );
}

function resolveNativeListEditIndicatorBorderColor(theme: ReturnType<typeof useTheme>) {
  return (
    toSwiftUIHexColor(theme.gray8?.val) ??
    toSwiftUIHexColor(theme.color7?.val) ??
    toSwiftUIHexColor(theme.borderColor?.val) ??
    theme.gray8?.val ??
    theme.color7?.val ??
    theme.borderColor?.val
  );
}

function NativeRowLabel({
  subtitle,
  subtitleColor,
  subtitleFontSize,
  title,
  titleAlign,
  expand = false,
  titleColor,
  titleFontSize,
  titleLineLimit,
  layoutPriorityValue = 1,
  preserveLeadingAnchor = false,
}: {
  subtitle?: ReactNode;
  subtitleColor?: string;
  subtitleFontSize?: number;
  title?: ReactNode;
  titleAlign?: "center" | "right" | "left";
  expand?: boolean;
  titleColor?: boolean | string | null;
  titleFontSize?: number;
  titleLineLimit?: number;
  layoutPriorityValue?: number;
  preserveLeadingAnchor?: boolean;
}) {
  const theme = useTheme();
  const titleText = toPlainText(title);
  const subtitleText = toPlainText(subtitle);
  const assistColor = resolveNativeListAssistColor(theme);
  const resolvedTextAlignment =
    titleAlign === "center" ? "center" : titleAlign === "right" ? "trailing" : "leading";
  const resolvedTitleColor = resolveNativeListTitleColor(titleColor ?? undefined, theme);
  const resolvedSubtitleColor =
    (subtitleColor != null ? toSwiftUIHexColor(subtitleColor) : undefined) ?? assistColor;

  if ((title != null && titleText == null) || (subtitle != null && subtitleText == null)) {
    return null;
  }

  const labelContent = (
    <VStack
      alignment={resolvedTextAlignment}
      modifiers={[
        ...(expand ? [frame({ maxWidth: 99999, alignment: resolvedTextAlignment })] : []),
      ]}
      spacing={subtitleText != null ? 4 : 0}
    >
      {titleText != null ? (
        <SwiftText
          modifiers={[
            ...titleModifiers(titleFontSize),
            ...(resolvedTitleColor != null ? [foregroundStyle(resolvedTitleColor)] : []),
            lineLimit(titleLineLimit ?? (subtitleText != null ? 2 : 1)),
            multilineTextAlignment(resolvedTextAlignment),
          ]}
        >
          {titleText}
        </SwiftText>
      ) : null}
      {subtitleText != null ? (
        <SwiftText
          modifiers={[
            ...subtitleModifiers(subtitleFontSize),
            foregroundStyle(resolvedSubtitleColor),
          ]}
        >
          {subtitleText}
        </SwiftText>
      ) : null}
    </VStack>
  );

  if (preserveLeadingAnchor && resolvedTextAlignment === "center") {
    return (
      <ZStack
        alignment="center"
        modifiers={[
          layoutPriority(layoutPriorityValue),
          ...(expand ? [frame({ maxWidth: 99999 })] : []),
        ]}
      >
        <VStack
          alignment="leading"
          modifiers={[
            opacity(0),
            ...(expand ? [frame({ maxWidth: 99999, alignment: "leading" })] : []),
          ]}
          spacing={subtitleText != null ? 4 : 0}
        >
          {titleText != null ? (
            <SwiftText
              modifiers={[
                ...titleModifiers(titleFontSize),
                lineLimit(titleLineLimit ?? (subtitleText != null ? 2 : 1)),
              ]}
            >
              {titleText}
            </SwiftText>
          ) : null}
          {subtitleText != null ? (
            <SwiftText modifiers={subtitleModifiers(subtitleFontSize)}>{subtitleText}</SwiftText>
          ) : null}
        </VStack>
        {labelContent}
      </ZStack>
    );
  }

  return <VStack modifiers={[layoutPriority(layoutPriorityValue)]}>{labelContent}</VStack>;
}

function NativeRowContainer({
  children,
  disabled,
  editingSelected,
  nativeScrollId,
  onPress,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
  btnStyle,
  btnTint,
  rowAlignment = "center",
  rowMinHeight,
}: {
  children: ReactNode;
  disabled?: boolean;
  editingSelected?: boolean;
  nativeScrollId?: string | number;
  onPress?: () => void;
  btnStyle?: SwiftUIButtonStyle;
  btnTint?: boolean | string;
  rowAlignment?: "center" | "top";
  rowMinHeight?: number;
} & NativeListItemPaddingProps) {
  const theme = useTheme();
  const restoresIos15TopCorners = useContext(Ios15FirstVisibleRowContext);
  const primaryColor = toSwiftUIHexColor(theme.color.val) ?? theme.color.val;
  const selectedBackgroundColor =
    toSwiftUIHexColor(theme.color5?.val ?? theme.backgroundPress?.val ?? theme.background?.val) ??
    theme.color5?.val;
  const resolvedTint = resolveNativeListBtnTintColor(btnTint, primaryColor);
  const baseModifiers = [
    ROW_INSETS,
    padding(
      resolveRowPadding({
        paddingBottom,
        paddingHorizontal,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingVertical,
      }),
    ),
    ...(rowMinHeight != null
      ? [
          frame({
            minHeight: rowMinHeight,
            alignment: rowAlignment === "top" ? "topLeading" : "leading",
          }),
        ]
      : []),
  ];

  if (onPress != null) {
    return (
      <SwiftButton
        modifiers={[
          disabledModifier(disabled ?? false),
          buttonStyle(btnStyle ?? "automatic"),
          ...(nativeScrollId != null ? [viewID(nativeScrollId)] : []),
          ...(editingSelected && selectedBackgroundColor != null
            ? [listRowBackground(selectedBackgroundColor)]
            : []),
        ]}
        onPress={onPress}
      >
        <HStack
          alignment={rowAlignment}
          modifiers={[
            ...baseModifiers,
            ...(btnStyle === "plain" || restoresIos15TopCorners
              ? [frame({ maxWidth: 99999, alignment: "leading" })]
              : []),
            ...(btnStyle === "plain" ? [contentShape(shapes.rectangle())] : []),
            ...(resolvedTint != null ? [tint(resolvedTint)] : []),
            ...(restoresIos15TopCorners
              ? [
                  ios15ListRowTopRoundedBackground(12, {
                    horizontal: 20,
                    top: 6,
                  }),
                ]
              : []),
          ]}
          spacing={12}
        >
          {children}
        </HStack>
      </SwiftButton>
    );
  }

  return (
    <HStack
      alignment={rowAlignment}
      modifiers={[
        ...baseModifiers,
        disabledModifier(disabled ?? false),
        ...(nativeScrollId != null ? [viewID(nativeScrollId)] : []),
        ...(editingSelected && selectedBackgroundColor != null
          ? [listRowBackground(selectedBackgroundColor)]
          : []),
        ...(restoresIos15TopCorners ? [frame({ maxWidth: 99999, alignment: "leading" })] : []),
        ...(restoresIos15TopCorners ? [ios15ListRowTopRoundedBackground()] : []),
      ]}
      spacing={12}
    >
      {children}
    </HStack>
  );
}

function NativeEditingIndicator({ selected }: { selected: boolean }) {
  const theme = useTheme();
  const { editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol } =
    useNativeListEditIcons();
  const customIcon = selected ? editModeSelectedIcon : editModeIcon;
  const configuredSfSymbol = selected ? editModeSelectedSfSymbol : editModeSfSymbol;
  const accentColor =
    toSwiftUIHexColor(theme.accent10?.val ?? theme.color10?.val ?? theme.color.val) ??
    theme.accent10?.val ??
    theme.color10?.val ??
    theme.color.val;
  const borderColor = resolveNativeListEditIndicatorBorderColor(theme);

  if (configuredSfSymbol != null) {
    return (
      <Image
        color={selected ? accentColor : borderColor}
        size={24}
        systemName={configuredSfSymbol}
      />
    );
  }

  if (customIcon != null) {
    return <NativeHostedEditingIcon>{customIcon}</NativeHostedEditingIcon>;
  }

  return (
    <Image
      color={selected ? accentColor : borderColor}
      size={24}
      systemName={selected ? "checkmark.circle.fill" : "circle"}
    />
  );
}

function NativeHostedIcon({ children }: { children: ReactNode }) {
  return (
    <RNHostView matchContents>
      {/*
       * RNHostView(matchContents) reads the bounds of its first direct native child.
       * Keep this wrapper from being flattened, otherwise SVG-based icons can make
       * RNHostView fall back to an unbounded SwiftUI frame and consume the whole row.
       */}
      <View collapsable={false} style={styles.hostedIcon}>
        {children}
      </View>
    </RNHostView>
  );
}

function NativeHostedEditingIcon({ children }: { children: ReactNode }) {
  return (
    <RNHostView matchContents>
      <View collapsable={false} style={styles.hostedEditingIcon}>
        {children}
      </View>
    </RNHostView>
  );
}

function NativeHostedContent({ children }: { children: ReactNode }) {
  return (
    <RNHostView matchContents>
      <View collapsable={false} style={styles.hostedContent}>
        {children}
      </View>
    </RNHostView>
  );
}

function NativeHostedTrailingControl({
  children,
  disableInEditMode = false,
}: {
  children: ReactNode;
  disableInEditMode?: boolean;
}) {
  const editMode = useNativeListEditMode();
  const interactionsDisabled = editMode && disableInEditMode;

  return (
    <RNHostView matchContents>
      <View
        collapsable={false}
        pointerEvents={interactionsDisabled ? "none" : "auto"}
        style={styles.trailingHostedContent}
      >
        {children}
      </View>
    </RNHostView>
  );
}

function NativeTrailingContent({ children }: { children: ReactNode }) {
  const text = toPlainText(children);

  if (text != null) {
    return <SwiftText modifiers={valueModifiers()}>{text}</SwiftText>;
  }

  return <NativeHostedTrailingControl>{children}</NativeHostedTrailingControl>;
}

function NativeHostedCustomRow({
  children,
  disableInteractions = false,
}: {
  children: ReactNode;
  disableInteractions?: boolean;
}) {
  return (
    <RNHostView matchContents={{ vertical: true } as unknown as boolean}>
      <View
        collapsable={false}
        pointerEvents={disableInteractions ? "none" : "auto"}
        style={styles.customRowShell}
      >
        {children}
      </View>
    </RNHostView>
  );
}

function NativePressRow({
  chevron = false,
  chevronColor,
  disabled,
  icon,
  iconColor,
  iconSize,
  iconSlotWidth,
  sfSymbol,
  nativeHaptics,
  nativeScrollId,
  onPress,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
  selected = false,
  selectionId,
  subtitle,
  subtitleColor,
  subtitleFontSize,
  trailing,
  title,
  titleAlign,
  titleColor,
  titleFontSize,
  titleLineLimit,
  trailingControl,
  overlayTrailingControlOnValueSymbol = false,
  preserveValueWidth = false,
  value,
  valueColor,
  valueFontSize,
  valueSfSymbol,
  btnStyle,
  btnTint,
  preserveLeadingAnchor = false,
  rowAlignment = "center",
  rowMinHeight,
}: NativeListItemBaseProps & {
  trailingControl?: ReactNode;
  overlayTrailingControlOnValueSymbol?: boolean;
  preserveValueWidth?: boolean;
  btnStyle?: SwiftUIButtonStyle;
  preserveLeadingAnchor?: boolean;
  rowAlignment?: "center" | "top";
  rowMinHeight?: number;
  titleLineLimit?: number;
  valueSfSymbol?: SFSymbol;
}) {
  const theme = useTheme();
  const editRow = useNativeListEditRow({ disabled, nativeScrollId, onPress, selectionId });
  const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
  const accentColor = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
  const assistColor = resolveNativeListAssistColor(theme);
  const resolvedChevronColor =
    (chevronColor != null ? toSwiftUIHexColor(chevronColor) : undefined) ?? assistColor;
  const resolvedIconColor =
    (iconColor != null ? toSwiftUIHexColor(iconColor) : undefined) ?? accentColor;
  const resolvedIconSize = iconSize ?? 20;
  const resolvedIconSlotWidth = iconSlotWidth ?? Math.max(24, resolvedIconSize);
  const resolvedValueColor =
    (valueColor != null ? toSwiftUIHexColor(valueColor) : undefined) ?? assistColor;
  const titleText = toPlainText(title);
  const subtitleText = toPlainText(subtitle);
  const valueText = toPlainText(value);
  const hasTrailingContent =
    valueText != null ||
    valueSfSymbol != null ||
    (!editRow.editMode && selected) ||
    trailing != null ||
    trailingControl != null ||
    (!editRow.editMode && chevron);
  const showTrailingSpacer = hasTrailingContent && (titleText != null || subtitleText != null);

  const handlePress = editRow.onPress
    ? () => {
        editRow.onPress?.();
        triggerNativeHaptics(resolvedHaptics);
      }
    : undefined;

  return (
    <NativeRowContainer
      disabled={disabled}
      editingSelected={editRow.editingSelected}
      onPress={handlePress}
      btnStyle={btnStyle}
      btnTint={btnTint}
      nativeScrollId={nativeScrollId}
      paddingBottom={paddingBottom}
      paddingHorizontal={paddingHorizontal}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingTop={paddingTop}
      paddingVertical={paddingVertical}
      rowAlignment={rowAlignment}
      rowMinHeight={rowMinHeight}
    >
      {editRow.editMode ? (
        <NativeEditingIndicator key="edit-mode-indicator" selected={editRow.editingSelected} />
      ) : null}
      {sfSymbol != null ? (
        <ZStack
          key="leading-icon"
          alignment="center"
          modifiers={[frame({ width: resolvedIconSlotWidth, alignment: "center" })]}
        >
          <Image color={resolvedIconColor} size={resolvedIconSize} systemName={sfSymbol} />
        </ZStack>
      ) : icon != null ? (
        <NativeHostedIcon key="leading-icon">{icon}</NativeHostedIcon>
      ) : null}
      <NativeRowLabel
        key="row-label"
        subtitle={subtitleText ?? undefined}
        subtitleColor={subtitleColor}
        subtitleFontSize={subtitleFontSize}
        title={titleText ?? undefined}
        titleAlign={titleAlign}
        expand={titleAlign != null}
        titleColor={titleColor ?? btnTint}
        titleFontSize={titleFontSize}
        titleLineLimit={titleLineLimit}
        layoutPriorityValue={preserveValueWidth ? 0 : 1}
        preserveLeadingAnchor={preserveLeadingAnchor}
      />
      {showTrailingSpacer ? <Spacer key="trailing-spacer" minLength={12} /> : null}
      {valueText != null ? (
        <SwiftText
          key="row-value"
          modifiers={[
            ...valueModifiers(valueFontSize),
            foregroundStyle(resolvedValueColor),
            ...(preserveValueWidth ? [layoutPriority(2)] : []),
          ]}
        >
          {valueText}
        </SwiftText>
      ) : null}
      {valueSfSymbol != null ? (
        <ZStack
          key="row-value-symbol"
          alignment="center"
          modifiers={preserveValueWidth ? [layoutPriority(2)] : undefined}
        >
          <Image color={resolvedValueColor} size={13} systemName={valueSfSymbol} />
          {overlayTrailingControlOnValueSymbol && trailingControl != null ? (
            <Fragment key="trailing-control-overlay">{trailingControl}</Fragment>
          ) : null}
        </ZStack>
      ) : null}
      {!editRow.editMode && selected ? (
        <Image key="selected-checkmark" color={accentColor} size={18} systemName="checkmark" />
      ) : null}
      {trailing != null ? (
        <NativeTrailingContent key="custom-trailing">{trailing}</NativeTrailingContent>
      ) : null}
      {trailingControl != null && !overlayTrailingControlOnValueSymbol ? (
        <Fragment key="trailing-control">{trailingControl}</Fragment>
      ) : null}
      {!editRow.editMode && chevron ? (
        <Image key="chevron" color={resolvedChevronColor} size={13} systemName="chevron.right" />
      ) : null}
    </NativeRowContainer>
  );
}

function NativeListRoot({
  automaticallyAdjustsScrollIndicatorInsets,
  backgroundColor,
  children,
  contentInsetAdjustmentBehavior,
  contentMarginBottom,
  contentMarginTop,
  defaultSelectedIds,
  editMode,
  editModeIcon,
  editModeSelectedIcon,
  editModeSelectedSfSymbol,
  editModeSfSymbol,
  fixesIOS26NestedScrollIndicatorSafeArea,
  initialScrollTarget,
  native = true,
  nestedScrollEnabled,
  navigationBarScrollEdgeOptions,
  onRefresh,
  onSelectedIdsChange,
  scrollIndicatorInsets,
  style,
  scrollable = true,
  selectedIds,
  tracksNavigationBarScrollEdge,
  webAutoRestoreScroll: _webAutoRestoreScroll,
  ...fallbackProps
}: NativeListRootProps) {
  const insets = useSafeAreaInsets();
  const {
    active: insideTrueSheet,
    automaticContentInsetAdjustment,
    insetAdjustment,
    nativeScrollInsetsApplied,
    presentationActive: trueSheetPresentationActive,
  } = useTrueSheetScrollLayout();
  const resolvedBackgroundColor =
    backgroundColor != null ? (toSwiftUIHexColor(backgroundColor) ?? undefined) : undefined;
  const isNestedNativeList = nestedScrollEnabled === true;

  if (!native) {
    return (
      <NativeListContext.Provider value={{ native: false }}>
        <FallbackRoot
          {...fallbackProps}
          fixesIOS26NestedScrollIndicatorSafeArea={fixesIOS26NestedScrollIndicatorSafeArea}
          automaticallyAdjustsScrollIndicatorInsets={automaticallyAdjustsScrollIndicatorInsets}
          backgroundColor={backgroundColor}
          contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
          defaultSelectedIds={defaultSelectedIds}
          editMode={editMode}
          editModeIcon={editModeIcon}
          editModeSelectedIcon={editModeSelectedIcon}
          editModeSelectedSfSymbol={editModeSelectedSfSymbol}
          editModeSfSymbol={editModeSfSymbol}
          nestedScrollEnabled={nestedScrollEnabled}
          navigationBarScrollEdgeOptions={navigationBarScrollEdgeOptions}
          onRefresh={onRefresh}
          onSelectedIdsChange={onSelectedIdsChange}
          scrollIndicatorInsets={scrollIndicatorInsets}
          style={style}
          scrollable={scrollable}
          selectedIds={selectedIds}
          tracksNavigationBarScrollEdge={tracksNavigationBarScrollEdge}
        >
          {children}
        </FallbackRoot>
      </NativeListContext.Provider>
    );
  }

  const bottomPadding =
    insideTrueSheet && scrollable && !isNestedNativeList
      ? getTrueSheetScrollBottomPadding({
          insetAdjustment,
          nativeScrollInsetsApplied,
          safeAreaBottom: insets.bottom,
        })
      : 0;
  // 默认只关闭普通 native-stack 页面的重复自动调整，不注入窗口底部安全区。
  // 定高内嵌列表的安全区由外层滚动视图处理，不能再按页面级根列表自动调整。
  const manuallyAdjustNormalPageIndicator =
    (!insideTrueSheet || isNestedNativeList) && automaticallyAdjustsScrollIndicatorInsets == null;
  const compensatesForTrueSheetViewportClipping =
    insideTrueSheet &&
    scrollable &&
    !isNestedNativeList &&
    automaticallyAdjustsScrollIndicatorInsets !== false;
  const resolvedContentInsetAdjustmentBehavior =
    contentInsetAdjustmentBehavior ??
    (isNestedNativeList
      ? "never"
      : insideTrueSheet && automaticContentInsetAdjustment
        ? "automatic"
        : undefined);
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
      <NativeListContext.Provider value={{ native: true }}>
        <Host style={[styles.nativeRoot, style]}>
          <List
            // Native-stack 已将普通页面放在 header 下方，UIKit 再自动避让会让 indicator 重复下移。
            // TrueSheet 仍需要系统根据 Sheet viewport 处理 indicator，因此保持开启。
            automaticallyAdjustsScrollIndicatorInsets={
              manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets
            }
            contentInsetAdjustmentBehavior={resolvedContentInsetAdjustmentBehavior}
            tracksNavigationBarScrollEdge={
              (!insideTrueSheet || trueSheetPresentationActive) &&
              (tracksNavigationBarScrollEdge ??
                (!insideTrueSheet && resolvedContentInsetAdjustmentBehavior === "automatic"))
            }
            // 只有页面级根列表才需要按 TrueSheet 的可见 viewport 裁剪；
            // 内嵌列表保留自身完整高度，由外层 ScrollView 决定何时进入可见区域。
            compensatesForViewportClipping={compensatesForTrueSheetViewportClipping}
            correctsNestedScrollIndicatorFrame={
              isIos26Plus() && fixesIOS26NestedScrollIndicatorSafeArea === true
            }
            initialScrollAnchor="center"
            initialScrollTarget={initialScrollTarget}
            modifiers={[
              listStyle("insetGrouped"),
              listSectionSpacing("compact"),
              /**
               * iOS 15 的 SwiftUI List 不支持 `scrollContentBackground(.hidden)`，
               * 因此即使这里传入自定义 `backgroundColor`，系统列表内容背景仍可能覆盖它。
               */
              scrollContentBackground("hidden"),
              ...(resolvedBackgroundColor != null ? [background(resolvedBackgroundColor)] : []),
              ...(contentMarginTop != null
                ? [
                    contentMargins({
                      edges: "top",
                      length: contentMarginTop,
                      placement: "scrollContent",
                    }),
                  ]
                : []),
              ...(!insideTrueSheet && contentMarginBottom != null
                ? [
                    contentMargins({
                      edges: "bottom",
                      length: contentMarginBottom,
                      placement: "scrollContent",
                    }),
                  ]
                : []),
              ...(insideTrueSheet && bottomPadding > 0
                ? [
                    contentMargins({
                      edges: "bottom",
                      length: bottomPadding + (contentMarginBottom ?? 0),
                      placement: "scrollContent",
                    }),
                  ]
                : insideTrueSheet && contentMarginBottom != null
                  ? [
                      contentMargins({
                        edges: "bottom",
                        length: contentMarginBottom,
                        placement: "scrollContent",
                      }),
                    ]
                  : []),
              ...(onRefresh != null
                ? [
                    refreshable(async () => {
                      await onRefresh();
                    }),
                  ]
                : []),
              scrollDisabled(!scrollable),
            ]}
          >
            {children}
          </List>
        </Host>
      </NativeListContext.Provider>
    </NativeListEditModeProvider>
  );
}

function NativeListSection({
  children,
  footer,
  trailing,
  title,
  titleColor,
  titleFontSize,
}: NativeListSectionProps) {
  if (!useNativeListEnabled()) {
    return (
      <FallbackSection
        footer={footer}
        trailing={trailing}
        title={title}
        titleColor={titleColor}
        titleFontSize={titleFontSize}
      >
        {children}
      </FallbackSection>
    );
  }

  const stringTitle = toPlainText(title);
  const stringFooter = toPlainText(footer);
  const resolvedSectionTitleColor =
    titleColor != null ? (toSwiftUIHexColor(titleColor) ?? titleColor) : undefined;
  const usesIos15HeaderRow =
    isIos15() &&
    ((title != null && stringTitle == null) || (trailing != null && toPlainText(trailing) == null));
  const header =
    trailing != null || usesIos15HeaderRow ? (
      <HStack
        alignment="center"
        modifiers={[
          frame({
            maxWidth: 99999,
            alignment: "leading",
          }),
          ...(usesIos15HeaderRow
            ? [
                IOS15_SECTION_HEADER_ROW_INSETS,
                IOS15_SECTION_HEADER_ROW_BACKGROUND,
                IOS15_SECTION_HEADER_ROW_SEPARATOR,
              ]
            : []),
        ]}
        spacing={8}
      >
        {stringTitle != null ? (
          <SwiftText
            modifiers={[
              font({ size: titleFontSize ?? DEFAULT_SECTION_TITLE_FONT_SIZE, weight: "regular" }),
              ...(resolvedSectionTitleColor != null
                ? [foregroundStyle(resolvedSectionTitleColor)]
                : []),
            ]}
          >
            {stringTitle}
          </SwiftText>
        ) : title != null ? (
          <NativeHostedContent>{title}</NativeHostedContent>
        ) : null}
        {trailing != null ? <Spacer minLength={0} /> : null}
        {trailing != null ? <NativeTrailingContent>{trailing}</NativeTrailingContent> : null}
      </HStack>
    ) : stringTitle != null && (resolvedSectionTitleColor != null || titleFontSize != null) ? (
      <SwiftText
        modifiers={[
          font({ size: titleFontSize ?? DEFAULT_SECTION_TITLE_FONT_SIZE, weight: "regular" }),
          ...(resolvedSectionTitleColor != null
            ? [foregroundStyle(resolvedSectionTitleColor)]
            : []),
        ]}
      >
        {stringTitle}
      </SwiftText>
    ) : title != null && stringTitle == null ? (
      <NativeHostedContent>{title}</NativeHostedContent>
    ) : undefined;
  const footerView =
    stringFooter != null ? (
      <SwiftText modifiers={subtitleModifiers()}>{stringFooter}</SwiftText>
    ) : footer != null ? (
      <NativeHostedContent>{footer}</NativeHostedContent>
    ) : undefined;

  if (usesIos15HeaderRow && header != null) {
    const [firstChild, ...remainingChildren] = Children.toArray(children);

    return (
      <SwiftUISection footer={footerView}>
        {header}
        {firstChild != null ? (
          <Ios15FirstVisibleRowContext.Provider value>
            {firstChild}
          </Ios15FirstVisibleRowContext.Provider>
        ) : null}
        {remainingChildren}
      </SwiftUISection>
    );
  }

  return (
    <SwiftUISection
      footer={footerView}
      header={header}
      title={header == null ? (stringTitle ?? undefined) : undefined}
    >
      {children}
    </SwiftUISection>
  );
}

export function NativeListActionItem(props: NativeListActionItemProps) {
  if (!useNativeListEnabled()) {
    return <FallbackActionItem {...props} />;
  }

  if (!supportsNativeTextRow(props.title, props.subtitle, props.value)) {
    return <FallbackActionItem {...props} />;
  }

  return <NativePressRow {...props} chevron={props.chevron} />;
}

export function NativeListNavigationItem(props: NativeListNavigationItemProps) {
  if (!useNativeListEnabled()) {
    return <FallbackNavigationItem {...props} />;
  }

  if (!supportsNativeTextRow(props.title, props.subtitle, props.value)) {
    return <FallbackNavigationItem {...props} />;
  }

  return <NativePressRow {...props} chevron={props.chevron ?? true} />;
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
  const defaultColor = theme.accent10.val;
  let resolveColor = btnTint ?? defaultColor;
  if (typeof resolveColor === "string") {
    resolveColor = toSwiftUIHexColor(resolveColor) ?? false;
  }

  return (
    <NativeListItem
      {...itemProps}
      title={title}
      disabled={disabled}
      onPress={onPress}
      titleAlign={titleAlign}
      value={undefined}
      btnTint={resolveColor}
    />
  );
}

/**
 * Keeps a React Native text input inside the SwiftUI List row, which preserves
 * controlled values and the full `Input` API while retaining native list chrome.
 */
export function NativeListInputItem({ inputProps, ...itemProps }: NativeListInputItemProps) {
  const nativeListEnabled = useNativeListEnabled();
  const editMode = useNativeListEditMode();
  const theme = useTheme();
  const [uncontrolledEditingValue, setUncontrolledEditingValue] = useState(() =>
    typeof inputProps.defaultValue === "string" ? inputProps.defaultValue : "",
  );
  const disabled = itemProps.disabled || inputProps.disabled;
  const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
  const {
    autoFocusNative,
    disabled: _inputDisabled,
    onChangeText,
    style: inputStyle,
    unstyled: _unstyled,
    ...nativeInputProps
  } = inputProps;
  const editingDisplay = resolveEditingInputDisplay(
    inputProps.value ?? uncontrolledEditingValue,
    inputProps.defaultValue,
    inputProps.placeholder,
  );
  const flattenedInputStyle = StyleSheet.flatten(inputStyle) as { color?: unknown } | undefined;
  const editingTextColor = editingDisplay.placeholder
    ? typeof inputProps.placeholderTextColor === "string"
      ? inputProps.placeholderTextColor
      : (theme.gray9?.val ?? theme.color10.val)
    : typeof flattenedInputStyle?.color === "string"
      ? flattenedInputStyle.color
      : (theme.gray12?.val ?? theme.color.val);
  const resolvedInput = (
    <TextInput
      {...(nativeInputProps as any)}
      autoFocus={autoFocusNative ?? inputProps.autoFocus ?? false}
      textAlign={inputProps.textAlign ?? (hasLeadingLabel ? "right" : undefined)}
      clearButtonMode={inputProps.clearButtonMode ?? "while-editing"}
      editable={!disabled}
      multiline={inputProps.multiline ?? false}
      onChangeText={(nextValue) => {
        setUncontrolledEditingValue(nextValue);
        onChangeText?.(nextValue);
      }}
      placeholderTextColor={
        inputProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val
      }
      style={[
        styles.input,
        !hasLeadingLabel ? styles.fullWidthInput : null,
        { color: theme.gray12?.val ?? theme.color.val },
        inputStyle,
      ]}
    />
  );

  if (hasLeadingLabel) {
    if (!nativeListEnabled) {
      return <FallbackInputItem inputProps={inputProps} {...itemProps} />;
    }

    if (editMode) {
      return (
        <NativePressRow
          {...itemProps}
          disabled={disabled}
          value={editingDisplay.text}
          valueColor={editingTextColor}
        />
      );
    }

    return (
      <NativePressRow
        {...itemProps}
        disabled={disabled}
        trailingControl={
          <NativeHostedTrailingControl>
            <View collapsable={false} style={styles.inputTrailing}>
              {resolvedInput}
            </View>
          </NativeHostedTrailingControl>
        }
      />
    );
  }

  if (nativeListEnabled && editMode) {
    return (
      <NativePressRow
        {...itemProps}
        disabled={disabled}
        title={editingDisplay.text}
        titleColor={editingTextColor}
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
  const nativeListEnabled = useNativeListEnabled();
  const editMode = useNativeListEditMode();
  const theme = useTheme();
  const [uncontrolledEditingValue, setUncontrolledEditingValue] = useState(() =>
    typeof textAreaProps.defaultValue === "string" ? textAreaProps.defaultValue : "",
  );
  const disabled = itemProps.disabled || textAreaProps.disabled;
  const textAreaHeight = resolveTextAreaHeight(textAreaProps);
  const {
    disabled: _inputDisabled,
    onChangeText,
    scrollEnabled,
    style: inputStyle,
    unstyled: _unstyled,
    ...nativeTextAreaProps
  } = textAreaProps;
  const editingDisplay = resolveEditingInputDisplay(
    textAreaProps.value ?? uncontrolledEditingValue,
    textAreaProps.defaultValue,
    textAreaProps.placeholder,
  );
  const flattenedInputStyle = StyleSheet.flatten(inputStyle) as { color?: unknown } | undefined;
  const editingLineLimit =
    typeof textAreaProps.numberOfLines === "number"
      ? textAreaProps.numberOfLines
      : DEFAULT_TEXT_AREA_LINES;
  const editingTextColor = editingDisplay.placeholder
    ? typeof textAreaProps.placeholderTextColor === "string"
      ? textAreaProps.placeholderTextColor
      : (theme.gray9?.val ?? theme.color10.val)
    : typeof flattenedInputStyle?.color === "string"
      ? flattenedInputStyle.color
      : (theme.gray12?.val ?? theme.color.val);

  if (nativeListEnabled && editMode) {
    return (
      <NativePressRow
        {...itemProps}
        disabled={disabled}
        paddingBottom={itemProps.paddingBottom ?? itemProps.paddingVertical ?? 10}
        paddingTop={itemProps.paddingTop ?? itemProps.paddingVertical ?? 10}
        rowAlignment="top"
        rowMinHeight={textAreaHeight}
        title={editingDisplay.text}
        titleColor={editingTextColor}
        titleLineLimit={editingLineLimit}
      />
    );
  }

  return (
    <NativeListCustomItem {...itemProps} disabled={disabled}>
      <View collapsable={false} style={[styles.textAreaRow, { height: textAreaHeight }]}>
        <TextInput
          {...(nativeTextAreaProps as any)}
          editable={!disabled}
          multiline
          onChangeText={(nextValue) => {
            setUncontrolledEditingValue(nextValue);
            onChangeText?.(nextValue);
          }}
          placeholderTextColor={
            textAreaProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val
          }
          scrollEnabled={scrollEnabled ?? true}
          style={[
            styles.textArea,
            {
              color: theme.gray12?.val ?? theme.color.val,
              height: textAreaHeight,
              minHeight: textAreaHeight,
            },
            inputStyle,
          ]}
        />
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
  if (!useNativeListEnabled() || !supportsNativeTextRow(itemProps.subtitle)) {
    return (
      <FallbackItem
        title={title}
        onPress={onPress}
        disabled={disabled}
        titleAlign={titleAlign}
        btnTint={btnTint}
        {...itemProps}
      />
    );
  }

  return (
    <NativePressRow
      {...itemProps}
      title={title}
      disabled={disabled}
      onPress={onPress}
      titleAlign={titleAlign}
      btnTint={btnTint}
      preserveLeadingAnchor={titleAlign === "center"}
    />
  );
}

export function NativeListSwitchItem({ switchProps, ...itemProps }: NativeListSwitchItemProps) {
  if (!useNativeListEnabled()) {
    return <FallbackSwitchItem switchProps={switchProps} {...itemProps} />;
  }

  if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
    return <FallbackSwitchItem switchProps={switchProps} {...itemProps} />;
  }

  const editMode = useNativeListEditMode();
  const theme = useTheme();
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    switchProps.defaultChecked ?? false,
  );
  const checked = switchProps.checked ?? uncontrolledChecked;
  const disabled = Boolean(itemProps.disabled || switchProps.disabled);
  const themeSwitchTint = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
  const switchTint =
    itemProps.btnTint === false
      ? null
      : typeof itemProps.btnTint === "string"
        ? (toSwiftUIHexColor(itemProps.btnTint) ?? itemProps.btnTint)
        : themeSwitchTint;

  const handleCheckedChange = (nextChecked: boolean) => {
    if (switchProps.checked == null) {
      setUncontrolledChecked(nextChecked);
    }
    switchProps.onCheckedChange?.(nextChecked);
  };

  return (
    <NativePressRow
      {...itemProps}
      nativeHaptics={itemProps.nativeHaptics ?? !editMode}
      disabled={disabled}
      onPress={() => {
        handleCheckedChange(!checked);
      }}
      trailingControl={
        <SwiftToggle
          isOn={checked}
          modifiers={[
            toggleStyle("switch"),
            ...(switchTint != null ? [tint(switchTint)] : []),
            disabledModifier(editMode || disabled),
          ]}
          onIsOnChange={handleCheckedChange}
        />
      }
      value={undefined}
    />
  );
}

export function NativeListSelectItem({ selectProps, ...itemProps }: NativeListSelectItemProps) {
  if (!useNativeListEnabled()) {
    return <FallbackSelectItem selectProps={selectProps} {...itemProps} />;
  }

  if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
    return <FallbackSelectItem selectProps={selectProps} {...itemProps} />;
  }

  const resolvedHaptics = useResolvedNativeHaptics(
    selectProps.nativeHaptics ?? itemProps.nativeHaptics ?? false,
  );
  const theme = useTheme();
  const nativeValueColor = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
  const resolvedPickerMode = (selectProps.nativePickerMode ?? "dropdown") as "dropdown" | "wheel";
  const resolvedItemGroups = resolveSelectItemGroups({
    itemGroups: selectProps.itemGroups,
    items: selectProps.items,
    options: selectProps.options,
  });
  const selectItems = resolvedItemGroups.flatMap((group) => group.items);
  const selectedValue = selectProps.value ?? selectProps.defaultValue;
  const selectedItem = selectItems.find((item) => item.value === selectedValue);
  const defaultTriggerLabel = selectedItem?.label ?? selectProps.placeholder ?? "";
  const nativeTriggerLabel =
    selectedValue == null || selectedValue === "" || selectProps.renderValue == null
      ? defaultTriggerLabel
      : selectProps.renderValue(selectedValue);
  const nativeTriggerText = toPlainText(nativeTriggerLabel);
  const usesStableNativeValue =
    nativeTriggerText != null &&
    selectProps.nativeTriggerContainerStyle == null &&
    selectProps.nativeTriggerContent == null &&
    selectProps.nativeTriggerLabelProps == null;
  const disabled = itemProps.disabled || selectProps.disabled || selectProps.isDisabled;
  const pickerRef = useRef<NativePickerSwiftUIHandle>(null);

  return (
    <NativePressRow
      {...itemProps}
      disabled={disabled}
      nativeHaptics={resolvedHaptics}
      onPress={() => {
        pickerRef.current?.open();
      }}
      btnStyle={resolvedPickerMode === "wheel" ? "plain" : undefined}
      trailingControl={
        <NativeHostedTrailingControl disableInEditMode>
          <NativePickerSwiftUI
            ref={pickerRef}
            items={selectItems}
            mode={resolvedPickerMode}
            nativeDropdownAlign={selectProps.nativeDropdownAlign ?? "end"}
            nativeDropdownAnchorWidth={selectProps.nativeDropdownAnchorWidth}
            nativeDropdownEdgeOffset={selectProps.nativeDropdownEdgeOffset}
            nativeTrigger
            nativeTriggerContainerStyle={[
              usesStableNativeValue ? styles.invisibleTrailingTrigger : styles.selectInlineTrigger,
              disabled ? styles.disabledContent : null,
              selectProps.nativeTriggerContainerStyle,
            ]}
            nativeTriggerContent={selectProps.nativeTriggerContent}
            nativeTriggerIcon={
              usesStableNativeValue ? "none" : (selectProps.nativeTriggerIcon ?? "chevrons-up-down")
            }
            nativeTriggerLabel={usesStableNativeValue ? "" : nativeTriggerLabel}
            nativeTriggerLabelProps={{
              color: itemProps.valueColor ?? "$color10",
              fontSize: itemProps.valueFontSize ?? "$4",
              numberOfLines: 1,
              opacity: 1,
              ...selectProps.nativeTriggerLabelProps,
            }}
            // wheel 行使用 SwiftUI plain Button；整行已经提供按压透明度，
            // 禁用内部 trigger 的反馈，避免行尾内容被重复降低透明度。
            nativeTriggerPressedOpacity={resolvedPickerMode === "wheel" ? false : undefined}
            onOpenChange={selectProps.onOpenChange}
            onValueChange={selectProps.onValueChange}
            placeholder={selectProps.placeholder}
            resolvedNativeHaptics={resolvedHaptics}
            value={selectedValue ?? null}
          />
        </NativeHostedTrailingControl>
      }
      value={usesStableNativeValue ? nativeTriggerText : undefined}
      valueColor={
        usesStableNativeValue ? (itemProps.valueColor ?? nativeValueColor) : itemProps.valueColor
      }
      valueSfSymbol={
        usesStableNativeValue && selectProps.nativeTriggerIcon !== "none"
          ? "chevron.up.chevron.down"
          : undefined
      }
      overlayTrailingControlOnValueSymbol={
        usesStableNativeValue && selectProps.nativeTriggerIcon !== "none"
      }
      preserveValueWidth={usesStableNativeValue}
    />
  );
}

/** 在 iOS 原生列表中保留原生行布局，并将 Menu trigger 托管到行尾。 */
export function NativeListMenuItem({ menuProps, ...itemProps }: NativeListMenuItemProps) {
  if (!useNativeListEnabled()) {
    return <FallbackMenuItem menuProps={menuProps} {...itemProps} />;
  }

  if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
    return <FallbackMenuItem menuProps={menuProps} {...itemProps} />;
  }

  const disabled = itemProps.disabled || menuProps.triggerProps?.disabled;
  const theme = useTheme();
  const nativeValueColor = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
  const menuRef = useRef<{ presentMenu: () => void } | null>(null);
  const menuValue = itemProps.value ?? "更多";
  const menuValueText = toPlainText(menuValue);
  const usesStableNativeValue = menuValueText != null;

  return (
    <NativePressRow
      {...itemProps}
      disabled={disabled}
      nativeHaptics={false}
      onPress={() => menuRef.current?.presentMenu()}
      trailingControl={
        <NativeHostedTrailingControl disableInEditMode>
          <Menu
            {...menuProps}
            nativeHaptics={menuProps.nativeHaptics ?? itemProps.nativeHaptics ?? false}
            nativeTrigger
            nativeTriggerContainerStyle={[
              usesStableNativeValue ? styles.invisibleTrailingTrigger : styles.selectInlineTrigger,
              disabled ? styles.disabledContent : null,
            ]}
            nativeTriggerIcon={usesStableNativeValue ? "none" : "chevrons-up-down"}
            nativeTriggerLabel={usesStableNativeValue ? "" : menuValue}
            nativeTriggerLabelProps={
              {
                color: itemProps.valueColor ?? "$color10",
                fontSize: itemProps.valueFontSize ?? "$4",
                numberOfLines: 1,
                opacity: 1,
              } as any
            }
            triggerProps={{
              ...menuProps.triggerProps,
              disabled,
            }}
            // `Menu` 在 iOS 使用 ContextMenuButton；通过该句柄由整行打开，不嵌套 SwiftUI 行。
            // @ts-expect-error Tamagui/Zeego 的原生菜单控制句柄。
            __menuRef={menuRef}
          />
        </NativeHostedTrailingControl>
      }
      value={usesStableNativeValue ? menuValueText : menuValue}
      valueColor={
        usesStableNativeValue ? (itemProps.valueColor ?? nativeValueColor) : itemProps.valueColor
      }
      valueSfSymbol={usesStableNativeValue ? "chevron.up.chevron.down" : undefined}
      overlayTrailingControlOnValueSymbol={usesStableNativeValue}
      preserveValueWidth={usesStableNativeValue}
    />
  );
}

export function NativeListCustomItem({
  backgroundColor,
  children,
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
}: NativeListCustomItemProps) {
  const restoresIos15TopCorners = useContext(Ios15FirstVisibleRowContext);
  const editRow = useNativeListEditRow({ disabled, nativeScrollId, onPress, selectionId });
  const rowPaddingProps = {
    paddingBottom,
    paddingHorizontal,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingVertical,
  };

  if (!useNativeListEnabled()) {
    return (
      <FallbackCustomItem
        backgroundColor={backgroundColor}
        disabled={disabled}
        hoverBackgroundColor={hoverBackgroundColor}
        nativeHaptics={nativeHaptics}
        nativeScrollId={nativeScrollId}
        onPress={onPress}
        {...rowPaddingProps}
        pressBackgroundColor={pressBackgroundColor}
        selectionId={selectionId}
      >
        {children}
      </FallbackCustomItem>
    );
  }

  if (editRow.editMode) {
    return (
      <NativeRowContainer
        {...rowPaddingProps}
        btnStyle="plain"
        disabled={disabled}
        editingSelected={editRow.editingSelected}
        nativeScrollId={nativeScrollId}
        onPress={editRow.onPress}
      >
        <NativeEditingIndicator selected={editRow.editingSelected} />
        <NativeHostedCustomRow disableInteractions>{children}</NativeHostedCustomRow>
      </NativeRowContainer>
    );
  }

  if (onPress == null) {
    return (
      <VStack
        modifiers={[
          ROW_INSETS,
          disabledModifier(disabled ?? false),
          padding(resolveRowPadding(rowPaddingProps)),
          ...(restoresIos15TopCorners
            ? [frame({ maxWidth: 99999, alignment: "leading" }), ios15ListRowTopRoundedBackground()]
            : []),
        ]}
      >
        <NativeHostedCustomRow>{children}</NativeHostedCustomRow>
      </VStack>
    );
  }

  const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);

  if (restoresIos15TopCorners) {
    return (
      <SwiftButton
        modifiers={[disabledModifier(disabled ?? false)]}
        onPress={() => {
          onPress();
          triggerNativeHaptics(resolvedHaptics);
        }}
      >
        <VStack
          modifiers={[
            ROW_INSETS,
            padding(resolveRowPadding(rowPaddingProps)),
            frame({ maxWidth: 99999, alignment: "leading" }),
            ios15ListRowTopRoundedBackground(12, {
              horizontal: 20,
              top: 8,
            }),
          ]}
        >
          <NativeHostedCustomRow>{children}</NativeHostedCustomRow>
        </VStack>
      </SwiftButton>
    );
  }

  return (
    <SwiftButton
      modifiers={[
        disabledModifier(disabled ?? false),
        ROW_INSETS,
        padding(resolveRowPadding(rowPaddingProps)),
      ]}
      onPress={() => {
        onPress();
        triggerNativeHaptics(resolvedHaptics);
      }}
    >
      <NativeHostedCustomRow>{children}</NativeHostedCustomRow>
    </SwiftButton>
  );
}

const styles = StyleSheet.create({
  customRowShell: {
    alignSelf: "stretch",
    maxWidth: "100%",
    minWidth: 0,
    width: "100%",
  },
  disabledContent: {
    opacity: 0.5,
  },
  hostedContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostedEditingIcon: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    flexShrink: 0,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  hostedIcon: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    fontSize: 17,
    height: 30,
    maxHeight: 30,
    minHeight: 0,
    paddingHorizontal: 16,
    paddingVertical: 0,
    width: "100%",
  },
  inputRow: {
    height: 30,
    width: "100%",
  },
  fullWidthInput: {
    paddingHorizontal: 0,
  },
  inputTrailing: {
    width: 160,
  },
  invisibleTrailingTrigger: {
    height: 1,
    maxHeight: 1,
    maxWidth: 1,
    minHeight: 1,
    minWidth: 1,
    opacity: 0,
    overflow: "hidden",
    width: 1,
  },
  nativeRoot: {
    flex: 1,
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
  trailingHostedContent: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  textArea: {
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
});

export { NativeListRoot as NativeList, NativeListSection };
