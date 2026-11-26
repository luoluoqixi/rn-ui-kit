import { useState } from "react";
import { Input, Text, TextField } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function InputExample() {
  const [value, setValue] = useState("");
  return (
    <ExampleStack>
      <ExampleSection title="基本输入" description="输入内容会同步到下方预览。">
        <Input
          accessibilityLabel="组件名称"
          placeholder="输入组件名称"
          value={value}
          onChangeText={setValue}
        />
        <Text color="muted">{value || "等待输入…"}</Text>
      </ExampleSection>
      <ExampleSection title="标签与说明">
        <TextField
          label="电子邮箱"
          description="用于接收工作区邀请。"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
        />
      </ExampleSection>
      <ExampleSection title="两种样式">
        <Input
          accessibilityLabel="主要样式"
          placeholder="Primary"
          variant="primary"
        />
        <Input
          accessibilityLabel="次要样式"
          placeholder="Secondary"
          variant="secondary"
        />
      </ExampleSection>
      <ExampleSection title="输入状态">
        <Input
          accessibilityLabel="禁用输入"
          defaultValue="不可编辑"
          isDisabled
        />
        <Input
          accessibilityLabel="只读输入"
          defaultValue="可以聚焦并选择内容"
          isReadOnly
        />
        <Input
          accessibilityLabel="无效输入"
          defaultValue="无效邮箱地址"
          isInvalid
        />
      </ExampleSection>
    </ExampleStack>
  );
}
