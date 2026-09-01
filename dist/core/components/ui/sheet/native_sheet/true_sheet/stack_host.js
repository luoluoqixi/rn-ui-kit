import { jsx as _jsx } from "react/jsx-runtime";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { isIos26Plus, os } from "../../../utils/platform";
import { withNativeBackButton } from "../../../utils/navigation";
import { ScreenOverlayPortalProvider } from "../../../utils/overlay";
import { useAppBackgroundColors } from "../../../utils/theme";
import { TrueSheetOverlayLayoutProvider } from "./overlay_layout_context";
import { getTrueSheetGestureRootStyle, getTrueSheetStackHostScrollableProps, } from "./platform_sheet_defaults";
import { TrueSheetStackHostProvider } from "./stack_context";
import { TrueSheetStackHeaderCloseButton } from "./stack_header";
import { TrueSheetStackNavigation, createTrueSheetStackNavigationRef, } from "./stack_navigation";
import { trueSheetUsesNativeStackNavigator, } from "./stack_navigator";
import { createTrueSheetOverlayPortalHostName } from "./overlay_host_name";
import { TrueSheetScrollLayoutProvider } from "./true_sheet_scroll_context";
import { useTrueSheetOverlayLayoutSync } from "./use_true_sheet_overlay_layout_sync";
import { TrueSheetScrollableBindingProvider, useTrueSheetScrollableBindingController, } from "./scrollable_binding_context";
const platform = os();
const defaultSheetProps = {
    androidHideFriction: 2,
    androidSignificantVelocityThreshold: 10,
    detents: [1],
    dismissible: true,
    disableStackingTranslation: platform === "android",
    grabber: false,
    insetAdjustment: "automatic",
    ...getTrueSheetStackHostScrollableProps(),
};
/**
 * 具名 True Sheet + 内嵌原生 Stack（替代自绘 header + useState 切屏）。
 * 默认以 `name` 注册独立 overlay host，避免 portal / floating 继续落到外层 sheet 或 app root 坐标系。
 */
function TrueSheetStackHostInner({ children, initialRouteName = "index", name, navigationRef: navigationRefProp, onDidDismiss, onDidPresent, onRequestClose, overlayPortalHostName, headerLeft, headerRightButtonProps, screenOptions, sheetProps, }) {
    const appBackgroundColors = useAppBackgroundColors();
    const navigationRef = navigationRefProp ?? createTrueSheetStackNavigationRef();
    const overlayLayoutSync = useTrueSheetOverlayLayoutSync(sheetProps);
    const customSheetBackHandler = sheetProps?.onBackPress;
    const [presented, setPresented] = useState(false);
    const scrollableBinding = useTrueSheetScrollableBindingController();
    const handleRequestClose = useCallback(() => {
        onRequestClose?.();
    }, [onRequestClose]);
    const handleAndroidBackPress = useCallback(() => {
        if (navigationRef.isReady() && navigationRef.canGoBack()) {
            navigationRef.goBack();
            return true;
        }
        const customHandled = customSheetBackHandler?.();
        if (customHandled !== undefined) {
            return customHandled;
        }
        handleRequestClose();
        return true;
    }, [customSheetBackHandler, handleRequestClose, navigationRef]);
    useEffect(() => {
        if (platform !== "android" || !presented) {
            return;
        }
        // TrueSheet 自身的 Android BackHandler 会先调用原生 dismiss，再触发 onBackPress。
        // 这里在 onDidPresent 后注册，利用 RN 后注册先执行的顺序，先处理内嵌 Stack 返回。
        const subscription = BackHandler.addEventListener("hardwareBackPress", handleAndroidBackPress);
        return () => subscription.remove();
    }, [handleAndroidBackPress, presented]);
    const handleDidDismiss = useCallback((event) => {
        scrollableBinding.setPresented(false);
        setPresented(false);
        if (navigationRef.isReady()) {
            navigationRef.reset({
                index: 0,
                routes: [{ name: initialRouteName }],
            });
        }
        onDidDismiss?.();
        overlayLayoutSync.onDidDismiss(event);
        sheetProps?.onDidDismiss?.(event);
    }, [
        initialRouteName,
        navigationRef,
        onDidDismiss,
        overlayLayoutSync,
        scrollableBinding,
        sheetProps?.onDidDismiss,
    ]);
    const handleDidPresent = useCallback((event) => {
        scrollableBinding.setPresented(true);
        setPresented(true);
        onDidPresent?.();
        overlayLayoutSync.onDidPresent(event);
        sheetProps?.onDidPresent?.(event);
    }, [onDidPresent, overlayLayoutSync, scrollableBinding, sheetProps?.onDidPresent]);
    const handleDetentChange = useCallback((event) => {
        overlayLayoutSync.onDetentChange(event);
        sheetProps?.onDetentChange?.(event);
    }, [overlayLayoutSync, sheetProps?.onDetentChange]);
    const handleDragChange = useCallback((event) => {
        overlayLayoutSync.onDragChange(event);
        sheetProps?.onDragChange?.(event);
    }, [overlayLayoutSync, sheetProps?.onDragChange]);
    const handleDragEnd = useCallback((event) => {
        overlayLayoutSync.onDragEnd(event);
        sheetProps?.onDragEnd?.(event);
    }, [overlayLayoutSync, sheetProps?.onDragEnd]);
    const handlePositionChange = useCallback((event) => {
        overlayLayoutSync.onPositionChange(event);
        sheetProps?.onPositionChange?.(event);
    }, [overlayLayoutSync, sheetProps?.onPositionChange]);
    const handleWillPresent = useCallback((event) => {
        overlayLayoutSync.onWillPresent(event);
        sheetProps?.onWillPresent?.(event);
    }, [overlayLayoutSync, sheetProps?.onWillPresent]);
    const mergedScreenOptions = {
        // iOS Native Stack 会从上一页的 title/headerTitle 推导返回文案。
        ...(trueSheetUsesNativeStackNavigator
            ? {}
            : {
                // Android TrueSheet 使用 JS Stack。用代码图标避免依赖
                // @react-navigation/elements 的 back-icon 多倍率 PNG 资源。
                headerBackImage: ({ tintColor }) => (_jsx(ArrowLeft, { color: tintColor, size: 24 })),
                headerBackTitle: "返回",
            }),
        ...(headerLeft === undefined ? {} : { headerLeft }),
        headerRight: platform === "ios"
            ? () => _jsx(TrueSheetStackHeaderCloseButton, { ...headerRightButtonProps })
            : undefined,
        headerShown: true,
        ...screenOptions,
    };
    const nativeScreenOptions = mergedScreenOptions;
    const resolvedScreenOptions = trueSheetUsesNativeStackNavigator
        ? withNativeBackButton(nativeScreenOptions)
        : mergedScreenOptions;
    const insetAdjustment = sheetProps?.insetAdjustment ?? defaultSheetProps.insetAdjustment;
    // iOS26 以上有透明背景, 默认不用自定义颜色覆盖它
    const resolvedBackgroundColor = sheetProps?.backgroundColor ?? (isIos26Plus() ? undefined : appBackgroundColors.sheet);
    const backgroundStyle = resolvedBackgroundColor != null ? { backgroundColor: resolvedBackgroundColor } : null;
    const resolvedOverlayPortalHostName = createTrueSheetOverlayPortalHostName(overlayPortalHostName ?? `${name}-overlay`);
    const resolvedSheetProps = {
        ...sheetProps,
        backgroundColor: resolvedBackgroundColor,
        style: [
            sheetProps?.style,
            backgroundStyle,
            // React Navigation's web stack has no intrinsic height. TrueSheet Web
            // renders its scrollable content inside a flex container, so the stack
            // content must fill that container explicitly or the sheet appears blank.
            Platform.OS === "web" && styles.webStackContent,
        ],
    };
    const stackNavigation = (_jsx(TrueSheetStackHostProvider, { onRequestClose: handleRequestClose, children: _jsx(TrueSheetStackNavigation, { initialRouteName: initialRouteName, navigationRef: navigationRef, screenOptions: resolvedScreenOptions, children: children }) }));
    const sheetBody = (_jsx(TrueSheetScrollableBindingProvider, { value: scrollableBinding.providerValue, children: _jsx(TrueSheetScrollLayoutProvider, { automaticContentInsetAdjustment: Platform.OS === "ios", insetAdjustment: insetAdjustment, nativeScrollInsetsApplied: false, presentationActive: presented, children: _jsx(GestureHandlerRootView, { style: [styles.gestureRoot, backgroundStyle], children: _jsx(ScreenOverlayPortalProvider, { hostName: resolvedOverlayPortalHostName, children: stackNavigation }) }) }) }));
    return (_jsx(TrueSheet, { ref: scrollableBinding.setSheetRef, name: name, ...defaultSheetProps, ...resolvedSheetProps, onBackPress: customSheetBackHandler, onDetentChange: handleDetentChange, onDidDismiss: handleDidDismiss, onDidPresent: handleDidPresent, onDragChange: handleDragChange, onDragEnd: handleDragEnd, onPositionChange: handlePositionChange, onWillPresent: handleWillPresent, children: sheetBody }));
}
export function TrueSheetStackHost(props) {
    return (_jsx(TrueSheetOverlayLayoutProvider, { children: _jsx(TrueSheetStackHostInner, { ...props }) }));
}
const styles = StyleSheet.create({
    gestureRoot: getTrueSheetGestureRootStyle(),
    webStackContent: {
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: 0,
    },
});
