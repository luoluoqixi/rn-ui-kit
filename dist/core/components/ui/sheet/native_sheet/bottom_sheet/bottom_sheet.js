import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { isWeb } from "../../../utils/platform";
import { Sheet as ReplicaSheet } from "../../sheet/replica_sheet/Sheet";
import { ScreenOverlayPortalProvider } from "../../../utils/screen_overlay_portal";
const DEFAULT_OVERLAY_ENTER_STYLE = { opacity: 0 };
const DEFAULT_OVERLAY_EXIT_STYLE = { opacity: 0 };
const IDENTITY_INDEX = (index) => index;
function normalizePercentString(point) {
    const matched = point.trim().match(/^(\d+(?:\.\d+)?)%$/);
    return matched == null ? null : Number.parseFloat(matched[1]);
}
function resolveReplicaSheetSnapPoints(snapPoints, snapPointsMode) {
    if (snapPointsMode === "fit") {
        return {
            snapPoints: ["fit"],
            snapPointsMode: "fit",
            toExternalIndex: IDENTITY_INDEX,
            toInternalIndex: IDENTITY_INDEX,
        };
    }
    if (snapPoints == null || snapPoints.length === 0) {
        return {
            snapPoints: [100],
            snapPointsMode: "percent",
            toExternalIndex: IDENTITY_INDEX,
            toInternalIndex: IDENTITY_INDEX,
        };
    }
    const hasFitPoint = snapPoints.some((point) => point === "fit");
    const resolvedMode = snapPointsMode ?? (hasFitPoint ? "mixed" : "percent");
    if (resolvedMode === "percent") {
        return normalizeReplicaSheetSnapPointOrder({
            snapPoints: snapPoints.map((point) => typeof point === "string" ? (normalizePercentString(point) ?? point) : point),
            snapPointsMode: "percent",
        });
    }
    return normalizeReplicaSheetSnapPointOrder({
        snapPoints,
        snapPointsMode: resolvedMode,
    });
}
function normalizeReplicaSheetSnapPointOrder({ snapPoints, snapPointsMode, }) {
    if (snapPoints == null ||
        snapPoints.length < 2 ||
        (snapPointsMode !== "percent" && snapPointsMode !== "constant") ||
        !snapPoints.every((point) => typeof point === "number")) {
        return {
            snapPoints,
            snapPointsMode,
            toExternalIndex: IDENTITY_INDEX,
            toInternalIndex: IDENTITY_INDEX,
        };
    }
    const indexedSnapPoints = snapPoints.map((point, originalIndex) => ({
        originalIndex,
        point,
    }));
    const normalizedSnapPoints = [...indexedSnapPoints].sort((left, right) => right.point - left.point);
    if (normalizedSnapPoints.every((entry, normalizedIndex) => entry.originalIndex === normalizedIndex)) {
        return {
            snapPoints,
            snapPointsMode,
            toExternalIndex: IDENTITY_INDEX,
            toInternalIndex: IDENTITY_INDEX,
        };
    }
    const originalToNormalized = new Map();
    const normalizedToOriginal = new Map();
    normalizedSnapPoints.forEach((entry, normalizedIndex) => {
        originalToNormalized.set(entry.originalIndex, normalizedIndex);
        normalizedToOriginal.set(normalizedIndex, entry.originalIndex);
    });
    return {
        snapPoints: normalizedSnapPoints.map((entry) => entry.point),
        snapPointsMode,
        toExternalIndex: (index) => normalizedToOriginal.get(index) ?? index,
        toInternalIndex: (index) => originalToNormalized.get(index) ?? index,
    };
}
export function BottomSheetPanel({ backgroundColor, children, dismissOnOverlayPress = true, disableDrag, enableHandle = true, onAnimationComplete, onOpenChange, onPositionChange, open, overlay = true, overlayPortalHostName, position, snapPoints, snapPointsMode, transition = "200ms", disableRemoveScroll, }) {
    const { snapPoints: resolvedSnapPoints, snapPointsMode: resolvedSnapPointsMode, toExternalIndex, toInternalIndex, } = useMemo(() => resolveReplicaSheetSnapPoints(snapPoints, snapPointsMode), [snapPoints, snapPointsMode]);
    const externalPosition = Number.isFinite(position) ? Math.max(0, Math.round(position)) : 0;
    const resolvedPosition = toInternalIndex(externalPosition);
    const resolvedOnPositionChange = useMemo(() => {
        if (onPositionChange == null) {
            return undefined;
        }
        return (nextPosition) => {
            onPositionChange(toExternalIndex(nextPosition));
        };
    }, [onPositionChange, toExternalIndex]);
    const body = overlayPortalHostName != null ? (_jsx(ScreenOverlayPortalProvider, { hostName: overlayPortalHostName, children: children })) : (children);
    return (_jsxs(ReplicaSheet, { disableDrag: disableDrag, dismissOnOverlayPress: dismissOnOverlayPress, dismissOnSnapToBottom: true, modal: true, onAnimationComplete: onAnimationComplete, onOpenChange: onOpenChange, onPositionChange: resolvedOnPositionChange, open: open, position: resolvedPosition, snapPoints: resolvedSnapPoints, snapPointsMode: resolvedSnapPointsMode, transition: transition, disableRemoveScroll: disableRemoveScroll ?? isWeb(), children: [overlay ? (_jsx(ReplicaSheet.Overlay, { bg: "$shadowColor", enterStyle: DEFAULT_OVERLAY_ENTER_STYLE, exitStyle: DEFAULT_OVERLAY_EXIT_STYLE, opacity: 0.5, transition: "lazy" })) : null, enableHandle ? _jsx(ReplicaSheet.Handle, {}) : null, _jsx(ReplicaSheet.Frame, { style: [styles.content, backgroundColor != null ? { backgroundColor } : null], children: body })] }));
}
const styles = StyleSheet.create({
    content: {
        flex: 1,
        minHeight: 1,
    },
});
