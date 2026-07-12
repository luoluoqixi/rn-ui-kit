import { ScrollView, YStack } from "tamagui";
import { Text } from "rn_ui_kit";

import { getRnUiKitDebugRouteDefinition } from "../routes";

import type { RnUiKitDebugRouteKey } from "../types";

export function RnUiKitDebugSectionPage({
  contentTitle,
  instanceId,
  sectionKey,
}: {
  contentTitle?: string;
  instanceId?: string;
  sectionKey: RnUiKitDebugRouteKey;
}) {
  const definition = getRnUiKitDebugRouteDefinition(sectionKey);
  const SectionPage = definition.Page;
  const header =
    contentTitle == null ? undefined : (
      <Text fontSize="$7" fontWeight="700" pb="$2">
        {contentTitle}
      </Text>
    );

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
