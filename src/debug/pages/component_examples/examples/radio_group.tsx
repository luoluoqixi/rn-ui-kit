import { useState } from "react";
import { RadioGroup, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";

export function RadioGroupExample() {
  const [value, setValue] = useState("recent");
  const [valueSize, setValueSize] = useState("md");
  const onValueChange = (nextValue: string) => {
    setValue(nextValue);
  };
  const onValueSizeChange = (nextValue: string) => {
    setValueSize(nextValue);
  };

  return (
    <ExampleStack>
      <ExampleBlock title="排序规则">
        <RadioGroup
          items={[
            { value: "recent", label: "最近更新" },
            { value: "name", label: "名称" },
            { value: "size", label: "大小" },
          ]}
          onValueChange={onValueChange}
          value={value}
        />
        <Text className="text-muted-foreground">当前排序：{value}</Text>
      </ExampleBlock>
      <ExampleBlock title="大小">
        <RadioGroup
          size="xs"
          items={[{ value: "xs", label: "超小 Radio" }]}
          onValueChange={onValueSizeChange}
          value={valueSize}
        />
        <RadioGroup
          size="sm"
          items={[{ value: "sm", label: "小 Radio" }]}
          onValueChange={onValueSizeChange}
          value={valueSize}
        />
        <RadioGroup
          size="md"
          items={[{ value: "md", label: "默认 Radio" }]}
          onValueChange={onValueSizeChange}
          value={valueSize}
        />
        <RadioGroup
          size="lg"
          items={[{ value: "lg", label: "大 Radio" }]}
          onValueChange={onValueSizeChange}
          value={valueSize}
        />
        <RadioGroup
          size="xl"
          items={[{ value: "xl", label: "超大 Radio" }]}
          onValueChange={onValueSizeChange}
          value={valueSize}
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
