import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HeaderHeightContext } from "@react-navigation/elements";
import { Check, ChevronRight, ChevronsUpDown } from "@tamagui/lucide-icons-2";
import { Children, isValidElement, useContext, useEffect, useMemo, useState, } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";
import { isWeb, os } from "../utils/platform";
import { useAppBackgroundColors, useUiPreferences } from "../utils/theme";
import { FlashList } from "../flash_list";
import { Select } from "../select";
import { getTrueSheetScrollBottomPadding, getTrueSheetScrollIndicatorBottomInset, } from "../sheet/native_sheet/true_sheet/sheet_scroll_layout";
import { useTrueSheetScrollLayout } from "../sheet/native_sheet/true_sheet/true_sheet_scroll_context";
import { Switch } from "../switch";
import { SizableText, Text } from "../text";
import { triggerNativeHaptics, useNavigationBarScrollEdge, useResolvedNativeHaptics, } from "../utils";
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
function resolveFallbackRowPadding({ paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, }) {
    if (paddingBottom == null &&
        paddingHorizontal == null &&
        paddingLeft == null &&
        paddingRight == null &&
        paddingTop == null &&
        paddingVertical == null) {
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
function FallbackRowContainer({ backgroundColor, children, disabled, hoverBackgroundColor, nativeHaptics, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, pressResetToken, pressBackgroundColor, }) {
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
    const pressedRowBackground = pressBackgroundColor ??
        theme.color5?.val ??
        theme.backgroundPress?.val ??
        theme.background?.val;
    const hoveredRowBackground = hoverBackgroundColor ??
        theme.color4?.val ??
        theme.backgroundHover?.val ??
        theme.background?.val;
    const getRowBackground = (pressed = false) => ({
        backgroundColor: pressed && !disabled
            ? pressedRowBackground
            : hovered && !disabled
                ? hoveredRowBackground
                : normalRowBackground,
    });
    if (onPress == null) {
        return (_jsx(View, { style: [
                styles.rowContainer,
                resolvedRowPadding,
                getRowBackground(),
                disabled ? styles.disabledContent : null,
            ], children: children }));
    }
    return (_jsx(Pressable, { disabled: disabled, onHoverIn: () => setHovered(true), onHoverOut: () => setHovered(false), onPressIn: usesIosSwitchPressFallback ? () => setPressed(true) : undefined, onPress: () => {
            onPress();
            triggerNativeHaptics(resolvedHaptics);
        }, onPressOut: usesIosSwitchPressFallback ? () => setPressed(false) : undefined, style: styles.pressable, children: ({ pressed: pressablePressed }) => (_jsx(View, { style: [
                styles.rowContainer,
                resolvedRowPadding,
                getRowBackground(usesIosSwitchPressFallback ? pressed : pressablePressed),
                disabled ? styles.disabledContent : null,
            ], children: children })) }));
}
function renderTitleNode(title, titleColor, titleFontSize, textAlign) {
    if (title == null || typeof title === "boolean") {
        return null;
    }
    if (typeof title === "string" || typeof title === "number") {
        const titleStyle = {
            ...(titleColor ? { color: titleColor } : null),
            ...(titleFontSize != null ? { fontSize: titleFontSize } : null),
            textAlign,
        };
        return (_jsx(SizableText, { numberOfLines: 1, size: "$true", style: titleStyle, children: title }));
    }
    return title;
}
function renderSubtitleNode(subtitle, subtitleColor, subtitleFontSize) {
    if (subtitle == null || typeof subtitle === "boolean") {
        return null;
    }
    if (typeof subtitle === "string" || typeof subtitle === "number") {
        return (_jsx(Text, { color: subtitleColor, opacity: subtitleColor == null ? 0.6 : 1, fontSize: subtitleFontSize ?? "$3", numberOfLines: 4, children: subtitle }));
    }
    return subtitle;
}
function renderValueNode(value, valueColor, valueFontSize) {
    if (value == null || typeof value === "boolean") {
        return null;
    }
    if (typeof value === "string" || typeof value === "number") {
        return (_jsx(Text, { color: (valueColor ?? "$color"), fontSize: valueFontSize ?? "$4", numberOfLines: 1, opacity: valueColor == null ? 0.58 : 1, children: value }));
    }
    return value;
}
function NativeListRow({ backgroundColor, chevron = false, chevronColor, disabled, hoverBackgroundColor, icon, iconAfter, iconSlotWidth, nativeHaptics, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, pressResetToken, pressBackgroundColor, selected = false, subtitle, subtitleColor, subtitleFontSize, title, titleAlign, titleColor, titleFontSize, value, valueColor, valueFontSize, }) {
    const titleAlignment = titleAlign === "center" ? "center" : titleAlign === "right" ? "flex-end" : "flex-start";
    const textAlign = titleAlign === "center" ? "center" : titleAlign === "right" ? "right" : "left";
    const titleNode = renderTitleNode(title, titleColor, titleFontSize, textAlign);
    const subtitleNode = renderSubtitleNode(subtitle, subtitleColor, subtitleFontSize);
    const valueNode = renderValueNode(value, valueColor, valueFontSize);
    const customIcon = icon;
    return (_jsx(FallbackRowContainer, { backgroundColor: backgroundColor, disabled: disabled, hoverBackgroundColor: hoverBackgroundColor, nativeHaptics: nativeHaptics, onPress: onPress, paddingBottom: paddingBottom, paddingHorizontal: paddingHorizontal, paddingLeft: paddingLeft, paddingRight: paddingRight, paddingTop: paddingTop, paddingVertical: paddingVertical, pressResetToken: pressResetToken, pressBackgroundColor: pressBackgroundColor, children: _jsxs(View, { style: styles.rowContent, children: [customIcon != null ? (_jsx(View, { style: [
                        styles.iconBefore,
                        iconSlotWidth != null ? { width: iconSlotWidth } : undefined,
                    ], children: customIcon })) : null, _jsxs(View, { style: [styles.textColumn, { alignItems: titleAlignment }], children: [titleNode, subtitleNode] }), _jsxs(View, { style: styles.iconAfterRow, children: [valueNode, selected ? _jsx(Check, { color: "$accent10", size: 18 }) : null, iconAfter, chevron ? (_jsx(ChevronRight, { color: (chevronColor ?? "$color"), opacity: chevronColor == null ? 0.58 : 1, size: 18 })) : null] })] }) }));
}
function FallbackPressRow({ trailingControl, ...props }) {
    return _jsx(NativeListRow, { ...props, iconAfter: trailingControl });
}
function getSelectedLabel(selectProps) {
    const selectedValue = selectProps.value ?? selectProps.defaultValue;
    const items = [
        ...(selectProps.items ?? selectProps.options ?? []),
        ...(selectProps.itemGroups?.flatMap((group) => group.items) ?? []),
    ];
    return (items.find((item) => item.value === selectedValue)?.label ??
        (typeof selectProps.placeholder === "string" ? selectProps.placeholder : ""));
}
function getNodeKey(node, fallback) {
    if (isValidElement(node) && node.key != null) {
        return String(node.key);
    }
    return fallback;
}
function getNativeScrollId(node) {
    if (!isValidElement(node)) {
        return undefined;
    }
    return node.props.nativeScrollId;
}
function isNativeListSectionType(type) {
    if (type === NativeListSection) {
        return true;
    }
    return typeof type === "function" && type.name === "NativeListSection";
}
function isNativeListSectionElement(node) {
    return isValidElement(node) && isNativeListSectionType(node.type);
}
function isNativeListElementType(node, type) {
    return isValidElement(node) && node.type === type;
}
function createFallbackRowEntry(child, key, sectionKey) {
    if (isNativeListElementType(child, NativeListActionItem)) {
        return {
            key,
            nativeScrollId: child.props.nativeScrollId,
            renderRow: () => _jsx(NativeListActionItem, { ...child.props }),
            rowType: "actionRow",
            sectionKey,
            type: "row",
        };
    }
    if (isNativeListElementType(child, NativeListNavigationItem)) {
        return {
            key,
            nativeScrollId: child.props.nativeScrollId,
            renderRow: () => _jsx(NativeListNavigationItem, { ...child.props }),
            rowType: "navigationRow",
            sectionKey,
            type: "row",
        };
    }
    if (isNativeListElementType(child, NativeListSwitchItem)) {
        return {
            key,
            nativeScrollId: child.props.nativeScrollId,
            renderRow: () => _jsx(NativeListSwitchItem, { ...child.props }),
            rowType: "switchRow",
            sectionKey,
            type: "row",
        };
    }
    if (isNativeListElementType(child, NativeListSelectItem)) {
        return {
            key,
            nativeScrollId: child.props.nativeScrollId,
            renderRow: () => _jsx(NativeListSelectItem, { ...child.props }),
            rowType: "selectRow",
            sectionKey,
            type: "row",
        };
    }
    if (isNativeListElementType(child, NativeListButtonItem)) {
        return {
            key,
            nativeScrollId: child.props.nativeScrollId,
            renderRow: () => _jsx(NativeListButtonItem, { ...child.props }),
            rowType: "buttonRow",
            sectionKey,
            type: "row",
        };
    }
    if (isNativeListElementType(child, NativeListItem)) {
        return {
            key,
            nativeScrollId: child.props.nativeScrollId,
            renderRow: () => _jsx(NativeListItem, { ...child.props }),
            rowType: "itemRow",
            sectionKey,
            type: "row",
        };
    }
    if (isNativeListElementType(child, NativeListCustomItem)) {
        return {
            key,
            nativeScrollId: getNativeScrollId(child),
            renderRow: () => _jsx(NativeListCustomItem, { ...child.props }),
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
function FallbackListRowFrame({ children }) {
    return (_jsx(View, { collapsable: false, style: styles.rowFrame, children: children }));
}
function appendSectionEntries(entries, sectionProps, sectionKey) {
    const sectionChildren = Children.toArray(sectionProps.children);
    const hasSectionContent = sectionProps.title != null || sectionChildren.length > 0 || sectionProps.footer != null;
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
        entries.push(createFallbackRowEntry(child, `${sectionKey}-row-${getNodeKey(child, String(index))}`, sectionKey));
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
function createFallbackListEntries(children) {
    const entries = [];
    Children.toArray(children).forEach((child, index) => {
        if (isNativeListSectionElement(child)) {
            appendSectionEntries(entries, child.props, getNodeKey(child, `section-${index}`));
            return;
        }
        entries.push(createFallbackRowEntry(child, `direct-row-${getNodeKey(child, String(index))}`, `direct-${index}`));
    });
    return entries;
}
function renderFallbackListEntry({ item, }) {
    switch (item.type) {
        case "sectionHeader":
            return (_jsx(View, { style: styles.sectionLabel, children: typeof item.title === "string" || typeof item.title === "number" ? (_jsx(Text, { color: (item.titleColor ?? "$color10"), fontSize: item.titleFontSize ?? "$3", children: item.title })) : (item.title) }));
        case "row":
            return _jsx(FallbackListRowFrame, { children: item.renderRow() });
        case "sectionFooter":
            return (_jsx(View, { style: styles.sectionFooter, children: typeof item.footer === "string" || typeof item.footer === "number" ? (_jsx(Text, { color: "$color10", fontSize: "$3", children: item.footer })) : (item.footer) }));
    }
}
function FallbackListItemSeparator({ leadingItem, trailingItem, }) {
    const theme = useTheme();
    if (leadingItem == null || trailingItem == null) {
        return null;
    }
    if (leadingItem.sectionKey !== trailingItem.sectionKey) {
        return _jsx(View, { style: styles.sectionSpacer });
    }
    if (leadingItem.type === "row" && trailingItem.type === "row") {
        return (_jsx(View, { style: styles.rowSeparatorOuter, children: _jsx(View, { style: [
                    styles.rowSeparator,
                    { backgroundColor: theme.borderColor?.val ?? theme.color4?.val },
                ] }) }));
    }
    return null;
}
function renderStaticEntries(entries) {
    return entries.map((entry, index) => {
        const trailingItem = entries[index + 1];
        return (_jsxs(View, { children: [renderFallbackListEntry({ item: entry, index, target: "Cell" }), _jsx(FallbackListItemSeparator, { leadingItem: entry, trailingItem: trailingItem })] }, entry.key));
    });
}
function getEntryType(item) {
    return item.type === "row" ? item.rowType : item.type;
}
function getEntryKey(item) {
    return item.key;
}
function getInitialScrollIndex(entries, initialScrollTarget) {
    if (initialScrollTarget == null) {
        return undefined;
    }
    const index = entries.findIndex((entry) => {
        return entry.type === "row" && entry.nativeScrollId === initialScrollTarget;
    });
    return index >= 0 ? index : undefined;
}
export function NativeListActionItem(props) {
    return _jsx(FallbackPressRow, { ...props, chevron: props.chevron });
}
export function NativeListNavigationItem(props) {
    return _jsx(FallbackPressRow, { ...props, chevron: props.chevron ?? true });
}
export function NativeListSwitchItem({ switchProps, ...itemProps }) {
    const checked = switchProps.checked ?? switchProps.defaultChecked ?? false;
    const disabled = itemProps.disabled || switchProps.disabled;
    const isIos = os() === "ios";
    const [pressResetToken, setPressResetToken] = useState(0);
    const resetRowPress = () => {
        if (isIos) {
            setPressResetToken((token) => token + 1);
        }
    };
    return (_jsx(NativeListRow, { ...itemProps, disabled: disabled, nativeHaptics: itemProps.nativeHaptics ?? true, onPress: () => switchProps.onCheckedChange?.(!checked), pressResetToken: isIos ? pressResetToken : undefined, iconAfter: _jsx(View, { style: styles.trailingControl, children: _jsx(Switch, { ...switchProps, native: true, onPress: (event) => {
                    switchProps.onPress?.(event);
                    event.stopPropagation();
                    resetRowPress();
                }, ...(isIos
                    ? {
                        onCheckedChange: (nextChecked) => {
                            switchProps.onCheckedChange?.(nextChecked);
                            resetRowPress();
                        },
                        onPressOut: (event) => {
                            switchProps.onPressOut?.(event);
                            resetRowPress();
                        },
                    }
                    : null) }) }) }));
}
export function NativeListButtonItem({ title, onPress, disabled, titleAlign = "center", btnTint, ...itemProps }) {
    const theme = useTheme();
    const defaultColor = theme.color10.val;
    const resolveColor = btnTint ?? defaultColor;
    return (_jsx(NativeListItem, { ...itemProps, btnTint: resolveColor, titleAlign: titleAlign, title: title, disabled: disabled, onPress: onPress }));
}
export function NativeListItem({ title, onPress, disabled, titleAlign, btnTint, ...itemProps }) {
    return (_jsx(NativeListRow, { ...itemProps, btnTint: btnTint, titleAlign: titleAlign, titleColor: itemProps.titleColor ?? (typeof btnTint !== "boolean" ? btnTint : undefined), title: title, disabled: disabled, onPress: onPress }));
}
export function NativeListSelectItem({ selectProps, ...itemProps }) {
    const disabled = itemProps.disabled || selectProps.disabled || selectProps.isDisabled;
    const selectedLabel = getSelectedLabel(selectProps);
    const { defaultRowBackground } = useFallbackRowThemeColors();
    const normalRowBackground = itemProps.backgroundColor ?? defaultRowBackground;
    return (_jsx(Select, { ...selectProps, disabled: disabled, native: selectProps.native ?? !isWeb(), nativeHaptics: selectProps.nativeHaptics ?? itemProps.nativeHaptics ?? false, nativeDropdownAlign: selectProps.nativeDropdownAlign ?? "end", nativeDropdownEdgeOffset: selectProps.nativeDropdownEdgeOffset ?? -14, nativeTrigger: true, nativeTriggerContent: _jsx(NativeListRow, { ...itemProps, backgroundColor: itemProps.backgroundColor ?? (isWeb() ? "transparent" : undefined), disabled: disabled, iconAfter: _jsxs(View, { style: styles.selectValue, children: [_jsx(Text, { color: (itemProps.valueColor ?? "$color"), fontSize: itemProps.valueFontSize ?? "$4", numberOfLines: 1, opacity: itemProps.valueColor == null ? 0.58 : 1, children: selectedLabel }), _jsx(ChevronsUpDown, { color: "$color", opacity: 0.58, size: 14 })] }) }), viewportProps: {
            ...selectProps.viewportProps,
            style: [
                isWeb()
                    ? {
                        maxWidth: 360,
                        minWidth: 220,
                    }
                    : null,
                selectProps.viewportProps?.style,
            ],
        }, placement: selectProps.placement ?? (isWeb() ? "bottom-end" : undefined), triggerProps: {
            backgroundColor: isWeb() ? normalRowBackground : undefined,
            ...selectProps.triggerProps,
            hoverStyle: selectProps.triggerProps?.hoverStyle ??
                {
                    backgroundColor: itemProps.hoverBackgroundColor ?? "$color4",
                },
            pressStyle: selectProps.triggerProps?.pressStyle ??
                {
                    background: itemProps.pressBackgroundColor ?? "$color5",
                },
        } }));
}
export function NativeListCustomItem({ backgroundColor, children, disabled, hoverBackgroundColor, nativeHaptics, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, pressBackgroundColor, }) {
    return (_jsx(FallbackRowContainer, { backgroundColor: backgroundColor, disabled: disabled, hoverBackgroundColor: hoverBackgroundColor, nativeHaptics: nativeHaptics, onPress: onPress, paddingBottom: paddingBottom, paddingHorizontal: paddingHorizontal, paddingLeft: paddingLeft, paddingRight: paddingRight, paddingTop: paddingTop, paddingVertical: paddingVertical, pressBackgroundColor: pressBackgroundColor, children: _jsx(View, { style: styles.customRowContent, children: children }) }));
}
export function NativeListSection({ children, footer, title, titleColor, titleFontSize, }) {
    const entries = createFallbackListEntries(_jsx(NativeListSection, { footer: footer, title: title, titleColor: titleColor, titleFontSize: titleFontSize, children: children }));
    return _jsx(View, { style: styles.staticSection, children: renderStaticEntries(entries) });
}
export function NativeListRoot({ backgroundColor, children, contentContainerStyle, contentMarginBottom, contentMarginTop, fixesIOS26NestedScrollIndicatorSafeArea: _fixesIOS26NestedScrollIndicatorSafeArea, initialScrollTarget, native: _native, navigationBarScrollEdgeOptions, onRefresh, scrollable = true, style, tracksNavigationBarScrollEdge = false, ...rest }) {
    void _native;
    void _fixesIOS26NestedScrollIndicatorSafeArea;
    const { alwaysBounceVertical, automaticallyAdjustsScrollIndicatorInsets, contentInset, contentInsetAdjustmentBehavior, contentOffset, keyboardShouldPersistTaps, maintainVisibleContentPosition: _maintainVisibleContentPosition, nestedScrollEnabled, onScroll, scrollEventThrottle, scrollIndicatorInsets, showsVerticalScrollIndicator, ...scrollViewProps } = rest;
    void _maintainVisibleContentPosition;
    const headerHeight = useContext(HeaderHeightContext) ?? 0;
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const entries = useMemo(() => createFallbackListEntries(children), [children]);
    const initialScrollIndex = useMemo(() => getInitialScrollIndex(entries, initialScrollTarget), [entries, initialScrollTarget]);
    const { active: insideTrueSheet, automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied, } = useTrueSheetScrollLayout();
    const appBackgroundColors = useAppBackgroundColors();
    const trackedOnScroll = useNavigationBarScrollEdge({
        navigationBarScrollEdgeOptions,
        onScroll,
        tracksNavigationBarScrollEdge,
    });
    const resolvedScrollEventThrottle = scrollEventThrottle ?? (trackedOnScroll == null ? undefined : 16);
    const rootBackground = { backgroundColor: backgroundColor ?? appBackgroundColors.screen };
    const isNestedFallbackList = nestedScrollEnabled === true;
    const bottomPadding = insideTrueSheet && !isNestedFallbackList
        ? getTrueSheetScrollBottomPadding({
            insetAdjustment,
            nativeScrollInsetsApplied,
            safeAreaBottom: insets.bottom,
        })
        : undefined;
    const indicatorBottomInset = insideTrueSheet && !isNestedFallbackList && automaticallyAdjustsScrollIndicatorInsets !== false
        ? getTrueSheetScrollIndicatorBottomInset({
            automaticContentInsetAdjustment,
            nativeScrollInsetsApplied,
            safeAreaBottom: insets.bottom,
        })
        : undefined;
    const shouldUseManualHeaderSpacing = !insideTrueSheet &&
        !isNestedFallbackList &&
        os() === "ios" &&
        headerHeight > 0 &&
        contentInset == null &&
        contentInsetAdjustmentBehavior == null &&
        contentOffset == null;
    const manuallyAdjustNormalPageIndicator = os() === "ios" &&
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
    const contentTopPadding = contentMarginTop ?? (shouldUseManualHeaderSpacing ? headerHeight + 8 : undefined);
    const contentBottomPadding = bottomPadding != null ? bottomPadding + (contentMarginBottom ?? 0) : contentMarginBottom;
    const contentSpacingStyle = {
        ...(contentTopPadding != null ? { paddingTop: contentTopPadding } : null),
        ...(contentBottomPadding != null ? { paddingBottom: contentBottomPadding } : null),
    };
    const shouldUseTrueSheetScrollView = insideTrueSheet && os() === "android";
    const handleRefresh = onRefresh == null
        ? undefined
        : async () => {
            setRefreshing(true);
            try {
                await onRefresh();
            }
            finally {
                setRefreshing(false);
            }
        };
    if (shouldUseTrueSheetScrollView) {
        return (_jsx(ScrollView, { alwaysBounceVertical: alwaysBounceVertical, contentContainerStyle: [
                styles.rootContent,
                styles.scrollViewportFill,
                rootBackground,
                contentSpacingStyle,
                contentContainerStyle,
            ], keyboardShouldPersistTaps: keyboardShouldPersistTaps ?? "handled", nestedScrollEnabled: nestedScrollEnabled ?? true, onScroll: trackedOnScroll, scrollEnabled: scrollable, scrollEventThrottle: resolvedScrollEventThrottle, showsVerticalScrollIndicator: showsVerticalScrollIndicator ?? true, style: [styles.root, rootBackground, style], ...scrollViewProps, children: renderStaticEntries(entries) }));
    }
    return (_jsx(FlashList, { automaticallyAdjustsScrollIndicatorInsets: manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets, alwaysBounceVertical: alwaysBounceVertical ?? (!insideTrueSheet && os() === "ios"), contentInset: contentInset, contentContainerStyle: [
            insideTrueSheet ? styles.rootContent : styles.scrollRootContent,
            styles.scrollViewportFill,
            rootBackground,
            contentSpacingStyle,
            contentContainerStyle,
        ], contentInsetAdjustmentBehavior: resolvedContentInsetAdjustmentBehavior, contentOffset: contentOffset, data: entries, extraData: entries, getItemType: getEntryType, initialScrollIndex: initialScrollIndex, ItemSeparatorComponent: FallbackListItemSeparator, keyboardShouldPersistTaps: keyboardShouldPersistTaps ?? "handled", keyExtractor: getEntryKey, nestedScrollEnabled: nestedScrollEnabled ?? true, onRefresh: handleRefresh, onScroll: trackedOnScroll, refreshing: onRefresh != null ? refreshing : undefined, renderItem: renderFallbackListEntry, scrollEnabled: scrollable, scrollEventThrottle: scrollEventThrottle ?? 16, showsVerticalScrollIndicator: showsVerticalScrollIndicator ?? true, scrollIndicatorInsets: indicatorBottomInset != null
            ? {
                ...scrollIndicatorInsets,
                bottom: indicatorBottomInset,
            }
            : scrollIndicatorInsets, style: [styles.root, rootBackground, style], ...scrollViewProps }));
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
