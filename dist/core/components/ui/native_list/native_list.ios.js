import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HStack, Host, Image, List, RNHostView, Spacer, Button as SwiftButton, Text as SwiftText, Section as SwiftUISection, VStack, ZStack, } from "@expo/ui/swift-ui";
import { background, buttonStyle, contentMargins, contentShape, disabled as disabledModifier, font, foregroundStyle, frame, layoutPriority, lineLimit, listRowInsets, listSectionSpacing, listStyle, multilineTextAlignment, opacity, padding, scrollContentBackground, scrollDisabled, shapes, tint, viewID, } from "@expo/ui/swift-ui/modifiers";
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
const TITLE_MODIFIERS = [font({ size: 17, weight: "regular" })];
const SUBTITLE_MODIFIERS = [font({ size: 13, weight: "regular" }), lineLimit(4)];
const VALUE_MODIFIERS = [font({ size: 17, weight: "regular" }), lineLimit(1)];
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
    return typeof titleColor === "string" ? titleColor : primaryColor;
}
function resolveNativeListAssistColor(theme) {
    return (toSwiftUIHexColor(theme.gray11?.val) ??
        toSwiftUIHexColor(theme.color06?.val) ??
        toSwiftUIHexColor(theme.color4.val) ??
        theme.gray11?.val ??
        theme.color06?.val ??
        theme.color4.val);
}
function NativeRowLabel({ subtitle, title, titleAlign, expand = false, titleColor, preserveLeadingAnchor = false, }) {
    const theme = useTheme();
    const titleText = toPlainText(title);
    const subtitleText = toPlainText(subtitle);
    const assistColor = resolveNativeListAssistColor(theme);
    const resolvedTextAlignment = titleAlign === "center" ? "center" : titleAlign === "right" ? "trailing" : "leading";
    const resolvedTitleColor = resolveNativeListTitleColor(titleColor ?? undefined, theme);
    if ((title != null && titleText == null) || (subtitle != null && subtitleText == null)) {
        return null;
    }
    const labelContent = (_jsxs(VStack, { alignment: resolvedTextAlignment, modifiers: [
            ...(expand ? [frame({ maxWidth: 99999, alignment: resolvedTextAlignment })] : []),
        ], spacing: subtitleText != null ? 4 : 0, children: [titleText != null ? (_jsx(SwiftText, { modifiers: [
                    ...TITLE_MODIFIERS,
                    ...(resolvedTitleColor != null ? [foregroundStyle(resolvedTitleColor)] : []),
                    lineLimit(subtitleText != null ? 2 : 1),
                    multilineTextAlignment(resolvedTextAlignment),
                ], children: titleText })) : null, subtitleText != null ? (_jsx(SwiftText, { modifiers: [...SUBTITLE_MODIFIERS, foregroundStyle(assistColor)], children: subtitleText })) : null] }));
    if (preserveLeadingAnchor && resolvedTextAlignment === "center") {
        return (_jsxs(ZStack, { alignment: "center", modifiers: [layoutPriority(1), ...(expand ? [frame({ maxWidth: 99999 })] : [])], children: [_jsxs(VStack, { alignment: "leading", modifiers: [
                        opacity(0),
                        ...(expand ? [frame({ maxWidth: 99999, alignment: "leading" })] : []),
                    ], spacing: subtitleText != null ? 4 : 0, children: [titleText != null ? (_jsx(SwiftText, { modifiers: [...TITLE_MODIFIERS, lineLimit(subtitleText != null ? 2 : 1)], children: titleText })) : null, subtitleText != null ? (_jsx(SwiftText, { modifiers: [...SUBTITLE_MODIFIERS], children: subtitleText })) : null] }), labelContent] }));
    }
    return _jsx(VStack, { modifiers: [layoutPriority(1)], children: labelContent });
}
function NativeRowContainer({ children, disabled, nativeScrollId, onPress, btnStyle, btnTint, }) {
    const theme = useTheme();
    const primaryColor = toSwiftUIHexColor(theme.color.val) ?? theme.color.val;
    const resolvedTint = resolveNativeListBtnTintColor(btnTint, primaryColor);
    const baseModifiers = [ROW_INSETS, padding(ROW_PADDING)];
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
function NativeHostedContent({ children }) {
    return (_jsx(RNHostView, { matchContents: true, children: _jsx(View, { style: styles.hostedContent, children: children }) }));
}
function NativeHostedTrailingControl({ children }) {
    return (_jsx(RNHostView, { matchContents: true, children: _jsx(View, { style: styles.trailingHostedContent, children: children }) }));
}
function NativeHostedCustomRow({ children }) {
    return (_jsx(RNHostView, { matchContents: { vertical: true }, children: _jsx(View, { style: styles.customRowShell, children: children }) }));
}
function NativePressRow({ chevron = false, disabled, nativeHaptics, nativeScrollId, onPress, selected = false, subtitle, title, titleAlign, trailingControl, value, btnStyle, btnTint, preserveLeadingAnchor = false, }) {
    const theme = useTheme();
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    const accentColor = toSwiftUIHexColor(theme.color10.val) ?? theme.color10.val;
    const assistColor = resolveNativeListAssistColor(theme);
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
    return (_jsxs(NativeRowContainer, { disabled: disabled, onPress: handlePress, btnStyle: btnStyle, btnTint: btnTint, nativeScrollId: nativeScrollId, children: [_jsx(NativeRowLabel, { subtitle: subtitleText ?? undefined, title: titleText ?? undefined, titleAlign: titleAlign, expand: titleAlign != null, titleColor: btnTint, preserveLeadingAnchor: preserveLeadingAnchor }), showTrailingSpacer ? _jsx(Spacer, { minLength: 12 }) : null, valueText != null ? (_jsx(SwiftText, { modifiers: [...VALUE_MODIFIERS, foregroundStyle(assistColor)], children: valueText })) : null, selected ? _jsx(Image, { color: accentColor, size: 18, systemName: "checkmark" }) : null, trailingControl, chevron ? _jsx(Image, { color: assistColor, size: 13, systemName: "chevron.right" }) : null] }));
}
function NativeListRoot({ automaticallyAdjustsScrollIndicatorInsets, backgroundColor, children, contentInsetAdjustmentBehavior, contentMarginBottom, contentMarginTop, initialScrollTarget, native = true, scrollIndicatorInsets, style, scrollable = true, tracksNavigationBarScrollEdge, ...fallbackProps }) {
    const insets = useSafeAreaInsets();
    const { active: insideTrueSheet, automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied, presentationActive: trueSheetPresentationActive, } = useTrueSheetScrollLayout();
    const resolvedBackgroundColor = backgroundColor != null ? (toSwiftUIHexColor(backgroundColor) ?? undefined) : undefined;
    if (!native) {
        return (_jsx(NativeListContext.Provider, { value: { native: false }, children: _jsx(FallbackRoot, { ...fallbackProps, automaticallyAdjustsScrollIndicatorInsets: automaticallyAdjustsScrollIndicatorInsets, backgroundColor: backgroundColor, contentInsetAdjustmentBehavior: contentInsetAdjustmentBehavior, scrollIndicatorInsets: scrollIndicatorInsets, style: style, scrollable: scrollable, children: children }) }));
    }
    const bottomPadding = insideTrueSheet && scrollable
        ? getTrueSheetScrollBottomPadding({
            insetAdjustment,
            nativeScrollInsetsApplied,
            safeAreaBottom: insets.bottom,
        })
        : 0;
    const manuallyAdjustNormalPageIndicator = !insideTrueSheet && automaticallyAdjustsScrollIndicatorInsets == null;
    const normalPageIndicatorBottomInset = scrollIndicatorInsets?.bottom ?? insets.bottom;
    const compensatesForTrueSheetViewportClipping = insideTrueSheet && scrollable && automaticallyAdjustsScrollIndicatorInsets !== false;
    const resolvedContentInsetAdjustmentBehavior = contentInsetAdjustmentBehavior ??
        (insideTrueSheet && automaticContentInsetAdjustment ? "automatic" : undefined);
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
                // 固定高度的内嵌列表可以显式关闭 indicator 自动调整；这时也必须关闭
                // TrueSheet viewport clipping 补偿，否则初次布局在屏幕外时会留下过期的底部 inset。
                compensatesForViewportClipping: compensatesForTrueSheetViewportClipping, initialScrollAnchor: "center", initialScrollTarget: initialScrollTarget, modifiers: [
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
                    ...(manuallyAdjustNormalPageIndicator && normalPageIndicatorBottomInset > 0
                        ? [
                            contentMargins({
                                edges: "bottom",
                                length: normalPageIndicatorBottomInset,
                                placement: "scrollIndicators",
                            }),
                        ]
                        : []),
                    scrollDisabled(!scrollable),
                ], children: children }) }) }));
}
function NativeListSection({ children, footer, title }) {
    if (!useNativeListEnabled()) {
        return (_jsx(FallbackSection, { footer: footer, title: title, children: children }));
    }
    const stringTitle = toPlainText(title);
    const stringFooter = toPlainText(footer);
    const header = title != null && stringTitle == null ? (_jsx(NativeHostedContent, { children: title })) : undefined;
    const footerView = stringFooter != null ? (_jsx(SwiftText, { modifiers: SUBTITLE_MODIFIERS, children: stringFooter })) : footer != null ? (_jsx(NativeHostedContent, { children: footer })) : undefined;
    return (_jsx(SwiftUISection, { footer: footerView, header: header, title: stringTitle ?? undefined, children: children }));
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
        }, btnStyle: resolvedPickerMode === "wheel" ? "plain" : undefined, trailingControl: _jsx(NativeHostedTrailingControl, { children: _jsx(NativePickerSwiftUI, { ref: pickerRef, items: selectItems, mode: resolvedPickerMode, nativeDropdownAlign: selectProps.nativeDropdownAlign ?? "end", nativeTrigger: true, nativeTriggerContainerStyle: [
                    styles.selectInlineTrigger,
                    disabled ? styles.disabledContent : null,
                ], nativeTriggerIcon: "chevrons-up-down", nativeTriggerLabelProps: {
                    color: "$color10",
                    fontSize: "$4",
                    numberOfLines: 1,
                    opacity: 1,
                }, onValueChange: selectProps.onValueChange, placeholder: selectProps.placeholder, resolvedNativeHaptics: resolvedHaptics, value: selectedValue ?? null }) }), value: undefined }));
}
export function NativeListCustomItem({ children, disabled, nativeHaptics, onPress, }) {
    if (!useNativeListEnabled()) {
        return (_jsx(FallbackCustomItem, { disabled: disabled, nativeHaptics: nativeHaptics, onPress: onPress, children: children }));
    }
    if (onPress == null) {
        return (_jsx(VStack, { modifiers: [ROW_INSETS, disabledModifier(disabled ?? false), padding(ROW_PADDING)], children: _jsx(NativeHostedCustomRow, { children: children }) }));
    }
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    return (_jsx(SwiftButton, { modifiers: [disabledModifier(disabled ?? false), ROW_INSETS, padding(ROW_PADDING)], onPress: () => {
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
