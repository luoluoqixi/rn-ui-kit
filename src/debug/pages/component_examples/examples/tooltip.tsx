import { Button, Tooltip } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function TooltipExample() {
  return (
    <ExampleStack>
      <ExampleBlock title="补充说明">
        <ExampleRow>
          <Tooltip content="这会把当前版本发布" delayDuration={200}>
            <Button variant="outline">发布说明</Button>
          </Tooltip>
          <Tooltip content="删除后将无法恢复" delayDuration={200}>
            <Button variant="destructive">危险操作</Button>
          </Tooltip>
        </ExampleRow>
      </ExampleBlock>
      <ExampleBlock title="大小">
        <Tooltip size="2xs" content="最小 Tooltip" delayDuration={200}>
          <Button variant="outline">最小 Tooltip</Button>
        </Tooltip>
        <Tooltip size="xs" content="超小 Tooltip" delayDuration={200}>
          <Button variant="outline">超小 Tooltip</Button>
        </Tooltip>
        <Tooltip size="sm" content="小 Tooltip" delayDuration={200}>
          <Button variant="outline">小 Tooltip</Button>
        </Tooltip>
        <Tooltip size="md" content="正常 Tooltip" delayDuration={200}>
          <Button variant="outline">正常 Tooltip</Button>
        </Tooltip>
        <Tooltip size="lg" content="大 Tooltip" delayDuration={200}>
          <Button variant="outline">大 Tooltip</Button>
        </Tooltip>
        <Tooltip size="xl" content="超大 Tooltip" delayDuration={200}>
          <Button variant="outline">超大 Tooltip</Button>
        </Tooltip>
        <Tooltip size="2xl" content="最大 Tooltip" delayDuration={200}>
          <Button variant="outline">最大 Tooltip</Button>
        </Tooltip>
      </ExampleBlock>
    </ExampleStack>
  );
}
