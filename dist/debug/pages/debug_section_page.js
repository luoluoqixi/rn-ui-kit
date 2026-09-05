import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Platform, StyleSheet, View } from "react-native";
import { NativeSheetScrollContent, ScrollView, Text } from "../../core/components/ui";
import { getRnUiKitDebugRouteDefinition } from "../routes";
export function RnUiKitDebugSectionPage({ bindToNativeSheet = false, contentTitle, headerTransparent = false, instanceId, layoutHost = "default", onOpenComponentExample, pages, sectionKey, }) {
    const definition = getRnUiKitDebugRouteDefinition(sectionKey, pages);
    const SectionPage = definition.Page;
    const adjustsForNativeIosHeader = layoutHost === "default" && Platform.OS === "ios";
    const header = contentTitle == null ? null : (_jsx(Text, { className: "px-5 pt-2 text-xl font-bold", children: contentTitle }));
    if (layoutHost === "nativeSheet" && definition.presentation === "static") {
        return (_jsxs(NativeSheetScrollContent
        // 直接分区 Sheet 仍需要 TrueSheet 的原生滚动钉住；NativeSheetStack
        // 路径则由调用方传 false，避免深层 Stack screen 的失效 tag 绑定。
        , { 
            // 直接分区 Sheet 仍需要 TrueSheet 的原生滚动钉住；NativeSheetStack
            // 路径则由调用方传 false，避免深层 Stack screen 的失效 tag 绑定。
            bindToNativeSheet: bindToNativeSheet, 
            // NativeSheetStack 没有可供 TrueSheet 注册的原生滚动视图，需由 JS
            // 约束到当前 detent；直接嵌套的 Sheet 已由原生层完成这项工作。
            constrainToNativeSheetViewport: !bindToNativeSheet, 
            // 页面内容自身已包含底部留白，避免再叠加 NativeSheetScrollContent 的默认 24px。
            extraBottomPadding: 0, style: styles.staticScrollView, tracksNavigationBarScrollEdge: Platform.OS === "android" || Platform.OS === "web", children: [header, _jsx(SectionPage, { headerTransparent: headerTransparent, instanceId: instanceId, layoutHost: layoutHost, onOpenComponentExample: onOpenComponentExample })] }));
    }
    if (definition.presentation === "static") {
        return (_jsx(ScrollView, { automaticallyAdjustsScrollIndicatorInsets: adjustsForNativeIosHeader ? true : undefined, contentInsetAdjustmentBehavior: adjustsForNativeIosHeader ? "automatic" : undefined, nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: styles.staticScrollView, tracksNavigationBarScrollEdge: Platform.OS === "android" || Platform.OS === "web", children: _jsx(SectionPage, { header: header, headerTransparent: headerTransparent, instanceId: instanceId, layoutHost: layoutHost, onOpenComponentExample: onOpenComponentExample }) }));
    }
    return (_jsx(View, { style: styles.scrollPage, children: _jsx(SectionPage, { header: header, headerTransparent: headerTransparent, instanceId: instanceId, layoutHost: layoutHost, onOpenComponentExample: onOpenComponentExample }) }));
}
const styles = StyleSheet.create({
    staticScrollView: { flex: 1, minHeight: 0 },
    scrollPage: { flex: 1, minHeight: 0 },
});
