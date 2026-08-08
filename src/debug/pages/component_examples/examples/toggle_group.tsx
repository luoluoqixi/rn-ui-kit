import { useState } from "react";

import { ToggleGroup } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function ToggleGroupExample() {
  const [mode, setMode] = useState("preview");
  const [format, setFormat] = useState<string[]>(["bold"]);

  return (
    <ExampleStack>
      <ExampleBlock description={`当前视图：${mode}`} title="单选模式">
        <ToggleGroup
          items={[
            { label: "编辑", value: "edit" },
            { label: "预览", value: "preview" },
            { label: "源码", value: "source" },
          ]}
          onValueChange={setMode}
          type="single"
          value={mode}
        />
      </ExampleBlock>
      <ExampleBlock description={`已启用：${format.join("、") || "无"}`} title="多选格式">
        <ToggleGroup
          items={[
            { label: "粗体", value: "bold" },
            { label: "斜体", value: "italic" },
          ]}
          onValueChange={setFormat}
          type="multiple"
          value={format}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
