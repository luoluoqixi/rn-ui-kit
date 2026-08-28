import { Platform, StyleSheet, View } from "react-native";

import { NativeSheetScrollContent, ScrollView, Text } from "../../core/components/ui";
import { getRnUiKitDebugRouteDefinition } from "../routes";
import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "../types";

export function RnUiKitDebugSectionPage({
  bindToNativeSheet = false,
  contentTitle,
  headerTransparent = false,
  instanceId,
  layoutHost = "default",
  onOpenComponentExample,
  pages,
  sectionKey,
}: {
  bindToNativeSheet?: boolean;
  contentTitle?: string;
  headerTransparent?: boolean;
  instanceId?: string;
  layoutHost?: "default" | "nativeSheet";
  onOpenComponentExample?: (key: string) => void;
  pages: RnUiKitDebugRouteDefinition[];
  sectionKey: RnUiKitDebugRouteKey;
}) {
  const definition = getRnUiKitDebugRouteDefinition(sectionKey, pages);
  const SectionPage = definition.Page;
  const adjustsForNativeIosHeader = layoutHost === "default" && Platform.OS === "ios";
  const header =
    contentTitle == null ? null : (
      <Text className="px-5 pt-2 text-xl font-bold">{contentTitle}</Text>
    );

  if (layoutHost === "nativeSheet" && definition.presentation === "static") {
    return (
      <NativeSheetScrollContent
        // 直接分区 Sheet 仍需要 TrueSheet 的原生滚动钉住；NativeSheetStack
        // 路径则由调用方传 false，避免深层 Stack screen 的失效 tag 绑定。
        bindToNativeSheet={bindToNativeSheet}
        // 静态分区页与组件详情页一样位于 Native Stack 和透明 header 内。
        // 约束外层滚动视图到 TrueSheet 的实际可视区域，避免内容和滚动条
        // 延伸到 header 区域或低 detent 的 Sheet 下方。
        constrainToNativeSheetViewport
        // 分区嵌套 Sheet 的 contentInset 由 TrueSheet 注入；NativeSheetStack
        // 路径则需保留 NativeSheetScrollContent 计算出的底部安全区 padding。
        contentContainerStyle={bindToNativeSheet ? styles.staticScrollContent : undefined}
        style={styles.staticScrollView}
        tracksNavigationBarScrollEdge={Platform.OS === "android" || Platform.OS === "web"}
      >
        {header}
        <SectionPage
          headerTransparent={headerTransparent}
          instanceId={instanceId}
          layoutHost={layoutHost}
          onOpenComponentExample={onOpenComponentExample}
        />
      </NativeSheetScrollContent>
    );
  }

  if (definition.presentation === "static") {
    return (
      <ScrollView
        automaticallyAdjustsScrollIndicatorInsets={adjustsForNativeIosHeader ? true : undefined}
        contentInsetAdjustmentBehavior={adjustsForNativeIosHeader ? "automatic" : undefined}
        nestedScrollEnabled
        showsVerticalScrollIndicator
        style={styles.staticScrollView}
        tracksNavigationBarScrollEdge={Platform.OS === "android" || Platform.OS === "web"}
      >
        <SectionPage
          header={header}
          headerTransparent={headerTransparent}
          instanceId={instanceId}
          layoutHost={layoutHost}
          onOpenComponentExample={onOpenComponentExample}
        />
      </ScrollView>
    );
  }

  return (
    <View style={styles.scrollPage}>
      <SectionPage
        header={header}
        headerTransparent={headerTransparent}
        instanceId={instanceId}
        layoutHost={layoutHost}
        onOpenComponentExample={onOpenComponentExample}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  staticScrollContent: { paddingBottom: 12 },
  staticScrollView: { flex: 1, minHeight: 0 },
  scrollPage: { flex: 1, minHeight: 0 },
});
