import { useState } from "react";

import { Button, Form, Input, Label, Text, TextArea } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function FormExample() {
  const [name, setName] = useState("demo-workspace");
  const [description, setDescription] = useState("这是一个可分享的组件实验工作区。");
  const [submitCount, setSubmitCount] = useState(0);

  return (
    <ExampleStack>
      <ExampleBlock description="一个提交触发器管理多个受控字段。" title="创建工作区">
        <Form
          triggerProps={{
            style: {
              marginTop: 10,
            },
          }}
          onSubmit={() => setSubmitCount((current) => current + 1)}
          trigger={<Button theme="accent">提交</Button>}
        >
          <Label htmlFor="component-example-form-name">名称</Label>
          <Input
            id="component-example-form-name"
            onChangeText={setName}
            placeholder="工作区名称"
            value={name}
          />
          <Label htmlFor="component-example-form-description">说明</Label>
          <TextArea
            id="component-example-form-description"
            onChangeText={setDescription}
            rows={3}
            value={description}
          />
        </Form>
        <Text opacity={0.6}>
          已提交 {submitCount} 次：{name || "未命名"} · {description.length} 个字符
        </Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
