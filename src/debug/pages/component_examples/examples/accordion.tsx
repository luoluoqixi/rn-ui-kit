import { useState } from "react";
import { View } from "react-native";
import { Accordion, Button, Input, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function AccordionExample() {
  const [value, setValue] = useState<string | undefined>("first");
  return (
    <ExampleStack>
      <ExampleBlock title="单项展开" description="HeroUI 底层；直接传 items，标题和内容都支持字符串、数字或自定义节点。">
        <Accordion
          nativeHaptics
          defaultValue="structure"
          items={[
            { value: "structure", title: "基础结构", content: "内部自动组合触发器、指示器和内容面板。" },
            { value: "items", title: item => `数据驱动：${item.value}`, content: "默认单项展开，再次点击可收起。" },
            { value: "disabled", title: "禁用条目", content: "该条目不会展开。", isDisabled: true },
          ]}
        />
      </ExampleBlock>

      <ExampleBlock title="多项展开与 surface" description="可同时打开多个面板；variant 和分隔线沿用 HeroUI 的设计。">
        <Accordion
          nativeHaptics
          selectionMode="multiple"
          defaultValue={["cache", "sync"]}
          variant="surface"
          items={[
            { value: "cache", title: "缓存策略", content: "两个面板可以同时展开。" },
            { value: "sync", title: "同步策略", content: <Input placeholder="内容也可以是输入框" /> },
          ]}
        />
      </ExampleBlock>

      <ExampleBlock title="受控状态" description="外部可展开、切换或清空；value 为 undefined 时保持受控的关闭状态。">
        <Text>当前展开：{value ?? "无"}</Text>
        <ExampleRow>
          <Button size="sm" onPress={() => setValue("first")}>展开第一项</Button>
          <Button size="sm" onPress={() => setValue("second")}>展开第二项</Button>
          <Button size="sm" onPress={() => setValue(undefined)}>全部收起</Button>
        </ExampleRow>
        <Accordion
          nativeHaptics
          value={value}
          onValueChange={setValue}
          items={[
            { value: "first", title: "受控第一项", content: "可以通过外部按钮切换。" },
            { value: "second", title: "受控第二项", content: "也可以点击标题展开或收起。" },
          ]}
        />
      </ExampleBlock>

      <ExampleBlock title="封装属性与逐项覆盖" description="titleClassName 只作用于文字；triggerProps 与 contentClassName 分别控制点击区域和内容容器。">
        <Accordion
          nativeHaptics
          hideSeparator
          defaultValue="custom"
          titleClassName="text-accent"
          triggerProps={{ className: "rounded-xl px-4" }}
          contentProps={{ className: "rounded-xl px-4" }}
          contentClassName="bg-surface-secondary"
          items={[
            {
              value: "custom", title: "共享配置",
              content: "不需要手工组合 HeroUI 子组件。",
            },
            {
              value: "override", title: <Text>逐项覆盖</Text>,
              titleClassName: "text-success",
              triggerProps: { className: "px-6" },
              contentClassName: "bg-default",
              content: <View className="gap-2"><Text>条目级配置覆盖整组默认值。</Text><Text variant="muted">自定义 React 节点保持原样。</Text></View>,
            },
            {
              value: "disabled-trigger", title: "通过 triggerProps 禁用", content: "不响应交互。",
              triggerProps: { isDisabled: true },
            },
          ]}
        />
      </ExampleBlock>

      <ExampleBlock title="不可收起与整组禁用">
        <Accordion nativeHaptics isCollapsible={false} defaultValue="required-a" items={[
          { value: "required-a", title: "保持至少一项展开", content: "再次点击不会收起；仍然可以切换到另一项。" },
          { value: "required-b", title: "切换到这里", content: "Web 和 Native 使用相同的行为约定。" },
        ]} />
        <Accordion isDisabled items={[{ value: "disabled-group", title: "整组禁用", content: "不响应交互。" }]} />
      </ExampleBlock>

      <ExampleBlock title="主题尺寸与局部密度" description="Accordion 没有内置 size。默认沿用 HeroUI；按需使用主题的间距和字号 utilities。">
        <Accordion variant="surface" triggerProps={{ className: "py-2" }} titleClassName="text-sm" items={[
          { value: "compact", title: "紧凑示例", content: "只调整此处标题和触发区，其他组件保持默认。" },
        ]} />
      </ExampleBlock>
    </ExampleStack>
  );
}
