import { useState } from "react";
import { ToggleGroup } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function ToggleGroupExample() {
  const [format, setFormat] = useState<string[]>([]);

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
          items={[
            { value: "bold", title: "粗体" },
            { value: "italic", title: "斜体" },
            {
              value: "underline",
              title: "下划线",
              itemProps: {
                className: "w-20",
              },
            },
          ]}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
