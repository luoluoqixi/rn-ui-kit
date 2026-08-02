import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { type RnUiKitDebugRouteDefinition } from "rn-ui-kit/debug";
import {
  NativeList,
  NativeListSection,
  NativeListSelectItem,
  NativeListSwitchItem,
  type UiPreferences,
} from "rn-ui-kit";

import { accentThemeNames } from "./themes";

type UpdatePreferences = (updater: (current: UiPreferences) => UiPreferences) => void;

function createThemeDebugPage(preferences: UiPreferences, updatePreferences: UpdatePreferences) {
  return function AppThemeDebugPage() {
    const usesNativeIosScrollEdgeHeader = Platform.OS === "ios";
    const tracksScrollEdgeHeader =
      Platform.OS === "android" || Platform.OS === "web" || usesNativeIosScrollEdgeHeader;
    const accentOptions = useMemo(
      () => accentThemeNames.map((value) => ({ label: value, value })),
      [],
    );

    return (
      <View style={styles.nativeListHost}>
        <NativeList
          automaticallyAdjustsScrollIndicatorInsets={
            usesNativeIosScrollEdgeHeader ? true : undefined
          }
          contentInsetAdjustmentBehavior={usesNativeIosScrollEdgeHeader ? "automatic" : undefined}
          tracksNavigationBarScrollEdge={tracksScrollEdgeHeader}
        >
          <NativeListSection title="主题">
            <NativeListSelectItem
              selectProps={{
                options: accentOptions,
                onValueChange: (value) => {
                  if (value == null) return;
                  updatePreferences((current) => ({
                    ...current,
                    appearance: {
                      ...current.appearance,
                      accentColor: value as UiPreferences["appearance"]["accentColor"],
                    },
                  }));
                },
                value: preferences.appearance.accentColor,
              }}
              title="主题色"
            />
            <NativeListSelectItem
              selectProps={{
                options: [
                  { label: "浅色", value: "light" },
                  { label: "深色", value: "dark" },
                  { label: "跟随系统", value: "system" },
                ],
                onValueChange: (value) => {
                  if (value == null) return;
                  updatePreferences((current) => ({
                    ...current,
                    appearance: {
                      ...current.appearance,
                      themeMode: value as UiPreferences["appearance"]["themeMode"],
                    },
                  }));
                },
                value: preferences.appearance.themeMode,
              }}
              title="主题模式"
            />
            <NativeListSwitchItem
              switchProps={{
                checked: preferences.appearance.backgroundFollowsTheme,
                onCheckedChange: (value) => {
                  updatePreferences((current) => ({
                    ...current,
                    appearance: { ...current.appearance, backgroundFollowsTheme: value },
                  }));
                },
              }}
              title="背景跟随主题"
            />
          </NativeListSection>
        </NativeList>
      </View>
    );
  };
}

export function createAppDebugPages(
  preferences: UiPreferences,
  updatePreferences: UpdatePreferences,
): RnUiKitDebugRouteDefinition[] {
  return [
    {
      Page: createThemeDebugPage(preferences, updatePreferences),
      description: "切换示例应用的主题色、模式和背景行为。",
      key: "app-theme",
      label: "主题切换",
      presentation: "scroll",
      section: "Demo",
    },
  ] satisfies RnUiKitDebugRouteDefinition[];
}

const styles = StyleSheet.create({
  nativeListHost: { flex: 1, minHeight: 0 },
});
