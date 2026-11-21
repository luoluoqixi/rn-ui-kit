import { useState } from "react";
import { RadioGroup, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function RadioGroupExample() {
  const [value, setValue] = useState("standard");
  const shipping = [
    {
      value: "standard",
      label: "标准配送",
      description: "预计 5–7 个工作日送达。",
    },
    {
      value: "express",
      label: "快速配送",
      description: "预计 2–3 个工作日送达。",
    },
  ];
  return (
    <ExampleStack>
      <ExampleSection title="配送方式">
        <RadioGroup
          accessibilityLabel="配送方式"
          items={shipping}
          value={value}
          onValueChange={setValue}
        />
        <Text color="muted">
          {value === "standard" ? "已选择标准配送" : "已选择快速配送"}
        </Text>
      </ExampleSection>
      <ExampleSection title="指示器在右侧">
        <RadioGroup
          accessibilityLabel="配送偏好"
          items={shipping}
          defaultValue="express"
          labelPosition="left"
        />
      </ExampleSection>
      <ExampleSection title="横向排列">
        <RadioGroup
          label="更新频率"
          orientation="horizontal"
          defaultValue="weekly"
          items={[
            { value: "daily", label: "每天" },
            { value: "weekly", label: "每周" },
            { value: "never", label: "关闭" },
          ]}
        />
      </ExampleSection>
      <ExampleSection title="状态">
        <RadioGroup
          label="存储位置"
          defaultValue="local"
          items={[
            { value: "local", label: "本地" },
            { value: "cloud", label: "云端（暂不可用）", isDisabled: true },
          ]}
        />
        <RadioGroup
          label="归档设置"
          items={shipping}
          defaultValue="standard"
          isDisabled
        />
        <RadioGroup
          label="服务方案"
          items={[
            { value: "free", label: "免费" },
            { value: "pro", label: "专业" },
          ]}
          isInvalid
          isRequired
          errorMessage="请选择一个服务方案。"
        />
      </ExampleSection>
    </ExampleStack>
  );
}
