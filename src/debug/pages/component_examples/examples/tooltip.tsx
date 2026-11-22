import { Button, Text, Tooltip } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function TooltipExample() {
  return <ExampleStack>
    <ExampleBlock title="补充说明">
      <ExampleRow>
        <Tooltip content="保存当前修改" delay={200}><Button>悬停或聚焦</Button></Tooltip>
        <Tooltip content="提示显示在下方" contentProps={{ side: "bottom" }} showArrow><Button variant="secondary">带箭头</Button></Tooltip>
        <Tooltip content="暂时不可用" isDisabled><Button variant="tertiary">禁用提示</Button></Tooltip>
      </ExampleRow>
      <Text color="muted">Web 支持悬停与键盘焦点；移动端直接呈现按钮，不拦截触摸。</Text>
    </ExampleBlock>
  </ExampleStack>;
}
