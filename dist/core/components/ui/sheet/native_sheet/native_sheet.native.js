import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { iosMajorVersion, isIos26Plus, os } from "../../utils/platform";
import { useAppBackgroundColors } from "../../utils/theme";
import { dismissTrueSheet, resizeTrueSheet } from "./true_sheet";
import { createTrueSheetOverlayPortalHostName } from "./true_sheet/overlay_host_name";
import { TrueSheetPanel } from "./true_sheet/panel";
let nativeSheetCounter = 0;
// Android TrueSheet 的 auto detent 会在打开动画期间追随内容测量，改用稳定最大百分比避免抖动。
const ANDROID_FIT_DETENT = 1;
function useControllableNativeSheetState({ defaultOpen = false, defaultPosition = 0, onOpenChange, onPositionChange, open: openProp, position: positionProp, }) {
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
        onPositionChange?.(nextPosition);
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
function normalizeConstantDetent(point, windowHeight) {
    if (!Number.isFinite(windowHeight) || windowHeight <= 0) {
        return null;
    }
    return Math.max(0.01, Math.min(1, point / windowHeight));
}
function resolveAndroidFitDetent() {
    return ANDROID_FIT_DETENT;
}
function resolveNativeDetent(point, snapPointsMode, windowHeight) {
    if (point === "fit") {
        if (os() === "android") {
            return resolveAndroidFitDetent();
        }
        return "auto";
    }
    if (typeof point === "number") {
        if (snapPointsMode === "constant") {
            return normalizeConstantDetent(point, windowHeight);
        }
        return normalizePercentDetent(point);
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
function normalizeIos15Detents(indexedDetents) {
    const sourceDetentCount = indexedDetents.length;
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
export function resolveNativeDetents(snapPoints, snapPointsMode, windowHeight) {
    if (snapPointsMode === "fit") {
        return {
            detents: [os() === "android" ? resolveAndroidFitDetent() : "auto"],
            sourceDetentCount: 1,
            fromNativeIndex: (index) => index,
            toNativeIndex: (index) => index,
        };
    }
    const sourceSnapPoints = snapPoints == null || snapPoints.length === 0 ? [100] : snapPoints;
    const detents = sourceSnapPoints
        .slice(0, 3)
        .map((point) => resolveNativeDetent(point, snapPointsMode, windowHeight))
        .filter((point) => point != null);
    const indexedDetents = detents.map((detent, originalIndex) => ({
        detent,
        originalIndex,
    }));
    if (!supportsCustomDetents()) {
        return normalizeIos15Detents(indexedDetents);
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
        sourceDetentCount: sourceSnapPoints.length,
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
export function NativeSheet({ backgroundColor, children, content, defaultOpen, defaultPosition, dismissOnBackPress = true, dismissOnOverlayPress = true, disableDrag, grabberContentInsetTop, handle, modal, name, onAnimationComplete, onOpenChange, onPositionChange, open: openProp, overlay, overlayPortalHostName: overlayPortalHostNameProp, position: positionProp, snapPoints, snapPointsMode, }) {
    const { height: windowHeight } = useWindowDimensions();
    const appBackgroundColors = useAppBackgroundColors();
    const [generatedSheetName] = useState(() => `ui-sheet-native-${++nativeSheetCounter}`);
    const sheetName = name ?? generatedSheetName;
    const [generatedOverlayPortalHostName] = useState(() => createTrueSheetOverlayPortalHostName(`${sheetName}-overlay`));
    const overlayPortalHostName = createTrueSheetOverlayPortalHostName(overlayPortalHostNameProp ?? generatedOverlayPortalHostName);
    const sheetState = useControllableNativeSheetState({
        defaultOpen,
        defaultPosition,
        onOpenChange,
        onPositionChange,
        open: openProp,
        position: positionProp,
    });
    const [mounted, setMounted] = useState(() => modal !== false && sheetState.open);
    const presentedRef = useRef(false);
    const dismissingRef = useRef(false);
    // iOS 15 下若让 initialDetentIndex 跟随受控 position 回写，首次切到上一档后会被原生 props 更新拉回初始档位。
    const initialDetentIndexRef = useRef(null);
    const lastRequestedPositionRef = useRef(null);
    const detentNormalization = useMemo(() => resolveNativeDetents(snapPoints, snapPointsMode, windowHeight), [snapPoints, snapPointsMode, windowHeight]);
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
        detents: detentNormalization.detents,
        dimmed: overlay ?? true,
        dismissible: dismissOnOverlayPress !== false,
        draggable: disableDrag !== true,
        grabber: handle ?? false,
        initialDetentIndex: initialDetentIndexRef.current ?? resolvedDetentIndex,
        onBackPress: dismissOnBackPress
            ? () => {
                dismissingRef.current = true;
                sheetState.setOpen(false);
                return true;
            }
            : undefined,
        onDetentChange: (event) => {
            const sourceIndex = detentNormalization.fromNativeIndex(event.nativeEvent.index);
            lastRequestedPositionRef.current = event.nativeEvent.index;
            sheetState.setPosition(sourceIndex);
        },
        onDidDismiss: () => {
            presentedRef.current = false;
            dismissingRef.current = false;
            initialDetentIndexRef.current = null;
            lastRequestedPositionRef.current = null;
            setMounted(false);
            sheetState.setOpen(false);
            onAnimationComplete?.({ open: false });
        },
        onDidPresent: (event) => {
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
