import { Accordion, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function AccordionExample() {
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
