import { ScrollView, Slider, Switch, Text } from "rn-ui-kit/core";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ExampleBlock, ExampleStack } from "../shared";

export function ScrollViewExample() {
  const [customScrollbar, setCustomScrollbar] = useState(false);
  const [horizontalInset, setHorizontalInset] = useState(0);
  const [verticalInset, setVerticalInset] = useState(0);
  const scrollbarInsets = {
    bottom: verticalInset,
    left: horizontalInset,
    right: horizontalInset,
    top: verticalInset,
  };

  return (
    <ExampleStack>
      <ExampleBlock title="独立滚动区域">
        <Switch
          checked={customScrollbar}
          label="可拖拽滚动条"
          onCheckedChange={setCustomScrollbar}
        />
        <View style={styles.scrollFrame}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            customScrollbar={customScrollbar}
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
      <ExampleBlock title="滚动条偏移">
        <View style={styles.insetControl}>
          <Text>上下偏移: {verticalInset}px</Text>
          <Slider
            max={64}
            min={0}
            native={false}
            onChange={setVerticalInset}
            step={1}
            value={verticalInset}
          />
        </View>
        <View style={styles.insetControl}>
          <Text>左右偏移: {horizontalInset}px</Text>
          <Slider
            max={64}
            min={0}
            native={false}
            onChange={setHorizontalInset}
            step={1}
            value={horizontalInset}
          />
        </View>
        <View style={styles.scrollFrame}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            customScrollbar={{ insets: scrollbarInsets }}
            style={styles.scrollView}
          >
            {Array.from({ length: 30 }, (_, index) => (
              <View key={index} style={styles.listRow}>
                <Text>第 {index + 1} 行偏移测试内容</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.horizontalScrollFrame}>
          <ScrollView
            contentContainerStyle={styles.horizontalScrollContent}
            customScrollbar={{
              insets: scrollbarInsets,
            }}
            horizontal
            showsHorizontalScrollIndicator
            style={styles.scrollView}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <View key={index} style={styles.horizontalItem}>
                <Text>项目 {index + 1}</Text>
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
  horizontalItem: {
    alignItems: "center",
    backgroundColor: "rgba(128, 128, 128, 0.12)",
    borderRadius: 8,
    height: 96,
    justifyContent: "center",
    width: 96,
  },
  insetControl: { gap: 6 },
  horizontalScrollContent: { columnGap: 12, paddingHorizontal: 12, paddingTop: 12 },
  horizontalScrollFrame: { height: 140, minHeight: 0 },
  scrollContent: { paddingBottom: 16 },
  scrollFrame: { height: 260, minHeight: 0 },
  scrollView: { flex: 1 },
});
