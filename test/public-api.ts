import "rn-ui-kit/initialize";
import { Button, type ButtonProps } from "rn-ui-kit";
import {
  RnUiKitDebugPanel,
  type RnUiKitDebugPanelNativeSheetScreenOptions,
  type RnUiKitDebugPanelPageScreenOptions,
  type RnUiKitDebugPanelProps,
  type RnUiKitDebugPanelSheetProps,
} from "rn-ui-kit/debug";

void Button;
void RnUiKitDebugPanel;

type PublicCoreProps = ButtonProps;
type PublicDebugProps = RnUiKitDebugPanelProps;
type PublicDebugPageScreenOptions = RnUiKitDebugPanelPageScreenOptions;
type PublicDebugNativeSheetScreenOptions = RnUiKitDebugPanelNativeSheetScreenOptions;
type PublicDebugSheetProps = RnUiKitDebugPanelSheetProps;

const hostPanelProps = {
  backButtonLabel: "返回",
  navigationMode: "host",
  nativeSheetScreenOptions: { headerShown: false },
  pageScreenOptions: { headerShown: false },
  panelSheetProps: { snapPoints: [92], snapPointsMode: "percent" },
} satisfies RnUiKitDebugPanelProps;

void hostPanelProps;

export type {
  PublicCoreProps,
  PublicDebugNativeSheetScreenOptions,
  PublicDebugPageScreenOptions,
  PublicDebugProps,
  PublicDebugSheetProps,
};
