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
    </ExampleStack>
  );
}
