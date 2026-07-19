import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { BackHandler } from "react-native";
import { isWeb, os } from "../../utils/platform";
import { useScreenOverlayPortalHost } from "../../utils/screen_overlay_portal";
import { useAppBackgroundColors } from "../../utils/theme";
import { Sheet as ReplicaSheet, SheetController as ReplicaSheetController, useSheet, } from "./replica_sheet/index";
const DEFAULT_OVERLAY_ENTER_STYLE = { opacity: 0 };
const DEFAULT_OVERLAY_EXIT_STYLE = { opacity: 0 };
const DEFAULT_OVERLAY_OPACITY = 1;
const NOOP_HANDLE_PRESS = () => { };
function SheetRoot(props) {
    const { children, containerComponent: ContainerComponent, content, defaultPosition, dismissOnBackPress = true, frameProps, handle, handleProps, modal, onPositionChange, portalProps, overlay, overlayProps, position, scrollView, scrollViewProps, snapPoints, snapPointsMode, ...rootProps } = props;
    const screenOverlayPortalHost = useScreenOverlayPortalHost();
    const resolvedPortalProps = modal === true && screenOverlayPortalHost != null
        ? { ...portalProps, hostName: screenOverlayPortalHost }
        : portalProps;
    const hasDefaultStructure = overlay != null || handle != null || content != null || scrollView != null;
    const resolvedSnapPointsMode = snapPointsMode ?? "percent";
    const stableSnapPoints = useStableSnapPoints(snapPoints);
    const normalizedInputSnapPoints = useMemo(() => {
        if (stableSnapPoints == null ||
            resolvedSnapPointsMode !== "percent" ||
            stableSnapPoints.every((point) => typeof point === "number")) {
            return null;
        }
        const normalized = stableSnapPoints.map((point) => normalizePercentSnapPoint(point));
        return normalized.every(isNormalizedSnapPoint) ? normalized : null;
    }, [resolvedSnapPointsMode, stableSnapPoints]);
    const sortableSnapPoints = normalizedInputSnapPoints ?? stableSnapPoints;
    const snapPointNormalization = useMemo(() => {
        if (sortableSnapPoints == null ||
            sortableSnapPoints.length < 2 ||
            (resolvedSnapPointsMode !== "percent" && resolvedSnapPointsMode !== "constant") ||
            !sortableSnapPoints.every((point) => typeof point === "number")) {
            return null;
        }
        const indexedSnapPoints = sortableSnapPoints.map((point, originalIndex) => ({
            originalIndex,
            point,
        }));
        const normalizedSnapPoints = [...indexedSnapPoints].sort((left, right) => right.point - left.point);
        if (normalizedSnapPoints.every((entry, normalizedIndex) => entry.originalIndex === normalizedIndex)) {
            return null;
        }
        const originalToNormalized = new Map();
        const normalizedToOriginal = new Map();
        normalizedSnapPoints.forEach((entry, normalizedIndex) => {
            originalToNormalized.set(entry.originalIndex, normalizedIndex);
            normalizedToOriginal.set(normalizedIndex, entry.originalIndex);
        });
        return {
            snapPoints: normalizedSnapPoints.map((entry) => entry.point),
            toExternalIndex: (index) => normalizedToOriginal.get(index) ?? index,
            toInternalIndex: (index) => originalToNormalized.get(index) ?? index,
        };
    }, [resolvedSnapPointsMode, sortableSnapPoints]);
    const resolvedSnapPoints = snapPointNormalization?.snapPoints ?? normalizedInputSnapPoints ?? stableSnapPoints;
    const resolvedHandleProps = handleProps?.onPress == null && os() === "android"
        ? { ...handleProps, onPress: NOOP_HANDLE_PRESS }
        : handleProps;
    const resolvedOverlayProps = modal === true && overlayProps?.opacity == null
        ? { ...overlayProps, opacity: DEFAULT_OVERLAY_OPACITY }
        : overlayProps;
    const resolvedOnPositionChange = useMemo(() => {
        if (onPositionChange == null) {
            return undefined;
        }
        if (snapPointNormalization == null) {
            return onPositionChange;
        }
        return (nextPosition) => {
            onPositionChange(snapPointNormalization.toExternalIndex(nextPosition));
        };
    }, [onPositionChange, snapPointNormalization]);
    const resolvedRootProps = {
        disableRemoveScroll: isWeb(),
        ...rootProps,
        ...(resolvedPortalProps != null ? { portalProps: resolvedPortalProps } : null),
        ...(defaultPosition != null
            ? {
                defaultPosition: snapPointNormalization?.toInternalIndex(defaultPosition) ?? defaultPosition,
            }
            : null),
        ...(modal != null ? { modal } : null),
        ...(resolvedOnPositionChange != null ? { onPositionChange: resolvedOnPositionChange } : null),
        ...(position != null
            ? { position: snapPointNormalization?.toInternalIndex(position) ?? position }
            : null),
        ...(resolvedSnapPoints != null ? { snapPoints: resolvedSnapPoints } : null),
        ...(snapPointsMode != null ? { snapPointsMode } : null),
        ...(modal || ContainerComponent == null ? { containerComponent: ContainerComponent } : null),
    };
    const structuredChildren = !hasDefaultStructure ? (_jsx(_Fragment, { children: children })) : (_jsxs(_Fragment, { children: [overlay ? _jsx(SheetOverlay, { ...resolvedOverlayProps }) : null, handle ? _jsx(SheetHandle, { ...resolvedHandleProps }) : null, _jsx(SheetFrame, { ...frameProps, children: scrollView ? _jsx(SheetScrollView, { ...scrollViewProps, children: content }) : content }), children] }));
    const sheet = !hasDefaultStructure ? (_jsxs(ReplicaSheet, { ...resolvedRootProps, children: [_jsx(SheetBackHandler, { dismissOnBackPress: dismissOnBackPress }), children] })) : (_jsxs(ReplicaSheet, { ...resolvedRootProps, children: [_jsx(SheetBackHandler, { dismissOnBackPress: dismissOnBackPress }), structuredChildren] }));
    if (ContainerComponent != null && modal !== true) {
        return _jsx(ContainerComponent, { children: sheet });
    }
    return sheet;
}
function normalizePercentSnapPoint(point) {
    if (typeof point === "number") {
        return Number.isFinite(point) ? point : null;
    }
    const matchedPercent = point.trim().match(/^(\d+(?:\.\d+)?)%$/);
    return matchedPercent == null ? null : Number.parseFloat(matchedPercent[1]);
}
function isNormalizedSnapPoint(point) {
    return point != null;
}
function useStableSnapPoints(points) {
    const stableRef = useRef(points);
    if (!areSnapPointsEqual(stableRef.current, points)) {
        stableRef.current = points;
    }
    return stableRef.current;
}
function areSnapPointsEqual(left, right) {
    if (left === right) {
        return true;
    }
    if (left == null || right == null || left.length !== right.length) {
        return false;
    }
    return left.every((point, index) => point === right[index]);
}
function SheetControlled(props) {
    return _jsx(ReplicaSheet.Controlled, { ...props });
}
function SheetController(props) {
    return _jsx(ReplicaSheetController, { ...props });
}
function SheetFrame(props) {
    const { style, ...frameProps } = props;
    const appBackgroundColors = useAppBackgroundColors();
    return (_jsx(ReplicaSheet.Frame, { ...frameProps, style: [{ backgroundColor: appBackgroundColors.sheet }, style] }));
}
function SheetOverlay(props) {
    return (_jsx(ReplicaSheet.Overlay, { ...props, bg: props.bg ?? "$shadowColor", enterStyle: props.enterStyle ?? DEFAULT_OVERLAY_ENTER_STYLE, exitStyle: props.exitStyle ?? DEFAULT_OVERLAY_EXIT_STYLE, opacity: props.opacity ?? DEFAULT_OVERLAY_OPACITY, transition: props.transition ?? "lazy" }));
}
function SheetHandle(props) {
    return _jsx(ReplicaSheet.Handle, { ...props });
}
const SheetScrollView = forwardRef((props, ref) => _jsx(ReplicaSheet.ScrollView, { ref: ref, ...props }));
SheetScrollView.displayName = "SheetScrollView";
function SheetBackHandler(props) {
    const { dismissOnBackPress = true } = props;
    const { open, setOpen } = useSheet();
    useEffect(() => {
        if (os() !== "android" || !dismissOnBackPress || !open) {
            return;
        }
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            setOpen(false);
            return true;
        });
        return () => {
            subscription.remove();
        };
    }, [dismissOnBackPress, open, setOpen]);
    return null;
}
export const Sheet = Object.assign(SheetRoot, {
    Controlled: SheetControlled,
    Controller: SheetController,
    Frame: SheetFrame,
    Overlay: SheetOverlay,
    Handle: SheetHandle,
    ScrollView: SheetScrollView,
});
