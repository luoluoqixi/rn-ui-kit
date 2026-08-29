import { useState } from "react";
import { Button, Input, Label } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function InputExample() {
  const [value, setValue] = useState("rn-ui-kit");
  const [slug, setSlug] = useState("component-lab");
  return (
    <ExampleStack>
      <ExampleBlock>
        <Label nativeID="component-example-name">显示名称</Label>
        <Input onChangeText={setValue} placeholder="输入组件名称" value={value} />
        <Label nativeID="component-example-slug">URL 标识</Label>
        <Input onChangeText={setSlug} placeholder="my-workspace" value={slug} />
        <Button>确定</Button>
      </ExampleBlock>
      <ExampleBlock>
        <Label nativeID="component-example-name">大小</Label>
        <Input size="xs" placeholder="超小 Input" />
        <Input size="sm" placeholder="小 Input" />
        <Input size="md" placeholder="默认 Input" />
        <Input size="lg" placeholder="大 Input" />
        <Input size="xl" placeholder="超大 Input" />
      </ExampleBlock>
    </ExampleStack>
  );
}
