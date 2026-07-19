import { jsx as _jsx } from "react/jsx-runtime";
import { NavigationContext } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useRef, useState, } from "react";
import { View, useWindowDimensions, } from "react-native";
import { os } from "../../utils/platform";
import { useTrueSheetOverlaySheetTopPosition } from "./true_sheet/overlay_layout_context";
import { useTrueSheetScrollLayout } from "./true_sheet/true_sheet_scroll_context";
/**
 * NativeSheet 内的非滚动填充容器。
 *
 * iOS TrueSheet 的 NativeStack 子页面可能仍按整窗高度布局，再从 Sheet 顶部开始显示，
 * 导致底部超出物理窗口。这里用自身的窗口坐标约束最大高度；普通页面与其他平台不调整。
 */
export function NativeSheetFillContent({ children, onLayout, style, ...props }) {
    const viewRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [visibleMaxHeight, setVisibleMaxHeight] = useState(null);
    const { height: windowHeight } = useWindowDimensions();
    const { active: insideTrueSheet } = useTrueSheetScrollLayout();
    const sheetTopPosition = useTrueSheetOverlaySheetTopPosition();
    const navigation = useContext(NavigationContext);
    const shouldConstrainViewport = os() === "ios" && insideTrueSheet;
    const cancelScheduledMeasurement = useCallback(() => {
        if (animationFrameRef.current != null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    }, []);
    const measureVisibleViewport = useCallback(() => {
        cancelScheduledMeasurement();
        if (!shouldConstrainViewport) {
            setVisibleMaxHeight(null);
            return;
        }
        animationFrameRef.current = requestAnimationFrame(() => {
            animationFrameRef.current = null;
            viewRef.current?.measureInWindow((_x, y) => {
                // TrueSheet is presented in its own window: `y` is local to that presentation window,
                // while `sheetTopPosition` is the presentation window's offset on the physical screen.
                const physicalScreenY = y + (sheetTopPosition ?? 0);
                const nextHeight = Math.max(0, Math.round(windowHeight - physicalScreenY));
                setVisibleMaxHeight((current) => (current === nextHeight ? current : nextHeight));
            });
        });
    }, [
        cancelScheduledMeasurement,
        sheetTopPosition,
        shouldConstrainViewport,
        windowHeight,
    ]);
    useEffect(() => {
        measureVisibleViewport();
        return cancelScheduledMeasurement;
    }, [cancelScheduledMeasurement, measureVisibleViewport, sheetTopPosition]);
    useEffect(() => {
        if (!shouldConstrainViewport || navigation == null)
            return;
        return navigation.addListener("transitionEnd", (event) => {
            if (!event.data?.closing) {
                measureVisibleViewport();
            }
        });
    }, [measureVisibleViewport, navigation, shouldConstrainViewport]);
    const handleLayout = useCallback((event) => {
        onLayout?.(event);
        measureVisibleViewport();
    }, [measureVisibleViewport, onLayout]);
    return (_jsx(View, { ref: viewRef, onLayout: handleLayout, style: [style, visibleMaxHeight != null ? { maxHeight: visibleMaxHeight } : null], ...props, children: children }));
}
