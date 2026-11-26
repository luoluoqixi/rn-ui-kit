import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { TrueSheetStackHost } from "./true_sheet/stack_host";
import { TrueSheetInnerStack } from "./true_sheet/stack_navigation";
import { useWebSheetCommands } from "./web_sheet_commands";
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
function NativeSheetStackRoot({ children, initialRouteName = "index", name, onOpenChange, open = false, overlayPortalHostName, headerLeft, headerLeftButtonProps, headerLeftItems, headerRight, headerRightButtonProps, headerRightButtonVisible, headerRightItems, screenOptions, sheetProps, }) {
    const [generatedName] = useState(() => `ui-sheet-stack-web-${++nativeSheetStackCounter}`);
    const sheetName = name ?? generatedName;
    const hasOpenSheetAbove = useHasOpenWebSheetAbove(sheetName, open);
    const commands = useWebSheetCommands(sheetName, open, Math.max(0, sheetProps?.initialDetentIndex ?? 0), true, sheetProps?.initialDetentIndex);
    const handleDidDismiss = () => {
        if (commands.queue.didDismiss())
            onOpenChange?.(false);
    };
    if (sheetProps == null) {
        return (_jsx(TrueSheetStackHost, { initialRouteName: initialRouteName, name: sheetName, onRequestClose: () => onOpenChange?.(false), onDidDismiss: handleDidDismiss, overlayPortalHostName: overlayPortalHostName, headerLeft: headerLeft, headerLeftButtonProps: headerLeftButtonProps, headerLeftItems: headerLeftItems, headerRight: headerRight, headerRightButtonProps: headerRightButtonProps, headerRightButtonVisible: headerRightButtonVisible, headerRightItems: headerRightItems, screenOptions: screenOptions, sheetProps: {
                dismissible: hasOpenSheetAbove ? false : undefined,
                initialDetentIndex: commands.initialIndex,
                onDidPresent: (event) => commands.queue.didPresent(event.nativeEvent.index),
            }, children: children }));
    }
    const { detents: directDetents, snapPoints, ...trueSheetProps } = sheetProps;
    const detents = resolveWebStackDetents(directDetents, snapPoints);
    const resolvedDismissible = trueSheetProps.dismissible === false || hasOpenSheetAbove ? false : trueSheetProps.dismissible;
    return (_jsx(TrueSheetStackHost, { initialRouteName: initialRouteName, name: sheetName, onRequestClose: () => onOpenChange?.(false), onDidDismiss: handleDidDismiss, overlayPortalHostName: overlayPortalHostName, headerLeft: headerLeft, headerLeftButtonProps: headerLeftButtonProps, headerLeftItems: headerLeftItems, headerRight: headerRight, headerRightButtonProps: headerRightButtonProps, headerRightButtonVisible: headerRightButtonVisible, headerRightItems: headerRightItems, screenOptions: screenOptions, sheetProps: {
            ...trueSheetProps,
            detents,
            dismissible: resolvedDismissible,
            initialDetentIndex: commands.initialIndex,
            onDidPresent: (event) => {
                commands.queue.didPresent(event.nativeEvent.index);
                trueSheetProps.onDidPresent?.(event);
            },
        }, children: children }));
}
// Keep the compound API identical to native platforms. Web uses the JS stack,
// so its Screen component must be registered as a direct child of that navigator.
export const NativeSheetStack = Object.assign(NativeSheetStackRoot, {
    Screen: TrueSheetInnerStack.Screen,
});
