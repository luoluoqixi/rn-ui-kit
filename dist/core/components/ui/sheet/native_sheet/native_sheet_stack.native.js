import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { clampDetentIndex, resolveNativeDetents } from "./native_sheet.native";
import { dismissTrueSheet } from "./true_sheet";
import { createTrueSheetOverlayPortalHostName } from "./true_sheet/overlay_host_name";
import { TrueSheetStackHost } from "./true_sheet/stack_host";
import { TrueSheetInnerStack, createTrueSheetStackNavigationRef, } from "./true_sheet/stack_navigation";
function TrueSheetNativeSheetStackRoot({ children, initialRouteName = "index", name, onOpenChange, open = false, overlayPortalHostName, screenOptions, sheetProps, }) {
    const { height: windowHeight } = useWindowDimensions();
    const [sheetName] = useState(() => name ?? "native-sheet-stack");
    const [generatedOverlayPortalHostName] = useState(() => createTrueSheetOverlayPortalHostName(`${sheetName}-overlay`));
    const resolvedOverlayPortalHostName = createTrueSheetOverlayPortalHostName(overlayPortalHostName ?? generatedOverlayPortalHostName);
    const [navigationRef] = useState(() => createTrueSheetStackNavigationRef());
    const [mounted, setMounted] = useState(open);
    const presentedRef = useRef(false);
    const dismissingRef = useRef(false);
    const resolvedSheetProps = useMemo(() => {
        const { snapPoints, snapPointsMode, ...trueSheetProps } = sheetProps ?? {};
        if (snapPoints == null && snapPointsMode == null) {
            return { initialDetentIndex: 0, ...trueSheetProps };
        }
        const normalization = resolveNativeDetents(snapPoints, snapPointsMode, windowHeight);
        const sourceIndex = clampDetentIndex(trueSheetProps.initialDetentIndex, normalization.sourceDetentCount);
        const nativeIndex = clampDetentIndex(normalization.toNativeIndex(sourceIndex), normalization.detents.length);
        return {
            ...trueSheetProps,
            detents: normalization.detents,
            initialDetentIndex: nativeIndex,
        };
    }, [sheetProps, windowHeight]);
    useEffect(() => {
        if (open) {
            if (mounted || dismissingRef.current) {
                return;
            }
            dismissingRef.current = false;
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
    }, [mounted, open, sheetName]);
    if (!mounted) {
        return null;
    }
    return (_jsx(TrueSheetStackHost, { initialRouteName: initialRouteName, name: sheetName, navigationRef: navigationRef, onDidDismiss: () => {
            presentedRef.current = false;
            dismissingRef.current = false;
            setMounted(false);
            onOpenChange?.(false);
        }, onDidPresent: () => {
            presentedRef.current = true;
            dismissingRef.current = false;
        }, onRequestClose: () => {
            onOpenChange?.(false);
        }, overlayPortalHostName: resolvedOverlayPortalHostName, screenOptions: screenOptions, sheetProps: resolvedSheetProps, children: children }));
}
export const NativeSheetStack = Object.assign(TrueSheetNativeSheetStackRoot, {
    Screen: TrueSheetInnerStack.Screen,
});
