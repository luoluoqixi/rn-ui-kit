import { Button, Tooltip } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function TooltipExample() {
  return (
    <ExampleStack>
      <ExampleBlock description="Web 悬停显示；Native 主要提供可访问性语义。" title="补充说明">
        <ExampleRow>
          <Tooltip arrow content="这会把当前版本发布到预览环境。">
            <Button variant="outlined">发布说明</Button>
          </Tooltip>
          <Tooltip arrow content="删除后将无法恢复。">
            <Button theme="red">危险操作</Button>
          </Tooltip>
        </ExampleRow>
      </ExampleBlock>
    </ExampleStack>
  );
}
