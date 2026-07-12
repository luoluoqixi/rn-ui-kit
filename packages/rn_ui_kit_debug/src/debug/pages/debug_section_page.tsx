import { StyleSheet, View } from "react-native";
import { ScrollView, YStack } from "tamagui";
import { NativeSheetScrollContent, Text } from "rn_ui_kit";

import { getRnUiKitDebugRouteDefinition } from "../routes";

import type { RnUiKitDebugRouteDefinition, RnUiKitDebugRouteKey } from "../types";

export function RnUiKitDebugSectionPage({
  contentTitle,
  instanceId,
  layoutHost = "default",
  pages,
  sectionKey,
}: {
  contentTitle?: string;
  instanceId?: string;
  layoutHost?: "default" | "nativeSheet";
  pages: RnUiKitDebugRouteDefinition[];
  sectionKey: RnUiKitDebugRouteKey;
}) {
  const definition = getRnUiKitDebugRouteDefinition(sectionKey, pages);
  const SectionPage = definition.Page;
  const header =
    contentTitle == null ? undefined : (
      <Text fontSize="$7" fontWeight="700" pb="$2">
        {contentTitle}
      </Text>
    );

  if (layoutHost === "nativeSheet" && definition.presentation === "static") {
    return (
      <NativeSheetScrollContent
        contentContainerStyle={styles.staticScrollContent}
        style={styles.staticScrollView}
      >
        {header != null ? <View style={styles.staticContentHeader}>{header}</View> : null}
        <SectionPage instanceId={instanceId} />
      </NativeSheetScrollContent>
    );
  }

  if (definition.presentation === "static") {
    return (
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
        <SectionPage header={header} instanceId={instanceId} />
      </ScrollView>
    );
  }

  return (
    <YStack gap="$3">
      <SectionPage header={header} instanceId={instanceId} />
    </YStack>
  );
}

const styles = StyleSheet.create({
  staticContentHeader: { paddingHorizontal: 20, paddingTop: 8 },
  staticScrollContent: { paddingBottom: 12 },
  staticScrollView: { flex: 1, minHeight: 0 },
});
