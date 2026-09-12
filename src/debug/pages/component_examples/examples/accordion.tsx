import { Accordion, Text } from "rn-ui-kit/core";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ExampleBlock, ExampleStack } from "../shared";

export function AccordionExample() {
  return (
    <ExampleStack>
      <ExampleBlock>
        <Animated.View layout={LinearTransition.duration(200)}>
          <Text variant="h4">单项展开</Text>
        </Animated.View>
        <Accordion
          nativeHaptics
          collapsible
          type="single"
          items={[
            {
              content: <Text>Accordion 默认生成 Item、Trigger 和 Content。</Text>,
              title: "基础结构",
              value: "structure",
            },
            {
              content: <Text>通过 items 可以快速生成多个条目，也能统一配置属性。</Text>,
              title: "数据驱动",
              value: "items",
            },
            {
              content: <Text>关闭当前项后，列表结构仍然保留。</Text>,
              title: "可收起",
              value: "collapsible",
            },
          ]}
        />

        <Animated.View layout={LinearTransition.duration(200)}>
          <Text variant="h4">多项展开</Text>
        </Animated.View>
        <Accordion
          nativeHaptics
          type="multiple"
          items={[
            {
              content: <Text>支持同时展开多个面板。</Text>,
              title: "缓存策略",
              value: "cache",
            },
            {
              content: <Text>内容区域可以放任意 React 节点。</Text>,
              title: "同步策略",
              value: "sync",
            },
          ]}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
