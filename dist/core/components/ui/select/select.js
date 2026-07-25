import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AdaptContext, AdaptPortalContents, useAdaptContext, useAdaptIsActive, } from "@tamagui/adapt";
import { Theme, isWeb as isTamaguiWeb, useThemeName } from "@tamagui/core";
import { Dismissable } from "@tamagui/dismissable";
import { FocusScope } from "@tamagui/focus-scope";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons-2";
import { Portal } from "@tamagui/portal";
import { RemoveScroll } from "@tamagui/remove-scroll";
import { ForwardSelectContext, SelectZIndexContext, useSelectContext, useSelectItemParentContext, } from "@tamagui/select";
import { forwardRef, useCallback, useRef } from "react";
import React from "react";
import { SizableText, Select as TamaguiSelect, XStack, YStack, getFontSize, } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { isWeb, os } from "../utils/platform";
import { Menu } from "../menu";
import { Sheet } from "../sheet";
import { NativeSheet, NativeSheetScrollContent } from "../sheet/native_sheet";
import { resolveAriaLabel, triggerNativeHaptics, useResolvedNativeHaptics, } from "../utils";
import { useAppBackgroundColors } from "../utils/theme";
import { NativePickerDialog, NativePickerSwiftUI } from "./native_picker";
import { NativeTriggerFace } from "./native_trigger";
import { resolveSelectItemGroups, } from "./select_grouping";
const DEFAULT_TOUCH_SHEET_VISIBLE_ITEM_COUNT = 6;
const DEFAULT_TOUCH_SHEET_ITEM_HEIGHT = 48;
const DEFAULT_TOUCH_SHEET_CHROME_HEIGHT = 88;
const DEFAULT_TOUCH_SHEET_LABEL_HEIGHT = 32;
const DEFAULT_TOUCH_SHEET_GROUP_GAP = 12;
const DEFAULT_IOS_NATIVE_LIST_CONTENT_MARGIN_TOP = 4;
const DEFAULT_IOS_NATIVE_LIST_CONTENT_MARGIN_BOTTOM = 0;
const DEFAULT_IOS_NATIVE_SHEET_SECTION_CHROME_HEIGHT = 8;
const DEFAULT_TOUCH_ITEM_CONTENT_STYLE = {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
};
const DEFAULT_SELECT_ITEM_CONTENT_STYLE = {
    ...DEFAULT_TOUCH_ITEM_CONTENT_STYLE,
    paddingHorizontal: 16,
    paddingLeft: 16,
    paddingRight: 16,
};
const TOUCH_SELECT_ITEM_CONTENT_STYLE = {
    ...DEFAULT_TOUCH_ITEM_CONTENT_STYLE,
    minHeight: DEFAULT_TOUCH_SHEET_ITEM_HEIGHT,
    paddingHorizontal: 24,
    paddingLeft: 24,
    paddingRight: 24,
};
const TOUCH_SHEET_SCROLL_CONTENT_STYLE = {
    paddingBottom: 28,
    paddingHorizontal: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    width: "100%",
};
const IOS_NATIVE_SHEET_SCROLL_CONTENT_STYLE = {
    paddingBottom: 0,
    paddingHorizontal: 4,
    paddingTop: 0,
    width: "100%",
};
const TOUCH_SHEET_GROUP_RADIUS = 24;
const TOUCH_SHEET_GROUP_BACKGROUND = "$color1";
const SHEET_GROUP_HOVER = "$color3";
const SHEET_GROUP_PRESS = "$color4";
const TOUCH_SHEET_SEPARATOR_COLOR = "$borderColor";
const SELECT_TRIGGER_HOVER_COLOR = "$color3";
const SELECT_TRIGGER_PRESS_COLOR = "$color4";
const DEFAULT_ANDROID_NATIVE_PICKER_MODE = "dropdown";
const DEFAULT_IOS_NATIVE_PICKER_MODE = "dropdown";
const DEFAULT_NATIVE = !isWeb();
const SelectAdaptHiddenContext = React.createContext(true);
const SelectWebSheetLayoutContext = React.createContext(false);
const SelectSheetControlContext = React.createContext(null);
function resolveSelectBehavior(native) {
    const resolvedNative = native ?? DEFAULT_NATIVE;
    if (isWeb()) {
        const shouldUseWebSheet = resolvedNative === "native-sheet" || resolvedNative === "custom-sheet";
        const shouldUseWebNativeSelect = !shouldUseWebSheet && resolvedNative !== false;
        return {
            shouldRenderNativeOptionText: shouldUseWebNativeSelect,
            shouldUseCustomSheet: shouldUseWebSheet,
            shouldUseNativePicker: resolvedNative === true,
            shouldUseNativeSheet: false,
            shouldUseWebSheet,
            tamaguiNative: shouldUseWebNativeSelect,
        };
    }
    const tameguiNative = resolvedNative === true || resolvedNative === false || resolvedNative === "native-sheet";
    return {
        shouldRenderNativeOptionText: false,
        shouldUseCustomSheet: resolvedNative === "custom-sheet",
        shouldUseNativePicker: resolvedNative === true,
        shouldUseNativeSheet: resolvedNative === false || resolvedNative === "native-sheet",
        shouldUseWebSheet: false,
        tamaguiNative: tameguiNative,
    };
}
const WEB_NATIVE_TRIGGER_SELECT_OVERLAY_STYLE = {
    bottom: 0,
    height: "100%",
    left: 0,
    opacity: 0,
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 1,
};
const WEB_MENU_CONTENT_Z_INDEX = 2_147_483_647;
const WEB_MENU_SCROLL_VIEW_MAX_HEIGHT = "min(360px, var(--tamagui-menu-content-available-height, 360px))";
const WEB_MENU_SCROLL_VIEW_STYLE = {
    display: "block",
    overflowX: "hidden",
    overflowY: "auto",
    overscrollBehavior: "contain",
    scrollbarWidth: "auto",
};
const WEB_MENU_BLOCKING_OVERLAY_STYLE = {
    background: "transparent",
    bottom: 0,
    cursor: "default",
    height: "100vh",
    left: 0,
    pointerEvents: "auto",
    position: "fixed",
    right: 0,
    top: 0,
    width: "100vw",
};
const DEFAULT_SELECT_TRIGGER_HOVER_STYLE = {
    backgroundColor: SELECT_TRIGGER_HOVER_COLOR,
};
const DEFAULT_SELECT_TRIGGER_PRESS_STYLE = {
    backgroundColor: SELECT_TRIGGER_PRESS_COLOR,
};
function renderSelectWebMenuTriggerLabel(label, isPlaceholder) {
    if (typeof label === "string" || typeof label === "number") {
        return (_jsx(SizableText, { color: "$color", opacity: isPlaceholder ? 0.58 : 1, pointerEvents: "none", children: label }));
    }
    return label;
}
function getWebMenuItemElement(rootId, itemValue) {
    if (typeof document === "undefined" || typeof HTMLElement === "undefined") {
        return null;
    }
    const roots = document.querySelectorAll("[data-rn-ui-kit-select-menu-root]");
    for (let rootIndex = 0; rootIndex < roots.length; rootIndex += 1) {
        const root = roots[rootIndex];
        if (!(root instanceof HTMLElement) || root.dataset.rnUiKitSelectMenuRoot !== rootId) {
            continue;
        }
        const itemElements = root.querySelectorAll("[data-rn-ui-kit-select-menu-item-value]");
        for (let itemIndex = 0; itemIndex < itemElements.length; itemIndex += 1) {
            const itemElement = itemElements[itemIndex];
            if (itemElement instanceof HTMLElement &&
                itemElement.dataset.rnUiKitSelectMenuItemValue === itemValue) {
                return itemElement;
            }
        }
    }
    return null;
}
function focusWebMenuItem(rootId, itemValue) {
    const element = getWebMenuItemElement(rootId, itemValue);
    if (element == null) {
        return;
    }
    element.scrollIntoView({ block: "nearest", inline: "nearest" });
    try {
        element.focus({ preventScroll: true });
    }
    catch {
        element.focus();
    }
}
function parsePercentSnapPoint(value) {
    if (typeof value !== "string") {
        return null;
    }
    const matched = value.trim().match(/^(\d+(?:\.\d+)?)%$/);
    if (matched == null) {
        return null;
    }
    const parsedValue = Number.parseFloat(matched[1]);
    if (!Number.isFinite(parsedValue)) {
        return null;
    }
    return Math.max(0, Math.min(100, parsedValue));
}
function resolveTouchSheetConfig({ groupCount, groupLabelCount, isNativeSheet, itemCount, touchSheetMaxHeight, }) {
    const totalItemCount = Math.max(itemCount, 1);
    const visibleItemCount = Math.min(totalItemCount, DEFAULT_TOUCH_SHEET_VISIBLE_ITEM_COUNT);
    const visibleGroupGapCount = Math.max(Math.min(groupCount, visibleItemCount) - 1, 0);
    const sectionChromeHeight = isNativeSheet
        ? groupCount * DEFAULT_IOS_NATIVE_SHEET_SECTION_CHROME_HEIGHT
        : 0;
    const visibleSectionChromeHeight = isNativeSheet
        ? Math.min(groupCount, visibleItemCount) * DEFAULT_IOS_NATIVE_SHEET_SECTION_CHROME_HEIGHT
        : 0;
    const nativeListMargins = isNativeSheet
        ? DEFAULT_IOS_NATIVE_LIST_CONTENT_MARGIN_TOP + DEFAULT_IOS_NATIVE_LIST_CONTENT_MARGIN_BOTTOM
        : 0;
    const estimatedVisibleContentHeight = visibleItemCount * DEFAULT_TOUCH_SHEET_ITEM_HEIGHT +
        visibleGroupGapCount * DEFAULT_TOUCH_SHEET_GROUP_GAP +
        groupLabelCount * DEFAULT_TOUCH_SHEET_LABEL_HEIGHT +
        visibleSectionChromeHeight +
        nativeListMargins;
    const estimatedContentHeight = totalItemCount * DEFAULT_TOUCH_SHEET_ITEM_HEIGHT +
        Math.max(groupCount - 1, 0) * DEFAULT_TOUCH_SHEET_GROUP_GAP +
        groupLabelCount * DEFAULT_TOUCH_SHEET_LABEL_HEIGHT +
        sectionChromeHeight +
        nativeListMargins;
    const estimatedVisibleHeight = estimatedVisibleContentHeight + DEFAULT_TOUCH_SHEET_CHROME_HEIGHT;
    const estimatedSheetContentHeight = estimatedContentHeight + DEFAULT_TOUCH_SHEET_CHROME_HEIGHT;
    if (typeof touchSheetMaxHeight === "number" && Number.isFinite(touchSheetMaxHeight)) {
        const snapPoint = Math.max(1, Math.round(touchSheetMaxHeight));
        return {
            shouldEnableScroll: estimatedSheetContentHeight > snapPoint,
            snapPoints: [snapPoint],
            snapPointsMode: "constant",
        };
    }
    const percentSnapPoint = parsePercentSnapPoint(touchSheetMaxHeight);
    if (percentSnapPoint != null) {
        return {
            shouldEnableScroll: estimatedSheetContentHeight > estimatedVisibleHeight,
            snapPoints: [percentSnapPoint],
            snapPointsMode: "percent",
        };
    }
    return {
        ...(touchSheetMaxHeight != null ? { frameMaxHeight: touchSheetMaxHeight } : null),
        shouldEnableScroll: estimatedSheetContentHeight > estimatedVisibleHeight,
        snapPoints: [estimatedVisibleHeight],
        snapPointsMode: "constant",
    };
}
function SelectAdaptContents(props) {
    return _jsx(TamaguiSelect.Adapt.Contents, { ...props });
}
function SelectAdaptRoot(props) {
    return _jsx(TamaguiSelect.Adapt, { ...props });
}
const SelectAdapt = Object.assign(SelectAdaptRoot, {
    Contents: SelectAdaptContents,
});
function SelectCustomSheet({ initialScrollY, sheetScrollRef, shouldUseTouchSheetLayout, touchSheetConfig, }) {
    return (_jsxs(Sheet, { modal: true, dismissOnSnapToBottom: true, snapPoints: touchSheetConfig.snapPoints, snapPointsMode: touchSheetConfig.snapPointsMode, transition: isWeb() ? "200ms" : undefined, transitionConfig: { type: "timing", duration: 150 }, children: [_jsx(SelectSheetFrame, { initialScrollY: initialScrollY, sheetScrollRef: sheetScrollRef, shouldUseTouchSheetLayout: shouldUseTouchSheetLayout, touchSheetConfig: touchSheetConfig }), _jsx(Sheet.Overlay, { bg: "$shadowColor", transition: "lazy", enterStyle: { opacity: 0 }, exitStyle: { opacity: 0 } })] }));
}
function SelectNativeSheet({ initialScrollY, sheetScrollRef, shouldUseTouchSheetLayout, touchSheetConfig, }) {
    const sheetControl = React.useContext(SelectSheetControlContext);
    const appBackgroundColors = useAppBackgroundColors();
    const platform = os();
    const nativeSheetBackgroundColor = platform === "android" ? appBackgroundColors.sheet : undefined;
    if (sheetControl == null) {
        return null;
    }
    return (_jsx(NativeSheet, { backgroundColor: nativeSheetBackgroundColor, content: _jsx(SelectNativeSheetFrame, { initialScrollY: initialScrollY, sheetScrollRef: sheetScrollRef, shouldUseTouchSheetLayout: shouldUseTouchSheetLayout, touchSheetConfig: touchSheetConfig }), modal: true, onAnimationComplete: sheetControl.onAnimationComplete, onOpenChange: sheetControl.onOpenChange, open: sheetControl.open, snapPoints: touchSheetConfig.snapPoints, snapPointsMode: touchSheetConfig.snapPointsMode }));
}
function SelectSheetFrame({ initialScrollY, sheetScrollRef, shouldUseTouchSheetLayout, touchSheetConfig, }) {
    const appBackgroundColors = useAppBackgroundColors();
    const shouldUseWebSheetLayout = isWeb() && shouldUseTouchSheetLayout;
    const shouldUseSheetScrollView = touchSheetConfig.shouldEnableScroll || shouldUseWebSheetLayout;
    const touchSheetFrameBackground = appBackgroundColors.sheet;
    const adaptContents = (_jsx(SelectWebSheetLayoutContext.Provider, { value: shouldUseWebSheetLayout, children: _jsx(SelectAdapt.Contents, {}) }));
    return (_jsxs(Sheet.Frame, { ...(touchSheetConfig.frameMaxHeight != null
            ? { maxHeight: touchSheetConfig.frameMaxHeight }
            : null), ...(shouldUseTouchSheetLayout
            ? {
                backgroundColor: touchSheetFrameBackground,
                borderTopLeftRadius: 36,
                borderTopRightRadius: 36,
                paddingTop: 12,
                overflow: "hidden",
            }
            : null), children: [shouldUseTouchSheetLayout && (_jsx(Sheet.Handle, { alignSelf: "center", backgroundColor: "$color8", borderRadius: 999, height: 5, marginBottom: 6, opacity: 0.65, onPress: () => { }, width: 92 })), shouldUseTouchSheetLayout ? (shouldUseSheetScrollView ? (_jsx(_Fragment, { children: _jsx(Sheet.ScrollView, { contentOffset: initialScrollY != null ? { x: 0, y: initialScrollY } : undefined, ref: sheetScrollRef, sheetDragDisabledScrollIndicatorWidth: shouldUseWebSheetLayout ? 0 : 44, showsVerticalScrollIndicator: true, contentContainerStyle: shouldUseWebSheetLayout ? { minHeight: "100%", width: "100%" } : undefined, style: shouldUseWebSheetLayout
                        ? {
                            background: "transparent",
                            backgroundColor: "transparent",
                            flex: 1,
                            minHeight: 0,
                            overflowY: "auto",
                            width: "100%",
                        }
                        : undefined, children: _jsx(YStack, { background: touchSheetFrameBackground, style: {
                            ...TOUCH_SHEET_SCROLL_CONTENT_STYLE,
                        }, children: adaptContents }) }) })) : (_jsx(YStack, { background: touchSheetFrameBackground, style: {
                    ...TOUCH_SHEET_SCROLL_CONTENT_STYLE,
                }, children: adaptContents }))) : (_jsx(Sheet.ScrollView, { children: adaptContents }))] }));
}
function SelectNativeSheetFrame({ initialScrollY, sheetScrollRef, shouldUseTouchSheetLayout, touchSheetConfig, }) {
    if (!shouldUseTouchSheetLayout) {
        return (_jsx(YStack, { style: IOS_NATIVE_SHEET_SCROLL_CONTENT_STYLE, children: _jsx(SelectAdapt.Contents, {}) }));
    }
    if (os() === "android") {
        return (_jsxs(YStack, { ...(touchSheetConfig.frameMaxHeight != null
                ? { maxHeight: touchSheetConfig.frameMaxHeight }
                : null), borderTopLeftRadius: 36, borderTopRightRadius: 36, style: { flex: 1, minHeight: 0, paddingTop: 12 }, children: [_jsx(YStack, { style: {
                        alignSelf: "center",
                        backgroundColor: "#8e8e93",
                        borderRadius: 999,
                        height: 5,
                        marginBottom: 6,
                        opacity: 0.65,
                        width: 92,
                    } }), _jsx(NativeSheetScrollContent, { ref: sheetScrollRef, contentOffset: initialScrollY != null ? { x: 0, y: initialScrollY } : undefined, contentContainerStyle: TOUCH_SHEET_SCROLL_CONTENT_STYLE, style: { flex: 1, minHeight: 0 }, children: _jsx(SelectAdapt.Contents, {}) })] }));
    }
    return (_jsxs(YStack, { ...(touchSheetConfig.frameMaxHeight != null
            ? { maxHeight: touchSheetConfig.frameMaxHeight }
            : null), borderTopLeftRadius: 36, borderTopRightRadius: 36, style: { flex: 1, minHeight: 0, paddingTop: 12 }, children: [_jsx(YStack, { style: {
                    alignSelf: "center",
                    backgroundColor: "#8e8e93",
                    borderRadius: 999,
                    height: 5,
                    marginBottom: 6,
                    opacity: 0.65,
                    width: 92,
                } }), _jsx(YStack, { style: { ...IOS_NATIVE_SHEET_SCROLL_CONTENT_STYLE, flex: 1, minHeight: 0 }, children: _jsx(SelectAdapt.Contents, {}) })] }));
}
function SelectSheetController(props) {
    const context = useSelectContext();
    const itemParentContext = useSelectItemParentContext();
    const isAdapted = useAdaptIsActive(context.adaptScope);
    const [isAdaptFullyHidden, setIsAdaptFullyHidden] = React.useState(!context.open);
    const hasScrolledRef = useRef(false);
    React.useEffect(() => {
        if (context.open) {
            setIsAdaptFullyHidden(false);
        }
        else {
            // Sheet 关闭时重置，下次打开可再次滚动。
            hasScrolledRef.current = false;
        }
    }, [context.open]);
    const handleSheetAnimationComplete = React.useCallback(({ open: sheetOpen }) => {
        if (!sheetOpen) {
            setIsAdaptFullyHidden(true);
            hasScrolledRef.current = false;
        }
        else if (!hasScrolledRef.current) {
            // 仅首次打开动画完成时滚动到选中项，松手回弹等重新显示不再触发。
            hasScrolledRef.current = true;
            if (props.shouldRunOpenAnimationComplete !== false) {
                props.onOpenAnimationComplete?.();
            }
        }
    }, [props.onOpenAnimationComplete, props.shouldRunOpenAnimationComplete]);
    const handleSheetOpenChange = React.useCallback((nextOpen) => {
        if (isAdapted) {
            itemParentContext.setOpen(nextOpen);
        }
    }, [isAdapted, itemParentContext]);
    return (_jsx(SelectSheetControlContext.Provider, { value: {
            onAnimationComplete: handleSheetAnimationComplete,
            onOpenChange: handleSheetOpenChange,
            open: context.open,
        }, children: _jsx(Sheet.Controller, { hidden: !isAdapted, onAnimationComplete: handleSheetAnimationComplete, onOpenChange: handleSheetOpenChange, open: context.open, children: _jsx(SelectAdaptHiddenContext.Provider, { value: isAdaptFullyHidden, children: props.children }) }) }));
}
function SelectContent(props) {
    const { children, scope, ...focusScopeProps } = props;
    const context = useSelectContext(scope);
    const itemParentContext = useSelectItemParentContext(scope);
    const zIndex = React.useContext(SelectZIndexContext);
    const isAdapted = useAdaptIsActive(context.adaptScope);
    const isAdaptFullyHidden = React.useContext(SelectAdaptHiddenContext);
    if (itemParentContext.shouldRenderWebNative) {
        return _jsx(_Fragment, { children: children });
    }
    if (isAdapted) {
        if (!context.open && isAdaptFullyHidden) {
            return null;
        }
        return _jsx(_Fragment, { children: children });
    }
    return (_jsx(Portal, { open: context.open, stackZIndex: 100_000, zIndex: zIndex, children: _jsx(RemoveScroll, { enabled: context.open && !context.disablePreventBodyScroll, children: _jsx(Dismissable, { asChild: true, forceUnmount: !context.open, onDismiss: () => itemParentContext.setOpen(false), onFocusOutside: (event) => event.preventDefault(), onPointerDownOutside: (event) => event.preventDefault(), children: _jsx(FocusScope, { ...focusScopeProps, enabled: !!context.open, trapped: true, onMountAutoFocus: (event) => {
                        event.preventDefault();
                    }, onUnmountAutoFocus: (event) => {
                        event.preventDefault();
                        const trigger = context.floatingContext?.refs?.reference?.current;
                        if (trigger instanceof HTMLElement) {
                            trigger.focus();
                        }
                    }, children: isTamaguiWeb ? _jsx("div", { style: { display: "contents" }, children: children }) : children }) }) }) }));
}
function SelectGroup(props) {
    return _jsx(TamaguiSelect.Group, { ...props });
}
function SelectIcon(props) {
    return _jsx(TamaguiSelect.Icon, { ...props });
}
function SelectItem(props) {
    return _jsx(TamaguiSelect.Item, { ...props });
}
function SelectItemIndicator(props) {
    return (_jsx(TamaguiSelect.ItemIndicator, { ...props, children: props.children ?? _jsx(Check, { size: 16 }) }));
}
function SelectItemText(props) {
    return _jsx(TamaguiSelect.ItemText, { ...props });
}
function SelectLabel(props) {
    return _jsx(TamaguiSelect.Label, { ...props });
}
function SelectScrollDownButton(props) {
    return (_jsxs(TamaguiSelect.ScrollDownButton, { ...props, children: [props.children ?? _jsx(ChevronDown, { size: 16 }), _jsx(LinearGradient, { start: [0, 0], end: [0, 1], fullscreen: true, colors: ["transparent", "$background"], rounded: "$4" })] }));
}
function SelectScrollUpButton(props) {
    return (_jsxs(TamaguiSelect.ScrollUpButton, { ...props, children: [props.children ?? _jsx(ChevronUp, { size: 16 }), _jsx(LinearGradient, { start: [0, 0], end: [0, 1], fullscreen: true, colors: ["$background", "transparent"], rounded: "$4" })] }));
}
function SelectTrigger(props) {
    const { hoverStyle, nativeHaptics, onPress, pressStyle, ...triggerProps } = props;
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const handlePress = (event) => {
        onPress?.(event);
        if (event.defaultPrevented) {
            return;
        }
        triggerNativeHaptics(resolvedNativeHaptics);
    };
    return (_jsx(TamaguiSelect.Trigger, { ...triggerProps, hoverStyle: hoverStyle ?? DEFAULT_SELECT_TRIGGER_HOVER_STYLE, onPress: handlePress, pressStyle: pressStyle ?? DEFAULT_SELECT_TRIGGER_PRESS_STYLE }));
}
function SelectValue(props) {
    return _jsx(TamaguiSelect.Value, { ...props });
}
function SelectViewport(props) {
    const { children, scope, unstyled, borderColor, borderWidth, outlineWidth, disableScroll, style, ...viewportProps } = props;
    const isWebSheetLayout = React.useContext(SelectWebSheetLayoutContext);
    const shouldUseHeadlessWebViewport = isWeb() && unstyled == null;
    const effectiveDisableScroll = disableScroll || isWebSheetLayout;
    const context = useSelectContext(scope);
    const itemParentContext = useSelectItemParentContext(scope);
    const adaptContext = useAdaptContext();
    const isAdapted = useAdaptIsActive(context.adaptScope);
    const isAdaptFullyHidden = React.useContext(SelectAdaptHiddenContext);
    const themeName = useThemeName();
    const viewportStyle = isWeb()
        ? [
            {
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                userSelect: "none",
            },
            isWebSheetLayout
                ? {
                    backgroundColor: "transparent",
                    boxSizing: "border-box",
                    maxWidth: "100%",
                    overflow: "visible",
                    width: "100%",
                }
                : null,
            style,
        ]
        : style;
    if (!isWeb() && isAdapted) {
        const shouldWrapPortalContents = style != null;
        const contents = (_jsx(Theme, { name: themeName, children: _jsx(ForwardSelectContext, { context: context, itemContext: itemParentContext, children: _jsx(AdaptContext.Provider, { ...adaptContext, children: shouldWrapPortalContents ? _jsx(YStack, { style: style, children: children }) : children }) }) }));
        if (!context.open && isAdaptFullyHidden) {
            if (context.lazyMount && context.renderValue) {
                return null;
            }
            return _jsx(YStack, { display: "none", children: contents });
        }
        return _jsx(AdaptPortalContents, { scope: context.adaptScope, children: contents });
    }
    return (_jsx(TamaguiSelect.Viewport, { ...viewportProps, background: isWebSheetLayout ? "transparent" : (viewportProps.background ?? "$background"), borderColor: isWebSheetLayout ? "transparent" : (borderColor ?? "$borderColor"), borderWidth: isWebSheetLayout ? 0 : (borderWidth ?? 1), disableScroll: effectiveDisableScroll, outlineWidth: isWebSheetLayout ? 0 : (outlineWidth ?? 0), rounded: isWebSheetLayout ? 0 : viewportProps.rounded, size: viewportProps.size ?? "$2", overflowX: isWeb() ? "hidden" : undefined, overflowY: effectiveDisableScroll ? undefined : "auto", style: viewportStyle, unstyled: shouldUseHeadlessWebViewport || isWebSheetLayout ? true : unstyled, children: children }));
}
function SelectIndicator(props) {
    return _jsx(TamaguiSelect.Indicator, { ...props });
}
function SelectFocusScope(props) {
    return _jsx(TamaguiSelect.FocusScope, { ...props });
}
function getNativeListModule() {
    return require("../native_list");
}
function IosNativeSheetSelectList({ initialScrollTarget, itemGroups, itemLabel, nativeHaptics, value, }) {
    const { NativeList, NativeListItem, NativeListSection } = getNativeListModule();
    const itemParentContext = useSelectItemParentContext();
    return (_jsx(NativeList, { native: true, scrollable: true, contentMarginBottom: DEFAULT_IOS_NATIVE_LIST_CONTENT_MARGIN_BOTTOM, contentMarginTop: DEFAULT_IOS_NATIVE_LIST_CONTENT_MARGIN_TOP, initialScrollTarget: initialScrollTarget, style: { flex: 1, minHeight: 0, width: "100%" }, children: itemGroups.map((group, groupIndex) => {
            const groupLabel = group.label ?? (groupIndex === 0 ? itemLabel : null);
            return (_jsx(NativeListSection, { title: groupLabel, children: group.items.map((item) => {
                    const disabled = item.disabled ?? item.isDisabled;
                    return (_jsx(NativeListItem, { chevron: false, disabled: disabled, nativeHaptics: nativeHaptics, nativeScrollId: item.value, onPress: disabled
                            ? undefined
                            : () => {
                                itemParentContext.onChange(item.value);
                                itemParentContext.setSelectedItem(item.label);
                                itemParentContext.setOpen(false);
                            }, selected: item.value === value, title: item.label }, item.value));
                }) }, group.key));
        }) }));
}
const selectAdaptWhen = isWeb() ? "md" : true;
const SelectRoot = forwardRef(({ "aria-label": ariaLabel, children, contentProps, disabled, isDisabled, itemIndicatorProps, itemGroups, itemProps, itemTextProps, items, itemLabel, itemLabelProps, nativeHaptics, nativeDropdownAlign, nativeDropdownAnchorWidth, nativeDropdownEdgeOffset, nativePickerMode, onOpenChange, onValueChange, options, placeholder, placement, touchSheetMaxHeight, triggerProps, viewportProps, webMenuArrow, native, nativeTrigger, nativeTriggerContainerStyle, nativeTriggerContent, nativeTriggerIcon, nativeTriggerLabelProps, ...props }, ref) => {
    void ref;
    const selectBehavior = resolveSelectBehavior(native);
    const platform = os();
    const [nativePickerVisible, setNativePickerVisible] = React.useState(false);
    const [webMenuValue, setWebMenuValue] = React.useState(typeof props.defaultValue === "string" ? props.defaultValue : undefined);
    const [webMenuOpen, setWebMenuOpen] = React.useState(Boolean(props.defaultOpen));
    const [webMenuTriggerWidth, setWebMenuTriggerWidth] = React.useState();
    const sheetScrollRef = useRef(null);
    const webMenuRootId = React.useId();
    const resolvedNativeHaptics = useResolvedNativeHaptics(nativeHaptics);
    const shouldUseTouchSheetLayout = !isWeb() || selectBehavior.shouldUseWebSheet;
    const resolvedPickerMode = nativePickerMode ??
        (platform === "android"
            ? DEFAULT_ANDROID_NATIVE_PICKER_MODE
            : DEFAULT_IOS_NATIVE_PICKER_MODE);
    const resolvedItemGroups = resolveSelectItemGroups({ itemGroups, items, options });
    const resolvedItems = resolvedItemGroups.flatMap((group) => group.items);
    const getGroupLabel = (group, groupIndex) => group.label ?? (groupIndex === 0 ? itemLabel : null);
    const groupLabelCount = resolvedItemGroups.filter((group, groupIndex) => getGroupLabel(group, groupIndex) != null).length;
    const shouldUseIosNativeSheetList = platform === "ios" && selectBehavior.shouldUseNativeSheet;
    const touchSheetConfig = resolveTouchSheetConfig({
        groupCount: resolvedItemGroups.length,
        groupLabelCount,
        isNativeSheet: shouldUseIosNativeSheetList,
        itemCount: resolvedItems.length,
        touchSheetMaxHeight,
    });
    const shouldRenderNativeOptionText = selectBehavior.shouldRenderNativeOptionText;
    const renderedItemGroups = shouldRenderNativeOptionText
        ? [{ key: "native", items: resolvedItems }]
        : resolvedItemGroups;
    const selectedValue = props.value !== undefined ? props.value : (webMenuValue ?? null);
    const getItemLabelByValue = (value) => resolvedItems.find((item) => item.value === value)?.label ?? null;
    const selectedItem = getItemLabelByValue(selectedValue);
    const triggerLabel = selectedItem ?? placeholder ?? "";
    const defaultAndroidDropdownAlign = platform === "android" && resolvedPickerMode === "dropdown" ? "center" : undefined;
    const resolvedNativeDropdownAlign = nativeDropdownAlign ?? defaultAndroidDropdownAlign;
    const shouldUseWebSheetItemHover = isWeb() && shouldUseTouchSheetLayout;
    const renderItem = (item) => (_createElement(SelectItem, { ...(shouldUseTouchSheetLayout
            ? {
                background: "transparent",
                borderRadius: 0,
                height: DEFAULT_TOUCH_SHEET_ITEM_HEIGHT,
                paddingHorizontal: 0,
                paddingVertical: 0,
            }
            : null), ...itemProps, "aria-label": resolveAriaLabel(item["aria-label"] ?? itemProps?.["aria-label"], item.label), disabled: item.disabled ?? item.isDisabled ?? itemProps?.disabled, index: item.index, key: item.value, textValue: item.label, value: item.value }, shouldRenderNativeOptionText ? (item.label) : (_jsxs(YStack, { background: shouldUseTouchSheetLayout ? TOUCH_SHEET_GROUP_BACKGROUND : undefined, backgroundColor: shouldUseTouchSheetLayout ? TOUCH_SHEET_GROUP_BACKGROUND : undefined, borderBottomColor: shouldUseTouchSheetLayout ? TOUCH_SHEET_SEPARATOR_COLOR : undefined, borderBottomWidth: shouldUseTouchSheetLayout && !item.isLastInGroup ? 1 : 0, hoverStyle: shouldUseWebSheetItemHover
            ? {
                background: SHEET_GROUP_HOVER,
            }
            : undefined, pressStyle: {
            background: SHEET_GROUP_PRESS,
            // @ts-expect-error backgroundColor
            backgroundColor: SHEET_GROUP_PRESS,
        }, style: shouldUseTouchSheetLayout
            ? TOUCH_SELECT_ITEM_CONTENT_STYLE
            : DEFAULT_SELECT_ITEM_CONTENT_STYLE, children: [item.startContent, _jsx(SelectItemText, { fontSize: shouldUseTouchSheetLayout ? "$4" : undefined, lineHeight: shouldUseTouchSheetLayout ? 22 : undefined, ...itemTextProps, children: item.label }), item.description, item.endContent, _jsx(SelectItemIndicator, { marginLeft: "auto", ...itemIndicatorProps, children: itemIndicatorProps?.children ??
                    (shouldUseTouchSheetLayout ? _jsx(Check, { size: 22 }) : undefined) })] }))));
    const renderGroup = (group, groupIndex) => {
        const label = getGroupLabel(group, groupIndex);
        const content = (_jsxs(SelectGroup, { children: [label && (_jsx(Select.Label, { fontWeight: "700", style: shouldUseTouchSheetLayout
                        ? { paddingHorizontal: 24, paddingVertical: 10 }
                        : undefined, ...itemLabelProps, children: label })), group.items.map(renderItem)] }));
        if (!shouldUseTouchSheetLayout) {
            return _jsx(React.Fragment, { children: content }, group.key);
        }
        return (_jsx(YStack, { background: TOUCH_SHEET_GROUP_BACKGROUND, style: {
                borderRadius: TOUCH_SHEET_GROUP_RADIUS,
                marginBottom: groupIndex === resolvedItemGroups.length - 1 ? 0 : DEFAULT_TOUCH_SHEET_GROUP_GAP,
                overflow: "hidden",
                width: "100%",
            }, children: content }, group.key));
    };
    /**
     * NativePickerDialog（隐藏渲染 + focus() 触发系统弹窗）仅在 Android 上可用。
     * wheel 为 iOS 专用模式，Android 上不走此路径。
     */
    const shouldRenderNativePicker = !isWeb() &&
        selectBehavior.shouldUseNativePicker &&
        resolvedPickerMode !== "wheel" &&
        platform === "android" &&
        !nativeTrigger;
    /**
     * iOS native 始终走平台 wrapper。
     * Android 在 nativeTrigger=true 时也走同一层 wrapper，自绘 trigger + 原生 picker 弹层。
     */
    const shouldRenderNativePlatformPicker = !isWeb() &&
        selectBehavior.shouldUseNativePicker &&
        (platform === "ios" || (platform === "android" && !!nativeTrigger));
    const handleTamaguiOpenChange = (nextOpen) => {
        if (shouldRenderNativePicker && nextOpen) {
            triggerNativeHaptics(resolvedNativeHaptics);
            setNativePickerVisible((prev) => {
                if (prev) {
                    requestAnimationFrame(() => setNativePickerVisible(true));
                    return false;
                }
                return true;
            });
            return;
        }
        onOpenChange?.(nextOpen);
        if (nextOpen)
            triggerNativeHaptics(resolvedNativeHaptics);
    };
    const handleTamaguiValueChange = (nextValue) => {
        if (props.value === undefined) {
            setWebMenuValue(nextValue ?? undefined);
        }
        onValueChange?.(nextValue ?? null);
        triggerNativeHaptics(resolvedNativeHaptics);
    };
    /** 打开 Sheet 时滚动到选中项位置。 */
    const getSelectedItemScrollY = useCallback(() => {
        if (!shouldUseTouchSheetLayout || resolvedItems.length === 0) {
            return null;
        }
        if (!shouldUseIosNativeSheetList && !touchSheetConfig.shouldEnableScroll) {
            return null;
        }
        const selectedValue = props.value ?? null;
        if (resolvedItems[0]?.value === selectedValue) {
            return null;
        }
        let accumY = null;
        let currentY = shouldUseIosNativeSheetList
            ? (IOS_NATIVE_SHEET_SCROLL_CONTENT_STYLE.paddingTop ?? 0)
            : (TOUCH_SHEET_SCROLL_CONTENT_STYLE.paddingTop ?? 0);
        for (const [groupIndex, group] of resolvedItemGroups.entries()) {
            const label = getGroupLabel(group, groupIndex);
            if (label != null)
                currentY += DEFAULT_TOUCH_SHEET_LABEL_HEIGHT;
            for (const item of group.items) {
                if (item.value === selectedValue) {
                    accumY = currentY;
                    break;
                }
                currentY += DEFAULT_TOUCH_SHEET_ITEM_HEIGHT;
            }
            if (accumY != null)
                break;
        }
        if (accumY == null || accumY <= 0) {
            return null;
        }
        return accumY;
    }, [
        shouldUseIosNativeSheetList,
        shouldUseTouchSheetLayout,
        touchSheetConfig.shouldEnableScroll,
        resolvedItems.length,
        resolvedItemGroups,
        props.value,
        getGroupLabel,
    ]);
    const scrollToSelectedItem = useCallback(() => {
        if (shouldUseIosNativeSheetList) {
            return;
        }
        if (!sheetScrollRef.current) {
            return;
        }
        const selectedScrollY = getSelectedItemScrollY();
        if (selectedScrollY == null) {
            return;
        }
        sheetScrollRef.current.scrollTo({ y: selectedScrollY, animated: false });
    }, [getSelectedItemScrollY, shouldUseIosNativeSheetList]);
    const initialScrollY = getSelectedItemScrollY();
    const selectedNativeListInitialScrollTarget = shouldUseIosNativeSheetList && props.value != null && resolvedItems[0]?.value !== props.value
        ? props.value
        : undefined;
    const resolvedSelectAdaptWhen = selectBehavior.shouldUseWebSheet ? true : selectAdaptWhen;
    const resolvedSelectAdaptPlatform = selectBehavior.shouldUseWebSheet ? "web" : "touch";
    const shouldUseNativeSheetCompactNativeTrigger = isWeb() &&
        selectBehavior.shouldUseWebSheet &&
        !!nativeTrigger &&
        nativeTriggerContent == null;
    const shouldRenderWebNativeTriggerSelect = isWeb() && selectBehavior.shouldUseNativePicker && children == null;
    const shouldRenderWebMenuSelect = isWeb() &&
        !selectBehavior.tamaguiNative &&
        !selectBehavior.shouldUseWebSheet &&
        children == null;
    const selectDisabled = disabled ?? isDisabled ?? triggerProps?.disabled;
    const { hoverStyle: triggerHoverStyle, nativeHaptics: _triggerNativeHaptics, onLayout: triggerOnLayout, onPress: triggerOnPress, pressStyle: triggerPressStyle, ...webMenuTriggerProps } = triggerProps ?? {};
    void _triggerNativeHaptics;
    const { maxHeight: webMenuContentMaxHeight, maxWidth: webMenuContentMaxWidth, minWidth: webMenuContentMinWidth, style: webMenuContentStyle, zIndex: webMenuContentZIndex, ...webMenuContentProps } = {
        ...contentProps,
        ...viewportProps,
    };
    const resolvedWebMenuOpen = props.open ?? webMenuOpen;
    const resolvedWebMenuContentMaxHeight = webMenuContentMaxHeight ?? WEB_MENU_SCROLL_VIEW_MAX_HEIGHT;
    React.useEffect(() => {
        if (!shouldRenderWebMenuSelect ||
            !resolvedWebMenuOpen ||
            selectedValue == null ||
            typeof window === "undefined") {
            return;
        }
        const focusSelectedItem = () => focusWebMenuItem(webMenuRootId, selectedValue);
        const animationFrame = window.requestAnimationFrame(focusSelectedItem);
        const fallbackTimer = window.setTimeout(focusSelectedItem, 80);
        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.clearTimeout(fallbackTimer);
        };
    }, [resolvedWebMenuOpen, selectedValue, shouldRenderWebMenuSelect, webMenuRootId]);
    const handleWebMenuOpenChange = (nextOpen) => {
        if (props.open === undefined) {
            setWebMenuOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
        if (nextOpen)
            triggerNativeHaptics(resolvedNativeHaptics);
    };
    const handleWebMenuValueChange = (nextValue) => {
        if (props.value === undefined) {
            setWebMenuValue(nextValue);
        }
        onValueChange?.(nextValue);
        triggerNativeHaptics(resolvedNativeHaptics);
    };
    const handleWebMenuTriggerLayout = (event) => {
        triggerOnLayout?.(event);
        const nextWidth = event?.nativeEvent?.layout?.width;
        if (typeof nextWidth === "number" && Number.isFinite(nextWidth) && nextWidth > 0) {
            setWebMenuTriggerWidth(nextWidth);
        }
    };
    const resolvedWebMenuContentZIndex = typeof webMenuContentZIndex === "number" ? webMenuContentZIndex : WEB_MENU_CONTENT_Z_INDEX;
    const handleWebMenuOverlayPress = (event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        handleWebMenuOpenChange(false);
    };
    const renderWebMenuItem = (item) => {
        const itemDisabled = item.disabled ?? item.isDisabled ?? itemProps?.disabled;
        const isSelected = item.value === selectedValue;
        return (_createElement(Menu.RadioItem, { ...itemProps, "aria-label": resolveAriaLabel(item["aria-label"] ?? itemProps?.["aria-label"], item.label), disabled: itemDisabled, key: item.value, textValue: item.label, value: item.value, ...{ "data-rn-ui-kit-select-menu-item-value": item.value } },
            item.startContent,
            _jsxs(YStack, { flex: 1, style: { minWidth: 0 }, children: [_jsx(Menu.ItemTitle, { ...itemTextProps, children: item.label }), item.description != null ? (typeof item.description === "string" || typeof item.description === "number" ? (_jsx(SizableText, { color: "$color10", size: "$2", children: item.description })) : (item.description)) : null] }),
            item.endContent,
            _jsx(Menu.ItemIndicator, { marginLeft: "auto", ...itemIndicatorProps, children: itemIndicatorProps?.children ??
                    (isSelected ? _jsx(Check, { color: "$color10", size: 12 }) : null) })));
    };
    const renderWebMenuGroup = (group, groupIndex) => {
        const label = getGroupLabel(group, groupIndex);
        return (_jsxs(React.Fragment, { children: [groupIndex > 0 ? _jsx(Menu.Separator, {}) : null, label != null ? _jsx(Menu.Label, { ...itemLabelProps, children: label }) : null, group.items.map(renderWebMenuItem)] }, group.key));
    };
    const webMenuTrigger = (_jsx(XStack, { "aria-label": resolveAriaLabel(triggerProps?.["aria-label"] ?? ariaLabel, selectedItem ?? placeholder), backgroundColor: nativeTrigger ? "transparent" : "$background", borderColor: nativeTrigger ? "transparent" : "$borderColor", borderRadius: nativeTrigger ? 0 : "$4", borderWidth: nativeTrigger ? 0 : 1, cursor: "default", hoverStyle: nativeTrigger
            ? {
                background: SELECT_TRIGGER_HOVER_COLOR,
                borderColor: "transparent",
                ...triggerHoverStyle,
            }
            : {
                background: SELECT_TRIGGER_HOVER_COLOR,
                borderColor: "$borderColor",
                ...triggerHoverStyle,
            }, items: "center", justify: nativeTrigger ? "center" : "space-between", minHeight: 44, opacity: selectDisabled ? 0.5 : 1, paddingHorizontal: nativeTrigger ? 0 : "$3", paddingVertical: nativeTrigger ? 0 : "$2", pointerEvents: selectDisabled ? "none" : undefined, pressStyle: nativeTrigger
            ? {
                background: SELECT_TRIGGER_PRESS_COLOR,
                borderColor: "transparent",
                ...triggerPressStyle,
            }
            : {
                background: SELECT_TRIGGER_PRESS_COLOR,
                ...triggerPressStyle,
            }, width: "100%", ...webMenuTriggerProps, onLayout: handleWebMenuTriggerLayout, onPress: triggerOnPress, children: nativeTrigger ? (_jsx(NativeTriggerFace, { content: nativeTriggerContent, containerStyle: nativeTriggerContainerStyle, icon: nativeTriggerIcon, label: triggerLabel, labelProps: nativeTriggerLabelProps })) : (_jsxs(_Fragment, { children: [renderSelectWebMenuTriggerLabel(triggerLabel, selectedItem == null), _jsx(ChevronDown, { color: "$color10", size: getFontSize(props.size ?? "$true") })] })) }));
    return (_jsxs(_Fragment, { children: [shouldRenderWebMenuSelect ? (resolvedItems.length === 0 ? null : (_jsxs(Menu, { modal: true, onOpenChange: handleWebMenuOpenChange, open: resolvedWebMenuOpen, offset: 8, placement: placement, children: [_jsx(Menu.Trigger, { asChild: true, disabled: selectDisabled, children: webMenuTrigger }), _jsxs(Menu.Portal, { zIndex: resolvedWebMenuContentZIndex, children: [resolvedWebMenuOpen ? (_jsx(YStack, { "aria-hidden": true, onClick: handleWebMenuOverlayPress, onMouseDown: handleWebMenuOverlayPress, onPointerDown: handleWebMenuOverlayPress, style: {
                                    ...WEB_MENU_BLOCKING_OVERLAY_STYLE,
                                    zIndex: 0,
                                } })) : null, _jsxs(Menu.Content, { ...webMenuContentProps, maxHeight: resolvedWebMenuContentMaxHeight, maxWidth: webMenuContentMaxWidth, minWidth: webMenuContentMinWidth ?? webMenuTriggerWidth, overflow: "hidden", style: [
                                    {
                                        maxHeight: resolvedWebMenuContentMaxHeight,
                                        ...(webMenuContentMaxWidth != null
                                            ? { maxWidth: webMenuContentMaxWidth }
                                            : null),
                                        overflow: "hidden",
                                    },
                                    webMenuContentStyle,
                                ], zIndex: 1, ...{ "data-rn-ui-kit-select-menu-root": webMenuRootId }, children: [webMenuArrow ? _jsx(Menu.Arrow, {}) : null, _jsx(YStack, { style: {
                                            ...WEB_MENU_SCROLL_VIEW_STYLE,
                                            maxHeight: resolvedWebMenuContentMaxHeight,
                                        }, children: _jsx(YStack, { p: 5, children: _jsx(Menu.RadioGroup, { value: selectedValue ?? undefined, onValueChange: handleWebMenuValueChange, children: resolvedItemGroups.map(renderWebMenuGroup) }) }) })] })] })] }))) : shouldRenderWebNativeTriggerSelect ? (_jsxs(YStack, { backgroundColor: nativeTrigger ? "transparent" : "$background", borderColor: nativeTrigger ? "transparent" : "$borderColor", borderRadius: nativeTrigger ? 0 : "$4", borderWidth: nativeTrigger ? 0 : 1, hoverStyle: nativeTrigger
                    ? {
                        background: SELECT_TRIGGER_HOVER_COLOR,
                        borderColor: "transparent",
                        ...triggerProps?.hoverStyle,
                    }
                    : {
                        background: SELECT_TRIGGER_HOVER_COLOR,
                        borderColor: "$borderColor",
                        ...triggerProps?.hoverStyle,
                    }, justifyContent: nativeTrigger ? "center" : "space-between", minHeight: 44, paddingHorizontal: nativeTrigger ? 0 : "$3", paddingVertical: nativeTrigger ? 0 : "$2", position: "relative", pressStyle: nativeTrigger
                    ? {
                        background: SELECT_TRIGGER_PRESS_COLOR,
                        borderColor: "transparent",
                        ...triggerProps?.pressStyle,
                    }
                    : {
                        background: SELECT_TRIGGER_PRESS_COLOR,
                        ...triggerProps?.pressStyle,
                    }, width: "100%", ...triggerProps, children: [nativeTrigger ? (_jsx(NativeTriggerFace, { content: nativeTriggerContent, containerStyle: nativeTriggerContainerStyle, icon: nativeTriggerIcon, label: triggerLabel, labelProps: nativeTriggerLabelProps })) : (_jsxs(_Fragment, { children: [renderSelectWebMenuTriggerLabel(triggerLabel, selectedItem == null), _jsx(YStack, { position: "absolute", r: 0, t: 16, items: "center", justify: "center", width: "$4", pointerEvents: "none", children: _jsx(ChevronDown, { size: getFontSize(props.size ?? "$true") }) })] })), _jsx(YStack, { style: WEB_NATIVE_TRIGGER_SELECT_OVERLAY_STYLE, children: _jsx(TamaguiSelect, { disablePreventBodyScroll: true, ...props, native: selectBehavior.tamaguiNative, onValueChange: handleTamaguiValueChange, renderValue: props.renderValue ?? ((nextValue) => getItemLabelByValue(nextValue)), children: _jsx(SelectContent, { ...contentProps, children: _jsx(SelectViewport, { bg: "$background", rounded: "$4", borderWidth: 1, borderColor: "$borderColor", ...viewportProps, children: renderedItemGroups.map(renderGroup) }) }) }) })] })) : shouldRenderNativePlatformPicker ? (_jsx(NativePickerSwiftUI, { items: resolvedItems, value: props.value, placeholder: placeholder, nativeDropdownAlign: resolvedNativeDropdownAlign, nativeDropdownAnchorWidth: nativeDropdownAnchorWidth, nativeDropdownEdgeOffset: nativeDropdownEdgeOffset, mode: resolvedPickerMode, nativeTrigger: nativeTrigger ?? false, nativeTriggerContainerStyle: nativeTriggerContainerStyle, nativeTriggerContent: nativeTriggerContent, nativeTriggerIcon: nativeTriggerIcon, nativeTriggerLabelProps: nativeTriggerLabelProps, onValueChange: onValueChange, resolvedNativeHaptics: resolvedNativeHaptics })) : (_jsx(TamaguiSelect, { disablePreventBodyScroll: true, ...props, open: shouldRenderNativePicker ? false : undefined, native: selectBehavior.tamaguiNative, onOpenChange: handleTamaguiOpenChange, onValueChange: handleTamaguiValueChange, renderValue: props.renderValue ?? ((nextValue) => getItemLabelByValue(nextValue)), children: children ??
                    (resolvedItems.length === 0 ? null : (_jsxs(_Fragment, { children: [_jsx(SelectTrigger, { disabled: disabled ?? isDisabled ?? triggerProps?.disabled, ...(!nativeTrigger
                                    ? {
                                        backgroundColor: "$background",
                                        borderRadius: "$4",
                                        iconAfter: ChevronDown,
                                    }
                                    : {
                                        backgroundColor: "transparent",
                                        borderColor: "transparent",
                                        borderRadius: 0,
                                        borderWidth: 0,
                                        justifyContent: "center",
                                        minHeight: 44,
                                        paddingHorizontal: 0,
                                        paddingVertical: 0,
                                        pressStyle: {
                                            backgroundColor: shouldUseNativeSheetCompactNativeTrigger
                                                ? SELECT_TRIGGER_PRESS_COLOR
                                                : "transparent",
                                            borderColor: "transparent",
                                            opacity: 0.6,
                                        },
                                    }), ...triggerProps, "aria-label": resolveAriaLabel(triggerProps?.["aria-label"] ?? ariaLabel, selectedItem ?? placeholder), nativeHaptics: triggerProps?.nativeHaptics ?? resolvedNativeHaptics, children: nativeTrigger ? (_jsx(NativeTriggerFace, { content: nativeTriggerContent, containerStyle: nativeTriggerContainerStyle, icon: nativeTriggerIcon, label: triggerLabel, labelProps: nativeTriggerLabelProps })) : (_jsx(SelectValue, { placeholder: placeholder })) }), _jsxs(SelectSheetController, { onOpenAnimationComplete: scrollToSelectedItem, shouldRunOpenAnimationComplete: initialScrollY != null, children: [_jsx(SelectAdapt, { when: resolvedSelectAdaptWhen, platform: resolvedSelectAdaptPlatform, children: selectBehavior.shouldUseCustomSheet ? (_jsx(SelectCustomSheet, { initialScrollY: initialScrollY, sheetScrollRef: sheetScrollRef, shouldUseTouchSheetLayout: shouldUseTouchSheetLayout, touchSheetConfig: touchSheetConfig })) : selectBehavior.shouldUseNativeSheet ? (_jsx(SelectNativeSheet, { initialScrollY: initialScrollY, sheetScrollRef: sheetScrollRef, shouldUseTouchSheetLayout: shouldUseTouchSheetLayout, touchSheetConfig: touchSheetConfig })) : (_jsxs(Sheet, { modal: true, dismissOnSnapToBottom: true, snapPoints: touchSheetConfig.snapPoints, snapPointsMode: touchSheetConfig.snapPointsMode, transitionConfig: { type: "timing", duration: 150 }, children: [_jsx(SelectSheetFrame, { initialScrollY: initialScrollY, sheetScrollRef: sheetScrollRef, shouldUseTouchSheetLayout: shouldUseTouchSheetLayout, touchSheetConfig: touchSheetConfig }), _jsx(Sheet.Overlay, { bg: "$shadowColor", transition: "lazy", enterStyle: { opacity: 0 }, exitStyle: { opacity: 0 } })] })) }), _jsxs(SelectContent, { ...contentProps, children: [!shouldUseTouchSheetLayout && (_jsx(SelectScrollUpButton, { items: "center", justify: "center", position: "relative", width: "100%", height: "$3" })), _jsxs(SelectViewport, { bg: "$background", rounded: "$4", borderWidth: 1, borderColor: "$borderColor", ...viewportProps, style: shouldUseIosNativeSheetList
                                                    ? [{ flex: 1, minHeight: 0, width: "100%" }, viewportProps?.style]
                                                    : viewportProps?.style, children: [shouldUseIosNativeSheetList ? (_jsx(IosNativeSheetSelectList, { initialScrollTarget: selectedNativeListInitialScrollTarget, itemGroups: resolvedItemGroups, itemLabel: itemLabel, nativeHaptics: resolvedNativeHaptics, value: props.value ?? null })) : (renderedItemGroups.map(renderGroup)), isWeb() && selectBehavior.tamaguiNative && !nativeTrigger && (_jsx(YStack, { position: "absolute", r: 0, t: 16, items: "center", justify: "center", width: "$4", pointerEvents: "none", children: _jsx(ChevronDown, { size: getFontSize(props.size ?? "$true") }) }))] }), !shouldUseTouchSheetLayout && (_jsx(SelectScrollDownButton, { items: "center", justify: "center", position: "relative", width: "100%", height: "$3" }))] })] })] }))) })), shouldRenderNativePicker && (_jsx(NativePickerDialog, { anchorAlign: resolvedNativeDropdownAlign, anchorWidth: nativeDropdownAnchorWidth, anchorEdgeOffset: nativeDropdownEdgeOffset, visible: nativePickerVisible, value: props.value ?? "", items: resolvedItems, mode: resolvedPickerMode, onValueChange: (itemValue) => {
                    onValueChange?.(itemValue || null);
                    triggerNativeHaptics(resolvedNativeHaptics);
                    setNativePickerVisible(false);
                }, onBlur: () => setNativePickerVisible(false) }))] }));
});
SelectRoot.displayName = "Select";
export const Select = Object.assign(SelectRoot, {
    Adapt: SelectAdapt,
    Content: SelectContent,
    Group: SelectGroup,
    Icon: SelectIcon,
    Item: SelectItem,
    ItemIndicator: SelectItemIndicator,
    ItemText: SelectItemText,
    Label: SelectLabel,
    ScrollDownButton: SelectScrollDownButton,
    ScrollUpButton: SelectScrollUpButton,
    Trigger: SelectTrigger,
    Value: SelectValue,
    Viewport: SelectViewport,
    Indicator: SelectIndicator,
    FocusScope: SelectFocusScope,
});
