import { useState } from "react";
import { Tabs, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function TabsExample() {
  const [value, setValue] = useState("preview");
  return (
    <ExampleStack>
      <ExampleBlock description={`当前标签：${value}`} title="编辑器工作区">
        <Tabs
          className="w-full"
          items={[
            {
              value: "preview",
              title: "预览",
              content: <Text>这是预览标签的内容。</Text>,
            },
            {
              value: "notes",
              title: "说明",
              content: <Text>这里可以放接口说明、快捷键或辅助信息。</Text>,
            },
            {
              value: "history",
              title: "历史",
              content: <Text>提交记录、构建日志等较长内容也可以独立组织。</Text>,
            },
          ]}
          onValueChange={setValue}
          value={value}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
