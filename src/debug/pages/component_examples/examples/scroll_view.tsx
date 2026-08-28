import { ScrollView, Text } from "rn-ui-kit/core";
import { StyleSheet, View } from "react-native";
import { ExampleBlock, ExampleStack } from "../shared";

export function ScrollViewExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="独立滚动区域">
        <View style={styles.scrollFrame}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled
            showsVerticalScrollIndicator
            style={styles.scrollView}
          >
            {Array.from({ length: 30 }, (_, index) => (
              <View key={index} style={styles.listRow}>
                <Text>第 {index + 1} 行示例内容</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}

const styles = StyleSheet.create({
  listRow: {
    borderBottomColor: "rgba(128, 128, 128, 0.22)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  scrollContent: { paddingBottom: 16 },
  scrollFrame: { height: 260, minHeight: 0 },
  scrollView: { flex: 1 },
});
