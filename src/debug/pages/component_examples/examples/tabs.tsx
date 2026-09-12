import { useState } from "react";
import { Tabs, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

const tabsItems = [
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
];

const tabsSizeItems = [
  {
    value: "preview",
    title: "预览",
    content: <></>,
  },
  {
    value: "notes",
    title: "说明",
    content: <></>,
  },
  {
    value: "history",
    title: "历史",
    content: <></>,
  },
];

export function TabsExample() {
  const [value, setValue] = useState("preview");
  const [valueSize, setValueSize] = useState("preview");
  return (
    <ExampleStack>
      <ExampleBlock description={`当前标签：${value}`} title="编辑器工作区">
        <Tabs className="w-full" items={tabsItems} onValueChange={setValue} value={value} />
      </ExampleBlock>
      <ExampleBlock title="大小">
        <Tabs
          size="2xs"
          className="w-full"
          items={tabsSizeItems}
          onValueChange={setValueSize}
          value={valueSize}
        />
        <Tabs
          size="xs"
          className="w-full"
          items={tabsSizeItems}
          onValueChange={setValueSize}
          value={valueSize}
        />
        <Tabs
          size="sm"
          className="w-full"
          items={tabsSizeItems}
          onValueChange={setValueSize}
          value={valueSize}
        />
        <Tabs
          size="md"
          className="w-full"
          items={tabsSizeItems}
          onValueChange={setValueSize}
          value={valueSize}
        />
        <Tabs
          size="lg"
          className="w-full"
          items={tabsSizeItems}
          onValueChange={setValueSize}
          value={valueSize}
        />
        <Tabs
          size="xl"
          className="w-full"
          items={tabsSizeItems}
          onValueChange={setValueSize}
          value={valueSize}
        />
        <Tabs
          size="2xl"
          className="w-full"
          items={tabsSizeItems}
          onValueChange={setValueSize}
          value={valueSize}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
