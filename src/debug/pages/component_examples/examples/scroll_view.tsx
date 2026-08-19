import { StyleSheet, View } from "react-native";

import { ScrollView, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

const styles = StyleSheet.create({
  listFrame: { height: 320, minHeight: 0 },
  listItem: { borderRadius: 12, borderWidth: StyleSheet.hairlineWidth },
  listRow: {
    borderBottomColor: "rgba(128, 128, 128, 0.22)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  nativeListFrame: { height: 620, minHeight: 0 },
  scrollFrame: { height: 260, minHeight: 0 },
  scrollView: { flex: 1 },
});

export function ScrollViewExample() {
  return (
    <ExampleStack>
      <ExampleBlock
        description="嵌套容器保持自己的滚动位置，不影响示例详情页。"
        title="独立滚动区域"
      >
        <View style={styles.scrollFrame}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator style={styles.scrollView}>
            {Array.from({ length: 20 }, (_, index) => (
              <View key={index} style={styles.listRow}>
                <Text>ScrollView row {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}
