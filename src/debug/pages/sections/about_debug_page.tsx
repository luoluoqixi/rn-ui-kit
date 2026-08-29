import { Linking, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NativeList, NativeListItem, NativeListSection } from "../../../core/components/ui";
import debugPackage from "../../../../package.json";

const GITHUB_URL = "https://github.com/luoluoqixi/rn-ui-kit";
const platformNames: Record<string, string> = { android: "Android", ios: "iOS", web: "Web" };

export function RnUiKitAboutDebugPage() {
  const usesNativeIosScrollEdgeHeader = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const tracksScrollEdgeHeader =
    Platform.OS === "android" || Platform.OS === "web" || usesNativeIosScrollEdgeHeader;
  const horizontalContentInset =
    Platform.OS === "ios" ? undefined : { paddingLeft: insets.left, paddingRight: insets.right };

  return (
    <View style={styles.nativeListHost}>
      <NativeList
        automaticallyAdjustsScrollIndicatorInsets={usesNativeIosScrollEdgeHeader ? true : undefined}
        contentInsetAdjustmentBehavior={usesNativeIosScrollEdgeHeader ? "automatic" : undefined}
        contentContainerStyle={horizontalContentInset}
        tracksNavigationBarScrollEdge={tracksScrollEdgeHeader}
      >
        <NativeListSection title="关于">
          <NativeListItem title="UI" value="rn-ui-kit" />
          <NativeListItem title="版本" value={debugPackage.version} />
          <NativeListItem
            chevron
            onPress={() => void Linking.openURL(GITHUB_URL)}
            title="Github"
            value={GITHUB_URL}
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

const styles = StyleSheet.create({ nativeListHost: { flex: 1, minHeight: 0 } });
