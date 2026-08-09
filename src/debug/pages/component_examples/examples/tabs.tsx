import { useState } from "react";

import { StyleSheet } from "react-native";

import { Tabs, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

const styles = StyleSheet.create({
  splitHost: { flex: 1, minHeight: 0 },
  splitPane: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
    minHeight: 0,
    minWidth: 0,
    padding: 16,
  },
  splitRoot: { flex: 1, minHeight: 0, paddingBottom: 48 },
  splitToolbar: {
    alignItems: "center",
    borderBottomColor: "rgba(128, 128, 128, 0.24)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
  },
  tabContent: { padding: 16 },
});

export function TabsExample() {
  const [value, setValue] = useState("preview");

  return (
    <ExampleStack>
      <ExampleBlock
        description={`当前标签：${value}；每个 Tab 的内容会保留在自己的区域。`}
        title="编辑器工作区"
      >
        <Tabs
          items={[
            {
              content: <Text style={styles.tabContent}>这是预览标签的内容。</Text>,
              label: "预览",
              value: "preview",
            },
            {
              content: (
                <Text style={styles.tabContent}>这里可以放接口说明、快捷键或辅助信息。</Text>
              ),
              label: "说明",
              value: "notes",
            },
            {
              content: (
                <Text style={styles.tabContent}>提交记录、构建日志等较长内容也可以独立组织。</Text>
              ),
              label: "历史",
              value: "history",
            },
          ]}
          onValueChange={setValue}
          value={value}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
