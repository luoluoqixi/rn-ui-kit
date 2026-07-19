import { jsx as _jsx } from "react/jsx-runtime";
import { NativePortal, getPortal } from "@tamagui/native";
import { PortalItem, resolveViewZIndex } from "@tamagui/portal";
import { useStackedZIndex } from "@tamagui/z-index-stack";
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
const IOS_MODAL_PORTAL_CLOSE_DELAY_MS = 320;
/**
 * Tamagui `Portal` 在 native 上写死 `hostName="root"`。
 * 非 root overlay host（iOS pageSheet、Android True Sheet 等）走透明 Modal，
 * 避免 teleport 落点高度为 0 或手势被外层 sheet 吞掉。
 */
export function SheetPortal(props) {
    const { active = true, children, hostName = "root", onRequestClose, passThrough, stackZIndex, zIndex, } = props;
    const stackedZIndex = useStackedZIndex({
        stackZIndex,
        zIndex: resolveViewZIndex(zIndex),
    });
    const contents = (_jsx(View, { pointerEvents: "box-none", style: [styles.portalLayer, { zIndex: stackedZIndex }], children: children }));
    const useScopedOverlayHost = hostName !== "root";
    const useScopedModalHost = useScopedOverlayHost;
    const [scopedModalVisible, setScopedModalVisible] = useState(active);
    const closeTimerRef = useRef(null);
    useEffect(() => {
        if (!useScopedModalHost) {
            return;
        }
        if (closeTimerRef.current != null) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        if (active) {
            setScopedModalVisible(true);
            return;
        }
        closeTimerRef.current = setTimeout(() => {
            closeTimerRef.current = null;
            setScopedModalVisible(false);
        }, IOS_MODAL_PORTAL_CLOSE_DELAY_MS);
        return () => {
            if (closeTimerRef.current != null) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
        };
    }, [active, useScopedModalHost]);
    if (useScopedModalHost) {
        if (!scopedModalVisible) {
            return null;
        }
        return (_jsx(Modal, { animationType: "none", onRequestClose: onRequestClose, presentationStyle: "overFullScreen", statusBarTranslucent: true, transparent: true, visible: true, children: _jsx(View, { style: styles.modalRoot, children: contents }) }));
    }
    const portalState = getPortal().state;
    if (portalState.type === "teleport") {
        return _jsx(NativePortal, { hostName: "root", children: contents });
    }
    return (_jsx(PortalItem, { hostName: hostName, passThrough: passThrough, children: contents }));
}
const styles = StyleSheet.create({
    modalRoot: {
        ...StyleSheet.absoluteFill,
    },
    portalLayer: {
        ...StyleSheet.absoluteFill,
    },
});
