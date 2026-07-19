import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as TamaguiPortal from "@tamagui/portal";
import { createContext, useCallback, useContext, useMemo, useState, } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalHost as TeleportPortalHost } from "react-native-teleport";
import { iosMajorVersion, isWeb, os } from "./platform";
import { useTrueSheetOverlayDetent, useTrueSheetOverlaySheetTopPosition, } from "../sheet/native_sheet/true_sheet/overlay_layout_context";
import { TRUE_SHEET_TOAST_DETENT_LIFT, getTrueSheetOverlayLayoutBottomInset, shouldApplyIosTrueSheetToastLayerInset, } from "../sheet/native_sheet/true_sheet/overlay_toast_layout";
import { Toaster } from "../toast/toaster";
import { ScreenOverlayFloatingProvider } from "./screen_overlay_floating";
const ScreenOverlayPortalContext = createContext(null);
const ScreenOverlayModalLockContext = createContext(0);
const ScreenOverlayModalLockApiContext = createContext(null);
const RuntimePortalRootHostProvider = TamaguiPortal.PortalRootHostProvider;
function PortalRootHostProviderCompat({ children, hostName }) {
    if (RuntimePortalRootHostProvider == null) {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsx(RuntimePortalRootHostProvider, { hostName: hostName, children: children }));
}
/**
 * 在独立原生层（iOS pageSheet VC、Android True Sheet 等）内挂载 overlay Portal。
 * Tamagui modal 默认 teleport 到 app root 会落在 sheet 下面；此处用 react-native-teleport 抬到当前层之上。
 *
 * - `wrap`：子内容与 teleport 层包在同一 flex 容器（默认）。
 * - `scroll-sibling`：子内容（通常为 ScrollView）与 teleport 层并列，避免 TrueSheet 无法钉住滚动视图（iOS 嵌套 Sheet）。
 */
export function ScreenOverlayPortalProvider({ children, hostName, overlayLayout = "wrap", }) {
    const [modalLockCount, setModalLockCount] = useState(0);
    const [teleportHostNode, setTeleportHostNode] = useState(null);
    const handleTeleportHostNode = useCallback((node) => {
        setTeleportHostNode(node);
    }, []);
    const lockApi = useMemo(() => ({
        acquire: () => {
            setModalLockCount((count) => count + 1);
        },
        release: () => {
            setModalLockCount((count) => Math.max(0, count - 1));
        },
    }), []);
    const portalHost = (_jsx(ScreenOverlayPortalHost, { hostName: hostName, onTeleportHostNode: handleTeleportHostNode }));
    const portalBody = overlayLayout === "scroll-sibling" ? (_jsxs(_Fragment, { children: [children, portalHost] })) : (_jsxs(View, { style: styles.root, children: [children, portalHost] }));
    return (_jsx(ScreenOverlayPortalContext.Provider, { value: hostName, children: _jsx(ScreenOverlayModalLockApiContext.Provider, { value: lockApi, children: _jsx(ScreenOverlayModalLockContext.Provider, { value: modalLockCount, children: _jsx(ScreenOverlayFloatingProvider, { teleportHostNode: teleportHostNode, children: _jsx(PortalRootHostProviderCompat, { hostName: hostName, children: portalBody }) }) }) }) }));
}
function OverlayToastLayer({ hostName, hostStackHeight, }) {
    const insets = useSafeAreaInsets();
    const detent = useTrueSheetOverlayDetent();
    const sheetTopPosition = useTrueSheetOverlaySheetTopPosition();
    // iOS 安全区底部补偿
    const bottomInset = shouldApplyIosTrueSheetToastLayerInset(hostName)
        ? getTrueSheetOverlayLayoutBottomInset(hostName, insets.bottom, detent)
        : 0;
    // 局部 detent：hostStack 被 ScrollView 撑到完整内容高度，
    // 而 Sheet 只显示顶部一部分。
    // 用 sheetTopPosition 获取 Sheet 当前实际可视高度，
    // 直接相减得到被隐藏的底部偏移量，再加固定 lift 补偿参考点偏差。
    // iOS 15 不支持自定义 detent（只有 medium/large），跳过此计算避免位置偏上。
    const isIOS15 = os() === "ios" && iosMajorVersion() === 15;
    const canPartialDetent = !isIOS15;
    const screenHeight = Dimensions.get("window").height;
    const detentVisibleOffset = hostName != null &&
        canPartialDetent &&
        detent < 1 &&
        sheetTopPosition != null &&
        hostStackHeight > 0
        ? Math.max(0, Math.round(hostStackHeight - (screenHeight - sheetTopPosition) + TRUE_SHEET_TOAST_DETENT_LIFT))
        : 0;
    const bottom = Math.max(bottomInset, detentVisibleOffset);
    const layerStyle = bottom > 0 ? [styles.toastLayer, { bottom }] : styles.toastLayer;
    return (_jsx(View, { pointerEvents: "box-none", style: layerStyle, children: _jsx(Toaster, { viewportName: hostName }) }));
}
function OverlayTeleportLayer({ hostName, onTeleportHostNode, }) {
    const handleHostRef = useCallback((node) => {
        onTeleportHostNode(node);
    }, [onTeleportHostNode]);
    return (_jsx(View, { collapsable: false, style: styles.teleportLayer, children: _jsx(View, { ref: handleHostRef, collapsable: false, pointerEvents: "box-none", style: styles.teleportHost, children: _jsx(TeleportPortalHost, { name: hostName, style: styles.teleportHostFill }) }) }));
}
export function ScreenOverlayPortalHost({ hostName, onTeleportHostNode, }) {
    const [hostStackHeight, setHostStackHeight] = useState(0);
    const handleHostStackLayout = useCallback((event) => {
        setHostStackHeight(event.nativeEvent.layout.height);
    }, []);
    return (_jsxs(View, { pointerEvents: "box-none", style: styles.hostStack, onLayout: handleHostStackLayout, children: [_jsx(OverlayToastLayer, { hostName: hostName, hostStackHeight: hostStackHeight }), !isWeb() && (_jsx(OverlayTeleportLayer, { hostName: hostName, onTeleportHostNode: onTeleportHostNode }))] }));
}
export function useScreenOverlayPortalHost() {
    return useContext(ScreenOverlayPortalContext);
}
/** 在 ScreenOverlayPortalProvider 子树内时返回 host，供 Toast / modal Sheet 等使用（不限 iOS）。 */
export function useScopedOverlayPortalHostName() {
    const host = useScreenOverlayPortalHost();
    return host ?? undefined;
}
/** overlay 子树内 Tamagui modal Sheet 打开时为 true，用于冻结底层 ScrollView（如 iOS pageSheet）。 */
export function useScreenOverlayModalLockActive() {
    const modalLockCount = useContext(ScreenOverlayModalLockContext);
    const host = useScreenOverlayPortalHost();
    return host != null && modalLockCount > 0 && os() === "ios";
}
export function useScreenOverlayModalLockApi() {
    return useContext(ScreenOverlayModalLockApiContext);
}
const styles = StyleSheet.create({
    root: {
        flex: 1,
        minHeight: 1,
        position: "relative",
    },
    hostStack: {
        bottom: 0,
        left: 0,
        pointerEvents: "box-none",
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 1_000_000,
    },
    toastLayer: {
        bottom: 0,
        left: 0,
        pointerEvents: "box-none",
        position: "absolute",
        right: 0,
        zIndex: 1,
    },
    teleportLayer: {
        bottom: 0,
        left: 0,
        pointerEvents: "box-none",
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 2,
    },
    teleportHost: {
        bottom: 0,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
    },
    teleportHostFill: {
        flex: 1,
    },
});
