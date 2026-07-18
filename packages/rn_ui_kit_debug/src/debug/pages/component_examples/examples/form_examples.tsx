import { useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  isWeb,
  Label,
  os,
  RadioGroup,
  Select,
  Text,
  TextArea,
  Separator,
} from "rn_ui_kit_core";

import { ExampleBlock, ExampleStack } from "../shared";
import type { ComponentExampleDefinition } from "../types";
import { View } from "react-native";

function InputExample() {
  const [value, setValue] = useState("rn_ui_kit");
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

function TextAreaExample() {
  const [value, setValue] = useState("这里可以输入多行内容。");

  return (
    <ExampleStack>
      <ExampleBlock
        description={`${value.length} 个字符，可用作草稿或备注。`}
        title="自动保存的备注"
      >
        <TextArea
          onChangeText={setValue}
          placeholder="写下说明…"
          rows={6}
          style={{ minHeight: 140 }}
          value={value}
        />
        <Button onPress={() => setValue("")} size="$3" variant="outlined">
          清空内容
        </Button>
      </ExampleBlock>
    </ExampleStack>
  );
}

function SelectExample() {
  const [selectValue, setSelectValue] = useState<string | null>("blue");
  const [selectValue2, setSelectValue2] = useState<string | null>("light");

  const [selectGroupedValue, setSelectGroupedValue] = useState<string | null>("edit-desc");
  const [selectNativePickerValue, setSelectNativePickerValue] = useState<string | null>("blue");

  const selectItems = useMemo(
    () => [
      { label: "蓝色", value: "blue" },
      { label: "绿色", value: "green" },
      { label: "橙色", value: "orange" },
      { label: "粉色", value: "pink" },
      { label: "红色", value: "red" },
      { label: "白色", value: "white" },
      { label: "黑色", value: "black" },
      { label: "紫色", value: "purple" },
      { label: "黄色", value: "yellow" },
      { label: "灰色", value: "gray" },
      { label: "棕色", value: "brown" },
      { label: "青色", value: "cyan" },
      { label: "靛色", value: "indigo" },
      { label: "金色", value: "gold" },
      { label: "银色", value: "silver" },
    ],
    [],
  );

  const selectItems2 = useMemo(
    () => [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
    [],
  );

  const selectSortGroups = useMemo(
    () => [
      {
        items: [
          { label: "文件名 (A-Z)", value: "name-asc" },
          { label: "文件名 (Z-A)", value: "name-desc" },
        ],
      },
      {
        items: [
          { label: "编辑时间 (从新到旧)", value: "edit-desc" },
          { label: "编辑时间 (从旧到新)", value: "edit-asc" },
        ],
      },
      {
        items: [
          { label: "创建时间 (从新到旧)", value: "create-desc" },
          { label: "创建时间 (从旧到新)", value: "create-asc" },
        ],
      },
    ],
    [],
  );

  return (
    <ExampleStack>
      <ExampleBlock description="" title="Sheet示例">
        {!isWeb() && (
          <>
            <Label>Select (native-sheet)</Label>
            <Select
              items={selectItems}
              native="native-sheet"
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
            <Label>Select (custom-sheet)</Label>
            <Select
              items={selectItems}
              native="custom-sheet"
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
          </>
        )}
        {isWeb() && (
          <>
            <Label>Select (sheet)</Label>
            <Select
              items={selectItems}
              native="native-sheet"
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
          </>
        )}
        <Select
          items={selectItems}
          native="native-sheet"
          nativeTrigger
          onValueChange={setSelectValue}
          placeholder="选择主题色"
          value={selectValue ?? undefined}
        />
        <Text color="$color">当前主题色：{selectValue ?? "未选择"}</Text>
      </ExampleBlock>

      <ExampleBlock title="原生示例">
        {!isWeb() && (
          <View>
            <Label>Select Native (Dropdown)</Label>
            <Select
              items={selectItems}
              native
              nativePickerMode="dropdown"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Select
              items={selectItems}
              native
              nativeTrigger
              nativePickerMode="dropdown"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Text color="$color">当前主题色(原生)：{selectNativePickerValue ?? "未选择"}</Text>
          </View>
        )}

        {isWeb() && (
          <ExampleBlock title="Web示例">
            <Label>Select (长列表)</Label>
            <Select
              items={selectItems}
              native={false}
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
            <Select
              items={selectItems}
              native={false}
              nativeTrigger
              onValueChange={setSelectValue}
              placeholder="选择主题色"
              value={selectValue ?? undefined}
            />
            <Text color="$color">当前主题色：{selectValue ?? "未选择"}</Text>
          </ExampleBlock>
        )}

        {os() === "ios" && (
          <View>
            <Label>Select Native (Wheel Sheet)</Label>
            <Select
              items={selectItems}
              native
              nativePickerMode="wheel"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Select
              items={selectItems}
              native
              nativeTrigger
              nativePickerMode="wheel"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Text color="$color">
              当前主题色(原生 Sheet)：{selectNativePickerValue ?? "未选择"}
            </Text>
          </View>
        )}
        {os() === "android" && (
          <View>
            <Label>Select Native (Dialog)</Label>
            <Select
              items={selectItems}
              native
              nativePickerMode="dialog"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Select
              items={selectItems}
              native
              nativeTrigger
              nativePickerMode="dialog"
              onValueChange={setSelectNativePickerValue}
              placeholder="选择主题色"
              value={selectNativePickerValue ?? undefined}
            />
            <Text color="$color">当前主题色(原生)：{selectNativePickerValue ?? "未选择"}</Text>
          </View>
        )}
      </ExampleBlock>

      <ExampleBlock title="简单示例">
        <Label>Select</Label>
        <Select
          items={selectItems2}
          native={false}
          onValueChange={setSelectValue2}
          placeholder="选择主题"
          value={selectValue2 ?? undefined}
        />
        <Select
          items={selectItems2}
          native={false}
          nativeTrigger
          onValueChange={setSelectValue2}
          placeholder="选择主题"
          value={selectValue2 ?? undefined}
        />
        <Text color="$color">当前主题：{selectValue2 ?? "未选择"}</Text>

        <View>
          <Label>Select Native</Label>
          <Select
            items={selectItems2}
            onValueChange={setSelectValue2}
            placeholder="选择主题"
            value={selectValue2 ?? undefined}
            native
          />
          <Select
            items={selectItems2}
            nativeTrigger
            onValueChange={setSelectValue2}
            placeholder="选择主题"
            value={selectValue2 ?? undefined}
            native
          />
          <Text color="$color">当前主题(原生)：{selectValue2 ?? "未选择"}</Text>
        </View>
      </ExampleBlock>

      <ExampleBlock title="Grouped示例">
        <Label>Select Grouped</Label>
        <Select
          native={false}
          itemGroups={selectSortGroups}
          onValueChange={setSelectGroupedValue}
          placeholder="选择排序方式"
          value={selectGroupedValue ?? undefined}
        />
        <Select
          native={false}
          nativeTrigger
          itemGroups={selectSortGroups}
          onValueChange={setSelectGroupedValue}
          placeholder="选择排序方式"
          value={selectGroupedValue ?? undefined}
        />
        <Text color="$color">当前排序：{selectGroupedValue ?? "未选择"}</Text>
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
    group: "输入与表单",
    key: "input",
    label: "Input",
  },
  {
    Component: TextAreaExample,
    group: "输入与表单",
    key: "text-area",
    label: "TextArea",
  },
  {
    Component: SelectExample,
    group: "输入与表单",
    key: "select",
    label: "Select",
  },
  {
    Component: RadioGroupExample,
    group: "输入与表单",
    key: "radio-group",
    label: "RadioGroup",
  },
  {
    Component: FormExample,
    group: "输入与表单",
    key: "form",
    label: "Form",
  },
  {
    Component: LabelExample,
    group: "输入与表单",
    key: "label",
    label: "Label",
  },
] satisfies ComponentExampleDefinition[];
