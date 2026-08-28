import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "../../../core/components/ui";
import type { RnUiKitUiComponentsDebugPageProps } from "../../types";
import { componentExampleDefinitions } from "../component_examples/catalog";
import type { ComponentExampleDefinition } from "../component_examples/types";
import { ExampleStack } from "../component_examples/shared";

// 总览与独立组件示例共用实现，避免旧 Tamagui API 在总览中继续漂移。
const GROUP_ORDER = [
  "动作与反馈",
  "输入与表单",
  "组合与布局",
  "浮层与菜单",
  "列表与滚动",
  "内容展示",
] as const;

const GROUP_DESCRIPTION: Record<(typeof GROUP_ORDER)[number], string> = {
  动作与反馈: "按钮、状态切换、进度反馈和原生交互。",
  输入与表单: "输入、选择、标签和表单控件。",
  组合与布局: "组合控件、布局容器和系统视觉效果。",
  浮层与菜单: "弹窗、菜单、提示和底部面板。",
  列表与滚动: "NativeList 及滚动容器的完整示例。",
  内容展示: "文本、卡片、链接和基础展示组件。",
};

function ExampleEntry({ definition }: { definition: ComponentExampleDefinition }) {
  const Example = definition.Component;
  return (
    <View style={definition.layout === "fill" ? styles.fillEntry : undefined}>
      <Text className="mb-2 font-semibold">{definition.label}</Text>
      <Example />
    </View>
  );
}

export function RnUiKitUiComponentsDebugPage({
  header,
}: RnUiKitUiComponentsDebugPageProps) {
  const groups = useMemo(() => {
    const grouped = new Map<string, ComponentExampleDefinition[]>();
    for (const definition of componentExampleDefinitions) {
      const entries = grouped.get(definition.group) ?? [];
      entries.push(definition);
      grouped.set(definition.group, entries);
    }
    return grouped;
  }, []);

  return (
    <View style={styles.root}>
      {header}
      {GROUP_ORDER.map((group) => {
        const definitions = groups.get(group) ?? [];
        if (definitions.length === 0) return null;
        return (
          <View key={group} style={styles.group}>
            <Text className="text-xl font-semibold">{group}</Text>
            <Text className="text-muted-foreground text-sm">{GROUP_DESCRIPTION[group]}</Text>
            <ExampleStack>
              {definitions.map((definition) => (
                <ExampleEntry definition={definition} key={definition.key} />
              ))}
            </ExampleStack>
          </View>
        );
      })}
      <Text className="text-muted-foreground text-center text-xs">
        组件总览与组件示例使用相同的实现和交互逻辑。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
    padding: 16,
    paddingBottom: 48,
  },
  group: {
    gap: 8,
  },
  fillEntry: {
    minHeight: 420,
  },
});
