import {
  ContextMenu as SwiftContextMenu,
  Divider as SwiftDivider,
  HStack,
  Host,
  Image,
  Label as SwiftLabel,
  List,
  Menu as SwiftMenu,
  RNHostView,
  Spacer,
  Button as SwiftButton,
  Text as SwiftText,
  Section as SwiftUISection,
  VStack,
  ZStack,
} from "@luoluoqixi/expo-ui-55/swift-ui";
import {
  background,
  buttonStyle,
  contentMargins,
  contentShape,
  createModifier,
  disabled as disabledModifier,
  font,
  foregroundStyle,
  frame,
  ios15ListRowTopRoundedBackground,
  ios15ListRowSeparatorHidden,
  layoutPriority,
  lineLimit,
  listRowBackground,
  listRowInsets,
  listSectionSpacing,
  listStyle,
  multilineTextAlignment,
  opacity,
  padding,
  scrollContentBackground,
  scrollDisabled,
  shapes,
  tag,
  tint,
  viewID,
} from "@luoluoqixi/expo-ui-55/swift-ui/modifiers";
import {
  Children,
  Fragment,
  type ReactElement,
  type ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SFSymbol } from "sf-symbols-typescript";
import { useComponentThemeTokens as useTheme } from "../utils/theme";

import type { ResolvedSelectItemData } from "../select/select_grouping";
import { Text } from "../text";
import type { ContextMenuItemData } from "../context_menu";
import { getTrueSheetScrollBottomPadding } from "../sheet/native_sheet/true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { isIos15, isIos26Plus } from "../utils/platform";
import { resolveRenderProp } from "../utils/render";
import { toSwiftUIHexColor, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import {
  NativeListContextMenuProvider,
  useResolvedNativeListDisabledStyle,
  useResolvedNativeListContextMenu,
} from "./context_menu";
import { NativeListHapticsProvider, useResolvedNativeListHaptics } from "./haptics";
import { NATIVE_LIST_DISABLED_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_OPACITY } from "./constants";
import {
  NativeListEditModeProvider,
  useNativeListEditContext,
  useNativeListEditMode,
  useNativeListEditRow,
} from "./edit_mode";
import { useResolvedNativeListDisabled } from "./disabled";
import type {
  NativeListContextMenuProps,
  NativeListItemBaseProps,
  NativeListItemPaddingProps,
  NativeListRootProps,
  NativeListSectionProps,
  NativeListSectionRenderContext,
  NativeListSelectionId,
  NativeListSelectItemProps,
  NativeListTextAreaItemProps,
} from "./types";

// Construct locally so rn-ui-kit remains runtime-compatible with expo-ui-55
// JavaScript builds from before the convenience export was added.
const nativeAllowsHitTesting = (enabled: boolean) =>
  createModifier("allowsHitTesting", { enabled });

function getNativeContextMenuLabel(item: ContextMenuItemData) {
  if (typeof item.label === "string" || typeof item.label === "number") {
    return String(item.label);
  }

  return item.textValue ?? item.value;
}

export function getSelectLabel(item: ResolvedSelectItemData, selectedValue?: string): string {
  const rendered = resolveRenderProp(item.label, {
    checked: item.value === selectedValue,
    disabled: Boolean(item.disabled ?? item.isDisabled),
    selected: item.value === selectedValue,
    value: item.value,
  });
  return typeof rendered === "string" || typeof rendered === "number"
    ? String(rendered)
    : item.value;
}

export function renderNativeListSelectTriggerLabel(
  label: ReactNode,
  swatchColor: string | undefined,
  labelProps?: NativeListSelectItemProps["selectProps"]["nativeTriggerLabelProps"],
) {
  const {
    color: configuredColor,
    opacity: configuredOpacity,
    fontWeight: configuredFontWeight,
    style: configuredStyle,
    ...textProps
  } = (labelProps ?? {}) as any;
  const resolvedTextStyle = [
    { color: configuredColor, fontWeight: configuredFontWeight },
    configuredStyle,
  ];
  const content =
    swatchColor == null ? (
      typeof label === "string" || typeof label === "number" ? (
        <Text {...textProps} style={resolvedTextStyle}>
          {label}
        </Text>
      ) : (
        label
      )
    ) : (
      <View style={styles.selectInlineLabel}>
        <View style={[styles.selectSwatch, { backgroundColor: swatchColor }]} />
        {typeof label === "string" || typeof label === "number" ? (
          <Text {...textProps} style={resolvedTextStyle}>
            {label}
          </Text>
        ) : (
          label
        )}
      </View>
    );

  return (
    <View style={{ opacity: configuredOpacity ?? NATIVE_LIST_TRAILING_TRIGGER_OPACITY }}>
      {content}
    </View>
  );
}

function hasSwiftUIContextMenu(contextMenuProps?: NativeListContextMenuProps) {
  return (contextMenuProps?.items?.length ?? 0) > 0;
}

function NativeSwiftUIContextMenuButton({
  disabled,
  item,
  label,
  onPress,
}: {
  disabled: boolean;
  item: ContextMenuItemData;
  label: string;
  onPress?: () => void;
}) {
  const destructive = item.destructive ?? false;

  if (item.subtitle != null) {
    return (
      <SwiftButton
        modifiers={[disabledModifier(disabled)]}
        onPress={onPress}
        role={destructive ? "destructive" : "default"}
      >
        {item.selected ? (
          <SwiftLabel systemImage="checkmark" title={label} />
        ) : (
          <SwiftText>{label}</SwiftText>
        )}
        <SwiftText>{item.subtitle}</SwiftText>
      </SwiftButton>
    );
  }

  return (
    <SwiftButton
      label={label}
      modifiers={[disabledModifier(disabled)]}
      onPress={onPress}
      role={destructive ? "destructive" : "default"}
      systemImage={item.selected ? "checkmark" : undefined}
    />
  );
}

function NativeSwiftUIContextMenuItems({
  itemProps,
  items,
}: {
  itemProps?: NativeListContextMenuProps["itemProps"];
  items: ContextMenuItemData[];
}) {
  return items.map((item) => {
    if (item.separator) {
      return <SwiftDivider key={item.value} />;
    }

    const label = getNativeContextMenuLabel(item);
    const disabled = item.disabled ?? itemProps?.disabled ?? false;
    const resolvedItem = {
      ...item,
      destructive: item.destructive ?? itemProps?.destructive ?? false,
    };

    if (item.subMenu?.length) {
      return (
        <SwiftMenu
          key={item.value}
          label={label}
          modifiers={[disabledModifier(disabled)]}
          systemImage={item.selected ? "checkmark" : undefined}
        >
          <NativeSwiftUIContextMenuItems itemProps={itemProps} items={item.subMenu} />
        </SwiftMenu>
      );
    }

    return (
      <NativeSwiftUIContextMenuButton
        disabled={disabled}
        item={resolvedItem}
        key={item.value}
        label={label}
        onPress={() => {
          const handler = item.onSelect ?? item.onPress;
          (handler as (() => void) | undefined)?.();
        }}
      />
    );
  });
}

export function NativeSwiftUIContextMenu({
  children,
  contextMenuProps,
  disabled = false,
}: {
  children: ReactElement;
  contextMenuProps: NativeListContextMenuProps;
  /** Keep the SwiftUI menu tree mounted while the native menu builder is disabled. */
  disabled?: boolean;
}) {
  return (
    <SwiftContextMenu enabled={!disabled}>
      <SwiftContextMenu.Trigger>{children}</SwiftContextMenu.Trigger>
      <SwiftContextMenu.Items>
        <NativeSwiftUIContextMenuItems
          itemProps={contextMenuProps.itemProps}
          items={contextMenuProps.items ?? []}
        />
      </SwiftContextMenu.Items>
    </SwiftContextMenu>
  );
}

type SwiftUIButtonStyle =
  | "automatic"
  | "bordered"
  | "borderedProminent"
  | "borderless"
  | "glass"
  | "glassProminent"
  | "noPressEffect"
  | "plain";

export const Ios15FirstVisibleRowContext = createContext(false);

export const ROW_INSETS = listRowInsets({
  top: 0,
  leading: 0,
  bottom: 0,
  trailing: 0,
});
const IOS15_SECTION_HEADER_ROW_INSETS = listRowInsets({
  top: 0,
  leading: 20,
  bottom: 0,
  trailing: 20,
});
const IOS15_SECTION_HEADER_ROW_BACKGROUND = listRowBackground("clear");
const IOS15_SECTION_HEADER_ROW_SEPARATOR = ios15ListRowSeparatorHidden();
const ROW_PADDING = { top: 0, bottom: 0, leading: 0, trailing: 0 } as const;
const DEFAULT_TITLE_FONT_SIZE = 17;
const DEFAULT_SUBTITLE_FONT_SIZE = 13;
const DEFAULT_VALUE_FONT_SIZE = 17;
const DEFAULT_SECTION_TITLE_FONT_SIZE = 13;
export const DEFAULT_TEXT_AREA_LINES = 4;
const TEXT_AREA_LINE_HEIGHT = 24;
const TEXT_AREA_VERTICAL_PADDING = 20;
// iOS 15 indents native multi-select content farther than the grouped cell
// background. Extend only the helper-row corner overlay back to the cell edge.
const IOS15_NATIVE_EDIT_ROW_LEADING_INSET = 64;
const IOS15_NATIVE_EDIT_ROW_TRAILING_INSET = 20;
const IOS15_FIRST_ROW_TOP_INSET = 6;
// iOS 15 vertically centers compact rows differently from rows with a subtitle.
// Keep these independent so their corner coverage can be tuned on-device.
const IOS15_PLAIN_TEXT_NO_SUBTITLE_FIRST_ROW_TOP_INSET = 12;
const IOS15_NAVIGATION_NO_SUBTITLE_FIRST_ROW_TOP_INSET = 12;

/**
 * `contentMargins` was introduced in iOS 17. Keep the same scrollable bottom
 * space on iOS 15 by contributing a transparent, fixed-height list row.
 */
function NativeListIos15BottomSpacer({ length }: { length: number }) {
  if (length <= 0) {
    return null;
  }

  return (
    <VStack
      modifiers={[
        ROW_INSETS,
        frame({ height: length, maxWidth: 99999 }),
        listRowBackground("clear"),
        ios15ListRowSeparatorHidden(),
      ]}
    >
      <SwiftText>{""}</SwiftText>
    </VStack>
  );
}

export function resolveRowPadding({
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

export function resolveTextAreaHeight(textAreaProps: NativeListTextAreaItemProps["textAreaProps"]) {
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

export function resolveEditingInputDisplay(
  value: unknown,
  defaultValue: unknown,
  placeholder: unknown,
) {
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

export function toPlainText(value: ReactNode): string | null {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return null;
}

export function supportsNativeTextRow(...values: Array<ReactNode | undefined>) {
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

export function NativeRowLabel({
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
  opacityValue = 1,
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
  opacityValue?: number;
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
        ...(opacityValue !== 1 ? [opacity(opacityValue)] : []),
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

export function NativeRowContainer({
  children,
  contextMenuProps,
  contextMenuDisabled,
  disabled,
  disabledStyle,
  ios15FirstRowTopInset = IOS15_FIRST_ROW_TOP_INSET,
  nativeSelectionActive,
  nativeSelectionId,
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
  contextMenuProps?: NativeListContextMenuProps;
  /** Keeps a ContextMenu wrapper stable while iOS 15 disables its interaction. */
  contextMenuDisabled?: boolean;
  disabled?: boolean;
  disabledStyle?: boolean;
  /** Extra top coverage only for a first visible row's iOS 15 corner overlay. */
  ios15FirstRowTopInset?: number;
  /** Whether the row is participating in the currently active native selection UI. */
  nativeSelectionActive?: boolean;
  nativeSelectionId?: NativeListSelectionId;
  nativeScrollId?: string | number;
  onPress?: () => void;
  btnStyle?: SwiftUIButtonStyle;
  btnTint?: boolean | string;
  rowAlignment?: "center" | "top";
  rowMinHeight?: number;
} & NativeListItemPaddingProps) {
  const theme = useTheme();
  const restoresIos15TopCorners = useContext(Ios15FirstVisibleRowContext);
  const usesNativeSelectionStyle = nativeSelectionActive ?? nativeSelectionId != null;
  const primaryColor = toSwiftUIHexColor(theme.color.val) ?? theme.color.val;
  const resolvedTint = resolveNativeListBtnTintColor(btnTint, primaryColor);
  const resolvedDisabledStyle = useResolvedNativeListDisabledStyle(disabledStyle);
  const swiftUIContextMenuProps =
    (!disabled || contextMenuDisabled) && hasSwiftUIContextMenu(contextMenuProps)
      ? contextMenuProps
      : undefined;
  const baseModifiers = [
    ROW_INSETS,
    ...(disabled && resolvedDisabledStyle ? [opacity(NATIVE_LIST_DISABLED_OPACITY)] : []),
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
  const buttonContent = (
    <HStack
      alignment={rowAlignment}
      modifiers={[
        ...baseModifiers,
        ...(btnStyle === "plain" || restoresIos15TopCorners || contextMenuProps != null
          ? [frame({ maxWidth: 99999, alignment: "leading" })]
          : []),
        ...(btnStyle === "plain" || contextMenuProps != null
          ? [contentShape(shapes.rectangle())]
          : []),
        ...(resolvedTint != null ? [tint(resolvedTint)] : []),
        ...(restoresIos15TopCorners
          ? [
              usesNativeSelectionStyle
                ? ios15ListRowTopRoundedBackground(12, {
                    leading: IOS15_NATIVE_EDIT_ROW_LEADING_INSET,
                    trailing: IOS15_NATIVE_EDIT_ROW_TRAILING_INSET,
                    top: ios15FirstRowTopInset,
                  })
                : ios15ListRowTopRoundedBackground(12, {
                    horizontal: 20,
                    top: ios15FirstRowTopInset,
                  }),
            ]
          : []),
      ]}
      spacing={12}
    >
      {children}
    </HStack>
  );

  if (onPress != null) {
    const button = (
      <SwiftButton
        modifiers={[
          disabledModifier(disabled ?? false),
          // Keep the Button node stable on iOS 15, but let the native List own
          // edit-mode row touches so selection begins with the system control.
          ...(isIos15()
            ? [nativeAllowsHitTesting(!nativeSelectionActive || disabled === true)]
            : []),
          buttonStyle(btnStyle ?? "automatic"),
          ...(nativeScrollId != null ? [viewID(nativeScrollId)] : []),
          ...(nativeSelectionId != null ? [tag(nativeSelectionId)] : []),
        ]}
        onPress={onPress}
      >
        {buttonContent}
      </SwiftButton>
    );

    return swiftUIContextMenuProps != null ? (
      <NativeSwiftUIContextMenu
        contextMenuProps={swiftUIContextMenuProps}
        disabled={contextMenuDisabled}
      >
        {button}
      </NativeSwiftUIContextMenu>
    ) : (
      button
    );
  }

  const rowModifiers = [
    ...baseModifiers,
    disabledModifier(disabled ?? false),
    ...(nativeScrollId != null ? [viewID(nativeScrollId)] : []),
    ...(nativeSelectionId != null ? [tag(nativeSelectionId)] : []),
    ...(restoresIos15TopCorners || contextMenuProps != null
      ? [frame({ maxWidth: 99999, alignment: "leading" }), contentShape(shapes.rectangle())]
      : []),
    ...(restoresIos15TopCorners
      ? [
          usesNativeSelectionStyle
            ? ios15ListRowTopRoundedBackground(12, {
                leading: IOS15_NATIVE_EDIT_ROW_LEADING_INSET,
                trailing: IOS15_NATIVE_EDIT_ROW_TRAILING_INSET,
                top: ios15FirstRowTopInset,
              })
            : ios15ListRowTopRoundedBackground(12, {
                horizontal: 20,
                top: ios15FirstRowTopInset,
              }),
        ]
      : []),
  ];

  if (swiftUIContextMenuProps != null) {
    return (
      <NativeSwiftUIContextMenu
        contextMenuProps={swiftUIContextMenuProps}
        disabled={contextMenuDisabled}
      >
        <HStack alignment={rowAlignment} modifiers={rowModifiers} spacing={12}>
          {children}
        </HStack>
      </NativeSwiftUIContextMenu>
    );
  }

  return (
    <HStack alignment={rowAlignment} modifiers={rowModifiers} spacing={12}>
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

export function NativeHostedTrailingControl({
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
        style={[styles.trailingHostedContent, interactionsDisabled ? styles.disabledContent : null]}
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

export function NativeHostedCustomRow({
  children,
  disabled = false,
  disableInteractions = false,
}: {
  children: ReactNode;
  disabled?: boolean;
  disableInteractions?: boolean;
}) {
  return (
    <RNHostView matchContents={{ vertical: true } as unknown as boolean}>
      <View
        collapsable={false}
        pointerEvents={disableInteractions || disabled ? "none" : "auto"}
        style={[styles.customRowShell, disabled ? styles.disabledContent : null]}
      >
        {children}
      </View>
    </RNHostView>
  );
}

export function NativePressRow({
  chevron = false,
  chevronColor,
  contextMenuProps,
  disabled,
  disabledStyle,
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
  selectionDisabled,
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
  labelOpacity = 1,
  value,
  valueColor,
  valueFontSize,
  valueSfSymbol,
  btnStyle,
  btnTint,
  preserveLeadingAnchor = false,
  rowAlignment = "center",
  rowMinHeight,
  ios15RowType = "text",
}: NativeListItemBaseProps & {
  trailingControl?: ReactNode;
  overlayTrailingControlOnValueSymbol?: boolean;
  preserveValueWidth?: boolean;
  labelOpacity?: number;
  btnStyle?: SwiftUIButtonStyle;
  preserveLeadingAnchor?: boolean;
  rowAlignment?: "center" | "top";
  rowMinHeight?: number;
  titleLineLimit?: number;
  valueSfSymbol?: SFSymbol;
  ios15RowType?: "navigation" | "text";
}) {
  const theme = useTheme();
  const inheritedNativeHaptics = useResolvedNativeListHaptics(nativeHaptics);
  const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
  const editRow = useNativeListEditRow({
    disabled,
    nativeScrollId,
    nativeSelection: true,
    onPress,
    selectionId,
    selectionDisabled,
  });
  const resolvedHaptics = useResolvedNativeHaptics(inheritedNativeHaptics);
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
    (isIos15() && selected) ||
    (!editRow.editMode && selected) ||
    trailing != null ||
    trailingControl != null ||
    (!editRow.editMode && chevron);
  const showTrailingSpacer = hasTrailingContent && (titleText != null || subtitleText != null);
  const isBarePlainTextRow =
    subtitleText == null &&
    !chevron &&
    icon == null &&
    sfSymbol == null &&
    !selected &&
    trailing == null &&
    trailingControl == null &&
    valueText == null &&
    valueSfSymbol == null;
  const ios15FirstRowTopInset =
    subtitleText != null
      ? IOS15_FIRST_ROW_TOP_INSET
      : ios15RowType === "navigation"
        ? IOS15_NAVIGATION_NO_SUBTITLE_FIRST_ROW_TOP_INSET
        : isBarePlainTextRow
          ? IOS15_PLAIN_TEXT_NO_SUBTITLE_FIRST_ROW_TOP_INSET
          : IOS15_FIRST_ROW_TOP_INSET;

  const handlePress = editRow.onPress
    ? () => {
        editRow.onPress?.();
        if (editRow.editMode || onPress != null) {
          triggerNativeHaptics(resolvedHaptics);
        }
      }
    : undefined;
  // iOS 15 exposes a UITableView-backed SwiftUI List. Keep selection metadata
  // present across edit-mode and disabled transitions so rows are not structurally replaced.
  const nativeSelectionId =
    isIos15() && !selectionDisabled
      ? editRow.selectionId
      : editRow.nativeSelection
        ? editRow.selectionId
        : undefined;
  const contextMenuUnavailable = Boolean(
    disabled || editRow.editMode || resolvedContextMenuProps?.triggerProps?.disabled,
  );
  // Keep the ContextMenu / Trigger wrapper in place on iOS 15 while editing or
  // disabled. Only its native interaction changes, preserving the List row tree.
  const preservesIos15ContextMenu = isIos15() && resolvedContextMenuProps != null;
  // iOS 15 keeps an otherwise passive row inside a Button so entering edit mode
  // does not replace HStack with Button. This style keeps the Button behavior and
  // tree without applying pressed-state visuals to its label.
  const resolvedBtnStyle =
    isIos15() && onPress == null ? (btnStyle ?? "noPressEffect") : btnStyle;

  return (
    <NativeRowContainer
      contextMenuProps={
        preservesIos15ContextMenu || !contextMenuUnavailable
          ? resolvedContextMenuProps
          : undefined
      }
      contextMenuDisabled={preservesIos15ContextMenu && contextMenuUnavailable}
      disabled={disabled}
      disabledStyle={disabledStyle}
      ios15FirstRowTopInset={ios15FirstRowTopInset}
      nativeSelectionActive={editRow.nativeSelection}
      nativeSelectionId={nativeSelectionId}
      onPress={handlePress}
      btnStyle={resolvedBtnStyle}
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
        opacityValue={labelOpacity}
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
      {selected && (!editRow.editMode || isIos15()) ? (
        <Image
          key="selected-checkmark"
          color={accentColor}
          modifiers={isIos15() ? [opacity(editRow.editMode ? 0 : 1)] : undefined}
          size={18}
          systemName="checkmark"
        />
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
  contextMenuProps,
  disabledStyle,
  contentInsetAdjustmentBehavior,
  contentMarginBottom,
  contentMarginTop,
  defaultSelectedIds,
  dismissKeyboardOnTap = false,
  editMode,
  editModeIcon,
  editModeSelectedIcon,
  editModeSelectedSfSymbol,
  editModeSfSymbol,
  fixesIOS26NestedScrollIndicatorSafeArea,
  initialScrollTarget,
  iosListStyle = "insetGrouped",
  nestedScrollEnabled,
  navigationBarScrollEdgeOptions,
  onRefresh,
  onSelectedIdsChange,
  nativeHaptics,
  iosPressFeedback = "immediate",
  refreshColor: _refreshColor,
  refreshEnabledInEditMode = false,
  scrollIndicatorInsets,
  style,
  scrollable = true,
  selectedIds,
  tracksNavigationBarScrollEdge,
  webAutoRestoreScroll: _webAutoRestoreScroll,
}: NativeListRootProps) {
  void _refreshColor;
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const nativeEditTint = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
  const [nativeRefreshing, setNativeRefreshing] = useState(false);
  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState<NativeListSelectionId[]>(
    () => [...(defaultSelectedIds ?? [])],
  );
  const resolvedSelectedIds = selectedIds ?? uncontrolledSelectedIds;
  const handleSelectedIdsChange = (nextSelectedIds: NativeListSelectionId[]) => {
    if (selectedIds == null) {
      setUncontrolledSelectedIds(nextSelectedIds);
    }
    onSelectedIdsChange?.([...nextSelectedIds]);
  };
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
  const usesNativeEditMode = editMode === true;
  const usesImmediatePressFeedback = iosPressFeedback === "immediate";

  const bottomPadding =
    insideTrueSheet && scrollable && !isNestedNativeList
      ? getTrueSheetScrollBottomPadding({
          insetAdjustment,
          nativeScrollInsetsApplied,
          safeAreaBottom: insets.bottom,
        })
      : 0;
  const ios15BottomSpacerLength = isIos15()
    ? insideTrueSheet
      ? bottomPadding + (contentMarginBottom ?? 0)
      : (contentMarginBottom ?? 0)
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
  const refreshControlEnabled =
    onRefresh != null && (!usesNativeEditMode || refreshEnabledInEditMode);
  const handleNativeRefresh = async () => {
    if (!refreshControlEnabled || onRefresh == null) return;

    setNativeRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setNativeRefreshing(false);
    }
  };
  return (
    <NativeListEditModeProvider
      defaultSelectedIds={defaultSelectedIds}
      editMode={editMode}
      nativeSelectionEnabled
      onSelectedIdsChange={handleSelectedIdsChange}
      selectedIds={resolvedSelectedIds}
    >
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
          delaysContentTouches={!usesImmediatePressFeedback}
          dismissKeyboardOnTap={dismissKeyboardOnTap}
          initialScrollAnchor="center"
          initialScrollTarget={initialScrollTarget}
          nativeEditMode={usesNativeEditMode ? "active" : "inactive"}
          nativeEditTint={nativeEditTint}
          onSelectionChange={usesNativeEditMode ? handleSelectedIdsChange : undefined}
          selection={usesNativeEditMode ? [...resolvedSelectedIds] : undefined}
          onRefresh={handleNativeRefresh}
          // 禁用时从 UIScrollView 解绑原生刷新控件；控件实例本身保持稳定，
          // 不会像动态增删 SwiftUI modifier 一样重建 List。
          refreshable={refreshControlEnabled}
          refreshEnabled={refreshControlEnabled}
          refreshing={refreshControlEnabled && nativeRefreshing}
          modifiers={[
            listStyle(iosListStyle),
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
            scrollDisabled(!scrollable),
          ]}
        >
          <NativeListContextMenuProvider
            contextMenuProps={contextMenuProps}
            disabledStyle={disabledStyle}
          >
            <NativeListHapticsProvider nativeHaptics={nativeHaptics}>
              {children}
            </NativeListHapticsProvider>
          </NativeListContextMenuProvider>
          <NativeListIos15BottomSpacer length={ios15BottomSpacerLength} />
        </List>
      </Host>
    </NativeListEditModeProvider>
  );
}

function NativeListSection({
  children,
  contextMenuProps,
  disabledStyle,
  nativeHaptics,
  footer,
  trailing,
  title,
  titleColor,
  titleFontSize,
}: NativeListSectionProps) {
  const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
  const resolvedDisabled = useResolvedNativeListDisabled();
  const resolvedDisabledStyle = useResolvedNativeListDisabledStyle(disabledStyle);
  const editMode = useNativeListEditMode();
  const editContext = useNativeListEditContext();
  const resolvedNativeHaptics = useResolvedNativeListHaptics(nativeHaptics);
  const renderContext: NativeListSectionRenderContext = {
    contextMenuProps: resolvedContextMenuProps,
    disabled: resolvedDisabled,
    disabledStyle: resolvedDisabledStyle,
    editMode,
    isSelected: editContext.isSelected,
    nativeHaptics: resolvedNativeHaptics,
    nativeSelectionEnabled: editContext.nativeSelectionEnabled,
    toggleSelection: editContext.toggleSelection,
  };
  const resolvedFooter = resolveRenderProp(footer, renderContext);
  const resolvedTitle = resolveRenderProp(title, renderContext);
  const resolvedTrailing = resolveRenderProp(trailing, renderContext);

  const stringTitle = toPlainText(resolvedTitle);
  const sectionChildren = Children.map(children, (child) =>
    child != null ? (
      <NativeListContextMenuProvider
        contextMenuProps={resolvedContextMenuProps}
        disabledStyle={resolvedDisabledStyle}
      >
        <NativeListHapticsProvider nativeHaptics={nativeHaptics}>{child}</NativeListHapticsProvider>
      </NativeListContextMenuProvider>
    ) : null,
  );
  const stringFooter = toPlainText(resolvedFooter);
  const resolvedSectionTitleColor =
    titleColor != null ? (toSwiftUIHexColor(titleColor) ?? titleColor) : undefined;
  const usesIos15HeaderRow =
    isIos15() &&
    ((resolvedTitle != null && stringTitle == null) ||
      (resolvedTrailing != null && toPlainText(resolvedTrailing) == null));
  const header =
    resolvedTrailing != null || usesIos15HeaderRow ? (
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
              font({
                size: titleFontSize ?? DEFAULT_SECTION_TITLE_FONT_SIZE,
                weight: "regular",
              }),
              ...(resolvedSectionTitleColor != null
                ? [foregroundStyle(resolvedSectionTitleColor)]
                : []),
            ]}
          >
            {stringTitle}
          </SwiftText>
        ) : resolvedTitle != null ? (
          <NativeHostedContent>{resolvedTitle}</NativeHostedContent>
        ) : null}
        {resolvedTrailing != null ? <Spacer minLength={0} /> : null}
        {resolvedTrailing != null ? (
          <NativeTrailingContent>{resolvedTrailing}</NativeTrailingContent>
        ) : null}
      </HStack>
    ) : stringTitle != null && (resolvedSectionTitleColor != null || titleFontSize != null) ? (
      <SwiftText
        modifiers={[
          font({
            size: titleFontSize ?? DEFAULT_SECTION_TITLE_FONT_SIZE,
            weight: "regular",
          }),
          ...(resolvedSectionTitleColor != null
            ? [foregroundStyle(resolvedSectionTitleColor)]
            : []),
        ]}
      >
        {stringTitle}
      </SwiftText>
    ) : resolvedTitle != null && stringTitle == null ? (
      <NativeHostedContent>{resolvedTitle}</NativeHostedContent>
    ) : undefined;
  const footerView =
    stringFooter != null ? (
      <SwiftText modifiers={subtitleModifiers()}>{stringFooter}</SwiftText>
    ) : resolvedFooter != null ? (
      <NativeHostedContent>{resolvedFooter}</NativeHostedContent>
    ) : undefined;

  if (usesIos15HeaderRow && header != null) {
    const [firstChild, ...remainingChildren] = Children.toArray(sectionChildren);

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
      {sectionChildren}
    </SwiftUISection>
  );
}

/**
 * Keeps a React Native text input inside the SwiftUI List row, which preserves
 * controlled values and the full `Input` API while retaining native list chrome.
 */
export const nativeListStyles = StyleSheet.create({
  customRowShell: {
    alignSelf: "stretch",
    maxWidth: "100%",
    minWidth: 0,
    width: "100%",
  },
  disabledContent: {
    opacity: NATIVE_LIST_DISABLED_OPACITY,
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
  selectInlineLabel: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: 6,
    minWidth: 0,
  },
  selectSwatch: {
    borderRadius: 7,
    height: 14,
    width: 14,
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

export const styles = nativeListStyles;

export { NativeListRoot, NativeListRoot as NativeList, NativeListSection };
