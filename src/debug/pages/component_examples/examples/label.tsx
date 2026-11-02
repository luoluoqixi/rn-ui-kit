import { useState } from "react";
import { Input, Label } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function LabelExample() {
  const [value, setValue] = useState("");
  return (
    <ExampleStack>
      <ExampleBlock>
        <Label nativeID="component-example-label-input">工作区名称</Label>
        <Input onChangeText={setValue} placeholder="Label 与 Input 关联" value={value} />
      </ExampleBlock>
    </ExampleStack>
  );
}
