import type { ComponentProps } from "react";
import { ScrollView, YStack } from "tamagui";

export type RnUiKitDebugPanelProps = ComponentProps<typeof YStack> & {
  contentProps?: ComponentProps<typeof ScrollView>;
};

export type RnUiKitUiComponentsDebugPageProps = ComponentProps<typeof YStack>;
