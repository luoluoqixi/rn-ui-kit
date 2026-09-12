import { useState } from "react";
import { isWeb, ToggleGroup } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

const items = [
  { value: "bold", title: "粗体" },
  { value: "italic", title: "斜体" },
  {
    value: "underline",
    title: "下划线",
    itemProps: {
      className: "w-24",
    },
  },
];

const itemsSize = [
  {
    value: "bold",
    title: "粗体",
  },
  {
    value: "italic",
    title: "斜体",
  },
];

export function ToggleGroupExample() {
  const [format, setFormat] = useState<string[]>([]);
  const [formatSize, setFormatSize] = useState<string[]>([]);

  const onValueChange = (value: string[]) => {
    setFormat(value);
  };

  return (
    <ExampleStack>
      <ExampleBlock description={`已启用：${format.join("、") || "无"}`} title="文本格式">
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={format}
          onValueChange={onValueChange}
          className="self-center"
          items={items}
        />
      </ExampleBlock>
      <ExampleBlock title="大小">
        <ToggleGroup
          size="2xs"
          type="multiple"
          variant="outline"
          value={formatSize}
          onValueChange={setFormatSize}
          className="self-center"
          items={itemsSize}
        />
        <ToggleGroup
          size="xs"
          type="multiple"
          variant="outline"
          value={formatSize}
          onValueChange={setFormatSize}
          className="self-center"
          items={itemsSize}
        />
        <ToggleGroup
          size="sm"
          type="multiple"
          variant="outline"
          value={formatSize}
          onValueChange={setFormatSize}
          className="self-center"
          items={itemsSize}
        />
        <ToggleGroup
          size="md"
          type="multiple"
          variant="outline"
          value={formatSize}
          onValueChange={setFormatSize}
          className="self-center"
          items={itemsSize}
        />
        <ToggleGroup
          size="lg"
          type="multiple"
          variant="outline"
          value={formatSize}
          onValueChange={setFormatSize}
          className="self-center"
          items={itemsSize}
        />
        <ToggleGroup
          size="xl"
          type="multiple"
          variant="outline"
          value={formatSize}
          onValueChange={setFormatSize}
          className="self-center"
          items={itemsSize}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
