import { useState } from "react";
import { Textarea, Text, TextField } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function TextAreaExample() {
  const [value, setValue] = useState("");
  return (
    <ExampleStack>
      <ExampleSection title="多行输入" description="适合反馈、备注和较长内容。">
        <Textarea
          accessibilityLabel="项目备注"
          value={value}
          onChangeText={setValue}
          placeholder="写下本周的项目进展…"
          rows={4}
        />
        <Text color="muted">已输入 {value.length} 字</Text>
      </ExampleSection>
      <ExampleSection title="标签与说明">
        <TextField
          multiline
          rows={4}
          label="个人简介"
          description="介绍一下你擅长的方向。"
          placeholder="从这里开始…"
        />
      </ExampleSection>
      <ExampleSection title="两种样式">
        <Textarea
          accessibilityLabel="主要样式"
          variant="primary"
          placeholder="Primary"
        />
        <Textarea
          accessibilityLabel="次要样式"
          variant="secondary"
          placeholder="Secondary"
        />
      </ExampleSection>
      <ExampleSection title="状态">
        <Textarea
          accessibilityLabel="只读备注"
          isReadOnly
          defaultValue="这段内容可以选择和复制。"
        />
        <Textarea
          accessibilityLabel="禁用备注"
          isDisabled
          defaultValue="归档后不可编辑。"
        />
        <TextField
          multiline
          label="反馈内容"
          isInvalid
          defaultValue="太短"
          errorMessage="请补充问题现象与复现步骤。"
        />
      </ExampleSection>
    </ExampleStack>
  );
}
