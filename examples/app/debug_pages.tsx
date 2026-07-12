import { Button, Card, Text } from "rn_ui_kit";
import { RnUiKitUiComponentsDebugPage } from "rn_ui_kit_debug";
import { StyleSheet, View } from "react-native";

import type { RnUiKitDebugRouteDefinition } from "rn_ui_kit_debug";

function AppRuntimeDebugPage() {
  return (
    <View style={styles.container}>
      <Text fontSize="$6" fontWeight="700">App runtime</Text>
      <Text color="$color10">这里是由 examples/app 传入的调试页面。</Text>
      <Button onPress={() => console.log("runtime debug action")}>执行示例操作</Button>
    </View>
  );
}

function AppThemeDebugPage() {
  return (
    <View style={styles.container}>
      <Text fontSize="$6" fontWeight="700">Theme preview</Text>
      <Card borderWidth={1} padding="$4">
        <Text>外部页面与内置组件总览使用相同的导航、Stack 和嵌套 Sheet 逻辑。</Text>
      </Card>
    </View>
  );
}

export const appDebugPages = [
  {
    Page: RnUiKitUiComponentsDebugPage,
    description: "完整展示 rn_ui_kit 组件与交互行为。",
    key: "components",
    label: "组件总览",
    order: 999,
    presentation: "static",
  },
  {
    Page: AppRuntimeDebugPage,
    description: "查看示例应用运行时状态与操作。",
    key: "app-runtime",
    label: "应用运行时",
    presentation: "scroll",
    section: "示例分区",
  },
  {
    Page: AppThemeDebugPage,
    description: "预览示例应用主题和外部页面接入。",
    key: "app-theme",
    label: "主题预览",
    presentation: "scroll",
    section: "示例分区",
  },
] satisfies RnUiKitDebugRouteDefinition[];

const styles = StyleSheet.create({ container: { gap: 12, padding: 16 } });
