import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Accordion,
  Button,
  SplitLayout,
  Tabs,
  Text,
  type SplitLayoutHandle,
  useAppBackgroundColors,
} from "rn_ui_kit_core";

import { ExampleBlock, ExampleStack } from "../shared";
import type { ComponentExampleDefinition } from "../types";

function AccordionExample() {
  return (
    <ExampleStack>
      <ExampleBlock
        description="单选模式适合 FAQ、设置分组等一次只关注一项的内容。"
        title="单项展开"
      >
        <Accordion
          collapsible
          items={[
            {
              content: <Text>Accordion 默认生成 Header、Trigger 和 Content。</Text>,
              title: "基础结构",
              value: "structure",
            },
            {
              content: (
                <Text>通过 items 可以快速生成多个条目，也能统一配置 Header 和 Trigger。</Text>
              ),
              title: "数据驱动",
              value: "items",
            },
            {
              content: <Text>关闭当前项后，页面会保留完整的列表结构。</Text>,
              title: "可收起",
              value: "collapsible",
            },
          ]}
          type="single"
        />
      </ExampleBlock>
      <ExampleBlock description="多选模式允许同时对照多个说明。" title="多项展开">
        <Accordion
          items={[
            { content: <Text>支持同时展开多个面板。</Text>, title: "缓存策略", value: "cache" },
            {
              content: <Text>内容区域可以放任意 React 节点。</Text>,
              title: "同步策略",
              value: "sync",
            },
          ]}
          type="multiple"
        />
      </ExampleBlock>
    </ExampleStack>
  );
}

function TabsExample() {
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

function SplitLayoutExample() {
  const layoutRef = useRef<SplitLayoutHandle | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const colors = useAppBackgroundColors();

  const toggleSidebar = () => {
    const nextVisible = !sidebarVisible;
    layoutRef.current?.setVisible(0, nextVisible);
    setSidebarVisible(nextVisible);
  };

  return (
    <View style={[styles.splitRoot, { backgroundColor: colors.screen }]}>
      <View style={styles.splitToolbar}>
        <Button onPress={toggleSidebar} size="$3" variant="outlined">
          {sidebarVisible ? "隐藏侧栏" : "显示侧栏"}
        </Button>
        <Button onPress={() => layoutRef.current?.reset()} size="$3" variant="outlined">
          重置尺寸
        </Button>
        <Text opacity={0.6}>拖动中间分隔条调整宽度</Text>
      </View>
      <View style={styles.splitHost}>
        <SplitLayout
          defaultSizes={[220, 520]}
          minSize={80}
          onVisibleChange={(index, visible) => {
            if (index === 0) setSidebarVisible(visible);
          }}
          proportionalLayout={false}
          ref={layoutRef}
        >
          <SplitLayout.Pane minSize={120} preferredSize={220} snap>
            <View style={[styles.splitPane, { backgroundColor: colors.card }]}>
              <Text fontWeight="700">侧栏</Text>
              <Text opacity={0.6}>Pane 1</Text>
            </View>
          </SplitLayout.Pane>
          <SplitLayout.Pane minSize={180}>
            <View style={[styles.splitPane, { backgroundColor: colors.screen }]}>
              <Text fontSize="$7" fontWeight="700">
                主内容
              </Text>
              <Text opacity={0.6}>此示例没有传 storageKey 或 storageAdapter，不会持久化。</Text>
            </View>
          </SplitLayout.Pane>
        </SplitLayout>
      </View>
    </View>
  );
}

export const compositionExamples = [
  {
    Component: AccordionExample,
    group: "组合与布局",
    key: "accordion",
    label: "Accordion",
  },
  {
    Component: TabsExample,
    group: "组合与布局",
    key: "tabs",
    label: "Tabs",
  },
  {
    Component: SplitLayoutExample,
    group: "组合与布局",
    key: "split-view",
    label: "SplitView / SplitLayout",
    layout: "fill",
  },
] satisfies ComponentExampleDefinition[];

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
