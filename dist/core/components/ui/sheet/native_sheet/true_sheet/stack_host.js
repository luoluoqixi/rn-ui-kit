import { jsx as _jsx } from "react/jsx-runtime";
import { TrueSheetAutoStackLayoutProvider } from "./auto_stack_layout_context";
import { SheetContentScope } from "./sheet_content_scope";
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, Platform, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { isIos26Plus, os } from "../../../utils/platform";
import { withNativeBackButton } from "../../../utils/navigation";
import { ScreenOverlayPortalProvider } from "../../../utils/overlay";
import { useAppBackgroundColors, useUiTheme } from "../../../utils/theme";
import { TrueSheetOverlayLayoutProvider } from "./overlay_layout_context";
import { getTrueSheetGestureRootStyle, isTrueSheetAutoDetent, mergeTrueSheetContentStyle, shouldUseTrueSheetNativeScrollInsets, getTrueSheetStackHostScrollableProps, } from "./platform_sheet_defaults";
import { TrueSheetStackHostProvider } from "./stack_context";
import { TrueSheetStackCustomHeaderButton } from "./stack_header";
import { createTrueSheetStackNativeHeaderButton } from "./stack_header_button";
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
    placement: "center",
    insetAdjustment: "automatic",
    ...getTrueSheetStackHostScrollableProps(),
};
/**
 * 具名 True Sheet + 内嵌原生 Stack（替代自绘 header + useState 切屏）。
 * 默认以 `name` 注册独立 overlay host，避免 portal / floating 继续落到外层 sheet 或 app root 坐标系。
 */
function TrueSheetStackHostInner({ children, initialRouteName = "index", name, navigationRef: navigationRefProp, onDidDismiss, onDidPresent, onRequestClose, overlayPortalHostName, headerLeft, headerLeftButtonProps, headerLeftItems, headerRight, headerRightButtonProps, headerRightButtonVisible, headerRightItems, screenOptions, sheetProps, }) {
    const appBackgroundColors = useAppBackgroundColors();
    const theme = useUiTheme();
    const navigationRef = navigationRefProp ?? createTrueSheetStackNavigationRef();
    const overlayLayoutSync = useTrueSheetOverlayLayoutSync();
    const customSheetBackHandler = sheetProps?.onBackPress;
    const [presented, setPresented] = useState(false);
    const [activeDetentIndex, setActiveDetentIndex] = useState(Math.max(0, sheetProps?.initialDetentIndex ?? 0));
    const [naturalStackHeight, setNaturalStackHeight] = useState();
    const { height: windowHeight } = useWindowDimensions();
    const autoDetent = isTrueSheetAutoDetent(sheetProps?.detents ?? [1], activeDetentIndex);
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
        setActiveDetentIndex(event.nativeEvent.index);
        overlayLayoutSync.onDidPresent(event);
        sheetProps?.onDidPresent?.(event);
    }, [onDidPresent, overlayLayoutSync, scrollableBinding, sheetProps?.onDidPresent]);
    const handleDetentChange = useCallback((event) => {
        setActiveDetentIndex(event.nativeEvent.index);
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
        setActiveDetentIndex(event.nativeEvent.index);
        overlayLayoutSync.onWillPresent(event);
        sheetProps?.onWillPresent?.(event);
    }, [overlayLayoutSync, sheetProps?.onWillPresent]);
    const customHeaderLeft = headerLeftButtonProps == null
        ? headerLeft
        : () => (_jsx(TrueSheetStackCustomHeaderButton, { buttonProps: headerLeftButtonProps, defaultCloseSheetOnPress: false, defaultLabel: "\u64CD\u4F5C", onRequestClose: handleRequestClose }));
    const shouldShowDefaultHeaderRightButton = headerRightButtonVisible ?? platform === "ios";
    const customHeaderRight = headerRightButtonProps != null
        ? shouldShowDefaultHeaderRightButton
            ? () => (_jsx(TrueSheetStackCustomHeaderButton, { buttonProps: headerRightButtonProps, defaultCloseSheetOnPress: true, defaultLabel: "\u5173\u95ED", onRequestClose: handleRequestClose }))
            : headerRight
        : headerRight ??
            (shouldShowDefaultHeaderRightButton
                ? () => (_jsx(TrueSheetStackCustomHeaderButton, { defaultCloseSheetOnPress: true, defaultLabel: "\u5173\u95ED", onRequestClose: handleRequestClose }))
                : undefined);
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
        ...(platform === "ios" || customHeaderLeft === undefined
            ? {}
            : { headerLeft: customHeaderLeft }),
        ...(platform === "ios" || customHeaderRight === undefined
            ? {}
            : { headerRight: customHeaderRight }),
        headerShown: true,
        headerTintColor: theme.accent,
        headerTitleStyle: { color: theme.foreground },
        ...screenOptions,
    };
    const nativeScreenOptions = mergedScreenOptions;
    const configuredHeaderLeftItems = headerLeftItems ?? nativeScreenOptions.unstable_headerLeftItems;
    const configuredHeaderRightItems = headerRightItems ?? nativeScreenOptions.unstable_headerRightItems;
    const resolvedNativeScreenOptions = {
        ...nativeScreenOptions,
        ...(configuredHeaderLeftItems != null
            ? { unstable_headerLeftItems: configuredHeaderLeftItems }
            : headerLeftButtonProps != null
                ? {
                    unstable_headerLeftItems: ({ tintColor }) => [
                        createTrueSheetStackNativeHeaderButton({
                            buttonProps: headerLeftButtonProps,
                            defaultCloseSheetOnPress: false,
                            defaultLabel: "操作",
                            headerTintColor: tintColor,
                            onRequestClose: handleRequestClose,
                        }),
                    ],
                }
                : {}),
        ...(configuredHeaderRightItems != null
            ? { unstable_headerRightItems: configuredHeaderRightItems }
            : shouldShowDefaultHeaderRightButton
                ? {
                    unstable_headerRightItems: ({ tintColor }) => [
                        createTrueSheetStackNativeHeaderButton({
                            buttonProps: headerRightButtonProps,
                            defaultCloseSheetOnPress: true,
                            defaultLabel: "关闭",
                            headerTintColor: tintColor,
                            onRequestClose: handleRequestClose,
                        }),
                    ],
                }
                : {}),
    };
    const resolvedScreenOptions = trueSheetUsesNativeStackNavigator
        ? withNativeBackButton(resolvedNativeScreenOptions)
        : mergedScreenOptions;
    const insetAdjustment = sheetProps?.insetAdjustment ?? defaultSheetProps.insetAdjustment;
    // iOS26 以上有透明背景, 默认不用自定义颜色覆盖它
    const resolvedBackgroundColor = sheetProps?.backgroundColor ?? (isIos26Plus() ? undefined : appBackgroundColors.sheet);
    const backgroundStyle = resolvedBackgroundColor != null ? { backgroundColor: resolvedBackgroundColor } : null;
    const resolvedOverlayPortalHostName = createTrueSheetOverlayPortalHostName(overlayPortalHostName ?? `${name}-overlay`);
    const resolvedSheetProps = {
        ...sheetProps,
        backgroundColor: resolvedBackgroundColor,
        backgroundStyle: [sheetProps?.backgroundBlur ? backgroundStyle : null, sheetProps?.backgroundStyle],
        style: mergeTrueSheetContentStyle(sheetProps?.scrollable ?? true, sheetProps?.style, autoDetent),
    };
    const stackNavigation = (_jsx(TrueSheetStackHostProvider, { onRequestClose: handleRequestClose, children: _jsx(TrueSheetStackNavigation, { initialRouteName: initialRouteName, navigationRef: navigationRef, screenOptions: resolvedScreenOptions, children: children }) }));
    const sheetBody = (_jsx(TrueSheetScrollableBindingProvider, { value: scrollableBinding.providerValue, children: _jsx(TrueSheetScrollLayoutProvider, { autoDetent: autoDetent, automaticContentInsetAdjustment: Platform.OS === "ios", insetAdjustment: insetAdjustment, nativeScrollInsetsApplied: shouldUseTrueSheetNativeScrollInsets(sheetProps?.scrollable ?? true), presentationActive: presented, children: _jsx(GestureHandlerRootView, { style: getTrueSheetGestureRootStyle(autoDetent), children: _jsx(ScreenOverlayPortalProvider, { hostName: resolvedOverlayPortalHostName, toastPortalActive: presented, children: _jsx(TrueSheetAutoStackLayoutProvider, { onHeightChange: setNaturalStackHeight, children: _jsx(View, { style: autoDetent ? { height: naturalStackHeight ?? windowHeight, flexShrink: 1, minHeight: 0 } : { flex: 1, minHeight: 0 }, children: stackNavigation }) }) }) }) }) }));
    return (_jsx(TrueSheet, { name: name, ...defaultSheetProps, ...resolvedSheetProps, onBackPress: customSheetBackHandler, scrollableRef: sheetProps?.scrollableRef ?? (sheetProps?.scrollable === false ? undefined : scrollableBinding.scrollableRef), placement: sheetProps?.placement ?? (sheetProps?.anchor === "left" ? "leading" : sheetProps?.anchor === "right" ? "trailing" : sheetProps?.anchor ?? "center"), footerOptions: { position: "absolute", ...sheetProps?.footerOptions }, onDetentChange: handleDetentChange, onDidDismiss: handleDidDismiss, onDidPresent: handleDidPresent, onDragChange: handleDragChange, onDragEnd: handleDragEnd, onPositionChange: handlePositionChange, onWillPresent: handleWillPresent, children: _jsx(SheetContentScope, { dismissOnOverlayPress: resolvedSheetProps.dismissible !== false, onRequestClose: handleRequestClose, children: sheetBody }) }));
}
export function TrueSheetStackHost(props) {
    return (_jsx(TrueSheetOverlayLayoutProvider, { children: _jsx(TrueSheetStackHostInner, { ...props }) }));
}
