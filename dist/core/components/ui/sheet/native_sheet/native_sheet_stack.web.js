import { jsx as _jsx } from "react/jsx-runtime";
import { useTrueSheet } from "@lodev09/react-native-true-sheet";
import { useEffect, useRef, useState } from "react";
import { TrueSheetStackHost } from "./true_sheet/stack_host";
import { TrueSheetInnerStack } from "./true_sheet/stack_navigation";
import { useHasOpenWebSheetAbove } from "./web_sheet_stack";
let nativeSheetStackCounter = 0;
function resolveWebStackDetents(detents, snapPoints) {
    if (detents != null && detents.length > 0) {
        return detents.slice(0, 3);
    }
    const sourceSnapPoints = snapPoints == null || snapPoints.length === 0 ? [1] : snapPoints;
    const resolvedDetents = [];
    for (const point of sourceSnapPoints.slice(0, 3)) {
        if (typeof point === "number") {
            resolvedDetents.push(Math.max(0.01, Math.min(1, point)));
            continue;
        }
        const percent = point.trim().match(/^(\d+(?:\.\d+)?)%$/);
        if (percent != null) {
            resolvedDetents.push(Math.max(0.01, Math.min(1, Number.parseFloat(percent[1]) / 100)));
        }
    }
    return resolvedDetents.length > 0 ? resolvedDetents : [1];
}
function NativeSheetStackRoot({ children, initialRouteName = "index", name, onOpenChange, open = false, overlayPortalHostName, headerLeft, headerRightButtonProps, screenOptions, sheetProps, }) {
    const { present, dismiss } = useTrueSheet();
    const [generatedName] = useState(() => `ui-sheet-stack-web-${++nativeSheetStackCounter}`);
    const sheetName = name ?? generatedName;
    const hasOpenSheetAbove = useHasOpenWebSheetAbove(sheetName, open);
    const firstRenderRef = useRef(true);
    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        if (open) {
            void present(sheetName, sheetProps?.initialDetentIndex ?? 0).catch(() => undefined);
        }
        else {
            void dismiss(sheetName).catch(() => undefined);
        }
    }, [dismiss, open, present, sheetName, sheetProps?.initialDetentIndex]);
    if (sheetProps == null) {
        return (_jsx(TrueSheetStackHost, { initialRouteName: initialRouteName, name: sheetName, onRequestClose: () => onOpenChange?.(false), onDidDismiss: () => onOpenChange?.(false), overlayPortalHostName: overlayPortalHostName, headerLeft: headerLeft, headerRightButtonProps: headerRightButtonProps, screenOptions: screenOptions, sheetProps: {
                dismissible: hasOpenSheetAbove ? false : undefined,
                initialDetentIndex: open ? 0 : -1,
            }, children: children }));
    }
    const { detents: directDetents, snapPoints, ...trueSheetProps } = sheetProps;
    const detents = resolveWebStackDetents(directDetents, snapPoints);
    const resolvedDismissible = trueSheetProps.dismissible === false || hasOpenSheetAbove ? false : trueSheetProps.dismissible;
    return (_jsx(TrueSheetStackHost, { initialRouteName: initialRouteName, name: sheetName, onRequestClose: () => onOpenChange?.(false), onDidDismiss: () => onOpenChange?.(false), overlayPortalHostName: overlayPortalHostName, headerLeft: headerLeft, headerRightButtonProps: headerRightButtonProps, screenOptions: screenOptions, sheetProps: {
            ...trueSheetProps,
            detents,
            dismissible: resolvedDismissible,
            initialDetentIndex: open ? (trueSheetProps.initialDetentIndex ?? 0) : -1,
        }, children: children }));
}
// Keep the compound API identical to native platforms. Web uses the JS stack,
// so its Screen component must be registered as a direct child of that navigator.
export const NativeSheetStack = Object.assign(NativeSheetStackRoot, {
    Screen: TrueSheetInnerStack.Screen,
});
