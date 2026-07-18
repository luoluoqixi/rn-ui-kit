import { Platform, StyleSheet, View } from "react-native";
import { YStack } from "tamagui";
import { NativeSheetScrollContent, ScrollView, Text } from "rn_ui_kit";

import { getRnUiKitDebugRouteDefinition } from "../routes";

import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "../types";

export function RnUiKitDebugSectionPage({
  bindToNativeSheet = false,
  contentTitle,
  headerTransparent = false,
  instanceId,
  layoutHost = "default",
  pages,
  sectionKey,
}: {
  bindToNativeSheet?: boolean;
  contentTitle?: string;
  headerTransparent?: boolean;
  instanceId?: string;
  layoutHost?: "default" | "nativeSheet";
  pages: RnUiKitDebugRouteDefinition[];
  sectionKey: RnUiKitDebugRouteKey;
}) {
  const definition = getRnUiKitDebugRouteDefinition(sectionKey, pages);
  const SectionPage = definition.Page;
  const adjustsForNativeIosHeader = layoutHost === "default" && Platform.OS === "ios";
  const header =
    contentTitle == null ? undefined : (
      <Text fontSize="$7" fontWeight="700" pb="$2">
        {contentTitle}
      </Text>
    );

  if (layoutHost === "nativeSheet" && definition.presentation === "static") {
    return (
      <NativeSheetScrollContent
        bindToNativeSheet={bindToNativeSheet}
        contentContainerStyle={styles.staticScrollContent}
        style={styles.staticScrollView}
      >
        {header != null ? <View style={styles.staticContentHeader}>{header}</View> : null}
        <SectionPage
          headerTransparent={headerTransparent}
          instanceId={instanceId}
          layoutHost={layoutHost}
        />
      </NativeSheetScrollContent>
    );
  }

  if (definition.presentation === "static") {
    return (
      <ScrollView
        automaticallyAdjustsScrollIndicatorInsets={
          adjustsForNativeIosHeader ? true : undefined
        }
        contentInsetAdjustmentBehavior={
          adjustsForNativeIosHeader ? "automatic" : undefined
        }
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >
        <SectionPage
          header={header}
          headerTransparent={headerTransparent}
          instanceId={instanceId}
          layoutHost={layoutHost}
        />
      </ScrollView>
    );
  }

  return (
    <YStack flex={1} gap="$3" style={styles.scrollPage}>
      <SectionPage
        header={header}
        headerTransparent={headerTransparent}
        instanceId={instanceId}
        layoutHost={layoutHost}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  staticContentHeader: { paddingHorizontal: 20, paddingTop: 8 },
  staticScrollContent: { paddingBottom: 12 },
  staticScrollView: { flex: 1, minHeight: 0 },
  scrollPage: { minHeight: 0 },
});
