import { ArrowLeft } from "@tamagui/lucide-icons-2";
import { createElement } from "react";
import { Platform } from "react-native";

import { os } from "../../../utils/platform";
import { getIosTransparentHeaderFallbackOptions } from "../../../utils/navigation";
import { nativeStackStatusBarOptions } from "../../../utils/navigation/status_bar";
import type { ResolvedColorScheme } from "../../../utils/theme";

import type { TrueSheetInnerStackScreenOptions } from "./stack_navigator";
import { trueSheetUsesNativeStackNavigator } from "./stack_navigator";

/** True Sheet 内嵌栈的 screenOptions（仅 iOS Native Stack 使用）。 */
export function trueSheetInnerStackScreenOptions(
  colorScheme: ResolvedColorScheme,
  backgroundColor: string | undefined,
  tintColor: string,
  titleColor: string,
): TrueSheetInnerStackScreenOptions {
  if (trueSheetUsesNativeStackNavigator) {
    return {
      ...nativeStackStatusBarOptions(colorScheme),
      contentStyle: {
        backgroundColor,
        ...(Platform.OS === "ios" ? { flex: 1 } : {}),
      },
      headerShadowVisible: false,
      headerTransparent: true,
      headerStyle: {
        backgroundColor: "transparent",
      },
      headerTintColor: tintColor,
      headerTitleStyle: {
        color: titleColor,
      },
      ...getIosTransparentHeaderFallbackOptions(),
    };
  }

  return {
    cardStyle: {
      backgroundColor,
      ...(Platform.OS === "ios" ? { flex: 1 } : {}),
    },
    headerBackImage: ({ tintColor }) =>
      createElement(ArrowLeft as any, { color: tintColor, size: 24 }),
    headerBackTitle: os() === "ios" ? "返回" : undefined,
    headerStatusBarHeight: 0,
    headerStyle: {
      backgroundColor,
    },
    headerTintColor: tintColor,
    headerTitleStyle: {
      color: titleColor,
    },
  };
}
