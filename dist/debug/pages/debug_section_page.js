import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Platform, StyleSheet, View } from "react-native";
import { YStack } from "tamagui";
import { NativeSheetScrollContent, ScrollView, Text } from "rn-ui-kit/core";
import { getRnUiKitDebugRouteDefinition } from "../routes";
export function RnUiKitDebugSectionPage({ bindToNativeSheet = false, contentTitle, headerTransparent = false, instanceId, layoutHost = "default", pages, sectionKey, }) {
    const definition = getRnUiKitDebugRouteDefinition(sectionKey, pages);
    const SectionPage = definition.Page;
    const adjustsForNativeIosHeader = layoutHost === "default" && Platform.OS === "ios";
    const header = contentTitle == null ? undefined : (_jsx(Text, { fontSize: "$7", fontWeight: "700", pb: "$2", children: contentTitle }));
    if (layoutHost === "nativeSheet" && definition.presentation === "static") {
        return (_jsxs(NativeSheetScrollContent, { bindToNativeSheet: bindToNativeSheet, contentContainerStyle: styles.staticScrollContent, style: styles.staticScrollView, children: [header != null ? _jsx(View, { style: styles.staticContentHeader, children: header }) : null, _jsx(SectionPage, { headerTransparent: headerTransparent, instanceId: instanceId, layoutHost: layoutHost })] }));
    }
    if (definition.presentation === "static") {
        return (_jsx(ScrollView, { automaticallyAdjustsScrollIndicatorInsets: adjustsForNativeIosHeader ? true : undefined, contentInsetAdjustmentBehavior: adjustsForNativeIosHeader ? "automatic" : undefined, nestedScrollEnabled: true, showsVerticalScrollIndicator: true, style: styles.staticScrollView, children: _jsx(SectionPage, { header: header, headerTransparent: headerTransparent, instanceId: instanceId, layoutHost: layoutHost }) }));
    }
    return (_jsx(YStack, { flex: 1, gap: "$3", style: styles.scrollPage, children: _jsx(SectionPage, { header: header, headerTransparent: headerTransparent, instanceId: instanceId, layoutHost: layoutHost }) }));
}
const styles = StyleSheet.create({
    staticContentHeader: { paddingHorizontal: 20, paddingTop: 8 },
    staticScrollContent: { paddingBottom: 12 },
    staticScrollView: { flex: 1, minHeight: 0 },
    scrollPage: { minHeight: 0 },
});
