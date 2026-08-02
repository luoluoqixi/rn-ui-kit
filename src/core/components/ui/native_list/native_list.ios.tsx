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
  layoutPriority,
  lineLimit,
  listRowInsets,
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
  viewID,
} from "@expo/ui/swift-ui/modifiers";
import { type ReactNode, createContext, useContext, useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";

import { NativePickerSwiftUI } from "../select/native_picker";
import type { NativePickerSwiftUIHandle } from "../select/native_picker";
import { resolveSelectItemGroups } from "../select/select_grouping";
import { getTrueSheetScrollBottomPadding } from "../sheet/native_sheet/true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { Switch } from "../switch";
import { isIos26Plus } from "../utils/platform";
import { toSwiftUIHexColor, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import {
  NativeListActionItem as FallbackActionItem,
  NativeListCustomItem as FallbackCustomItem,
  NativeListInputItem as FallbackInputItem,
  NativeListItem as FallbackItem,
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

const ROW_INSETS = listRowInsets({ top: 0, leading: 0, bottom: 0, trailing: 0 });
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

  return configuredHeight ?? Math.max(100, numberOfLines * TEXT_AREA_LINE_HEIGHT + TEXT_AREA_VERTICAL_PADDING);
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

function NativeRowLabel({
  subtitle,
  subtitleColor,
  subtitleFontSize,
  title,
  titleAlign,
  expand = false,
  titleColor,
  titleFontSize,
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
            lineLimit(subtitleText != null ? 2 : 1),
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
        modifiers={[layoutPriority(1), ...(expand ? [frame({ maxWidth: 99999 })] : [])]}
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
                lineLimit(subtitleText != null ? 2 : 1),
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

  return <VStack modifiers={[layoutPriority(1)]}>{labelContent}</VStack>;
}

function NativeRowContainer({
  children,
  disabled,
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
}: {
  children: ReactNode;
  disabled?: boolean;
  nativeScrollId?: string | number;
  onPress?: () => void;
  btnStyle?: SwiftUIButtonStyle;
  btnTint?: boolean | string;
} & NativeListItemPaddingProps) {
  const theme = useTheme();
  const primaryColor = toSwiftUIHexColor(theme.color.val) ?? theme.color.val;
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
  ];

  if (onPress != null) {
    return (
      <SwiftButton
        modifiers={[
          disabledModifier(disabled ?? false),
          buttonStyle(btnStyle ?? "automatic"),
          ...(nativeScrollId != null ? [viewID(nativeScrollId)] : []),
        ]}
        onPress={onPress}
      >
        <HStack
          alignment="center"
          modifiers={[
            ...baseModifiers,
            ...(btnStyle === "plain"
              ? [frame({ maxWidth: 99999, alignment: "leading" }), contentShape(shapes.rectangle())]
              : []),
            ...(resolvedTint != null ? [tint(resolvedTint)] : []),
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
      alignment="center"
      modifiers={[
        ...baseModifiers,
        disabledModifier(disabled ?? false),
        ...(nativeScrollId != null ? [viewID(nativeScrollId)] : []),
      ]}
      spacing={12}
    >
      {children}
    </HStack>
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

function NativeHostedContent({ children }: { children: ReactNode }) {
  return (
    <RNHostView matchContents>
      <View collapsable={false} style={styles.hostedContent}>
        {children}
      </View>
    </RNHostView>
  );
}

function NativeHostedTrailingControl({ children }: { children: ReactNode }) {
  return (
    <RNHostView matchContents>
      <View collapsable={false} style={styles.trailingHostedContent}>
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

function NativeHostedCustomRow({ children }: { children: ReactNode }) {
  return (
    <RNHostView matchContents={{ vertical: true } as unknown as boolean}>
      <View collapsable={false} style={styles.customRowShell}>
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
  subtitle,
  subtitleColor,
  subtitleFontSize,
  trailing,
  title,
  titleAlign,
  titleColor,
  titleFontSize,
  trailingControl,
  value,
  valueColor,
  valueFontSize,
  btnStyle,
  btnTint,
  preserveLeadingAnchor = false,
}: NativeListItemBaseProps & {
  trailingControl?: ReactNode;
  btnStyle?: SwiftUIButtonStyle;
  preserveLeadingAnchor?: boolean;
}) {
  const theme = useTheme();
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
    valueText != null || selected || trailing != null || trailingControl != null || chevron;
  const showTrailingSpacer = hasTrailingContent && (titleText != null || subtitleText != null);

  const handlePress = onPress
    ? () => {
        onPress();
        triggerNativeHaptics(resolvedHaptics);
      }
    : undefined;

  return (
    <NativeRowContainer
      disabled={disabled}
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
    >
      {sfSymbol != null ? (
        <ZStack
          alignment="center"
          modifiers={[frame({ width: resolvedIconSlotWidth, alignment: "center" })]}
        >
          <Image color={resolvedIconColor} size={resolvedIconSize} systemName={sfSymbol} />
        </ZStack>
      ) : icon != null ? (
        <NativeHostedIcon>{icon}</NativeHostedIcon>
      ) : null}
      <NativeRowLabel
        subtitle={subtitleText ?? undefined}
        subtitleColor={subtitleColor}
        subtitleFontSize={subtitleFontSize}
        title={titleText ?? undefined}
        titleAlign={titleAlign}
        expand={titleAlign != null}
        titleColor={titleColor ?? btnTint}
        titleFontSize={titleFontSize}
        preserveLeadingAnchor={preserveLeadingAnchor}
      />
      {showTrailingSpacer ? <Spacer minLength={12} /> : null}
      {valueText != null ? (
        <SwiftText
          modifiers={[...valueModifiers(valueFontSize), foregroundStyle(resolvedValueColor)]}
        >
          {valueText}
        </SwiftText>
      ) : null}
      {selected ? <Image color={accentColor} size={18} systemName="checkmark" /> : null}
      {trailing != null ? <NativeTrailingContent>{trailing}</NativeTrailingContent> : null}
      {trailingControl}
      {chevron ? <Image color={resolvedChevronColor} size={13} systemName="chevron.right" /> : null}
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
  fixesIOS26NestedScrollIndicatorSafeArea,
  initialScrollTarget,
  native = true,
  nestedScrollEnabled,
  navigationBarScrollEdgeOptions,
  onRefresh,
  scrollIndicatorInsets,
  style,
  scrollable = true,
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
          nestedScrollEnabled={nestedScrollEnabled}
          navigationBarScrollEdgeOptions={navigationBarScrollEdgeOptions}
          onRefresh={onRefresh}
          scrollIndicatorInsets={scrollIndicatorInsets}
          style={style}
          scrollable={scrollable}
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
  const header =
    trailing != null ? (
      <HStack
        alignment="center"
        modifiers={[frame({ maxWidth: 99999, alignment: "leading" })]}
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
        <Spacer minLength={0} />
        <NativeTrailingContent>{trailing}</NativeTrailingContent>
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
  const theme = useTheme();
  const disabled = itemProps.disabled || inputProps.disabled;
  const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
  const {
    autoFocusNative,
    disabled: _inputDisabled,
    style: inputStyle,
    unstyled: _unstyled,
    ...nativeInputProps
  } = inputProps;
  const resolvedInput = (
    <TextInput
      {...(nativeInputProps as any)}
      autoFocus={autoFocusNative ?? inputProps.autoFocus ?? false}
      clearButtonMode={inputProps.clearButtonMode ?? "while-editing"}
      editable={!disabled}
      multiline={inputProps.multiline ?? false}
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
    unstyled: _unstyled,
    ...nativeTextAreaProps
  } = textAreaProps;

  return (
    <NativeListCustomItem {...itemProps} disabled={disabled}>
      <View collapsable={false} style={[styles.textAreaRow, { height: textAreaHeight }]}>
        <TextInput
          {...(nativeTextAreaProps as any)}
          editable={!disabled}
          multiline
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

  const checked = switchProps.checked ?? switchProps.defaultChecked ?? false;

  return (
    <NativePressRow
      {...itemProps}
      nativeHaptics={itemProps.nativeHaptics ?? true}
      disabled={itemProps.disabled || switchProps.disabled}
      onPress={() => {
        switchProps.onCheckedChange?.(!checked);
      }}
      trailingControl={
        <NativeHostedTrailingControl>
          <Switch {...switchProps} native />
        </NativeHostedTrailingControl>
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
  const resolvedPickerMode = (selectProps.nativePickerMode ?? "dropdown") as "dropdown" | "wheel";
  const resolvedItemGroups = resolveSelectItemGroups({
    itemGroups: selectProps.itemGroups,
    items: selectProps.items,
    options: selectProps.options,
  });
  const selectItems = resolvedItemGroups.flatMap((group) => group.items);
  const selectedValue = selectProps.value ?? selectProps.defaultValue;
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
        <NativeHostedTrailingControl>
          <NativePickerSwiftUI
            ref={pickerRef}
            items={selectItems}
            mode={resolvedPickerMode}
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
            nativeTriggerLabelProps={{
              color: itemProps.valueColor ?? "$color10",
              fontSize: itemProps.valueFontSize ?? "$4",
              numberOfLines: 1,
              opacity: 1,
              ...selectProps.nativeTriggerLabelProps,
            }}
            onOpenChange={selectProps.onOpenChange}
            onValueChange={selectProps.onValueChange}
            placeholder={selectProps.placeholder}
            resolvedNativeHaptics={resolvedHaptics}
            value={selectedValue ?? null}
          />
        </NativeHostedTrailingControl>
      }
      value={undefined}
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
        onPress={onPress}
        {...rowPaddingProps}
        pressBackgroundColor={pressBackgroundColor}
      >
        {children}
      </FallbackCustomItem>
    );
  }

  if (onPress == null) {
    return (
      <VStack
        modifiers={[
          ROW_INSETS,
          disabledModifier(disabled ?? false),
          padding(resolveRowPadding(rowPaddingProps)),
        ]}
      >
        <NativeHostedCustomRow>{children}</NativeHostedCustomRow>
      </VStack>
    );
  }

  const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);

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
