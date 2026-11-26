import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Platform, View } from "react-native";
import { NativeListRow } from "../native_list_basic";
import { resolveSelectItemGroups } from "../../select/select_grouping";
import { NATIVE_LIST_EDIT_VALUE_OPACITY, NATIVE_LIST_ITEM_OPEN_OPACITY, NATIVE_LIST_ITEM_PRESS_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN, NATIVE_LIST_TRAILING_TRIGGER_DISABLED_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_HOVER_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_OPEN_OPACITY, NATIVE_LIST_TRAILING_TRIGGER_PRESS_OPACITY, } from "../constants";
import { useResolvedNativeListHaptics } from "../haptics";
import { useNativeListEditMode } from "../edit_mode";
import { useResolvedNativeListTriggerFontWeight } from "../native_trigger";
import { resolveRenderProp } from "../../utils/render";
import { Text } from "../../text";
import { Select } from "../../select";
import { useUiTheme } from "../../utils/theme";
import { triggerNativeHaptics } from "../../utils";
export function NativeListSelectItem(props) {
    const { nativeTriggerFontWeight, selectProps, ...itemProps } = props;
    const theme = useUiTheme();
    const selectRef = React.useRef(null);
    const openingSelectRef = React.useRef(false);
    // Zeego's iOS native trigger can let the parent row receive the same touch
    // after it has already started presenting the menu. Keep the marker through
    // the touch-end -> row onPress handoff, matching the legacy fallback path.
    const triggerInteractionRef = React.useRef(false);
    const triggerInteractionTimerRef = React.useRef(null);
    const clearTriggerInteractionTimer = React.useCallback(() => {
        if (triggerInteractionTimerRef.current != null) {
            clearTimeout(triggerInteractionTimerRef.current);
            triggerInteractionTimerRef.current = null;
        }
    }, []);
    React.useEffect(() => clearTriggerInteractionTimer, [clearTriggerInteractionTimer]);
    const beginTriggerInteraction = React.useCallback((_event) => {
        clearTriggerInteractionTimer();
        triggerInteractionRef.current = true;
    }, [clearTriggerInteractionTimer]);
    const finishTriggerInteraction = React.useCallback((_event) => {
        clearTriggerInteractionTimer();
        // Keep this marker until the parent Pressable has processed its queued
        // press event. A zero-delay reset is too early on iOS.
        triggerInteractionTimerRef.current = setTimeout(() => {
            triggerInteractionRef.current = false;
            triggerInteractionTimerRef.current = null;
        }, 750);
    }, [clearTriggerInteractionTimer]);
    const cancelTriggerInteraction = React.useCallback((_event) => {
        clearTriggerInteractionTimer();
        triggerInteractionRef.current = false;
    }, [clearTriggerInteractionTimer]);
    const consumeTriggerInteraction = React.useCallback(() => {
        if (!triggerInteractionRef.current)
            return false;
        cancelTriggerInteraction();
        return true;
    }, [cancelTriggerInteraction]);
    const usesIosNativeMenuTrigger = Platform.OS === "ios" && selectProps.native !== "wheel";
    const [menuOpen, setMenuOpen] = React.useState(Boolean(selectProps.defaultOpen));
    const editMode = useNativeListEditMode();
    const inheritedHaptics = useResolvedNativeListHaptics(itemProps.nativeHaptics ?? selectProps.nativeHaptics);
    const groups = resolveSelectItemGroups({
        itemGroups: selectProps.itemGroups,
        items: selectProps.items,
        options: selectProps.options,
    });
    const selectedValue = selectProps.value ?? selectProps.defaultValue;
    const selectedItem = groups
        .flatMap((group) => group.items)
        .find((item) => item.value === selectedValue);
    const rendered = resolveRenderProp(selectProps.renderValue, {
        value: selectedValue ?? undefined,
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
    const triggerLabel = selectedItem?.swatchColor == null ? (label) : (_jsxs(View, { className: "flex-row items-center gap-2", children: [_jsx(View, { className: "size-3.5 rounded-full", style: { backgroundColor: selectedItem.swatchColor } }), label] }));
    const triggerColor = itemProps.valueColor ??
        selectProps.nativeTriggerLabelProps?.color ??
        theme[NATIVE_LIST_TRAILING_TRIGGER_COLOR_TOKEN];
    const triggerFontWeight = nativeTriggerFontWeight ??
        selectProps.triggerFontWeight ??
        selectProps.nativeTriggerProps?.fontWeight ??
        useResolvedNativeListTriggerFontWeight();
    // Native dropdowns expose an early will-change callback. Use it as the
    // visual source so the later did-change callback cannot flash the row while
    // the iOS menu animation is finishing.
    const usesNativeDropdownWillChange = Platform.OS === "ios" &&
        (selectProps.native == null ||
            selectProps.native === true ||
            selectProps.native === "dropdown");
    // Only dropdown-like implementations keep the row in its open opacity.
    // Sheet, iOS wheel, and Android dialog have their own presentation feedback.
    // Unsupported modes intentionally follow the native=true fallback rules.
    const keepsOpenOpacity = selectProps.native !== "sheet" && !(selectProps.native === "wheel" && Platform.OS === "ios");
    if (editMode) {
        return (_jsx(NativeListRow, { ...itemProps, valueColor: triggerColor, value: _jsx(View, { style: { opacity: NATIVE_LIST_EDIT_VALUE_OPACITY }, children: typeof rendered === "string" || typeof rendered === "number" ? (_jsx(Text, { style: { color: triggerColor }, children: rendered })) : (triggerLabel) }), valueOpacity: 1 }));
    }
    return (_jsx(NativeListRow, { ...itemProps, cursorDefault: true, labelOpacity: keepsOpenOpacity && menuOpen ? NATIVE_LIST_ITEM_OPEN_OPACITY : 1, nativeHaptics: false, onPress: () => {
            if (usesIosNativeMenuTrigger && consumeTriggerInteraction())
                return;
            if (itemProps.disabled ||
                selectProps.disabled ||
                selectProps.isDisabled ||
                menuOpen ||
                openingSelectRef.current) {
                return;
            }
            itemProps.onPress?.();
            triggerNativeHaptics(inheritedHaptics);
            openingSelectRef.current = true;
            selectRef.current?.open();
        }, pressedOpacity: NATIVE_LIST_ITEM_PRESS_OPACITY, suppressPressBackground: true, value: undefined, trailing: _jsx(View, { collapsable: false, onTouchCancel: usesIosNativeMenuTrigger ? cancelTriggerInteraction : undefined, onTouchEnd: usesIosNativeMenuTrigger ? finishTriggerInteraction : undefined, onTouchStart: usesIosNativeMenuTrigger ? beginTriggerInteraction : undefined, children: _jsx(Select, { ref: selectRef, ...selectProps, nativeTrigger: true, nativeTriggerIcon: selectProps.nativeTriggerIcon ?? "chevrons-up-down", nativeHaptics: inheritedHaptics, nativeTriggerHoverBackground: false, nativeTriggerContainerStyle: [
                    selectProps.nativeTriggerContainerStyle,
                    { paddingHorizontal: 0 },
                ], 
                // 让 Select 自己生成 SelectedLabel，这样 labelProps（包括默认透明度、
                // fontSize 与 color）能真正传到内部 Text，而不是被 ReactNode 绕过。
                nativeTriggerLabel: selectProps.nativeTriggerLabel, nativeTriggerLabelProps: {
                    ...selectProps.nativeTriggerLabelProps,
                    color: triggerColor,
                    opacity: selectProps.nativeTriggerLabelProps?.opacity ??
                        NATIVE_LIST_TRAILING_TRIGGER_OPACITY,
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
                    openingSelectRef.current = nextOpen;
                    if (!nextOpen && Platform.OS === "ios") {
                        cancelTriggerInteraction();
                    }
                    selectProps.onOpenWillChange?.(nextOpen);
                }, onOpenChange: (nextOpen) => {
                    if (!usesNativeDropdownWillChange) {
                        setMenuOpen(nextOpen);
                    }
                    openingSelectRef.current = nextOpen;
                    selectProps.onOpenChange?.(nextOpen);
                } }) }) }));
}
