import { useState } from "react";

import { Input, Label, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function InputExample() {
  const [value, setValue] = useState("rn-ui-kit");
  const [slug, setSlug] = useState("component-lab");

  return (
    <ExampleStack>
      <ExampleBlock description="将受控字段用于名称与可发布的 URL 标识。" title="工作区信息">
        <Label htmlFor="component-example-name">显示名称</Label>
        <Input
          id="component-example-name"
          onChangeText={setValue}
          placeholder="输入组件名称"
          value={value}
        />
        <Label htmlFor="component-example-slug">URL 标识</Label>
        <Input
          id="component-example-slug"
          onChangeText={setSlug}
          placeholder="my-workspace"
          value={slug}
        />
        <Text opacity={0.6}>
          将发布到 /workspaces/{slug || "…"}（名称：{value || "未填写"}）
        </Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
