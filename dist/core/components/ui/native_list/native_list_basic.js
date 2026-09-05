import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, CheckCircle2, ChevronRight, Circle } from "lucide-react-native";
import * as React from "react";
import { Children, Fragment, isValidElement, useState } from "react";
import { Platform, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { Input } from "../input";
import { ContextMenu } from "../context_menu";
import { Dropdown } from "../dropdown";
import { Select } from "../select";
import { resolveSelectItemGroups } from "../select/select_grouping";
import { Switch } from "../switch";
import { Text } from "../text";
import { Textarea } from "../textarea";
import { ScrollView } from "../scroll_view";
import { triggerNativeHaptics } from "../utils";
import { resolveRenderProp } from "../utils/render";
import { useAppBackgroundColors, useUiTheme } from "../utils/theme";
import { NativeListContextMenuProvider, useResolvedNativeListContextMenu, useResolvedNativeListDisabledStyle, } from "./context_menu";
import { NativeListHapticsProvider, useResolvedNativeListHaptics } from "./haptics";
import { useResolvedNativeListTriggerFontWeight } from "./native_trigger";
import { NATIVE_LIST_BASIC_DIVIDER_OPACITY, NATIVE_LIST_BASIC_DEFAULT_STYLE, NATIVE_LIST_BASIC_STYLE_DEFAULTS, NATIVE_LIST_DISABLED_OPACITY, NATIVE_LIST_EDIT_VALUE_OPACITY, NATIVE_LIST_ITEM_OPEN_OPACITY, NATIVE_LIST_ITEM_PRESS_OPACITY, NATIVE_LIST_BASIC_SECTION_TEXT_COLOR_TOKEN, NATIVE_LIST_BASIC_SECTION_TEXT_FONT_SIZE, NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN, NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY, } from "./constants";
import { NativeListEditModeProvider, useNativeListEditContext, useNativeListEditMode, useNativeListEditIcons, useNativeListEditRow, } from "./edit_mode";
import { useResolvedNativeListDisabled } from "./disabled";
const NativeListBasicStyleContext = React.createContext(NATIVE_LIST_BASIC_DEFAULT_STYLE);
const NativeListBasicBorderRadiusContext = React.createContext(undefined);
const NativeListBasicShowBorderContext = React.createContext(undefined);
const NativeListBasicBorderColorContext = React.createContext(undefined);
const NativeListBasicBorderWidthContext = React.createContext(undefined);
const NativeListBasicDividerColorContext = React.createContext(undefined);
const NativeListBasicRowBackgroundColorContext = React.createContext(undefined);
const NativeListBasicSectionShadowContext = React.createContext(undefined);
const NativeListBasicShowDividerContext = React.createContext(NATIVE_LIST_BASIC_STYLE_DEFAULTS.showDivider);
const NativeListBasicDividerWidthContext = React.createContext(NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerWidth);
const NativeListBasicDividerPaddingContext = React.createContext(NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerPaddingLeft);
const NativeListBasicDividerRightPaddingContext = React.createContext(NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerPaddingRight);
const NativeListBasicDividerPlacementContext = React.createContext("bottom");
function resolveBasicDividerColor(color) {
    const hex = color.trim().replace(/^#/, "");
    if (hex.length !== 6 || !/^[0-9a-f]+$/i.test(hex))
        return color;
    const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
    return `rgba(${channels.join(", ")}, ${NATIVE_LIST_BASIC_DIVIDER_OPACITY})`;
}
function useBasicDividerColor() {
    const theme = useUiTheme();
    const configuredColor = React.useContext(NativeListBasicDividerColorContext);
    return configuredColor ?? resolveBasicDividerColor(theme.mutedForeground);
}
function BasicRowDivider() {
    const showDivider = React.useContext(NativeListBasicShowDividerContext);
    const dividerWidth = React.useContext(NativeListBasicDividerWidthContext);
    const dividerPaddingLeft = React.useContext(NativeListBasicDividerPaddingContext);
    const dividerPaddingRight = React.useContext(NativeListBasicDividerRightPaddingContext);
    const dividerPlacement = React.useContext(NativeListBasicDividerPlacementContext);
    const dividerColor = useBasicDividerColor();
    if (!showDivider || dividerWidth <= 0 || dividerPlacement === "none")
        return null;
    return (_jsx(View, { pointerEvents: "none", style: [
            styles.rowDivider,
            {
                // A zero-height border is not consistently rasterized by UIKit when
                // the row is hosted by an iOS ContextMenu. Give the separator an
                // explicit frame so it remains part of the native view hierarchy.
                backgroundColor: dividerColor,
                height: dividerWidth,
                left: dividerPaddingLeft,
                right: dividerPaddingRight,
                ...(dividerPlacement === "top" ? { top: 0 } : { bottom: 0 }),
            },
        ] }));
}
function RowText({ children, color, fontSize, numberOfLines, style, }) {
    if (children == null)
        return null;
    if (isValidElement(children)) {
        return _jsx(View, { style: [{ color, fontSize }, style], children: normalizeRowTextChildren(children) });
    }
    if (Array.isArray(children)) {
        return _jsx(View, { style: [{ color, fontSize }, style], children: normalizeRowTextChildren(children) });
    }
    return (_jsx(Text, { numberOfLines: numberOfLines, style: [{ color, fontSize }, style], children: children }));
}
function normalizeRowTextChildren(children) {
    return Children.map(children, (child) => {
        if (child == null || typeof child === "boolean")
            return null;
        if (typeof child === "string" || typeof child === "number") {
            return _jsx(Text, { children: child }, `row-text-${String(child)}`);
        }
        if (isValidElement(child) && child.type === Fragment) {
            return normalizeRowTextChildren(child.props.children);
        }
        return child;
    });
}
function resolveBasicTriggerLabel(value, title) {
    const candidate = value ?? title;
    return typeof candidate === "string" || typeof candidate === "number"
        ? String(candidate)
        : "更多";
}
function resolveBasicSelectTriggerLabel(selectProps) {
    const groups = resolveSelectItemGroups({
        itemGroups: selectProps.itemGroups,
        items: selectProps.items,
        options: selectProps.options,
    });
    const selectedValue = selectProps.value ?? selectProps.defaultValue ?? undefined;
    const selectedItem = groups
        .flatMap((group) => group.items)
        .find((item) => item.value === selectedValue);
    const rendered = resolveRenderProp(selectProps.renderValue, {
        value: selectedValue,
        item: selectedItem,
    }) ??
        (selectedItem == null
            ? (selectProps.placeholder ?? "选择")
            : resolveRenderProp(selectedItem.label, {
                checked: true,
                disabled: Boolean(selectedItem.disabled ?? selectedItem.isDisabled),
                selected: true,
                value: selectedItem.value,
            }));
    const label = typeof rendered === "string" || typeof rendered === "number" ? (_jsx(Text, { children: rendered })) : (rendered);
    const content = selectedItem?.swatchColor == null ? (label) : (_jsxs(View, { style: styles.selectInlineLabel, children: [_jsx(View, { style: [styles.selectSwatch, { backgroundColor: selectedItem.swatchColor }] }), label] }));
    return _jsx(View, { style: { opacity: NATIVE_LIST_TRAILING_TRIGGER_OPACITY }, children: content });
}
export function NativeListRow({ children, chevron, contextMenuProps, disabled, disabledStyle, icon, nativeHaptics, nativeScrollId, onPress, selected, subtitle, subtitleColor, subtitleFontSize, title, titleAlign, titleColor, titleFontSize, trailing, value, valueColor, valueFontSize, valueOpacity = 1, rowMinHeight, titleNumberOfLines = 2, backgroundColor, hoverBackgroundColor, labelOpacity = 1, pressedOpacity = 1, suppressPressBackground = false, pressBackgroundColor, selectionDisabled, selectionId, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, cursorDefault = false, }) {
    const theme = useUiTheme();
    const defaultRowBackgroundColor = React.useContext(NativeListBasicRowBackgroundColorContext);
    const resolvedNativeHaptics = useResolvedNativeListHaptics(nativeHaptics);
    const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps, Boolean(disabled));
    const contextMenuRef = React.useRef(null);
    const resolvedDisabledStyle = useResolvedNativeListDisabledStyle(disabledStyle);
    const [hovered, setHovered] = useState(false);
    const edit = useNativeListEditRow({
        disabled,
        nativeScrollId,
        onPress,
        selectionDisabled,
        selectionId,
    });
    const editIcons = useNativeListEditIcons();
    const androidContextMenuEnabled = Platform.OS === "android" &&
        !edit.editMode &&
        resolvedContextMenuProps != null &&
        !resolvedContextMenuProps.triggerProps?.disabled;
    const resolvedTitleAlign = titleAlign ?? "left";
    const handlePress = () => {
        edit.onPress?.();
        if (edit.onPress != null)
            triggerNativeHaptics(resolvedNativeHaptics);
    };
    const row = (_jsxs(Pressable, { disabled: disabled || (edit.onPress == null && !androidContextMenuEnabled), className: Platform.OS === "web" && cursorDefault ? "cursor-default" : undefined, onHoverIn: () => setHovered(true), onHoverOut: () => setHovered(false), onPress: handlePress, onLongPress: androidContextMenuEnabled ? () => contextMenuRef.current?.presentMenu() : undefined, style: ({ pressed }) => [
            styles.row,
            {
                alignSelf: "stretch",
                backgroundColor: edit.editingSelected
                    ? theme.accent
                    : pressed && edit.onPress != null && !suppressPressBackground
                        ? (pressBackgroundColor ?? theme.accent)
                        : hovered && edit.onPress != null && !disabled
                            ? (hoverBackgroundColor ?? theme.muted)
                            : (backgroundColor ?? defaultRowBackgroundColor ?? theme.card),
                opacity: disabled && resolvedDisabledStyle
                    ? NATIVE_LIST_DISABLED_OPACITY
                    : pressed
                        ? pressedOpacity
                        : labelOpacity,
                width: "100%",
                minHeight: rowMinHeight ?? 56,
                paddingBottom: paddingBottom ?? paddingVertical ?? 8,
                paddingLeft: paddingLeft ?? paddingHorizontal ?? 16,
                paddingRight: paddingRight ?? paddingHorizontal ?? 16,
                paddingTop: paddingTop ?? paddingVertical ?? 8,
                ...(Platform.OS === "web" && cursorDefault ? { cursor: "default" } : {}),
            },
        ], children: [_jsxs(View, { pointerEvents: edit.editMode ? "none" : "auto", style: styles.rowContent, children: [edit.editMode && edit.selectionEnabled
                        ? edit.editingSelected
                            ? (editIcons.editModeSelectedIcon ?? _jsx(CheckCircle2, { color: theme.primary, size: 20 }))
                            : (editIcons.editModeIcon ?? _jsx(Circle, { color: theme.mutedForeground, size: 20 }))
                        : null, icon == null ? null : _jsx(View, { style: styles.icon, children: icon }), _jsxs(View, { style: styles.labels, children: [_jsx(RowText, { color: titleColor ?? theme.foreground, fontSize: titleFontSize ?? 16, numberOfLines: titleNumberOfLines, style: { textAlign: resolvedTitleAlign }, children: title }), _jsx(RowText, { color: subtitleColor ?? theme.mutedForeground, fontSize: subtitleFontSize ?? 13, numberOfLines: 3, children: subtitle }), normalizeRowTextChildren(children)] }), _jsx(RowText, { color: valueColor ?? theme.mutedForeground, fontSize: valueFontSize ?? 15, numberOfLines: 1, style: { opacity: valueOpacity }, children: value }), !edit.editMode && selected ? (_jsx(Check, { color: theme.primary, size: 18, strokeWidth: 2.5 })) : null, normalizeRowTextChildren(trailing), chevron ? _jsx(ChevronRight, { color: theme.mutedForeground, size: 18 }) : null] }), _jsx(BasicRowDivider, {})] }));
    if (edit.editMode || resolvedContextMenuProps == null)
        return row;
    if (Platform.OS === "android" && androidContextMenuEnabled) {
        return (_jsxs(View, { collapsable: false, style: styles.contextMenuRow, children: [row, _jsx(View, { pointerEvents: "none", style: styles.contextMenuAnchor, children: _jsx(ContextMenu, { ...resolvedContextMenuProps, ...(Platform.OS === "android" ? { anchorAlignment: "center" } : {}), trigger: _jsx(View, { collapsable: false, style: styles.contextMenuAnchorTrigger }), __menuRef: contextMenuRef }) })] }));
    }
    return (_jsx(ContextMenu, { ...resolvedContextMenuProps, trigger: row, triggerProps: Platform.OS === "ios"
            ? {
                ...resolvedContextMenuProps.triggerProps,
                style: [styles.contextMenuRow, resolvedContextMenuProps.triggerProps?.style],
            }
            : resolvedContextMenuProps.triggerProps }));
}
export function NativeListActionItem(props) {
    return _jsx(NativeListRow, { ...props });
}
export function NativeListNavigationItem(props) {
    return _jsx(NativeListRow, { ...props, chevron: props.chevron ?? true });
}
export function NativeListButtonItem(props) {
    return (_jsx(NativeListRow, { ...props, titleAlign: props.titleAlign ?? "center", titleColor: props.titleColor ?? (typeof props.btnTint === "string" ? props.btnTint : undefined) }));
}
export function NativeListItem(props) {
    return _jsx(NativeListRow, { ...props });
}
export function NativeListSwitchItem({ switchProps, ...itemProps }) {
    const editMode = useNativeListEditMode();
    const [uncontrolledChecked, setUncontrolledChecked] = useState(switchProps.defaultChecked ?? false);
    const checked = switchProps.checked ?? uncontrolledChecked;
    const disabled = itemProps.disabled || switchProps.disabled;
    const inheritedHaptics = useResolvedNativeListHaptics(itemProps.nativeHaptics ?? switchProps.nativeHaptics);
    const toggle = () => {
        if (disabled)
            return;
        const next = !checked;
        if (switchProps.checked == null)
            setUncontrolledChecked(next);
        switchProps.onCheckedChange?.(next);
    };
    return (_jsx(NativeListRow, { ...itemProps, disabled: disabled, nativeHaptics: inheritedHaptics ?? true, onPress: () => {
            itemProps.onPress?.();
            toggle();
        }, trailing: _jsx(Switch, { ...switchProps, checked: checked, disabled: disabled || editMode, nativeHaptics: inheritedHaptics ?? true, onCheckedChange: toggle }) }));
}
export function NativeListSelectItem({ selectProps, ...itemProps }) {
    const theme = useUiTheme();
    const selectRef = React.useRef(null);
    const [menuOpen, setMenuOpen] = useState(Boolean(selectProps.defaultOpen));
    const editMode = useNativeListEditMode();
    const inheritedHaptics = useResolvedNativeListHaptics(itemProps.nativeHaptics ?? selectProps.nativeHaptics);
    const triggerColor = itemProps.valueColor ??
        selectProps.nativeTriggerLabelProps?.color ??
        theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN];
    const triggerFontWeight = itemProps.nativeTriggerFontWeight ??
        selectProps.triggerFontWeight ??
        selectProps.nativeTriggerProps?.fontWeight ??
        useResolvedNativeListTriggerFontWeight();
    const openSelect = () => {
        if (itemProps.disabled || selectProps.disabled || selectProps.isDisabled)
            return;
        selectRef.current?.open();
    };
    if (editMode) {
        return (_jsx(NativeListRow, { ...itemProps, value: resolveBasicSelectTriggerLabel(selectProps), valueColor: (itemProps.valueColor ??
                selectProps.nativeTriggerLabelProps?.color ??
                theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN]), valueOpacity: NATIVE_LIST_EDIT_VALUE_OPACITY }));
    }
    return (_jsx(NativeListRow, { ...itemProps, cursorDefault: true, labelOpacity: menuOpen ? NATIVE_LIST_ITEM_OPEN_OPACITY : 1, nativeHaptics: false, pressedOpacity: NATIVE_LIST_ITEM_PRESS_OPACITY, suppressPressBackground: true, onPress: () => {
            itemProps.onPress?.();
            openSelect();
        }, value: undefined, trailing: _jsx(Select, { ref: selectRef, ...selectProps, nativeTrigger: true, nativeTriggerIcon: selectProps.nativeTriggerIcon ?? "chevrons-up-down", nativeHaptics: inheritedHaptics, nativeTriggerHoverBackground: false, nativeTriggerContainerStyle: [
                selectProps.nativeTriggerContainerStyle,
                { paddingHorizontal: 0 },
            ], nativeTriggerLabel: selectProps.nativeTriggerLabel, nativeTriggerLabelProps: {
                ...selectProps.nativeTriggerLabelProps,
                color: triggerColor,
                opacity: selectProps.nativeTriggerLabelProps?.opacity ?? NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
            }, triggerFontWeight: triggerFontWeight, nativeTriggerFeedbackOpacity: {
                disabled: NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
                press: NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
                webHover: NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
                webPress: NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
                ...selectProps.nativeTriggerFeedbackOpacity,
            }, nativeTriggerProps: {
                ...selectProps.nativeTriggerProps,
                fontWeight: triggerFontWeight,
                size: selectProps.nativeTriggerProps?.size ?? "md",
                iconColor: itemProps.valueColor ??
                    selectProps.nativeTriggerProps?.iconColor ??
                    theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
            }, onOpenWillChange: (nextOpen) => {
                setMenuOpen(nextOpen);
                selectProps.onOpenWillChange?.(nextOpen);
            }, onOpenChange: (nextOpen) => {
                setMenuOpen(nextOpen);
                selectProps.onOpenChange?.(nextOpen);
            } }) }));
}
export function NativeListDropdownItem({ dropdownProps, ...itemProps }) {
    const theme = useUiTheme();
    const inheritedHaptics = useResolvedNativeListHaptics(itemProps.nativeHaptics ?? dropdownProps.nativeHaptics);
    const menuRef = React.useRef(null);
    const presentingMenuRef = React.useRef(false);
    const [uncontrolledWillOpen, setUncontrolledWillOpen] = useState(Boolean(dropdownProps.defaultOpen));
    const menuOpen = dropdownProps.open ?? uncontrolledWillOpen;
    const editMode = useNativeListEditMode();
    const fadeTitleOnOpen = itemProps.fadeTitleOnOpen !== false;
    const nativeTriggerLabelProps = {
        color: itemProps.valueColor ?? theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
        fontSize: itemProps.valueFontSize,
        numberOfLines: 1,
        opacity: NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
        style: [itemProps.valueColor != null ? { color: itemProps.valueColor } : undefined],
    };
    const triggerFontWeight = itemProps.nativeTriggerFontWeight ??
        dropdownProps.nativeTriggerProps?.fontWeight ??
        useResolvedNativeListTriggerFontWeight();
    const handleMenuOpenWillChange = (nextOpen) => {
        if (dropdownProps.open === undefined) {
            setUncontrolledWillOpen(nextOpen);
        }
        presentingMenuRef.current = nextOpen;
        dropdownProps.onOpenWillChange?.(nextOpen);
    };
    if (editMode) {
        return (_jsx(NativeListRow, { ...itemProps, value: resolveBasicTriggerLabel(itemProps.value, itemProps.title), valueColor: itemProps.valueColor ?? theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN], valueOpacity: NATIVE_LIST_EDIT_VALUE_OPACITY }));
    }
    return (_jsx(NativeListRow, { ...itemProps, cursorDefault: true, nativeHaptics: false, labelOpacity: fadeTitleOnOpen && menuOpen ? NATIVE_LIST_ITEM_OPEN_OPACITY : 1, onPress: () => {
            if (itemProps.disabled ||
                dropdownProps.disabled ||
                dropdownProps.triggerProps?.disabled ||
                menuOpen ||
                presentingMenuRef.current) {
                return;
            }
            itemProps.onPress?.();
            // 不等待弹层完成回调，整行直接进入与 trigger 相同的打开态。
            if (fadeTitleOnOpen && dropdownProps.open === undefined) {
                setUncontrolledWillOpen(true);
            }
            presentingMenuRef.current = true;
            menuRef.current?.presentMenu();
        }, pressedOpacity: NATIVE_LIST_ITEM_PRESS_OPACITY, suppressPressBackground: true, value: undefined, trailing: _jsx(View, { style: { alignItems: "center", alignSelf: "stretch", justifyContent: "center" }, children: _jsx(Dropdown, { ...dropdownProps, 
                // 行本身也是触发器；使用同一个受控状态，保证点击整行和点击右侧
                // trigger 时在 Web 与 Android 上都能打开菜单。
                open: dropdownProps.open ?? menuOpen, __menuRef: menuRef, nativeHaptics: inheritedHaptics, nativeTrigger: true, nativeTriggerIcon: "chevrons-up-down", nativeTriggerContainerStyle: { paddingHorizontal: 0 }, nativeTriggerLabelProps: nativeTriggerLabelProps, nativeTriggerProps: {
                    ...dropdownProps.nativeTriggerProps,
                    fontWeight: triggerFontWeight,
                    size: dropdownProps.nativeTriggerProps?.size ?? "md",
                    iconColor: itemProps.valueColor ??
                        dropdownProps.nativeTriggerProps?.iconColor ??
                        theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN],
                }, nativeTriggerHoverBackground: false, nativeTriggerFeedbackOpacity: {
                    disabled: NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY,
                    press: NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY,
                    webHover: NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY,
                    webPress: NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY,
                    ...dropdownProps.nativeTriggerFeedbackOpacity,
                }, onOpenWillChange: handleMenuOpenWillChange, onOpenChange: (nextOpen) => {
                    if (dropdownProps.open === undefined) {
                        setUncontrolledWillOpen(nextOpen);
                    }
                    presentingMenuRef.current = nextOpen;
                    dropdownProps.onOpenChange?.(nextOpen);
                }, triggerLabel: resolveBasicTriggerLabel(itemProps.value, itemProps.title), triggerProps: {
                    ...dropdownProps.triggerProps,
                    disabled: itemProps.disabled ?? dropdownProps.triggerProps?.disabled,
                } }) }) }));
}
export function NativeListInputItem({ inputProps, inputWidth, ...itemProps }) {
    const disabled = itemProps.disabled || inputProps.disabled;
    const hasLeadingLabel = itemProps.title != null || itemProps.subtitle != null;
    const editMode = useNativeListEditMode();
    const resolvedInput = (_jsx(Input, { ...inputProps, disabled: disabled || editMode, unstyled: true, style: [
            {
                fontSize: 17,
                height: 44,
                minHeight: 44,
                paddingVertical: 0,
                width: hasLeadingLabel ? (inputWidth ?? 160) : "100%",
            },
            inputProps.style,
        ] }));
    if (!hasLeadingLabel) {
        return (_jsx(NativeListCustomItem, { ...itemProps, disabled: disabled, paddingVertical: itemProps.paddingVertical ?? 0, children: _jsx(View, { style: {
                    alignItems: "center",
                    flex: 1,
                    height: 56,
                    justifyContent: "center",
                    minWidth: 0,
                    width: editMode ? undefined : "100%",
                }, children: resolvedInput }) }));
    }
    return (_jsx(NativeListRow, { ...itemProps, disabled: disabled, trailing: _jsx(View, { style: { width: inputWidth ?? 160 }, children: resolvedInput }) }));
}
export function NativeListTextAreaItem({ textAreaProps, ...itemProps }) {
    const editMode = useNativeListEditMode();
    const disabled = itemProps.disabled || textAreaProps.disabled;
    const editingValue = textAreaProps.value ?? textAreaProps.defaultValue ?? textAreaProps.placeholder ?? "";
    if (editMode) {
        return _jsx(NativeListRow, { ...itemProps, disabled: disabled, title: editingValue });
    }
    return (_jsx(NativeListCustomItem, { ...itemProps, disabled: disabled, children: _jsx(Textarea, { ...textAreaProps, unstyled: true, style: [{ width: "100%" }, textAreaProps.style] }) }));
}
export function NativeListCustomItem({ backgroundColor, children, contextMenuProps, disabled, disabledStyle, hoverBackgroundColor, nativeHaptics, nativeScrollId, onPress, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, pressBackgroundColor, selectionId, selectionDisabled, }) {
    const theme = useUiTheme();
    const defaultRowBackgroundColor = React.useContext(NativeListBasicRowBackgroundColorContext);
    const resolvedNativeHaptics = useResolvedNativeListHaptics(nativeHaptics);
    const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps, Boolean(disabled));
    const contextMenuRef = React.useRef(null);
    const resolvedDisabledStyle = useResolvedNativeListDisabledStyle(disabledStyle);
    const [hovered, setHovered] = useState(false);
    const edit = useNativeListEditRow({
        disabled,
        nativeScrollId,
        onPress,
        selectionDisabled,
        selectionId,
    });
    const editIcons = useNativeListEditIcons();
    const androidContextMenuEnabled = Platform.OS === "android" &&
        !edit.editMode &&
        resolvedContextMenuProps != null &&
        !resolvedContextMenuProps.triggerProps?.disabled;
    const row = (_jsxs(Pressable, { disabled: disabled || (edit.onPress == null && !androidContextMenuEnabled), onHoverIn: () => setHovered(true), onHoverOut: () => setHovered(false), onPress: () => {
            edit.onPress?.();
            if (edit.onPress != null)
                triggerNativeHaptics(resolvedNativeHaptics);
        }, onLongPress: androidContextMenuEnabled ? () => contextMenuRef.current?.presentMenu() : undefined, style: ({ pressed }) => [
            {
                alignSelf: "stretch",
                backgroundColor: edit.editingSelected
                    ? theme.accent
                    : pressed
                        ? (pressBackgroundColor ?? theme.accent)
                        : hovered && !disabled
                            ? (hoverBackgroundColor ?? theme.muted)
                            : (backgroundColor ?? defaultRowBackgroundColor ?? theme.card),
                opacity: disabled && resolvedDisabledStyle ? NATIVE_LIST_DISABLED_OPACITY : 1,
                width: "100%",
                position: "relative",
                paddingBottom: paddingBottom ?? paddingVertical ?? 12,
                paddingLeft: paddingLeft ?? paddingHorizontal ?? 16,
                paddingRight: paddingRight ?? paddingHorizontal ?? 16,
                paddingTop: paddingTop ?? paddingVertical ?? 12,
            },
        ], children: [_jsxs(View, { pointerEvents: edit.editMode ? "none" : "auto", style: styles.customRowContent, children: [edit.editMode && edit.selectionEnabled
                        ? edit.editingSelected
                            ? (editIcons.editModeSelectedIcon ?? _jsx(CheckCircle2, { color: theme.primary, size: 20 }))
                            : (editIcons.editModeIcon ?? _jsx(Circle, { color: theme.mutedForeground, size: 20 }))
                        : null, normalizeRowTextChildren(children)] }), _jsx(BasicRowDivider, {})] }));
    if (edit.editMode || resolvedContextMenuProps == null)
        return row;
    if (Platform.OS === "android" && androidContextMenuEnabled) {
        return (_jsxs(View, { collapsable: false, style: styles.contextMenuRow, children: [row, _jsx(View, { pointerEvents: "none", style: styles.contextMenuAnchor, children: _jsx(ContextMenu, { ...resolvedContextMenuProps, ...(Platform.OS === "android" ? { anchorAlignment: "center" } : {}), trigger: _jsx(View, { collapsable: false, style: styles.contextMenuAnchorTrigger }), __menuRef: contextMenuRef }) })] }));
    }
    return (_jsx(ContextMenu, { ...resolvedContextMenuProps, trigger: row, triggerProps: Platform.OS === "ios"
            ? {
                ...resolvedContextMenuProps.triggerProps,
                style: [styles.contextMenuRow, resolvedContextMenuProps.triggerProps?.style],
            }
            : resolvedContextMenuProps.triggerProps }));
}
export function NativeListSection({ children, contextMenuProps, disabledStyle, footer, nativeHaptics, title, titleColor, titleFontSize, trailing, }) {
    const theme = useUiTheme();
    const listStyle = React.useContext(NativeListBasicStyleContext);
    const borderRadius = React.useContext(NativeListBasicBorderRadiusContext);
    const sectionShadow = React.useContext(NativeListBasicSectionShadowContext);
    const showBorder = React.useContext(NativeListBasicShowBorderContext) ?? false;
    const borderColor = React.useContext(NativeListBasicBorderColorContext) ?? theme.border;
    const borderWidth = React.useContext(NativeListBasicBorderWidthContext) ??
        NATIVE_LIST_BASIC_STYLE_DEFAULTS.borderWidth;
    const sectionRadius = borderRadius ?? (listStyle === "rounded" ? NATIVE_LIST_BASIC_STYLE_DEFAULTS.borderRadius : 0);
    const sectionShadowStyle = sectionShadow === true
        ? styles.sectionShadowDefault
        : sectionShadow === false || sectionShadow == null
            ? undefined
            : sectionShadow;
    const editMode = useNativeListEditMode();
    const editContext = useNativeListEditContext();
    const resolvedDisabled = useResolvedNativeListDisabled();
    const resolvedContextMenuProps = useResolvedNativeListContextMenu(contextMenuProps);
    const resolvedDisabledStyle = useResolvedNativeListDisabledStyle(disabledStyle);
    const resolvedNativeHaptics = useResolvedNativeListHaptics(nativeHaptics);
    const sectionTextColor = titleColor ?? theme[NATIVE_LIST_BASIC_SECTION_TEXT_COLOR_TOKEN];
    const sectionTextFontSize = titleFontSize ?? NATIVE_LIST_BASIC_SECTION_TEXT_FONT_SIZE;
    const renderContext = {
        contextMenuProps: resolvedContextMenuProps,
        disabled: resolvedDisabled,
        disabledStyle: resolvedDisabledStyle,
        editMode,
        isSelected: editContext.isSelected,
        nativeHaptics: resolvedNativeHaptics,
        nativeSelectionEnabled: editContext.nativeSelectionEnabled,
        toggleSelection: editContext.toggleSelection,
    };
    return (_jsxs(View, { style: [styles.section, listStyle === "plainFullWidth" && styles.sectionFullWidth], children: [title == null && trailing == null ? null : (_jsxs(View, { style: styles.sectionHeader, children: [_jsx(RowText, { color: sectionTextColor, fontSize: sectionTextFontSize, children: resolveRenderProp(title, renderContext) }), normalizeRowTextChildren(resolveRenderProp(trailing, renderContext))] })), _jsx(NativeListContextMenuProvider, { contextMenuProps: contextMenuProps, disabledStyle: disabledStyle, children: _jsx(NativeListHapticsProvider, { nativeHaptics: nativeHaptics, children: _jsx(View, { style: [styles.sectionShadow, { borderRadius: sectionRadius }, sectionShadowStyle], children: _jsx(View, { style: [
                                styles.sectionBody,
                                listStyle !== "rounded" && styles.sectionBodyPlain,
                                { borderRadius: sectionRadius },
                                showBorder && { borderWidth },
                                showBorder && { borderColor },
                            ], children: Children.toArray(children).map((child, index) => (_jsx(NativeListBasicDividerPlacementContext.Provider, { value: index === 0 ? "none" : "top", children: child }, `native-list-basic-child-${index}`))) }) }) }) }), footer == null ? null : (_jsx(View, { style: styles.sectionFooter, children: _jsx(RowText, { color: sectionTextColor, fontSize: sectionTextFontSize, children: resolveRenderProp(footer, renderContext) }) }))] }));
}
export function NativeListRoot({ children, contextMenuProps, contentContainerStyle, contentMarginBottom, contentMarginTop, defaultSelectedIds, disabledStyle, nativeHaptics, editMode, editModeIcon, editModeSelectedIcon, editModeSelectedSfSymbol, editModeSfSymbol, iosListStyle: _iosListStyle, iosPressFeedback: _iosPressFeedback, listStyle = NATIVE_LIST_BASIC_DEFAULT_STYLE, listStyleOptions, onRefresh, onSelectedIdsChange, refreshColor, refreshEnabledInEditMode: _refreshEnabledInEditMode, scrollable = true, selectedIds, style, ...scrollViewProps }) {
    void _iosListStyle;
    void _refreshEnabledInEditMode;
    const backgrounds = useAppBackgroundColors();
    const theme = useUiTheme();
    const { borderColor, borderWidth, borderRadius, dividerColor, dividerPaddingLeft, dividerPaddingRight, dividerWidth, rowBackgroundColor, sectionShadow = NATIVE_LIST_BASIC_STYLE_DEFAULTS.sectionShadow, showBorder, showDivider = NATIVE_LIST_BASIC_STYLE_DEFAULTS.showDivider, } = listStyleOptions ?? {};
    const resolvedShowBorder = showBorder ?? false;
    const [refreshing, setRefreshing] = useState(false);
    const content = (_jsx(NativeListBasicStyleContext.Provider, { value: listStyle, children: _jsx(NativeListBasicBorderRadiusContext.Provider, { value: borderRadius, children: _jsx(NativeListBasicShowBorderContext.Provider, { value: resolvedShowBorder, children: _jsx(NativeListBasicBorderColorContext.Provider, { value: borderColor, children: _jsx(NativeListBasicBorderWidthContext.Provider, { value: borderWidth, children: _jsx(NativeListBasicDividerColorContext.Provider, { value: dividerColor, children: _jsx(NativeListBasicRowBackgroundColorContext.Provider, { value: rowBackgroundColor, children: _jsx(NativeListBasicSectionShadowContext.Provider, { value: sectionShadow, children: _jsx(NativeListBasicShowDividerContext.Provider, { value: showDivider, children: _jsx(NativeListBasicDividerWidthContext.Provider, { value: dividerWidth ?? NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerWidth, children: _jsx(NativeListBasicDividerPaddingContext.Provider, { value: dividerPaddingLeft ??
                                                    NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerPaddingLeft, children: _jsx(NativeListBasicDividerRightPaddingContext.Provider, { value: dividerPaddingRight ??
                                                        NATIVE_LIST_BASIC_STYLE_DEFAULTS.dividerPaddingRight, children: _jsx(NativeListContextMenuProvider, { contextMenuProps: contextMenuProps, disabledStyle: disabledStyle, children: _jsx(NativeListHapticsProvider, { nativeHaptics: nativeHaptics, children: _jsx(NativeListEditModeProvider, { defaultSelectedIds: defaultSelectedIds, editMode: editMode, editModeIcon: editModeIcon, editModeSelectedIcon: editModeSelectedIcon, editModeSelectedSfSymbol: editModeSelectedSfSymbol, editModeSfSymbol: editModeSfSymbol, onSelectedIdsChange: onSelectedIdsChange, selectedIds: selectedIds, children: children }) }) }) }) }) }) }) }) }) }) }) }) }) }) }));
    if (!scrollable) {
        return (_jsx(View, { style: [
                styles.root,
                { backgroundColor: backgrounds.screen },
                style,
                contentMarginTop != null && { paddingTop: contentMarginTop },
                contentMarginBottom != null && { paddingBottom: contentMarginBottom },
            ], children: content }));
    }
    return (_jsx(ScrollView, { ...scrollViewProps, contentContainerStyle: [
            styles.content,
            contentContainerStyle,
            contentMarginTop != null && { paddingTop: contentMarginTop },
            contentMarginBottom != null && { paddingBottom: contentMarginBottom },
        ], refreshControl: onRefresh == null ? undefined : (_jsx(RefreshControl, { colors: [refreshColor ?? theme.primary], enabled: !editMode, onRefresh: () => {
                setRefreshing(true);
                Promise.resolve(onRefresh()).finally(() => setRefreshing(false));
            }, progressBackgroundColor: backgrounds.screen, refreshing: refreshing, tintColor: refreshColor ?? theme.primary })), style: [styles.root, { backgroundColor: backgrounds.screen }, style], children: content }));
}
export const NativeList = NativeListRoot;
const styles = StyleSheet.create({
    content: { paddingBottom: 24, paddingTop: 8 },
    customRowContent: {
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
        gap: 10,
        minHeight: 0,
        width: "100%",
    },
    contextMenuAnchor: {
        height: 1,
        left: "50%",
        position: "absolute",
        top: "50%",
        width: 1,
    },
    contextMenuAnchorTrigger: {
        height: 1,
        opacity: 0,
        width: 1,
    },
    contextMenuRow: {
        position: "relative",
        width: "100%",
    },
    icon: { alignItems: "center", justifyContent: "center", minWidth: 24 },
    labels: { flex: 1, gap: 2 },
    root: { flex: 1 },
    row: {
        alignSelf: "stretch",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        minHeight: 48,
        position: "relative",
        width: "100%",
    },
    rowDivider: { position: "absolute", zIndex: 1 },
    rowContent: {
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        gap: 10,
        minHeight: 0,
        width: "100%",
    },
    selectInlineLabel: { alignItems: "center", flexDirection: "row", gap: 8 },
    selectSwatch: { borderRadius: 7, height: 14, width: 14 },
    section: { gap: 6, marginBottom: 18, paddingHorizontal: 16 },
    sectionBody: {
        borderRadius: NATIVE_LIST_BASIC_STYLE_DEFAULTS.borderRadius,
        overflow: "hidden",
    },
    // Android's native ContextMenu/MenuView can be measured outside an
    // unbordered plain section. Clipping that section hides the whole row;
    // plain lists do not need clipping because they have no rounded corners.
    sectionBodyPlain: { borderRadius: 0, overflow: "visible" },
    sectionShadow: {},
    sectionShadowDefault: {
        elevation: 3,
        shadowColor: "#000000",
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
    },
    sectionFullWidth: { paddingHorizontal: 0 },
    sectionFooter: { paddingHorizontal: 12 },
    sectionHeader: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
    },
});
