import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  FlashList,
  ListGroup,
  ListItem,
  NativeList,
  NativeListNavigationItem,
  NativeListSection,
  NativeListSelectItem,
  NativeListSwitchItem,
  ScrollView,
  Text,
} from "rn_ui_kit";

import { ExampleBlock, ExampleStack } from "../shared";
import type { ComponentExampleDefinition } from "../types";

function NativeListExample() {
  const [enabled, setEnabled] = useState(true);
  const [mode, setMode] = useState<string | null>("system");
  const [syncInterval, setSyncInterval] = useState<string | null>("hourly");
  const [lastAction, setLastAction] = useState("尚未点击");

  return (
    <ExampleStack>
      <ExampleBlock description="同一列表同时放置导航、开关与自定义选择器。" title="工作区设置">
        <View style={styles.nativeListFrame}>
          <NativeList nestedScrollEnabled>
            <NativeListSection title="NativeList">
              <NativeListNavigationItem
                onPress={() => setLastAction("打开详情")}
                subtitle="带有 chevron 的导航行"
                title="详情"
              />
              <NativeListNavigationItem
                onPress={() => setLastAction("打开成员管理")}
                subtitle="邀请、角色与访问权限"
                title="成员"
              />
            </NativeListSection>
            <NativeListSection title="同步">
              <NativeListSwitchItem
                switchProps={{ checked: enabled, onCheckedChange: setEnabled }}
                title="启用功能"
              />
              <NativeListSelectItem
                selectProps={{
                  native: "custom-sheet",
                  onValueChange: setMode,
                  options: [
                    { label: "浅色", value: "light" },
                    { label: "深色", value: "dark" },
                    { label: "跟随系统", value: "system" },
                  ],
                  value: mode ?? undefined,
                }}
                title="主题模式"
              />
              <NativeListSelectItem
                selectProps={{
                  native: "custom-sheet",
                  onValueChange: setSyncInterval,
                  options: [
                    { label: "每 15 分钟", value: "15-minutes" },
                    { label: "每小时", value: "hourly" },
                    { label: "每天", value: "daily" },
                  ],
                  value: syncInterval ?? undefined,
                }}
                title="同步频率"
              />
            </NativeListSection>
          </NativeList>
        </View>
        <Text opacity={0.6}>最近动作：{lastAction} · 主题：{mode ?? "未选择"} · 频率：{syncInterval ?? "未选择"}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function ListGroupExample() {
  const [lastAction, setLastAction] = useState("尚未点击");

  return (
    <ExampleStack>
      <ExampleBlock description="ListGroup 适合承载一组带标题、说明和连续分隔线的入口。" title="内容库">
        <ListGroup
          items={[
            {
              onPress: () => setLastAction("最近文件"),
              subTitle: "显示最近访问的文件",
              title: "最近文件",
            },
            {
              onPress: () => setLastAction("收藏夹"),
              subTitle: "显示收藏内容",
              title: "收藏夹",
            },
            {
              onPress: () => setLastAction("共享给团队"),
              subTitle: "管理外部协作者可以访问的内容",
              title: "共享与权限",
            },
          ]}
          rounded="$4"
          separator
          size="$4"
        />
        <Text opacity={0.6}>最近动作：{lastAction}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function ListItemExample() {
  const [pressed, setPressed] = useState(0);
  const [archived, setArchived] = useState(false);

  return (
    <ExampleStack>
      <ExampleBlock description="独立 ListItem 可以脱离 ListGroup 用于局部的可点击信息卡。" title="单条记录">
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

const flashListData = Array.from({ length: 40 }, (_, index) => ({
  id: `flash-row-${index}`,
  label: `FlashList row ${index + 1}`,
}));

function FlashListExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="固定高度中渲染 40 条数据，适合作为长列表的性能基线。" title="虚拟化列表">
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

function ScrollViewExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="嵌套容器保持自己的滚动位置，不影响示例详情页。" title="独立滚动区域">
        <View style={styles.scrollFrame}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
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

export const collectionExamples = [
  {
    Component: NativeListExample,
    description: "多分区的导航、Switch 和 Select 列表项。",
    group: "列表与滚动",
    key: "native-list",
    label: "NativeList",
  },
  {
    Component: ListGroupExample,
    description: "多入口、说明和反馈状态的 ListItem 组合。",
    group: "列表与滚动",
    key: "list-group",
    label: "ListGroup",
  },
  {
    Component: ListItemExample,
    description: "独立条目、多行说明与局部状态。",
    group: "列表与滚动",
    key: "list-item",
    label: "ListItem",
  },
  {
    Component: FlashListExample,
    description: "固定容器中的虚拟化长列表。",
    group: "列表与滚动",
    key: "flash-list",
    label: "FlashList",
  },
  {
    Component: ScrollViewExample,
    description: "嵌套详情页中的独立滚动容器。",
    group: "列表与滚动",
    key: "scroll-view",
    label: "ScrollView",
  },
] satisfies ComponentExampleDefinition[];

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
  nativeListFrame: { height: 360, minHeight: 0 },
  scrollFrame: { height: 260, minHeight: 0 },
});
