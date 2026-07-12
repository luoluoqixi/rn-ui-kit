import { useState } from "react";
import { Button, Form, Input, Label, RadioGroup, Select, Text, TextArea } from "rn_ui_kit";

import { ExampleBlock, ExampleStack } from "../shared";
import type { ComponentExampleDefinition } from "../types";

function InputExample() {
  const [value, setValue] = useState("rn_ui_kit");
  const [slug, setSlug] = useState("component-lab");

  return (
    <ExampleStack>
      <ExampleBlock description="将受控字段用于名称与可发布的 URL 标识。" title="工作区信息">
        <Label htmlFor="component-example-name">显示名称</Label>
        <Input id="component-example-name" onChangeText={setValue} placeholder="输入组件名称" value={value} />
        <Label htmlFor="component-example-slug">URL 标识</Label>
        <Input id="component-example-slug" onChangeText={setSlug} placeholder="my-workspace" value={slug} />
        <Text opacity={0.6}>将发布到 /workspaces/{slug || "…"}（名称：{value || "未填写"}）</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function TextAreaExample() {
  const [value, setValue] = useState("这里可以输入多行内容。");

  return (
    <ExampleStack>
      <ExampleBlock description={`${value.length} 个字符，可用作草稿或备注。`} title="自动保存的备注">
        <TextArea onChangeText={setValue} placeholder="写下说明…" rows={6} style={{ minHeight: 140 }} value={value} />
        <Button onPress={() => setValue("")} size="$3" variant="outlined">清空内容</Button>
      </ExampleBlock>
    </ExampleStack>
  );
}

function SelectExample() {
  const [value, setValue] = useState<string | null>("ocean");

  return (
    <ExampleStack>
      <ExampleBlock description="通过 itemGroups 呈现有分组和禁用项的选择场景。" title="发布主题">
        <Select
          itemGroups={[
            {
              label: "明亮主题",
              items: [
                { label: "Ocean", value: "ocean" },
                { label: "Sakura", value: "sakura" },
              ],
            },
            {
              label: "深色主题",
              items: [
                { label: "Forest", value: "forest" },
                { disabled: true, label: "Golden（即将推出）", value: "golden" },
              ],
            },
          ]}
          native="custom-sheet"
          nativeTrigger
          onValueChange={setValue}
          placeholder="选择主题"
          value={value ?? undefined}
        />
        <Text opacity={0.6}>当前选择：{value ?? "未选择"}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function RadioGroupExample() {
  const [value, setValue] = useState("recent");

  return (
    <ExampleStack>
      <ExampleBlock description="用于互斥的列表排序条件。" title="排序规则">
        <RadioGroup
          items={[
            { label: "最近更新", value: "recent" },
            { label: "名称", value: "name" },
            { label: "大小", value: "size" },
          ]}
          onValueChange={setValue}
          value={value}
        />
        <Text opacity={0.6}>当前排序：{value}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function FormExample() {
  const [name, setName] = useState("demo-workspace");
  const [description, setDescription] = useState("这是一个可分享的组件实验工作区。");
  const [submitCount, setSubmitCount] = useState(0);

  return (
    <ExampleStack>
      <ExampleBlock description="一个提交触发器管理多个受控字段。" title="创建工作区">
        <Form
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
        <Text opacity={0.6}>已提交 {submitCount} 次：{name || "未命名"} · {description.length} 个字符</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}

function LabelExample() {
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

export const formExamples = [
  {
    Component: InputExample,
    description: "多字段、Label 关联和实时预览。",
    group: "输入与表单",
    key: "input",
    label: "Input",
  },
  {
    Component: TextAreaExample,
    description: "多行草稿、字符计数和清空操作。",
    group: "输入与表单",
    key: "text-area",
    label: "TextArea",
  },
  {
    Component: SelectExample,
    description: "分组、禁用项和 custom-sheet trigger。",
    group: "输入与表单",
    key: "select",
    label: "Select",
  },
  {
    Component: RadioGroupExample,
    description: "用于排序条件的受控单选组。",
    group: "输入与表单",
    key: "radio-group",
    label: "RadioGroup",
  },
  {
    Component: FormExample,
    description: "多字段提交与提交结果摘要。",
    group: "输入与表单",
    key: "form",
    label: "Form",
  },
  {
    Component: LabelExample,
    description: "Label 与 Input 的可访问性关联。",
    group: "输入与表单",
    key: "label",
    label: "Label",
  },
] satisfies ComponentExampleDefinition[];
