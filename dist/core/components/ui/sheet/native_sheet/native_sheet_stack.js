import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { BottomSheetStackHostProvider } from "./bottom_sheet/stack_context";
import { BottomSheetStackHeaderCloseButton } from "./bottom_sheet/stack_header";
import { BottomSheetInnerStack, BottomSheetStackNavigation, createBottomSheetStackNavigationRef, } from "./bottom_sheet/stack_navigation";
import { NativeSheet } from "./native_sheet";
function NativeSheetStackRoot({ children, initialRouteName = "index", name, onOpenChange, open = false, overlayPortalHostName, screenOptions, sheetProps, }) {
    const [navigationRef] = useState(() => createBottomSheetStackNavigationRef());
    const mergedScreenOptions = useMemo(() => ({
        headerBackTitle: "返回",
        headerRight: () => _jsx(BottomSheetStackHeaderCloseButton, { title: "\u5173\u95ED" }),
        headerShown: true,
        ...screenOptions,
    }), [screenOptions]);
    useEffect(() => {
        if (open || !navigationRef.isReady()) {
            return;
        }
        navigationRef.reset({
            index: 0,
            routes: [{ name: initialRouteName }],
        });
    }, [initialRouteName, navigationRef, open]);
    return (_jsx(NativeSheet, { handle: sheetProps?.grabber, name: name, onOpenChange: onOpenChange, open: open, overlayPortalHostName: overlayPortalHostName, position: 0, snapPoints: sheetProps?.snapPoints, snapPointsMode: sheetProps?.snapPointsMode, children: _jsx(BottomSheetStackHostProvider, { onRequestClose: () => onOpenChange?.(false), children: _jsx(BottomSheetStackNavigation, { initialRouteName: initialRouteName, navigationRef: navigationRef, screenOptions: mergedScreenOptions, children: children }) }) }));
}
export const NativeSheetStack = Object.assign(NativeSheetStackRoot, {
    Screen: BottomSheetInnerStack.Screen,
});
