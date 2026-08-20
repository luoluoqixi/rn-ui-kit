import { useState } from "react";

import { Input, Label } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function LabelExample() {
  const [value, setValue] = useState("");

  return (
    <ExampleStack>
      <ExampleBlock description="htmlFor / id 使标签与字段保持可访问性关联。" title="字段标签">
        <Label htmlFor="component-example-label-input">工作区名称</Label>
        <Input
          id="component-example-label-input"
          onChangeText={setValue}
          placeholder="Label 与 Input 关联"
          value={value}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
