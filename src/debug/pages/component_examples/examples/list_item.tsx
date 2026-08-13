import { useState } from "react";

import { StyleSheet } from "react-native";

import { ListItem, Text } from "rn-ui-kit/core";

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

export function ListItemExample() {
  const [pressed, setPressed] = useState(0);
  const [archived, setArchived] = useState(false);

  return (
    <ExampleStack>
      <ExampleBlock
        description="独立 ListItem 可以脱离 ListGroup 用于局部的可点击信息卡。"
        title="单条记录"
      >
        <ListItem
          onPress={() => setPressed((current) => current + 1)}
          style={styles.listItem}
          subTitle="ListItem 可以独立使用"
          title="单个列表项"
        />
        <ListItem
          onPress={() => setArchived((current) => !current)}
          style={styles.listItem}
          subTitle={archived ? "已归档，点击恢复" : "点击后归档该条记录"}
          title={archived ? "归档记录" : "当前记录"}
        />
        <Text opacity={0.6}>已点击 {pressed} 次</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
