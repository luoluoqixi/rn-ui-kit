import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  NativeList,
  NativeListItem,
  NativeListSection,
  NativeListSelectItem,
  NativeListSwitchItem,
  RnUiKitUiComponentsDebugPage,
  type RnUiKitDebugRouteDefinition,
  type UiPreferences,
  isIos26Plus,
} from "rn_ui_kit";

import appPackage from "./package.json";
import { accentThemeNames } from "./themes";

type UpdatePreferences = (updater: (current: UiPreferences) => UiPreferences) => void;

const platformNames: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
};

function AppAboutDebugPage() {
  const usesPreIos26ScrollEdgeHeader = Platform.OS === "ios" && !isIos26Plus();

  return (
    <View style={styles.nativeListHost}>
      <NativeList
        automaticallyAdjustsScrollIndicatorInsets={usesPreIos26ScrollEdgeHeader ? true : undefined}
        contentInsetAdjustmentBehavior={usesPreIos26ScrollEdgeHeader ? "automatic" : undefined}
        tracksNavigationBarScrollEdge={usesPreIos26ScrollEdgeHeader}
      >
        <NativeListSection title="应用信息">
          <NativeListItem title="应用名称" value="rn_ui_kit" />
          <NativeListItem title="版本号" value={appPackage.version} />
        </NativeListSection>

        <NativeListSection title="运行环境">
          <NativeListItem title="平台" value={platformNames[Platform.OS] ?? Platform.OS} />
          <NativeListItem title="平台版本" value={String(Platform.Version)} />
          <NativeListItem title="构建模式" value={__DEV__ ? "开发" : "生产"} />
        </NativeListSection>
      </NativeList>
    </View>
  );
}

function createThemeDebugPage(preferences: UiPreferences, updatePreferences: UpdatePreferences) {
  return function AppThemeDebugPage() {
    const usesPreIos26ScrollEdgeHeader = Platform.OS === "ios" && !isIos26Plus();
    const accentOptions = useMemo(
      () => accentThemeNames.map((value) => ({ label: value, value })),
      [],
    );

    return (
      <View style={styles.nativeListHost}>
        <NativeList
          automaticallyAdjustsScrollIndicatorInsets={
            usesPreIos26ScrollEdgeHeader ? true : undefined
          }
          contentInsetAdjustmentBehavior={usesPreIos26ScrollEdgeHeader ? "automatic" : undefined}
          tracksNavigationBarScrollEdge={usesPreIos26ScrollEdgeHeader}
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
      Page: RnUiKitUiComponentsDebugPage,
      description: "完整展示组件与交互行为。",
      key: "components",
      label: "组件总览",
      order: 999,
      presentation: "static",
    },
    {
      Page: createThemeDebugPage(preferences, updatePreferences),
      description: "切换示例应用的主题色、模式和背景行为。",
      key: "app-theme",
      label: "主题切换",
      presentation: "scroll",
      section: "Demo",
    },
    {
      Page: AppAboutDebugPage,
      description: "查看示例应用版本及当前运行环境。",
      key: "app-about",
      label: "关于",
      order: 100,
      presentation: "scroll",
      section: "Demo",
    },
  ] satisfies RnUiKitDebugRouteDefinition[];
}

const styles = StyleSheet.create({
  nativeListHost: { flex: 1, minHeight: 0 },
  preview: { paddingHorizontal: 16 },
});
