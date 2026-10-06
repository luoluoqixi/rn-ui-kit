import { useState } from "react";
import { Collapsible, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function CollapsibleExample() {
  const [open, setOpen] = useState(false);
  return (
    <ExampleStack>
      <ExampleBlock description={open ? "详细信息已展开。" : "详细信息已收起。"} title="构建详情">
        <Collapsible
          nativeHaptics
          content={<Text className="pt-3">构建包含 32 个页面、4 个平台目标和 0 个类型错误。</Text>}
          onOpenChange={setOpen}
          open={open}
          title={({ open: isOpen }) => (isOpen ? "收起详情" : "展开详情")}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
