import { Linking, Platform, StyleSheet, View } from "react-native";
import { NativeList, NativeListItem, NativeListSection } from "rn-ui-kit/core";

import debugPackage from "../../../../package.json";

const GITHUB_URL = "https://github.com/luoluoqixi/rn-ui-kit";

const platformNames: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
};

export function RnUiKitAboutDebugPage() {
  const usesNativeIosScrollEdgeHeader = Platform.OS === "ios";
  const tracksScrollEdgeHeader =
    Platform.OS === "android" || Platform.OS === "web" || usesNativeIosScrollEdgeHeader;

  return (
    <View style={styles.nativeListHost}>
      <NativeList
        automaticallyAdjustsScrollIndicatorInsets={usesNativeIosScrollEdgeHeader ? true : undefined}
        contentInsetAdjustmentBehavior={usesNativeIosScrollEdgeHeader ? "automatic" : undefined}
        tracksNavigationBarScrollEdge={tracksScrollEdgeHeader}
      >
        <NativeListSection title="关于">
          <NativeListItem title="UI" value="rn-ui-kit" />
          <NativeListItem title="版本" value={debugPackage.version} />
          <NativeListItem
            onPress={() => void Linking.openURL(GITHUB_URL)}
            title="Github"
            value={GITHUB_URL}
            chevron
          />
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

const styles = StyleSheet.create({
  nativeListHost: { flex: 1, minHeight: 0 },
});
