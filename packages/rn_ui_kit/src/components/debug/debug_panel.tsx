import { ScrollView, YStack } from "tamagui";

import { H2, Paragraph } from "../ui";

import { RnUiKitUiComponentsDebugPage } from "./ui_components_debug_page";

import type { RnUiKitDebugPanelProps } from "./types";

export function RnUiKitDebugPanel({ contentProps, ...props }: RnUiKitDebugPanelProps) {
  return (
    <YStack background="$background" flex={1} {...props}>
      <ScrollView flex={1} {...contentProps}>
        <YStack gap="$2" p="$4" pb="$2">
          <H2 size="$8">rn_ui_kit debug</H2>
          <Paragraph color="$color10">
            Local component checks for the currently extracted UI surface.
          </Paragraph>
        </YStack>
        <RnUiKitUiComponentsDebugPage pt="$2" />
      </ScrollView>
    </YStack>
  );
}

