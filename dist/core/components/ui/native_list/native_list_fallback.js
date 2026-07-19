import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HeaderHeightContext } from "@react-navigation/elements";
import { Check, ChevronRight, ChevronsUpDown } from "@tamagui/lucide-icons-2";
import { Children, isValidElement, useContext, useMemo, useState, } from "react";
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
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils";
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
function FallbackRowContainer({ backgroundColor, children, disabled, nativeHaptics, onPress, }) {
    const resolvedHaptics = useResolvedNativeHaptics(nativeHaptics);
    const { defaultRowBackground, theme } = useFallbackRowThemeColors();
    const [hovered, setHovered] = useState(false);
    // Read interactive colors while this component renders so Tamagui can track these
    // theme tokens. Reading them only inside Pressable's render callback can retain the
    // previous token values when "system" resolves to a different color scheme.
    const pressedRowBackground = theme.color4?.val ?? theme.backgroundPress?.val ?? theme.background?.val;
    const hoveredRowBackground = theme.color3?.val ?? theme.backgroundHover?.val ?? theme.background?.val;
    const getRowBackground = (pressed = false) => ({
        backgroundColor: pressed && !disabled
            ? pressedRowBackground
            : hovered && !disabled
                ? hoveredRowBackground
                : (backgroundColor ?? defaultRowBackground),
    });
    if (onPress == null) {
        return (_jsx(View, { style: [styles.rowContainer, getRowBackground(), disabled ? styles.disabledContent : null], children: children }));
    }
    return (_jsx(Pressable, { disabled: disabled, onHoverIn: () => setHovered(true), onHoverOut: () => setHovered(false), onPress: () => {
            onPress();
            triggerNativeHaptics(resolvedHaptics);
        }, style: styles.pressable, children: ({ pressed }) => (_jsx(View, { style: [
                styles.rowContainer,
                getRowBackground(pressed),
                disabled ? styles.disabledContent : null,
            ], children: children })) }));
}
function renderTitleNode(title, titleColor, textAlign) {
    if (title == null || typeof title === "boolean") {
        return null;
    }
    if (typeof title === "string" || typeof title === "number") {
        const titleStyle = {
            ...(titleColor ? { color: titleColor } : null),
            textAlign,
        };
        return (_jsx(SizableText, { numberOfLines: 1, size: "$true", style: titleStyle, children: title }));
    }
    return title;
}
function renderSubtitleNode(subtitle) {
    if (subtitle == null || typeof subtitle === "boolean") {
        return null;
    }
    if (typeof subtitle === "string" || typeof subtitle === "number") {
        return (_jsx(Text, { opacity: 0.6, fontSize: "$3", numberOfLines: 4, children: subtitle }));
    }
    return subtitle;
}
function renderValueNode(value) {
    if (value == null || typeof value === "boolean") {
        return null;
    }
    if (typeof value === "string" || typeof value === "number") {
        return (_jsx(Text, { color: "$color", fontSize: "$4", numberOfLines: 1, opacity: 0.58, children: value }));
    }
    return value;
}
function NativeListRow({ backgroundColor, chevron = false, disabled, iconAfter, nativeHaptics, onPress, selected = false, subtitle, title, titleAlign, titleColor, value, }) {
    const titleAlignment = titleAlign === "center" ? "center" : titleAlign === "right" ? "flex-end" : "flex-start";
    const textAlign = titleAlign === "center" ? "center" : titleAlign === "right" ? "right" : "left";
    const titleNode = renderTitleNode(title, titleColor, textAlign);
    const subtitleNode = renderSubtitleNode(subtitle);
    const valueNode = renderValueNode(value);
    return (_jsx(FallbackRowContainer, { backgroundColor: backgroundColor, disabled: disabled, nativeHaptics: nativeHaptics, onPress: onPress, children: _jsxs(View, { style: styles.rowContent, children: [_jsxs(View, { style: [styles.textColumn, { alignItems: titleAlignment }], children: [titleNode, subtitleNode] }), _jsxs(View, { style: styles.iconAfterRow, children: [valueNode, selected ? _jsx(Check, { color: "$accent10", size: 18 }) : null, iconAfter, chevron ? _jsx(ChevronRight, { color: "$color", opacity: 0.58, size: 18 }) : null] })] }) }));
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
            return (_jsx(View, { style: styles.sectionLabel, children: typeof item.title === "string" || typeof item.title === "number" ? (_jsx(Text, { color: "$color10", fontSize: "$3", children: item.title })) : (item.title) }));
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
    return (_jsx(NativeListRow, { ...itemProps, disabled: disabled, nativeHaptics: itemProps.nativeHaptics ?? true, onPress: () => switchProps.onCheckedChange?.(!checked), iconAfter: _jsx(View, { style: styles.trailingControl, children: _jsx(Switch, { ...switchProps, native: true, onPress: (event) => {
                    switchProps.onPress?.(event);
                    event.stopPropagation();
                } }) }) }));
}
export function NativeListButtonItem({ title, onPress, disabled, titleAlign = "center", btnTint, ...itemProps }) {
    const theme = useTheme();
    const defaultColor = theme.color10.val;
    const resolveColor = btnTint ?? defaultColor;
    return (_jsx(NativeListItem, { ...itemProps, btnTint: resolveColor, titleAlign: titleAlign, title: title, disabled: disabled, onPress: onPress }));
}
export function NativeListItem({ title, onPress, disabled, titleAlign, btnTint, ...itemProps }) {
    return (_jsx(NativeListRow, { ...itemProps, btnTint: btnTint, titleAlign: titleAlign, titleColor: typeof btnTint !== "boolean" ? btnTint : undefined, title: title, disabled: disabled, onPress: onPress }));
}
export function NativeListSelectItem({ selectProps, ...itemProps }) {
    const disabled = itemProps.disabled || selectProps.disabled || selectProps.isDisabled;
    const selectedLabel = getSelectedLabel(selectProps);
    const { defaultRowBackground } = useFallbackRowThemeColors();
    return (_jsx(Select, { ...selectProps, disabled: disabled, native: selectProps.native ?? !isWeb(), nativeHaptics: selectProps.nativeHaptics ?? itemProps.nativeHaptics ?? false, nativeDropdownAlign: selectProps.nativeDropdownAlign ?? "end", nativeDropdownEdgeOffset: selectProps.nativeDropdownEdgeOffset ?? -14, nativeTrigger: true, nativeTriggerContent: _jsx(NativeListRow, { ...itemProps, backgroundColor: isWeb() ? "transparent" : undefined, disabled: disabled, iconAfter: _jsxs(View, { style: styles.selectValue, children: [_jsx(Text, { color: "$color", fontSize: "$4", numberOfLines: 1, opacity: 0.58, children: selectedLabel }), _jsx(ChevronsUpDown, { color: "$color", opacity: 0.58, size: 14 })] }) }), viewportProps: {
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
            backgroundColor: isWeb() ? defaultRowBackground : undefined,
            ...selectProps.triggerProps,
            hoverStyle: selectProps.triggerProps?.hoverStyle ?? {
                backgroundColor: "$color3",
            },
            pressStyle: selectProps.triggerProps?.pressStyle ?? {
                background: "$color4",
            },
        } }));
}
export function NativeListCustomItem({ children, disabled, nativeHaptics, onPress, }) {
    return (_jsx(FallbackRowContainer, { disabled: disabled, nativeHaptics: nativeHaptics, onPress: onPress, children: _jsx(View, { style: styles.customRowContent, children: children }) }));
}
export function NativeListSection({ children, footer, title }) {
    const entries = createFallbackListEntries(_jsx(NativeListSection, { footer: footer, title: title, children: children }));
    return _jsx(View, { style: styles.staticSection, children: renderStaticEntries(entries) });
}
export function NativeListRoot({ backgroundColor, children, contentContainerStyle, contentMarginBottom, contentMarginTop, initialScrollTarget, native: _native, scrollable = true, style, tracksNavigationBarScrollEdge: _tracksNavigationBarScrollEdge, ...rest }) {
    void _native;
    void _tracksNavigationBarScrollEdge;
    const { alwaysBounceVertical, automaticallyAdjustsScrollIndicatorInsets, contentInset, contentInsetAdjustmentBehavior, contentOffset, keyboardShouldPersistTaps, maintainVisibleContentPosition: _maintainVisibleContentPosition, nestedScrollEnabled, scrollIndicatorInsets, showsVerticalScrollIndicator, ...scrollViewProps } = rest;
    void _maintainVisibleContentPosition;
    const headerHeight = useContext(HeaderHeightContext) ?? 0;
    const insets = useSafeAreaInsets();
    const entries = useMemo(() => createFallbackListEntries(children), [children]);
    const initialScrollIndex = useMemo(() => getInitialScrollIndex(entries, initialScrollTarget), [entries, initialScrollTarget]);
    const { active: insideTrueSheet, automaticContentInsetAdjustment, insetAdjustment, nativeScrollInsetsApplied, } = useTrueSheetScrollLayout();
    const appBackgroundColors = useAppBackgroundColors();
    const rootBackground = { backgroundColor: backgroundColor ?? appBackgroundColors.screen };
    const bottomPadding = insideTrueSheet
        ? getTrueSheetScrollBottomPadding({
            insetAdjustment,
            nativeScrollInsetsApplied,
            safeAreaBottom: insets.bottom,
        })
        : undefined;
    const indicatorBottomInset = insideTrueSheet && automaticallyAdjustsScrollIndicatorInsets !== false
        ? getTrueSheetScrollIndicatorBottomInset({
            automaticContentInsetAdjustment,
            nativeScrollInsetsApplied,
            safeAreaBottom: insets.bottom,
        })
        : undefined;
    const shouldUseManualHeaderSpacing = !insideTrueSheet &&
        os() === "ios" &&
        headerHeight > 0 &&
        contentInset == null &&
        contentInsetAdjustmentBehavior == null &&
        contentOffset == null;
    const manuallyAdjustNormalPageIndicator = os() === "ios" && !insideTrueSheet && automaticallyAdjustsScrollIndicatorInsets == null;
    const contentTopPadding = contentMarginTop ?? (shouldUseManualHeaderSpacing ? headerHeight + 8 : undefined);
    const contentBottomPadding = bottomPadding != null ? bottomPadding + (contentMarginBottom ?? 0) : contentMarginBottom;
    const contentSpacingStyle = {
        ...(contentTopPadding != null ? { paddingTop: contentTopPadding } : null),
        ...(contentBottomPadding != null ? { paddingBottom: contentBottomPadding } : null),
    };
    const shouldUseTrueSheetScrollView = insideTrueSheet && os() === "android";
    if (shouldUseTrueSheetScrollView) {
        return (_jsx(ScrollView, { alwaysBounceVertical: alwaysBounceVertical, contentContainerStyle: [
                styles.rootContent,
                styles.scrollViewportFill,
                rootBackground,
                contentSpacingStyle,
                contentContainerStyle,
            ], keyboardShouldPersistTaps: keyboardShouldPersistTaps ?? "handled", nestedScrollEnabled: nestedScrollEnabled ?? true, scrollEnabled: scrollable, showsVerticalScrollIndicator: showsVerticalScrollIndicator ?? true, style: [styles.root, rootBackground, style], ...scrollViewProps, children: renderStaticEntries(entries) }));
    }
    return (_jsx(FlashList, { automaticallyAdjustsScrollIndicatorInsets: manuallyAdjustNormalPageIndicator ? false : automaticallyAdjustsScrollIndicatorInsets, alwaysBounceVertical: alwaysBounceVertical ?? (!insideTrueSheet && os() === "ios"), contentInset: contentInset, contentContainerStyle: [
            insideTrueSheet ? styles.rootContent : styles.scrollRootContent,
            styles.scrollViewportFill,
            rootBackground,
            contentSpacingStyle,
            contentContainerStyle,
        ], contentInsetAdjustmentBehavior: insideTrueSheet && os() === "ios"
            ? automaticContentInsetAdjustment
                ? "automatic"
                : "never"
            : shouldUseManualHeaderSpacing
                ? "never"
                : contentInsetAdjustmentBehavior, contentOffset: contentOffset, data: entries, extraData: entries, getItemType: getEntryType, initialScrollIndex: initialScrollIndex, ItemSeparatorComponent: FallbackListItemSeparator, keyboardShouldPersistTaps: keyboardShouldPersistTaps ?? "handled", keyExtractor: getEntryKey, nestedScrollEnabled: nestedScrollEnabled ?? true, renderItem: renderFallbackListEntry, scrollEnabled: scrollable, showsVerticalScrollIndicator: showsVerticalScrollIndicator ?? true, scrollIndicatorInsets: indicatorBottomInset != null
            ? {
                ...scrollIndicatorInsets,
                bottom: indicatorBottomInset,
            }
            : manuallyAdjustNormalPageIndicator
                ? {
                    ...scrollIndicatorInsets,
                    // 自动 inset 关闭后显式保留底部安全区，顶部维持 0。
                    bottom: scrollIndicatorInsets?.bottom ?? insets.bottom,
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
