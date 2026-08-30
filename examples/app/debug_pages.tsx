import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  type RnUiKitDebugRouteDefinition,
  type RnUiKitDebugSectionContentProps,
} from "rn-ui-kit/debug";
import {
  BrightnessSlider,
  HueSlider,
  NativeList,
  NativeListColorPickerItem,
  NativeListSection,
  NativeListSelectItem,
  NativeListSwitchItem,
  Panel1,
  Preview,
  Swatches,
  accentThemeNames,
  accentThemeSwatchColors,
  isIos15,
  type UiPreferences,
} from "rn-ui-kit";

type UpdatePreferences = (updater: (current: UiPreferences) => UiPreferences) => void;

const PRESET_THEME_COLORS = accentThemeNames.map((name) => accentThemeSwatchColors[name]);

function createThemeDebugPage(
  preferences: UiPreferences,
  updatePreferences: UpdatePreferences,
  usesHostNavigation: boolean,
  setUsesHostNavigation: (value: boolean) => void,
) {
  return function AppThemeDebugPage({ layoutHost }: RnUiKitDebugSectionContentProps) {
    const usesNativeIosScrollEdgeHeader = Platform.OS === "ios";
    const insets = useSafeAreaInsets();
    const tracksScrollEdgeHeader =
      Platform.OS === "android" || Platform.OS === "web" || usesNativeIosScrollEdgeHeader;
    const horizontalContentInset =
      Platform.OS === "ios" ? undefined : { paddingLeft: insets.left, paddingRight: insets.right };
    const accentOptions = useMemo(
      () => {
        const customColor = isCustomAccentColor(preferences.appearance.accentColor)
          ? preferences.appearance.accentColor
          : "#7c3aed";
        return [
          ...accentThemeNames.map((value) => ({
            label: value,
            swatchColor: accentThemeSwatchColors[value],
            value,
          })),
          { label: "自定义颜色", swatchColor: customColor, value: customColor },
        ];
      },
      [preferences.appearance.accentColor],
    );
    const customAccentColor = isCustomAccentColor(preferences.appearance.accentColor)
      ? preferences.appearance.accentColor
      : "#7c3aed";

    return (
      <View style={styles.nativeListHost}>
        <NativeList
          automaticallyAdjustsScrollIndicatorInsets={
            usesNativeIosScrollEdgeHeader ? true : undefined
          }
          contentInsetAdjustmentBehavior={usesNativeIosScrollEdgeHeader ? "automatic" : undefined}
          contentContainerStyle={horizontalContentInset}
          tracksNavigationBarScrollEdge={tracksScrollEdgeHeader}
        >
          <NativeListSection title="主题">
            <NativeListSelectItem
              iosSwiftNativeMenu={isIos15()}
              selectProps={{
                options: accentOptions,
                onValueChange: (value: string | null) => {
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
            {isCustomAccentColor(preferences.appearance.accentColor) ? (
              <NativeListColorPickerItem
                color={customAccentColor}
                colorPickerProps={{
                  adaptSpectrum: true,
                  thumbShape: "circle",
                  children: (
                    <>
                      <Preview style={{ height: 44, width: "100%" }} />
                      <Panel1 style={{ height: 240, width: "100%" }} />
                      <HueSlider />
                      <BrightnessSlider />
                      <Swatches
                        colors={PRESET_THEME_COLORS}
                        swatchStyle={{
                          height: 26,
                          marginBottom: 0,
                          marginHorizontal: 2,
                          width: 26,
                        }}
                      />
                    </>
                  ),
                }}
                onColorChange={(color) =>
                  updatePreferences((current) => ({
                    ...current,
                    appearance: { ...current.appearance, accentColor: color },
                  }))
                }
                subtitle="使用 ColorPicker 调整应用主色"
                title="自定义主题颜色"
              />
            ) : null}
            <NativeListSelectItem
              iosSwiftNativeMenu={isIos15()}
              selectProps={{
                options: [
                  { label: "浅色", value: "light" },
                  { label: "深色", value: "dark" },
                  { label: "跟随系统", value: "system" },
                ],
                onValueChange: (value: string | null) => {
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
          {layoutHost !== "nativeSheet" ? (
            <NativeListSection title="调试导航">
              <NativeListSwitchItem
                switchProps={{
                  checked: usesHostNavigation,
                  onCheckedChange: setUsesHostNavigation,
                }}
                title="使用 Host 导航模式"
              />
            </NativeListSection>
          ) : null}
        </NativeList>
      </View>
    );
  };
}

function isCustomAccentColor(value: string) {
  return /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value.trim());
}

export function createAppDebugPages(
  preferences: UiPreferences,
  updatePreferences: UpdatePreferences,
  usesHostNavigation: boolean,
  setUsesHostNavigation: (value: boolean) => void,
): RnUiKitDebugRouteDefinition[] {
  return [
    {
      Page: createThemeDebugPage(
        preferences,
        updatePreferences,
        usesHostNavigation,
        setUsesHostNavigation,
      ),
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
