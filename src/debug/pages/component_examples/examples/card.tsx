import { Card, Link, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function CardExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="项目摘要">
        <Card
          className="gap-4"
          content={<Text>这里是 Card 的正文区域</Text>}
          description="上次同步于今天"
          footer={
            <ExampleRow style={{ height: 34 }}>
              <Text className="text-muted-foreground">2 位协作者</Text>
              <Link size="sm">查看详情</Link>
            </ExampleRow>
          }
          title="rn-ui-kit 调试工作区"
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
