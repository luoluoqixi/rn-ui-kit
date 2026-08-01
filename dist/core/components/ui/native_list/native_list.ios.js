import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HStack, Host, Image, List, RNHostView, Spacer, Button as SwiftButton, Text as SwiftText, Section as SwiftUISection, VStack, ZStack, } from "@expo/ui/swift-ui";
import { background, buttonStyle, contentMargins, contentShape, disabled as disabledModifier, font, foregroundStyle, frame, layoutPriority, lineLimit, listRowInsets, listSectionSpacing, listStyle, multilineTextAlignment, opacity, padding, refreshable, scrollContentBackground, scrollDisabled, shapes, tint, viewID, } from "@expo/ui/swift-ui/modifiers";
import { createContext, useContext, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";
import { NativePickerSwiftUI } from "../select/native_picker";
import { resolveSelectItemGroups } from "../select/select_grouping";
import { getTrueSheetScrollBottomPadding } from "../sheet/native_sheet/true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { Switch } from "../switch";
import { isIos26Plus } from "../utils/platform";
import { toSwiftUIHexColor, triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
import { NativeListActionItem as FallbackActionItem, NativeListCustomItem as FallbackCustomItem, NativeListItem as FallbackItem, NativeListNavigationItem as FallbackNavigationItem, NativeListRoot as FallbackRoot, NativeListSection as FallbackSection, NativeListSelectItem as FallbackSelectItem, NativeListSwitchItem as FallbackSwitchItem, } from "./native_list_fallback";
const NativeListContext = createContext({ native: true });
const ROW_INSETS = listRowInsets({ top: 0, leading: 0, bottom: 0, trailing: 0 });
const ROW_PADDING = { top: 0, bottom: 0, leading: 0, trailing: 0 };
const DEFAULT_TITLE_FONT_SIZE = 17;
const DEFAULT_SUBTITLE_FONT_SIZE = 13;
const DEFAULT_VALUE_FONT_SIZE = 17;
const DEFAULT_SECTION_TITLE_FONT_SIZE = 13;
function resolveRowPadding({ paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, }) {
    return {
        top: paddingTop ?? paddingVertical ?? ROW_PADDING.top,
        bottom: paddingBottom ?? paddingVertical ?? ROW_PADDING.bottom,
        leading: paddingLeft ?? paddingHorizontal ?? ROW_PADDING.leading,
        trailing: paddingRight ?? paddingHorizontal ?? ROW_PADDING.trailing,
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
function NativeRowLabel({ subtitle, subtitleColor, subtitleFontSize, title, titleAlign, expand = false, titleColor, titleFontSize, preserveLeadingAnchor = false, }) {
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
            ...(expand ? [frame({ maxWidth: 99999, alignment: resolvedTextAlignment })] : []),
        ], spacing: subtitleText != null ? 4 : 0, children: [titleText != null ? (_jsx(SwiftText, { modifiers: [
                    ...titleModifiers(titleFontSize),
                    ...(resolvedTitleColor != null ? [foregroundStyle(resolvedTitleColor)] : []),
                    lineLimit(subtitleText != null ? 2 : 1),
                    multilineTextAlignment(resolvedTextAlignment),
                ], children: titleText })) : null, subtitleText != null ? (_jsx(SwiftText, { modifiers: [
                    ...subtitleModifiers(subtitleFontSize),
                    foregroundStyle(resolvedSubtitleColor),
                ], children: subtitleText })) : null] }));
    if (preserveLeadingAnchor && resolvedTextAlignment === "center") {
        return (_jsxs(ZStack, { alignment: "center", modifiers: [layoutPriority(1), ...(expand ? [frame({ maxWidth: 99999 })] : [])], children: [_jsxs(VStack, { alignment: "leading", modifiers: [
                        opacity(0),
                        ...(expand ? [frame({ maxWidth: 99999, alignment: "leading" })] : []),
                    ], spacing: subtitleText != null ? 4 : 0, children: [titleText != null ? (_jsx(SwiftText, { modifiers: [
                                ...titleModifiers(titleFontSize),
                                lineLimit(subtitleText != null ? 2 : 1),
                            ], children: titleText })) : null, subtitleText != null ? (_jsx(SwiftText, { modifiers: subtitleModifiers(subtitleFontSize), children: subtitleText })) : null] }), labelContent] }));
    }
    return _jsx(VStack, { modifiers: [layoutPriority(1)], children: labelContent });
}
function NativeRowContainer({ children, disabled, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, btnStyle, btnTint, }) {
    const theme = useTheme();
    const primaryColor = toSwiftUIHexColor(theme.color.val) ?? theme.color.val;
    const resolvedTint = resolveNativeListBtnTintColor(btnTint, primaryColor);
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
    ];
    if (onPress != null) {
        return (_jsx(SwiftButton, { modifiers: [
                disabledModifier(disabled ?? false),
                buttonStyle(btnStyle ?? "automatic"),
                ...(nativeScrollId != null ? [viewID(nativeScrollId)] : []),
            ], onPress: onPress, children: _jsx(HStack, { alignment: "center", modifiers: [
                    ...baseModifiers,
                    ...(btnStyle === "plain"
                        ? [frame({ maxWidth: 99999, alignment: "leading" }), contentShape(shapes.rectangle())]
                        : []),
                    ...(resolvedTint != null ? [tint(resolvedTint)] : []),
                ], spacing: 12, children: children }) }));
    }
    return (_jsx(HStack, { alignment: "center", modifiers: [
            ...baseModifiers,
            disabledModifier(disabled ?? false),
            ...(nativeScrollId != null ? [viewID(nativeScrollId)] : []),
        ], spacing: 12, children: children }));
}
function NativeHostedIcon({ children }) {
    return (_jsx(RNHostView, { matchContents: true, children: _jsx(View, { collapsable: false, style: styles.hostedIcon, children: children }) }));
}
function NativeHostedContent({ children }) {
    return (_jsx(RNHostView, { matchContents: true, children: _jsx(View, { collapsable: false, style: styles.hostedContent, children: children }) }));
}
function NativeHostedTrailingControl({ children }) {
    return (_jsx(RNHostView, { matchContents: true, children: _jsx(View, { collapsable: false, style: styles.trailingHostedContent, children: children }) }));
}
function NativeHostedCustomRow({ children }) {
    return (_jsx(RNHostView, { matchContents: { vertical: true }, children: _jsx(View, { collapsable: false, style: styles.customRowShell, children: children }) }));
}
function NativePressRow({ chevron = false, chevronColor, disabled, icon, iconColor, iconSize, iconSlotWidth, sfSymbol, nativeHaptics, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, selected = false, subtitle, subtitleColor, subtitleFontSize, title, titleAlign, titleColor, titleFontSize, trailingControl, value, valueColor, valueFontSize, btnStyle, btnTint, preserveLeadingAnchor = false, }) {
    const theme = useTheme();
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
    const hasTrailingContent = valueText != null || selected || trailingControl != null || chevron;
    const showTrailingSpacer = hasTrailingContent && (titleText != null || subtitleText != null);
    const handlePress = onPress
        ? () => {
            onPress();
            triggerNativeHaptics(resolvedHaptics);
        }
        : undefined;
    return (_jsxs(NativeRowContainer, { disabled: disabled, onPress: handlePress, btnStyle: btnStyle, btnTint: btnTint, nativeScrollId: nativeScrollId, paddingBottom: paddingBottom, paddingHorizontal: paddingHorizontal, paddingLeft: paddingLeft, paddingRight: paddingRight, paddingTop: paddingTop, paddingVertical: paddingVertical, children: [sfSymbol != null ? (_jsx(ZStack, { alignment: "center", modifiers: [frame({ width: resolvedIconSlotWidth, alignment: "center" })], children: _jsx(Image, { color: resolvedIconColor, size: resolvedIconSize, systemName: sfSymbol }) })) : icon != null ? (_jsx(NativeHostedIcon, { children: icon })) : null, _jsx(NativeRowLabel, { subtitle: subtitleText ?? undefined, subtitleColor: subtitleColor, subtitleFontSize: subtitleFontSize, title: titleText ?? undefined, titleAlign: titleAlign, expand: titleAlign != null, titleColor: titleColor ?? btnTint, titleFontSize: titleFontSize, preserveLeadingAnchor: preserveLeadingAnchor }), showTrailingSpacer ? _jsx(Spacer, { minLength: 12 }) : null, valueText != null ? (_jsx(SwiftText, { modifiers: [...valueModifiers(valueFontSize), foregroundStyle(resolvedValueColor)], children: valueText })) : null, selected ? _jsx(Image, { color: accentColor, size: 18, systemName: "checkmark" }) : null, trailingControl, chevron ? _jsx(Image, { color: resolvedChevronColor, size: 13, systemName: "chevron.right" }) : null] }));
}
function NativeListRoot({ automaticallyAdjustsScrollIndicatorInsets, backgroundColor, children, contentInsetAdjustmentBehavior, contentMarginBottom, contentMarginTop, fixesIOS26NestedScrollIndicatorSafeArea, initialScrollTarget, native = true, nestedScrollEnabled, navigationBarScrollEdgeOptions, onRefresh, scrollIndicatorInsets, style, scrollable = true, tracksNavigationBarScrollEdge, ...fallbackProps }) {
    const insets = useSafeAreaInsets();
    const { active: insideTrueSheet, automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied, presentationActive: trueSheetPresentationActive, } = useTrueSheetScrollLayout();
    const resolvedBackgroundColor = backgroundColor != null ? (toSwiftUIHexColor(backgroundColor) ?? undefined) : undefined;
    const isNestedNativeList = nestedScrollEnabled === true;
    if (!native) {
        return (_jsx(NativeListContext.Provider, { value: { native: false }, children: _jsx(FallbackRoot, { ...fallbackProps, fixesIOS26NestedScrollIndicatorSafeArea: fixesIOS26NestedScrollIndicatorSafeArea, automaticallyAdjustsScrollIndicatorInsets: automaticallyAdjustsScrollIndicatorInsets, backgroundColor: backgroundColor, contentInsetAdjustmentBehavior: contentInsetAdjustmentBehavior, nestedScrollEnabled: nestedScrollEnabled, navigationBarScrollEdgeOptions: navigationBarScrollEdgeOptions, onRefresh: onRefresh, scrollIndicatorInsets: scrollIndicatorInsets, style: style, scrollable: scrollable, tracksNavigationBarScrollEdge: tracksNavigationBarScrollEdge, children: children }) }));
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
    return (_jsx(NativeListContext.Provider, { value: { native: true }, children: _jsx(Host, { style: [styles.nativeRoot, style], children: _jsx(List
            // Native-stack 已将普通页面放在 header 下方，UIKit 再自动避让会让 indicator 重复下移。
            // TrueSheet 仍需要系统根据 Sheet viewport 处理 indicator，因此保持开启。
            , { 
                // Native-stack 已将普通页面放在 header 下方，UIKit 再自动避让会让 indicator 重复下移。
                // TrueSheet 仍需要系统根据 Sheet viewport 处理 indicator，因此保持开启。
                automaticallyAdjustsScrollIndicatorInsets: manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets, contentInsetAdjustmentBehavior: resolvedContentInsetAdjustmentBehavior, tracksNavigationBarScrollEdge: !isIos26Plus() &&
                    (!insideTrueSheet || trueSheetPresentationActive) &&
                    (tracksNavigationBarScrollEdge ??
                        (!insideTrueSheet && resolvedContentInsetAdjustmentBehavior === "automatic")), 
                // 只有页面级根列表才需要按 TrueSheet 的可见 viewport 裁剪；
                // 内嵌列表保留自身完整高度，由外层 ScrollView 决定何时进入可见区域。
                compensatesForViewportClipping: compensatesForTrueSheetViewportClipping, correctsNestedScrollIndicatorFrame: isIos26Plus() && fixesIOS26NestedScrollIndicatorSafeArea === true, initialScrollAnchor: "center", initialScrollTarget: initialScrollTarget, modifiers: [
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
                ], children: children }) }) }));
}
function NativeListSection({ children, footer, title, titleColor, titleFontSize, }) {
    if (!useNativeListEnabled()) {
        return (_jsx(FallbackSection, { footer: footer, title: title, titleColor: titleColor, titleFontSize: titleFontSize, children: children }));
    }
    const stringTitle = toPlainText(title);
    const stringFooter = toPlainText(footer);
    const resolvedSectionTitleColor = titleColor != null ? (toSwiftUIHexColor(titleColor) ?? titleColor) : undefined;
    const header = stringTitle != null && (resolvedSectionTitleColor != null || titleFontSize != null) ? (_jsx(SwiftText, { modifiers: [
            font({ size: titleFontSize ?? DEFAULT_SECTION_TITLE_FONT_SIZE, weight: "regular" }),
            ...(resolvedSectionTitleColor != null
                ? [foregroundStyle(resolvedSectionTitleColor)]
                : []),
        ], children: stringTitle })) : title != null && stringTitle == null ? (_jsx(NativeHostedContent, { children: title })) : undefined;
    const footerView = stringFooter != null ? (_jsx(SwiftText, { modifiers: subtitleModifiers(), children: stringFooter })) : footer != null ? (_jsx(NativeHostedContent, { children: footer })) : undefined;
    return (_jsx(SwiftUISection, { footer: footerView, header: header, title: header == null ? (stringTitle ?? undefined) : undefined, children: children }));
}
export function NativeListActionItem(props) {
    if (!useNativeListEnabled()) {
        return _jsx(FallbackActionItem, { ...props });
    }
    if (!supportsNativeTextRow(props.title, props.subtitle, props.value)) {
        return _jsx(FallbackActionItem, { ...props });
    }
    return _jsx(NativePressRow, { ...props, chevron: props.chevron });
}
export function NativeListNavigationItem(props) {
    if (!useNativeListEnabled()) {
        return _jsx(FallbackNavigationItem, { ...props });
    }
    if (!supportsNativeTextRow(props.title, props.subtitle, props.value)) {
        return _jsx(FallbackNavigationItem, { ...props });
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
export function NativeListItem({ title, onPress, disabled, titleAlign, btnTint, ...itemProps }) {
    if (!useNativeListEnabled() || !supportsNativeTextRow(itemProps.subtitle)) {
        return (_jsx(FallbackItem, { title: title, onPress: onPress, disabled: disabled, titleAlign: titleAlign, btnTint: btnTint, ...itemProps }));
    }
    return (_jsx(NativePressRow, { ...itemProps, title: title, disabled: disabled, onPress: onPress, titleAlign: titleAlign, btnTint: btnTint, preserveLeadingAnchor: titleAlign === "center" }));
}
export function NativeListSwitchItem({ switchProps, ...itemProps }) {
    if (!useNativeListEnabled()) {
        return _jsx(FallbackSwitchItem, { switchProps: switchProps, ...itemProps });
    }
    if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
        return _jsx(FallbackSwitchItem, { switchProps: switchProps, ...itemProps });
    }
    const checked = switchProps.checked ?? switchProps.defaultChecked ?? false;
    return (_jsx(NativePressRow, { ...itemProps, nativeHaptics: itemProps.nativeHaptics ?? true, disabled: itemProps.disabled || switchProps.disabled, onPress: () => {
            switchProps.onCheckedChange?.(!checked);
        }, trailingControl: _jsx(NativeHostedTrailingControl, { children: _jsx(Switch, { ...switchProps, native: true }) }), value: undefined }));
}
export function NativeListSelectItem({ selectProps, ...itemProps }) {
    if (!useNativeListEnabled()) {
        return _jsx(FallbackSelectItem, { selectProps: selectProps, ...itemProps });
    }
    if (!supportsNativeTextRow(itemProps.title, itemProps.subtitle)) {
        return _jsx(FallbackSelectItem, { selectProps: selectProps, ...itemProps });
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
    const disabled = itemProps.disabled || selectProps.disabled || selectProps.isDisabled;
    const pickerRef = useRef(null);
    return (_jsx(NativePressRow, { ...itemProps, disabled: disabled, nativeHaptics: resolvedHaptics, onPress: () => {
            pickerRef.current?.open();
        }, btnStyle: resolvedPickerMode === "wheel" ? "plain" : undefined, trailingControl: _jsx(NativeHostedTrailingControl, { children: _jsx(NativePickerSwiftUI, { ref: pickerRef, items: selectItems, mode: resolvedPickerMode, nativeDropdownAlign: selectProps.nativeDropdownAlign ?? "end", nativeDropdownAnchorWidth: selectProps.nativeDropdownAnchorWidth, nativeDropdownEdgeOffset: selectProps.nativeDropdownEdgeOffset, nativeTrigger: true, nativeTriggerContainerStyle: [
                    styles.selectInlineTrigger,
                    disabled ? styles.disabledContent : null,
                    selectProps.nativeTriggerContainerStyle,
                ], nativeTriggerContent: selectProps.nativeTriggerContent, nativeTriggerIcon: selectProps.nativeTriggerIcon ?? "chevrons-up-down", nativeTriggerLabelProps: {
                    color: itemProps.valueColor ?? "$color10",
                    fontSize: itemProps.valueFontSize ?? "$4",
                    numberOfLines: 1,
                    opacity: 1,
                    ...selectProps.nativeTriggerLabelProps,
                }, onOpenChange: selectProps.onOpenChange, onValueChange: selectProps.onValueChange, placeholder: selectProps.placeholder, resolvedNativeHaptics: resolvedHaptics, value: selectedValue ?? null }) }), value: undefined }));
}
export function NativeListCustomItem({ backgroundColor, children, disabled, hoverBackgroundColor, nativeHaptics, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, pressBackgroundColor, }) {
    const rowPaddingProps = {
        paddingBottom,
        paddingHorizontal,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingVertical,
    };
    if (!useNativeListEnabled()) {
        return (_jsx(FallbackCustomItem, { backgroundColor: backgroundColor, disabled: disabled, hoverBackgroundColor: hoverBackgroundColor, nativeHaptics: nativeHaptics, onPress: onPress, ...rowPaddingProps, pressBackgroundColor: pressBackgroundColor, children: children }));
    }
    if (onPress == null) {
        return (_jsx(VStack, { modifiers: [
                ROW_INSETS,
                disabledModifier(disabled ?? false),
                padding(resolveRowPadding(rowPaddingProps)),
            ], children: _jsx(NativeHostedCustomRow, { children: children }) }));
    }
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    return (_jsx(SwiftButton, { modifiers: [
            disabledModifier(disabled ?? false),
            ROW_INSETS,
            padding(resolveRowPadding(rowPaddingProps)),
        ], onPress: () => {
            onPress();
            triggerNativeHaptics(resolvedHaptics);
        }, children: _jsx(NativeHostedCustomRow, { children: children }) }));
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
});
export { NativeListRoot as NativeList, NativeListSection };
