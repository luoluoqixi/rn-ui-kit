import { StyleSheet, View } from "react-native";

import { FlashList, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

const flashListData = Array.from({ length: 40 }, (_, index) => ({
  id: `flash-row-${index}`,
  label: `FlashList row ${index + 1}`,
}));

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

export function FlashListExample() {
  return (
    <ExampleStack>
      <ExampleBlock
        description="固定高度中渲染 40 条数据，适合作为长列表的性能基线。"
        title="虚拟化列表"
      >
        <View style={styles.listFrame}>
          <FlashList
            data={flashListData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listRow}>
                <Text>{item.label}</Text>
              </View>
            )}
          />
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}
