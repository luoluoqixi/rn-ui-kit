import { useState } from "react";
import { Tabs, Text, type TabsItemData } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function TabsExample() {
  const [value, setValue] = useState("overview");
  const items: TabsItemData[] = [
    {
      value: "overview",
      title: "概览",
      content: <Text>查看项目状态与最近活动。</Text>,
    },
    {
      value: "activity",
      title: "动态",
      content: <Text>团队的最新操作会显示在这里。</Text>,
    },
    {
      value: "settings",
      title: "设置",
      content: <Text>管理项目偏好与成员权限。</Text>,
    },
  ];
  return (
    <ExampleStack>
      <ExampleSection title="胶囊样式">
        <Tabs
          items={items}
          value={value}
          onValueChange={setValue}
          variant="primary"
          accessibilityLabel="项目内容"
        />
      </ExampleSection>
      <ExampleSection title="下划线样式">
        <Tabs
          items={items}
          defaultValue="activity"
          variant="secondary"
          accessibilityLabel="项目分区"
        />
      </ExampleSection>
      <ExampleSection title="禁用选项">
        <Tabs
          items={items.map((item) => ({
            ...item,
            isDisabled: item.value === "settings",
          }))}
          accessibilityLabel="可用分区"
        />
      </ExampleSection>
      <ExampleSection title="横向滚动">
        <Tabs
          isScrollable
          accessibilityLabel="工作台"
          items={[
            "收件箱",
            "进行中",
            "待审核",
            "已完成",
            "已归档",
            "项目设置",
          ].map((title, index) => ({
            value: String(index),
            title,
            content: <Text>{title}中的内容。</Text>,
          }))}
        />
      </ExampleSection>
    </ExampleStack>
  );
}
