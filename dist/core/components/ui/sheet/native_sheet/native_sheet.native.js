import { jsx as _jsx } from "react/jsx-runtime";
import { useWindowDimensions } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { iosMajorVersion, isIos26Plus, os } from "../../utils/platform";
import { useAppBackgroundColors } from "../../utils/theme";
import { dismissTrueSheet, resizeTrueSheet } from "./true_sheet";
import { createTrueSheetOverlayPortalHostName } from "./true_sheet/overlay_host_name";
import { TrueSheetPanel } from "./true_sheet/panel";
let nativeSheetCounter = 0;
function useControllableNativeSheetState({ defaultOpen = false, defaultPosition = 0, onOpenChange, onSnapPointChange, open: openProp, position: positionProp, }) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [uncontrolledPosition, setUncontrolledPosition] = useState(defaultPosition);
    const open = openProp ?? uncontrolledOpen;
    const position = positionProp ?? uncontrolledPosition;
    const setOpen = (nextOpen) => {
        if (openProp == null) {
            setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    };
    const setPosition = (nextPosition) => {
        if (positionProp == null) {
            setUncontrolledPosition(nextPosition);
        }
        onSnapPointChange?.(nextPosition);
    };
    return {
        open,
        position,
        setOpen,
        setPosition,
    };
}
function normalizePercentDetent(point) {
    return Math.max(0.01, Math.min(1, point / 100));
}
function resolveSnapPoint(point) {
    if (typeof point === "number") {
        return Number.isFinite(point) ? Math.max(0.01, Math.min(1, point)) : null;
    }
    const matchedPercent = point.trim().match(/^(\d+(?:\.\d+)?)%$/);
    return matchedPercent == null
        ? null
        : normalizePercentDetent(Number.parseFloat(matchedPercent[1]));
}
function compareNativeDetents(left, right) {
    if (typeof left !== "number")
        return typeof right !== "number" ? 0 : -1;
    if (typeof right !== "number")
        return 1;
    return left - right;
}
function supportsCustomDetents() {
    if (os() !== "ios") {
        return true;
    }
    const iosMajor = iosMajorVersion();
    return iosMajor != null && iosMajor >= 16;
}
function normalizeIos15Detents(indexedDetents, compactHeight = false) {
    const sourceDetentCount = indexedDetents.length;
    // UISheetPresentationController's medium detent is inactive in compact-height
    // environments (iPhone landscape). iOS 15 has no custom detents, so large is
    // the only safe native detent in that orientation.
    if (compactHeight) {
        return {
            detents: [1],
            sourceDetentCount,
            fromNativeIndex: () => 0,
            toNativeIndex: () => 0,
        };
    }
    if (indexedDetents.length === 1) {
        const detent = indexedDetents[0].detent;
        const nativeDetent = typeof detent === "number" && detent >= 0.75 ? 1 : 0.49;
        return {
            detents: [nativeDetent],
            sourceDetentCount,
            fromNativeIndex: () => indexedDetents[0].originalIndex,
            toNativeIndex: () => 0,
        };
    }
    const sortedDetents = [...indexedDetents].sort((left, right) => compareNativeDetents(left.detent, right.detent));
    const lowerDetent = sortedDetents[0];
    const upperDetent = sortedDetents[sortedDetents.length - 1];
    const originalToNative = new Map();
    sortedDetents.forEach((entry, sortedIndex) => {
        originalToNative.set(entry.originalIndex, sortedIndex === 0 ? 0 : 1);
    });
    return {
        detents: [0.49, 1],
        sourceDetentCount,
        fromNativeIndex: (index) => index <= 0 ? lowerDetent.originalIndex : upperDetent.originalIndex,
        toNativeIndex: (index) => originalToNative.get(index) ?? 0,
    };
}
export function resolveNativeDetents(detents, snapPoints, compactHeight = false) {
    const hasDirectDetents = detents != null && detents.length > 0;
    const sourceDetentsCandidate = hasDirectDetents
        ? detents
        : snapPoints == null || snapPoints.length === 0
            ? [1]
            : snapPoints
                .map((point) => resolveSnapPoint(point))
                .filter((point) => point != null);
    const sourceDetents = sourceDetentsCandidate.length > 0 ? sourceDetentsCandidate : [1];
    const limitedSourceDetents = sourceDetents.slice(0, 3);
    const indexedDetents = limitedSourceDetents.map((detent, originalIndex) => ({
        detent: typeof detent === "number" ? Math.max(0.01, Math.min(1, detent)) : detent,
        originalIndex,
    }));
    if (!supportsCustomDetents()) {
        return normalizeIos15Detents(indexedDetents, compactHeight);
    }
    if (hasDirectDetents) {
        return {
            detents: indexedDetents.map((entry) => entry.detent),
            sourceDetentCount: indexedDetents.length,
            fromNativeIndex: (index) => index,
            toNativeIndex: (index) => index,
        };
    }
    const normalizedDetents = [...indexedDetents].sort((left, right) => compareNativeDetents(left.detent, right.detent));
    const originalToNative = new Map();
    const nativeToOriginal = new Map();
    normalizedDetents.forEach((entry, nativeIndex) => {
        originalToNative.set(entry.originalIndex, nativeIndex);
        nativeToOriginal.set(nativeIndex, entry.originalIndex);
    });
    return {
        detents: normalizedDetents.map((entry) => entry.detent),
        sourceDetentCount: limitedSourceDetents.length,
        fromNativeIndex: (index) => nativeToOriginal.get(index) ?? index,
        toNativeIndex: (index) => originalToNative.get(index) ?? index,
    };
}
export function clampDetentIndex(index, detentCount) {
    if (detentCount <= 0 || index == null || !Number.isFinite(index)) {
        return 0;
    }
    return Math.max(0, Math.min(detentCount - 1, Math.round(index)));
}
export function NativeSheet({ ...props }) {
    const { backgroundColor, children, content, defaultOpen, defaultPosition, detents, dismissOnBackPress = true, dismissOnOverlayPress = true, disableDrag, dismissible, draggable, dimmed, grabberContentInsetTop, grabber, handle, initialDetentIndex, modal, name, onAnimationComplete, onBackPress, onDetentChange, onDidDismiss, onDidPresent, onOpenChange, onPositionChange, onSnapPointChange, open: openProp, overlay, overlayPortalHostName: overlayPortalHostNameProp, position: positionProp, snapPoints, ...trueSheetProps } = props;
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const appBackgroundColors = useAppBackgroundColors();
    const [generatedSheetName] = useState(() => `ui-sheet-native-${++nativeSheetCounter}`);
    const sheetName = name ?? generatedSheetName;
    const [generatedOverlayPortalHostName] = useState(() => createTrueSheetOverlayPortalHostName(`${sheetName}-overlay`));
    const overlayPortalHostName = createTrueSheetOverlayPortalHostName(overlayPortalHostNameProp ?? generatedOverlayPortalHostName);
    const sheetState = useControllableNativeSheetState({
        defaultOpen,
        defaultPosition,
        onOpenChange,
        onSnapPointChange,
        open: openProp,
        position: positionProp,
    });
    const [mounted, setMounted] = useState(() => modal !== false && sheetState.open);
    const presentedRef = useRef(false);
    const dismissingRef = useRef(false);
    // iOS 15 下若让 initialDetentIndex 跟随受控 position 回写，首次切到上一档后会被原生 props 更新拉回初始档位。
    const initialDetentIndexRef = useRef(null);
    const lastRequestedPositionRef = useRef(null);
    const detentNormalization = useMemo(() => resolveNativeDetents(detents, snapPoints, os() === "ios" && iosMajorVersion() === 15 && windowWidth > windowHeight), [detents, snapPoints, windowHeight, windowWidth]);
    const resolvedDetentIndex = detentNormalization.toNativeIndex(clampDetentIndex(sheetState.position, detentNormalization.sourceDetentCount));
    if (modal !== false && mounted && initialDetentIndexRef.current == null) {
        initialDetentIndexRef.current = resolvedDetentIndex;
    }
    useEffect(() => {
        if (modal === false) {
            return;
        }
        if (sheetState.open) {
            if (mounted || dismissingRef.current) {
                return;
            }
            dismissingRef.current = false;
            initialDetentIndexRef.current = resolvedDetentIndex;
            lastRequestedPositionRef.current = resolvedDetentIndex;
            setMounted(true);
            return;
        }
        if (!presentedRef.current || dismissingRef.current) {
            if (mounted && !presentedRef.current) {
                setMounted(false);
            }
            return;
        }
        dismissingRef.current = true;
        dismissTrueSheet(sheetName).catch(() => undefined);
    }, [modal, mounted, resolvedDetentIndex, sheetName, sheetState.open]);
    useEffect(() => {
        if (!presentedRef.current || lastRequestedPositionRef.current === resolvedDetentIndex) {
            return;
        }
        lastRequestedPositionRef.current = resolvedDetentIndex;
        resizeTrueSheet(sheetName, resolvedDetentIndex).catch(() => undefined);
    }, [resolvedDetentIndex, sheetName]);
    if (modal === false || !mounted) {
        return null;
    }
    // iOS26 以上有透明背景, 默认不用自定义颜色覆盖它
    const resolvedBackgroundColor = backgroundColor ?? (isIos26Plus() ? undefined : appBackgroundColors.sheet);
    const sheetProps = {
        ...trueSheetProps,
        detents: detentNormalization.detents,
        dimmed: dimmed ?? overlay ?? true,
        dismissible: dismissible ?? dismissOnOverlayPress !== false,
        draggable: draggable ?? disableDrag !== true,
        grabber: grabber ?? handle ?? false,
        initialDetentIndex: initialDetentIndex ?? initialDetentIndexRef.current ?? resolvedDetentIndex,
        onBackPress: onBackPress != null || dismissOnBackPress
            ? () => {
                const customResult = onBackPress?.();
                if (customResult === false) {
                    return false;
                }
                if (dismissOnBackPress) {
                    dismissingRef.current = true;
                    sheetState.setOpen(false);
                    return true;
                }
                return customResult;
            }
            : undefined,
        onPositionChange,
        onDetentChange: (event) => {
            onDetentChange?.(event);
            const sourceIndex = detentNormalization.fromNativeIndex(event.nativeEvent.index);
            lastRequestedPositionRef.current = event.nativeEvent.index;
            sheetState.setPosition(sourceIndex);
        },
        onDidDismiss: (event) => {
            onDidDismiss?.(event);
            presentedRef.current = false;
            dismissingRef.current = false;
            initialDetentIndexRef.current = null;
            lastRequestedPositionRef.current = null;
            setMounted(false);
            sheetState.setOpen(false);
            onAnimationComplete?.({ open: false });
        },
        onDidPresent: (event) => {
            onDidPresent?.(event);
            presentedRef.current = true;
            dismissingRef.current = false;
            lastRequestedPositionRef.current = event.nativeEvent.index;
            sheetState.setPosition(detentNormalization.fromNativeIndex(event.nativeEvent.index));
            onAnimationComplete?.({ open: true });
        },
    };
    return (_jsx(TrueSheetPanel, { backgroundColor: resolvedBackgroundColor, grabberContentInsetTop: grabberContentInsetTop, name: sheetName, onRequestClose: () => {
            sheetState.setOpen(false);
        }, overlayPortalHostName: overlayPortalHostName, sheetProps: sheetProps, children: content ?? children }));
}
