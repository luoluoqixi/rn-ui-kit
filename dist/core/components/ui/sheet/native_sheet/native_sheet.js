import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { BottomSheetPanel } from "./bottom_sheet";
let nativeSheetCounter = 0;
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
export function NativeSheet({ backgroundColor, children, content, defaultOpen, defaultPosition, dismissOnOverlayPress = true, disableDrag, handle, modal, name, onAnimationComplete, onOpenChange, onPositionChange, open: openProp, overlay, overlayPortalHostName, position: positionProp, snapPoints, snapPointsMode, transition, }) {
    const [generatedSheetName] = useState(() => `ui-sheet-native-${++nativeSheetCounter}`);
    const sheetName = name ?? generatedSheetName;
    const [generatedOverlayPortalHostName] = useState(() => `${sheetName}-overlay`);
    const resolvedOverlayPortalHostName = overlayPortalHostName ?? generatedOverlayPortalHostName;
    const sheetState = useControllableNativeSheetState({
        defaultOpen,
        defaultPosition,
        onOpenChange,
        onPositionChange,
        open: openProp,
        position: positionProp,
    });
    if (modal === false) {
        return null;
    }
    return (_jsx(BottomSheetPanel, { backgroundColor: backgroundColor, dismissOnOverlayPress: dismissOnOverlayPress, disableDrag: disableDrag, enableHandle: handle ?? false, name: sheetName, onAnimationComplete: onAnimationComplete, onOpenChange: sheetState.setOpen, onPositionChange: sheetState.setPosition, open: sheetState.open, overlay: overlay ?? true, overlayPortalHostName: resolvedOverlayPortalHostName, position: sheetState.position, snapPoints: snapPoints, snapPointsMode: snapPointsMode, transition: transition, children: content ?? children }));
}
