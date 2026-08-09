import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ContextMenu as SwiftContextMenu, Divider as SwiftDivider, HStack, Host, Image, Label as SwiftLabel, List, Menu as SwiftMenu, RNHostView, Spacer, Button as SwiftButton, Text as SwiftText, Section as SwiftUISection, Toggle as SwiftToggle, VStack, ZStack, } from "@expo/ui/swift-ui";
import { background, buttonStyle, contentMargins, contentShape, disabled as disabledModifier, font, foregroundStyle, frame, 
// @ts-ignore
ios15ListRowTopRoundedBackground, 
// @ts-ignore
ios15ListRowSeparatorHidden, layoutPriority, lineLimit, listRowBackground, listRowInsets, listSectionSpacing, listStyle, multilineTextAlignment, opacity, padding, refreshable, scrollContentBackground, scrollDisabled, shapes, tag, tint, toggleStyle, viewID, } from "@expo/ui/swift-ui/modifiers";
import { Children, Fragment, createContext, useContext, useRef, useState, } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";
import { NativePickerSwiftUI } from "../select/native_picker";
import { resolveSelectItemGroups } from "../select/select_grouping";
import { Menu } from "../menu";
import { getTrueSheetScrollBottomPadding } from "../sheet/native_sheet/true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { isIos15, isIos26Plus } from "../utils/platform";
import { toSwiftUIHexColor, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { NativeListContextMenuProvider, useResolvedNativeListContextMenu } from "./context_menu";
import { renderNativeListSectionContent } from "./section_content";
import { NativeListEditModeProvider, useNativeListEditMode, useNativeListEditRow, } from "./edit_mode";
import { NativeListActionItem as FallbackActionItem, NativeListCustomItem as FallbackCustomItem, NativeListInputItem as FallbackInputItem, NativeListItem as FallbackItem, NativeListMenuItem as FallbackMenuItem, NativeListNavigationItem as FallbackNavigationItem, NativeListRoot as FallbackRoot, NativeListSection as FallbackSection, NativeListSelectItem as FallbackSelectItem, NativeListSwitchItem as FallbackSwitchItem, } from "./native_list_fallback";
function getNativeContextMenuLabel(item) {
    if (typeof item.label === "string" || typeof item.label === "number") {
        return String(item.label);
    }
    return item.textValue ?? item.value;
}
function hasSwiftUIContextMenu(contextMenuProps) {
    return (contextMenuProps?.items?.length ?? 0) > 0;
}
function NativeSwiftUIContextMenuButton({ disabled, item, label, onPress, }) {
    const destructive = item.destructive ?? false;
    if (item.subtitle != null) {
        return (_jsxs(SwiftButton, { modifiers: [disabledModifier(disabled)], onPress: onPress, role: destructive ? "destructive" : "default", children: [item.selected ? (_jsx(SwiftLabel, { systemImage: "checkmark", title: label })) : (_jsx(SwiftText, { children: label })), _jsx(SwiftText, { children: item.subtitle })] }));
    }
    return (_jsx(SwiftButton, { label: label, modifiers: [disabledModifier(disabled)], onPress: onPress, role: destructive ? "destructive" : "default", systemImage: item.selected ? "checkmark" : undefined }));
}
function NativeSwiftUIContextMenuItems({ itemProps, items, }) {
    return items.map((item) => {
        if (item.separator) {
            return _jsx(SwiftDivider, {}, item.value);
        }
        const label = getNativeContextMenuLabel(item);
        const disabled = item.disabled ?? itemProps?.disabled ?? false;
        const resolvedItem = {
            ...item,
            destructive: item.destructive ?? itemProps?.destructive ?? false,
        };
        if (item.subMenu?.length) {
            return (_jsx(SwiftMenu, { label: label, modifiers: [disabledModifier(disabled)], systemImage: item.selected ? "checkmark" : undefined, children: _jsx(NativeSwiftUIContextMenuItems, { itemProps: itemProps, items: item.subMenu }) }, item.value));
        }
        return (_jsx(NativeSwiftUIContextMenuButton, { disabled: disabled, item: resolvedItem, label: label, onPress: () => {
                const handler = item.onSelect ?? item.onPress;
                handler?.();
            } }, item.value));
    });
}
function NativeSwiftUIContextMenu({ children, contextMenuProps, }) {
    return (_jsxs(SwiftContextMenu, { children: [_jsx(SwiftContextMenu.Trigger, { children: children }), _jsx(SwiftContextMenu.Items, { children: _jsx(NativeSwiftUIContextMenuItems, { itemProps: contextMenuProps.itemProps, items: contextMenuProps.items ?? [] }) })] }));
}
const NativeListContext = createContext({ native: true });
const Ios15FirstVisibleRowContext = createContext(false);
const ROW_INSETS = listRowInsets({ top: 0, leading: 0, bottom: 0, trailing: 0 });
const IOS15_SECTION_HEADER_ROW_INSETS = listRowInsets({
    top: 0,
    leading: 20,
    bottom: 0,
    trailing: 20,
});
const IOS15_SECTION_HEADER_ROW_BACKGROUND = listRowBackground("clear");
const IOS15_SECTION_HEADER_ROW_SEPARATOR = ios15ListRowSeparatorHidden();
const ROW_PADDING = { top: 0, bottom: 0, leading: 0, trailing: 0 };
const DEFAULT_TITLE_FONT_SIZE = 17;
const DEFAULT_SUBTITLE_FONT_SIZE = 13;
const DEFAULT_VALUE_FONT_SIZE = 17;
const DEFAULT_SECTION_TITLE_FONT_SIZE = 13;
const DEFAULT_TEXT_AREA_LINES = 4;
const TEXT_AREA_LINE_HEIGHT = 24;
const TEXT_AREA_VERTICAL_PADDING = 20;
// iOS 15 indents native multi-select content farther than the grouped cell
// background. Extend only the helper-row corner overlay back to the cell edge.
const IOS15_NATIVE_EDIT_ROW_LEADING_INSET = 64;
const IOS15_NATIVE_EDIT_ROW_TRAILING_INSET = 20;
const IOS15_NATIVE_EDIT_ROW_TOP_INSET = 6;
function resolveRowPadding({ paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, }) {
    return {
        top: paddingTop ?? paddingVertical ?? ROW_PADDING.top,
        bottom: paddingBottom ?? paddingVertical ?? ROW_PADDING.bottom,
        leading: paddingLeft ?? paddingHorizontal ?? ROW_PADDING.leading,
        trailing: paddingRight ?? paddingHorizontal ?? ROW_PADDING.trailing,
    };
}
function resolveTextAreaHeight(textAreaProps) {
    const style = StyleSheet.flatten(textAreaProps.style);
    const numberOfLines = typeof textAreaProps.numberOfLines === "number"
        ? textAreaProps.numberOfLines
        : DEFAULT_TEXT_AREA_LINES;
    const configuredHeight = typeof style?.height === "number"
        ? style.height
        : typeof style?.minHeight === "number"
            ? style.minHeight
            : undefined;
    return (configuredHeight ??
        Math.max(100, numberOfLines * TEXT_AREA_LINE_HEIGHT + TEXT_AREA_VERTICAL_PADDING));
}
function resolveEditingInputDisplay(value, defaultValue, placeholder) {
    const inputValue = value ?? defaultValue;
    const text = typeof inputValue === "string" || typeof inputValue === "number" ? String(inputValue) : "";
    if (text.length > 0) {
        return { placeholder: false, text };
    }
    return {
        placeholder: true,
        text: typeof placeholder === "string" ? placeholder : "",
    };
}
function titleModifiers(fontSize) {
    return [font({ size: fontSize ?? DEFAULT_TITLE_FONT_SIZE, weight: "regular" })];
}
function subtitleModifiers(fontSize) {
    return [font({ size: fontSize ?? DEFAULT_SUBTITLE_FONT_SIZE, weight: "regular" }), lineLimit(4)];
}
function valueModifiers(fontSize) {
    return [font({ size: fontSize ?? DEFAULT_VALUE_FONT_SIZE, weight: "regular" }), lineLimit(1)];
}
function toPlainText(value) {
    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }
    return null;
}
function useNativeListEnabled() {
    return useContext(NativeListContext).native;
}
function supportsNativeTextRow(...values) {
    return values.every((value) => value == null || toPlainText(value) != null);
}
function resolveNativeListBtnTintColor(btnTint, primaryColor) {
    if (btnTint === false || btnTint == null) {
        return null;
    }
    return typeof btnTint === "string" ? btnTint : primaryColor;
}
function resolveNativeListTitleColor(titleColor, theme) {
    if (titleColor === false) {
        return null;
    }
    const primaryColor = toSwiftUIHexColor(theme.gray12.val) ?? theme.gray12.val;
    return typeof titleColor === "string"
        ? (toSwiftUIHexColor(titleColor) ?? titleColor)
        : primaryColor;
}
function resolveNativeListAssistColor(theme) {
    return (toSwiftUIHexColor(theme.gray11?.val) ??
        toSwiftUIHexColor(theme.color06?.val) ??
        toSwiftUIHexColor(theme.color4.val) ??
        theme.gray11?.val ??
        theme.color06?.val ??
        theme.color4.val);
}
function NativeRowLabel({ subtitle, subtitleColor, subtitleFontSize, title, titleAlign, expand = false, titleColor, titleFontSize, titleLineLimit, layoutPriorityValue = 1, opacityValue = 1, preserveLeadingAnchor = false, }) {
    const theme = useTheme();
    const titleText = toPlainText(title);
    const subtitleText = toPlainText(subtitle);
    const assistColor = resolveNativeListAssistColor(theme);
    const resolvedTextAlignment = titleAlign === "center" ? "center" : titleAlign === "right" ? "trailing" : "leading";
    const resolvedTitleColor = resolveNativeListTitleColor(titleColor ?? undefined, theme);
    const resolvedSubtitleColor = (subtitleColor != null ? toSwiftUIHexColor(subtitleColor) : undefined) ?? assistColor;
    if ((title != null && titleText == null) || (subtitle != null && subtitleText == null)) {
        return null;
    }
    const labelContent = (_jsxs(VStack, { alignment: resolvedTextAlignment, modifiers: [
            ...(opacityValue !== 1 ? [opacity(opacityValue)] : []),
            ...(expand ? [frame({ maxWidth: 99999, alignment: resolvedTextAlignment })] : []),
        ], spacing: subtitleText != null ? 4 : 0, children: [titleText != null ? (_jsx(SwiftText, { modifiers: [
                    ...titleModifiers(titleFontSize),
                    ...(resolvedTitleColor != null ? [foregroundStyle(resolvedTitleColor)] : []),
                    lineLimit(titleLineLimit ?? (subtitleText != null ? 2 : 1)),
                    multilineTextAlignment(resolvedTextAlignment),
                ], children: titleText })) : null, subtitleText != null ? (_jsx(SwiftText, { modifiers: [
                    ...subtitleModifiers(subtitleFontSize),
                    foregroundStyle(resolvedSubtitleColor),
                ], children: subtitleText })) : null] }));
    if (preserveLeadingAnchor && resolvedTextAlignment === "center") {
        return (_jsxs(ZStack, { alignment: "center", modifiers: [
                layoutPriority(layoutPriorityValue),
                ...(expand ? [frame({ maxWidth: 99999 })] : []),
            ], children: [_jsxs(VStack, { alignment: "leading", modifiers: [
                        opacity(0),
                        ...(expand ? [frame({ maxWidth: 99999, alignment: "leading" })] : []),
                    ], spacing: subtitleText != null ? 4 : 0, children: [titleText != null ? (_jsx(SwiftText, { modifiers: [
                                ...titleModifiers(titleFontSize),
                                lineLimit(titleLineLimit ?? (subtitleText != null ? 2 : 1)),
                            ], children: titleText })) : null, subtitleText != null ? (_jsx(SwiftText, { modifiers: subtitleModifiers(subtitleFontSize), children: subtitleText })) : null] }), labelContent] }));
    }
    return _jsx(VStack, { modifiers: [layoutPriority(layoutPriorityValue)], children: labelContent });
}
function NativeRowContainer({ children, contextMenuProps, disabled, nativeSelectionId, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, btnStyle, btnTint, rowAlignment = "center", rowMinHeight, }) {
    const theme = useTheme();
    const restoresIos15TopCorners = useContext(Ios15FirstVisibleRowContext);
    const primaryColor = toSwiftUIHexColor(theme.color.val) ?? theme.color.val;
    const resolvedTint = resolveNativeListBtnTintColor(btnTint, primaryColor);
    const swiftUIContextMenuProps = hasSwiftUIContextMenu(contextMenuProps)
        ? contextMenuProps
        : undefined;
    const baseModifiers = [
        ROW_INSETS,
        padding(resolveRowPadding({
            paddingBottom,
            paddingHorizontal,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingVertical,
        })),
        ...(rowMinHeight != null
            ? [
                frame({
                    minHeight: rowMinHeight,
                    alignment: rowAlignment === "top" ? "topLeading" : "leading",
                }),
            ]
            : []),
    ];
    const buttonContent = (_jsx(HStack, { alignment: rowAlignment, modifiers: [
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
                    ios15ListRowTopRoundedBackground(12, {
                        horizontal: 20,
                        top: 6,
                    }),
                ]
                : []),
        ], spacing: 12, children: children }));
    if (onPress != null) {
        const button = (_jsx(SwiftButton, { modifiers: [
                disabledModifier(disabled ?? false),
                buttonStyle(btnStyle ?? "automatic"),
                ...(nativeScrollId != null ? [viewID(nativeScrollId)] : []),
                ...(nativeSelectionId != null ? [tag(nativeSelectionId)] : []),
            ], onPress: onPress, children: buttonContent }));
        return swiftUIContextMenuProps != null ? (_jsx(NativeSwiftUIContextMenu, { contextMenuProps: swiftUIContextMenuProps, children: button })) : (button);
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
                nativeSelectionId != null
                    ? ios15ListRowTopRoundedBackground(12, {
                        leading: IOS15_NATIVE_EDIT_ROW_LEADING_INSET,
                        trailing: IOS15_NATIVE_EDIT_ROW_TRAILING_INSET,
                        top: IOS15_NATIVE_EDIT_ROW_TOP_INSET,
                    })
                    : ios15ListRowTopRoundedBackground(),
            ]
            : []),
    ];
    if (swiftUIContextMenuProps != null) {
        return (_jsx(NativeSwiftUIContextMenu, { contextMenuProps: swiftUIContextMenuProps, children: _jsx(HStack, { alignment: rowAlignment, modifiers: rowModifiers, spacing: 12, children: children }) }));
    }
    return (_jsx(HStack, { alignment: rowAlignment, modifiers: rowModifiers, spacing: 12, children: children }));
}
function NativeHostedIcon({ children }) {
    return (_jsx(RNHostView, { matchContents: true, children: _jsx(View, { collapsable: false, style: styles.hostedIcon, children: children }) }));
}
function NativeFallbackContextMenuRow({ children, contextMenuProps, }) {
    const editMode = useNativeListEditMode();
    const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
    if (editMode || resolvedContextMenuProps == null) {
        return children;
    }
    return (_jsx(NativeListContextMenuProvider, { contextMenuProps: resolvedContextMenuProps, children: children }));
}
function NativeHostedContent({ children }) {
    return (_jsx(RNHostView, { matchContents: true, children: _jsx(View, { collapsable: false, style: styles.hostedContent, children: children }) }));
}
function NativeHostedTrailingControl({ children, disableInEditMode = false, }) {
    const editMode = useNativeListEditMode();
    const interactionsDisabled = editMode && disableInEditMode;
    return (_jsx(RNHostView, { matchContents: true, children: _jsx(View, { collapsable: false, pointerEvents: interactionsDisabled ? "none" : "auto", style: [
                styles.trailingHostedContent,
                interactionsDisabled ? styles.disabledContent : null,
            ], children: children }) }));
}
function NativeTrailingContent({ children }) {
    const text = toPlainText(children);
    if (text != null) {
        return _jsx(SwiftText, { modifiers: valueModifiers(), children: text });
    }
    return _jsx(NativeHostedTrailingControl, { children: children });
}
function NativeHostedCustomRow({ children, disableInteractions = false, }) {
    return (_jsx(RNHostView, { matchContents: { vertical: true }, children: _jsx(View, { collapsable: false, pointerEvents: disableInteractions ? "none" : "auto", style: styles.customRowShell, children: children }) }));
}
function NativePressRow({ chevron = false, chevronColor, contextMenuProps, disabled, icon, iconColor, iconSize, iconSlotWidth, sfSymbol, nativeHaptics, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, selected = false, selectionId, subtitle, subtitleColor, subtitleFontSize, trailing, title, titleAlign, titleColor, titleFontSize, titleLineLimit, trailingControl, overlayTrailingControlOnValueSymbol = false, preserveValueWidth = false, labelOpacity = 1, value, valueColor, valueFontSize, valueSfSymbol, btnStyle, btnTint, preserveLeadingAnchor = false, rowAlignment = "center", rowMinHeight, }) {
    const theme = useTheme();
    const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
    const editRow = useNativeListEditRow({
        disabled,
        nativeScrollId,
        nativeSelection: true,
        onPress,
        selectionId,
    });
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    const accentColor = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
    const assistColor = resolveNativeListAssistColor(theme);
    const resolvedChevronColor = (chevronColor != null ? toSwiftUIHexColor(chevronColor) : undefined) ?? assistColor;
    const resolvedIconColor = (iconColor != null ? toSwiftUIHexColor(iconColor) : undefined) ?? accentColor;
    const resolvedIconSize = iconSize ?? 20;
    const resolvedIconSlotWidth = iconSlotWidth ?? Math.max(24, resolvedIconSize);
    const resolvedValueColor = (valueColor != null ? toSwiftUIHexColor(valueColor) : undefined) ?? assistColor;
    const titleText = toPlainText(title);
    const subtitleText = toPlainText(subtitle);
    const valueText = toPlainText(value);
    const hasTrailingContent = valueText != null ||
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
    return (_jsxs(NativeRowContainer, { contextMenuProps: editRow.editMode || resolvedContextMenuProps?.triggerProps?.disabled
            ? undefined
            : resolvedContextMenuProps, disabled: disabled, nativeSelectionId: editRow.editMode ? editRow.selectionId : undefined, onPress: handlePress, btnStyle: btnStyle, btnTint: btnTint, nativeScrollId: nativeScrollId, paddingBottom: paddingBottom, paddingHorizontal: paddingHorizontal, paddingLeft: paddingLeft, paddingRight: paddingRight, paddingTop: paddingTop, paddingVertical: paddingVertical, rowAlignment: rowAlignment, rowMinHeight: rowMinHeight, children: [sfSymbol != null ? (_jsx(ZStack, { alignment: "center", modifiers: [frame({ width: resolvedIconSlotWidth, alignment: "center" })], children: _jsx(Image, { color: resolvedIconColor, size: resolvedIconSize, systemName: sfSymbol }) }, "leading-icon")) : icon != null ? (_jsx(NativeHostedIcon, { children: icon }, "leading-icon")) : null, _jsx(NativeRowLabel, { subtitle: subtitleText ?? undefined, subtitleColor: subtitleColor, subtitleFontSize: subtitleFontSize, title: titleText ?? undefined, titleAlign: titleAlign, expand: titleAlign != null, titleColor: titleColor ?? btnTint, titleFontSize: titleFontSize, titleLineLimit: titleLineLimit, layoutPriorityValue: preserveValueWidth ? 0 : 1, opacityValue: labelOpacity, preserveLeadingAnchor: preserveLeadingAnchor }, "row-label"), showTrailingSpacer ? _jsx(Spacer, { minLength: 12 }, "trailing-spacer") : null, valueText != null ? (_jsx(SwiftText, { modifiers: [
                    ...valueModifiers(valueFontSize),
                    foregroundStyle(resolvedValueColor),
                    ...(preserveValueWidth ? [layoutPriority(2)] : []),
                ], children: valueText }, "row-value")) : null, valueSfSymbol != null ? (_jsxs(ZStack, { alignment: "center", modifiers: preserveValueWidth ? [layoutPriority(2)] : undefined, children: [_jsx(Image, { color: resolvedValueColor, size: 13, systemName: valueSfSymbol }), overlayTrailingControlOnValueSymbol && trailingControl != null ? (_jsx(Fragment, { children: trailingControl }, "trailing-control-overlay")) : null] }, "row-value-symbol")) : null, !editRow.editMode && selected ? (_jsx(Image, { color: accentColor, size: 18, systemName: "checkmark" }, "selected-checkmark")) : null, trailing != null ? (_jsx(NativeTrailingContent, { children: trailing }, "custom-trailing")) : null, trailingControl != null && !overlayTrailingControlOnValueSymbol ? (_jsx(Fragment, { children: trailingControl }, "trailing-control")) : null, !editRow.editMode && chevron ? (_jsx(Image, { color: resolvedChevronColor, size: 13, systemName: "chevron.right" }, "chevron")) : null] }));
}
function NativeListRoot({ automaticallyAdjustsScrollIndicatorInsets, backgroundColor, children, contextMenuProps, contentInsetAdjustmentBehavior, contentMarginBottom, contentMarginTop, defaultSelectedIds, editMode, editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol, fixesIOS26NestedScrollIndicatorSafeArea, initialScrollTarget, native = true, nestedScrollEnabled, navigationBarScrollEdgeOptions, onRefresh, onSelectedIdsChange, scrollIndicatorInsets, style, scrollable = true, selectedIds, tracksNavigationBarScrollEdge, webAutoRestoreScroll: _webAutoRestoreScroll, ...fallbackProps }) {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const nativeEditTint = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
    const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState(() => [...(defaultSelectedIds ?? [])]);
    const resolvedSelectedIds = selectedIds ?? uncontrolledSelectedIds;
    const handleSelectedIdsChange = (nextSelectedIds) => {
        if (selectedIds == null) {
            setUncontrolledSelectedIds(nextSelectedIds);
        }
        onSelectedIdsChange?.([...nextSelectedIds]);
    };
    const { active: insideTrueSheet, automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied, presentationActive: trueSheetPresentationActive, } = useTrueSheetScrollLayout();
    const resolvedBackgroundColor = backgroundColor != null ? (toSwiftUIHexColor(backgroundColor) ?? undefined) : undefined;
    const isNestedNativeList = nestedScrollEnabled === true;
    const usesNativeEditMode = editMode === true;
    if (!native) {
        return (_jsx(NativeListContext.Provider, { value: { native: false }, children: _jsx(FallbackRoot, { ...fallbackProps, fixesIOS26NestedScrollIndicatorSafeArea: fixesIOS26NestedScrollIndicatorSafeArea, automaticallyAdjustsScrollIndicatorInsets: automaticallyAdjustsScrollIndicatorInsets, backgroundColor: backgroundColor, contentInsetAdjustmentBehavior: contentInsetAdjustmentBehavior, contextMenuProps: contextMenuProps, defaultSelectedIds: defaultSelectedIds, editMode: editMode, editModeIcon: editModeIcon, editModeSelectedIcon: editModeSelectedIcon, editModeSelectedSfSymbol: editModeSelectedSfSymbol, editModeSfSymbol: editModeSfSymbol, nestedScrollEnabled: nestedScrollEnabled, navigationBarScrollEdgeOptions: navigationBarScrollEdgeOptions, onRefresh: onRefresh, onSelectedIdsChange: onSelectedIdsChange, scrollIndicatorInsets: scrollIndicatorInsets, style: style, scrollable: scrollable, selectedIds: selectedIds, tracksNavigationBarScrollEdge: tracksNavigationBarScrollEdge, children: children }) }));
    }
    const bottomPadding = insideTrueSheet && scrollable && !isNestedNativeList
        ? getTrueSheetScrollBottomPadding({
            insetAdjustment,
            nativeScrollInsetsApplied,
            safeAreaBottom: insets.bottom,
        })
        : 0;
    // 默认只关闭普通 native-stack 页面的重复自动调整，不注入窗口底部安全区。
    // 定高内嵌列表的安全区由外层滚动视图处理，不能再按页面级根列表自动调整。
    const manuallyAdjustNormalPageIndicator = (!insideTrueSheet || isNestedNativeList) && automaticallyAdjustsScrollIndicatorInsets == null;
    const compensatesForTrueSheetViewportClipping = insideTrueSheet &&
        scrollable &&
        !isNestedNativeList &&
        automaticallyAdjustsScrollIndicatorInsets !== false;
    const resolvedContentInsetAdjustmentBehavior = contentInsetAdjustmentBehavior ??
        (isNestedNativeList
            ? "never"
            : insideTrueSheet && automaticContentInsetAdjustment
                ? "automatic"
                : undefined);
    return (_jsx(NativeListEditModeProvider, { defaultSelectedIds: defaultSelectedIds, editMode: editMode, nativeSelectionEnabled: true, onSelectedIdsChange: handleSelectedIdsChange, selectedIds: resolvedSelectedIds, children: _jsx(NativeListContext.Provider, { value: { native: true }, children: _jsx(Host, { style: [styles.nativeRoot, style], children: _jsx(List
                // Native-stack 已将普通页面放在 header 下方，UIKit 再自动避让会让 indicator 重复下移。
                // TrueSheet 仍需要系统根据 Sheet viewport 处理 indicator，因此保持开启。
                , { 
                    // Native-stack 已将普通页面放在 header 下方，UIKit 再自动避让会让 indicator 重复下移。
                    // TrueSheet 仍需要系统根据 Sheet viewport 处理 indicator，因此保持开启。
                    automaticallyAdjustsScrollIndicatorInsets: manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets, 
                    // @ts-ignore
                    contentInsetAdjustmentBehavior: resolvedContentInsetAdjustmentBehavior, tracksNavigationBarScrollEdge: (!insideTrueSheet || trueSheetPresentationActive) &&
                        (tracksNavigationBarScrollEdge ??
                            (!insideTrueSheet && resolvedContentInsetAdjustmentBehavior === "automatic")), 
                    // 只有页面级根列表才需要按 TrueSheet 的可见 viewport 裁剪；
                    // 内嵌列表保留自身完整高度，由外层 ScrollView 决定何时进入可见区域。
                    compensatesForViewportClipping: compensatesForTrueSheetViewportClipping, correctsNestedScrollIndicatorFrame: isIos26Plus() && fixesIOS26NestedScrollIndicatorSafeArea === true, initialScrollAnchor: "center", initialScrollTarget: initialScrollTarget, nativeEditMode: usesNativeEditMode ? "active" : "inactive", nativeEditTint: nativeEditTint, onSelectionChange: usesNativeEditMode ? handleSelectedIdsChange : undefined, selection: usesNativeEditMode ? [...resolvedSelectedIds] : undefined, modifiers: [
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
                    ], children: _jsx(NativeListContextMenuProvider, { contextMenuProps: contextMenuProps, children: children }) }) }) }) }));
}
function NativeListSection({ children, contextMenuProps, footer, trailing, title, titleColor, titleFontSize, }) {
    const nativeListEnabled = useNativeListEnabled();
    const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
    const resolvedFooter = renderNativeListSectionContent(footer);
    const resolvedTitle = renderNativeListSectionContent(title);
    const resolvedTrailing = renderNativeListSectionContent(trailing);
    if (!nativeListEnabled) {
        return (_jsx(FallbackSection, { contextMenuProps: contextMenuProps, footer: resolvedFooter, trailing: resolvedTrailing, title: resolvedTitle, titleColor: titleColor, titleFontSize: titleFontSize, children: children }));
    }
    const stringTitle = toPlainText(resolvedTitle);
    const sectionChildren = Children.map(children, (child) => child != null ? (_jsx(NativeListContextMenuProvider, { contextMenuProps: resolvedContextMenuProps, children: child })) : null);
    const stringFooter = toPlainText(resolvedFooter);
    const resolvedSectionTitleColor = titleColor != null ? (toSwiftUIHexColor(titleColor) ?? titleColor) : undefined;
    const usesIos15HeaderRow = isIos15() &&
        ((resolvedTitle != null && stringTitle == null) ||
            (resolvedTrailing != null && toPlainText(resolvedTrailing) == null));
    const header = resolvedTrailing != null || usesIos15HeaderRow ? (_jsxs(HStack, { alignment: "center", modifiers: [
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
        ], spacing: 8, children: [stringTitle != null ? (_jsx(SwiftText, { modifiers: [
                    font({ size: titleFontSize ?? DEFAULT_SECTION_TITLE_FONT_SIZE, weight: "regular" }),
                    ...(resolvedSectionTitleColor != null
                        ? [foregroundStyle(resolvedSectionTitleColor)]
                        : []),
                ], children: stringTitle })) : resolvedTitle != null ? (_jsx(NativeHostedContent, { children: resolvedTitle })) : null, resolvedTrailing != null ? _jsx(Spacer, { minLength: 0 }) : null, resolvedTrailing != null ? (_jsx(NativeTrailingContent, { children: resolvedTrailing })) : null] })) : stringTitle != null && (resolvedSectionTitleColor != null || titleFontSize != null) ? (_jsx(SwiftText, { modifiers: [
            font({ size: titleFontSize ?? DEFAULT_SECTION_TITLE_FONT_SIZE, weight: "regular" }),
            ...(resolvedSectionTitleColor != null
                ? [foregroundStyle(resolvedSectionTitleColor)]
                : []),
        ], children: stringTitle })) : resolvedTitle != null && stringTitle == null ? (_jsx(NativeHostedContent, { children: resolvedTitle })) : undefined;
    const footerView = stringFooter != null ? (_jsx(SwiftText, { modifiers: subtitleModifiers(), children: stringFooter })) : resolvedFooter != null ? (_jsx(NativeHostedContent, { children: resolvedFooter })) : undefined;
    if (usesIos15HeaderRow && header != null) {
        const [firstChild, ...remainingChildren] = Children.toArray(sectionChildren);
        return (_jsxs(SwiftUISection, { footer: footerView, children: [header, firstChild != null ? (_jsx(Ios15FirstVisibleRowContext.Provider, { value: true, children: firstChild })) : null, remainingChildren] }));
    }
    return (_jsx(SwiftUISection, { footer: footerView, header: header, title: header == null ? (stringTitle ?? undefined) : undefined, children: sectionChildren }));
}
export function NativeListActionItem(props) {
    if (!useNativeListEnabled()) {
        return _jsx(FallbackActionItem, { ...props });
    }
    if (!supportsNativeTextRow(props.title, props.subtitle, props.value)) {
        return (_jsx(NativeFallbackContextMenuRow, { contextMenuProps: props.contextMenuProps, children: _jsx(FallbackActionItem, { ...props }) }));
    }
    return _jsx(NativePressRow, { ...props, chevron: props.chevron });
}
export function NativeListNavigationItem(props) {
    if (!useNativeListEnabled()) {
        return _jsx(FallbackNavigationItem, { ...props });
    }
    if (!supportsNativeTextRow(props.title, props.subtitle, props.value)) {
        return (_jsx(NativeFallbackContextMenuRow, { contextMenuProps: props.contextMenuProps, children: _jsx(FallbackNavigationItem, { ...props }) }));
    }
    return _jsx(NativePressRow, { ...props, chevron: props.chevron ?? true });
}
export function NativeListButtonItem({ title, onPress, disabled, titleAlign = "center", btnTint, ...itemProps }) {
    const theme = useTheme();
    const defaultColor = theme.accent10.val;
    let resolveColor = btnTint ?? defaultColor;
    if (typeof resolveColor === "string") {
        resolveColor = toSwiftUIHexColor(resolveColor) ?? false;
    }
    return (_jsx(NativeListItem, { ...itemProps, title: title, disabled: disabled, onPress: onPress, titleAlign: titleAlign, value: undefined, btnTint: resolveColor }));
}
/**
 * Keeps a React Native text input inside the SwiftUI List row, which preserves
 * controlled values and the full `Input` API while retaining native list chrome.
 */
export function NativeListInputItem({ inputProps, ...itemProps }) {
    const nativeListEnabled = useNativeListEnabled();
    const editMode = useNativeListEditMode();
    const theme = useTheme();
    const [uncontrolledEditingValue, setUncontrolledEditingValue] = useState(() => typeof inputProps.defaultValue === "string" ? inputProps.defaultValue : "");
    const disabled = itemProps.disabled || inputProps.disabled;
    const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
    const { autoFocusNative, disabled: _inputDisabled, onChangeText, style: inputStyle, unstyled: _unstyled, ...nativeInputProps } = inputProps;
    const editingDisplay = resolveEditingInputDisplay(inputProps.value ?? uncontrolledEditingValue, inputProps.defaultValue, inputProps.placeholder);
    const flattenedInputStyle = StyleSheet.flatten(inputStyle);
    const editingTextColor = editingDisplay.placeholder
        ? typeof inputProps.placeholderTextColor === "string"
            ? inputProps.placeholderTextColor
            : (theme.gray9?.val ?? theme.color10.val)
        : typeof flattenedInputStyle?.color === "string"
            ? flattenedInputStyle.color
            : (theme.gray12?.val ?? theme.color.val);
    const resolvedInput = (_jsx(TextInput, { ...nativeInputProps, autoFocus: autoFocusNative ?? inputProps.autoFocus ?? false, textAlign: inputProps.textAlign ?? (hasLeadingLabel ? "right" : undefined), clearButtonMode: inputProps.clearButtonMode ?? "while-editing", editable: !disabled, multiline: inputProps.multiline ?? false, onChangeText: (nextValue) => {
            setUncontrolledEditingValue(nextValue);
            onChangeText?.(nextValue);
        }, placeholderTextColor: inputProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val, style: [
            styles.input,
            !hasLeadingLabel ? styles.fullWidthInput : null,
            { color: theme.gray12?.val ?? theme.color.val },
            inputStyle,
        ] }));
    if (hasLeadingLabel) {
        if (!nativeListEnabled) {
            return _jsx(FallbackInputItem, { inputProps: inputProps, ...itemProps });
        }
        if (editMode) {
            return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, value: editingDisplay.text, valueColor: editingTextColor }));
        }
        return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, trailingControl: _jsx(NativeHostedTrailingControl, { children: _jsx(View, { collapsable: false, style: styles.inputTrailing, children: resolvedInput }) }) }));
    }
    if (nativeListEnabled && editMode) {
        return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, title: editingDisplay.text, titleColor: editingTextColor }));
    }
    return (_jsx(NativeListCustomItem, { ...itemProps, disabled: disabled, paddingVertical: itemProps.paddingVertical ?? 0, children: _jsx(View, { collapsable: false, style: styles.inputRow, children: resolvedInput }) }));
}
export function NativeListTextAreaItem({ textAreaProps, ...itemProps }) {
    const nativeListEnabled = useNativeListEnabled();
    const editMode = useNativeListEditMode();
    const theme = useTheme();
    const [uncontrolledEditingValue, setUncontrolledEditingValue] = useState(() => typeof textAreaProps.defaultValue === "string" ? textAreaProps.defaultValue : "");
    const disabled = itemProps.disabled || textAreaProps.disabled;
    const textAreaHeight = resolveTextAreaHeight(textAreaProps);
    const { disabled: _inputDisabled, onChangeText, scrollEnabled, style: inputStyle, unstyled: _unstyled, ...nativeTextAreaProps } = textAreaProps;
    const editingDisplay = resolveEditingInputDisplay(textAreaProps.value ?? uncontrolledEditingValue, textAreaProps.defaultValue, textAreaProps.placeholder);
    const flattenedInputStyle = StyleSheet.flatten(inputStyle);
    const editingLineLimit = typeof textAreaProps.numberOfLines === "number"
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
        return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, paddingBottom: itemProps.paddingBottom ?? itemProps.paddingVertical ?? 10, paddingTop: itemProps.paddingTop ?? itemProps.paddingVertical ?? 10, rowAlignment: "top", rowMinHeight: textAreaHeight, title: editingDisplay.text, titleColor: editingTextColor, titleLineLimit: editingLineLimit }));
    }
    return (_jsx(NativeListCustomItem, { ...itemProps, disabled: disabled, children: _jsx(View, { collapsable: false, style: [styles.textAreaRow, { height: textAreaHeight }], children: _jsx(TextInput, { ...nativeTextAreaProps, editable: !disabled, multiline: true, onChangeText: (nextValue) => {
                    setUncontrolledEditingValue(nextValue);
                    onChangeText?.(nextValue);
                }, placeholderTextColor: textAreaProps.placeholderTextColor ?? theme.gray9?.val ?? theme.color10.val, scrollEnabled: scrollEnabled ?? true, style: [
                    styles.textArea,
                    {
                        color: theme.gray12?.val ?? theme.color.val,
                        height: textAreaHeight,
                        minHeight: textAreaHeight,
                    },
                    inputStyle,
                ] }) }) }));
}
export function NativeListItem({ title, onPress, disabled, titleAlign, btnTint, ...itemProps }) {
    const nativeListEnabled = useNativeListEnabled();
    if (!nativeListEnabled || !supportsNativeTextRow(itemProps.subtitle)) {
        const fallbackItem = (_jsx(FallbackItem, { title: title, onPress: onPress, disabled: disabled, titleAlign: titleAlign, btnTint: btnTint, ...itemProps }));
        return nativeListEnabled ? (_jsx(NativeFallbackContextMenuRow, { contextMenuProps: itemProps.contextMenuProps, children: fallbackItem })) : (fallbackItem);
    }
    return (_jsx(NativePressRow, { ...itemProps, title: title, disabled: disabled, onPress: onPress, titleAlign: titleAlign, btnTint: btnTint, preserveLeadingAnchor: titleAlign === "center" }));
}
export function NativeListSwitchItem({ switchProps, ...itemProps }) {
    if (!useNativeListEnabled()) {
        return _jsx(FallbackSwitchItem, { switchProps: switchProps, ...itemProps });
    }
    if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
        return (_jsx(NativeFallbackContextMenuRow, { contextMenuProps: itemProps.contextMenuProps, children: _jsx(FallbackSwitchItem, { switchProps: switchProps, ...itemProps }) }));
    }
    const editMode = useNativeListEditMode();
    const theme = useTheme();
    const [uncontrolledChecked, setUncontrolledChecked] = useState(switchProps.defaultChecked ?? false);
    const checked = switchProps.checked ?? uncontrolledChecked;
    const disabled = Boolean(itemProps.disabled || switchProps.disabled);
    const nativeHaptics = itemProps.nativeHaptics ?? !editMode;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const themeSwitchTint = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
    const switchTint = itemProps.btnTint === false
        ? null
        : typeof itemProps.btnTint === "string"
            ? (toSwiftUIHexColor(itemProps.btnTint) ?? itemProps.btnTint)
            : themeSwitchTint;
    const handleCheckedChange = (nextChecked) => {
        if (switchProps.checked == null) {
            setUncontrolledChecked(nextChecked);
        }
        switchProps.onCheckedChange?.(nextChecked);
    };
    const handleSwiftToggleChange = (nextChecked) => {
        handleCheckedChange(nextChecked);
        // SwiftUI Toggle does not provide the system switch haptic feedback on iOS 15 and below.
        // Row presses already trigger haptics in NativePressRow, so limit this to direct Toggle changes.
        if (isIos15()) {
            triggerNativeHaptics(resolvedNativeHaptics);
        }
    };
    return (_jsx(NativePressRow, { ...itemProps, nativeHaptics: nativeHaptics, disabled: disabled, onPress: () => {
            handleCheckedChange(!checked);
        }, trailingControl: _jsx(SwiftToggle, { isOn: checked, modifiers: [
                toggleStyle("switch"),
                ...(switchTint != null ? [tint(switchTint)] : []),
                disabledModifier(editMode || disabled),
            ], onIsOnChange: handleSwiftToggleChange }), value: undefined }));
}
function NativeIos15MenuSelectRow({ itemProps, selectItems, selectProps, }) {
    const editMode = useNativeListEditMode();
    const theme = useTheme();
    const disabled = Boolean(itemProps.disabled || selectProps.disabled || selectProps.isDisabled);
    const resolvedContextMenuProps = useResolvedNativeListContextMenu(itemProps.contextMenuProps);
    const editRow = useNativeListEditRow({
        disabled,
        nativeScrollId: itemProps.nativeScrollId,
        nativeSelection: true,
        selectionId: itemProps.selectionId,
    });
    const resolvedHaptics = useResolvedNativeHaptics(selectProps.nativeHaptics ?? itemProps.nativeHaptics ?? false);
    const accentColor = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
    const resolvedIconColor = (itemProps.iconColor != null ? toSwiftUIHexColor(itemProps.iconColor) : undefined) ??
        accentColor;
    const resolvedValueColor = (itemProps.valueColor != null ? toSwiftUIHexColor(itemProps.valueColor) : undefined) ??
        accentColor;
    const resolvedIconSize = itemProps.iconSize ?? 20;
    const resolvedIconSlotWidth = itemProps.iconSlotWidth ?? Math.max(24, resolvedIconSize);
    const selectedValue = selectProps.value ?? selectProps.defaultValue;
    const placeholder = toPlainText(selectProps.placeholder) ?? "请选择";
    const selectedItem = selectItems.find((item) => item.value === selectedValue);
    const selectedLabel = selectedItem?.label ?? placeholder;
    const fadeTitleOnOpen = itemProps.fadeTitleOnOpen !== false;
    const handleSelection = (nextValue) => {
        if (nextValue === selectedValue) {
            return;
        }
        triggerNativeHaptics(resolvedHaptics);
        selectProps.onValueChange?.(nextValue);
    };
    if (!fadeTitleOnOpen) {
        const leadingContent = (_jsxs(HStack, { spacing: 12, children: [itemProps.sfSymbol != null ? (_jsx(ZStack, { alignment: "center", modifiers: [frame({ width: resolvedIconSlotWidth, alignment: "center" })], children: _jsx(Image, { color: resolvedIconColor, size: resolvedIconSize, systemName: itemProps.sfSymbol }) })) : null, _jsx(NativeRowLabel, { subtitle: itemProps.subtitle, subtitleColor: itemProps.subtitleColor, subtitleFontSize: itemProps.subtitleFontSize, title: itemProps.title, titleAlign: itemProps.titleAlign, titleColor: itemProps.titleColor ?? itemProps.btnTint, titleFontSize: itemProps.titleFontSize })] }));
        return (_jsx(NativeRowContainer, { contextMenuProps: editRow.editMode || resolvedContextMenuProps?.triggerProps?.disabled
                ? undefined
                : resolvedContextMenuProps, disabled: disabled, nativeScrollId: itemProps.nativeScrollId, nativeSelectionId: editRow.editMode ? editRow.selectionId : undefined, paddingBottom: itemProps.paddingBottom, paddingHorizontal: itemProps.paddingHorizontal, paddingLeft: itemProps.paddingLeft, paddingRight: itemProps.paddingRight, paddingTop: itemProps.paddingTop, paddingVertical: itemProps.paddingVertical, children: _jsxs(ZStack, { alignment: "center", modifiers: [frame({ maxWidth: 99999, alignment: "leading" })], children: [_jsxs(HStack, { modifiers: [frame({ maxWidth: 99999, alignment: "leading" })], spacing: 12, children: [leadingContent, _jsx(Spacer, { minLength: 12 })] }), _jsx(SwiftMenu, { label: _jsxs(HStack, { modifiers: [
                                frame({ maxWidth: 99999, alignment: "leading" }),
                                contentShape(shapes.rectangle()),
                            ], spacing: 12, children: [_jsx(HStack, { modifiers: [opacity(0)], spacing: 12, children: leadingContent }), _jsx(Spacer, { minLength: 12 }), _jsxs(HStack, { modifiers: [opacity(editMode || disabled ? 0.5 : 1)], spacing: 4, children: [_jsx(SwiftText, { modifiers: [
                                                ...valueModifiers(itemProps.valueFontSize),
                                                foregroundStyle(resolvedValueColor),
                                            ], children: selectedLabel }), _jsx(Image, { color: resolvedValueColor, size: 13, systemName: "chevron.up.chevron.down" })] })] }), modifiers: [
                            buttonStyle("plain"),
                            frame({ maxWidth: 99999, alignment: "leading" }),
                            contentShape(shapes.rectangle()),
                            disabledModifier(editMode || disabled),
                        ], children: selectItems.map((item) => (_jsx(SwiftButton, { label: item.label, modifiers: [disabledModifier(Boolean(item.disabled || item.isDisabled))], onPress: () => handleSelection(item.value), systemImage: item.value === selectedValue ? "checkmark" : undefined }, `${item.groupKey}:${item.value}`))) })] }) }));
    }
    return (_jsx(NativeRowContainer, { contextMenuProps: editRow.editMode || resolvedContextMenuProps?.triggerProps?.disabled
            ? undefined
            : resolvedContextMenuProps, disabled: disabled, nativeScrollId: itemProps.nativeScrollId, nativeSelectionId: editRow.editMode ? editRow.selectionId : undefined, paddingBottom: itemProps.paddingBottom, paddingHorizontal: itemProps.paddingHorizontal, paddingLeft: itemProps.paddingLeft, paddingRight: itemProps.paddingRight, paddingTop: itemProps.paddingTop, paddingVertical: itemProps.paddingVertical, children: _jsx(SwiftMenu, { label: _jsxs(HStack, { modifiers: [
                    frame({ maxWidth: 99999, alignment: "leading" }),
                    contentShape(shapes.rectangle()),
                ], spacing: 12, children: [itemProps.sfSymbol != null ? (_jsx(ZStack, { alignment: "center", modifiers: [frame({ width: resolvedIconSlotWidth, alignment: "center" })], children: _jsx(Image, { color: resolvedIconColor, size: resolvedIconSize, systemName: itemProps.sfSymbol }) })) : null, _jsx(NativeRowLabel, { subtitle: itemProps.subtitle, subtitleColor: itemProps.subtitleColor, subtitleFontSize: itemProps.subtitleFontSize, title: itemProps.title, titleAlign: itemProps.titleAlign, titleColor: itemProps.titleColor ?? itemProps.btnTint, titleFontSize: itemProps.titleFontSize }), _jsx(Spacer, { minLength: 12 }), _jsxs(HStack, { modifiers: [opacity(editMode || disabled ? 0.5 : 1)], spacing: 4, children: [_jsx(SwiftText, { modifiers: [
                                    ...valueModifiers(itemProps.valueFontSize),
                                    foregroundStyle(resolvedValueColor),
                                ], children: selectedLabel }), _jsx(Image, { color: resolvedValueColor, size: 13, systemName: "chevron.up.chevron.down" })] })] }), modifiers: [
                buttonStyle("plain"),
                frame({ maxWidth: 99999, alignment: "leading" }),
                contentShape(shapes.rectangle()),
                disabledModifier(editMode || disabled),
            ], children: selectItems.map((item) => (_jsx(SwiftButton, { label: item.label, modifiers: [disabledModifier(Boolean(item.disabled || item.isDisabled))], onPress: () => handleSelection(item.value), systemImage: item.value === selectedValue ? "checkmark" : undefined }, `${item.groupKey}:${item.value}`))) }) }));
}
export function NativeListSelectItem({ selectProps, ...itemProps }) {
    if (!useNativeListEnabled()) {
        return _jsx(FallbackSelectItem, { selectProps: selectProps, ...itemProps });
    }
    if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
        return (_jsx(NativeFallbackContextMenuRow, { contextMenuProps: itemProps.contextMenuProps, children: _jsx(FallbackSelectItem, { selectProps: selectProps, ...itemProps }) }));
    }
    const resolvedHaptics = useResolvedNativeHaptics(selectProps.nativeHaptics ?? itemProps.nativeHaptics ?? false);
    const resolvedPickerMode = (selectProps.nativePickerMode ?? "dropdown");
    const resolvedItemGroups = resolveSelectItemGroups({
        itemGroups: selectProps.itemGroups,
        items: selectProps.items,
        options: selectProps.options,
    });
    const selectItems = resolvedItemGroups.flatMap((group) => group.items);
    const selectedValue = selectProps.value ?? selectProps.defaultValue;
    const selectedItem = selectItems.find((item) => item.value === selectedValue);
    const defaultTriggerLabel = selectedItem?.label ?? selectProps.placeholder ?? "";
    const nativeTriggerLabel = selectedValue == null || selectedValue === "" || selectProps.renderValue == null
        ? defaultTriggerLabel
        : selectProps.renderValue(selectedValue);
    const disabled = itemProps.disabled || selectProps.disabled || selectProps.isDisabled;
    const pickerRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const fadeTitleOnOpen = itemProps.fadeTitleOnOpen !== false;
    const usesIos15NativeMenu = isIos15() &&
        resolvedPickerMode === "dropdown" &&
        resolvedItemGroups.length === 1 &&
        resolvedItemGroups[0]?.label == null &&
        selectItems.length > 0 &&
        !selectItems.some((item) => item.description != null ||
            item.startContent != null ||
            item.endContent != null) &&
        (itemProps.icon == null || itemProps.sfSymbol != null) &&
        itemProps.btnTint == null &&
        itemProps.iconColor == null &&
        itemProps.iconSize == null &&
        itemProps.iconSlotWidth == null &&
        itemProps.subtitle == null &&
        itemProps.trailing == null &&
        itemProps.titleAlign == null &&
        itemProps.titleColor == null &&
        itemProps.titleFontSize == null &&
        itemProps.value == null &&
        itemProps.chevron !== true &&
        itemProps.selected !== true &&
        selectProps.nativeDropdownAlign == null &&
        selectProps.nativeDropdownAnchorWidth == null &&
        selectProps.nativeDropdownEdgeOffset == null &&
        selectProps.nativeTriggerContainerStyle == null &&
        selectProps.nativeTriggerContent == null &&
        selectProps.nativeTriggerLabelProps == null &&
        (selectProps.nativeTriggerIcon == null ||
            selectProps.nativeTriggerIcon === "chevrons-up-down") &&
        selectProps.onOpenChange == null &&
        selectProps.renderValue == null &&
        selectProps.contentProps == null &&
        selectProps.itemIndicatorProps == null &&
        selectProps.itemLabel == null &&
        selectProps.itemLabelProps == null &&
        selectProps.itemProps == null &&
        selectProps.itemTextProps == null &&
        selectProps.viewportProps == null &&
        (selectProps.placeholder == null || toPlainText(selectProps.placeholder) != null);
    if (usesIos15NativeMenu) {
        return (_jsx(NativeIos15MenuSelectRow, { itemProps: itemProps, selectItems: selectItems, selectProps: selectProps }));
    }
    const handleDropdownOpenWillChange = (nextOpen) => {
        setDropdownOpen(nextOpen);
    };
    const handlePickerOpenChange = (nextOpen) => {
        selectProps.onOpenChange?.(nextOpen);
    };
    return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, labelOpacity: resolvedPickerMode === "dropdown" && fadeTitleOnOpen && dropdownOpen ? 0.6 : 1, nativeHaptics: resolvedHaptics, onPress: () => {
            const picker = pickerRef.current;
            if (picker == null) {
                return;
            }
            // 在行的按压反馈结束前接管标题透明度，避免等待原生菜单回调时闪回一帧。
            if (resolvedPickerMode === "dropdown" && fadeTitleOnOpen) {
                setDropdownOpen(true);
            }
            picker.open();
        }, btnStyle: resolvedPickerMode === "wheel" ? "plain" : undefined, trailingControl: _jsx(NativeHostedTrailingControl, { disableInEditMode: true, children: _jsx(NativePickerSwiftUI, { ref: pickerRef, items: selectItems, mode: resolvedPickerMode, nativeDropdownAlign: selectProps.nativeDropdownAlign ?? "end", nativeDropdownAnchorWidth: selectProps.nativeDropdownAnchorWidth, nativeDropdownEdgeOffset: selectProps.nativeDropdownEdgeOffset, nativeTrigger: true, nativeTriggerContainerStyle: [
                    styles.selectInlineTrigger,
                    disabled ? styles.disabledContent : null,
                    selectProps.nativeTriggerContainerStyle,
                ], nativeTriggerContent: selectProps.nativeTriggerContent, nativeTriggerIcon: selectProps.nativeTriggerIcon ?? "chevrons-up-down", nativeTriggerLabel: nativeTriggerLabel, nativeTriggerLabelProps: {
                    color: itemProps.valueColor ?? "$color10",
                    fontSize: itemProps.valueFontSize ?? "$4",
                    numberOfLines: 1,
                    opacity: 1,
                    ...selectProps.nativeTriggerLabelProps,
                }, 
                // wheel 行使用 SwiftUI plain Button；整行已经提供按压透明度，
                // 禁用内部 trigger 的反馈，避免行尾内容被重复降低透明度。
                nativeTriggerPressedOpacity: resolvedPickerMode === "wheel" ? false : undefined, onOpenChange: handlePickerOpenChange, onOpenWillChange: resolvedPickerMode === "dropdown" ? handleDropdownOpenWillChange : undefined, onValueChange: selectProps.onValueChange, placeholder: selectProps.placeholder, resolvedNativeHaptics: resolvedHaptics, value: selectedValue ?? null }) }), value: undefined }));
}
/** 在 iOS 原生列表中保留原生行布局，并将 Menu trigger 托管到行尾。 */
export function NativeListMenuItem({ menuProps, ...itemProps }) {
    if (!useNativeListEnabled()) {
        return _jsx(FallbackMenuItem, { menuProps: menuProps, ...itemProps });
    }
    if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
        return (_jsx(NativeFallbackContextMenuRow, { contextMenuProps: itemProps.contextMenuProps, children: _jsx(FallbackMenuItem, { menuProps: menuProps, ...itemProps }) }));
    }
    const disabled = itemProps.disabled || menuProps.triggerProps?.disabled;
    const menuRef = useRef(null);
    const [uncontrolledWillOpen, setUncontrolledWillOpen] = useState(Boolean(menuProps.defaultOpen));
    const menuOpen = menuProps.open ?? uncontrolledWillOpen;
    const fadeTitleOnOpen = itemProps.fadeTitleOnOpen !== false;
    const menuValue = itemProps.value ?? "更多";
    const handleMenuOpenChange = (nextOpen) => {
        menuProps.onOpenChange?.(nextOpen);
    };
    const handleMenuOpenWillChange = (nextOpen) => {
        if (menuProps.open === undefined) {
            setUncontrolledWillOpen(nextOpen);
        }
        menuProps.onOpenWillChange?.(nextOpen);
    };
    return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, labelOpacity: fadeTitleOnOpen && menuOpen ? 0.6 : 1, nativeHaptics: false, onPress: () => {
            const menu = menuRef.current;
            if (menu == null) {
                return;
            }
            // 与 trigger 同步进入打开态，消除整行按压反馈结束到菜单回调之间的透明度空档。
            if (fadeTitleOnOpen && menuProps.open === undefined) {
                setUncontrolledWillOpen(true);
            }
            menu.presentMenu();
        }, trailingControl: _jsx(NativeHostedTrailingControl, { disableInEditMode: true, children: _jsx(Menu, { ...menuProps, nativeHaptics: menuProps.nativeHaptics ?? itemProps.nativeHaptics ?? false, nativeTrigger: true, nativeTriggerContainerStyle: [
                    styles.selectInlineTrigger,
                    disabled ? styles.disabledContent : null,
                ], nativeTriggerIcon: "chevrons-up-down", nativeTriggerLabel: menuValue, nativeTriggerLabelProps: {
                    color: itemProps.valueColor ?? "$color10",
                    fontSize: itemProps.valueFontSize ?? "$4",
                    numberOfLines: 1,
                    opacity: 1,
                }, onOpenChange: handleMenuOpenChange, onOpenWillChange: handleMenuOpenWillChange, triggerProps: {
                    ...menuProps.triggerProps,
                    disabled,
                }, 
                // `Menu` 在 iOS 使用 ContextMenuButton；通过该句柄由整行打开，不嵌套 SwiftUI 行。
                // @ts-expect-error Tamagui/Zeego 的原生菜单控制句柄。
                __menuRef: menuRef }) }), value: undefined }));
}
export function NativeListCustomItem({ backgroundColor, children, contextMenuProps, disabled, hoverBackgroundColor, nativeHaptics, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, pressBackgroundColor, selectionId, }) {
    const restoresIos15TopCorners = useContext(Ios15FirstVisibleRowContext);
    const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
    const editRow = useNativeListEditRow({
        disabled,
        nativeScrollId,
        nativeSelection: true,
        onPress,
        selectionId,
    });
    const rowPaddingProps = {
        paddingBottom,
        paddingHorizontal,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingVertical,
    };
    const activeContextMenuProps = editRow.editMode || resolvedContextMenuProps?.triggerProps?.disabled
        ? undefined
        : resolvedContextMenuProps;
    const swiftUIContextMenuProps = hasSwiftUIContextMenu(activeContextMenuProps)
        ? activeContextMenuProps
        : undefined;
    if (!useNativeListEnabled()) {
        return (_jsx(FallbackCustomItem, { backgroundColor: backgroundColor, contextMenuProps: contextMenuProps, disabled: disabled, hoverBackgroundColor: hoverBackgroundColor, nativeHaptics: nativeHaptics, nativeScrollId: nativeScrollId, onPress: onPress, ...rowPaddingProps, pressBackgroundColor: pressBackgroundColor, selectionId: selectionId, children: children }));
    }
    if (editRow.editMode) {
        return (_jsx(NativeRowContainer, { ...rowPaddingProps, disabled: disabled, nativeSelectionId: editRow.editMode ? editRow.selectionId : undefined, nativeScrollId: nativeScrollId, onPress: editRow.onPress, children: _jsx(NativeHostedCustomRow, { disableInteractions: true, children: children }) }));
    }
    if (onPress == null) {
        const rowModifiers = [
            ROW_INSETS,
            disabledModifier(disabled ?? false),
            padding(resolveRowPadding(rowPaddingProps)),
            ...(restoresIos15TopCorners
                ? [frame({ maxWidth: 99999, alignment: "leading" }), ios15ListRowTopRoundedBackground()]
                : []),
        ];
        const customRow = (_jsx(VStack, { modifiers: rowModifiers, children: _jsx(NativeHostedCustomRow, { children: children }) }));
        if (swiftUIContextMenuProps != null) {
            return (_jsx(NativeSwiftUIContextMenu, { contextMenuProps: swiftUIContextMenuProps, children: customRow }));
        }
        return customRow;
    }
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    if (restoresIos15TopCorners) {
        const button = (_jsx(SwiftButton, { modifiers: [disabledModifier(disabled ?? false)], onPress: () => {
                onPress();
                triggerNativeHaptics(resolvedHaptics);
            }, children: _jsx(VStack, { modifiers: [
                    ROW_INSETS,
                    padding(resolveRowPadding(rowPaddingProps)),
                    frame({ maxWidth: 99999, alignment: "leading" }),
                    ios15ListRowTopRoundedBackground(12, {
                        horizontal: 20,
                        top: 8,
                    }),
                ], children: _jsx(NativeHostedCustomRow, { children: children }) }) }));
        return swiftUIContextMenuProps != null ? (_jsx(NativeSwiftUIContextMenu, { contextMenuProps: swiftUIContextMenuProps, children: button })) : (button);
    }
    const button = (_jsx(SwiftButton, { modifiers: [
            disabledModifier(disabled ?? false),
            ROW_INSETS,
            padding(resolveRowPadding(rowPaddingProps)),
        ], onPress: () => {
            onPress();
            triggerNativeHaptics(resolvedHaptics);
        }, children: _jsx(NativeHostedCustomRow, { children: children }) }));
    return swiftUIContextMenuProps != null ? (_jsx(NativeSwiftUIContextMenu, { contextMenuProps: swiftUIContextMenuProps, children: button })) : (button);
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
