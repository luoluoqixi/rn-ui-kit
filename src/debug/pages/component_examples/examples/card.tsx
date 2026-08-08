import { Card, Link, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function CardExample() {
  return (
    <ExampleStack>
      <ExampleBlock
        description="默认 API 可以统一标题、说明、正文与 footer 的节奏。"
        title="项目摘要"
      >
        <Card
          description="上次同步于今天 10:42，包含 12 个组件示例。"
          footer={
            <ExampleRow>
              <Text opacity={0.6}>2 位协作者</Text>
              <Link href="https://tamagui.dev" target="_blank">
                查看详情
              </Link>
            </ExampleRow>
          }
          title="rn-ui-kit 调试工作区"
        >
          <Text>这里是 Card 的正文区域，可放置项目摘要、状态和后续操作。</Text>
        </Card>
      </ExampleBlock>
    </ExampleStack>
  );
}
