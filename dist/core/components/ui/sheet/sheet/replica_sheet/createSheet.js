import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useComposedRefs } from "@tamagui/compose-refs";
import { isWeb, useIsomorphicLayoutEffect } from "@tamagui/constants";
import { View } from "@tamagui/core";
import { composeEventHandlers, withStaticProperties } from "@tamagui/helpers";
import { resolveViewZIndex } from "@tamagui/portal";
import { RemoveScroll } from "@tamagui/remove-scroll";
import { useDidFinishSSR } from "@tamagui/use-did-finish-ssr";
import { StackZIndexContext } from "@tamagui/z-index-stack";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { Platform } from "react-native";
import { useSheetContext } from "./SheetContext";
import { SheetImplementationCustom } from "./SheetImplementationCustom";
import { SheetScrollView } from "./SheetScrollView";
import { SHEET_HANDLE_NAME, SHEET_NAME, SHEET_OVERLAY_NAME } from "./constants";
import { getNativeSheet } from "./nativeSheet";
import { useSheetController } from "./useSheetController";
import { useSheetOffscreenSize } from "./useSheetOffscreenSize";
import { getMaxViewportHeight } from "./webViewport";
export function createSheet({ Handle, Frame, Overlay }) {
    const SheetHandle = Handle.styleable(({ __scopeSheet, ...props }, forwardedRef) => {
        const context = useSheetContext(SHEET_HANDLE_NAME, __scopeSheet);
        const composedRef = useComposedRefs(context.handleRef, forwardedRef);
        // track if sheet was being dragged to prevent onPress toggle after drag
        const wasDraggingRef = useRef(false);
        // subscribe to parent dragging changes to track if we dragged during this press
        useEffect(() => {
            if (!context.scrollBridge)
                return;
            return context.scrollBridge.onParentDragging((isDragging) => {
                if (isDragging) {
                    wasDraggingRef.current = true;
                }
            });
        }, [context.scrollBridge]);
        if (context.onlyShowFrame) {
            return null;
        }
        return (
        // @ts-expect-error for CSS driver this is necessary to attach the transition
        _jsx(Handle, { ref: composedRef, 
            // 扩大触摸区域覆盖顶部整行（padding+Handle+间隙），视觉不变
            hitSlop: { top: 12, bottom: 6, left: 200, right: 200 }, onPressIn: () => {
                // reset at start of new press
                wasDraggingRef.current = false;
                // Handle 触摸时清除滚动标记，允许进入 else-if 移动 Sheet。
                // 不依赖 onBegin（可能被手势重建误重置），而是利用 ScrollBridge 的持久性。
                if (context.scrollBridge) {
                    context.scrollBridge.gestureDidScroll = false;
                }
            }, onPress: () => {
                // skip toggle if this was a drag gesture
                if (wasDraggingRef.current) {
                    wasDraggingRef.current = false;
                    return;
                }
                // don't toggle to the bottom snap position when dismissOnSnapToBottom set
                const max = context.snapPoints.length + (context.dismissOnSnapToBottom ? -1 : 0);
                const nextPos = (context.position + 1) % max;
                context.setPosition(nextPos);
            }, open: context.open, ...props }));
    });
    /* -------------------------------------------------------------------------------------------------
     * SheetOverlay
     * -----------------------------------------------------------------------------------------------*/
    const SheetOverlay = Overlay.styleable((propsIn) => {
        const { __scopeSheet, ...props } = propsIn;
        const context = useSheetContext(SHEET_OVERLAY_NAME, __scopeSheet);
        // this ones a bit weird for legacy reasons, we need to hoist it above <Sheet /> AnimatedView
        // so we just pass it up to context
        const element = useMemo(() => {
            return (
            // @ts-expect-error for CSS driver this is necessary to attach the transition
            _jsx(Overlay, { ...props, onPress: composeEventHandlers(props.onPress, context.dismissOnOverlayPress
                    ? () => {
                        context.setOpen(false);
                    }
                    : undefined) }));
        }, [props.onPress, props.opacity, context.dismissOnOverlayPress]);
        useIsomorphicLayoutEffect(() => {
            context.onOverlayComponent?.(element);
        }, [element]);
        if (context.onlyShowFrame) {
            return null;
        }
        return null;
    });
    const SheetFrame = Frame.styleable(({ __scopeSheet, adjustPaddingForOffscreenContent, disableHideBottomOverflow, children, ...props }, forwardedRef) => {
        const context = useSheetContext(SHEET_NAME, __scopeSheet);
        const { hasFit, disableRemoveScroll, frameSize, contentRef, open } = context;
        const composedContentRef = useComposedRefs(forwardedRef, contentRef);
        const offscreenSize = useSheetOffscreenSize(context);
        // FIX: Store the frameSize when open for use during close animation
        const stableFrameSize = useRef(frameSize);
        useEffect(() => {
            if (open && frameSize) {
                stableFrameSize.current = frameSize;
            }
        }, [open, frameSize]);
        const sheetContents = useMemo(() => {
            // FIX: Use fixed height during close animation to prevent content-driven resizing
            const shouldUseFixedHeight = hasFit && !open && stableFrameSize.current;
            return (
            // @ts-expect-error for CSS driver this is necessary to attach the transition
            _jsxs(Frame, { ref: composedContentRef, flex: hasFit && open ? 0 : 1, flexBasis: hasFit ? "auto" : undefined, height: shouldUseFixedHeight ? stableFrameSize.current : hasFit ? undefined : frameSize, pointerEvents: open ? "auto" : "none", "data-state": open ? "open" : "closed", ...props, children: [_jsx(StackZIndexContext, { zIndex: resolveViewZIndex(props.zIndex), children: children }), adjustPaddingForOffscreenContent && (_jsx(View, { "data-sheet-offscreen-pad": true, height: offscreenSize, width: "100%" }))] }));
        }, [open, props, frameSize, offscreenSize, adjustPaddingForOffscreenContent, hasFit]);
        return (_jsxs(_Fragment, { children: [_jsx(RemoveScroll, { enabled: !disableRemoveScroll && context.open, children: sheetContents }), !disableHideBottomOverflow && (
                // @ts-expect-error for CSS driver this is necessary to attach the transition
                _jsx(Frame, { ...props, componentName: "SheetCover", "data-sheet-cover": "", children: null, 
                    // Don't inherit testID - this is a visual helper element
                    testID: undefined, id: undefined, position: "absolute", pointerEvents: "none", top: Math.max(0, context.frameSize - 1), zIndex: 0, height: isWeb ? Math.max(context.frameSize, getMaxViewportHeight()) : context.frameSize, maxHeight: isWeb ? "none" : undefined, left: 0, right: 0, borderWidth: 0, borderRadius: 0, shadowOpacity: 0 }))] }));
    });
    const Sheet = forwardRef((props, ref) => {
        const hydrated = useDidFinishSSR();
        const { isShowingNonSheet } = useSheetController();
        let SheetImplementation = SheetImplementationCustom;
        if (props.native && Platform.OS === "ios") {
            if (process.env.TAMAGUI_TARGET === "native") {
                const impl = getNativeSheet("ios");
                if (impl) {
                    // @ts-expect-error accepting external sheet implementation
                    SheetImplementation = impl;
                }
            }
        }
        /**
         * Performance is sensitive here so avoid all the hooks below with this
         */
        if (isShowingNonSheet || !hydrated) {
            return null;
        }
        return _jsx(SheetImplementation, { ref: ref, ...props });
    });
    const components = {
        Frame: SheetFrame,
        Overlay: SheetOverlay,
        Handle: SheetHandle,
        ScrollView: SheetScrollView,
    };
    const Controlled = withStaticProperties(Sheet, components);
    return withStaticProperties(Sheet, {
        ...components,
        Controlled,
    });
}
