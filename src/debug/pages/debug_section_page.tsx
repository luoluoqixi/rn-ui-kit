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
        bindToNativeSheet={bindToNativeSheet}
        contentContainerStyle={styles.staticScrollContent}
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
